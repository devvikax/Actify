---
phase: 1
plan: 1
wave: 1
---

# Plan 1.1: Project Scaffolding & Firebase Configuration

## Objective
Initialize the Vite + React project, install all dependencies, and configure Firebase (Auth + Firestore) so the app has a working foundation to build upon.

## Context
- .gsd/SPEC.md
- .gsd/ROADMAP.md (Phase 1 deliverables)

## Tasks

<task type="auto">
  <name>Initialize Vite + React Project</name>
  <files>
    package.json
    vite.config.js
    index.html
    src/main.jsx
    src/App.jsx
    .gitignore
  </files>
  <action>
    1. Run `npx -y create-vite@latest ./ -- --template react` to scaffold in the current directory
    2. Install dependencies: `npm install`
    3. Install additional deps: `npm install react-router-dom firebase recharts`
    4. Verify the dev server starts with `npm run dev`
    5. Clean out default Vite boilerplate (remove App.css content, default counter code)
    - Do NOT delete index.css yet — it will be replaced in Plan 1.2
    - Do NOT add any routing yet — that's Plan 1.3
  </action>
  <verify>npm run build 2>&1 | Select-String "built in"</verify>
  <done>Vite + React project builds successfully with all dependencies installed. package.json contains react-router-dom, firebase, and recharts.</done>
</task>

<task type="auto">
  <name>Configure Firebase Services</name>
  <files>
    src/config/firebase.js
    .env
    .env.example
  </files>
  <action>
    1. Create `src/config/firebase.js` with Firebase initialization:
       - Import and initialize Firebase App
       - Export `auth` (getAuth) and `db` (getFirestore) instances
       - Read config values from environment variables (import.meta.env.VITE_*)
    2. Create `.env.example` with placeholder keys:
       ```
       VITE_FIREBASE_API_KEY=your_api_key
       VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
       VITE_FIREBASE_PROJECT_ID=your_project_id
       VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
       VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
       VITE_FIREBASE_APP_ID=your_app_id
       ```
    3. Create `.env` with the same structure (user will fill in real keys)
    4. Add `.env` to `.gitignore`
    - Do NOT set up auth providers or Firestore collections yet — that's Phase 2 & 3
    - DO use environment variables, never hardcode keys
  </action>
  <verify>node -e "const fs = require('fs'); const f = fs.readFileSync('src/config/firebase.js','utf8'); if(f.includes('getAuth') && f.includes('getFirestore') && f.includes('import.meta.env')) console.log('Firebase config OK'); else process.exit(1)"</verify>
  <done>Firebase config file exports auth and db instances. Environment variables template exists. .env is gitignored.</done>
</task>

## Success Criteria
- [ ] `npm run build` succeeds without errors
- [ ] package.json has react-router-dom, firebase, recharts dependencies
- [ ] src/config/firebase.js exports auth and db
- [ ] .env.example has all Firebase config placeholders
- [ ] .env is in .gitignore
