import { useEffect, useMemo, useRef, useState } from "react";

import {
  Bell,
  ChevronDown,
  ChevronRight,
  CirclePlus,
  FileText,
  House,
  LogOut,
  Menu,
  Package2,
  Search,
  Settings2,
  ShieldCheck,
  Store,
  UsersRound,
  X
} from "lucide-react";

import {
  getPrimaryTenantMembership,
  isGlobalAuditVisible
} from "@operapyme/domain";
import { useTranslation } from "@operapyme/i18n";
import {
  AnimatePresence,
  motion
} from "motion/react";
import { NavLink, Outlet, useLocation } from "react-router-dom";

import { useBackofficeAuth } from "@/app/auth-provider";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggleButton } from "@/components/layout/theme-toggle-button";
import {
  fadeOverlayVariants,
  pageTransitionVariants,
  popoverVariants,
  slideOverVariants
} from "@/lib/motion";
import { Select } from "@/components/ui/select";
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
  icon: typeof House;
}

interface SidebarSection {
  labelKey: "shell.sidebarCoreLabel" | "shell.sidebarPlatformLabel";
  items: ShellNavItem[];
}

interface RouteMeta {
  labelKey: string;
  descriptionKey: string;
}

const businessNavItems: ShellNavItem[] = [
  {
    to: "/",
    key: "dashboard",
    icon: House
  },
  {
    to: "/crm",
    key: "crm",
    icon: UsersRound
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
    to: "/settings",
    key: "settings",
    icon: Settings2
  },
  {
    to: "/admin",
    key: "admin",
    icon: ShieldCheck
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

function getRouteMeta(pathname: string): RouteMeta {
  if (pathname.startsWith("/crm")) {
    return {
      labelKey: "navigation.crm",
      descriptionKey: "shell.pageDescriptions.crm"
    };
  }

  if (pathname.startsWith("/catalog")) {
    return {
      labelKey: "navigation.catalog",
      descriptionKey: "shell.pageDescriptions.catalog"
    };
  }

  if (pathname.startsWith("/quotes")) {
    return {
      labelKey: "navigation.quotes",
      descriptionKey: "shell.pageDescriptions.quotes"
    };
  }

  if (pathname.startsWith("/admin/errors")) {
    return {
      labelKey: "navigation.errors",
      descriptionKey: "shell.pageDescriptions.errors"
    };
  }

  if (pathname.startsWith("/admin")) {
    return {
      labelKey: "navigation.admin",
      descriptionKey: "shell.pageDescriptions.admin"
    };
  }

  if (pathname.startsWith("/settings")) {
    return {
      labelKey: "navigation.settings",
      descriptionKey: "shell.pageDescriptions.settings"
    };
  }

  return {
    labelKey: "navigation.dashboard",
    descriptionKey: "shell.pageDescriptions.dashboard"
  };
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

function getBottomTabItems(navItems: ShellNavItem[]) {
  const bottomKeys: ShellNavItemKey[] = ["dashboard", "crm", "quotes"];

  return navItems.filter((item) => bottomKeys.includes(item.key));
}

function getRoleLabel(
  isGlobalAdmin: boolean | undefined,
  tenantRoleKeys: string[] | undefined,
  t: (key: string) => string
) {
  if (isGlobalAdmin) {
    return t("shell.globalAdmin");
  }

  if (tenantRoleKeys?.includes("tenant_owner")) {
    return t("shell.tenantOwner");
  }

  return t("shell.tenantOperator");
}

function SidebarContent({
  sections,
  activeTenantId,
  activeTenantName,
  businessRoleLabel,
  memberships,
  onTenantChange,
  onNavigate,
  onSignOut,
  t
}: {
  sections: SidebarSection[];
  activeTenantId: string;
  activeTenantName: string;
  businessRoleLabel: string;
  memberships: Array<{ tenantId: string; tenantName: string }>;
  onTenantChange: (tenantId: string) => void;
  onNavigate: () => void;
  onSignOut: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className="flex h-full flex-col bg-paper">
      <div className="px-5 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="flex size-11 items-center justify-center rounded-2xl bg-brand text-brand-contrast shadow-panel">
            <Store className="size-5" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-2xl font-semibold tracking-tight text-ink">
              {t("shell.productName")}
            </p>
            <p className="truncate text-sm text-ink-soft">{t("shell.badge")}</p>
          </div>
        </div>

        <div className="mt-8 flex items-center gap-3">
          <div className="flex size-12 items-center justify-center rounded-full bg-sand text-sm font-semibold text-ink">
            {getInitials(activeTenantName)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-ink">
              {activeTenantName}
            </p>
            <p className="truncate text-sm text-ink-soft">{businessRoleLabel}</p>
          </div>
        </div>

        <div className="mt-6 border-t border-line/70 pt-5">
          <label
            htmlFor="tenant-switcher-sidebar"
            className="text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted"
          >
            {t("shell.tenantSwitcherLabel")}
          </label>
          <Select
            id="tenant-switcher-sidebar"
            value={activeTenantId}
            className="mt-2 h-11 rounded-xl border-line/70 bg-paper text-sm"
            onChange={(event) => onTenantChange(event.target.value)}
          >
            {memberships.map((membership) => (
              <option key={membership.tenantId} value={membership.tenantId}>
                {membership.tenantName}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {sections.map((section) => (
          <div key={section.labelKey} className="mt-5 first:mt-0">
            <p className="px-2 text-xs font-semibold uppercase tracking-[0.22em] text-ink-muted">
              {t(section.labelKey)}
            </p>
            <div className="mt-3 space-y-1.5">
              {section.items.map(({ to, key, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === "/"}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      "group flex min-h-11 items-center gap-3 rounded-xl border-l-4 px-3 py-2.5 text-[15px] font-medium transition",
                      isActive
                        ? "border-brand bg-butter-200/70 text-ink"
                        : "border-transparent text-ink-soft hover:bg-sand/70 hover:text-ink"
                    )
                  }
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg text-ink-soft transition group-hover:bg-paper group-hover:text-ink">
                    <Icon className="size-4.5" aria-hidden="true" />
                  </span>
                  <span>{t(`navigation.${key}`)}</span>
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-line/70 px-3 py-4">
        <button
          type="button"
          onClick={onSignOut}
          className="flex min-h-11 w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-medium text-red-600 transition hover:bg-red-50"
        >
          <LogOut className="size-4.5" aria-hidden="true" />
          <span>{t("shell.signOut")}</span>
        </button>
      </div>
    </div>
  );
}

export function AppShell() {
  const { t } = useTranslation("common");
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const activeTenantMembership = getPrimaryTenantMembership(
    accessContext,
    activeTenantId
  );
  const navItems = useMemo(
    () =>
      [
        ...businessNavItems,
        ...platformNavItems.filter((item) =>
          item.key === "admin" ? isGlobalAuditVisible(accessContext) : true
        )
      ] satisfies ShellNavItem[],
    [accessContext]
  );
  const sections = useMemo<SidebarSection[]>(
    () => [
      {
        labelKey: "shell.sidebarCoreLabel",
        items: businessNavItems
      },
      {
        labelKey: "shell.sidebarPlatformLabel",
        items: navItems.filter((item) =>
          platformNavItems.some((platformItem) => platformItem.key === item.key)
        )
      }
    ],
    [navItems]
  );
  const bottomTabItems = useMemo(() => getBottomTabItems(navItems), [navItems]);
  const routeMeta = getRouteMeta(location.pathname);
  const businessRoleLabel = getRoleLabel(
    accessContext?.isGlobalAdmin,
    activeTenantMembership?.tenantRoleKeys,
    t
  );
  const userLabel = getUserLabel(accessContext?.displayName, user?.email);
  const userInitials = getInitials(userLabel);
  const notificationItems = useMemo(
    () => [
      {
        id: "tenant",
        title: t("shell.notifications.tenantTitle"),
        description: activeTenantMembership
          ? t("shell.notifications.tenantDescription", {
              tenant: activeTenantMembership.tenantName
            })
          : t("shell.notifications.tenantFallback")
      },
      {
        id: "access",
        title: accessContext?.isGlobalAdmin
          ? t("shell.notifications.governanceAdminTitle")
          : t("shell.notifications.governanceTitle"),
        description: accessContext?.isGlobalAdmin
          ? t("shell.notifications.governanceAdminDescription")
          : t("shell.notifications.governanceDescription")
      }
    ],
    [accessContext?.isGlobalAdmin, activeTenantMembership, t]
  );
  const notificationLayerRef = useDismissibleLayer<HTMLDivElement>(
    isNotificationsOpen,
    () => setIsNotificationsOpen(false)
  );
  const userLayerRef = useDismissibleLayer<HTMLDivElement>(isUserMenuOpen, () =>
    setIsUserMenuOpen(false)
  );
  const activeTenantName =
    activeTenantMembership?.tenantName ?? t("shell.tenantFallback");
  const memberships =
    accessContext?.memberships.map((membership) => ({
      tenantId: membership.tenantId,
      tenantName: membership.tenantName
    })) ?? [];
  const isBottomMenuActive =
    location.pathname.startsWith("/catalog") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/admin");

  useEffect(() => {
    setIsSidebarOpen(false);
    setIsNotificationsOpen(false);
    setIsUserMenuOpen(false);
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

  const handleSignOut = () => {
    void signOut();
  };

  return (
    <div className="min-h-screen bg-sand/40">
      <AnimatePresence>
        {isSidebarOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              className="absolute inset-0 bg-ink/35"
              onClick={() => setIsSidebarOpen(false)}
              aria-label={t("shell.closeMenuLabel")}
              variants={fadeOverlayVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            />
            <motion.div
              className="relative h-full w-full max-w-xs shadow-soft"
              variants={slideOverVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <button
                type="button"
                onClick={() => setIsSidebarOpen(false)}
                className="absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-xl border border-line/70 bg-paper text-ink shadow-panel"
                aria-label={t("shell.closeMenuLabel")}
              >
                <X className="size-5" aria-hidden="true" />
              </button>
              <SidebarContent
                sections={sections}
                activeTenantId={activeTenantMembership?.tenantId ?? ""}
                activeTenantName={activeTenantName}
                businessRoleLabel={businessRoleLabel}
                memberships={memberships}
                onTenantChange={setActiveTenantId}
                onNavigate={() => setIsSidebarOpen(false)}
                onSignOut={handleSignOut}
                t={t}
              />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <div className="flex min-h-screen">
        <aside className="hidden w-72 shrink-0 border-r border-line/70 bg-paper lg:block">
          <SidebarContent
            sections={sections}
            activeTenantId={activeTenantMembership?.tenantId ?? ""}
            activeTenantName={activeTenantName}
            businessRoleLabel={businessRoleLabel}
            memberships={memberships}
            onTenantChange={setActiveTenantId}
            onNavigate={() => undefined}
            onSignOut={handleSignOut}
            t={t}
          />
        </aside>

        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-screen-2xl items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
              <button
                type="button"
                onClick={() => setIsSidebarOpen(true)}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl border border-line/70 bg-paper text-ink shadow-panel lg:hidden"
                aria-label={t("shell.mobileMenuLabel")}
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>

              <div className="min-w-0 flex-1">
                <div className="flex min-w-0 items-center gap-1 text-sm text-ink-soft">
                  <NavLink to="/" className="truncate transition hover:text-ink">
                    {t("navigation.dashboard")}
                  </NavLink>
                  <ChevronRight className="size-4 shrink-0 text-ink-muted" />
                  <span className="truncate font-semibold text-ink">
                    {t(routeMeta.labelKey)}
                  </span>
                </div>
                <p className="mt-1 truncate text-xs leading-5 text-ink-soft">
                  {t(routeMeta.descriptionKey)}
                </p>
              </div>

              <div className="hidden w-full max-w-sm lg:block">
                <label htmlFor="workspace-search" className="sr-only">
                  {t("shell.searchLabel")}
                </label>
                <div className="relative">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-ink-muted"
                    aria-hidden="true"
                  />
                  <input
                    id="workspace-search"
                    name="workspace-search"
                    type="search"
                    placeholder={t("shell.searchPlaceholder")}
                    className="h-11 w-full rounded-xl border border-line/70 bg-paper px-10 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-line-strong"
                  />
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <div ref={notificationLayerRef} className="relative">
                  <button
                    type="button"
                    onClick={() =>
                      setIsNotificationsOpen((currentValue) => !currentValue)
                    }
                    className="relative inline-flex size-10 items-center justify-center rounded-xl border border-line/70 bg-paper text-ink shadow-panel transition hover:bg-sand/70"
                    aria-label={t("shell.openNotificationsLabel")}
                    aria-expanded={isNotificationsOpen}
                  >
                    <Bell className="size-4.5" aria-hidden="true" />
                    <span className="absolute -right-1 -top-1 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-semibold text-white">
                      {notificationItems.length}
                    </span>
                  </button>

                  <AnimatePresence>
                    {isNotificationsOpen ? (
                      <motion.div
                        className="absolute right-0 top-full mt-3 w-80 rounded-2xl border border-line/70 bg-paper p-4 shadow-soft"
                        variants={popoverVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-ink">
                            {t("shell.notifications.title")}
                          </p>
                          <p className="text-xs leading-5 text-ink-soft">
                            {t("shell.notifications.description")}
                          </p>
                        </div>

                        <div className="mt-4 space-y-3">
                          {notificationItems.map((item) => (
                            <div
                              key={item.id}
                              className="rounded-xl border border-line/70 bg-sand/40 p-3"
                            >
                              <p className="text-sm font-semibold text-ink">
                                {item.title}
                              </p>
                              <p className="mt-1 text-sm leading-6 text-ink-soft">
                                {item.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <ThemeToggleButton />

                <div ref={userLayerRef} className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen((currentValue) => !currentValue)}
                    className="inline-flex min-h-11 items-center gap-3 rounded-xl border border-line/70 bg-paper px-2.5 py-1.5 shadow-panel transition hover:bg-sand/70"
                    aria-label={t("shell.profileMenuLabel")}
                    aria-expanded={isUserMenuOpen}
                  >
                    <span className="flex size-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                      {userInitials}
                    </span>
                    <span className="hidden min-w-0 text-left sm:block">
                      <span className="block truncate text-sm font-semibold text-ink">
                        {userLabel}
                      </span>
                      <span className="block truncate text-xs text-ink-soft">
                        {businessRoleLabel}
                      </span>
                    </span>
                    <ChevronDown className="hidden size-4 text-ink-muted sm:block" />
                  </button>

                  <AnimatePresence>
                    {isUserMenuOpen ? (
                      <motion.div
                        className="absolute right-0 top-full mt-3 w-72 rounded-2xl border border-line/70 bg-paper p-4 shadow-soft"
                        variants={popoverVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                      >
                        <div className="rounded-xl border border-line/70 bg-sand/40 p-4">
                          <p className="truncate text-sm font-semibold text-ink">
                            {userLabel}
                          </p>
                          <p className="mt-1 truncate text-xs text-ink-soft">
                            {user?.email ?? t("shell.emailFallback")}
                          </p>
                          <p className="mt-2 text-xs font-medium uppercase tracking-[0.18em] text-ink-muted">
                            {businessRoleLabel}
                          </p>
                        </div>

                        <div className="mt-4">
                          <LanguageSwitcher />
                        </div>

                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-line-strong bg-paper px-4 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
                        >
                          <LogOut className="size-4" aria-hidden="true" />
                          <span>{t("shell.signOut")}</span>
                        </button>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 pb-24 pt-6 sm:px-6 lg:px-8 lg:pb-8">
            <div className="mx-auto w-full max-w-screen-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  variants={pageTransitionVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      <nav
        aria-label={t("shell.mobileNavigationLabel")}
        className="fixed inset-x-4 bottom-4 z-30 rounded-2xl border border-line/70 bg-paper/96 px-3 py-2 shadow-soft lg:hidden"
      >
        <div className="grid grid-cols-4 gap-1">
          {bottomTabItems.map(({ to, key, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                cn(
                  "flex min-h-12 flex-col items-center justify-center rounded-xl px-2 text-[11px] font-medium transition",
                  isActive
                    ? "bg-butter-200/75 text-ink"
                    : "text-ink-soft hover:bg-sand/70 hover:text-ink"
                )
              }
            >
              <Icon className="mb-1 size-4.5" aria-hidden="true" />
              <span>
                {key === "quotes"
                  ? t("navigation.quotesShort")
                  : t(`navigation.${key}`)}
              </span>
            </NavLink>
          ))}

          <button
            type="button"
            onClick={() => setIsSidebarOpen(true)}
            className={cn(
              "flex min-h-12 flex-col items-center justify-center rounded-xl px-2 text-[11px] font-medium transition",
              isBottomMenuActive
                ? "bg-butter-200/75 text-ink"
                : "text-ink-soft hover:bg-sand/70 hover:text-ink"
            )}
            aria-label={t("shell.mobileMenuLabel")}
          >
            <Menu className="mb-1 size-4.5" aria-hidden="true" />
            <span>{t("navigation.more")}</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
