import { useState } from 'react';
import useTasks from '../hooks/useTasks';
import useSettings from '../hooks/useSettings';
import { useSchedule } from '../hooks/useSchedule';
import { Button } from '../components/ui';
import TaskCard from '../components/tasks/TaskCard';
import TaskFormModal from '../components/tasks/TaskFormModal';
import { calculateRiskFactor } from '../utils/planningEngine';
import { getMaxStudyHours } from '../services/aiPlanningService';
import './MyTasks.css';

export default function MyTasks() {
  const {
    tasks,
    loading,
    error,
    handleAddTask,
    handleUpdateTask,
    handleDeleteTask,
    handleCompleteTask,
    fetchTasks,
  } = useTasks();

  const { settings } = useSettings();
  const { aiPlan } = useSchedule();
  const dailyCapacity = Math.min(settings?.dailyStudyHours || 4, getMaxStudyHours());
  const effectiveCapacity = aiPlan?.adjustedDailyHours || dailyCapacity;

  // Build AI hours lookup
  const aiHoursMap = {};
  if (aiPlan?.taskAllocations) {
    aiPlan.taskAllocations.forEach(alloc => {
      const match = tasks.find(t => t.name === alloc.taskName);
      if (match) aiHoursMap[match.id] = alloc.adjustedHours;
    });
  }

  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showCompleted, setShowCompleted] = useState(false);
  const [saving, setSaving] = useState(false);

  // Split tasks
  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const completedTasks = tasks.filter((t) => t.status === 'completed');

  // Modal handlers
  const openCreate = () => {
    setEditingTask(null);
    setShowModal(true);
  };

  const openEdit = (task) => {
    setEditingTask(task);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTask(null);
  };

  const handleSubmit = async (taskData) => {
    setSaving(true);
    try {
      if (editingTask) {
        await handleUpdateTask(editingTask.id, taskData);
      } else {
        await handleAddTask(taskData);
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mytasks-page">
      {/* Header */}
      <div className="mytasks-header">
        <div>
          <h1 className="mytasks-title">📝 My Tasks</h1>
          <p className="mytasks-summary">
            {activeTasks.length} active · {completedTasks.length} completed
          </p>
        </div>
        <Button variant="primary" onClick={openCreate}>
          ➕ Add Task
        </Button>
      </div>

      {/* Error */}
      {error && (
        <div className="mytasks-error">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={fetchTasks}>
            Retry
          </Button>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="task-list">
          {[1, 2, 3].map((i) => (
            <div key={i} className="task-skeleton">
              <div className="skeleton-strip" />
              <div className="skeleton-body">
                <div className="skeleton-line skeleton-line--title" />
                <div className="skeleton-line skeleton-line--badges" />
                <div className="skeleton-line skeleton-line--info" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Tasks */}
      {!loading && (
        <section className="mytasks-section">
          <h2 className="section-title">🎯 Active Tasks</h2>

          {activeTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <h3>No tasks yet!</h3>
              <p>Add your first academic task to start planning your workload.</p>
              <Button variant="primary" onClick={openCreate}>
                ➕ Add Your First Task
              </Button>
            </div>
          ) : (
            <div className="task-list">
              {activeTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEdit}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                  risk={calculateRiskFactor(task, effectiveCapacity, aiHoursMap[task.id] || null)}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Completed Tasks */}
      {!loading && completedTasks.length > 0 && (
        <section className="mytasks-section">
          <button
            className="section-header-toggle"
            onClick={() => setShowCompleted(!showCompleted)}
          >
            <h2 className="section-title">
              ✅ Completed Tasks ({completedTasks.length})
            </h2>
            <span className={`chevron ${showCompleted ? 'chevron--open' : ''}`}>
              ▸
            </span>
          </button>

          {showCompleted && (
            <div className="task-list task-list--completed">
              {completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={openEdit}
                  onComplete={handleCompleteTask}
                  onDelete={handleDeleteTask}
                />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Modal */}
      <TaskFormModal
        isOpen={showModal}
        onClose={closeModal}
        onSubmit={handleSubmit}
        initialData={editingTask}
        loading={saving}
      />
    </div>
  );
}
