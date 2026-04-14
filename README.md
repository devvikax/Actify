<div align="center">
  <h1>Actify — AI Academic Execution Planner</h1>
  <p><strong>Transform student deadlines into intelligent, personalized daily action plans.</strong></p>

  <p>
    <img src="https://img.shields.io/badge/React-18-blue" alt="React 18" />
    <img src="https://img.shields.io/badge/Vite-8.0-purple" alt="Vite" />
    <img src="https://img.shields.io/badge/Firebase-v12-yellow" alt="Firebase" />
    <img src="https://img.shields.io/badge/Gemini_AI-2.0_Flash-orange" alt="Gemini AI" />
    <img src="https://img.shields.io/badge/Framer_Motion-12-ff69b4" alt="Framer Motion" />
  </p>
</div>

<hr />

## 🌟 The Vision

PlanIt is an intelligent academic execution planner designed to solve a universal student problem: **knowing _what_ to do next without confusion or paralysis.**

Unlike simple to-do lists, PlanIt uses AI and rule-based logic to break complex assignments into actionable micro-tasks, distribute workload evenly, detect procrastination risks, and dynamically rethink your schedule when you fall behind. With a unique focus on **Student Strength** and **Subject Proficiency**, PlanIt adjusts your daily study capacity so you don't burn out.

---

## ✨ Key Features

### 🧠 Gemini AI-Powered Planning
Fully integrated with **Google Gemini 2.0 Flash** to provide dynamic planning:
- **Student Strength Analysis**: Evaluates your task completion rate, on-time rate, and efficiency.
  - *Struggling students* get more adjusted study hours.
  - *Strong students* get an optimized, leaner schedule.
- **Subject Proficiency Distribution**: Weak at Mathematics? The AI automatically allocates more study hours and breaks tasks down further.
- **Smart 15-Hour Cap**: AI enforces a strict max of 15 hours per day to prevent unrealistic planning.

### 📊 Intelligent Rule-based Engine (Offline Fallback)
No API Key? No problem. PlanIt includes a robust rule-based mathematical engine that tracks priority (High/Medium/Low), difficulty (Hard/Medium/Easy), urgency (deadline proximity), and automatically chunks workloads.

### 🚨 Procrastination Risk Detection
PlanIt watches your remaining capacity `(hours needed / hours available)`. If the density gets too high (>80%), it flags the task as a **🔥 High Risk Alert** on your dashboard, urging immediate action.

### 🎨 Soft Brutalism Design System
A beautiful, modern UI inspired by Neo-brutalism but softened for a premium feel. 
- Vibrant pastel accents (Lavender, Mint, Blush, Sky)
- Thick satisfying borders and bold shadows
- Smooth Framer Motion page transitions
- Playful confetti interactions upon task completion!

---

## 🚀 Quick Start

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed along with `npm` or `yarn`.

### 1. Clone & Install
```bash
git clone https://github.com/devvikax/Actify.git
cd Actify
npm install
```

### 2. Configure Firebase & AI Variables
Create a `.env` file in the root directory and add your Firebase and Gemini credentials:
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Optional: Add Gemini API key for advanced AI planning
VITE_GEMINI_API_KEY=your_gemini_api_key
```

### 3. Run Development Server
```bash
npm run dev
```

Open your browser to `http://localhost:5173/` and start planning!

---

## 🛠️ Architecture & Tech Stack

**Frontend Framework:**
- **React 19**
- **Vite** (Ultra-fast HMR)
- **React Router v7** (Routing)

**Styling & UI:**
- **Vanilla CSS** with a custom tokenized Soft Brutalism design system
- **Framer Motion** (Page transitions & micro-animations)
- **Canvas Confetti** (Celebration effects)
- **Recharts** (Progress and analytics rendering)

**Backend as a Service (BaaS):**
- **Firebase Authentication** (Protected routes, unified sessions)
- **Firestore Database** (Real-time schema-less NoSQL)

**AI & State:**
- **Google Generative AI SDK**
- Custom Context API & React Hooks (`useTasks`, `useSchedule`, `useSettings`)

---

## 📱 User Flow

1. **Onboarding**: Sign up via the Landing page's smooth modern flow.
2. **Setup Capacity**: Define your base daily study hours (max 15h).
3. **Add Tasks**: Input tasks, categorize them by subject, deadline, difficulty, and your personal proficiency level in that subject.
4. **Dashboard**: View your AI-Adjusted strength, recommended hours, risk alerts, and completion charts.
5. **Today's Plan**: Follow the AI's micro-task schedule. Mark parts as completed and watch the progress bars fill up.



<div align="center">
  <p>Made by Alpha Bro's</p>
</div>
