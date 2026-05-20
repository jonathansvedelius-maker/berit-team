---
name: requirements-review
description: >
  Use this skill to review a set of requirements, a spec, or a feature description
  for clarity, completeness, testability, and hidden assumptions. Triggers on
  "review requirements", "granska kraven", "is this spec complete", or when a
  spec is being handed from product (Gunnar/Anna) to engineering.
version: 0.1.0
---

# Requirements Review

> A task verb. Any agent with read access can invoke this — typically Anna, Gunnar, or Ingrid.

## Purpose

Audit a requirements doc or spec against five quality dimensions and return a structured report.

## Dimensions

1. **Clarity** — Could two readers interpret the same line differently?
2. **Completeness** — Are goals, non-goals, success metrics, and edge cases stated?
3. **Testability** — Can every acceptance criterion be verified objectively?
4. **Assumptions** — What is assumed that should be verified before building?
5. **Dependencies** — What external systems, data, or decisions does this rely on?

## Output format

```markdown
# Requirements Review — {{spec name}}

## Sammanfattning
[1-2 sentences: is this ready to build? If not, what's the blocker?]

## Kritiskt (måste fixas innan bygg)
- [Issue] — [why it matters] — [where: file:line or section]

## Varningar (bör fixas)
- ...

## Förslag (nice-to-have)
- ...

## Antaganden att verifiera
- ...

## Beroenden
- ...
```

## Hard rules

- Read-only. Do not edit the spec itself; report findings.
- Cite section or line for every issue.
- If the spec is too thin to review, say so and ask the user what's missing.
- Reference `memory/decisions.md` for context that might explain non-obvious choices in the spec.
