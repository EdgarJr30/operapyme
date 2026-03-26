import type { SelectHTMLAttributes } from "react";
import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "h-12 w-full rounded-2xl border border-line bg-paper/90 px-4 text-sm text-ink outline-none transition focus:border-brand focus:bg-paper",
        className
      )}
      {...props}
    />
  );
});

Select.displayName = "Select";
