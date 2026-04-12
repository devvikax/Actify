---
phase: 4
plan: 3
wave: 3
---

# Plan 4.3: Today's Plan & Progress Dashboard UI

## Objective
Implement the execution view ("Today's Plan") where users can see and complete their AI-scheduled micro-tasks. Update the global Dashboard to visualize overall completion progress.

## Context
- .gsd/SPEC.md
- src/hooks/useSchedule.js
- src/pages/Dashboard.jsx
- src/components/tasks/TaskCard.jsx

## Tasks

<task type="auto">
  <name>Implement Today's Plan View</name>
  <files>src/pages/TodaysPlan.jsx, src/pages/TodaysPlan.css, src/App.jsx</files>
  <action>
    - Create `TodaysPlan.jsx` and add it to the routing in `App.jsx` (e.g. `/today`). Add navigation link in Navbar/Sidebar.
    - Use `useSchedule` to fetch `todaysTasks`.
    - Display tasks using `TaskCard`.
    - Allow users to mark a micro-task as completed. Marking a micro-task complete should either update its parent task's progress in Firestore or just toggle a local completion array for the day (to keep it client-side without overloading DB, or update a subfield on the main task if preferred). Note: keeping it simple by updating a `completedHours` or `status` on the parent task in `taskService` is best.
    - Implement Soft Brutalism styling (animations for completing tasks).
  </action>
  <verify>grep_search -q 'TodaysPlan' src/App.jsx</verify>
  <done>Today's Plan route displays the daily AI-scheduled tasks and supports completion interactions.</done>
</task>

<task type="auto">
  <name>Build Progress Chart & Dashboard Integration</name>
  <files>src/components/dashboard/ProgressChart.jsx, src/pages/Dashboard.jsx</files>
  <action>
    - Create `ProgressChart.jsx` using `recharts` to render a minimalist, softly brutalist Donut chart or Bar chart showing tasks completed vs active workload.
    - Integrate it into `Dashboard.jsx`.
    - Calculate global completion percentage from `useTasks` (e.g., ratio of completed tasks or completed hours vs total).
  </action>
  <verify>grep_search -q 'ProgressChart' src/pages/Dashboard.jsx</verify>
  <done>Dashboard renders a visual progress chart reflecting actual task state.</done>
</task>
