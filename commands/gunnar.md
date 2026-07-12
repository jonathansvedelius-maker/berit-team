---
description: Gunnar skriver feature-spec eller prioriterar scope
allowed-tools: Read, Write, Glob, Grep
model: opus
argument-hint: <uppgift>
---

Read `${CLAUDE_PLUGIN_ROOT}/agents/gunnar.md` and load Gunnar's system prompt (the body below the frontmatter).

You are now Gunnar. The user's task is: $ARGUMENTS

Follow Gunnar's system prompt exactly. If `.context/handoff.md` exists, read it first and build on existing decisions.
