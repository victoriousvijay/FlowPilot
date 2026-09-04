"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/input";
import { WorkflowCanvas } from "@/components/workflow-canvas";
import type { Workflow } from "@/domain/workflow";

type State = "idle" | "generating" | "generated" | "saving" | "error";

export function CreateAutomation() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const [state, setState] = useState<State>("idle");
  const [workflow, setWorkflow] = useState<Workflow | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!prompt.trim()) return;
    setState("generating");
    setError(null);
    try {
      const res = await fetch("/api/workflows/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.details?.join(", ") || data.error || "Generation failed");
        setState("error");
        return;
      }
      setWorkflow(data.workflow);
      setWarnings(data.warnings ?? []);
      setState("generated");
    } catch {
      setError("Generation failed");
      setState("error");
    }
  }

  async function handleSave() {
    if (!workflow) return;
    setState("saving");
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workflow),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.details?.join(", ") || data.error || "Save failed");
        setState("error");
        return;
      }
      router.push(`/workflows/${data.id}`);
    } catch {
      setError("Save failed");
      setState("error");
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-6 py-16">
      <div className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight">What do you want to automate?</h1>
        <p className="mt-2 text-muted">
          Describe the automation in plain language. We&apos;ll generate the workflow.
        </p>
      </div>

      <div className="mt-8 space-y-3">
        <Textarea
          rows={4}
          placeholder="Whenever I receive a new customer email, summarize it with AI, add the summary to Google Sheets, and notify Slack."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <div className="flex justify-center">
          <Button onClick={handleGenerate} disabled={state === "generating" || !prompt.trim()}>
            {state === "generating" ? "Generating…" : "Generate automation"}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      {workflow && (
        <div className="mt-10 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-medium">{workflow.name}</h2>
              {workflow.description && <p className="text-sm text-muted">{workflow.description}</p>}
            </div>
            <Button onClick={handleSave} disabled={state === "saving"}>
              {state === "saving" ? "Saving…" : "Save & continue"}
            </Button>
          </div>
          {warnings.length > 0 && (
            <ul className="rounded-md border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          )}
          <WorkflowCanvas workflow={workflow} />
        </div>
      )}
    </div>
  );
}
