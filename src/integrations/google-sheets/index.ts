import type { IntegrationAdapter } from "@/integrations/types";
import { resolveConfig } from "@/integrations/types";

function requireFields(config: Record<string, unknown>, fields: string[]) {
  const missing = fields.filter((f) => !config[f]);
  if (missing.length > 0) {
    throw new Error(`Missing required config: ${missing.join(", ")}`);
  }
}

export const googleSheetsAdapter: IntegrationAdapter = {
  id: "google_sheets",
  label: "Google Sheets",
  actions: [
    { id: "create_row", label: "Create row" },
    { id: "update_row", label: "Update row" },
  ],
  validateConfig(action, config) {
    if (action === "create_row") {
      requireFields(config, ["spreadsheetId", "sheetName", "values"]);
    } else if (action === "update_row") {
      requireFields(config, ["spreadsheetId", "range", "values"]);
    }
  },
  async execute(action, ctx) {
    if (!ctx.credential) {
      return { success: false, error: "No Google Sheets credential connected" };
    }
    const config = resolveConfig(ctx, ctx.config);
    const values = Array.isArray(config.values) ? config.values : [config.values];

    try {
      let url: string;
      let method: string;
      if (action === "create_row") {
        const range = encodeURIComponent(String(config.sheetName));
        url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}:append?valueInputOption=USER_ENTERED`;
        method = "POST";
      } else if (action === "update_row") {
        const range = encodeURIComponent(String(config.range));
        url = `https://sheets.googleapis.com/v4/spreadsheets/${config.spreadsheetId}/values/${range}?valueInputOption=USER_ENTERED`;
        method = "PUT";
      } else {
        return { success: false, error: `Unsupported google_sheets action "${action}"` };
      }

      const res = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${ctx.credential}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ values: [values] }),
      });

      if (!res.ok) {
        return { success: false, error: `Google Sheets API error (${res.status})` };
      }
      const data = await res.json();
      return { success: true, output: data };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Google Sheets request failed" };
    }
  },
};
