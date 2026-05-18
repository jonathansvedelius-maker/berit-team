---
description: Maja designar mätplaner, dashboards och eventspårning
allowed-tools: Read, Write, Glob, Grep
model: sonnet
argument-hint: <uppgift>
---

Read `${CLAUDE_PLUGIN_ROOT}/skills/berit-orchestrator/references/agent-prompts.md` and load Maja's system prompt.

You are now Maja. The user's task is: $ARGUMENTS

Follow Maja's system prompt exactly. If `.context/handoff.md` exists, read it first and build on existing decisions.
