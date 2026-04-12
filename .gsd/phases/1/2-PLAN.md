---
phase: 1
plan: 2
wave: 1
---

# Plan 1.2: Soft Brutalism Design System & UI Primitives

## Objective
Establish the complete Soft Brutalism CSS design system with design tokens, global styles, and reusable UI primitive components that all future screens will use.

## Context
- .gsd/SPEC.md (Design System section)
- .gsd/DECISIONS.md (ADR-003: Soft Brutalism)
- src/main.jsx (entry point)

## Tasks

<task type="auto">
  <name>Create Soft Brutalism CSS Design System</name>
  <files>
    src/index.css
    src/styles/design-tokens.css
  </files>
  <action>
    1. Create `src/styles/design-tokens.css` with CSS custom properties:
       **Color Palette (Pastel Romance):**
       - --color-primary: soft lavender (#B8A9E8)
       - --color-secondary: blush pink (#F2A7B3)
       - --color-accent: mint green (#A8E6CF)
       - --color-warning: cream yellow (#FFE9A0)
       - --color-info: sky blue (#87CEEB)
       - --color-danger: coral (#FF6B6B)
       - --color-bg: warm white (#FFF8F0)
       - --color-bg-card: pure white (#FFFFFF)
       - --color-text: dark charcoal (#2D2D2D)
       - --color-text-muted: medium gray (#6B7280)
       - --color-border: near-black (#1A1A2E)

       **Neubrutalist Tokens:**
       - --border-thick: 3px solid var(--color-border)
       - --border-medium: 2px solid var(--color-border)
       - --shadow-brutal: 4px 4px 0px var(--color-border)
       - --shadow-brutal-sm: 2px 2px 0px var(--color-border)
       - --shadow-brutal-hover: 6px 6px 0px var(--color-border)
       - --shadow-brutal-active: 1px 1px 0px var(--color-border)

       **Soft Tokens:**
       - --radius-sm: 8px
       - --radius-md: 12px
       - --radius-lg: 16px
       - --radius-full: 9999px

       **Typography:**
       - --font-heading: 'Outfit', sans-serif
       - --font-body: 'Inter', sans-serif
       - --font-mono: 'JetBrains Mono', monospace
       - Font size scale: --text-xs through --text-4xl

       **Spacing:**
       - --space-1 through --space-12 (4px base scale)

       **Transitions:**
       - --transition-fast: 150ms ease
       - --transition-base: 250ms ease
       - --transition-slow: 400ms ease

    2. Update `src/index.css` with:
       - Import design-tokens.css
       - Import Google Fonts (Outfit + Inter)
       - CSS reset / normalize
       - Base body styles using tokens
       - Global typography styles
       - Scrollbar styling
       - Selection color styling
       - Utility classes: .container, .flex, .grid, .text-center, etc.

    - DO use CSS custom properties exclusively — no hardcoded values
    - DO include dark mode consideration via prefers-color-scheme or a .dark class (but default is light)
    - Do NOT use any CSS framework
  </action>
  <verify>node -e "const fs=require('fs'); const t=fs.readFileSync('src/styles/design-tokens.css','utf8'); const vars=['--color-primary','--border-thick','--shadow-brutal','--radius-md','--font-heading','--transition-base']; const missing=vars.filter(v=>!t.includes(v)); if(missing.length===0) console.log('Design tokens OK'); else { console.log('Missing:',missing); process.exit(1) }"</verify>
  <done>Design tokens CSS file has all color, border, shadow, radius, typography, spacing, and transition variables. index.css imports tokens, sets global styles, and includes Google Fonts.</done>
</task>

<task type="auto">
  <name>Create Reusable UI Primitive Components</name>
  <files>
    src/components/ui/Button.jsx
    src/components/ui/Button.css
    src/components/ui/Card.jsx
    src/components/ui/Card.css
    src/components/ui/Input.jsx
    src/components/ui/Input.css
    src/components/ui/Badge.jsx
    src/components/ui/Badge.css
    src/components/ui/ProgressBar.jsx
    src/components/ui/ProgressBar.css
    src/components/ui/index.js
  </files>
  <action>
    1. **Button** — Soft brutalist button component:
       - Props: variant (primary, secondary, danger, ghost), size (sm, md, lg), fullWidth, disabled, onClick, children
       - Styles: Thick border, bold shadow, hover lifts shadow, active presses shadow down
       - Smooth transition on hover/active states
       - Pastel background colors per variant

    2. **Card** — Content container component:
       - Props: variant (default, priority-high, priority-medium, priority-low), hoverable, className, children
       - Styles: White background, thick border, brutal shadow, rounded corners
       - Priority variants add a colored left strip (red/yellow/green)
       - Hover effect: shadow grows, slight translate

    3. **Input** — Form input component:
       - Props: label, type, placeholder, value, onChange, error, required, icon
       - Styles: Thick border, brutal shadow on focus, pastel focus ring
       - Includes textarea variant
       - Error state with danger color border
       - Also create Select variant for dropdowns

    4. **Badge** — Status/label indicator:
       - Props: variant (primary, secondary, accent, warning, danger, info), size (sm, md), children
       - Styles: Pill shape, thick border, pastel background, bold text

    5. **ProgressBar** — Animated progress indicator:
       - Props: value (0-100), variant (primary, accent, warning, danger), size (sm, md, lg), showLabel, animated
       - Styles: Track with thick border, filled bar with gradient, smooth width transition
       - Animated striped pattern option
       - Label shows percentage

    6. Create `src/components/ui/index.js` barrel export for all components

    - ALL styles must use design tokens (CSS custom properties)
    - ALL components must support className prop for extension
    - ALL interactive elements must have hover/focus/active states with transitions
    - Do NOT use inline styles — use CSS files
  </action>
  <verify>node -e "const fs=require('fs'); const comps=['Button','Card','Input','Badge','ProgressBar']; const missing=comps.filter(c=>!fs.existsSync('src/components/ui/'+c+'.jsx')); if(missing.length===0) console.log('UI components OK'); else { console.log('Missing:',missing); process.exit(1) }"</verify>
  <done>5 UI primitive components exist with matching CSS files. Each uses design tokens. Barrel export index.js exists. All components support className prop and have interactive states.</done>
</task>

## Success Criteria
- [ ] Design tokens CSS has 30+ custom properties covering colors, borders, shadows, radius, typography, spacing, transitions
- [ ] index.css imports tokens, loads Google Fonts, applies global styles
- [ ] 5 UI components (Button, Card, Input, Badge, ProgressBar) created with CSS
- [ ] All component styles use CSS custom properties exclusively
- [ ] All interactive components have hover/focus/active transitions
- [ ] Barrel export file exists at src/components/ui/index.js
