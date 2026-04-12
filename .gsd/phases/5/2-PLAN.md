---
phase: 5
plan: 2
wave: 2
---

# Plan 5.2: Rescheduling & Gemini Insights

## Objective
Enhance the adaptive nature of the plan by showing carry-over work and integrating Gemini AI for student encouragement and planning advice.

## Context
- src/utils/planningEngine.js
- src/pages/TodayPlan.jsx
- src/hooks/useSchedule.js

## Tasks

<task type="auto">
  <name>Log Missed Progress Summary</name>
  <files>
    - src/pages/TodayPlan.jsx
  </files>
  <action>
    - Compare `plannedHours` for today vs `actualCompleted` hours using a simplified "Day 0" snapshot (or just rely on the fact that remaining hours shift).
    - Add a small "Carry-over" notice if tasks from yesterday weren't completed.
  </action>
  <verify>Manually shift a task deadline or progress and check if "Today" reflects the remaining total correctly.</verify>
  <done>User sees updated workload when tasks are missed.</done>
</task>

<task type="auto">
  <name>Integrate Gemini AI Insights</name>
  <files>
    - src/services/aiService.js (Create)
    - src/pages/Dashboard.jsx
  </files>
  <action>
    - Create `aiService.js` to wrap `@google/generative-ai`.
    - Implement `getPlanInsights(tasks, schedule)` to fetch a 1-sentence tip.
    - Add an "AI Coach" card to the Dashboard that displays this insight.
    - Provide a toggle in Settings to enable/disable AI (default ON).
  </action>
  <verify>Log into dashboard and see a personalized tip like "Your Math exam is high risk, try tackling it first thing today!".</verify>
  <done>Gemini insights displayed on Dashboard.</done>
</task>

## Success Criteria
- [ ] AI Service integrated with a working Google Generative AI key (from environment).
- [ ] Coaching tips appear on Dashboard based on current schedule.
