---
name: decisions
description: Dated architectural and product decisions with rationale.
metadata:
  type: project
---

# Decisions

> Append-only. Newest at top. Format: date, agent, decision, rationale.

## 2026-05-20 — Adopt constitution and tiered decision authority

**Decision:** Introduce a one-page constitution ([../docs/constitution.md](../docs/constitution.md)) and a 4-tier decision authority model ([../docs/decision-authority.md](../docs/decision-authority.md)) per agent.

**Why:** Codify hard rules and approval gates so specialists can act safely on shared state without re-litigating norms every assignment.

**How to apply:** Berit reads constitution before delegating. Specialists check their default tier before taking action. Tier C requires explicit user "kör"/"ja".

## 2026-05-20 — Split memory into three layers

**Decision:** `memory/` (persistent) vs `.context/handoff.md` (working, per-assignment) vs `outputs/YYYY-MM-DD/` (deliverables).

**Why:** Today everything mixes into `.context/handoff.md` and dies at session end. Cross-session continuity requires explicit persistent memory.

**How to apply:** See [../docs/file-routing.md](../docs/file-routing.md). Promote decisions from handoff to `decisions.md` at session end via `/berit-end`.

[[constitution]] [[file-routing]]
