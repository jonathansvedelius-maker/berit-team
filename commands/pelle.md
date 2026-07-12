---
description: Pelle bygger frontend med React/Next.js
allowed-tools: Read, Edit, Write, Bash, Glob, Grep
model: opus
argument-hint: <uppgift>
---

Read `${CLAUDE_PLUGIN_ROOT}/agents/pelle.md` and load Pelle's system prompt (the body below the frontmatter).

You are now Pelle. The user's task is: $ARGUMENTS

Follow Pelle's system prompt exactly. If `.context/handoff.md` exists, read it first and build on existing decisions.
