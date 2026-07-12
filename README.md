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

- **Agents** `agents/*.md` — Canonical specialist definitions (persona, tools, model). The harness enforces each agent's tool list — Ingrid is read-only by construction, not by convention. `src/agents/*.ts` is generated from these via `npm run sync:agents`.
- **Skill** `berit-orchestrator` — Core orchestration logic, team roles, handoff protocol
- **Skill** `requirements-review` / `test-scenario-generation` / `meeting-summary` / `risk-review` / `regression-test` — Task verbs any specialist can invoke
- **Command** `/berit` — Entry point that activates Berit with an assignment
- **Command** `/berit-start` — Session-start briefing from persistent memory (read-only)
- **Command** `/berit-end` — Session-end ritual: promotes decisions into memory, writes recap

## Operating Model

The team runs under a one-page constitution and tiered decision authority. See:

- [docs/constitution.md](docs/constitution.md) — hard rules and behavioral guidelines
- [docs/decision-authority.md](docs/decision-authority.md) — per-agent tier table and approval format
- [docs/file-routing.md](docs/file-routing.md) — where artifacts live (memory vs handoff vs outputs)
- [docs/regression-tests.md](docs/regression-tests.md) — canonical prompts that gate version bumps

## How It Works

Berit maintains memory across three layers:

- **`memory/`** — persistent, cross-session (team context, decisions, open questions, feedback)
- **`.context/handoff.md`** — working memory for one assignment
- **`outputs/YYYY-MM-DD/`** — dated deliverables (specs, reviews, summaries, recaps)

At the start of each assignment Berit creates `.context/handoff.md` with the goals and constraints. Each agent reads it before working and reports its deliveries in its final message; Berit is the sole writer of the handoff file, which avoids write races between parallel agents. At session end, `/berit-end` promotes decisions and open questions into `memory/` so the next session starts informed.
