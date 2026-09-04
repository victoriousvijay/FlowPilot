"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

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

const MOCK_NODES = [
  { label: "Gmail", detail: "new_email", kind: "Trigger" },
  { label: "Anthropic", detail: "summarize", kind: "Action" },
  { label: "Google Sheets", detail: "create_row", kind: "Action" },
  { label: "Slack", detail: "send_message", kind: "Action" },
];

function PreviewCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25, ease: "easeOut" }}
      className="card-elevated mx-auto mt-16 grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl text-left sm:grid-cols-[240px_1fr]"
    >
      <div className="border-b border-border p-6 sm:border-b-0 sm:border-r">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground text-sm font-semibold">
          FP
        </div>
        <div className="mt-4 text-xs text-muted">Customer email intake</div>
        <div className="mt-1 font-medium">New lead automation</div>
        <p className="mt-1 text-sm text-muted">
          Summarize new emails with AI, log to Sheets, notify Slack.
        </p>
        <div className="mt-4 space-y-2 text-xs text-muted">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> 4 steps
          </div>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" /> ~2 min avg. run
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 p-6">
        {MOCK_NODES.map((node, i) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 + i * 0.08, duration: 0.35 }}
            className="rounded-lg border border-border bg-surface px-3 py-2.5"
          >
            <div className="text-[10px] uppercase tracking-wide text-muted">{node.kind}</div>
            <div className="mt-0.5 flex items-center justify-between gap-2">
              <span className="text-sm font-medium">{node.label}</span>
            </div>
            <div className="mt-0.5 text-xs text-muted">{node.detail}</div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export function LandingHero({
  primaryHref,
  primaryLabel,
  loggedIn,
}: {
  primaryHref: string;
  primaryLabel: string;
  loggedIn: boolean;
}) {
  return (
    <section className="px-6 pt-20 pb-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted transition-colors hover:text-foreground"
          >
            FlowPilot is in early access
            <span aria-hidden>→</span>
          </Link>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-6 max-w-2xl text-5xl font-semibold tracking-tight sm:text-6xl"
        >
          The better way to automate your busywork
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-5 max-w-lg text-lg text-muted"
        >
          Describe an automation in plain English. FlowPilot generates a validated, visual
          workflow you can test and activate in minutes.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row"
        >
          <Link href={primaryHref}>
            <Button size="lg">{primaryLabel}</Button>
          </Link>
          {!loggedIn && (
            <Link href="/signin">
              <Button size="lg" variant="secondary">
                Sign in
              </Button>
            </Link>
          )}
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-3 text-xs text-muted"
        >
          No credit card required
        </motion.p>

        <PreviewCard />
      </div>
    </section>
  );
}

export function LandingSteps() {
  return (
    <section id="how-it-works" className="border-y border-border bg-surface/60 py-16 scroll-mt-16">
      <div className="mx-auto max-w-4xl px-6">
        <h2 className="text-center text-sm font-medium uppercase tracking-wide text-muted">
          How it works
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.1, duration: 0.4, ease: "easeOut" }}
              className="rounded-xl border border-border bg-background p-5 transition-colors hover:border-foreground/30"
            >
              <div className="text-sm font-medium text-muted">Step {i + 1}</div>
              <div className="mt-2 font-medium">{step.title}</div>
              <p className="mt-1 text-sm text-muted">{step.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingIntegrations({ labels }: { labels: string[] }) {
  const loop = [...labels, ...labels];
  return (
    <section className="overflow-hidden py-16 text-center">
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
        Connects with what you already use
      </h2>
      <div className="relative mt-6 mask-fade-x">
        <div className="marquee-track gap-3">
          {loop.map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="mx-1.5 shrink-0 rounded-full border border-border bg-background px-4 py-1.5 text-sm text-foreground transition-colors hover:border-foreground/30"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function LandingCTA({ primaryHref, primaryLabel }: { primaryHref: string; primaryLabel: string }) {
  return (
    <section className="border-t border-border px-6 py-24 text-center">
      <div className="mx-auto max-w-lg">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
          Go from idea to working automation in minutes.
        </h2>
        <div className="mt-8">
          <Link href={primaryHref}>
            <Button size="lg">{primaryLabel}</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
