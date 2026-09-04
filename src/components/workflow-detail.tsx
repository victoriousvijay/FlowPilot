"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/input";
import { WorkflowCanvas } from "@/components/workflow-canvas";
import type { Workflow } from "@/domain/workflow";

type StepResult = { stepId: string; status: "success" | "failed" | "skipped"; output?: unknown; error?: string };

export function WorkflowDetail({
  id,
  status,
  workflow,
}: {
  id: string;
  status: string;
  workflow: Workflow;
}) {
  const router = useRouter();
  const [currentStatus, setCurrentStatus] = useState(status);
  const [testInput, setTestInput] = useState("{}");
  const [testing, setTesting] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [result, setResult] = useState<{ status: string; steps: StepResult[]; error?: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const stepStatuses = result
    ? Object.fromEntries(result.steps.map((s) => [s.stepId, s.status]))
    : undefined;

  async function handleTest() {
    setTesting(true);
    setError(null);
    setResult(null);
    let payload: unknown = {};
    try {
      payload = testInput.trim() ? JSON.parse(testInput) : {};
    } catch {
      setError("Test input must be valid JSON");
      setTesting(false);
      return;
    }
    try {
      const res = await fetch(`/api/workflows/${id}/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Test run failed");
      } else {
        setResult(data);
      }
    } catch {
      setError("Test run failed");
    } finally {
      setTesting(false);
    }
  }

  async function handleToggleActive() {
    setToggling(true);
    setError(null);
    const endpoint = currentStatus === "active" ? "deactivate" : "activate";
    try {
      const res = await fetch(`/api/workflows/${id}/${endpoint}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to update status");
      } else {
        setCurrentStatus(endpoint === "activate" ? "active" : "paused");
        router.refresh();
      }
    } catch {
      setError("Failed to update status");
    } finally {
      setToggling(false);
    }
  }

  const webhookUrl =
    workflow.trigger.integration === "webhook" && typeof window !== "undefined"
      ? `${window.location.origin}/api/webhooks/${id}`
      : null;

  return (
    <div className="mx-auto w-full max-w-4xl flex-1 px-6 py-10">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight">{workflow.name}</h1>
            <Badge status={currentStatus}>{currentStatus}</Badge>
          </div>
          {workflow.description && <p className="mt-1 text-muted">{workflow.description}</p>}
        </div>
        <Button
          variant={currentStatus === "active" ? "secondary" : "primary"}
          onClick={handleToggleActive}
          disabled={toggling}
        >
          {toggling ? "Updating…" : currentStatus === "active" ? "Deactivate" : "Activate"}
        </Button>
      </div>

      {webhookUrl && (
        <p className="mt-3 truncate rounded-md border border-border bg-surface px-3 py-2 text-xs text-muted">
          Webhook URL: <span className="text-foreground">{webhookUrl}</span>
        </p>
      )}

      {error && (
        <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <div className="mt-6">
        <WorkflowCanvas workflow={workflow} stepStatuses={stepStatuses} />
      </div>

      <div className="mt-8 rounded-lg border border-border p-5">
        <h2 className="font-medium">Test this workflow</h2>
        <p className="mt-1 text-sm text-muted">
          Provide sample trigger data (JSON) and run the workflow to see step-level results.
        </p>
        <Textarea
          rows={4}
          className="mt-3 font-mono"
          value={testInput}
          onChange={(e) => setTestInput(e.target.value)}
        />
        <div className="mt-3">
          <Button onClick={handleTest} disabled={testing}>
            {testing ? "Running…" : "Run test"}
          </Button>
        </div>

        {result && (
          <div className="mt-5 space-y-2">
            <Badge status={result.status}>{result.status}</Badge>
            {result.steps.map((s) => (
              <div key={s.stepId} className="rounded-md border border-border bg-surface p-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-muted">{s.stepId}</span>
                  <Badge status={s.status}>{s.status}</Badge>
                </div>
                {s.error && <p className="mt-1 text-red-300">{s.error}</p>}
                {s.output !== undefined && (
                  <pre className="mt-1 overflow-x-auto text-xs text-muted">
                    {JSON.stringify(s.output, null, 2)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
