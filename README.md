# Berit Team

A multi-agent product team orchestrated by Berit. Each agent has a distinct role, and Berit coordinates their work through a shared handoff protocol.

## Team

| Agent | Role | Specialty |
|-------|------|-----------|
| Berit | Orchestrator | Plans, delegates, synthesizes — never implements |
| Gunnar | Product | Feature specs, acceptance criteria, prioritization |
| Anna | Business Analyst | Requirements analysis, process mapping, gap analysis |
| Astrid | UX | Design review, accessibility, information architecture |
| Pelle | Frontend | React/Next.js, TypeScript, Tailwind |
| Sigrid | Backend | Supabase, Edge Functions, RLS-first |
| Torsten | Infrastructure | Database design, migrations, deploy |
| Ingrid | QA | Code review, security audit, testing (read-only) |
| Erik | Documentation | API docs, runbooks, onboarding guides |
| Maja | Data & Analytics | Measurement plans, dashboards, event tracking |

## Usage

```
/berit Bygg en inloggningssida med Supabase Auth
/berit Granska koden i src/ för säkerhetsproblem
/berit Skriv en spec för notifikationssystemet
```

## Components

- **Skill** `berit-orchestrator` — Core orchestration logic, team roles, handoff protocol
- **Command** `/berit` — Entry point that activates Berit with an assignment

## How It Works

Berit creates a `.context/handoff.md` file at the start of each assignment. Each agent reads this file before starting work and updates it when done. This ensures every agent knows what has been decided, built, and flagged by previous agents.
