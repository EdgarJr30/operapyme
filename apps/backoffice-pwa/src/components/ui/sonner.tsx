import type { CSSProperties } from "react";

import { useTheme } from "next-themes";
import {
  Toaster as Sonner,
  type ToasterProps
} from "sonner";

import { cn } from "@/lib/utils";

const toastStyle = {
  "--normal-bg": "var(--color-paper)",
  "--normal-text": "var(--color-ink)",
  "--normal-border": "var(--color-line)",
  "--success-bg": "var(--color-paper)",
  "--success-text": "var(--color-ink)",
  "--success-border": "var(--color-sage-300)",
  "--error-bg": "var(--color-paper)",
  "--error-text": "var(--color-ink)",
  "--error-border": "var(--color-peach-300)",
  "--warning-bg": "var(--color-paper)",
  "--warning-text": "var(--color-ink)",
  "--warning-border": "var(--color-butter-200)",
  "--info-bg": "var(--color-paper)",
  "--info-text": "var(--color-ink)",
  "--info-border": "var(--color-sky-300)"
} as CSSProperties;

export function Toaster(props: ToasterProps) {
  const { resolvedTheme = "system" } = useTheme();

  return (
    <Sonner
      closeButton
      duration={4200}
      offset={16}
      position="top-center"
      theme={resolvedTheme as ToasterProps["theme"]}
      toastOptions={{
        classNames: {
          toast: cn(
            "rounded-3xl border border-line bg-paper text-ink shadow-panel"
          ),
          title: "text-sm font-semibold text-ink",
          description: "text-sm leading-6 text-ink-soft",
          actionButton:
            "rounded-full bg-brand px-4 text-sm font-medium text-brand-contrast hover:bg-brand-hover",
          cancelButton:
            "rounded-full border border-line bg-paper px-4 text-sm font-medium text-ink hover:bg-sand",
          closeButton:
            "border border-line bg-paper text-ink-soft hover:bg-sand",
          success: "border-sage-300/80",
          error: "border-peach-300/80",
          warning: "border-butter-200/90",
          info: "border-sky-300/80"
        },
        style: toastStyle
      }}
      visibleToasts={4}
      {...props}
    />
  );
}
