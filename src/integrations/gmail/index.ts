import type { IntegrationAdapter } from "@/integrations/types";
import { resolveConfig } from "@/integrations/types";

function buildRawMessage(to: string, subject: string, body: string): string {
  const message = [`To: ${to}`, `Subject: ${subject}`, "Content-Type: text/plain; charset=utf-8", "", body].join(
    "\r\n"
  );
  return Buffer.from(message)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export const gmailAdapter: IntegrationAdapter = {
  id: "gmail",
  label: "Gmail",
  actions: [
    { id: "new_email", label: "New email (trigger)" },
    { id: "send_email", label: "Send email" },
  ],
  validateConfig(action, config) {
    if (action === "send_email") {
      const missing = ["to", "subject", "body"].filter((f) => !config[f]);
      if (missing.length > 0) {
        throw new Error(`Missing required config: ${missing.join(", ")}`);
      }
    }
  },
  async execute(action, ctx) {
    if (action === "new_email") {
      return { success: false, error: "gmail.new_email is a trigger and cannot run as a step" };
    }
    if (action !== "send_email") {
      return { success: false, error: `Unsupported gmail action "${action}"` };
    }
    if (!ctx.credential) {
      return { success: false, error: "No Gmail credential connected" };
    }
    const config = resolveConfig(ctx, ctx.config);

    try {
      const raw = buildRawMessage(String(config.to), String(config.subject), String(config.body));
      const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${ctx.credential}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ raw }),
      });
      if (!res.ok) {
        return { success: false, error: `Gmail API error (${res.status})` };
      }
      const data = await res.json();
      return { success: true, output: data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Gmail request failed" };
    }
  },
};
