import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "About — FlowPilot" };

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-2xl flex-1 px-6 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">About FlowPilot</h1>
      <p className="mt-4 text-muted">
        FlowPilot makes business automation accessible to non-technical users by letting them
        describe what they want in plain language. AI translates that description into a
        structured, validated workflow you can inspect, edit, test, and run — the visual editor
        is the control surface, not the starting point.
      </p>

      <h2 className="mt-10 text-lg font-medium">How it works</h2>
      <p className="mt-2 text-muted">
        Every automation is represented as a versioned workflow document: one trigger, an ordered
        list of steps, each mapped to a registered integration and action. AI output is never
        executed directly — it&apos;s validated against that schema before it can be saved or run.
      </p>

      <h2 className="mt-10 text-lg font-medium">Principles</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-muted">
        <li>AI-first, not node-first — natural language is the primary input.</li>
        <li>Every AI-generated workflow is validated before it can execute.</li>
        <li>Secrets never touch the browser or the workflow definition itself.</li>
        <li>Integrations are modular adapters behind a single registry.</li>
      </ul>

      <div className="mt-10">
        <Link href="/signup">
          <Button>Get started free</Button>
        </Link>
      </div>
    </div>
  );
}
