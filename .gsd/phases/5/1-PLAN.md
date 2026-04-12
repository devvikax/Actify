---
phase: 5
plan: 1
wave: 1
---

# Plan 5.1: Risk Logic & Alerts

## Objective
Implement a density-based procrastination risk detection system and display visual warnings in the Dashboard and Task views.

## Context
- .gsd/SPEC.md
- src/utils/planningEngine.js
- src/pages/Dashboard.jsx

## Tasks

<task type="auto">
  <name>Implement Procrastination Risk Logic</name>
  <files>
    - src/utils/planningEngine.js
  </files>
  <action>
    - Add `calculateRiskFactor(task, dailyCapacity)` function.
    - Logic: Use the formula `risk = (hoursRemaining) / (daysRemaining * dailyCapacity)`.
    - Handle edge cases (daysRemaining = 0).
    - Return a risk level: 'low', 'warning', 'danger'.
  </action>
  <verify>Run a node script to test different tasks and verify risk levels match thresholds (0.5 and 0.8).</verify>
  <done>Risk level correctly returned for various task scenarios.</done>
</task>

<task type="auto">
  <name>Display Risk Alerts in UI</name>
  <files>
    - src/pages/Dashboard.jsx
    - src/components/tasks/TaskCard.jsx
  </files>
  <action>
    - Integrate `calculateRiskFactor` into task processing on the Dashboard and Task list.
    - Add a "High Risk" badge/icon to tasks with 'danger' status.
    - Add a summary alert to the Dashboard if any active task is 'danger'.
  </action>
  <verify>View Dashboard in browser; tasks with short deadlines and long durations should show "RISK" alert.</verify>
  <done>Visual risk indicators appear on overloaded tasks.</done>
</task>

## Success Criteria
- [ ] Risk factor calculation integrated into planning engine.
- [ ] Dashboard shows active "Procrastination Danger" alert when workload exceeds capacity.
