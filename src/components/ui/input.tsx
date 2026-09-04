import * as React from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-border bg-surface px-3 text-sm text-foreground placeholder:text-muted transition-colors duration-150 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/30",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted transition-colors duration-150 outline-none focus:border-accent/60 focus:ring-2 focus:ring-accent/30",
        className
      )}
      {...props}
    />
  );
}
