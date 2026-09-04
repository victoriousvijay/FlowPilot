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
  { label: "Gmail", detail: "new_email" },
  { label: "Anthropic", detail: "summarize" },
  { label: "Google Sheets", detail: "create_row" },
  { label: "Slack", detail: "send_message" },
];

function MockCanvas() {
  return (
    <div className="relative mx-auto mt-14 w-full max-w-md">
      <div className="flex flex-col items-center gap-3">
        {MOCK_NODES.map((node, i) => (
          <motion.div
            key={node.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.4, ease: "easeOut" }}
            className="w-full"
          >
            <div className="glass-card animate-float-slow rounded-xl px-4 py-3 shadow-lg" style={{ animationDelay: `${i * 0.4}s` }}>
              <div className="text-[10px] uppercase tracking-wide text-muted">
                {i === 0 ? "Trigger" : "Action"}
              </div>
              <div className="mt-0.5 flex items-center justify-between">
                <span className="font-medium">{node.label}</span>
                <span className="text-xs text-muted">{node.detail}</span>
              </div>
            </div>
            {i < MOCK_NODES.length - 1 && (
              <div className="mx-auto h-4 w-px bg-gradient-to-b from-border to-transparent" />
            )}
          </motion.div>
        ))}
      </div>
    </div>
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
    <section className="relative overflow-hidden px-6 pt-24 pb-16">
      <div className="hero-backdrop" />
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center text-center">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="text-sm font-medium text-accent"
        >
          AI-first automation
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-gradient mt-3 max-w-2xl text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          Describe it. We automate it.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 max-w-xl text-muted"
        >
          Turn a plain-language instruction into a validated, visual, executable workflow —
          no nodes to learn, no code to write.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 flex items-center gap-3"
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
          className="mt-4 max-w-lg text-xs text-muted"
        >
          e.g. &ldquo;Whenever I receive a new customer email, summarize it with AI, add the
          summary to Google Sheets, and notify Slack.&rdquo;
        </motion.p>

        <MockCanvas />
      </div>
    </section>
  );
}

export function LandingSteps() {
  return (
    <section className="border-y border-border bg-surface/40 py-16">
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
              className="rounded-lg border border-border bg-background p-5 transition-colors hover:border-accent/40"
            >
              <div className="text-sm font-medium text-accent">Step {i + 1}</div>
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
  return (
    <section className="mx-auto max-w-4xl px-6 py-16 text-center">
      <h2 className="text-sm font-medium uppercase tracking-wide text-muted">
        Connects with what you already use
      </h2>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {labels.map((label, i) => (
          <motion.span
            key={label}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06, duration: 0.3 }}
            whileHover={{ y: -2 }}
            className="rounded-full border border-border bg-surface px-4 py-1.5 text-sm text-foreground transition-colors hover:border-accent/50"
          >
            {label}
          </motion.span>
        ))}
      </div>
    </section>
  );
}

export function LandingCTA({ primaryHref, primaryLabel }: { primaryHref: string; primaryLabel: string }) {
  return (
    <section className="relative overflow-hidden px-6 py-20 text-center">
      <div className="mx-auto max-w-lg">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
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
