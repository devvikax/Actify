import Badge from '../ui/Badge';
import './TaskCard.css';

const TYPE_ICONS = {
  assignment: '📝',
  exam: '📖',
  project: '🔧',
  reading: '📚',
  other: '📌',
};

const PRIORITY_VARIANT = {
  high: 'danger',
  medium: 'warning',
  low: 'accent',
};

const DIFFICULTY_VARIANT = {
  hard: 'danger',
  medium: 'warning',
  easy: 'accent',
};

/**
 * Calculate days remaining until deadline.
 */
function getDaysUntil(deadlineStr) {
  const deadline = new Date(deadlineStr + 'T23:59:59');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = deadline - today;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/**
 * Get a human-readable countdown string.
 */
function getCountdownText(daysUntil) {
  if (daysUntil < 0) return `Overdue by ${Math.abs(daysUntil)} day${Math.abs(daysUntil) !== 1 ? 's' : ''}`;
  if (daysUntil === 0) return 'Due today!';
  if (daysUntil === 1) return 'Due tomorrow';
  return `Due in ${daysUntil} days`;
}

/**
 * Get urgency class for the countdown.
 */
function getUrgencyClass(daysUntil) {
  if (daysUntil < 0) return 'overdue';
  if (daysUntil <= 1) return 'critical';
  if (daysUntil <= 3) return 'soon';
  return 'comfortable';
}

export default function TaskCard({ task, onEdit, onComplete, onDelete, risk }) {
  const isCompleted = task.status === 'completed';
  const daysUntil = getDaysUntil(task.deadline);
  const countdownText = getCountdownText(daysUntil);
  const urgency = getUrgencyClass(daysUntil);
  const icon = TYPE_ICONS[task.type] || '📌';

  const riskWarning = risk === 'danger' ? (
    <div className="task-risk-alert task-risk-alert--danger">
      ⚠️ High Procrastination Risk
    </div>
  ) : risk === 'warning' ? (
    <div className="task-risk-alert task-risk-alert--warning">
      ⚡ Tight Schedule
    </div>
  ) : null;

  const handleDelete = () => {
    if (window.confirm(`Delete "${task.name}"? This cannot be undone.`)) {
      onDelete(task.id);
    }
  };

  return (
    <div className={`task-card ${isCompleted ? 'task-card--completed' : ''} task-card--priority-${task.priority}`}>
      {/* Priority strip */}
      <div className={`task-card-strip task-card-strip--${task.priority}`} />

      <div className="task-card-body">
        {/* Header row */}
        <div className="task-card-header">
          <h3 className={`task-card-name ${isCompleted ? 'task-card-name--done' : ''}`}>
            {isCompleted && <span className="task-card-check">✅ </span>}
            {task.name}
          </h3>
        </div>

        {riskWarning}

        {/* Meta badges */}
        <div className="task-card-meta">
          <Badge variant="primary" size="sm">
            {icon} {task.type.charAt(0).toUpperCase() + task.type.slice(1)}
          </Badge>

          <Badge variant={PRIORITY_VARIANT[task.priority]} size="sm">
            {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟡' : '🟢'}{' '}
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </Badge>

          <Badge variant={DIFFICULTY_VARIANT[task.difficulty]} size="sm">
            {task.difficulty === 'hard' ? '🔥' : task.difficulty === 'medium' ? '⚡' : '✨'}{' '}
            {task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
          </Badge>
        </div>

        {/* Deadline + hours */}
        <div className="task-card-info">
          <span className={`task-card-countdown task-card-countdown--${urgency}`}>
            📅 {countdownText}
          </span>
          <span className="task-card-hours">
            ⏱ {task.estimatedHours}h estimated
          </span>
        </div>

        {/* Notes preview */}
        {task.notes && (
          <p className="task-card-notes">
            💬 {task.notes.length > 80 ? task.notes.substring(0, 80) + '…' : task.notes}
          </p>
        )}

        {/* Actions */}
        <div className="task-card-actions">
          {!isCompleted && (
            <button
              className="task-action task-action--complete"
              onClick={() => onComplete(task.id)}
              title="Mark as completed"
            >
              ✅ Complete
            </button>
          )}
          <button
            className="task-action task-action--edit"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏️ Edit
          </button>
          <button
            className="task-action task-action--delete"
            onClick={handleDelete}
            title="Delete task"
          >
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>
  );
}
