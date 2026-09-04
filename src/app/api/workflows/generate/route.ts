import { NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/api-auth";
import { generateWorkflowFromPrompt, WorkflowGenerationError } from "@/lib/generate-workflow";

const RequestSchema = z.object({
  prompt: z.string().min(1, "Prompt is required").max(4000),
});

export async function POST(request: Request) {
  const { unauthorized } = await requireUser();
  if (unauthorized) return unauthorized;

  const body = await request.json().catch(() => null);
  const parsed = RequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  try {
    const { workflow, warnings } = await generateWorkflowFromPrompt(parsed.data.prompt);
    return NextResponse.json({ workflow, warnings });
  } catch (err) {
    if (err instanceof WorkflowGenerationError) {
      return NextResponse.json({ error: err.message, details: err.details }, { status: 422 });
    }
    console.error("Workflow generation failed", err);
    return NextResponse.json({ error: "Workflow generation failed" }, { status: 500 });
  }
}
