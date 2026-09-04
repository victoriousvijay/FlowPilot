import { NextResponse } from "next/server";
import { WorkflowSchema } from "@/domain/workflow";
import { requireUser } from "@/lib/api-auth";
import { executeWorkflow } from "@/lib/execute-workflow";

type Params = { params: Promise<{ id: string }> };

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabase
    .from("workflows")
    .select("definition")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const workflow = WorkflowSchema.parse(data.definition);
  const body = await request.json().catch(() => ({}));
  const triggerInput = body && typeof body === "object" ? body : {};

  const { data: run, error: runError } = await supabase
    .from("execution_runs")
    .insert({
      workflow_id: id,
      user_id: user.id,
      status: "running",
      trigger_input: triggerInput,
    })
    .select("id")
    .single();

  if (runError || !run) {
    return NextResponse.json({ error: "Failed to start test run" }, { status: 500 });
  }

  const result = await executeWorkflow(workflow, user.id, triggerInput);

  await supabase
    .from("execution_runs")
    .update({
      status: result.status,
      error: result.error ?? null,
      finished_at: new Date().toISOString(),
    })
    .eq("id", run.id);

  if (result.steps.length > 0) {
    await supabase.from("execution_steps").insert(
      result.steps.map((s) => ({
        execution_id: run.id,
        step_id: s.stepId,
        status: s.status,
        output: s.output ?? null,
        error: s.error ?? null,
        finished_at: new Date().toISOString(),
      }))
    );
  }

  return NextResponse.json({ runId: run.id, ...result });
}
