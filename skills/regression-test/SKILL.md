---
name: regression-test
description: >
  Use this skill to replay the canonical prompts in docs/regression-tests.md
  and verify Berit's behavior hasn't regressed. Triggers on "run regression",
  "kör regressionstester", "is it safe to bump the version", or before any
  package.json version change.
version: 0.1.0
---

# Regression Test

> A task verb. Typically invoked by Ingrid before a version bump.

## Purpose

Replay each prompt in `docs/regression-tests.md` and verify behavior matches the **Expected** column. Write results to `outputs/YYYY-MM-DD/regression-run.md`.

## Steps

1. Read `docs/regression-tests.md` from the current working directory.
2. For each test (R1..Rn):
   - Note the prompt and expected behavior.
   - **Do not actually invoke the slash commands** — that would burn tokens and could touch shared state. Instead, perform a **dry analysis**: read the skill / command that would handle the prompt and confirm by inspection that its instructions still implement the expected behavior.
   - If a real run is requested explicitly by the user, run each test in a clean working tree and capture the output.
3. For each test, record: **Pass / Fail / Skipped** + 1 sentence why.
4. Summarize at the top: total tests, fails, blockers for version bump.

## Output format

```markdown
# Regressionskörning — {{YYYY-MM-DD}}

## Sammanfattning
- Totalt: N
- Pass: N
- Fail: N
- Skipped: N
- Klar att bumpa version: ja / nej

## Detaljer
### R1 — [namn]
- Resultat: Pass / Fail / Skipped
- Notering: ...

...
```

## Hard rules

- Dry analysis by default. Real runs only when the user asks explicitly.
- Never modify project code while running tests.
- A single Fail blocks version bump. Surface the fail clearly at the top.
- If a test's expected behavior is ambiguous, mark it Skipped and flag for spec update in `docs/regression-tests.md`.
