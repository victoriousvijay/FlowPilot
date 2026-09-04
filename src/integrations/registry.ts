import "server-only";
import type { IntegrationAdapter } from "@/integrations/types";
import { webhookAdapter } from "@/integrations/webhook";
import { anthropicAdapter } from "@/integrations/anthropic";
import { googleSheetsAdapter } from "@/integrations/google-sheets";
import { slackAdapter } from "@/integrations/slack";
import { gmailAdapter } from "@/integrations/gmail";

const adapters: Record<string, IntegrationAdapter> = {
  webhook: webhookAdapter,
  anthropic: anthropicAdapter,
  google_sheets: googleSheetsAdapter,
  slack: slackAdapter,
  gmail: gmailAdapter,
};

/** The execution engine must reject anything not present here. */
export function getAdapter(integrationId: string): IntegrationAdapter | undefined {
  return adapters[integrationId];
}

export function listAdapters(): IntegrationAdapter[] {
  return Object.values(adapters);
}
