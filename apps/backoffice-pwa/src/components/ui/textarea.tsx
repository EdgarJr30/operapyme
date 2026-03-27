import type { TextareaHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-28 w-full rounded-2xl border border-line bg-paper/90 px-3 py-2.5 text-sm text-ink shadow-none outline-none transition placeholder:text-ink-muted/80 focus:border-brand focus:bg-paper",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
