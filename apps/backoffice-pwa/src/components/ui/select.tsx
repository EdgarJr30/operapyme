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
        "h-12 w-full rounded-xl border border-line bg-paper/90 px-3 text-sm text-ink outline-none transition focus:border-brand focus:bg-paper sm:h-11",
        className
      )}
      {...props}
    />
  );
});

Select.displayName = "Select";
