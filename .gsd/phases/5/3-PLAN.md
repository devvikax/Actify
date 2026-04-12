---
phase: 5
plan: 3
wave: 3
---

# Plan 5.3: UI Polish & Animations

## Objective
Finalize the "Soft Brutalism" aesthetic with smooth transitions, completion celebrations, and a solid mobile experience.

## Context
- src/index.css
- src/App.jsx
- src/pages/Landing.jsx

## Tasks

<task type="auto">
  <name>Add Framer Motion Animations</name>
  <files>
    - src/components/layout/AppLayout.jsx
    - src/pages/Dashboard.jsx
    - src/pages/TodayPlan.jsx
  </files>
  <action>
    - Add `AnimatePresence` and `motion` components to page transitions.
    - Implement a "Pop" animation when a micro-task is completed.
    - Add a confetti effect (using `canvas-confetti`) when a major task (100% complete) is finished.
  </action>
  <verify>Complete a task and watch for visual feedback (celebration/animation).</verify>
  <done>App feels premium and responsive to user actions.</done>
</task>

<task type="auto">
  <name>Final Responsive Pass</name>
  <files>
    - src/index.css
    - src/components/layout/AppLayout.css
  </files>
  <action>
    - Audit all pages on mobile view (375px width).
    - Fix any overflow issues in the Dashboard grid.
    - Improve bottom navigation or sidebar behavior for small screens.
  </action>
  <verify>Use browser devtools to check mobile / tablet / desktop views.</verify>
  <done>App is perfectly usable on devices of all sizes.</done>
</task>

## Success Criteria
- [ ] Application has a "premium" feel with smooth motion.
- [ ] 0 layout breaks on mobile.
- [ ] Celebration effects on task completion.
