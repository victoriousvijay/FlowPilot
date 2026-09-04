import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const { data: workflows } = await supabase
    .from("workflows")
    .select("id, name, description, status, updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Your automations</h1>
        <Link href="/new">
          <Button>New automation</Button>
        </Link>
      </div>

      {!workflows || workflows.length === 0 ? (
        <div className="mt-12 rounded-lg border border-dashed border-border p-12 text-center text-muted">
          No automations yet. Describe what you want to automate to get started.
        </div>
      ) : (
        <div className="mt-8 divide-y divide-border rounded-lg border border-border">
          {workflows.map((w) => (
            <Link
              key={w.id}
              href={`/workflows/${w.id}`}
              className="flex items-center justify-between px-5 py-4 hover:bg-surface"
            >
              <div>
                <div className="font-medium">{w.name}</div>
                {w.description && <div className="text-sm text-muted">{w.description}</div>}
              </div>
              <Badge status={w.status}>{w.status}</Badge>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
