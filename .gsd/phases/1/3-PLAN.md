---
phase: 1
plan: 3
wave: 2
---

# Plan 1.3: Routing & Layout Shell

## Objective
Set up React Router with the app's page structure and create the main layout shell (sidebar navigation + main content area) that all pages will render inside.

## Context
- .gsd/SPEC.md (User flow)
- src/App.jsx
- src/components/ui/ (primitives from Plan 1.2)

## Tasks

<task type="auto">
  <name>Set Up React Router & Page Stubs</name>
  <files>
    src/App.jsx
    src/pages/Landing.jsx
    src/pages/Landing.css
    src/pages/Login.jsx
    src/pages/Signup.jsx
    src/pages/Dashboard.jsx
    src/pages/MyTasks.jsx
    src/pages/TodayPlan.jsx
    src/pages/Progress.jsx
  </files>
  <action>
    1. Update `src/App.jsx` to use BrowserRouter with routes:
       - `/` → Landing page (public)
       - `/login` → Login page (public)
       - `/signup` → Signup page (public)
       - `/dashboard` → Dashboard (will be protected in Phase 2)
       - `/tasks` → MyTasks (will be protected)
       - `/today` → TodayPlan (will be protected)
       - `/progress` → Progress (will be protected)
    
    2. Create page stub components — each should render:
       - The page name as a heading
       - A brief placeholder description
       - Use proper component structure (export default function)

    3. Create `Landing.jsx` as a FULLY DESIGNED landing page:
       - Hero section with bold headline: "Stop Procrastinating. Start Executing."
       - Subtitle explaining the AI planner value prop
       - CTA buttons: "Get Started" (→ /signup) and "Log In" (→ /login)
       - Feature cards section (3 cards): Smart Planning, Risk Alerts, Dynamic Rescheduling
       - Use UI primitives (Button, Card) from Plan 1.2
       - Apply Soft Brutalism styling throughout
       - Include smooth scroll animations (CSS-only or intersection observer)
       - Must be visually impressive — this is the first thing hackathon judges see
       - Landing.css for page-specific styles

    - Do NOT implement auth protection yet — Phase 2
    - Do NOT implement full page content for Dashboard/Tasks/etc — Phase 3+
    - DO make Landing page fully polished and demo-ready
  </action>
  <verify>node -e "const fs=require('fs'); const pages=['Landing','Login','Signup','Dashboard','MyTasks','TodayPlan','Progress']; const missing=pages.filter(p=>!fs.existsSync('src/pages/'+p+'.jsx')); if(missing.length===0) console.log('Pages OK'); else { console.log('Missing:',missing); process.exit(1) }"</verify>
  <done>7 page components exist. App.jsx has BrowserRouter with all routes. Landing page is fully designed with hero, features, and CTAs using Soft Brutalism design.</done>
</task>

<task type="auto">
  <name>Create Layout Shell with Navigation</name>
  <files>
    src/components/layout/AppLayout.jsx
    src/components/layout/AppLayout.css
    src/components/layout/Sidebar.jsx
    src/components/layout/Sidebar.css
    src/components/layout/Navbar.jsx
    src/components/layout/Navbar.css
  </files>
  <action>
    1. Create `AppLayout.jsx` — wrapper layout for authenticated pages:
       - Sidebar on the left (collapsible on mobile)
       - Top navbar with user area (placeholder avatar + name)
       - Main content area with Outlet for nested routes
       - Responsive: sidebar collapses to hamburger menu on mobile

    2. Create `Sidebar.jsx`:
       - Logo/brand at top: "PlanIt" with an icon/emoji (📋 or 🎯)
       - Nav links with icons (use emoji or simple SVG):
         - 📊 Dashboard (/dashboard)
         - 📝 My Tasks (/tasks)
         - 📅 Today's Plan (/today)
         - 📈 Progress (/progress)
       - Active link highlighting (use NavLink from react-router-dom)
       - Logout button at bottom (non-functional until Phase 2)
       - Soft Brutalism styling: thick border right side, pastel accent on active

    3. Create `Navbar.jsx`:
       - Top bar for mobile — hamburger toggle + brand + user avatar
       - On desktop: page title area + user greeting placeholder
       - Styled with thick bottom border, pastel background

    4. Update App.jsx routes to wrap Dashboard/Tasks/Today/Progress routes inside AppLayout

    - DO use Soft Brutalism styling with design tokens
    - DO make sidebar responsive (hidden on mobile, toggle with hamburger)
    - DO use NavLink for active state detection
    - Do NOT implement real auth/user data — use placeholder text
  </action>
  <verify>node -e "const fs=require('fs'); const files=['src/components/layout/AppLayout.jsx','src/components/layout/Sidebar.jsx','src/components/layout/Navbar.jsx']; const missing=files.filter(f=>!fs.existsSync(f)); if(missing.length===0) console.log('Layout OK'); else { console.log('Missing:',missing); process.exit(1) }"</verify>
  <done>AppLayout wraps authenticated routes with Sidebar + Navbar + Outlet. Sidebar has nav links with active states. Layout is responsive with mobile hamburger toggle. All styles use design tokens.</done>
</task>

## Success Criteria
- [ ] App.jsx has BrowserRouter with 7 routes
- [ ] Landing page is fully designed and visually polished
- [ ] AppLayout wraps authenticated page routes
- [ ] Sidebar has working NavLinks with active highlighting
- [ ] Layout is responsive (sidebar collapses on mobile)
- [ ] `npm run dev` shows a working app with navigation between pages
