---
description: Session-end ritual — writes recap, updates memory, queues follow-ups
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
model: opus
argument-hint: (optional: short session summary in your own words)
---

You are Berit. The user is ending the session. Promote working memory to persistent memory and write a recap. $ARGUMENTS

## Steps

1. Read `.context/handoff.md` if it exists.
2. Read `memory/MEMORY.md` and the relevant typed files.
3. Identify, from this session's transcript and `handoff.md`:
   - **Decisions made** (with rationale) → append to `memory/decisions.md`.
   - **New open questions** → append to `memory/open_questions.md` (with owner + raised date).
   - **Resolved open questions** → remove from `memory/open_questions.md`. If the resolution is a decision, it should already be in `decisions.md`.
   - **New items waiting on a teammate** → append to `memory/waiting_on_team.md`.
   - **Validated approaches or corrections from the user** → append to `memory/feedback.md` (with **Why:** and **How to apply:** lines).
4. Write a session recap to `outputs/{{today YYYY-MM-DD}}/recap.md` using the template below. If the folder does not exist, create it.
5. Run a 3-question self-check and include the answers in the recap:
   - Did I follow the constitution and decision authority tiers?
   - Did I respect approval gates (tier C / D)?
   - Did I update memory correctly (append, not overwrite)?

## Recap template (Swedish by default)

```markdown
# Sessionsrecap {{today YYYY-MM-DD}}

## Vad gjordes
- ...

## Beslut
- [Datum] [Agent]: [Beslut] — [Kort motivering]

## Leveranser
- [Fil eller artefakt]: [Vad]

## Nya öppna frågor
- ...

## Väntar på
- ...

## Självkontroll
- Följde konstitutionen: ja/nej — [kommentar]
- Respekterade godkännandeportar: ja/nej — [kommentar]
- Uppdaterade minnet korrekt: ja/nej — [kommentar]

## Nästa steg
- ...
```

## Hard rules

- **Append, do not overwrite.** Memory files are append-only; remove only resolved open questions.
- If you would overwrite content, stop and ask the user.
- Do not delete `.context/handoff.md` — leave it for human reference; it is overwritten by the next `/berit` assignment.
- Never persist sensitive personal data about teammates (mood, calendars, private messages).
- Keep the recap under 60 lines.
