# Plan 5.1 Summary: Procrastination Risk implemented

## Changes
- **Planning Engine**: Added `calculateRiskFactor` utility.
- **TaskCard**: Added visual warning alerts for 'danger' and 'warning' risks.
- **Dashboard**: Added high-level risk alert banner and integrated risk calculation.
- **MyTasks**: Each task now displays its risk level.

## Verification
- Checked that tasks with deadlines < 1 day and duration > 4h (with cap 4) trigger 'danger'.
- Checked that completed tasks always show 'low' risk.
