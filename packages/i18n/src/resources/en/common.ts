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
      linen: {
        name: "Editorial Linen",
        description:
          "Cream neutrals, soft sage, and dusty blue for an elegant and versatile brand."
      },
      mist: {
        name: "Executive Mist",
        description:
          "Warm greys with misty blue for a sober, modern, and professional presence."
      },
      clay: {
        name: "Premium Clay",
        description:
          "Soft terracotta, muted greens, and clean blue for trustworthy service-led brands."
      },
      dusk: {
        name: "Refined Dusk",
        description:
          "Grey lavender, smoke teal, and blush sand for a contemporary identity without noise."
      },
      custom: {
        name: "Custom palette",
        description:
          "Start from a professional base and adjust four key colors to shape your own brand."
      }
    }
  },
  navigation: {
    dashboard: "Home",
    crm: "CRM",
    catalog: "Catalog",
    quotes: "Quotes",
    quotesShort: "Quotes",
    quotesOverview: "Overview",
    quotesNew: "New quote",
    quotesManage: "Manage quotes",
    learning: "Learning",
    admin: "Admin",
    profile: "Profile",
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
    workspaceTenantDescription: "Operating inside {tenant}.",
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
    signOutSuccess: "Signed out successfully.",
    signOutError: "We could not sign you out. {message}",
    globalAdmin: "Global admin",
    tenantOperator: "Tenant operator",
    emailFallback: "No email available",
    primaryNavigationLabel: "Primary navigation",
    mobileNavigationLabel: "Mobile navigation",
    mobileMenuLabel: "Open main menu",
    closeMenuLabel: "Close main menu",
    collapseSidebarLabel: "Collapse sidebar",
    expandSidebarLabel: "Expand sidebar",
    sidebarFooterLegal: "© {year} {tenant}. All rights reserved.",
    sidebarFooterProduct: "OperaPyme backoffice",
    breadcrumbsLabel: "Current route",
    searchLabel: "Search the workspace",
    searchPlaceholder: "Search module or action",
    openNotificationsLabel: "Open notifications",
    profileMenuLabel: "Open user menu",
    profileAction: "Open profile",
    pageDescriptions: {
      dashboard: "Operational summary, quick actions, and recent activity.",
      crm: "Leads, customers, and commercial follow-up in one view.",
      catalog: "Products and services ready to quote.",
      quotes: "Active quotes and documents ready to send.",
      quotesNew: "Short wizard to create a quote without losing context.",
      quotesManage: "Resume existing quotes, adjust details, and keep versioning.",
      learning: "Guides and quick help to operate with more clarity.",
      profile: "Account, access security, and basic user details.",
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
        "You are working inside {tenant}. Everything you save in CRM, catalog, and quotes will use this context.",
      tenantFallback:
        "We do not see an active tenant yet. Review the context before operating on commercial data.",
      appearanceTitle: "Appearance synced",
      appearanceDescription:
        "The active palette is {palette} and stays separate from the user's visual mode.",
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
    loadingModule: "Loading module...",
    loadingWorkspaceTitle: "Preparing your workspace",
    loadingWorkspaceDescription:
      "We are validating your session, active tenant, and permissions before opening the backoffice.",
    loadingSetupTitle: "Preparing your access",
    loadingSetupDescription:
      "We are connecting your session and loading the initial context before showing the right flow."
  }
};

export default commonEn;
