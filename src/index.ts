import { query } from "@anthropic-ai/claude-agent-sdk";
import { anna, astrid, berit, erik, gunnar, ingrid, maja, pelle, sigrid, torsten } from "./agents/index.js";

const prompt = process.argv.slice(2).join(" ").trim();

if (!prompt) {
  console.error("Usage: npm start -- <prompt>");
  console.error('Example: npm start -- "Bygg en funktion för att exportera fakturor som PDF"');
  process.exit(1);
}

console.log(`\nBerit-teamet startar: ${prompt}\n${"─".repeat(60)}\n`);

for await (const message of query({
  prompt,
  options: {
    agent: "berit",
    agents: { anna, astrid, berit, erik, gunnar, ingrid, maja, pelle, sigrid, torsten },
    permissionMode: "acceptEdits",
  },
})) {
  if (message.type === "result" && message.subtype === "success") {
    console.log("\n" + "═".repeat(60));
    console.log("BERIT — SLUTRAPPORT");
    console.log("═".repeat(60));
    console.log(message.result);
    if (message.total_cost_usd) console.log(`\nKostnad: $${message.total_cost_usd.toFixed(4)}`);

  } else if (message.type === "result") {
    const err = message as { subtype: string; errors?: string[] };
    console.error(`\nFel: ${err.subtype}${err.errors?.length ? " — " + err.errors.join(", ") : ""}`);
    process.exit(1);

  } else if (message.type === "assistant") {
    for (const block of message.message.content) {
      if ("type" in block && block.type === "text") {
        const text = (block as { type: "text"; text: string }).text.trim();
        if (text) console.log(text);
      }
    }

  } else if (message.type === "system") {
    const sys = message as { subtype: string; description?: string; summary?: string; ambient?: boolean; patch?: { status?: string } };
    switch (sys.subtype) {
      case "task_started":
        if (!sys.ambient && sys.description)
          console.log(`\n▶ ${sys.description}`);
        break;
      case "task_notification":
        if (sys.summary)
          console.log(`  ✓ ${sys.summary}`);
        break;
      case "task_progress":
        if (sys.description)
          process.stdout.write(`  … ${sys.description}\r`);
        break;
    }
  }
}
