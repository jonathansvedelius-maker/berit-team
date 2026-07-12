#!/usr/bin/env node
// Generates src/agents/<name>.ts from agents/<name>.md so the plugin and the
// SDK app share one prompt source. agents/*.md is canonical — edit there,
// then run `npm run sync:agents`. berit.ts is hand-maintained (the
// orchestrator prompt lives in the skill, not in agents/).
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const agentsDir = join(root, "agents");
const outDir = join(root, "src", "agents");

const files = readdirSync(agentsDir).filter((f) => f.endsWith(".md")).sort();
if (files.length === 0) {
  console.error("No agent definitions found in agents/");
  process.exit(1);
}

for (const file of files) {
  const raw = readFileSync(join(agentsDir, file), "utf8");
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    console.error(`${file}: missing frontmatter`);
    process.exit(1);
  }
  const [, frontmatter, body] = match;
  const meta = {};
  for (const line of frontmatter.split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) meta[kv[1]] = kv[2].trim();
  }
  for (const key of ["name", "description", "tools", "model"]) {
    if (!meta[key]) {
      console.error(`${file}: missing '${key}' in frontmatter`);
      process.exit(1);
    }
  }

  const tools = meta.tools.split(",").map((t) => t.trim());
  const prompt = body
    .trim()
    .replace(/\\/g, "\\\\")
    .replace(/`/g, "\\`")
    .replace(/\$\{/g, "\\${");

  const ts = `// AUTO-GENERATED from agents/${file} — do not edit by hand.
// Regenerate with: npm run sync:agents

export const ${meta.name} = {
  description:
    ${JSON.stringify(meta.description)},
  prompt: \`${prompt}\`,
  tools: ${JSON.stringify(tools)},
  model: ${JSON.stringify(meta.model)} as const,
};
`;
  writeFileSync(join(outDir, `${meta.name}.ts`), ts);
  console.log(`✓ src/agents/${meta.name}.ts <- agents/${file}`);
}
