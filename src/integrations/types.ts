export type ActionResult = {
  success: boolean;
  output?: Record<string, unknown>;
  error?: string;
};

export type ExecutionContext = {
  userId: string;
  config: Record<string, unknown>;
  inputMapping?: Record<string, unknown>;
  /** Output accumulated from prior steps, keyed by step id. */
  priorOutputs: Record<string, Record<string, unknown> | undefined>;
  /** Original trigger payload. */
  triggerInput: Record<string, unknown>;
  /** Decrypted credential secret for this step's integration, if one is stored. */
  credential?: string;
};

export type ActionDefinition = {
  id: string;
  label: string;
};

export type IntegrationAdapter = {
  id: string;
  label: string;
  actions: ActionDefinition[];
  validateConfig(action: string, config: Record<string, unknown>): void;
  execute(action: string, ctx: ExecutionContext): Promise<ActionResult>;
};

export function resolveMappedValue(
  ctx: ExecutionContext,
  value: unknown
): unknown {
  if (typeof value !== "string" || !value.startsWith("{{") || !value.endsWith("}}")) {
    return value;
  }
  const path = value.slice(2, -2).trim();
  const [source, ...rest] = path.split(".");
  const root =
    source === "trigger"
      ? ctx.triggerInput
      : ctx.priorOutputs[source];
  if (!root) return undefined;
  return rest.reduce<unknown>((acc, key) => {
    if (acc && typeof acc === "object") {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, root);
}

export function resolveConfig(
  ctx: ExecutionContext,
  config: Record<string, unknown>
): Record<string, unknown> {
  const resolved: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(config)) {
    resolved[key] = resolveMappedValue(ctx, value);
  }
  return resolved;
}
