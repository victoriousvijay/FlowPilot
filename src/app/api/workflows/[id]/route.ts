import { NextResponse } from "next/server";
import { WorkflowSchema, validateWorkflowSemantics } from "@/domain/workflow";
import { requireUser } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabase
    .from("workflows")
    .select("id, name, description, status, definition, current_version, created_at, updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }
  return NextResponse.json({ workflow: data });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { data: existing, error: fetchError } = await supabase
    .from("workflows")
    .select("id, current_version")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const parsed = WorkflowSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid workflow", details: parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`) },
      { status: 400 }
    );
  }

  const semanticErrors = validateWorkflowSemantics(parsed.data);
  if (semanticErrors.length > 0) {
    return NextResponse.json({ error: "Invalid workflow", details: semanticErrors }, { status: 400 });
  }

  const workflow = { ...parsed.data, version: existing.current_version + 1 };

  const { error: updateError } = await supabase
    .from("workflows")
    .update({
      name: workflow.name,
      description: workflow.description ?? null,
      status: workflow.status,
      definition: workflow,
      current_version: workflow.version,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (updateError) {
    return NextResponse.json({ error: "Failed to update workflow" }, { status: 500 });
  }

  await supabase.from("workflow_versions").insert({
    workflow_id: id,
    version: workflow.version,
    definition: workflow,
  });

  return NextResponse.json({ workflow });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { error } = await supabase.from("workflows").delete().eq("id", id).eq("user_id", user.id);
  if (error) {
    return NextResponse.json({ error: "Failed to delete workflow" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
