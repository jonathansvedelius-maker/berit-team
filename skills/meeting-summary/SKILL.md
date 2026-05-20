---
name: meeting-summary
description: >
  Use this skill to summarize a meeting transcript, notes, or discussion into
  decisions, action items, and open questions. Triggers on "summarize meeting",
  "sammanfatta mötet", "what did we decide", or when the user pastes meeting notes.
version: 0.1.0
---

# Meeting Summary

> A task verb. Any agent can invoke this; typically Berit or Erik.

## Purpose

Turn raw meeting input (transcript, bullet notes, chat log) into a structured summary that integrates with `memory/decisions.md` and `memory/open_questions.md`.

## Output format (Swedish by default)

```markdown
# Mötesammanfattning — {{title}}

**Datum:** {{YYYY-MM-DD}}
**Deltagare:** ...

## Beslut
- [Beslut] — [motivering om angiven]

## Action items
| # | Vad | Vem | När |
|---|---|---|---|
| 1 | ... | ... | YYYY-MM-DD |

## Öppna frågor
- ...

## Förslag att uppdatera i memory
- decisions.md: [vilka rader att lägga till]
- open_questions.md: [vilka rader]
- waiting_on_team.md: [vilka rader]
```

## Hard rules

- Read-only by default — propose memory updates rather than writing them. `/berit-end` does the writes.
- Action items must have an owner and a date (or "TBD" — never silent absence).
- Do not invent attendees, decisions, or commitments. If unclear, write "oklart från noteringarna".
- Do not persist sensitive personal data (e.g., performance discussions about a teammate). Summarize neutrally.
