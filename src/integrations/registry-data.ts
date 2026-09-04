/**
 * Pure metadata describing supported integrations/actions.
 * Kept dependency-free so both domain schemas (client+server) and the
 * adapter registry (server-only) can import it without pulling in secrets.
 */
export const TRIGGER_ACTIONS: Record<string, string[]> = {
  webhook: ["receive"],
  gmail: ["new_email"],
};

export const INTEGRATION_ACTIONS: Record<string, string[]> = {
  webhook: ["receive"],
  anthropic: ["generate_text", "summarize", "classify"],
  google_sheets: ["create_row", "update_row"],
  slack: ["send_message"],
  gmail: ["new_email", "send_email"],
};

export const INTEGRATION_LABELS: Record<string, string> = {
  webhook: "Webhook",
  anthropic: "Anthropic",
  google_sheets: "Google Sheets",
  slack: "Slack",
  gmail: "Gmail",
};
