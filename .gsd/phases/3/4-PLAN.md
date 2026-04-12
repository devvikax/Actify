---
phase: 3
plan: 4
wave: 2
---

# Plan 3.4: Daily Study Hours & Dashboard Quick Stats

## Objective
Add the daily study hours configuration (stored per user in Firestore) and wire the Dashboard page with task summary stats. This completes the Phase 3 deliverables.

## Context
- src/config/firebase.js — exports `db`
- src/context/AuthContext.jsx — provides `user`
- src/hooks/useTasks.js — provides `tasks` array
- src/pages/Dashboard.jsx — current stub, needs replacement
- src/styles/design-tokens.css — design tokens

## Tasks

<task type="auto">
  <name>Create user settings service + study hours config</name>
  <files>src/services/settingsService.js, src/hooks/useSettings.js</files>
  <action>
    1. Create `src/services/settingsService.js`:
       - Data model for `users/{uid}` document:
         ```
         {
           dailyStudyHours: number (default 4),
           updatedAt: serverTimestamp()
         }
         ```
       - `getUserSettings(uid)` — getDoc, return data or defaults
       - `updateUserSettings(uid, settings)` — setDoc with merge:true

    2. Create `src/hooks/useSettings.js`:
       - Uses `useAuth()` for uid
       - State: `settings` (object), `loading` (boolean)
       - Fetches on mount
       - `updateSettings(newSettings)` — calls service, updates local state
       - Returns: `{ settings, loading, updateSettings }`
  </action>
  <verify>npm run build</verify>
  <done>settingsService.js and useSettings.js exist. Build succeeds.</done>
</task>

<task type="auto">
  <name>Build Dashboard page with task summary</name>
  <files>src/pages/Dashboard.jsx, src/pages/Dashboard.css</files>
  <action>
    Replace `src/pages/Dashboard.jsx` stub with a functional dashboard:

    1. **Hooks**: Use `useTasks()` and `useSettings()` for data

    2. **Welcome banner**:
       - "Welcome back, {displayName}! 🎯"
       - Subtitle: current date formatted nicely (e.g. "Saturday, April 12, 2026")

    3. **Stat cards row** (4 cards in a grid):
       - 📋 Total Tasks: count of all tasks
       - ✅ Completed: count of completed tasks
       - ⏰ Due Soon: count of tasks due within 3 days
       - 📚 Study Hours: dailyStudyHours per day setting (editable inline — click to show a small input, save on blur/enter)

    4. **Quick actions row**:
       - "Add New Task" button → navigates to /tasks (or opens modal inline)
       - "View Today's Plan" → navigates to /today

    5. **Upcoming deadlines** (mini list):
       - Show next 5 tasks sorted by deadline
       - Each: task name, deadline date, priority badge
       - "View All Tasks →" link to /tasks

    6. **CSS** (`Dashboard.css`):
       - `.dashboard-page`: flex column, gap
       - `.dashboard-welcome`: large text with subtitle
       - `.stat-grid`: CSS grid, 4 columns on desktop, 2 on tablet, 1 on mobile
       - `.stat-card`: Soft Brutalism card with large number + label + icon
       - `.quick-actions`: flex row, gap
       - `.upcoming-list`: card with list items
       - Each stat card has a unique accent color (pastel from tokens)
  </action>
  <verify>npm run build</verify>
  <done>Dashboard shows welcome banner, 4 stat cards, quick actions, upcoming deadlines. Study hours editable. Build succeeds.</done>
</task>

## Success Criteria
- [ ] User settings (daily study hours) persist to Firestore
- [ ] Dashboard shows task counts (total, completed, due soon)
- [ ] Study hours are editable inline on dashboard
- [ ] Upcoming deadlines list shows next 5 tasks
- [ ] Quick action buttons navigate correctly
- [ ] Build succeeds
