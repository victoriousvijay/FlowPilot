import "server-only";
import type Anthropic from "@anthropic-ai/sdk";
import { getAnthropicClient, GENERATION_MODEL } from "@/lib/anthropic";
import { WorkflowSchema, validateWorkflowSemantics, type Workflow } from "@/domain/workflow";
import { INTEGRATION_ACTIONS, TRIGGER_ACTIONS } from "@/integrations/registry-data";

const WORKFLOW_TOOL_NAME = "emit_workflow";

const supportedSummary = `
Supported triggers (integration -> events): ${JSON.stringify(TRIGGER_ACTIONS)}
Supported actions (integration -> actions): ${JSON.stringify(INTEGRATION_ACTIONS)}
`.trim();

const SYSTEM_PROMPT = `You are a workflow architect for an AI automation platform.
You translate a natural-language automation request into a single structured workflow
matching the application's schema. You are a planner only: you never produce
executable code (no JavaScript, SQL, shell commands, or server code).

Hard constraints:
- Only use registered integrations/actions. Never invent one.
- Never invent credential values or secrets.
- Keep steps minimal and preserve the user's intent.
- Every workflow has exactly one trigger.
- Steps execute in order, referenced by unique ids.
- If the request requires something unsupported, still return the closest valid
  workflow using supported pieces, and list what is unsupported in "warnings".

${supportedSummary}

Config values may reference prior step output using the syntax "{{stepId.field}}"
or the original trigger payload using "{{trigger.field}}".

Call the ${WORKFLOW_TOOL_NAME} tool exactly once with the final workflow and a short
list of human-readable warnings (empty array if none).`;

const workflowTool = {
  name: WORKFLOW_TOOL_NAME,
  description: "Emit the generated workflow and any warnings.",
  input_schema: {
    type: "object" as const,
    properties: {
      workflow: {
        type: "object",
        properties: {
          name: { type: "string" },
          description: { type: "string" },
          trigger: {
            type: "object",
            properties: {
              id: { type: "string" },
              integration: { type: "string" },
              event: { type: "string" },
              config: { type: "object" },
            },
            required: ["id", "integration", "event", "config"],
          },
          steps: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                integration: { type: "string" },
                action: { type: "string" },
                config: { type: "object" },
                inputMapping: { type: "object" },
              },
              required: ["id", "integration", "action", "config"],
            },
          },
        },
        required: ["name", "trigger", "steps"],
      },
      warnings: { type: "array", items: { type: "string" } },
    },
    required: ["workflow", "warnings"],
  },
};

export type GenerationResult = {
  workflow: Workflow;
  warnings: string[];
};

export class WorkflowGenerationError extends Error {
  constructor(message: string, public readonly details: string[] = []) {
    super(message);
    this.name = "WorkflowGenerationError";
  }
}

export async function generateWorkflowFromPrompt(prompt: string): Promise<GenerationResult> {
  const client = getAnthropicClient();

  const response = await client.messages.create({
    model: GENERATION_MODEL,
    max_tokens: 2048,
    system: SYSTEM_PROMPT,
    tools: [workflowTool],
    tool_choice: { type: "tool", name: WORKFLOW_TOOL_NAME },
    messages: [{ role: "user", content: prompt }],
  });

  const toolUse = response.content.find(
    (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
  );

  if (!toolUse) {
    throw new WorkflowGenerationError("The model did not return a structured workflow.");
  }

  const raw = toolUse.input as { workflow?: unknown; warnings?: unknown };
  const candidate = {
    ...(typeof raw.workflow === "object" && raw.workflow ? raw.workflow : {}),
    version: 1,
    status: "draft" as const,
  };

  const parsed = WorkflowSchema.safeParse(candidate);
  if (!parsed.success) {
    throw new WorkflowGenerationError(
      "Generated workflow failed schema validation.",
      parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`)
    );
  }

  const semanticErrors = validateWorkflowSemantics(parsed.data);
  if (semanticErrors.length > 0) {
    throw new WorkflowGenerationError("Generated workflow uses unsupported integrations/actions.", semanticErrors);
  }

  const warnings = Array.isArray(raw.warnings)
    ? raw.warnings.filter((w): w is string => typeof w === "string")
    : [];

  return { workflow: parsed.data, warnings };
}
