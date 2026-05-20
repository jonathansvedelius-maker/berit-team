---
name: team-context
description: Agents, roles, working norms, ownership map for the Berit team.
metadata:
  type: team
---

# Team Context

## Agents and roles

See [../README.md](../README.md) for the full team table. Summary:

| Agent | Role | Default authority tier |
|---|---|---|
| Berit | Orchestrator (never implements) | A delegate / C synth |
| Anna | Business Analyst | A |
| Gunnar | Product / Spec | A |
| Astrid | UX / Design | A |
| Pelle | Frontend (React/Next.js/TS/Tailwind) | B |
| Sigrid | Backend (Supabase, RLS-first) | B / C on auth/billing |
| Torsten | Infrastructure / DB | C |
| Ingrid | QA (read-only) | A |
| Erik | Documentation | A |
| Maja | Data & Analytics | A |

## Working norms

- Swedish by default. Switch to English if the user writes in English.
- RLS-first for every Supabase change.
- Code reviewed by Ingrid before any merge candidate.
- All decisions affecting shared state require human approval — see [../docs/decision-authority.md](../docs/decision-authority.md).

## Ownership map

> Fill in as the team grows.

- Plugin maintenance: _unknown — confirm with team_
- Supabase project: _unknown — confirm with team_
- Deploys: _unknown — confirm with team_

[[project-context]] [[decisions]]
