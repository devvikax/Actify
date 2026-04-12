---
phase: 2
plan: 1
wave: 1
---

# Plan 2.1: AuthContext & Firebase Auth Service

## Objective
Create the authentication context provider and Firebase auth service layer. This provides the reactive auth state (`user`, `loading`) and auth methods (`signup`, `login`, `logout`) that all other components consume. Must be wired into `App.jsx` before any protected routes work.

## Context
- src/config/firebase.js — Already exports `auth` (Firebase Auth instance) and `db` (Firestore)
- src/App.jsx — Current router, needs `<AuthProvider>` wrapper
- .gsd/SPEC.md — REQ-01 (auth), REQ-02 (persistent sessions)

## Tasks

<task type="auto">
  <name>Create AuthContext provider</name>
  <files>src/context/AuthContext.jsx</files>
  <action>
    Create `src/context/AuthContext.jsx` with:

    1. `AuthContext` via `createContext()`
    2. `useAuth()` custom hook that throws if used outside provider
    3. `AuthProvider` component:
       - State: `user` (null | Firebase User), `loading` (boolean)
       - Uses `onAuthStateChanged(auth, ...)` in `useEffect` to track auth state
       - Sets `loading = true` initially, `false` once first auth check completes
       - Provides `signup(email, password)` — calls `createUserWithEmailAndPassword`
       - Provides `login(email, password)` — calls `signInWithEmailAndPassword`
       - Provides `logout()` — calls `signOut`
       - All methods return the Firebase promise (caller handles errors)
       - `value` object: `{ user, loading, signup, login, logout }`
    4. Import `auth` from `../config/firebase`
    5. Import Firebase auth functions from `firebase/auth`

    Do NOT add error toasts or redirects inside the context — those belong in the page components.
  </action>
  <verify>npm run build</verify>
  <done>AuthContext.jsx exists, exports AuthProvider and useAuth, build succeeds</done>
</task>

<task type="auto">
  <name>Wrap App with AuthProvider</name>
  <files>src/App.jsx</files>
  <action>
    1. Import `AuthProvider` from `./context/AuthContext`
    2. Wrap the `<BrowserRouter>` with `<AuthProvider>` so all routes have access to auth state
    3. Do NOT change any routes yet — protected routes come in Plan 2.3
  </action>
  <verify>npm run build</verify>
  <done>App.jsx imports and wraps with AuthProvider, build succeeds</done>
</task>

## Success Criteria
- [ ] `src/context/AuthContext.jsx` exists with AuthProvider and useAuth hook
- [ ] `useAuth()` exposes `{ user, loading, signup, login, logout }`
- [ ] App.jsx wraps all routes in `<AuthProvider>`
- [ ] Build succeeds with zero errors
