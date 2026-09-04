import { NextResponse } from "next/server";
import { WorkflowSchema } from "@/domain/workflow";
import { createAdminClient } from "@/lib/supabase/server";
import { executeWorkflow } from "@/lib/execute-workflow";

const MAX_PAYLOAD_BYTES = 256 * 1024;

type Params = { params: Promise<{ workflowId: string }> };

export async function POST(request: Request, { params }: Params) {
  const { workflowId } = await params;

  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  const raw = await request.text();
  if (Buffer.byteLength(raw, "utf8") > MAX_PAYLOAD_BYTES) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let payload: Record<string, unknown> = {};
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") payload = parsed;
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("workflows")
    .select("id, user_id, status, definition")
    .eq("id", workflowId)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }
  if (data.status !== "active") {
    return NextResponse.json({ error: "Workflow is not active" }, { status: 409 });
  }

  const parsedWorkflow = WorkflowSchema.safeParse(data.definition);
  if (!parsedWorkflow.success || parsedWorkflow.data.trigger.integration !== "webhook") {
    return NextResponse.json({ error: "Workflow does not accept webhook triggers" }, { status: 400 });
  }

  const { data: run } = await supabase
    .from("execution_runs")
    .insert({ workflow_id: workflowId, user_id: data.user_id, status: "running", trigger_input: payload })
    .select("id")
    .single();

  const result = await executeWorkflow(parsedWorkflow.data, data.user_id, payload);

  if (run) {
    await supabase
      .from("execution_runs")
      .update({ status: result.status, error: result.error ?? null, finished_at: new Date().toISOString() })
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
  }

  return NextResponse.json({ status: result.status });
}
