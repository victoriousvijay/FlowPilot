import type { IntegrationAdapter } from "@/integrations/types";
import { resolveConfig } from "@/integrations/types";

export const slackAdapter: IntegrationAdapter = {
  id: "slack",
  label: "Slack",
  actions: [{ id: "send_message", label: "Send message" }],
  validateConfig(action, config) {
    if (action === "send_message" && !config.text) {
      throw new Error(`"send_message" requires a "text" config value`);
    }
  },
  async execute(action, ctx) {
    if (action !== "send_message") {
      return { success: false, error: `Unsupported slack action "${action}"` };
    }
    if (!ctx.credential) {
      return { success: false, error: "No Slack webhook connected" };
    }
    const config = resolveConfig(ctx, ctx.config);

    try {
      const res = await fetch(ctx.credential, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: String(config.text ?? "") }),
      });
      if (!res.ok) {
        return { success: false, error: `Slack webhook error (${res.status})` };
      }
      return { success: true, output: { delivered: true } };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Slack request failed" };
    }
  },
};
