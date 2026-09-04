import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { INTEGRATION_LABELS } from "@/integrations/registry-data";

const STEPS = [
  {
    title: "Describe it",
    body: "Tell FlowPilot what you want to automate in plain English — no nodes, no docs to read first.",
  },
  {
    title: "Review the workflow",
    body: "AI generates a validated trigger + step sequence. Inspect it on a visual canvas before anything runs.",
  },
  {
    title: "Test and activate",
    body: "Run it against sample data, check step-by-step results, then flip it on.",
  },
];

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const primaryHref = user ? "/dashboard" : "/signup";
  const primaryLabel = user ? "Go to dashboard" : "Get started free";

  return (
    <div className="flex-1">
      <section className="mx-auto flex max-w-4xl flex-col items-center px-6 pt-24 pb-16 text-center">
        <p className="text-sm font-medium text-accent">AI-first automation</p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
          Describe it. We automate it.
        </h1>
        <p className="mt-4 max-w-xl text-muted">
          Turn a plain-language instruction into a validated, visual, executable workflow —
          no nodes to learn, no code to write.
        </p>
        <div className="mt-8 flex items-center gap-3">
          <Link href={primaryHref}>
            <Button size="md">{primaryLabel}</Button>
          </Link>
          {!user && (
            <Link href="/signin">
              <Button size="md" variant="secondary">
                Sign in
              </Button>
            </Link>
          )}
        </div>
        <p className="mt-4 max-w-lg text-xs text-muted">
          e.g. &ldquo;Whenever I receive a new customer email, summarize it with AI, add the
          summary to Google Sheets, and notify Slack.&rdquo;
        </p>
      </section>

      <section className="border-y border-border bg-surface/40 py-16">
        <div className="mx-auto max-w-4xl px-6">
          <h2 className="text-center text-sm font-medium uppercase tracking-wide text-muted">
            How it works
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {STEPS.map((step, i) => (
              <div key={step.title} className="rounded-lg border border-border bg-background p-5">
                <div className="text-sm font-medium text-accent">Step {i + 1}</div>
                <div className="mt-2 font-medium">{step.title}</div>
                <p className="mt-1 text-sm text-muted">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
          Connects with what you already use
        </h2>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {Object.values(INTEGRATION_LABELS).map((label) => (
            <span
              key={label}
              className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="mt-10">
          <Link href={primaryHref}>
            <Button size="md">{primaryLabel}</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
