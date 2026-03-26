import type { InputHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-line bg-paper/90 px-4 text-sm text-ink shadow-none outline-none transition placeholder:text-ink-muted/80 focus:border-brand focus:bg-paper",
        className
      )}
      {...props}
    />
  );
});

Input.displayName = "Input";
