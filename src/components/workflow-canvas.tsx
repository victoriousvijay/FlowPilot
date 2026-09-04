"use client";

import { useMemo } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  Position,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { Workflow } from "@/domain/workflow";
import { INTEGRATION_LABELS } from "@/integrations/registry-data";
import { cn } from "@/lib/utils";

type StepStatus = "success" | "failed" | "skipped" | undefined;

function WorkflowNode({ data }: { data: { title: string; subtitle: string; status?: StepStatus; kind: string } }) {
  const statusColor =
    data.status === "success"
      ? "border-emerald-500/60"
      : data.status === "failed"
      ? "border-red-500/60"
      : "border-border";

  return (
    <div
      className={cn(
        "min-w-[220px] rounded-lg border bg-surface px-4 py-3 shadow-sm",
        statusColor
      )}
    >
      <div className="text-[10px] uppercase tracking-wide text-muted">{data.kind}</div>
      <div className="mt-1 font-medium text-foreground">{data.title}</div>
      <div className="mt-0.5 text-sm text-muted">{data.subtitle}</div>
    </div>
  );
}

const nodeTypes = { workflowNode: WorkflowNode };

export function WorkflowCanvas({
  workflow,
  stepStatuses,
}: {
  workflow: Workflow;
  stepStatuses?: Record<string, StepStatus>;
}) {
  const { nodes, edges } = useMemo(() => {
    const nodes: Node[] = [
      {
        id: workflow.trigger.id,
        type: "workflowNode",
        position: { x: 0, y: 0 },
        data: {
          kind: "Trigger",
          title: INTEGRATION_LABELS[workflow.trigger.integration] ?? workflow.trigger.integration,
          subtitle: workflow.trigger.event,
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      },
      ...workflow.steps.map((step, i) => ({
        id: step.id,
        type: "workflowNode",
        position: { x: 0, y: (i + 1) * 130 },
        data: {
          kind: "Action",
          title: INTEGRATION_LABELS[step.integration] ?? step.integration,
          subtitle: step.action,
          status: stepStatuses?.[step.id],
        },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      })),
    ];

    const chain = [workflow.trigger.id, ...workflow.steps.map((s) => s.id)];
    const edges: Edge[] = chain.slice(1).map((id, i) => ({
      id: `${chain[i]}-${id}`,
      source: chain[i],
      target: id,
      animated: false,
    }));

    return { nodes, edges };
  }, [workflow, stepStatuses]);

  return (
    <div className="h-[420px] w-full overflow-hidden rounded-lg border border-border bg-background">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Background gap={20} />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
