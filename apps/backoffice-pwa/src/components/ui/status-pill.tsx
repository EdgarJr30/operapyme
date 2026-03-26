import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type StatusTone = "neutral" | "success" | "info" | "warning";

const toneClasses: Record<StatusTone, string> = {
  neutral: "bg-paper/80 text-ink-soft border-line",
  success: "bg-sage-200/70 text-ink border-sage-300",
  info: "bg-sky-200/70 text-ink border-sky-300",
  warning: "bg-peach-200/70 text-ink border-peach-300"
};

interface StatusPillProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: StatusTone;
}

export function StatusPill({
  className,
  tone = "neutral",
  ...props
}: StatusPillProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-9 items-center rounded-full border px-3 text-xs font-medium tracking-[0.02em]",
        toneClasses[tone],
        className
      )}
      {...props}
    />
  );
}
