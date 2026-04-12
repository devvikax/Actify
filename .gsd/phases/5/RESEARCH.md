# Research: Phase 5 Support logic

## Procrastination Risk Model
We will implement a density-based risk model.
- **Formula**: `Risk Factor = (Remaining Planned Hours) / (Remaining Days * Daily Capacity)`.
- **Thresholds**:
  - `< 0.5`: Low (On track)
  - `0.5 - 0.8`: Warning (Tightening)
  - `> 0.8`: High (DANGER - Procrastination alert)

## Dynamic Rescheduling
Since our `useSchedule` hook is reactive:
- When the date changes or a task is missed, we don't need a complex "rebalancer" because `generateSchedule` always allocates *all* remaining work from "Day 0".
- Improvement: We should track "Completed Today" and compare it to "Planned Today". If at the end of the day, some planned hours weren't logged, we can show a summary of "Work carried over".

## Gemini API Strategy
- **Endpoints**: Use `gemini-1.5-flash` for speed and low-cost.
- **Data Shape**: Send the raw `tasks` array and the calculated `schedule`.
- **Prompt**: "Analyze this student's workload. Identify the biggest risk and provide one specific actionable tip for today."

## Animations
- **Library**: Framer Motion (already in package.json from Phase 1 or we'll add it).
- **Triggers**:
  - `LayoutGroup` for smooth task transitions.
  - `Confetti` for task completion (100% full task).
