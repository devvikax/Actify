# ROADMAP.md

> **Current Phase**: Phase 3 — Task Management
> **Milestone**: v1.0 — Hackathon Submission

## Must-Haves (from SPEC)
- [ ] Firebase Auth (signup/login/logout)
- [ ] Task CRUD with Firestore persistence
- [ ] Rule-based AI plan generation (day-wise micro-tasks)
- [ ] Procrastination Risk Alerts
- [ ] Dynamic Rescheduling on missed tasks
- [ ] Progress tracking with visual indicators
- [ ] Soft Brutalism responsive UI with micro-animations

## Phases

### Phase 1: Foundation & Design System ✅
**Status**: ✅ Complete
**Objective**: Scaffold the React+Vite project, establish the Soft Brutalism design system, configure Firebase, and set up routing/layout structure.
**Requirements**: REQ-15, REQ-16
**Deliverables**:
- Vite + React project initialized
- Soft Brutalism CSS design system (variables, tokens, base components)
- Firebase project configured (Auth + Firestore)
- React Router with layout shell (sidebar/nav, main content area)
- Reusable UI primitives: Button, Card, Input, Badge, ProgressBar

### Phase 2: Authentication System ✅
**Status**: ✅ Complete
**Objective**: Implement full Firebase authentication flow with protected routes and persistent sessions.
**Requirements**: REQ-01, REQ-02
**Deliverables**:
- AuthContext with Firebase Auth state management
- Sign Up page (email/password)
- Log In page (email/password)
- Protected route wrapper
- User profile display in nav
- Logout functionality

### Phase 3: Task Management
**Status**: ⬜ Not Started
**Objective**: Build the complete task input, display, and management system with Firestore persistence.
**Requirements**: REQ-03, REQ-04, REQ-05, REQ-17
**Deliverables**:
- Task creation form (name, type, deadline, priority, difficulty, estimated hours)
- Daily study hours configuration
- Task cards with priority indicators, deadline countdown, difficulty badges
- Edit and delete task functionality
- Firestore CRUD operations for tasks per user
- Completed tasks section

### Phase 4: AI Planning Engine & Progress
**Status**: ⬜ Not Started
**Objective**: Implement the rule-based planning algorithm that generates day-wise micro-task schedules, plus progress tracking.
**Requirements**: REQ-06, REQ-07, REQ-08, REQ-09, REQ-10, REQ-13
**Deliverables**:
- Priority scoring algorithm (deadline proximity × priority × difficulty)
- Micro-task breakdown engine (splits tasks into sub-tasks)
- Day-wise schedule generator respecting daily hour limits
- Time block allocation per micro-task
- "Today's Plan" view with actionable task list
- Mark as done with instant progress update
- Progress dashboard (completion %, daily chart, remaining workload)

### Phase 5: Smart Features & Polish
**Status**: ⬜ Not Started
**Objective**: Add procrastination risk detection, dynamic rescheduling, optional AI insights, and final UI polish.
**Requirements**: REQ-11, REQ-12, REQ-14
**Deliverables**:
- Procrastination Risk Alert (workload vs. time analysis)
- Dynamic Rescheduling engine (redistribute missed tasks)
- Optional Gemini API integration for natural-language insights
- Micro-animations (hover effects, transitions, progress animations, task completion celebration)
- Mobile responsiveness final pass
- Demo readiness check
