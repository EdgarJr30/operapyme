import { useEffect, useState } from "react";

import { useTranslation } from "@operapyme/i18n";
import { Monitor, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";
type ResolvedThemeOption = "light" | "dark";

function isThemeOption(value: string | undefined): value is ThemeOption {
  return value === "light" || value === "dark" || value === "system";
}

function isResolvedTheme(value: string | undefined): value is ResolvedThemeOption {
  return value === "light" || value === "dark";
}

function getNextTheme(
  theme: ThemeOption,
  resolvedTheme: ResolvedThemeOption
): ResolvedThemeOption {
  if (theme === "dark") {
    return "light";
  }

  if (theme === "light") {
    return "dark";
  }

  return resolvedTheme === "dark" ? "light" : "dark";
}

export function ThemeToggleButton() {
  const { t } = useTranslation("common");
  const { resolvedTheme, setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeTheme = isThemeOption(theme) ? theme : "system";
  const activeResolvedTheme = isResolvedTheme(resolvedTheme)
    ? resolvedTheme
    : "light";
  const nextTheme = getNextTheme(activeTheme, activeResolvedTheme);
  const Icon =
    activeTheme === "system"
      ? Monitor
      : activeResolvedTheme === "dark"
        ? MoonStar
        : SunMedium;

  return (
    <button
      type="button"
      disabled={!isMounted}
      title={t(
        nextTheme === "dark" ? "theme.switchToDark" : "theme.switchToLight"
      )}
      aria-label={t(
        nextTheme === "dark" ? "theme.switchToDark" : "theme.switchToLight"
      )}
      onClick={() => setTheme(nextTheme)}
      className={cn(
        "inline-flex size-10 min-w-10 cursor-pointer items-center justify-center rounded-xl border border-line/70 bg-paper text-ink shadow-panel transition hover:bg-sand/70 disabled:cursor-not-allowed disabled:opacity-60 sm:size-9 sm:min-w-9"
      )}
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}
