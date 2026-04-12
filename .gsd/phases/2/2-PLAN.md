---
phase: 2
plan: 2
wave: 1
---

# Plan 2.2: Login & Signup Pages

## Objective
Build the fully-styled Login and Signup pages with email/password forms, error handling, and navigation. These replace the current stubs. Must use the Soft Brutalism design system and UI primitives from Phase 1.

## Context
- src/pages/Login.jsx — Current stub, needs full replacement
- src/pages/Signup.jsx — Current stub, needs full replacement
- src/context/AuthContext.jsx — Created in Plan 2.1, provides `login()`, `signup()`
- src/components/ui/index.js — Button, Card, Input components
- src/styles/design-tokens.css — Soft Brutalism tokens

## Tasks

<task type="auto">
  <name>Build Login page</name>
  <files>src/pages/Login.jsx, src/pages/Auth.css</files>
  <action>
    Replace `src/pages/Login.jsx` stub with full auth page:

    1. Layout: Centered card on a pastel gradient background
    2. Header: PlanIt logo (🎯) + "Welcome back" heading
    3. Form fields (use `<Input>` from UI primitives):
       - Email input (type="email", required)
       - Password input (type="password", required)
    4. Submit button using `<Button variant="primary" size="lg">` with full width
    5. Loading state: disable form + show "Logging in..." during auth call
    6. Error state: display Firebase error message in a styled error div
    7. Link to Signup: "Don't have an account? Sign Up" below form
    8. On success: `navigate('/dashboard')`
    9. Use `useAuth()` to call `login(email, password)`
    10. Handle errors: map Firebase error codes to friendly messages:
        - `auth/user-not-found` → "No account found with this email"
        - `auth/wrong-password` → "Incorrect password"
        - `auth/invalid-email` → "Invalid email address"
        - `auth/invalid-credential` → "Invalid email or password"
        - default → error.message

    Create `src/pages/Auth.css` with shared auth page styles:
    - `.auth-page`: full viewport height, centered flexbox, pastel gradient background
    - `.auth-card`: max-width 440px, Soft Brutalism card styling
    - `.auth-header`: logo + heading + subtitle
    - `.auth-form`: flex column, gap spacing
    - `.auth-error`: red border, pastel red background, error text
    - `.auth-footer`: link text below form
    - Responsive: full-width on mobile with padding
  </action>
  <verify>npm run build</verify>
  <done>Login.jsx renders form with email/password, error handling, navigation link. Auth.css exists with shared styles. Build succeeds.</done>
</task>

<task type="auto">
  <name>Build Signup page</name>
  <files>src/pages/Signup.jsx</files>
  <action>
    Replace `src/pages/Signup.jsx` stub with full auth page:

    1. Same layout as Login (uses Auth.css shared styles)
    2. Header: PlanIt logo (🎯) + "Create your account" heading
    3. Form fields:
       - Display name input (type="text", required)
       - Email input (type="email", required)
       - Password input (type="password", required, minLength 6)
       - Confirm password input (type="password", required)
    4. Client-side validation:
       - Passwords match check before submitting
       - Password length >= 6
    5. Submit button full width with loading state
    6. After `signup()`: call `updateProfile(user, { displayName })` from firebase/auth
    7. Error handling: same Firebase error mapping as Login, plus:
       - `auth/email-already-in-use` → "An account with this email already exists"
       - `auth/weak-password` → "Password must be at least 6 characters"
       - Passwords don't match → "Passwords do not match" (client-side)
    8. Navigate to `/dashboard` on success
    9. Link to Login: "Already have an account? Log In"
  </action>
  <verify>npm run build</verify>
  <done>Signup.jsx renders form with name/email/password/confirm, validation, error handling. Build succeeds.</done>
</task>

## Success Criteria
- [ ] Login page renders with email/password form using UI primitives
- [ ] Signup page renders with name/email/password/confirm form
- [ ] Both pages use `useAuth()` for signup/login calls
- [ ] Both pages handle and display Firebase errors with friendly messages
- [ ] Both pages show loading state during authentication
- [ ] Navigation links between Login ↔ Signup work
- [ ] Auth.css shared styles exist
- [ ] Build succeeds
