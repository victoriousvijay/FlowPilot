import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { WorkflowSchema } from "@/domain/workflow";
import { WorkflowDetail } from "@/components/workflow-detail";

export default async function WorkflowPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("workflows")
    .select("id, status, definition")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) notFound();

  const parsed = WorkflowSchema.safeParse(data.definition);
  if (!parsed.success) notFound();

  return <WorkflowDetail id={data.id} status={data.status} workflow={parsed.data} />;
}
