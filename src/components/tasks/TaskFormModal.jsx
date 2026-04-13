import { useState, useEffect } from 'react';
import { Button, Input, Select } from '../ui';
import { Textarea } from '../ui/Input';
import './TaskFormModal.css';

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: '🌱 Beginner — Just started' },
  { value: 'intermediate', label: '📘 Intermediate — Some grasp' },
  { value: 'advanced', label: '🎯 Advanced — Good command' },
  { value: 'expert', label: '🏆 Expert — Full mastery' },
];

const TASK_TYPES = [
  { value: 'assignment', label: '📝 Assignment' },
  { value: 'exam', label: '📖 Exam' },
  { value: 'project', label: '🔧 Project' },
  { value: 'reading', label: '📚 Reading' },
  { value: 'other', label: '📌 Other' },
];

const PRIORITIES = [
  { value: 'high', label: '🔴 High' },
  { value: 'medium', label: '🟡 Medium' },
  { value: 'low', label: '🟢 Low' },
];

const DIFFICULTIES = [
  { value: 'hard', label: '🔥 Hard' },
  { value: 'medium', label: '⚡ Medium' },
  { value: 'easy', label: '✨ Easy' },
];

/**
 * Get today's date as an ISO string (YYYY-MM-DD)
 */
function getTodayISO() {
  return new Date().toISOString().split('T')[0];
}

export default function TaskFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  loading = false,
}) {
  const isEdit = !!initialData;

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('assignment');
  const [deadline, setDeadline] = useState('');
  const [priority, setPriority] = useState('medium');
  const [difficulty, setDifficulty] = useState('medium');
  const [proficiencyLevel, setProficiencyLevel] = useState('intermediate');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Pre-fill for edit mode
  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setSubject(initialData.subject || '');
      setType(initialData.type || 'assignment');
      setDeadline(initialData.deadline || '');
      setPriority(initialData.priority || 'medium');
      setDifficulty(initialData.difficulty || 'medium');
      setProficiencyLevel(initialData.proficiencyLevel || 'intermediate');
      setEstimatedHours(initialData.estimatedHours?.toString() || '');
      setNotes(initialData.notes || '');
    } else {
      // Reset for create mode
      setName('');
      setSubject('');
      setType('assignment');
      setDeadline('');
      setPriority('medium');
      setDifficulty('medium');
      setProficiencyLevel('intermediate');
      setEstimatedHours('');
      setNotes('');
    }
    setFormError('');
  }, [initialData, isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!name.trim()) {
      setFormError('Task name is required.');
      return;
    }
    if (!deadline) {
      setFormError('Deadline is required.');
      return;
    }
    if (!estimatedHours || parseFloat(estimatedHours) < 0.5) {
      setFormError('Estimated hours must be at least 0.5.');
      return;
    }

    try {
      await onSubmit({
        name: name.trim(),
        subject: subject.trim() || name.trim(),
        type,
        deadline,
        priority,
        difficulty,
        proficiencyLevel,
        estimatedHours: parseFloat(estimatedHours),
        notes: notes.trim(),
      });
      onClose();
    } catch {
      setFormError('Failed to save task. Please try again.');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isEdit ? '✏️ Edit Task' : '➕ Add New Task'}
          </h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {/* Error */}
        {formError && <div className="modal-error">{formError}</div>}

        {/* Form */}
        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="modal-form-grid">
            <div className="full-width">
              <Input
                id="task-name"
                label="Task Name"
                placeholder="e.g., CS101 Final Assignment"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            <div className="full-width">
              <Input
                id="task-subject"
                label="Subject / Course Name"
                placeholder="e.g., Computer Science, Mathematics"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
              />
            </div>

            <Select
              id="task-type"
              label="Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              options={TASK_TYPES}
              required
              disabled={loading}
            />

            <Input
              id="task-deadline"
              label="Deadline"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={getTodayISO()}
              required
              disabled={loading}
            />

            <Select
              id="task-priority"
              label="Priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              options={PRIORITIES}
              required
              disabled={loading}
            />

            <Select
              id="task-difficulty"
              label="Difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              options={DIFFICULTIES}
              required
              disabled={loading}
            />

            <Select
              id="task-proficiency"
              label="Your Command Level"
              value={proficiencyLevel}
              onChange={(e) => setProficiencyLevel(e.target.value)}
              options={PROFICIENCY_LEVELS}
              required
              disabled={loading}
            />

            <Input
              id="task-hours"
              label="Estimated Hours"
              type="number"
              placeholder="e.g., 8"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              min="0.5"
              max="100"
              step="0.5"
              required
              disabled={loading}
            />

            <div className="full-width">
              <Textarea
                id="task-notes"
                label="Notes (optional)"
                placeholder="Any additional notes about this task..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
                disabled={loading}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              {loading
                ? 'Saving...'
                : isEdit
                  ? 'Save Changes'
                  : 'Add Task →'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
