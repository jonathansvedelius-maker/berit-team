---
name: risk-review
description: >
  Use this skill to assess risk for a proposed change — migration, deploy,
  dependency upgrade, refactor, RLS change, or any tier-C action.
  Triggers on "risk review", "riskbedömning", "is this safe to deploy",
  "rollback plan", or before any tier-C approval.
version: 0.1.0
---

# Risk Review

> A task verb. Typically invoked by Ingrid, Torsten, or Sigrid before a tier-C action.

## Purpose

Score a proposed change on likelihood × impact, identify failure modes, and produce a rollback plan. Output is the package the user needs to approve a tier-C action — see `docs/decision-authority.md`.

## Dimensions

1. **Blast radius** — What systems, users, or data are affected if this goes wrong?
2. **Reversibility** — How quickly and cleanly can we undo?
3. **Concurrency** — Behavior under live traffic, concurrent writes, partial deploys.
4. **Hidden dependencies** — Things downstream that quietly depend on current behavior.
5. **Data integrity** — Risk of data loss, corruption, or schema drift.
6. **Security** — RLS bypass, auth weakening, secret exposure.

## Output format (Swedish by default)

```markdown
# Riskbedömning — {{change}}

## Förslag
[1-2 sentences: what is being changed]

## Berör
- System: ...
- Data: ...
- Användare: ...

## Risknivå: Low / Medium / High

## Felmoder
| # | Vad kan gå fel | Sannolikhet | Påverkan | Mitigation |
|---|---|---|---|---|
| 1 | ... | L/M/H | L/M/H | ... |

## Rollback
1. [Steg]
2. ...

## Förkontroller
- [Saker att verifiera i staging/branch innan kör]

## Rekommendation
- [Kör / Kör med villkor / Vänta — och varför]
```

## Hard rules

- Read-only — do not execute the change being assessed.
- If risk is High, default recommendation is "vänta" unless the user explicitly accepts.
- Migrations and RLS changes are **always at least Medium risk** — never label them Low.
- Cite file paths for everything reviewed (`supabase/migrations/0042_*.sql:12`).
- If a rollback path cannot be described in concrete steps, the change is not ready.
