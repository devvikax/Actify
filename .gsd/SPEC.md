# SPEC.md — Project Specification

> **Status**: `FINALIZED`
> **Project Name**: PlanIt — AI Academic Execution Planner
> **Context**: Hackathon Submission (Fully Functional)

## Vision

PlanIt is an intelligent academic execution planner that transforms student deadlines into structured, personalized daily action plans. Unlike simple task trackers, it uses rule-based AI logic to break deadlines into actionable micro-tasks, distribute workload across available days, detect procrastination risk, and dynamically reschedule when plans go off-track. It solves a real, universal student problem — knowing *what* to do next without confusion or paralysis.

## Goals

1. **Intelligent Plan Generation** — Convert academic deadlines (assignments, exams) into day-wise micro-task plans with time blocks, using rule-based priority scoring and workload distribution
2. **Proactive Risk Detection** — Analyze remaining workload vs. available time to warn students when they're likely to miss deadlines
3. **Dynamic Rescheduling** — Automatically redistribute missed tasks across remaining days, adjusting priorities to keep the user on track
4. **Progress Intelligence** — Visual progress tracking with completion percentages, daily summaries, and AI-driven insights (optional Gemini API)
5. **Premium UX** — Deliver a polished, responsive interface using Soft Brutalism design (neubrutalist structure + pastel romantic aesthetics) with micro-interactions

## Non-Goals (Out of Scope)

- Calendar sync (Google Calendar, Outlook)
- Team/collaborative planning
- Mobile native app (responsive web only)
- LMS integration (Canvas, Moodle)
- Notification system (push/email)
- Offline mode / PWA
- Payment or subscription features

## Users

**Primary**: College/university students who struggle with procrastination, poor time management, and deadline anxiety. They know *what* is due but not *how* to break it down into daily executable steps.

**Usage Flow**:
1. Sign up / Log in via Firebase Auth
2. Input academic tasks (name, type, deadline, priority, difficulty, estimated hours)
3. Set daily available study hours
4. AI generates a day-wise execution plan with time blocks
5. Execute tasks daily, marking them complete
6. System adapts when tasks are missed, warns about procrastination risk
7. Track progress visually across all tasks and deadlines

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18+ with Vite |
| Styling | Vanilla CSS (Soft Brutalism design system) |
| Auth | Firebase Authentication (Email/Password) |
| Database | Firebase Firestore |
| AI Logic | Rule-based planning algorithm |
| AI Insights | Optional Gemini API integration |
| Hosting | Firebase Hosting (if needed) |

## Constraints

- **Timeline**: Hackathon — must be fully functional and demo-ready
- **No heavy backend**: All logic runs client-side or via Firebase services
- **Rule-based first**: AI planning must work without any API keys; Gemini is enhancement only
- **Single developer**: Architecture must be simple and maintainable
- **Responsive**: Must work seamlessly on desktop and mobile

## Design System — Soft Brutalism

- **Borders**: Thick (2-4px), solid black or dark borders on cards and inputs
- **Colors**: Pastel palette — soft lavender, blush pink, mint green, cream yellow, sky blue
- **Shadows**: Bold offset box-shadows (neubrutalist) but with soft colors
- **Typography**: Bold headings (Inter/Outfit), clean body text
- **Corners**: Rounded (8-16px) — softer than traditional neubrutalism
- **Cards**: Interactive with hover lift, priority color strips, clear labels
- **Micro-animations**: Smooth transitions, progress bar animations, hover effects, task completion celebrations
- **Contrast**: High readability with strategic color blocking

## Success Criteria

- [ ] Users can sign up, log in, and persist data across sessions
- [ ] Users can create tasks with deadline, priority, difficulty, and estimated hours
- [ ] System generates a structured day-wise plan automatically
- [ ] Plan distributes workload realistically based on available study hours
- [ ] Procrastination risk alerts appear when user is falling behind
- [ ] Missed tasks trigger dynamic rescheduling
- [ ] Progress is visually tracked with completion percentages
- [ ] Interface is responsive, fast, and visually polished
- [ ] All core features work without any external API key
