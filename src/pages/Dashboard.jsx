import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useTasks from '../hooks/useTasks';
import useSettings from '../hooks/useSettings';
import { Button, Badge } from '../components/ui';
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
  const navigate = useNavigate();

  const [editingHours, setEditingHours] = useState(false);
  const [hoursInput, setHoursInput] = useState('');

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Student';

  // Derived stats
  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');
  const dueSoonTasks = activeTasks.filter((t) => getDaysUntil(t.deadline) <= 3);
  const upcomingTasks = activeTasks.slice(0, 5);

  const isLoading = tasksLoading || settingsLoading;

  // Inline edit for study hours
  const startEditHours = () => {
    setHoursInput(settings.dailyStudyHours?.toString() || '4');
    setEditingHours(true);
  };

  const saveHours = () => {
    const val = parseFloat(hoursInput);
    if (!isNaN(val) && val >= 0.5 && val <= 24) {
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
      </section>

      {/* Stat Cards Grid */}
      <section className="stat-grid">
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
                max="24"
                step="0.5"
                value={hoursInput}
                onChange={(e) => setHoursInput(e.target.value)}
                onBlur={saveHours}
                onKeyDown={handleHoursKeyDown}
                autoFocus
              />
            ) : (
              <span className="stat-number">
                {isLoading ? '—' : settings.dailyStudyHours}h
              </span>
            )}
            <span className="stat-label">
              Study Hours / Day
              {!editingHours && <span className="stat-edit-hint"> ✏️</span>}
            </span>
          </div>
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
