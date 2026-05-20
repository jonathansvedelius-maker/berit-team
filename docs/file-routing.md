# File Routing

> Where artifacts live. Three layers, separated by lifetime.

## Layers

| Layer | Lifetime | Where |
|---|---|---|
| **Persistent memory** | Cross-session, cross-assignment | `memory/` |
| **Working memory** | One assignment | `.context/handoff.md` |
| **Deliverables** | Dated artifact, kept forever | `outputs/YYYY-MM-DD/` |

## Routing rules

| Artifact | Goes to |
|---|---|
| Team facts, working norms, who-owns-what | `memory/team_context.md` |
| Active projects, goals, deadlines, stakeholders | `memory/project_context.md` |
| Architectural / product decisions (dated, with rationale) | `memory/decisions.md` |
| Unresolved questions with owner + status | `memory/open_questions.md` |
| Items blocked on a human teammate | `memory/waiting_on_team.md` |
| Validated approaches and corrections | `memory/feedback.md` |
| Per-assignment scratch, contracts, ongoing decisions | `.context/handoff.md` |
| Specs, reviews, summaries, recaps, generated docs | `outputs/YYYY-MM-DD/<kebab-case-name>.md` |
| Skill definitions | `skills/<skill-name>/SKILL.md` |
| Commands | `commands/<name>.md` |
| Operating docs (this file, constitution, etc.) | `docs/` |

## Conventions

- **One artifact per file.** Don't append unrelated content to existing outputs.
- **kebab-case** filenames. Date prefix only when artifacts within a day need ordering.
- **No artifacts in repo root.** If a deliverable doesn't fit `outputs/`, it doesn't belong here.
- **MEMORY.md is an index**, not content. Each entry is one line: `- [Title](file.md) — one-line hook`.
- **`.context/handoff.md` is ephemeral.** Don't grep it for historical truth — promote decisions to `memory/decisions.md` at session end.

## When in doubt

- Will I want this in six months? → `memory/` or `outputs/`.
- Is this scratch for the current assignment? → `.context/handoff.md`.
- Is this a finished thing I'd hand someone? → `outputs/YYYY-MM-DD/`.
