import { useEffect, useMemo, useRef, useState } from "react";

import {
  Bell,
  BriefcaseBusiness,
  CircleHelp,
  ChevronDown,
  ChevronRight,
  FileText,
  LayoutGrid,
  LogOut,
  Menu,
  MessageSquare,
  Package2,
  Settings2,
  ShieldCheck,
  Sparkles,
  X
} from "lucide-react";

import {
  getPrimaryTenantMembership,
  isGlobalAuditVisible
} from "@operapyme/domain";
import { useTranslation } from "@operapyme/i18n";
import { useTenantTheme } from "@operapyme/ui";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useBackofficeAuth } from "@/app/auth-provider";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggleButton } from "@/components/layout/theme-toggle-button";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";

type ShellNavItemKey =
  | "dashboard"
  | "crm"
  | "catalog"
  | "quotes"
  | "admin"
  | "settings";

interface ShellNavItem {
  to: string;
  key: ShellNavItemKey;
  icon: typeof LayoutGrid;
}

interface BreadcrumbItem {
  label: string;
  to: string;
}

const coreNavItems: ShellNavItem[] = [
  {
    to: "/",
    key: "dashboard",
    icon: LayoutGrid
  },
  {
    to: "/crm",
    key: "crm",
    icon: MessageSquare
  },
  {
    to: "/catalog",
    key: "catalog",
    icon: Package2
  },
  {
    to: "/quotes",
    key: "quotes",
    icon: FileText
  }
];

const platformNavItems: ShellNavItem[] = [
  {
    to: "/admin",
    key: "admin",
    icon: ShieldCheck
  },
  {
    to: "/settings",
    key: "settings",
    icon: Settings2
  }
];

function useDismissibleLayer<T extends HTMLElement>(
  isOpen: boolean,
  onClose: () => void
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    function handlePointerDown(event: PointerEvent) {
      if (
        ref.current &&
        event.target instanceof Node &&
        !ref.current.contains(event.target)
      ) {
        onClose();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return ref;
}

function getInitials(value: string) {
  const parts = value
    .split(/[\s@._-]+/)
    .map((part) => part.trim())
    .filter(Boolean)
    .slice(0, 2);

  if (parts.length === 0) {
    return "OP";
  }

  return parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
}

function getRouteLabelKey(segment: string) {
  if (segment === "crm") {
    return "navigation.crm";
  }

  if (segment === "catalog") {
    return "navigation.catalog";
  }

  if (segment === "quotes") {
    return "navigation.quotes";
  }

  if (segment === "admin") {
    return "navigation.admin";
  }

  if (segment === "settings") {
    return "navigation.settings";
  }

  if (segment === "errors") {
    return "navigation.errors";
  }

  return "navigation.dashboard";
}

function getBreadcrumbs(
  pathname: string,
  t: (key: string) => string
): BreadcrumbItem[] {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return [
      {
        label: t("navigation.dashboard"),
        to: "/"
      }
    ];
  }

  const breadcrumbs: BreadcrumbItem[] = [
    {
      label: t("navigation.dashboard"),
      to: "/"
    }
  ];

  let nextPath = "";

  for (const segment of segments) {
    nextPath += `/${segment}`;
    breadcrumbs.push({
      label: t(getRouteLabelKey(segment)),
      to: nextPath
    });
  }

  return breadcrumbs;
}

function getBottomTabItems(navItems: ShellNavItem[]) {
  const bottomKeys: ShellNavItemKey[] = [
    "dashboard",
    "crm",
    "catalog",
    "quotes"
  ];

  return navItems.filter((item) => bottomKeys.includes(item.key));
}

function getUserLabel(
  displayName: string | null | undefined,
  email: string | null | undefined
) {
  if (displayName && displayName.trim().length > 0) {
    return displayName;
  }

  if (email && email.trim().length > 0) {
    return email;
  }

  return "OperaPyme";
}

export function AppShell() {
  const { t } = useTranslation("common");
  const { paletteId } = useTenantTheme();
  const location = useLocation();
  const {
    accessContext,
    activeTenantId,
    setActiveTenantId,
    signOut,
    user
  } = useBackofficeAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const activeTenantMembership = getPrimaryTenantMembership(
    accessContext,
    activeTenantId
  );
  const navItems = useMemo(
    () =>
      [
        ...coreNavItems,
        ...platformNavItems.filter((item) =>
          item.key === "admin" ? isGlobalAuditVisible(accessContext) : true
        )
      ] satisfies ShellNavItem[],
    [accessContext]
  );
  const bottomTabItems = useMemo(() => getBottomTabItems(navItems), [navItems]);
  const breadcrumbs = useMemo(
    () => getBreadcrumbs(location.pathname, t),
    [location.pathname, t]
  );
  const notificationItems = useMemo(
    () => [
      {
        id: "tenant",
        tone: "info" as const,
        title: t("shell.notifications.tenantTitle"),
        description: activeTenantMembership
          ? t("shell.notifications.tenantDescription", {
              tenant: activeTenantMembership.tenantName
            })
          : t("shell.notifications.tenantFallback")
      },
      {
        id: "theme",
        tone: "success" as const,
        title: t("shell.notifications.appearanceTitle"),
        description: t("shell.notifications.appearanceDescription", {
          palette: t(`theme.palettes.${paletteId}.name`)
        })
      },
      {
        id: "governance",
        tone: "warning" as const,
        title: accessContext?.isGlobalAdmin
          ? t("shell.notifications.governanceAdminTitle")
          : t("shell.notifications.governanceTitle"),
        description: accessContext?.isGlobalAdmin
          ? t("shell.notifications.governanceAdminDescription")
          : t("shell.notifications.governanceDescription")
      }
    ],
    [accessContext?.isGlobalAdmin, activeTenantMembership, paletteId, t]
  );
  const notificationCount = notificationItems.length;
  const isSecondaryRoute =
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/admin");
  const displayName = getUserLabel(accessContext?.displayName, user?.email);
  const userSubtitle = accessContext?.isGlobalAdmin
    ? t("shell.globalAdmin")
    : t("shell.tenantOperator");
  const userInitials = getInitials(displayName);
  const notificationLayerRef = useDismissibleLayer<HTMLDivElement>(
    isNotificationsOpen,
    () => setIsNotificationsOpen(false)
  );
  const profileLayerRef = useDismissibleLayer<HTMLDivElement>(isProfileOpen, () =>
    setIsProfileOpen(false)
  );

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsNotificationsOpen(false);
    setIsProfileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSidebarOpen]);

  return (
    <div className="min-h-screen">
      {isSidebarOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden" role="presentation">
          <button
            type="button"
            className="absolute inset-0 bg-ink/45 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
            aria-label={t("shell.closeMenuLabel")}
          />
          <aside
            aria-label={t("shell.primaryNavigationLabel")}
            className="relative flex h-full w-full max-w-sm flex-col border-r border-line/70 bg-paper/96 px-5 py-5 shadow-soft"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex size-11 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-sky-300 via-sage-300 to-peach-300 text-ink shadow-panel">
                  <Sparkles className="size-5" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {t("shell.productName")}
                  </p>
                  <p className="text-xs text-ink-soft">{t("shell.mobileBadge")}</p>
                </div>
              </div>

              <button
                type="button"
                className="inline-flex size-11 items-center justify-center rounded-full border border-line/70 bg-paper text-ink shadow-panel transition hover:bg-sand-strong/70"
                onClick={() => setIsSidebarOpen(false)}
                aria-label={t("shell.closeMenuLabel")}
              >
                <X className="size-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 flex-1 space-y-6 overflow-y-auto pb-6">
              <div className="rounded-4xl border border-line/70 bg-linear-to-br from-paper via-paper to-sky-200/45 p-4 shadow-panel">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">
                      {t("shell.tenantLabel")}
                    </p>
                    <p className="text-base font-semibold text-ink">
                      {activeTenantMembership?.tenantName ??
                        t("shell.tenantFallback")}
                    </p>
                    <p className="text-sm leading-6 text-ink-soft">
                      {t("shell.workspaceDescription")}
                    </p>
                  </div>
                  <StatusPill tone="success">
                    {t(`theme.palettes.${paletteId}.name`)}
                  </StatusPill>
                </div>

                {accessContext?.memberships?.length ? (
                  <div className="mt-4 space-y-2">
                    <label
                      htmlFor="tenant-switcher-mobile"
                      className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted"
                    >
                      {t("shell.tenantSwitcherLabel")}
                    </label>
                    <Select
                      id="tenant-switcher-mobile"
                      value={activeTenantMembership?.tenantId ?? ""}
                      onChange={(event) => {
                        setActiveTenantId(event.target.value);
                      }}
                    >
                      {accessContext.memberships.map((membership) => (
                        <option key={membership.tenantId} value={membership.tenantId}>
                          {membership.tenantName}
                        </option>
                      ))}
                    </Select>
                  </div>
                ) : null}
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">
                  {t("shell.quickActionsTitle")}
                </p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <NavLink
                    to="/crm"
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong bg-paper/95 px-4 text-sm font-medium text-ink shadow-panel transition hover:bg-sand-strong/80"
                  >
                    {t("shell.quickActionLead")}
                  </NavLink>
                  <NavLink
                    to="/quotes"
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-4 text-sm font-medium text-brand-contrast shadow-soft transition hover:bg-brand-hover"
                  >
                    {t("shell.quickActionQuote")}
                  </NavLink>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">
                  {t("shell.sidebarCoreLabel")}
                </p>
                <div className="space-y-2">
                  {coreNavItems.map(({ to, key, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      end={to === "/"}
                      className={({ isActive }) =>
                        cn(
                          "flex min-h-12 items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-medium transition",
                          isActive
                            ? "border-sage-300 bg-sage-200/75 text-ink shadow-panel"
                            : "border-transparent bg-paper/60 text-ink-soft hover:border-line/70 hover:bg-paper/90 hover:text-ink"
                        )
                      }
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-sand-strong/85">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span>{t(`navigation.${key}`)}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">
                  {t("shell.sidebarPlatformLabel")}
                </p>
                <div className="space-y-2">
                  {navItems
                    .filter((item) =>
                      platformNavItems.some((platformItem) => platformItem.key === item.key)
                    )
                    .map(({ to, key, icon: Icon }) => (
                      <NavLink
                        key={to}
                        to={to}
                        className={({ isActive }) =>
                          cn(
                            "flex min-h-12 items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-medium transition",
                            isActive
                              ? "border-sage-300 bg-sage-200/75 text-ink shadow-panel"
                              : "border-transparent bg-paper/60 text-ink-soft hover:border-line/70 hover:bg-paper/90 hover:text-ink"
                          )
                        }
                      >
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-sand-strong/85">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span>{t(`navigation.${key}`)}</span>
                      </NavLink>
                    ))}
                </div>
              </div>
            </div>

            <div className="border-t border-line/70 pt-4">
              <div className="grid gap-3 sm:grid-cols-[1fr_auto] sm:items-end">
                <div className="max-w-40">
                  <LanguageSwitcher />
                </div>
                <ThemeToggleButton />
              </div>
            </div>
          </aside>
        </div>
      ) : null}

      <div className="flex min-h-screen">
        <aside className="hidden w-80 shrink-0 border-r border-line/70 bg-paper/70 px-6 py-6 backdrop-blur-xl lg:flex lg:flex-col">
          <div className="flex items-center gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-3xl bg-linear-to-br from-sky-300 via-sage-300 to-peach-300 text-ink shadow-panel">
              <BriefcaseBusiness className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0">
              <p className="truncate text-lg font-semibold tracking-tight text-ink">
                {t("shell.productName")}
              </p>
              <p className="text-sm text-ink-soft">{t("shell.badge")}</p>
            </div>
          </div>

          <div className="mt-8 rounded-4xl border border-line/70 bg-linear-to-br from-paper via-paper to-sky-200/40 p-5 shadow-panel">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">
                  {t("shell.tenantLabel")}
                </p>
                <p className="text-lg font-semibold text-ink">
                  {activeTenantMembership?.tenantName ?? t("shell.tenantFallback")}
                </p>
                <p className="text-sm leading-6 text-ink-soft">
                  {activeTenantMembership
                    ? t("shell.workspaceTenantDescription", {
                        tenant: activeTenantMembership.tenantName
                      })
                    : t("shell.workspaceDescription")}
                </p>
              </div>
              <StatusPill tone="success">
                {t(`theme.palettes.${paletteId}.name`)}
              </StatusPill>
            </div>

            {accessContext?.memberships?.length ? (
              <div className="mt-4 space-y-2">
                <label
                  htmlFor="tenant-switcher"
                  className="text-xs font-medium uppercase tracking-[0.18em] text-ink-muted"
                >
                  {t("shell.tenantSwitcherLabel")}
                </label>
                <Select
                  id="tenant-switcher"
                  value={activeTenantMembership?.tenantId ?? ""}
                  onChange={(event) => {
                    setActiveTenantId(event.target.value);
                  }}
                >
                  {accessContext.memberships.map((membership) => (
                    <option key={membership.tenantId} value={membership.tenantId}>
                      {membership.tenantName}
                    </option>
                  ))}
                </Select>
              </div>
            ) : null}

            <div className="mt-4 grid gap-2 xl:grid-cols-2">
              <NavLink
                to="/crm"
                className="inline-flex min-h-12 items-center justify-center rounded-full border border-line-strong bg-paper/95 px-4 text-sm font-medium text-ink shadow-panel transition hover:bg-sand-strong/80"
              >
                {t("shell.quickActionLead")}
              </NavLink>
              <NavLink
                to="/quotes"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-4 text-sm font-medium text-brand-contrast shadow-soft transition hover:bg-brand-hover"
              >
                {t("shell.quickActionQuote")}
              </NavLink>
            </div>
          </div>

          <nav className="mt-8 space-y-6" aria-label={t("shell.primaryNavigationLabel")}>
            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">
                {t("shell.sidebarCoreLabel")}
              </p>
              <div className="space-y-2">
                {coreNavItems.map(({ to, key, icon: Icon }) => (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "group flex min-h-12 items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-medium transition",
                        isActive
                          ? "border-sage-300 bg-sage-200/75 text-ink shadow-panel"
                          : "border-transparent bg-paper/55 text-ink-soft hover:border-line/70 hover:bg-paper/90 hover:text-ink"
                      )
                    }
                  >
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-sand-strong/85 transition group-hover:bg-sand-strong">
                      <Icon className="size-4" aria-hidden="true" />
                    </span>
                    <span>{t(`navigation.${key}`)}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs font-medium uppercase tracking-[0.22em] text-ink-muted">
                {t("shell.sidebarPlatformLabel")}
              </p>
              <div className="space-y-2">
                {navItems
                  .filter((item) =>
                    platformNavItems.some((platformItem) => platformItem.key === item.key)
                  )
                  .map(({ to, key, icon: Icon }) => (
                    <NavLink
                      key={to}
                      to={to}
                      className={({ isActive }) =>
                        cn(
                          "group flex min-h-12 items-center gap-3 rounded-3xl border px-4 py-3 text-sm font-medium transition",
                          isActive
                            ? "border-sage-300 bg-sage-200/75 text-ink shadow-panel"
                            : "border-transparent bg-paper/55 text-ink-soft hover:border-line/70 hover:bg-paper/90 hover:text-ink"
                        )
                      }
                    >
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-sand-strong/85 transition group-hover:bg-sand-strong">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <span>{t(`navigation.${key}`)}</span>
                    </NavLink>
                  ))}
              </div>
            </div>
          </nav>

          <div className="mt-auto rounded-4xl border border-line/70 bg-linear-to-br from-paper via-paper to-peach-200/45 p-5 shadow-panel">
            <div className="flex items-center gap-2">
              <CircleHelp className="size-4 text-ink" aria-hidden="true" />
              <p className="text-sm font-semibold text-ink">
                {t("shell.designTitle")}
              </p>
            </div>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {t("shell.designDescription")}
            </p>
          </div>
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/72 backdrop-blur-xl">
            <div className="mx-auto flex w-full max-w-screen-2xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex min-w-0 flex-1 items-center gap-3">
                <button
                  type="button"
                  className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line/70 bg-paper/92 text-ink shadow-panel transition hover:bg-sand-strong/80 lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                  aria-label={t("shell.mobileMenuLabel")}
                >
                  <Menu className="size-5" aria-hidden="true" />
                </button>

                <div className="min-w-0">
                  <nav
                    aria-label={t("shell.breadcrumbsLabel")}
                    className="flex min-w-0 items-center gap-1 overflow-x-auto text-sm text-ink-soft"
                  >
                    {breadcrumbs.map((item, index) => {
                      const isLast = index === breadcrumbs.length - 1;

                      return (
                        <div key={item.to} className="flex items-center gap-1">
                          {index > 0 ? (
                            <ChevronRight
                              className="size-4 shrink-0 text-ink-muted"
                              aria-hidden="true"
                            />
                          ) : null}
                          {isLast ? (
                            <span className="truncate font-semibold text-ink">
                              {item.label}
                            </span>
                          ) : (
                            <NavLink
                              to={item.to}
                              className="truncate transition hover:text-ink"
                            >
                              {item.label}
                            </NavLink>
                          )}
                        </div>
                      );
                    })}
                  </nav>
                  <p className="mt-1 truncate text-xs leading-5 text-ink-soft">
                    {activeTenantMembership
                      ? t("shell.workspaceTenantDescription", {
                          tenant: activeTenantMembership.tenantName
                        })
                      : t("shell.workspaceDescription")}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                {activeTenantMembership ? (
                  <StatusPill tone="neutral" className="hidden md:inline-flex">
                    {activeTenantMembership.tenantSlug}
                  </StatusPill>
                ) : null}

                <div ref={notificationLayerRef} className="relative">
                  <button
                    type="button"
                    className="relative inline-flex size-11 items-center justify-center rounded-full border border-line/70 bg-paper/92 text-ink shadow-panel transition hover:bg-sand-strong/80"
                    aria-label={t("shell.openNotificationsLabel")}
                    aria-expanded={isNotificationsOpen}
                    onClick={() =>
                      setIsNotificationsOpen((currentValue) => !currentValue)
                    }
                  >
                    <Bell className="size-4" aria-hidden="true" />
                    <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[11px] font-semibold text-brand-contrast">
                      {notificationCount}
                    </span>
                  </button>

                  {isNotificationsOpen ? (
                    <div className="absolute right-0 top-full mt-3 w-80 rounded-4xl border border-line/70 bg-paper/98 p-4 shadow-soft">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-ink">
                            {t("shell.notifications.title")}
                          </p>
                          <p className="text-xs leading-5 text-ink-soft">
                            {t("shell.notifications.description")}
                          </p>
                        </div>
                        <StatusPill tone="info">{notificationCount}</StatusPill>
                      </div>

                      <div className="mt-4 space-y-3">
                        {notificationItems.map((item) => (
                          <div
                            key={item.id}
                            className="rounded-3xl border border-line/70 bg-paper/82 p-3"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="space-y-1">
                                <p className="text-sm font-medium text-ink">
                                  {item.title}
                                </p>
                                <p className="text-sm leading-6 text-ink-soft">
                                  {item.description}
                                </p>
                              </div>
                              <StatusPill tone={item.tone} className="shrink-0">
                                {t("shell.notifications.newBadge")}
                              </StatusPill>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="hidden xl:block">
                  <LanguageSwitcher />
                </div>

                <ThemeToggleButton />

                <div ref={profileLayerRef} className="relative">
                  <button
                    type="button"
                    className="inline-flex min-h-12 items-center gap-3 rounded-full border border-line/70 bg-paper/92 px-2.5 py-1.5 text-left shadow-panel transition hover:bg-sand-strong/75"
                    aria-label={t("shell.profileMenuLabel")}
                    aria-expanded={isProfileOpen}
                    onClick={() => setIsProfileOpen((currentValue) => !currentValue)}
                  >
                    <span className="flex size-9 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                      {userInitials}
                    </span>
                    <span className="hidden min-w-0 sm:flex sm:flex-col">
                      <span className="truncate text-sm font-semibold text-ink">
                        {displayName}
                      </span>
                      <span className="truncate text-xs text-ink-soft">
                        {userSubtitle}
                      </span>
                    </span>
                    <ChevronDown className="hidden size-4 text-ink-muted sm:block" />
                  </button>

                  {isProfileOpen ? (
                    <div className="absolute right-0 top-full mt-3 w-72 rounded-4xl border border-line/70 bg-paper/98 p-4 shadow-soft">
                      <div className="rounded-3xl border border-line/70 bg-paper/82 p-4">
                        <div className="flex items-center gap-3">
                          <span className="flex size-11 items-center justify-center rounded-full bg-ink text-sm font-semibold text-paper">
                            {userInitials}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-ink">
                              {displayName}
                            </p>
                            <p className="truncate text-xs text-ink-soft">
                              {user?.email ?? t("shell.emailFallback")}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          <StatusPill tone="neutral">{userSubtitle}</StatusPill>
                          <StatusPill tone="success">
                            {t(`theme.palettes.${paletteId}.name`)}
                          </StatusPill>
                        </div>
                      </div>

                      <Button
                        className="mt-4 w-full"
                        variant="secondary"
                        onClick={() => {
                          void signOut();
                        }}
                      >
                        <LogOut className="mr-2 size-4" aria-hidden="true" />
                        {t("shell.signOut")}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pb-10 lg:pt-8">
            <div className="mx-auto w-full max-w-7xl">
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
          {bottomTabItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex min-h-12 flex-col items-center justify-center rounded-full px-2 text-[11px] font-medium transition",
                  isActive
                    ? "bg-sage-200/80 text-ink"
                    : "text-ink-soft hover:bg-paper hover:text-ink"
                )
              }
            >
              <Icon className="mb-1 size-4" aria-hidden="true" />
              <span>{t(`navigation.${key}`)}</span>
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center rounded-full px-2 text-[11px] font-medium transition",
              isSecondaryRoute
                ? "bg-sage-200/80 text-ink"
                : "text-ink-soft hover:bg-paper hover:text-ink"
            )}
            aria-label={t("shell.mobileMenuLabel")}
          >
            <Menu className="mb-1 size-4" aria-hidden="true" />
            <span>{t("navigation.more")}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
