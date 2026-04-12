---
phase: 3
plan: 3
wave: 2
---

# Plan 3.3: Task Cards & MyTasks Page

## Objective
Build the TaskCard component and wire the full MyTasks page — displaying all user tasks with priority indicators, deadline countdowns, difficulty badges, and actions (edit, complete, delete). Includes the "completed tasks" section.

## Context
- src/pages/MyTasks.jsx — current stub, needs full replacement
- src/hooks/useTasks.js — provides tasks, loading, handleAddTask, handleUpdateTask, handleDeleteTask, handleCompleteTask (Plan 3.1)
- src/components/tasks/TaskFormModal.jsx — modal for create/edit (Plan 3.2)
- src/components/ui/index.js — Card, Badge, Button, ProgressBar
- src/styles/design-tokens.css — design tokens

## Tasks

<task type="auto">
  <name>Create TaskCard component</name>
  <files>src/components/tasks/TaskCard.jsx, src/components/tasks/TaskCard.css</files>
  <action>
    Create `src/components/tasks/TaskCard.jsx`:

    1. **Props**: `task`, `onEdit`, `onComplete`, `onDelete`

    2. **Display elements**:
       - Left color strip based on priority: high=danger, medium=warning, low=success (using design token colors)
       - Task name (bold heading)
       - Type badge using `<Badge>` (e.g. "📝 Assignment", "📖 Exam")
       - Deadline with countdown: "Due in X days" or "Overdue by X days" (calc from today)
       - Priority badge: high=red, medium=yellow, low=green
       - Difficulty badge: hard=red, medium=yellow, easy=green
       - Estimated hours display: "⏱ X hours"
       - Notes preview (if exists, truncated to 80 chars)

    3. **Actions** (row at bottom):
       - ✅ Complete button (calls onComplete, hidden if already completed)
       - ✏️ Edit button (calls onEdit)
       - 🗑️ Delete button (calls onDelete, with confirm dialog)

    4. **Completed state**: if `task.status === 'completed'`, show with reduced opacity, strikethrough on name, green checkmark

    5. **CSS** (`TaskCard.css`):
       - `.task-card`: Soft Brutalism card, flex row, border-left 5px solid {priority color}
       - `.task-card-body`: flex column, gap for content
       - `.task-card-meta`: flex wrap for badges/countdown
       - `.task-card-actions`: flex row, gap, margin-top auto
       - `.task-card.completed`: opacity 0.6, background slightly different
       - Hover: subtle lift + shadow increase
       - Responsive: stack vertically on mobile
  </action>
  <verify>npm run build</verify>
  <done>TaskCard.jsx renders with all display elements and action buttons. CSS exists. Build succeeds.</done>
</task>

<task type="auto">
  <name>Build full MyTasks page</name>
  <files>src/pages/MyTasks.jsx, src/pages/MyTasks.css</files>
  <action>
    Replace `src/pages/MyTasks.jsx` stub with the complete task management page:

    1. **Hook integration**: Use `useTasks()` for all task operations
    2. **Modal state**: `showModal` boolean, `editingTask` (null or task object)

    3. **Header section**:
       - Page title "📝 My Tasks"
       - Task count summary: "X active · Y completed"
       - "Add Task" button (opens modal in create mode)

    4. **Active tasks section**:
       - Header: "Active Tasks"
       - If no active tasks: empty state card ("No tasks yet! Add your first academic task to get started.")
       - List of TaskCards for tasks where status !== 'completed'
       - Sorted by deadline (soonest first)

    5. **Completed tasks section** (collapsible):
       - Header: "Completed Tasks" with count + toggle chevron
       - Collapsed by default (useState toggle)
       - List of TaskCards for completed tasks
       - If none: "No completed tasks yet"

    6. **Loading state**: Show pulsing placeholder cards while `loading` is true
    7. **Error state**: Show error message with retry button

    8. **Modal wiring**:
       - "Add Task" → opens modal with `initialData=null`
       - Edit button on card → opens modal with `initialData=task`
       - Modal onSubmit: if editing, call `handleUpdateTask(task.id, data)`, else `handleAddTask(data)`

    9. **CSS** (`MyTasks.css`):
       - `.mytasks-page`: flex column, gap, padding
       - `.mytasks-header`: flex between, items center
       - `.mytasks-summary`: text-muted stat line
       - `.task-list`: flex column, gap
       - `.section-header`: flex with toggle chevron for completed section
       - `.empty-state`: centered card with illustration placeholder + call to action
       - `.loading-skeleton`: pulsing placeholder cards
  </action>
  <verify>npm run build</verify>
  <done>MyTasks.jsx shows active tasks, completed section (collapsible), add/edit/delete/complete flows. CSS exists. Build succeeds.</done>
</task>

## Success Criteria
- [ ] TaskCard shows priority strip, badges, deadline countdown, action buttons
- [ ] MyTasks page displays active and completed tasks separately
- [ ] "Add Task" opens modal in create mode
- [ ] Edit button opens modal pre-filled with task data
- [ ] Complete button marks task as completed
- [ ] Delete button removes task (with confirm)
- [ ] Completed section is collapsible
- [ ] Empty state shown when no tasks
- [ ] Loading skeleton while data loads
- [ ] Build succeeds
