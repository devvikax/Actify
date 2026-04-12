---
phase: 2
plan: 3
wave: 2
---

# Plan 2.3: Protected Routes & User Profile Integration

## Objective
Gate all app routes behind authentication. Unauthenticated users are redirected to `/login`. Wire real user data into the Sidebar and Navbar (display name, email). Implement working logout.

## Context
- src/App.jsx — Routes to protect: /dashboard, /tasks, /today, /progress
- src/context/AuthContext.jsx — Provides `user`, `loading`, `logout`
- src/components/layout/Sidebar.jsx — Has hardcoded "Student" and "user@email.com"
- src/components/layout/Navbar.jsx — Has hardcoded "Hello, Student 👋"
- src/pages/Login.jsx — Redirect target for unauthenticated users

## Tasks

<task type="auto">
  <name>Create ProtectedRoute wrapper</name>
  <files>src/components/ProtectedRoute.jsx, src/App.jsx</files>
  <action>
    1. Create `src/components/ProtectedRoute.jsx`:
       - Import `useAuth` from context
       - Import `Navigate` from react-router-dom
       - If `loading` is true: render a centered loading spinner/placeholder (a simple div with "Loading..." text styled with the design tokens, or a subtle spinner animation)
       - If `user` is null (not authenticated): render `<Navigate to="/login" replace />`
       - Otherwise: render `<Outlet />` (children routes)

    2. Update `src/App.jsx`:
       - Import `ProtectedRoute`
       - Wrap the app routes group with `ProtectedRoute`:
         ```jsx
         <Route element={<ProtectedRoute />}>
           <Route element={<AppLayout />}>
             <Route path="/dashboard" ... />
             <Route path="/tasks" ... />
             ...
           </Route>
         </Route>
         ```
       - Also: if user IS authenticated and visits `/login` or `/signup`, redirect them to `/dashboard` (add redirect logic in Login/Signup pages OR add a `PublicRoute` wrapper — prefer the simpler approach of checking in the page components)
  </action>
  <verify>npm run build</verify>
  <done>ProtectedRoute.jsx exists. App.jsx wraps app routes with ProtectedRoute. Unauthenticated access to /dashboard returns redirect. Build succeeds.</done>
</task>

<task type="auto">
  <name>Wire user data into Sidebar and Navbar + implement logout</name>
  <files>src/components/layout/Sidebar.jsx, src/components/layout/Navbar.jsx</files>
  <action>
    1. Update `Sidebar.jsx`:
       - Import `useAuth` from `../../context/AuthContext`
       - Replace hardcoded "Student" with `user.displayName || 'Student'`
       - Replace hardcoded "user@email.com" with `user.email`
       - Replace the `handleLogout` function:
         - Call `await logout()` from useAuth
         - Then `navigate('/')`
         - Wrap in try/catch (ignore errors — just redirect)

    2. Update `Navbar.jsx`:
       - Import `useAuth` from `../../context/AuthContext`
       - Replace hardcoded "Student" with `user?.displayName || 'Student'`
       - Display shows: `Hello, {name} 👋`
  </action>
  <verify>npm run build</verify>
  <done>Sidebar shows real user name/email. Navbar shows real user name. Logout calls Firebase signOut and redirects. Build succeeds.</done>
</task>

## Success Criteria
- [ ] Unauthenticated users are redirected from /dashboard → /login
- [ ] Loading state shows while auth state resolves
- [ ] Sidebar displays actual user displayName and email
- [ ] Navbar displays actual user displayName
- [ ] Logout button calls Firebase signOut and redirects to landing page
- [ ] Build succeeds
