import { useEffect, useState } from "react";

import { useTranslation } from "@operapyme/i18n";
import { Monitor, MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

type ThemeOption = "light" | "dark" | "system";

const themeOptions = [
  {
    value: "light",
    labelKey: "theme.light",
    icon: SunMedium
  },
  {
    value: "dark",
    labelKey: "theme.dark",
    icon: MoonStar
  },
  {
    value: "system",
    labelKey: "theme.system",
    icon: Monitor
  }
] as const;

function isThemeOption(value: string | undefined): value is ThemeOption {
  return value === "light" || value === "dark" || value === "system";
}

export function ThemeSwitcher() {
  const { t } = useTranslation("common");
  const { setTheme, theme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const activeTheme = isMounted && isThemeOption(theme) ? theme : "system";

  return (
    <div
      role="radiogroup"
      aria-label={t("theme.label")}
      className="grid gap-3 sm:grid-cols-3"
    >
      {themeOptions.map(({ icon: Icon, labelKey, value }) => {
        const isActive = activeTheme === value;

        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            disabled={!isMounted}
            onClick={() => setTheme(value)}
            className={cn(
              "flex min-h-24 items-center gap-3 rounded-[24px] border px-4 py-4 text-left transition disabled:cursor-not-allowed disabled:opacity-70",
              isActive
                ? "border-sage-400/70 bg-sage-200/70 text-ink shadow-panel"
                : "border-line/70 bg-paper/72 text-ink-soft hover:bg-paper/90 hover:text-ink"
            )}
          >
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-full border transition",
                isActive
                  ? "border-paper/70 bg-paper/80 text-ink"
                  : "border-line/70 bg-sand-strong/75 text-ink-soft"
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="text-sm font-medium">{t(labelKey)}</span>
          </button>
        );
      })}
    </div>
  );
}
