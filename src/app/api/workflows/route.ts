import { NextResponse } from "next/server";
import { WorkflowSchema, validateWorkflowSemantics } from "@/domain/workflow";
import { requireUser } from "@/lib/api-auth";

export async function GET() {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { data, error } = await supabase
    .from("workflows")
    .select("id, name, description, status, current_version, created_at, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Failed to load workflows" }, { status: 500 });
  }
  return NextResponse.json({ workflows: data });
}

export async function POST(request: Request) {
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

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

  const workflow = parsed.data;
  const { data, error } = await supabase
    .from("workflows")
    .insert({
      user_id: user.id,
      name: workflow.name,
      description: workflow.description ?? null,
      status: workflow.status,
      definition: workflow,
      current_version: workflow.version,
    })
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Failed to save workflow" }, { status: 500 });
  }

  await supabase.from("workflow_versions").insert({
    workflow_id: data.id,
    version: workflow.version,
    definition: workflow,
  });

  return NextResponse.json({ id: data.id }, { status: 201 });
}
