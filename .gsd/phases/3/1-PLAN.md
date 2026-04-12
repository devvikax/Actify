---
phase: 3
plan: 1
wave: 1
---

# Plan 3.1: Firestore Task Service & Task Data Model

## Objective
Create the Firestore service layer for task CRUD operations and the data model. This provides the foundation all UI components consume. Tasks are stored per-user under `users/{uid}/tasks/{taskId}`.

## Context
- src/config/firebase.js — exports `db` (Firestore instance) and `auth`
- src/context/AuthContext.jsx — provides `user` via `useAuth()`
- .gsd/SPEC.md — REQ-03 (task input), REQ-04 (task types), REQ-05 (deadline/priority/difficulty)

## Tasks

<task type="auto">
  <name>Create Firestore task service</name>
  <files>src/services/taskService.js</files>
  <action>
    Create `src/services/taskService.js` with Firestore CRUD operations:

    1. **Data Model** (each task document):
       ```
       {
         id: string (auto-generated),
         name: string,
         type: 'assignment' | 'exam' | 'project' | 'reading' | 'other',
         deadline: string (ISO date, e.g. '2026-04-20'),
         priority: 'high' | 'medium' | 'low',
         difficulty: 'hard' | 'medium' | 'easy',
         estimatedHours: number (0.5 - 100),
         completedHours: number (default 0),
         status: 'pending' | 'in-progress' | 'completed',
         notes: string (optional),
         createdAt: serverTimestamp(),
         updatedAt: serverTimestamp()
       }
       ```

    2. **Collection path**: `users/{uid}/tasks`

    3. **Functions** (all take `uid` as first param):
       - `addTask(uid, taskData)` — adds document, returns the new doc ref
       - `updateTask(uid, taskId, updates)` — partial update with `updatedAt: serverTimestamp()`
       - `deleteTask(uid, taskId)` — deletes document
       - `getUserTasks(uid)` — returns query snapshot of all tasks, ordered by `deadline` ascending
       - `completeTask(uid, taskId)` — sets `status: 'completed'`, `completedHours: estimatedHours`

    4. Use Firestore imports: `collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, orderBy, serverTimestamp`
    5. Import `db` from `../config/firebase`
  </action>
  <verify>npm run build</verify>
  <done>taskService.js exports addTask, updateTask, deleteTask, getUserTasks, completeTask. Build succeeds.</done>
</task>

<task type="auto">
  <name>Create useTasks custom hook</name>
  <files>src/hooks/useTasks.js</files>
  <action>
    Create `src/hooks/useTasks.js` — a React hook that manages task state:

    1. Uses `useAuth()` to get `user.uid`
    2. State: `tasks` (array), `loading` (boolean), `error` (string|null)
    3. `fetchTasks()` — calls `getUserTasks(uid)`, maps snapshot docs to `{ id: doc.id, ...doc.data() }` array, sorts by deadline
    4. `useEffect` — calls `fetchTasks()` when `user` changes
    5. Action wrappers (all call `fetchTasks()` after success):
       - `handleAddTask(taskData)` — calls `addTask(uid, taskData)`, then refreshes
       - `handleUpdateTask(taskId, updates)` — calls `updateTask`, refreshes
       - `handleDeleteTask(taskId)` — calls `deleteTask`, refreshes
       - `handleCompleteTask(taskId)` — calls `completeTask`, refreshes
    6. Returns: `{ tasks, loading, error, handleAddTask, handleUpdateTask, handleDeleteTask, handleCompleteTask, fetchTasks }`
    7. Error handling: wrap all calls in try/catch, set `error` state with message
  </action>
  <verify>npm run build</verify>
  <done>useTasks.js exports the hook with all action wrappers. Build succeeds.</done>
</task>

## Success Criteria
- [ ] `src/services/taskService.js` has 5 CRUD functions using Firestore
- [ ] `src/hooks/useTasks.js` provides reactive task state
- [ ] Both handle errors gracefully
- [ ] Build succeeds
