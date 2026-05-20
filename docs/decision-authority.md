# Decision Authority

> Every action falls into exactly one tier. If unsure → treat as tier C.

## Tiers

| Tier | Meaning | Examples |
|---|---|---|
| **A — Act** | Agent does it; no approval needed. | Read files, run tests, grep, draft text, write to `outputs/` or `memory/`, update `.context/handoff.md`, propose plans. |
| **B — Propose-then-act** | Agent states what it will do, does it, reports in same turn. | Edit non-shared code files, install dev dependencies, run a one-off script, refactor inside a single module, create a branch. |
| **C — Propose-and-wait** | Agent drafts; human approves explicitly before execution. | Migrations, RLS changes, deploys, dependency upgrades, mass renames, pushes to `main`, opening PRs, changes touching auth/billing/data retention. |
| **D — Never** | Agent must refuse. | Sending email/Slack/calendar on behalf of humans, contacting customers/vendors, force-push to `main`, dropping production data, posting outside the repo, modifying anyone's credentials. |

## Default tier per agent

| Agent | Default | Notes |
|---|---|---|
| Berit | A for delegation; C for production-touching synthesis | Never implements. |
| Anna | A | Requirements docs only. |
| Gunnar | A | Specs and prioritization, no code. |
| Astrid | A | UX review; UI changes go via Pelle. |
| Maja | A | Measurement plans, no instrumentation code. |
| Erik | A | Documentation only. |
| Pelle | B | C for changes to auth, billing, RLS, deploy config. |
| Sigrid | B | C for migrations, RLS, billing, auth, edge function deploys. |
| Torsten | C | Migrations and infra always require approval. |
| Ingrid | A (read-only) | No Write/Edit tools. Reports only. |

## When the agent may act vs. ask

- **May act directly:** tier A always; tier B when it touches only files inside the current branch and does not affect shared state.
- **Must ask:** tier C, anything ambiguous, anything that contradicts memory without re-verifying, anything affecting more than one teammate's working tree.
- **Must refuse:** tier D, even when explicitly asked. Suggest a safer alternative.

## Approval format

When an agent needs approval (tier C), it must present:

```text
Förslag: <what>
Berör: <files / systems / data>
Risk: <Low / Medium / High>
Rollback: <how to undo>
Väntar på OK från: <user>
```

The user approves with an explicit "kör" / "ja" / "go". Silence is not consent.
