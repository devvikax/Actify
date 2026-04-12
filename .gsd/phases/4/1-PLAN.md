---
phase: 4
plan: 1
wave: 1
---

# Plan 4.1: Planning Engine Core (Scoring & Breakdown)

## Objective
Implement the pure rule-based logic to calculate dynamic priority scores and break large tasks down into actionable micro-tasks. This serves as the foundation for the AI schedule generation without relying on external API keys.

## Context
- .gsd/SPEC.md
- src/services/taskService.js (task data structure)

## Tasks

<task type="auto">
  <name>Create Planning Engine Utilities</name>
  <files>src/utils/planningEngine.js</files>
  <action>
    Create a new utility module that exports pure functions for task processing:
    1. `calculatePriorityScore(task)`: Computes a numeric score. The score should increase as the deadline approaches (urgency), and factor in the user-assigned `priority` ('High', 'Medium', 'Low') and `difficulty` ('Hard', 'Medium', 'Easy'). For instance, `score = (priority_weight) * (difficulty_weight) / (days_until_deadline || 1)`.
    2. `breakdownTask(task)`: If a task has `estimatedHours` > 2, break it down into smaller micro-tasks (e.g., a 5-hour task becomes two 2-hour subtasks and one 1-hour subtask). Each subtask should retain a reference to its parent. 
    Ensure all functions are pure and well-documented.
  </action>
  <verify>node -e "import('./src/utils/planningEngine.js').then(m => { const t = { name: 'Test', priority: 'High', difficulty: 'Hard', estimatedHours: 5, deadline: new Date(Date.now() + 86400000).toISOString() }; console.log(m.calculatePriorityScore(t)); console.log(m.breakdownTask(t).length === 3 ? 'PASS' : 'FAIL') })"</verify>
  <done>Pure functions return accurate priority scores and split tasks correctly without errors.</done>
</task>
