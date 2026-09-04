"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const INTEGRATIONS = [
  { id: "slack", label: "Slack", hint: "Paste an Incoming Webhook URL" },
  { id: "google_sheets", label: "Google Sheets", hint: "Paste an OAuth access token" },
  { id: "gmail", label: "Gmail", hint: "Paste an OAuth access token" },
] as const;

export function CredentialsForm({
  existing,
}: {
  existing: { integration: string; display_name: string; updated_at: string }[];
}) {
  const router = useRouter();
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const connected = new Map(existing.map((c) => [c.integration, c]));

  async function handleSave(integration: string, formData: FormData) {
    setSaving(integration);
    setError(null);
    const displayName = String(formData.get("displayName") || integration);
    const secret = String(formData.get("secret") || "");
    try {
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ integration, displayName, secret }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save connection");
      } else {
        router.refresh();
      }
    } catch {
      setError("Failed to save connection");
    } finally {
      setSaving(null);
    }
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-md border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}
      {INTEGRATIONS.map((integration) => {
        const isConnected = connected.has(integration.id);
        return (
          <form
            key={integration.id}
            action={(fd) => handleSave(integration.id, fd)}
            className="rounded-lg border border-border p-4"
          >
            <div className="flex items-center justify-between">
              <div className="font-medium">{integration.label}</div>
              {isConnected && <Badge status="active">Connected</Badge>}
            </div>
            <p className="mt-1 text-sm text-muted">{integration.hint}</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <Input name="displayName" placeholder="Label (e.g. Team Slack)" />
              <Input name="secret" type="password" placeholder="Secret / token" required />
              <Button type="submit" size="sm" disabled={saving === integration.id}>
                {saving === integration.id ? "Saving…" : isConnected ? "Update" : "Connect"}
              </Button>
            </div>
          </form>
        );
      })}
    </div>
  );
}
