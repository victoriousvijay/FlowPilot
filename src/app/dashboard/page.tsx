import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/signin");

  const [{ data: workflows }, { data: runs }] = await Promise.all([
    supabase
      .from("workflows")
      .select("id, name, description, status, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false }),
    supabase
      .from("execution_runs")
      .select("status, started_at, finished_at")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(200),
  ]);

  const activeCount = workflows?.filter((w) => w.status === "active").length ?? 0;
  const totalRuns = runs?.length ?? 0;
  const failedRuns = runs?.filter((r) => r.status === "failed").length ?? 0;
  const successRate = totalRuns > 0 ? Math.round(((totalRuns - failedRuns) / totalRuns) * 100) : null;

  const durations = (runs ?? [])
    .filter((r) => r.finished_at)
    .map((r) => (new Date(r.finished_at!).getTime() - new Date(r.started_at).getTime()) / 1000)
    .filter((s) => s >= 0);
  const avgRuntime =
    durations.length > 0 ? (durations.reduce((a, b) => a + b, 0) / durations.length).toFixed(2) : null;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-sm text-muted">
            All the automations and executions you have access to.
          </p>
        </div>
        <Link href="/new">
          <Button>Create automation</Button>
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Automations" value={String(workflows?.length ?? 0)} />
        <StatCard label="Active" value={String(activeCount)} />
        <StatCard label="Executions" value={String(totalRuns)} />
        <StatCard
          label="Success rate"
          value={successRate === null ? "—" : `${successRate}%`}
        />
      </div>

      {avgRuntime && (
        <p className="mt-3 text-xs text-muted">Average run time: {avgRuntime}s</p>
      )}

      {!workflows || workflows.length === 0 ? (
        <div className="mt-8 rounded-lg border border-dashed border-border p-12 text-center text-muted">
          No automations yet. Describe what you want to automate to get started.
        </div>
      ) : (
        <div className="mt-8 divide-y divide-border rounded-lg border border-border">
          {workflows.map((w) => (
            <Link
              key={w.id}
              href={`/workflows/${w.id}`}
              className="flex items-center justify-between px-5 py-4 transition-colors hover:bg-surface"
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
