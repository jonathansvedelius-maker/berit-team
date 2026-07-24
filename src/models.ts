/**
 * Model resolution for the SDK app.
 *
 * agents/<name>.md declares an alias (`opus` / `sonnet`) rather than a pinned
 * model ID, so a new model generation reaches the team without a code change.
 * These helpers add an escape hatch for the cases where a specific model is
 * needed: reproducing a bug, comparing two generations, or pinning during an
 * incident.
 *
 * Precedence, highest first:
 *   1. BERIT_MODEL_<AGENT>   e.g. BERIT_MODEL_INGRID=claude-opus-4-8
 *   2. BERIT_MODEL           applies to every agent
 *   3. the alias declared in agents/<name>.md
 *
 * Plugin agents read static frontmatter and never see these variables. Pinning
 * on the plugin surface means editing agents/<name>.md. See docs/sdk-usage.md.
 */
export function resolveModel(
  agentName: string,
  declared: string,
  env: Record<string, string | undefined>,
): string {
  const specific = env[`BERIT_MODEL_${agentName.toUpperCase()}`]?.trim();
  if (specific) return specific;

  const all = env.BERIT_MODEL?.trim();
  if (all) return all;

  return declared;
}

/** Applies resolveModel across a record of agent definitions. Returns a new object. */
export function applyModelOverrides<T extends Record<string, { model: string }>>(
  agents: T,
  env: Record<string, string | undefined>,
): { [K in keyof T]: Omit<T[K], "model"> & { model: string } } {
  return Object.fromEntries(
    Object.entries(agents).map(([name, def]) => [
      name,
      { ...def, model: resolveModel(name, def.model, env) },
    ]),
  ) as { [K in keyof T]: Omit<T[K], "model"> & { model: string } };
}
