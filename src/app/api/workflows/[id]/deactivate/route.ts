import { NextResponse } from "next/server";
import { requireUser } from "@/lib/api-auth";

type Params = { params: Promise<{ id: string }> };

export async function POST(_request: Request, { params }: Params) {
  const { id } = await params;
  const { user, supabase, unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const { data: existing, error: fetchError } = await supabase
    .from("workflows")
    .select("id, definition")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (fetchError || !existing) {
    return NextResponse.json({ error: "Workflow not found" }, { status: 404 });
  }

  const definition = { ...(existing.definition as Record<string, unknown>), status: "paused" };
  const { error } = await supabase
    .from("workflows")
    .update({ status: "paused", definition, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Failed to deactivate workflow" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
