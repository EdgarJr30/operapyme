import { useEffect, useMemo, useRef, useState } from "react";

import {
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  LogOut,
  Menu,
  Monitor,
  MoonStar,
  PackageSearch,
  Search,
  SunMedium,
  UserRound
} from "lucide-react";
import {
  getPrimaryTenantMembership,
  hasTenantPermissionForRoleKeys,
  isGlobalAuditVisible
} from "@operapyme/domain";
import { useTranslation } from "@operapyme/i18n";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  BackofficeSidebar,
  businessNavItems,
  getBottomTabItems,
  getRouteMeta,
  platformNavItems,
  type ShellNavItem,
  type SidebarSection
} from "@/components/layout/backoffice-sidebar";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { useTheme } from "next-themes";

import {
  pageTransitionVariants,
  popoverVariants
} from "@/lib/motion";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const SIDEBAR_COLLAPSED_STORAGE_KEY =
  "operapyme:backoffice-sidebar-collapsed:v1";

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

function getUserLabel(
  displayName: string | null | undefined,
  fullName: string | undefined,
  email: string | null | undefined
) {
  if (fullName && fullName.trim().length > 0) {
    return fullName;
  }

  if (displayName && displayName.trim().length > 0) {
    return displayName;
  }

  if (email && email.trim().length > 0) {
    return email;
  }

  return "OperaPyme";
}

function getInitialSidebarCollapsed() {
  if (typeof window === "undefined") {
    return false;
  }

  return (
    window.localStorage.getItem(SIDEBAR_COLLAPSED_STORAGE_KEY) === "1"
  );
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

function getMobileTabIcon(key: string, fallbackIcon: ShellNavItem["icon"]) {
  switch (key) {
    case "commercial":
      return BriefcaseBusiness;
    case "catalog":
      return PackageSearch;
    default:
      return fallbackIcon;
  }
}

export function AppShell() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedTheme, setTheme, theme } = useTheme();
  const activeTheme = theme === "light" || theme === "dark" || theme === "system" ? theme : "system";
  const activeResolvedTheme = resolvedTheme === "dark" ? "dark" : "light";
  const nextTheme = activeTheme === "dark" ? "light" : activeTheme === "light" ? "dark" : activeResolvedTheme === "dark" ? "light" : "dark";
  const ThemeIcon = activeTheme === "system" ? Monitor : activeResolvedTheme === "dark" ? MoonStar : SunMedium;
  const {
    accessContext,
    activeTenantId,
    setActiveTenantId,
    signOut,
    user
  } = useBackofficeAuth();
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(
    getInitialSidebarCollapsed
  );
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const activeTenantMembership = getPrimaryTenantMembership(
    accessContext,
    activeTenantId
  );
  const canAccessSettings = Boolean(
    accessContext?.isGlobalAdmin ||
      hasTenantPermissionForRoleKeys(
        activeTenantMembership?.tenantRoleKeys,
        "tenant.read"
      ) ||
      hasTenantPermissionForRoleKeys(
        activeTenantMembership?.tenantRoleKeys,
        "tenant.update"
      ) ||
      hasTenantPermissionForRoleKeys(
        activeTenantMembership?.tenantRoleKeys,
        "membership.manage"
      )
  );
  const navItems = useMemo(
    () =>
      [
        ...businessNavItems,
        ...platformNavItems.filter((item) =>
          item.key === "admin"
            ? isGlobalAuditVisible(accessContext)
            : item.key === "settings"
              ? canAccessSettings
              : true
        )
      ] satisfies ShellNavItem[],
    [accessContext, canAccessSettings]
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
  const userLabel = getUserLabel(
    accessContext?.displayName,
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : undefined,
    user?.email
  );
  const userEmail = user?.email ?? t("shell.emailFallback");
  const userInitials = getInitials(userLabel);
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
    location.pathname.startsWith("/profile") ||
    location.pathname.startsWith("/settings") ||
    location.pathname.startsWith("/admin");

  useEffect(() => {
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    window.localStorage.setItem(
      SIDEBAR_COLLAPSED_STORAGE_KEY,
      isDesktopSidebarCollapsed ? "1" : "0"
    );
  }, [isDesktopSidebarCollapsed]);

  const handleSignOut = async () => {
    const errorMessage = await signOut();

    if (errorMessage) {
      toast.error(t("shell.signOutError", { message: errorMessage }));
      return;
    }

    toast.success(t("shell.signOutSuccess"));
  };

  const handleOpenProfile = () => {
    setIsUserMenuOpen(false);
    navigate("/profile");
  };

  return (
    <MotionConfig reducedMotion="user">
      <SidebarProvider
        open={!isDesktopSidebarCollapsed}
        onOpenChange={(open) => setIsDesktopSidebarCollapsed(!open)}
        className="bg-paper"
      >
        <BackofficeSidebar
          sections={sections}
          activeTenantId={activeTenantMembership?.tenantId ?? ""}
          activeTenantName={activeTenantName}
          businessRoleLabel={businessRoleLabel}
          memberships={memberships}
          onTenantChange={setActiveTenantId}
          onSignOut={handleSignOut}
          onOpenProfile={handleOpenProfile}
          userEmail={userEmail}
          userLabel={userLabel}
          t={t}
        />

        <SidebarInset>
          <div className="flex min-h-screen min-w-0 flex-col">
            <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/95 backdrop-blur">
              <div className="mx-auto flex w-full max-w-screen-2xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
                <SidebarTrigger
                  className="lg:hidden"
                  aria-label={t("shell.mobileMenuLabel")}
                />

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
                      className="h-10 w-full rounded-xl border border-line/70 bg-paper px-10 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-line-strong"
                    />
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <div ref={userLayerRef} className="relative">
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen((currentValue) => !currentValue)}
                      className="inline-flex min-h-10 cursor-pointer items-center gap-2.5 rounded-xl border border-line/70 bg-paper px-2.5 py-1.5 shadow-panel transition hover:bg-sand/70"
                      aria-label={t("shell.profileMenuLabel")}
                      aria-expanded={isUserMenuOpen}
                    >
                      <span className="flex size-8 items-center justify-center rounded-full bg-ink text-xs font-semibold text-paper">
                        {userInitials}
                      </span>
                      <span className="hidden min-w-0 text-left sm:block">
                        <span className="block truncate text-[13px] font-semibold text-ink">
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
                          className="absolute right-0 top-full mt-3 w-[min(22rem,calc(100vw-1.5rem))] rounded-[28px] border border-line/70 bg-paper p-4 shadow-soft"
                          variants={popoverVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <div className="rounded-3xl border border-line/70 bg-paper p-4 shadow-panel">
                            <div className="flex items-start gap-3">
                              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-ink text-sm font-semibold text-paper">
                                {userInitials}
                              </span>
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-ink">
                                  {userLabel}
                                </p>
                                {userEmail !== userLabel ? (
                                  <p className="mt-1 truncate text-xs text-ink-soft">
                                    {userEmail}
                                  </p>
                                ) : null}
                                <span className="mt-3 inline-flex rounded-full bg-sand px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
                                  {businessRoleLabel}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="mt-4 rounded-3xl border border-line/70 bg-sand/35 p-4">
                            <LanguageSwitcher />
                          </div>

                          <button
                            type="button"
                            onClick={() => setTheme(nextTheme)}
                            className="mt-4 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-line-strong bg-paper px-4 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
                          >
                            <ThemeIcon className="size-4" aria-hidden="true" />
                            <span>{t(nextTheme === "dark" ? "theme.switchToDark" : "theme.switchToLight")}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleOpenProfile}
                            className="mt-4 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-line-strong bg-paper px-4 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
                          >
                            <UserRound className="size-4" aria-hidden="true" />
                            <span>{t("shell.profileAction")}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleSignOut}
                            className="mt-4 flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-line-strong bg-paper px-4 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
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

            <main className="flex-1 px-4 pb-24 pt-5 sm:px-6 lg:px-8 lg:pb-8">
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

          <nav
            aria-label={t("shell.mobileNavigationLabel")}
            className="fixed inset-x-4 bottom-4 z-30 rounded-2xl border border-line/70 bg-paper/96 px-3 py-2 shadow-soft lg:hidden"
          >
            <div className="grid grid-cols-4 gap-1">
              {bottomTabItems.map(({ to, key, icon }) => {
                const Icon = getMobileTabIcon(key, icon);

                return (
                  <NavLink
                    key={to}
                    to={to}
                    end={to === "/"}
                    className={({ isActive }) =>
                      cn(
                        "flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-center text-[11px] font-medium leading-tight transition",
                        isActive
                          ? "bg-butter-200/75 text-ink"
                          : "text-ink-soft hover:bg-sand/70 hover:text-ink"
                      )
                    }
                  >
                    <Icon className="size-4.5 shrink-0" aria-hidden="true" />
                    <span className="block max-w-full text-balance">
                      {key === "quotes"
                        ? t("navigation.quotesShort")
                        : t(`navigation.${key}`)}
                    </span>
                  </NavLink>
                );
              })}

              <SidebarTrigger
                className={cn(
                  "h-auto min-h-14 w-full flex-col items-center justify-center gap-1 rounded-xl border-0 bg-transparent px-2 py-1 text-center text-[11px] font-medium leading-tight shadow-none hover:bg-sand/70 lg:hidden",
                  isBottomMenuActive
                    ? "bg-butter-200/75 text-ink"
                    : "text-ink-soft hover:text-ink"
                )}
                aria-label={t("shell.mobileMenuLabel")}
              >
                <Menu className="size-4.5 shrink-0" aria-hidden="true" />
                <span className="block max-w-full text-balance">
                  {t("navigation.more")}
                </span>
              </SidebarTrigger>
            </div>
          </nav>
        </SidebarInset>
      </SidebarProvider>
    </MotionConfig>
  );
}
