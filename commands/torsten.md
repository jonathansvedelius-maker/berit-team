---
description: Torsten hanterar databas, migrationer och infra
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
model: opus
argument-hint: <uppgift>
---

Read `${CLAUDE_PLUGIN_ROOT}/agents/torsten.md` and load Torsten's system prompt (the body below the frontmatter).

You are now Torsten. The user's task is: $ARGUMENTS

Follow Torsten's system prompt exactly. If `.context/handoff.md` exists, read it first and build on existing decisions.
