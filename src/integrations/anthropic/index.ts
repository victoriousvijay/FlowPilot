import type { IntegrationAdapter } from "@/integrations/types";
import { resolveConfig } from "@/integrations/types";
import { getAnthropicClient, GENERATION_MODEL } from "@/lib/anthropic";

export const anthropicAdapter: IntegrationAdapter = {
  id: "anthropic",
  label: "Anthropic",
  actions: [
    { id: "generate_text", label: "Generate text" },
    { id: "summarize", label: "Summarize" },
    { id: "classify", label: "Classify" },
  ],
  validateConfig(action, config) {
    if ((action === "generate_text" || action === "summarize") && !config.prompt && !config.text) {
      throw new Error(`"${action}" requires a "prompt" or "text" config value`);
    }
    if (action === "classify" && !Array.isArray(config.categories)) {
      throw new Error(`"classify" requires a "categories" array`);
    }
  },
  async execute(action, ctx) {
    const config = resolveConfig(ctx, ctx.config);
    const client = getAnthropicClient();

    let prompt: string;
    if (action === "generate_text") {
      prompt = String(config.prompt ?? "");
    } else if (action === "summarize") {
      prompt = `Summarize the following text concisely:\n\n${String(config.text ?? config.prompt ?? "")}`;
    } else if (action === "classify") {
      const categories = Array.isArray(config.categories) ? config.categories : [];
      prompt = `Classify the following text into exactly one of these categories: ${categories.join(
        ", "
      )}. Respond with only the category name.\n\nText: ${String(config.text ?? "")}`;
    } else {
      return { success: false, error: `Unsupported anthropic action "${action}"` };
    }

    try {
      const response = await client.messages.create({
        model: GENERATION_MODEL,
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });
      const textBlock = response.content.find((b) => b.type === "text");
      const text = textBlock && textBlock.type === "text" ? textBlock.text : "";
      return { success: true, output: { text } };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : "Anthropic request failed" };
    }
  },
};
