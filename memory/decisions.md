---
name: decisions
description: Dated architectural and product decisions with rationale.
metadata:
  type: project
---

# Decisions

> Append-only. Newest at top. Format: date, agent, decision, rationale.

## 2026-07-24 — Adapt the team to a newer Opus generation

**Decision:** Keep the `opus` / `sonnet` aliases in `agents/*.md` rather than pinning model IDs, and add a `BERIT_MODEL` / `BERIT_MODEL_<AGENT>` override on the SDK surface only. State tiers A and B as standing grants; give delegation and memory reads explicit when-conditions; have Ingrid report coverage first and annotate confidence per finding instead of filtering by severity. Four new regression tests (R10–R13) gate these behaviors.

**Why:** Newer Opus generations spawn fewer subagents unprompted, under-use file-based memory, ask about minor choices that lower tiers already authorize, and follow severity filters literally enough to drop real findings. All four are steerable, but only by writing out *when* a capability applies — the operating docs previously said only *how*. Verbosity instructions were left alone deliberately: the guidance is to measure before changing them, and no baseline was taken.

**How to apply:** Aliases mean a future model generation reaches the team with no code change. Pin a specific model only through the env override, and only on the SDK surface — plugin agents read static frontmatter. See [../docs/superpowers/specs/2026-07-24-opus-generation-upgrade-design.md](../docs/superpowers/specs/2026-07-24-opus-generation-upgrade-design.md).

**Status:** landed on `feat/opus-generation-upgrade`; **not released**. The version is still 0.3.0 because the regression suite has not been run — see [../outputs/2026-07-24/regression-run-v0.4.0.md](../outputs/2026-07-24/regression-run-v0.4.0.md).

[[constitution]] [[decision-authority]]

## 2026-05-20 — Adopt constitution and tiered decision authority

**Decision:** Introduce a one-page constitution ([../docs/constitution.md](../docs/constitution.md)) and a 4-tier decision authority model ([../docs/decision-authority.md](../docs/decision-authority.md)) per agent.

**Why:** Codify hard rules and approval gates so specialists can act safely on shared state without re-litigating norms every assignment.

**How to apply:** Berit reads constitution before delegating. Specialists check their default tier before taking action. Tier C requires explicit user "kör"/"ja".

## 2026-05-20 — Split memory into three layers

**Decision:** `memory/` (persistent) vs `.context/handoff.md` (working, per-assignment) vs `outputs/YYYY-MM-DD/` (deliverables).

**Why:** Today everything mixes into `.context/handoff.md` and dies at session end. Cross-session continuity requires explicit persistent memory.

**How to apply:** See [../docs/file-routing.md](../docs/file-routing.md). Promote decisions from handoff to `decisions.md` at session end via `/berit-end`.

[[constitution]] [[file-routing]]
