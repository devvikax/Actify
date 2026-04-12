import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import useSettings from '../hooks/useSettings';
import { useSchedule } from '../hooks/useSchedule';
import { Button, Badge } from '../components/ui';
import ProgressChart from '../components/dashboard/ProgressChart';
import { calculateRiskFactor } from '../utils/planningEngine';
import { getPlanInsights } from '../services/aiService';
import { getMaxStudyHours } from '../services/aiPlanningService';
import './Dashboard.css';

/**
 * Format today's date nicely (e.g. "Saturday, April 12, 2026")
 */
function getFormattedDate() {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get days until a deadline.
 */
function getDaysUntil(deadlineStr) {
  const deadline = new Date(deadlineStr + 'T23:59:59');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
}

const PRIORITY_VARIANT = {
  high: 'danger',
  medium: 'warning',
  low: 'accent',
};

export default function Dashboard() {
  const { user } = useAuth();
  const { tasks, loading: tasksLoading } = useTasks();
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  const { aiPlan, loading: scheduleLoading } = useSchedule(tasks, tasksLoading);
  const navigate = useNavigate();

  const [editingHours, setEditingHours] = useState(false);
  const [hoursInput, setHoursInput] = useState('');
  const [insight, setInsight] = useState('Analyzing your workload... 🧠');
  const [insightLoading, setInsightLoading] = useState(true);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Student';

  // Derived stats
  const dailyCapacity = Math.min(settings?.dailyStudyHours || 4, getMaxStudyHours());
  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  
  // Build AI hours lookup for risk assessment
  const aiHoursMap = {};
  if (aiPlan?.taskAllocations) {
    aiPlan.taskAllocations.forEach(alloc => {
      const match = tasks.find(t => t.name === alloc.taskName);
      if (match) aiHoursMap[match.id] = alloc.adjustedHours;
    });
  }

  // Use AI-adjusted daily capacity for risk calculations
  const effectiveCapacity = aiPlan?.adjustedDailyHours || dailyCapacity;

  // Calculate risks using AI-adjusted hours
  const tasksWithRisk = activeTasks.map(t => ({
    ...t,
    risk: calculateRiskFactor(t, effectiveCapacity, aiHoursMap[t.id] || null)
  }));

  const highRiskTasks = tasksWithRisk.filter(t => t.risk === 'danger');
  const dueSoonTasks = activeTasks.filter((t) => getDaysUntil(t.deadline) <= 3);
  const upcomingTasks = tasksWithRisk.slice(0, 5);

  const isLoading = tasksLoading || settingsLoading;

  // Fetch AI coaching insight (separate from the plan — this is just a text tip)
  useEffect(() => {
    if (!tasksLoading && !settingsLoading && tasks.length > 0) {
      const fetchCoachingTip = async () => {
        const text = await getPlanInsights(tasks, dailyCapacity);
        setInsight(text);
        setInsightLoading(false);
      };
      fetchCoachingTip();
    } else if (!tasksLoading && tasks.length === 0) {
      setInsight('Add some tasks to get AI planning insights! ✨');
      setInsightLoading(false);
    }
  }, [tasks, dailyCapacity, tasksLoading, settingsLoading]);

  // Inline edit for study hours
  const startEditHours = () => {
    setHoursInput(settings.dailyStudyHours?.toString() || '4');
    setEditingHours(true);
  };

  const saveHours = () => {
    const val = parseFloat(hoursInput);
    const maxHours = getMaxStudyHours();
    if (!isNaN(val) && val >= 0.5 && val <= maxHours) {
      updateSettings({ dailyStudyHours: val });
    }
    setEditingHours(false);
  };

  const handleHoursKeyDown = (e) => {
    if (e.key === 'Enter') saveHours();
    if (e.key === 'Escape') setEditingHours(false);
  };

  return (
    <div className="dashboard-page">
      {/* Welcome Banner */}
      <section className="dashboard-welcome">
        <h1 className="welcome-text">
          Welcome back, {displayName}! 🎯
        </h1>
        <p className="welcome-date">{getFormattedDate()}</p>

        {highRiskTasks.length > 0 && (
          <div className="dashboard-alert animate-shake">
            <span className="alert-icon">🔥</span>
            <div className="alert-content">
              <strong>Risk Alert:</strong> You have {highRiskTasks.length} task(s) at high procrastination risk. Increase your daily study hours or start now!
            </div>
          </div>
        )}

        <div className="dashboard-ai-card">
          <div className="ai-card-content">
            <span className="ai-icon">🤖</span>
            <div className="ai-text">
              <span className="ai-label">AI Planning Coach:</span>
              <p className={insightLoading ? 'pulse' : ''}>"{insight}"</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats and Progress Section */}
      <section className="dashboard-grid">
        <div className="stat-grid">
          <div className="stat-card stat-card--tasks">
            <div className="stat-icon">📋</div>
            <div className="stat-content">
              <span className="stat-number">{isLoading ? '—' : tasks.length}</span>
              <span className="stat-label">Total Tasks</span>
            </div>
          </div>

          <div className="stat-card stat-card--completed">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <span className="stat-number">{isLoading ? '—' : completedTasks.length}</span>
              <span className="stat-label">Completed</span>
            </div>
          </div>

          <div className="stat-card stat-card--due-soon">
            <div className="stat-icon">⏰</div>
            <div className="stat-content">
              <span className="stat-number">{isLoading ? '—' : dueSoonTasks.length}</span>
              <span className="stat-label">Due Soon</span>
            </div>
          </div>

          <div className="stat-card stat-card--hours" onClick={!editingHours ? startEditHours : undefined}>
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              {editingHours ? (
                <input
                  className="stat-hours-input"
                  type="number"
                  min="0.5"
                  max={getMaxStudyHours()}
                  step="0.5"
                  value={hoursInput}
                  onChange={(e) => setHoursInput(e.target.value)}
                  onBlur={saveHours}
                  onKeyDown={handleHoursKeyDown}
                  autoFocus
                />
              ) : (
                <span className="stat-number">
                  {isLoading ? '—' : dailyCapacity}h
                </span>
              )}
              <span className="stat-label">
                Study Hours / Day (max {getMaxStudyHours()}h)
                {!editingHours && <span className="stat-edit-hint"> ✏️</span>}
              </span>
            </div>
          </div>
        </div>

        {/* AI Study Planner Panel — Driven by useSchedule's AI plan */}
        {!scheduleLoading && aiPlan && (
          <div className="ai-plan-panel">
            <div className="ai-plan-header">
              <span className="ai-plan-icon">🤖</span>
              <div>
                <h3 className="ai-plan-title">AI Study Planner</h3>
                <p className="ai-plan-subtitle">
                  {aiPlan.overallTip || aiPlan.reasoning || 'Study plan auto-generated by AI based on your profile'}
                </p>
              </div>
            </div>

            {/* Student Strength Bar */}
            {aiPlan.studentStrength && (
              <div className="strength-indicator">
                <span className="strength-label">Student Strength:</span>
                <div className="strength-bar-track">
                  <div
                    className={`strength-bar-fill strength-bar--${aiPlan.studentStrength.label}`}
                    style={{ width: `${(aiPlan.studentStrength.score * 100).toFixed(0)}%` }}
                  />
                </div>
                <span className="strength-value">{(aiPlan.studentStrength.score * 100).toFixed(0)}%</span>
              </div>
            )}

            {/* AI-Adjusted Daily Hours vs User's Setting */}
            {aiPlan.adjustedDailyHours && (
              <div className="ai-adjusted-hours">
                <span>🧠 AI Recommended Daily Hours:</span>
                <strong className="ai-hours-value">{aiPlan.adjustedDailyHours}h</strong>
                {aiPlan.adjustedDailyHours !== dailyCapacity && (
                  <span className="ai-hours-diff">
                    (You set {dailyCapacity}h → AI adjusted to {aiPlan.adjustedDailyHours}h)
                  </span>
                )}
              </div>
            )}

            {/* Per-Subject AI Adjustments */}
            {aiPlan.taskAllocations && aiPlan.taskAllocations.length > 0 && (
              <div className="ai-task-alloc-list">
                <h4 className="ai-alloc-heading">📊 Per-Subject AI Adjustments</h4>
                {aiPlan.taskAllocations.map((alloc, idx) => (
                  <div key={idx} className="ai-alloc-item">
                    <div className="ai-alloc-name">
                      {alloc.taskName}
                      {alloc.subject && alloc.subject !== alloc.taskName && (
                        <span className="ai-alloc-subject"> — {alloc.subject}</span>
                      )}
                    </div>
                    <div className="ai-alloc-details">
                      <span className="ai-alloc-original">{alloc.originalHours}h est.</span>
                      <span className="ai-alloc-arrow">→</span>
                      <span className="ai-alloc-adjusted">{alloc.adjustedHours}h AI</span>
                      {alloc.dailyAllocation && (
                        <span className="ai-alloc-daily">({alloc.dailyAllocation}h/day)</span>
                      )}
                    </div>
                    {alloc.reasoning && (
                      <div className="ai-alloc-reason">💡 {alloc.reasoning}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {scheduleLoading && aiPlan === null && tasks.length > 0 && (
          <div className="ai-plan-panel ai-plan-loading">
            <div className="ai-plan-header">
              <span className="ai-plan-icon pulse">🤖</span>
              <div>
                <h3 className="ai-plan-title">AI is analyzing your tasks...</h3>
                <p className="ai-plan-subtitle">Evaluating your strength, proficiency per subject, and deadlines</p>
              </div>
            </div>
          </div>
        )}

        <div className="progress-section">
          <ProgressChart tasks={tasks} />
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <Button variant="primary" onClick={() => navigate('/tasks')}>
          ➕ Add New Task
        </Button>
        <Button variant="secondary" onClick={() => navigate('/today')}>
          📅 View Today's Plan
        </Button>
      </section>

      {/* Upcoming Deadlines */}
      <section className="upcoming-section">
        <div className="upcoming-header">
          <h2 className="upcoming-title">📆 Upcoming Deadlines</h2>
        </div>

        {isLoading ? (
          <div className="upcoming-loading">
            {[1, 2, 3].map((i) => (
              <div key={i} className="upcoming-skeleton">
                <div className="skeleton-line" style={{ width: '50%' }} />
                <div className="skeleton-line" style={{ width: '30%' }} />
              </div>
            ))}
          </div>
        ) : upcomingTasks.length === 0 ? (
          <div className="upcoming-empty">
            <p>No upcoming deadlines. You're all caught up! 🎉</p>
          </div>
        ) : (
          <div className="upcoming-list">
            {upcomingTasks.map((task) => {
              const daysUntil = getDaysUntil(task.deadline);
              const aiH = aiHoursMap[task.id];
              return (
                <div key={task.id} className="upcoming-item">
                  <div className="upcoming-item-info">
                    <span className="upcoming-item-name">{task.name}</span>
                    <span className="upcoming-item-date">
                      {new Date(task.deadline + 'T00:00:00').toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                      {daysUntil <= 0 && ' ⚠️'}
                      {aiH && ` · ${aiH}h AI-planned`}
                    </span>
                  </div>
                  <Badge variant={PRIORITY_VARIANT[task.priority]} size="sm">
                    {task.priority}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}

        {activeTasks.length > 5 && (
          <button className="upcoming-view-all" onClick={() => navigate('/tasks')}>
            View All Tasks →
          </button>
        )}
      </section>
    </div>
  );
}
