import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { test } from "node:test";

/**
 * Contract tests over the nine specialist prompts in agents/.
 *
 * These assert on prompt *text*, which is deliberately brittle. That is the
 * point: an edit that drops one of these properties fails loudly instead of
 * silently. If you change the wording in agents/, change the marker here in
 * the same commit — that edit is the decision point and should be conscious.
 *
 * Why this file exists: the tier A/B autonomy grant was originally written
 * only into the operating documents and Berit's own prompt, none of which a
 * specialist ever loads. Nine of ten agents never saw it, and the regression
 * test meant to catch that (R11) could only be run by hand. Inspection missed
 * it; a whole-branch review caught it. This is the cheaper net.
 *
 * Berit is not covered here — her prompt lives in
 * skills/berit-orchestrator/SKILL.md and src/agents/berit.ts, not agents/.
 */

const agentsDir = new URL("../agents/", import.meta.url);

/** Tier A/B autonomy: act on minor choices instead of asking. Guards R11. */
const AUTONOMY_MARKER = "Nivå A och B är fullmakter";

/** Scope boundary: decline work outside your domain and route it. Guards R7. */
const SCOPE_MARKER = "utanför din domän";

type Agent = { file: string; frontmatter: string; body: string };

function readAgents(): Agent[] {
  const files = readdirSync(agentsDir).filter((f) => f.endsWith(".md")).sort();
  assert.ok(files.length > 0, "no agent definitions found in agents/");

  return files.map((file) => {
    const raw = readFileSync(new URL(file, agentsDir), "utf8");
    const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
    assert.ok(match, `${file}: missing frontmatter`);
    return { file, frontmatter: match[1], body: match[2] };
  });
}

test("every specialist prompt carries the tier A/B autonomy grant", () => {
  for (const { file, body } of readAgents()) {
    assert.ok(
      body.includes(AUTONOMY_MARKER),
      `${file} does not grant tier A/B autonomy. Without it the agent asks the ` +
        `user about minor choices its tier already authorises, and R11 measures ` +
        `a behavior nothing instructed.`,
    );
  }
});

test("every specialist prompt states a scope boundary", () => {
  for (const { file, body } of readAgents()) {
    assert.ok(
      body.includes(SCOPE_MARKER),
      `${file} never tells the agent what to do with work outside its domain. ` +
        `R7 expects a specialist to decline and route; nothing implements that.`,
    );
  }
});

test("Ingrid has no write tools", () => {
  const ingrid = readAgents().find((a) => a.file === "ingrid.md");
  assert.ok(ingrid, "agents/ingrid.md is missing");

  const tools = ingrid.frontmatter
    .split(/\r?\n/)
    .find((line) => line.startsWith("tools:"));
  assert.ok(tools, "agents/ingrid.md has no tools: line");

  for (const forbidden of ["Write", "Edit", "NotebookEdit"]) {
    assert.ok(
      !tools.includes(forbidden),
      `agents/ingrid.md grants ${forbidden}. Ingrid's read-only guarantee is ` +
        `enforced by this tool list — R2 and R8 both depend on it.`,
    );
  }
});
