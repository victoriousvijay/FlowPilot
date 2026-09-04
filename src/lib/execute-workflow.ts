import "server-only";
import type { Workflow, Step } from "@/domain/workflow";
import { getAdapter } from "@/integrations/registry";
import { getCredentialSecret } from "@/lib/credentials";
import type { ActionResult } from "@/integrations/types";

export type StepExecutionResult = {
  stepId: string;
  status: "success" | "failed" | "skipped";
  output?: Record<string, unknown>;
  error?: string;
};

export type WorkflowExecutionResult = {
  status: "success" | "failed";
  steps: StepExecutionResult[];
  error?: string;
};

/** Adapters that don't require a stored credential for MVP execution. */
const CREDENTIAL_FREE_INTEGRATIONS = new Set(["webhook", "anthropic"]);

export async function executeWorkflow(
  workflow: Workflow,
  userId: string,
  triggerInput: Record<string, unknown>
): Promise<WorkflowExecutionResult> {
  const priorOutputs: Record<string, Record<string, unknown> | undefined> = {};
  const results: StepExecutionResult[] = [];

  for (const step of workflow.steps as Step[]) {
    const adapter = getAdapter(step.integration);
    if (!adapter) {
      results.push({ stepId: step.id, status: "failed", error: `Unregistered integration "${step.integration}"` });
      return { status: "failed", steps: results, error: `Unregistered integration "${step.integration}"` };
    }

    try {
      adapter.validateConfig(step.action, step.config);
    } catch (err) {
      const error = err instanceof Error ? err.message : "Invalid step configuration";
      results.push({ stepId: step.id, status: "failed", error });
      if (!step.continueOnError) {
        return { status: "failed", steps: results, error };
      }
      continue;
    }

    const credential = CREDENTIAL_FREE_INTEGRATIONS.has(step.integration)
      ? undefined
      : (await getCredentialSecret(userId, step.integration)) ?? undefined;

    let result: ActionResult;
    try {
      result = await adapter.execute(step.action, {
        userId,
        config: step.config,
        inputMapping: step.inputMapping,
        priorOutputs,
        triggerInput,
        credential,
      });
    } catch (err) {
      result = { success: false, error: err instanceof Error ? err.message : "Step execution failed" };
    }

    if (result.success) {
      priorOutputs[step.id] = result.output;
      results.push({ stepId: step.id, status: "success", output: result.output });
    } else {
      results.push({ stepId: step.id, status: "failed", error: result.error });
      if (!step.continueOnError) {
        return { status: "failed", steps: results, error: result.error };
      }
    }
  }

  return { status: "success", steps: results };
}
