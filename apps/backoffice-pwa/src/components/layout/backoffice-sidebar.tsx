import { useEffect, useState } from "react";

import {
  BookOpenText,
  BriefcaseBusiness,
  Building,
  Building2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  FileText,
  House,
  LayoutDashboard,
  PackageSearch,
  Palette,
  Receipt,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Upload,
  UserRound,
  Users,
  UsersRound,
  X
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { NavLink, useLocation } from "react-router-dom";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
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
  SidebarSeparator,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar";
import { SheetDescription, SheetTitle } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from "@/components/ui/tooltip";
import { backofficeTransition } from "@/lib/motion";
import { cn } from "@/lib/utils";

export type ShellNavItemKey =
  | "dashboard"
  | "commercial"
  | "commercialSummary"
  | "commercialLeads"
  | "commercialCustomers"
  | "commercialQuotes"
  | "commercialInvoices"
  | "crm"
  | "catalog"
  | "quotes"
  | "quotesOverview"
  | "quotesNew"
  | "quotesManage"
  | "import"
  | "learning"
  | "profile"
  | "admin"
  | "settings"
  | "settingsGeneral"
  | "settingsTenant"
  | "settingsAppearance"
  | "settingsTeam"
  | "settingsSecurity";

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
    to: "/commercial",
    key: "commercial",
    icon: BriefcaseBusiness,
    children: [
      {
        to: "/commercial",
        key: "commercialSummary",
        icon: LayoutDashboard
      },
      {
        to: "/commercial/leads",
        key: "commercialLeads",
        icon: UsersRound
      },
      {
        to: "/commercial/customers",
        key: "commercialCustomers",
        icon: Building2
      },
      {
        to: "/commercial/quotes",
        key: "commercialQuotes",
        icon: FileText
      },
      {
        to: "/commercial/invoices",
        key: "commercialInvoices",
        icon: Receipt
      }
    ]
  },
  {
    to: "/catalog",
    key: "catalog",
    icon: PackageSearch
  }
];

export const platformNavItems: ShellNavItem[] = [
  {
    to: "/learning",
    key: "learning",
    icon: BookOpenText
  },
  {
    to: "/settings/general",
    key: "settings",
    icon: Settings2,
    children: [
      {
        to: "/profile",
        key: "profile",
        icon: UserRound
      },
      {
        to: "/settings/general",
        key: "settingsGeneral",
        icon: SlidersHorizontal
      },
      {
        to: "/settings/tenant",
        key: "settingsTenant",
        icon: Building
      },
      {
        to: "/settings/appearance",
        key: "settingsAppearance",
        icon: Palette
      },
      {
        to: "/settings/team",
        key: "settingsTeam",
        icon: Users
      },
      {
        to: "/settings/security",
        key: "settingsSecurity",
        icon: ShieldCheck
      },
      {
        to: "/import",
        key: "import",
        icon: Upload
      }
    ]
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
          pathname === child.to
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

function isExactItemPathActive(pathname: string, to: string) {
  return pathname === to;
}

function wrapWithTooltip(
  collapsed: boolean,
  label: string,
  element: React.ReactElement
) {
  if (!collapsed) {
    return element;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{element}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

export function getBottomTabItems(navItems: ShellNavItem[]) {
  const bottomKeys: ShellNavItemKey[] = [
    "dashboard",
    "commercial",
    "catalog"
  ];

  return navItems.filter((item) => bottomKeys.includes(item.key));
}

export function getRouteMeta(pathname: string): RouteMeta {
  if (pathname === "/commercial" || pathname.startsWith("/commercial/")) {
    if (pathname.startsWith("/commercial/leads")) {
      return {
        labelKey: "navigation.commercialLeads",
        descriptionKey: "shell.pageDescriptions.commercialLeads"
      };
    }

    if (pathname.startsWith("/commercial/customers")) {
      return {
        labelKey: "navigation.commercialCustomers",
        descriptionKey: "shell.pageDescriptions.commercialCustomers"
      };
    }

    if (pathname.startsWith("/commercial/quotes")) {
      return {
        labelKey: "navigation.commercialQuotes",
        descriptionKey: "shell.pageDescriptions.commercialQuotes"
      };
    }

    if (pathname.startsWith("/commercial/invoices")) {
      return {
        labelKey: "navigation.commercialInvoices",
        descriptionKey: "shell.pageDescriptions.commercialInvoices"
      };
    }

    return {
      labelKey: "navigation.commercialSummary",
      descriptionKey: "shell.pageDescriptions.commercialSummary"
    };
  }

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

  if (pathname.startsWith("/import")) {
    return {
      labelKey: "navigation.import",
      descriptionKey: "shell.pageDescriptions.import"
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
    if (pathname.startsWith("/settings/tenant")) {
      return {
        labelKey: "navigation.settingsTenant",
        descriptionKey: "shell.pageDescriptions.settings"
      };
    }

    if (pathname.startsWith("/settings/appearance")) {
      return {
        labelKey: "navigation.settingsAppearance",
        descriptionKey: "shell.pageDescriptions.settings"
      };
    }

    if (pathname.startsWith("/settings/team")) {
      return {
        labelKey: "navigation.settingsTeam",
        descriptionKey: "shell.pageDescriptions.settings"
      };
    }

    if (pathname.startsWith("/settings/security")) {
      return {
        labelKey: "navigation.settingsSecurity",
        descriptionKey: "shell.pageDescriptions.settings"
      };
    }

    if (pathname.startsWith("/settings/general")) {
      return {
        labelKey: "navigation.settingsGeneral",
        descriptionKey: "shell.pageDescriptions.settings"
      };
    }

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
  onOpenProfile,
  userEmail,
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
  onOpenProfile: () => void;
  userEmail: string;
  userLabel: string;
  t: (key: string) => string;
}) {
  const location = useLocation();
  const { isMobile, setOpen, setOpenMobile, state } = useSidebar();
  const isCollapsed = !isMobile && state === "collapsed";
  const showTenantSwitcher = memberships.length > 1 && !isCollapsed;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    getInitialNavGroups(sections, location.pathname)
  );
  const footerYear = new Date().getFullYear();
  const footerLegalLabel = t("shell.sidebarFooterLegal").replace(
    "{year}",
    String(footerYear)
  );

  useEffect(() => {
    setOpenGroups(getInitialNavGroups(sections, location.pathname));
  }, [location.pathname, sections]);

  const handleDesktopSidebarToggle = () => {
    if (isMobile) {
      return;
    }

    setOpen(isCollapsed);
  };

  const handleNavigate = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const desktopToggleLabel = isCollapsed
    ? t("shell.expandSidebarLabel")
    : t("shell.collapseSidebarLabel");

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
    >
      {isMobile ? (
        <div className="sr-only">
          <SheetTitle>{t("shell.mobileMenuTitle")}</SheetTitle>
          <SheetDescription>{t("shell.mobileMenuDescription")}</SheetDescription>
        </div>
      ) : null}

      <SidebarHeader className="gap-3 px-3 py-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "h-auto min-h-0 rounded-2xl border border-sidebar-border bg-sidebar-elevated px-3 py-3 hover:bg-sidebar-border/80 data-[active=true]:shadow-none",
                isCollapsed ? "px-2 py-2.5" : ""
              )}
              title={isCollapsed ? activeTenantName : undefined}
            >
              <motion.div
                layout
                transition={backofficeTransition}
                className={cn(
                  "relative flex items-center",
                  isCollapsed ? "flex-col justify-center gap-2" : "gap-3"
                )}
              >
                <motion.div
                  layout
                  transition={backofficeTransition}
                  className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-2xl"
                >
                  <img
                    src="/pwa-icon.svg"
                    alt={t("shell.productName")}
                    className="size-10"
                  />
                </motion.div>

                <AnimatePresence initial={false} mode="popLayout">
                  {!isCollapsed ? (
                    <motion.div
                      key="sidebar-expanded-header"
                      layout
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={backofficeTransition}
                      className="flex min-w-0 flex-1 items-center gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[15px] font-semibold text-sidebar-text">
                          {activeTenantName}
                        </p>
                        <p className="truncate text-sm text-sidebar-muted">
                          {businessRoleLabel}
                        </p>
                      </div>

                      {isMobile ? (
                        <X className="size-4.5 shrink-0 text-sidebar-muted" aria-hidden="true" />
                      ) : (
                        <motion.button
                          type="button"
                          onClick={handleDesktopSidebarToggle}
                          aria-label={desktopToggleLabel}
                          title={desktopToggleLabel}
                          className="inline-flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-sidebar-border/80 bg-sidebar-surface text-sidebar-muted transition hover:bg-sidebar-border/70 hover:text-sidebar-text"
                          whileTap={{ scale: 0.96 }}
                        >
                          <motion.span
                            animate={{ x: -1 }}
                            transition={backofficeTransition}
                          >
                            <ChevronLeft className="size-4.5" aria-hidden="true" />
                          </motion.span>
                        </motion.button>
                      )}
                    </motion.div>
                  ) : (
                    <motion.button
                      key="sidebar-collapsed-header"
                      type="button"
                      onClick={handleDesktopSidebarToggle}
                      aria-label={desktopToggleLabel}
                      title={desktopToggleLabel}
                      initial={{ opacity: 0, y: 6, scale: 0.92 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.92 }}
                      transition={backofficeTransition}
                      className={cn(
                        "inline-flex size-9 items-center justify-center rounded-xl border border-sidebar-border/80 bg-sidebar-surface text-sidebar-muted shadow-panel transition hover:bg-sidebar-border/70 hover:text-sidebar-text",
                        isMobile ? "hidden" : "cursor-pointer"
                      )}
                      whileTap={{ scale: 0.96 }}
                    >
                      <motion.span
                        animate={{ x: 1 }}
                        transition={backofficeTransition}
                      >
                        <ChevronRight className="size-4.5" aria-hidden="true" />
                      </motion.span>
                    </motion.button>
                  )}
                </AnimatePresence>

                {isCollapsed ? (
                  <span className="sr-only">{activeTenantName}</span>
                ) : null}
              </motion.div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {showTenantSwitcher ? (
          <div className="px-1">
            <label
              htmlFor="tenant-switcher-sidebar"
              className="mb-2 block px-2 text-xs font-medium text-sidebar-muted"
            >
              {t("shell.tenantLabel")}
            </label>
            <Select
              id="tenant-switcher-sidebar"
              value={activeTenantId}
              className="h-10 rounded-xl border-sidebar-border bg-sidebar-elevated text-sm text-sidebar-text"
              onChange={(event) => onTenantChange(event.target.value)}
            >
              {memberships.map((membership) => (
                <option key={membership.tenantId} value={membership.tenantId}>
                  {membership.tenantName}
                </option>
              ))}
            </Select>
          </div>
        ) : null}
      </SidebarHeader>

      <SidebarContent className="px-3 py-2">
        <nav aria-label={t("shell.primaryNavigationLabel")} className="space-y-3">
          {sections.map((section, sectionIndex) => (
            <SidebarGroup
              key={section.labelKey}
              className={cn(
                sectionIndex === 0 ? "" : "pt-4"
              )}
            >
              {!isCollapsed ? (
                <SidebarGroupLabel className="px-2 pb-1 text-sm font-medium normal-case tracking-normal text-sidebar-muted">
                  {t(section.labelKey)}
                </SidebarGroupLabel>
              ) : null}

              <SidebarGroupContent>
                <SidebarMenu>
                  {section.items.map(({ children, to, key, icon: Icon }) => {
                    const showChildren =
                      Boolean(children?.length) && !isCollapsed && openGroups[key];

                    return (
                      <SidebarMenuItem key={to}>
                        {children?.length ? (
                          <>
                            {wrapWithTooltip(
                              isCollapsed,
                              t(`navigation.${key}`),
                              <SidebarMenuButton
                                isActive={false}
                                className={cn(
                                  "group/nav-item rounded-xl",
                                  isCollapsed ? "justify-center px-0" : ""
                                )}
                                onClick={() => {
                                  if (isCollapsed) {
                                    setOpen(true);
                                  }

                                  setOpenGroups((currentValue) => ({
                                    ...currentValue,
                                    [key]: isCollapsed ? true : !currentValue[key]
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
                                    isCollapsed ? "" : "group-hover/nav-item:bg-sidebar-border/55"
                                  )}
                                >
                                  <Icon className="size-4.5" aria-hidden="true" />
                                </span>

                                {!isCollapsed ? (
                                  <>
                                    <span className="truncate">{t(`navigation.${key}`)}</span>
                                    <motion.span
                                      className="ml-auto flex size-6 items-center justify-center rounded-full bg-sidebar-border/50"
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
                            )}

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
                                      {children?.map((child, childIndex) => {
                                        const ChildIcon = child.icon;
                                        return (
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
                                              isActive={isExactItemPathActive(
                                                location.pathname,
                                                child.to
                                              )}
                                              className="gap-2.5"
                                            >
                                              <NavLink to={child.to} end onClick={handleNavigate}>
                                                <ChildIcon className="size-4 shrink-0" aria-hidden="true" />
                                                <span>{t(`navigation.${child.key}`)}</span>
                                              </NavLink>
                                            </SidebarMenuSubButton>
                                          </SidebarMenuSubItem>
                                        </motion.div>
                                        );
                                      })}
                                    </SidebarMenuSub>
                                  </motion.div>
                                </motion.div>
                              ) : null}
                            </AnimatePresence>
                          </>
                        ) : (
                          wrapWithTooltip(
                            isCollapsed,
                            t(`navigation.${key}`),
                            <SidebarMenuButton
                              asChild
                              isActive={isItemPathActive(location.pathname, to)}
                              className={cn(
                                "group/nav-item rounded-xl",
                                isCollapsed ? "justify-center px-0" : ""
                              )}
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
                                    isCollapsed ? "" : "group-hover/nav-item:bg-sidebar-border/55"
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
                          )
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

      <SidebarFooter className="px-3 pb-3 pt-2">
        <SidebarSeparator className="bg-sidebar-border/80" />

        <DropdownMenu>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenuTrigger asChild>
                {wrapWithTooltip(
                  isCollapsed,
                  userLabel,
                  <SidebarMenuButton
                    className={cn(
                      "mt-2 h-auto min-h-0 rounded-2xl px-3 py-3",
                      isCollapsed ? "justify-center px-0" : ""
                    )}
                    title={isCollapsed ? userLabel : undefined}
                  >
                    <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar-accent text-[11px] font-semibold text-sidebar-accent-contrast">
                      {getInitials(userLabel)}
                    </div>

                    {!isCollapsed ? (
                      <>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[15px] font-semibold text-sidebar-text">
                            {userLabel}
                          </p>
                          <p className="truncate text-sm text-sidebar-muted">
                            {businessRoleLabel}
                          </p>
                        </div>
                        <ChevronsUpDown className="size-4.5 shrink-0 text-sidebar-muted" aria-hidden="true" />
                      </>
                    ) : (
                      <span className="sr-only">{userLabel}</span>
                    )}
                  </SidebarMenuButton>
                )}
              </DropdownMenuTrigger>
            </SidebarMenuItem>
          </SidebarMenu>

          <DropdownMenuContent
            align={isCollapsed ? "start" : "end"}
            side={isCollapsed ? "right" : "top"}
            className="w-64 rounded-2xl border-line/70 bg-paper p-2 text-ink shadow-soft"
          >
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar-accent text-[11px] font-semibold text-sidebar-accent-contrast">
                {getInitials(userLabel)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{userLabel}</p>
                <p className="truncate text-sm text-ink-soft">{userEmail}</p>
              </div>
            </div>
            <DropdownMenuSeparator className="bg-line/70" />
            <DropdownMenuItem
              className="rounded-xl px-3 py-2.5 text-sm text-ink focus:bg-sand focus:text-ink"
              onClick={onOpenProfile}
            >
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem
              className="rounded-xl px-3 py-2.5 text-sm text-red-500 focus:bg-red-50 focus:text-red-600"
              onClick={onSignOut}
            >
              {t("shell.signOut")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>



        {!isCollapsed ? (
          <div className="px-2 pt-1 text-left">
            <p className="text-xs leading-5 text-sidebar-muted">
              {footerLegalLabel}
            </p>
            <p className="mt-1 text-xs font-medium text-sidebar-muted">
              {t("shell.sidebarFooterProduct")}
            </p>
          </div>
        ) : null}
      </SidebarFooter>
    </Sidebar>
  );
}
