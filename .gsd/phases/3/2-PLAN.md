---
phase: 3
plan: 2
wave: 1
---

# Plan 3.2: Task Creation Form & Modal

## Objective
Build the "Add Task" form UI — a modal dialog where users input task details (name, type, deadline, priority, difficulty, estimated hours, notes). Uses the existing UI primitives (Input, Select, Button, Card) and Soft Brutalism styling.

## Context
- src/components/ui/index.js — Button, Card, Input, Textarea, Select, Badge
- src/hooks/useTasks.js — handleAddTask (from Plan 3.1)
- Input.jsx API: label, type, placeholder, value, onChange, required, icon, min, max, step
- Select.jsx API: label, value, onChange, options=[{value, label}], placeholder, required
- src/styles/design-tokens.css — design tokens

## Tasks

<task type="auto">
  <name>Create TaskFormModal component</name>
  <files>src/components/tasks/TaskFormModal.jsx, src/components/tasks/TaskFormModal.css</files>
  <action>
    Create the task creation/edit modal:

    1. **Props**: `isOpen`, `onClose`, `onSubmit`, `initialData` (null for create, task object for edit), `loading`

    2. **Form state** (useState for each):
       - `name` — text (required)
       - `type` — select: assignment, exam, project, reading, other
       - `deadline` — date input (required, min = today)
       - `priority` — select: high, medium, low
       - `difficulty` — select: hard, medium, easy
       - `estimatedHours` — number input (required, min=0.5, max=100, step=0.5)
       - `notes` — textarea (optional)

    3. **Edit mode**: if `initialData` is provided, pre-fill all fields from it

    4. **Submit handler**:
       - Validate all required fields
       - Call `onSubmit({ name, type, deadline, priority, difficulty, estimatedHours, notes })`
       - `onClose()` on success

    5. **Modal UI**:
       - Backdrop overlay (dark semi-transparent) with click-to-close
       - Centered card with Soft Brutalism styling
       - Header: "Add New Task" or "Edit Task" based on mode
       - Close X button in header
       - Form body with all fields in a clean 2-column grid (name+type row, deadline+priority row, difficulty+hours row, notes full-width)
       - Footer: Cancel + Submit buttons
       - Escape key closes modal

    6. **CSS** (`TaskFormModal.css`):
       - `.modal-overlay`: fixed, full viewport, z-index 1000, dark backdrop, centered flex
       - `.modal-card`: max-width 560px, Soft Brutalism card, padding, overflow-y auto, max-height 90vh
       - `.modal-header`: flex between, title + close button
       - `.modal-form-grid`: CSS grid, 2 columns on desktop, 1 column on mobile
       - `.modal-form-grid .full-width`: grid-column: 1 / -1
       - `.modal-footer`: flex, gap, justify-end
       - Animation: fadeIn for overlay, slideUp for card
  </action>
  <verify>npm run build</verify>
  <done>TaskFormModal renders a modal with all 7 fields, validates, calls onSubmit. CSS exists with responsive grid. Build succeeds.</done>
</task>

## Success Criteria
- [ ] TaskFormModal.jsx renders with all 7 task fields
- [ ] Edit mode pre-fills from initialData
- [ ] Form validates required fields before submit
- [ ] Modal has backdrop overlay, close-on-Escape, close-on-backdrop-click
- [ ] Responsive: 2-column grid on desktop, 1-column on mobile
- [ ] Build succeeds
