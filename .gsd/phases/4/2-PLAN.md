---
phase: 4
plan: 2
wave: 2
---

# Plan 4.2: Day-wise Schedule Generator

## Objective
Implement the schedule generator that maps broken-down micro-tasks onto available days, strictly respecting the user's daily study hours capacity, and expose this logic to the frontend via a hook.

## Context
- .gsd/SPEC.md
- src/utils/planningEngine.js
- src/hooks/useSettings.js

## Tasks

<task type="auto">
  <name>Implement Schedule Generator Logic</name>
  <files>src/utils/planningEngine.js</files>
  <action>
    Add a `generateSchedule(tasks, dailyHours)` function to `planningEngine.js`.
    - It should collect all active tasks, run them through `breakdownTask`, and sort the resulting micro-tasks by their `calculatePriorityScore` in descending order.
    - It should allocate tasks day by day (Day 0 is today, Day 1 is tomorrow, etc.), ensuring the sum of `estimatedHours` allocated to any day does not exceed `dailyHours`.
    - Returns an array or object representing days and their allocated tasks.
  </action>
  <verify>node -e "import('./src/utils/planningEngine.js').then(m => { const res = m.generateSchedule([{id: '1', name: 'A', estimatedHours: 4, priority: 'High', difficulty: 'Hard', deadline: new Date(Date.now()+86400000).toISOString()}], 2); console.log(res[0].tasks.length === 1 && res[1].tasks.length === 1 ? 'PASS' : 'FAIL') })"</verify>
  <done>Scheduler correctly bins tasks into days respecting the daily capacity.</done>
</task>

<task type="auto">
  <name>Create useSchedule Hook</name>
  <files>src/hooks/useSchedule.js</files>
  <action>
    Create a new hook `useSchedule` that imports `useTasks` and `useSettings`.
    - It should automatically compute the schedule whenever tasks or settings change.
    - Expose `schedule` (the day-by-day mapping) and `todaysTasks` (tasks allocated to Day 0) to the consuming components.
  </action>
  <verify>cat src/hooks/useSchedule.js</verify>
  <done>Hook connects global state to the planning engine and reflects reactive schedule updates.</done>
</task>
