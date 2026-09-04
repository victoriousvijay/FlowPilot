import { z } from "zod";
import { INTEGRATION_ACTIONS, TRIGGER_ACTIONS } from "@/integrations/registry-data";

const integrationIds = Object.keys(INTEGRATION_ACTIONS) as [string, ...string[]];

export const TriggerSchema = z.object({
  id: z.string().min(1),
  integration: z.enum(integrationIds as [string, ...string[]]),
  event: z.string().min(1),
  config: z.record(z.string(), z.unknown()).default({}),
});

export const StepSchema = z.object({
  id: z.string().min(1),
  integration: z.enum(integrationIds as [string, ...string[]]),
  action: z.string().min(1),
  config: z.record(z.string(), z.unknown()).default({}),
  inputMapping: z.record(z.string(), z.unknown()).optional(),
  continueOnError: z.boolean().optional(),
});

export const WorkflowStatusSchema = z.enum(["draft", "active", "paused"]);

export const WorkflowSchema = z.object({
  id: z.string().uuid().optional(),
  version: z.number().int().min(1).default(1),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  trigger: TriggerSchema,
  steps: z.array(StepSchema).min(1),
  status: WorkflowStatusSchema.default("draft"),
});

export type Trigger = z.infer<typeof TriggerSchema>;
export type Step = z.infer<typeof StepSchema>;
export type Workflow = z.infer<typeof WorkflowSchema>;
export type WorkflowStatus = z.infer<typeof WorkflowStatusSchema>;

/** Validates that trigger/step integration+action pairs are registered, beyond shape validation. */
export function validateWorkflowSemantics(workflow: Workflow): string[] {
  const errors: string[] = [];

  const triggerActions = TRIGGER_ACTIONS[workflow.trigger.integration];
  if (!triggerActions || !triggerActions.includes(workflow.trigger.event)) {
    errors.push(
      `Unsupported trigger event "${workflow.trigger.event}" for integration "${workflow.trigger.integration}"`
    );
  }

  const seenIds = new Set<string>([workflow.trigger.id]);
  for (const step of workflow.steps) {
    if (seenIds.has(step.id)) {
      errors.push(`Duplicate step id "${step.id}"`);
    }
    seenIds.add(step.id);

    const actions = INTEGRATION_ACTIONS[step.integration];
    if (!actions || !actions.includes(step.action)) {
      errors.push(
        `Unsupported action "${step.action}" for integration "${step.integration}"`
      );
    }
  }

  return errors;
}
