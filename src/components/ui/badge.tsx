import { cn } from "@/lib/utils";

const statusClasses: Record<string, string> = {
  draft: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  active: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  paused: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  success: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  failed: "bg-red-500/15 text-red-300 border-red-500/30",
  skipped: "bg-zinc-500/15 text-zinc-300 border-zinc-500/30",
  running: "bg-accent/15 text-accent border-accent/30",
};

export function Badge({ status, children }: { status?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize",
        status ? statusClasses[status] ?? "bg-surface text-muted border-border" : "bg-surface text-muted border-border"
      )}
    >
      {children}
    </span>
  );
}
