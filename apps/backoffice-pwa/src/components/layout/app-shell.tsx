import {
  type CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  Bell,
  BookOpenText,
  ChevronLeft,
  ChevronDown,
  ChevronRight,
  FileText,
  House,
  LogOut,
  Menu,
  Package2,
  UserRound,
  Search,
  Settings2,
  ShieldCheck,
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
  MotionConfig,
  motion
} from "motion/react";
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate
} from "react-router-dom";
import { toast } from "sonner";

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
  | "quotesOverview"
  | "quotesNew"
  | "quotesManage"
  | "learning"
  | "admin"
  | "settings";

interface ShellNavItem {
  to: string;
  key: ShellNavItemKey;
  icon: typeof House;
  children?: ShellNavItem[];
}

interface SidebarSection {
  labelKey: "shell.sidebarCoreLabel" | "shell.sidebarPlatformLabel";
  items: ShellNavItem[];
}

interface RouteMeta {
  labelKey: string;
  descriptionKey: string;
}

const SIDEBAR_COLLAPSED_STORAGE_KEY =
  "operapyme:backoffice-sidebar-collapsed:v1";
const DESKTOP_SIDEBAR_EXPANDED_WIDTH = 272;
const DESKTOP_SIDEBAR_COLLAPSED_WIDTH = 88;

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
    icon: FileText,
    children: [
      {
        to: "/quotes",
        key: "quotesOverview",
        icon: FileText
      },
      {
        to: "/quotes/new",
        key: "quotesNew",
        icon: FileText
      },
      {
        to: "/quotes/manage",
        key: "quotesManage",
        icon: FileText
      }
    ]
  }
];

const platformNavItems: ShellNavItem[] = [
  {
    to: "/learning",
    key: "learning",
    icon: BookOpenText
  },
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
    if (pathname.startsWith("/quotes/new")) {
      return {
        labelKey: "navigation.quotesNew",
        descriptionKey: "shell.pageDescriptions.quotesNew"
      };
    }

    if (pathname.startsWith("/quotes/manage")) {
      return {
        labelKey: "navigation.quotesManage",
        descriptionKey: "shell.pageDescriptions.quotesManage"
      };
    }

    return {
      labelKey: "navigation.quotes",
      descriptionKey: "shell.pageDescriptions.quotes"
    };
  }

  if (pathname.startsWith("/learning")) {
    return {
      labelKey: "navigation.learning",
      descriptionKey: "shell.pageDescriptions.learning"
    };
  }

  if (pathname.startsWith("/profile")) {
    return {
      labelKey: "navigation.profile",
      descriptionKey: "shell.pageDescriptions.profile"
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

function getInitialNavGroups(items: SidebarSection[], pathname: string) {
  return items.reduce<Record<string, boolean>>((accumulator, section) => {
    section.items.forEach((item) => {
      if (!item.children?.length) {
        return;
      }

      accumulator[item.key] = item.children.some(
        (child) =>
          pathname === child.to || pathname.startsWith(`${child.to}/`)
      );
    });

    return accumulator;
  }, {});
}

function isItemPathActive(pathname: string, to: string) {
  if (to === "/") {
    return pathname === "/";
  }

  return pathname === to || pathname.startsWith(`${to}/`);
}

function SidebarContent({
  sections,
  activeTenantId,
  activeTenantName,
  businessRoleLabel,
  memberships,
  isCollapsed,
  mode,
  onTenantChange,
  onNavigate,
  onToggleSidebar,
  onSignOut,
  userLabel,
  t
}: {
  sections: SidebarSection[];
  activeTenantId: string;
  activeTenantName: string;
  businessRoleLabel: string;
  memberships: Array<{ tenantId: string; tenantName: string }>;
  isCollapsed: boolean;
  mode: "desktop" | "mobile";
  onTenantChange: (tenantId: string) => void;
  onNavigate: () => void;
  onToggleSidebar: () => void;
  onSignOut: () => void;
  userLabel: string;
  t: (key: string) => string;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const isDesktop = mode === "desktop";
  const showCollapsedLabels = isDesktop && isCollapsed;
  const showTenantSwitcher = memberships.length > 1 && !showCollapsedLabels;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    getInitialNavGroups(sections, location.pathname)
  );
  const footerYear = new Date().getFullYear();
  const footerLegalLabel = t("shell.sidebarFooterLegal")
    .replace("{year}", String(footerYear))
    .replace("{tenant}", activeTenantName);

  useEffect(() => {
    setOpenGroups(getInitialNavGroups(sections, location.pathname));
  }, [location.pathname, sections]);

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-sidebar-surface text-sidebar-text">
      <div className="border-b border-sidebar-border px-3 py-3.5">
        <div
          className={cn(
            "flex items-center",
            showCollapsedLabels ? "justify-center" : "gap-3"
          )}
        >
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-sidebar-border bg-sidebar-elevated shadow-panel">
            <img
              src="/pwa-icon.svg"
              alt={t("shell.productName")}
              className="size-6"
            />
          </div>
          {!showCollapsedLabels ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-base leading-6 font-semibold tracking-tight text-sidebar-text">
                {t("shell.productName")}
              </p>
              <p className="mt-0.5 truncate text-xs leading-5 text-sidebar-muted">
                {activeTenantName}
              </p>
            </div>
          ) : null}
          <button
            type="button"
            onClick={onToggleSidebar}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-sidebar-border bg-sidebar-elevated text-sidebar-text transition hover:border-sidebar-muted hover:bg-sidebar-border"
            aria-label={
              isDesktop
                ? isCollapsed
                  ? t("shell.expandSidebarLabel")
                  : t("shell.collapseSidebarLabel")
                : t("shell.closeMenuLabel")
            }
            title={
              isDesktop
                ? isCollapsed
                  ? t("shell.expandSidebarLabel")
                  : t("shell.collapseSidebarLabel")
                : t("shell.closeMenuLabel")
            }
          >
            {isDesktop ? (
              isCollapsed ? (
                <ChevronRight className="size-4.5" aria-hidden="true" />
              ) : (
                <ChevronLeft className="size-4.5" aria-hidden="true" />
              )
            ) : (
              <X className="size-4.5" aria-hidden="true" />
            )}
          </button>
        </div>

        {showCollapsedLabels ? (
          <span className="sr-only">{activeTenantName}</span>
        ) : null}

        {showTenantSwitcher ? (
          <>
            <label
              htmlFor="tenant-switcher-sidebar"
              className="mt-3 block text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-muted"
            >
              {t("shell.tenantLabel")}
            </label>
            <Select
              id="tenant-switcher-sidebar"
              value={activeTenantId}
              className="mt-2 h-9 rounded-xl border-sidebar-border bg-sidebar-elevated text-sm text-sidebar-text"
              onChange={(event) => onTenantChange(event.target.value)}
            >
              {memberships.map((membership) => (
                <option key={membership.tenantId} value={membership.tenantId}>
                  {membership.tenantName}
                </option>
              ))}
            </Select>
          </>
        ) : null}
      </div>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <nav
          aria-label={t("shell.primaryNavigationLabel")}
          className="flex-1 px-2.5 py-3"
        >
          {sections.map((section, sectionIndex) => (
            <div
              key={section.labelKey}
              className={cn(
                sectionIndex === 0
                  ? ""
                  : "mt-3 border-t border-sidebar-border pt-3"
              )}
            >
              <div className="space-y-1">
                {section.items.map(({ children, to, key, icon: Icon }) => {
                  const isGroupActive =
                    children?.some((child) =>
                      isItemPathActive(location.pathname, child.to)
                    ) ?? false;
                  const showChildren =
                    Boolean(children?.length) &&
                    !showCollapsedLabels &&
                    openGroups[key];

                  return (
                    <div key={to} className="space-y-1">
                      {children?.length ? (
                        <button
                          type="button"
                          onClick={() => {
                            if (!isGroupActive) {
                              setOpenGroups((currentValue) => ({
                                ...currentValue,
                                [key]: true
                              }));
                              onNavigate();
                              navigate(to);
                              return;
                            }

                            setOpenGroups((currentValue) => ({
                              ...currentValue,
                              [key]: !currentValue[key]
                            }));
                          }}
                          className={cn(
                            "group relative flex min-h-11 w-full items-center rounded-xl text-sm font-medium transition",
                            showCollapsedLabels
                              ? "justify-center px-2"
                              : "gap-3 px-3",
                            isGroupActive || openGroups[key]
                              ? "bg-sidebar-accent text-sidebar-accent-contrast shadow-soft"
                              : "text-sidebar-text hover:bg-sidebar-elevated hover:text-sidebar-text"
                          )}
                          aria-label={t(`navigation.${key}`)}
                          aria-expanded={openGroups[key]}
                          aria-controls={`sidebar-group-${key}`}
                          title={showCollapsedLabels ? t(`navigation.${key}`) : undefined}
                        >
                          <span
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-lg transition",
                              showCollapsedLabels
                                ? ""
                                : isGroupActive || openGroups[key]
                                  ? "bg-white/12"
                                  : "group-hover:bg-sidebar-border/55"
                            )}
                          >
                            <Icon className="size-4.5" aria-hidden="true" />
                          </span>
                          {!showCollapsedLabels ? (
                            <>
                              <span className="truncate">{t(`navigation.${key}`)}</span>
                              <motion.span
                                className="ml-auto flex size-6 items-center justify-center rounded-full bg-white/10"
                                animate={{ rotate: openGroups[key] ? 180 : 0 }}
                                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                              >
                                <ChevronDown
                                  className="size-4 opacity-90"
                                  aria-hidden="true"
                                />
                              </motion.span>
                            </>
                          ) : (
                            <span className="sr-only">{t(`navigation.${key}`)}</span>
                          )}
                        </button>
                      ) : (
                        <NavLink
                          to={to}
                          end={to === "/"}
                          onClick={onNavigate}
                          className={({ isActive }) =>
                            cn(
                              "group relative flex min-h-11 items-center rounded-xl text-sm font-medium transition",
                              showCollapsedLabels
                                ? "justify-center px-2"
                                : "gap-3 px-3",
                              isActive
                                ? "bg-sidebar-accent text-sidebar-accent-contrast"
                                : "text-sidebar-text hover:bg-sidebar-elevated hover:text-sidebar-text"
                            )
                          }
                          aria-label={t(`navigation.${key}`)}
                          title={showCollapsedLabels ? t(`navigation.${key}`) : undefined}
                        >
                          <span
                            className={cn(
                              "flex size-9 shrink-0 items-center justify-center rounded-lg transition",
                              showCollapsedLabels ? "" : "group-hover:bg-sidebar-border/55"
                            )}
                          >
                            <Icon className="size-4.5" aria-hidden="true" />
                          </span>
                          {!showCollapsedLabels ? (
                            <span className="truncate">{t(`navigation.${key}`)}</span>
                          ) : (
                            <span className="sr-only">{t(`navigation.${key}`)}</span>
                          )}
                        </NavLink>
                      )}

                      <AnimatePresence initial={false}>
                        {showChildren ? (
                          <motion.div
                            id={`sidebar-group-${key}`}
                            className="overflow-hidden"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                          >
                            <motion.div
                              className="relative ml-4 mt-1 space-y-1 pl-3.5"
                              initial={{ y: -6 }}
                              animate={{ y: 0 }}
                              exit={{ y: -6 }}
                              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
                            >
                              <span className="absolute bottom-2 left-0 top-2 w-px rounded-full bg-sidebar-border" />
                              {children?.map((child, childIndex) => (
                                <motion.div
                                  key={child.to}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, x: -6 }}
                                  transition={{
                                    duration: 0.18,
                                    delay: childIndex * 0.03,
                                    ease: [0.22, 1, 0.36, 1]
                                  }}
                                >
                                  <NavLink
                                    to={child.to}
                                    end
                                    onClick={onNavigate}
                                    className={({ isActive }) =>
                                      cn(
                                        "flex min-h-9 items-center rounded-xl px-3 text-[13px] font-medium transition",
                                        isActive
                                          ? "bg-sidebar-elevated text-sidebar-text shadow-panel"
                                          : "text-sidebar-muted hover:bg-sidebar-elevated hover:text-sidebar-text"
                                      )
                                    }
                                  >
                                    <span>{t(`navigation.${child.key}`)}</span>
                                  </NavLink>
                                </motion.div>
                              ))}
                            </motion.div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-sidebar-border px-2.5 py-3">
          <div
            className={cn(
              "flex items-center",
              showCollapsedLabels ? "justify-center" : "gap-3"
            )}
            title={showCollapsedLabels ? userLabel : undefined}
          >
            <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-[11px] font-semibold text-sidebar-accent-contrast">
              {getInitials(userLabel)}
            </div>
            {!showCollapsedLabels ? (
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-sidebar-text">
                  {userLabel}
                </p>
                <p className="truncate text-[11px] text-sidebar-muted">
                  {businessRoleLabel}
                </p>
              </div>
            ) : (
              <span className="sr-only">{userLabel}</span>
            )}
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className={cn(
              "mt-4 flex min-h-11 w-full items-center rounded-xl text-left text-[15px] font-medium text-red-400 transition hover:bg-red-500/10 hover:text-red-300",
              showCollapsedLabels ? "justify-center px-2" : "gap-3 px-2.5"
            )}
            aria-label={t("shell.signOut")}
            title={showCollapsedLabels ? t("shell.signOut") : undefined}
          >
            <LogOut className="size-4.5" aria-hidden="true" />
            {!showCollapsedLabels ? (
              <span>{t("shell.signOut")}</span>
            ) : (
              <span className="sr-only">{t("shell.signOut")}</span>
            )}
          </button>

          {!showCollapsedLabels ? (
            <div className="mt-4 border-t border-sidebar-border pt-4 text-center">
              <p className="text-xs leading-5 text-sidebar-muted">
                {footerLegalLabel}
              </p>
              <p className="mt-1 text-xs font-medium text-sidebar-muted">
                {t("shell.sidebarFooterProduct")}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function AppShell() {
  const { t } = useTranslation("common");
  const navigate = useNavigate();
  const location = useLocation();
  const {
    accessContext,
    activeTenantId,
    setActiveTenantId,
    signOut,
    user
  } = useBackofficeAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] = useState(
    getInitialSidebarCollapsed
  );
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
  const userEmail = user?.email ?? t("shell.emailFallback");
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
    location.pathname.startsWith("/profile") ||
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

  const shellLayoutStyle = {
    ["--shell-sidebar-width" as string]: `${
      isDesktopSidebarCollapsed
        ? DESKTOP_SIDEBAR_COLLAPSED_WIDTH
        : DESKTOP_SIDEBAR_EXPANDED_WIDTH
    }px`
  } as CSSProperties;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-screen bg-paper" style={shellLayoutStyle}>
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
              className="relative h-full w-full max-w-[17.5rem] shadow-soft"
              variants={slideOverVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <SidebarContent
                sections={sections}
                activeTenantId={activeTenantMembership?.tenantId ?? ""}
                activeTenantName={activeTenantName}
                businessRoleLabel={businessRoleLabel}
                memberships={memberships}
                isCollapsed={false}
                mode="mobile"
                onTenantChange={setActiveTenantId}
                onNavigate={() => setIsSidebarOpen(false)}
                onToggleSidebar={() => setIsSidebarOpen(false)}
                onSignOut={handleSignOut}
                userLabel={userLabel}
                t={t}
              />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      <motion.aside
        className="fixed inset-y-0 left-0 z-40 hidden overflow-hidden border-r border-sidebar-border bg-sidebar-surface lg:block"
        animate={{
          width: isDesktopSidebarCollapsed
            ? DESKTOP_SIDEBAR_COLLAPSED_WIDTH
            : DESKTOP_SIDEBAR_EXPANDED_WIDTH
        }}
        initial={false}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="h-full">
          <SidebarContent
            sections={sections}
            activeTenantId={activeTenantMembership?.tenantId ?? ""}
            activeTenantName={activeTenantName}
            businessRoleLabel={businessRoleLabel}
            memberships={memberships}
            isCollapsed={isDesktopSidebarCollapsed}
            mode="desktop"
            onTenantChange={setActiveTenantId}
            onNavigate={() => undefined}
            onToggleSidebar={() =>
              setIsDesktopSidebarCollapsed((currentValue) => !currentValue)
            }
            onSignOut={handleSignOut}
            userLabel={userLabel}
            t={t}
          />
        </div>
      </motion.aside>

      <div className="flex min-h-screen min-w-0 flex-col lg:pl-[var(--shell-sidebar-width)] lg:transition-[padding-left] lg:duration-200">
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/95 backdrop-blur">
            <div className="mx-auto flex w-full max-w-screen-2xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
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
                    className="h-10 w-full rounded-xl border border-line/70 bg-paper px-10 text-sm text-ink outline-none transition placeholder:text-ink-muted focus:border-line-strong"
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
                    className="inline-flex min-h-10 items-center gap-2.5 rounded-xl border border-line/70 bg-paper px-2.5 py-1.5 shadow-panel transition hover:bg-sand/70"
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
                          onClick={handleOpenProfile}
                          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line-strong bg-paper px-4 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
                        >
                          <UserRound className="size-4" aria-hidden="true" />
                          <span>{t("shell.profileAction")}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-line-strong bg-paper px-4 text-sm font-medium text-ink shadow-panel transition hover:bg-sand/70"
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
    </MotionConfig>
  );
}
