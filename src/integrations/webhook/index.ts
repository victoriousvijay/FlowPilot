import type { IntegrationAdapter } from "@/integrations/types";

export const webhookAdapter: IntegrationAdapter = {
  id: "webhook",
  label: "Webhook",
  actions: [{ id: "receive", label: "Receive payload" }],
  validateConfig() {
    // No required config for MVP: any JSON payload is accepted.
  },
  async execute(action, ctx) {
    if (action !== "receive") {
      return { success: false, error: `Unsupported webhook action "${action}"` };
    }
    return { success: true, output: ctx.triggerInput };
  },
};
