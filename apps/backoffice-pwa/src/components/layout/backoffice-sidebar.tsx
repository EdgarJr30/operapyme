import { useEffect, useState } from "react";

import {
  BookOpenText,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  FileText,
  House,
  LogOut,
  Package2,
  Settings2,
  ShieldCheck,
  UsersRound,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { Select } from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  useSidebar
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export type ShellNavItemKey =
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

export interface ShellNavItem {
  to: string;
  key: ShellNavItemKey;
  icon: typeof House;
  children?: ShellNavItem[];
}

export interface SidebarSection {
  labelKey: "shell.sidebarCoreLabel" | "shell.sidebarPlatformLabel";
  items: ShellNavItem[];
}

interface RouteMeta {
  labelKey: string;
  descriptionKey: string;
}

export const businessNavItems: ShellNavItem[] = [
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

export const platformNavItems: ShellNavItem[] = [
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

export function getBottomTabItems(navItems: ShellNavItem[]) {
  const bottomKeys: ShellNavItemKey[] = ["dashboard", "crm", "quotes"];

  return navItems.filter((item) => bottomKeys.includes(item.key));
}

export function getRouteMeta(pathname: string): RouteMeta {
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

export function BackofficeSidebar({
  sections,
  activeTenantId,
  activeTenantName,
  businessRoleLabel,
  memberships,
  onTenantChange,
  onSignOut,
  userLabel,
  t
}: {
  sections: SidebarSection[];
  activeTenantId: string;
  activeTenantName: string;
  businessRoleLabel: string;
  memberships: Array<{ tenantId: string; tenantName: string }>;
  onTenantChange: (tenantId: string) => void;
  onSignOut: () => void;
  userLabel: string;
  t: (key: string) => string;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isMobile, setOpenMobile, state, toggleSidebar } = useSidebar();
  const isCollapsed = !isMobile && state === "collapsed";
  const showTenantSwitcher = memberships.length > 1 && !isCollapsed;
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

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="gap-0 border-b border-sidebar-border px-3 py-3.5">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-3"
          )}
        >
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-sidebar-border bg-sidebar-elevated shadow-panel">
            <img
              src="/pwa-icon.svg"
              alt={t("shell.productName")}
              className="size-6"
            />
          </div>

          {!isCollapsed ? (
            <div className="min-w-0 flex-1">
              <p className="truncate text-base leading-6 font-semibold tracking-tight text-sidebar-text">
                {t("shell.productName")}
              </p>
              <p className="mt-0.5 truncate text-xs leading-5 text-sidebar-muted">
                {activeTenantName}
              </p>
            </div>
          ) : (
            <span className="sr-only">{activeTenantName}</span>
          )}

          <button
            type="button"
            onClick={toggleSidebar}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-xl border border-sidebar-border bg-sidebar-elevated text-sidebar-text transition hover:border-sidebar-muted hover:bg-sidebar-border"
            aria-label={
              isMobile
                ? t("shell.closeMenuLabel")
                : isCollapsed
                  ? t("shell.expandSidebarLabel")
                  : t("shell.collapseSidebarLabel")
            }
            title={
              isMobile
                ? t("shell.closeMenuLabel")
                : isCollapsed
                  ? t("shell.expandSidebarLabel")
                  : t("shell.collapseSidebarLabel")
            }
          >
            {isMobile ? (
              <X className="size-4.5" aria-hidden="true" />
            ) : isCollapsed ? (
              <ChevronRight className="size-4.5" aria-hidden="true" />
            ) : (
              <ChevronLeft className="size-4.5" aria-hidden="true" />
            )}
          </button>
        </div>

        {showTenantSwitcher ? (
          <>
            <label
              htmlFor="tenant-switcher-sidebar"
              className="mt-3 block px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-muted"
            >
              {t("shell.tenantLabel")}
            </label>
            <div className="px-3">
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
            </div>
          </>
        ) : null}
      </SidebarHeader>

      <SidebarContent className="px-2.5 py-3">
        <nav aria-label={t("shell.primaryNavigationLabel")} className="space-y-3">
          {sections.map((section, sectionIndex) => (
            <SidebarGroup
              key={section.labelKey}
              className={cn(
                sectionIndex === 0 ? "" : "border-t border-sidebar-border pt-3"
              )}
            >
              {!isCollapsed ? (
                <SidebarGroupLabel>{t(section.labelKey)}</SidebarGroupLabel>
              ) : null}

              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map(({ children, to, key, icon: Icon }) => {
                    const isGroupActive =
                      children?.some((child) =>
                        isItemPathActive(location.pathname, child.to)
                      ) ?? false;
                    const showChildren =
                      Boolean(children?.length) && !isCollapsed && openGroups[key];

                    return (
                      <SidebarMenuItem key={to}>
                        {children?.length ? (
                          <>
                            <SidebarMenuButton
                              isActive={isGroupActive || openGroups[key]}
                              className={cn(
                                isCollapsed ? "justify-center px-0" : ""
                              )}
                              onClick={() => {
                                if (!isGroupActive) {
                                  setOpenGroups((currentValue) => ({
                                    ...currentValue,
                                    [key]: true
                                  }));
                                  handleNavigate();
                                  navigate(to);
                                  return;
                                }

                                setOpenGroups((currentValue) => ({
                                  ...currentValue,
                                  [key]: !currentValue[key]
                                }));
                              }}
                              aria-label={t(`navigation.${key}`)}
                              aria-expanded={openGroups[key]}
                              aria-controls={`sidebar-group-${key}`}
                              title={isCollapsed ? t(`navigation.${key}`) : undefined}
                            >
                              <span
                                className={cn(
                                  "flex size-9 shrink-0 items-center justify-center rounded-lg transition",
                                  isCollapsed
                                    ? ""
                                    : isGroupActive || openGroups[key]
                                      ? "bg-white/12"
                                      : "group-hover:bg-sidebar-border/55"
                                )}
                              >
                                <Icon className="size-4.5" aria-hidden="true" />
                              </span>

                              {!isCollapsed ? (
                                <>
                                  <span className="truncate">{t(`navigation.${key}`)}</span>
                                  <motion.span
                                    className="ml-auto flex size-6 items-center justify-center rounded-full bg-white/10"
                                    animate={{ rotate: openGroups[key] ? 180 : 0 }}
                                    transition={{
                                      duration: 0.22,
                                      ease: [0.22, 1, 0.36, 1]
                                    }}
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
                            </SidebarMenuButton>

                            <AnimatePresence initial={false}>
                              {showChildren ? (
                                <motion.div
                                  id={`sidebar-group-${key}`}
                                  className="overflow-hidden"
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{
                                    duration: 0.24,
                                    ease: [0.22, 1, 0.36, 1]
                                  }}
                                >
                                  <motion.div
                                    initial={{ y: -6 }}
                                    animate={{ y: 0 }}
                                    exit={{ y: -6 }}
                                    transition={{
                                      duration: 0.18,
                                      ease: [0.22, 1, 0.36, 1]
                                    }}
                                  >
                                    <SidebarMenuSub className="mt-1">
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
                                          <SidebarMenuSubItem>
                                            <SidebarMenuSubButton
                                              asChild
                                              isActive={isItemPathActive(
                                                location.pathname,
                                                child.to
                                              )}
                                            >
                                              <NavLink to={child.to} end onClick={handleNavigate}>
                                                <span>{t(`navigation.${child.key}`)}</span>
                                              </NavLink>
                                            </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                        </motion.div>
                                      ))}
                                    </SidebarMenuSub>
                                  </motion.div>
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
                          </>
                        ) : (
                          <SidebarMenuButton
                            asChild
                            isActive={isItemPathActive(location.pathname, to)}
                            className={cn(isCollapsed ? "justify-center px-0" : "")}
                          >
                            <NavLink
                              to={to}
                              end={to === "/"}
                              onClick={handleNavigate}
                              aria-label={t(`navigation.${key}`)}
                              title={isCollapsed ? t(`navigation.${key}`) : undefined}
                            >
                              <span
                                className={cn(
                                  "flex size-9 shrink-0 items-center justify-center rounded-lg transition",
                                  isCollapsed ? "" : "group-hover:bg-sidebar-border/55"
                                )}
                              >
                                <Icon className="size-4.5" aria-hidden="true" />
                              </span>
                              {!isCollapsed ? (
                                <span className="truncate">{t(`navigation.${key}`)}</span>
                              ) : (
                                <span className="sr-only">{t(`navigation.${key}`)}</span>
                              )}
                            </NavLink>
                          </SidebarMenuButton>
                        )}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </nav>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-2.5 py-3">
        <div
          className={cn(
            "flex items-center",
            isCollapsed ? "justify-center" : "gap-3"
          )}
          title={isCollapsed ? userLabel : undefined}
        >
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-sidebar-accent text-[11px] font-semibold text-sidebar-accent-contrast">
            {getInitials(userLabel)}
          </div>

          {!isCollapsed ? (
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

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className={cn(
                "text-red-300 hover:bg-red-500/10 hover:text-red-200 data-[active=true]:bg-red-500/10 data-[active=true]:text-red-200",
                isCollapsed ? "justify-center px-0" : ""
              )}
              onClick={onSignOut}
              aria-label={t("shell.signOut")}
              title={isCollapsed ? t("shell.signOut") : undefined}
            >
              <LogOut className="size-4.5 shrink-0" aria-hidden="true" />
              {!isCollapsed ? (
                <span>{t("shell.signOut")}</span>
              ) : (
                <span className="sr-only">{t("shell.signOut")}</span>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {!isCollapsed ? (
          <div className="border-t border-sidebar-border pt-4 text-center">
            <p className="text-xs leading-5 text-sidebar-muted">
              {footerLegalLabel}
            </p>
            <p className="mt-1 text-xs font-medium text-sidebar-muted">
              {t("shell.sidebarFooterProduct")}
            </p>
          </div>
        ) : null}
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
