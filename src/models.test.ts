import assert from "node:assert/strict";
import { test } from "node:test";
import { applyModelOverrides, resolveModel } from "./models.js";

test("falls back to the declared alias when nothing is set", () => {
  assert.equal(resolveModel("ingrid", "opus", {}), "opus");
});

test("BERIT_MODEL overrides every agent", () => {
  assert.equal(
    resolveModel("ingrid", "opus", { BERIT_MODEL: "claude-opus-4-8" }),
    "claude-opus-4-8",
  );
});

test("BERIT_MODEL_<AGENT> beats BERIT_MODEL", () => {
  const env = { BERIT_MODEL: "sonnet", BERIT_MODEL_INGRID: "claude-opus-4-8" };
  assert.equal(resolveModel("ingrid", "opus", env), "claude-opus-4-8");
  assert.equal(resolveModel("erik", "sonnet", env), "sonnet");
});

test("blank and whitespace-only overrides are ignored", () => {
  assert.equal(resolveModel("ingrid", "opus", { BERIT_MODEL: "   " }), "opus");
  assert.equal(resolveModel("ingrid", "opus", { BERIT_MODEL_INGRID: "" }), "opus");
});

test("applyModelOverrides rewrites the model field and nothing else", () => {
  const agents = {
    ingrid: { model: "opus", tools: ["Read"], prompt: "p" },
    erik: { model: "sonnet", tools: ["Write"], prompt: "q" },
  };
  const out = applyModelOverrides(agents, { BERIT_MODEL_INGRID: "claude-opus-4-8" });
  assert.equal(out.ingrid.model, "claude-opus-4-8");
  assert.equal(out.erik.model, "sonnet");
  assert.deepEqual(out.ingrid.tools, ["Read"]);
  assert.equal(out.ingrid.prompt, "p");
});

test("applyModelOverrides does not mutate its input", () => {
  const agents = { ingrid: { model: "opus" } };
  applyModelOverrides(agents, { BERIT_MODEL: "sonnet" });
  assert.equal(agents.ingrid.model, "opus");
});
