---
name: test-scenario-generation
description: >
  Use this skill to generate test scenarios from a spec, requirements doc, or
  feature description — including happy path, edge cases, error states, and
  security/RLS cases. Triggers on "generate test scenarios", "skapa testfall",
  "what tests do we need", or when Maja/Ingrid plans QA coverage.
version: 0.1.0
---

# Test Scenario Generation

> A task verb. Typically invoked by Ingrid or Maja.

## Purpose

Turn a spec into a structured list of test scenarios that cover happy paths, edges, errors, security, and observability. Output is test cases, not test code — implementation is left to the engineer.

## Categories to cover

1. **Happy path** — Primary success flows.
2. **Edge cases** — Empty input, max/min boundaries, concurrency, race conditions, timezone, locale.
3. **Error states** — Network failure, partial failure, invalid input, expired auth.
4. **Security / RLS** — Can a user access another user's data? Can an anonymous user reach an authenticated endpoint? Are sensitive fields exposed in logs or responses?
5. **Observability** — Does the feature emit the events that `memory/project_context.md` and the measurement plan expect?

## Output format

```markdown
# Testscenarier — {{feature}}

## Happy path
| # | Scenario | Förväntat utfall |
|---|---|---|
| 1.1 | ... | ... |

## Edge cases
...

## Errors
...

## Säkerhet / RLS
...

## Observability
...

## Täckningsluckor
[Areas the spec does not specify enough to test — flag for product]
```

## Hard rules

- Read-only.
- Group by category. Number scenarios so they can be referenced in PRs.
- For Supabase features, **always** include at least 3 RLS scenarios (own data ok, other user denied, anonymous denied).
- Flag coverage gaps where the spec is ambiguous — do not invent requirements.
