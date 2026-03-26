import {
  Boxes,
  ChartNoAxesCombined,
  FileText,
  MessageSquare,
  Settings2
} from "lucide-react";

import { useTranslation } from "@operapyme/i18n";
import { useTenantTheme } from "@operapyme/ui";
import { NavLink, Outlet } from "react-router-dom";

import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggleButton } from "@/components/layout/theme-toggle-button";
import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";

const navItems = [
  {
    to: "/",
    key: "dashboard",
    icon: ChartNoAxesCombined
  },
  {
    to: "/crm",
    key: "crm",
    icon: MessageSquare
  },
  {
    to: "/catalog",
    key: "catalog",
    icon: Boxes
  },
  {
    to: "/quotes",
    key: "quotes",
    icon: FileText
  },
  {
    to: "/settings",
    key: "settings",
    icon: Settings2
  }
];

export function AppShell() {
  const { t } = useTranslation("common");
  const { paletteId } = useTenantTheme();

  return (
    <div className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-[1600px]">
        <aside className="hidden w-80 flex-col border-r border-line/70 bg-paper/45 px-6 py-8 backdrop-blur-xl lg:flex">
          <div className="space-y-4">
            <StatusPill tone="success" className="w-fit">
              {t("shell.badge")}
            </StatusPill>
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.24em] text-ink-muted">
                {t("shell.productName")}
              </p>
              <h1 className="text-3xl font-semibold tracking-tight text-ink">
                {t("shell.title")}
              </h1>
              <p className="text-sm leading-6 text-ink-soft">
                {t("shell.description")}
              </p>
            </div>
          </div>

          <nav
            className="mt-10 space-y-2"
            aria-label={t("shell.primaryNavigationLabel")}
          >
            {navItems.map(({ to, key, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) =>
                  cn(
                    "flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-medium transition",
                    isActive
                      ? "bg-sage-200/80 text-ink shadow-panel"
                      : "text-ink-soft hover:bg-paper/80 hover:text-ink"
                  )
                }
              >
                <Icon className="size-4" aria-hidden="true" />
                <span>{t(`navigation.${key}`)}</span>
              </NavLink>
            ))}
          </nav>

          <div className="mt-auto rounded-[26px] border border-line/70 bg-linear-to-br from-sky-200/70 via-paper to-peach-200/75 p-5 shadow-panel">
            <p className="text-sm font-medium text-ink">
              {t("shell.designTitle")}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {t("shell.designDescription")}
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen flex-1 flex-col">
          <header className="sticky top-0 z-20 border-b border-line/70 bg-paper/65 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs uppercase tracking-[0.24em] text-ink-muted sm:hidden">
                  {t("shell.productName")}
                </p>
                <p className="text-sm font-semibold text-ink">
                  {t("shell.workspaceTitle")}
                </p>
                <p className="text-xs leading-5 text-ink-soft">
                  {t("shell.workspaceDescription")}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggleButton />
                <LanguageSwitcher />
                <div className="hidden items-center gap-2 sm:flex">
                  <StatusPill tone="success">
                    {t(`theme.palettes.${paletteId}.name`)}
                  </StatusPill>
                  <StatusPill tone="info">{t("shell.foundationBadge")}</StatusPill>
                  <StatusPill tone="neutral">{t("shell.rbacBadge")}</StatusPill>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      <nav
        aria-label={t("shell.mobileNavigationLabel")}
        className="fixed inset-x-4 bottom-4 z-30 rounded-full border border-line/70 bg-paper/88 px-3 py-2 shadow-soft backdrop-blur-xl lg:hidden"
      >
        <div className="grid grid-cols-5 gap-1">
          {navItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex min-h-12 flex-col items-center justify-center rounded-full px-2 text-[11px] font-medium transition",
                  isActive
                    ? "bg-sage-200/80 text-ink"
                    : "text-ink-soft hover:bg-paper"
                  )
                }
              >
                <Icon className="mb-1 size-4" aria-hidden="true" />
                <span>{t(`navigation.${key}`)}</span>
              </NavLink>
            ))}
        </div>
      </nav>
    </div>
  );
}
