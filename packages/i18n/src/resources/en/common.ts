const commonEn = {
  language: {
    label: "Language"
  },
  theme: {
    label: "Theme",
    light: "Light",
    dark: "Dark",
    system: "System",
    switchToLight: "Switch to light theme",
    switchToDark: "Switch to dark theme",
    aaReady: "AA validated",
    palettes: {
      sage: {
        name: "Calm Sage",
        description:
          "Soft greens and balanced neutrals for a calm premium experience."
      },
      lagoon: {
        name: "Fresh Lagoon",
        description:
          "Clean blues and cool accents for a more technology-led brand."
      },
      terracotta: {
        name: "Commercial Clay",
        description:
          "Warm tones for service-heavy businesses that need closeness and conversion."
      },
      graphite: {
        name: "Precise Graphite",
        description:
          "Serious neutrals with controlled accents for sober or industrial brands."
      }
    }
  },
  navigation: {
    dashboard: "Home",
    crm: "CRM",
    catalog: "Catalog",
    quotes: "Quotes",
    quotesShort: "Quotes",
    admin: "Admin",
    settings: "Settings",
    errors: "Errors",
    more: "More"
  },
  shell: {
    badge: "Backoffice PWA foundation",
    mobileBadge: "Operational shell",
    productName: "OperaPyme",
    title: "Commercial operations platform",
    description:
      "Mobile-first, clear, and ready to run quotes, expenses, reports, and daily operations for SMBs.",
    designTitle: "Design direction",
    designDescription:
      "Calm surfaces, soft gradients, high readability, and one strong action per block.",
    workspaceTitle: "Backoffice workspace",
    workspaceDescription:
      "Mobile-first CRM, quotes, expenses, and reporting.",
    workspaceTenantDescription: "Operating inside {{tenant}}.",
    tenantLabel: "Active business",
    tenantFallback: "No active tenant",
    tenantSwitcherLabel: "Switch business",
    tenantOwner: "Owner",
    quickActionsTitle: "Quick actions",
    quickActionLead: "Capture lead",
    quickActionQuote: "New quote",
    sidebarCoreLabel: "Run your business",
    sidebarPlatformLabel: "Platform and support",
    foundationBadge: "Audit-ready",
    rbacBadge: "RBAC + RLS baseline",
    signOut: "Sign out",
    globalAdmin: "Global admin",
    tenantOperator: "Tenant operator",
    emailFallback: "No email available",
    primaryNavigationLabel: "Primary navigation",
    mobileNavigationLabel: "Mobile navigation",
    mobileMenuLabel: "Open main menu",
    closeMenuLabel: "Close main menu",
    collapseSidebarLabel: "Collapse sidebar",
    expandSidebarLabel: "Expand sidebar",
    sidebarFooterLegal: "© {{year}} {{tenant}}. All rights reserved.",
    sidebarFooterProduct: "OperaPyme backoffice",
    breadcrumbsLabel: "Current route",
    searchLabel: "Search the workspace",
    searchPlaceholder: "Search module or action",
    openNotificationsLabel: "Open notifications",
    profileMenuLabel: "Open user menu",
    pageDescriptions: {
      dashboard: "Business overview, quick actions, and recent activity.",
      crm: "Leads, customers, and follow-up on one surface.",
      catalog: "Products and services ready to quote without duplicate content.",
      quotes: "Quotes and commercial documents for the active tenant.",
      settings: "Tenant-wide settings, branding, and appearance preferences.",
      admin: "Global audit and controls reserved for authorized profiles.",
      errors: "Operational incidents and visible error traceability."
    },
    notifications: {
      title: "Notifications",
      description: "Useful reminders to operate the backoffice with context.",
      newBadge: "New",
      tenantTitle: "Tenant context",
      tenantDescription:
        "You are working inside {{tenant}}. Keep this context while creating customers and quotes.",
      tenantFallback:
        "We do not see an active tenant yet. Review the context before operating on commercial data.",
      appearanceTitle: "Appearance synced",
      appearanceDescription:
        "The active palette is {{palette}} and stays separate from the user's visual mode.",
      governanceTitle: "Workspace governance",
      governanceDescription:
        "Admin and settings stay outside the main commercial flow to avoid mixing contexts.",
      governanceAdminTitle: "Administrative access available",
      governanceAdminDescription:
        "Your profile can enter the global audit area without mixing it with the tenant's day-to-day operations."
    }
  },
  states: {
    routeNotFoundEyebrow: "Route not found",
    routeNotFoundTitle: "This workspace route is not wired yet.",
    routeNotFoundDescription:
      "Keep building from the backoffice shell and connect the next modules as they become real features.",
    loadingModule: "Loading module..."
  }
};

export default commonEn;
