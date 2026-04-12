# DECISIONS.md — Architecture Decision Records

## ADR-001: Rule-Based AI Over LLM
- **Date**: 2026-04-12
- **Decision**: Use rule-based algorithms for plan generation instead of LLM calls
- **Rationale**: No API key dependency for core features, faster execution, deterministic output, hackathon reliability
- **Consequence**: Gemini API is optional enhancement only

## ADR-002: Firebase Stack
- **Date**: 2026-04-12
- **Decision**: Firebase Auth + Firestore for authentication and data persistence
- **Rationale**: Fast setup, free tier sufficient, real-time sync, well-documented
- **Consequence**: No custom backend needed

## ADR-003: Soft Brutalism Design
- **Date**: 2026-04-12
- **Decision**: Combine Neubrutalism structure with pastel romantic aesthetics
- **Rationale**: Unique visual identity for hackathon, bold but approachable, stands out from generic Material/Tailwind UIs
- **Consequence**: Custom CSS design system required (no framework)
