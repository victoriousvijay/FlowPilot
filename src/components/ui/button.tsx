import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-foreground shadow-[0_0_0_1px_rgba(129,140,248,0.4),0_8px_24px_-8px_rgba(129,140,248,0.5)] hover:brightness-110 active:scale-[0.98]",
  secondary:
    "bg-surface text-foreground border border-border hover:border-accent/50 hover:bg-border/40 active:scale-[0.98]",
  ghost: "bg-transparent text-foreground hover:bg-surface active:scale-[0.98]",
  danger: "bg-red-600 text-white hover:bg-red-500 active:scale-[0.98]",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size }) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
