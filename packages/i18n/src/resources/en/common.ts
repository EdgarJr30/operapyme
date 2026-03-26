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
    admin: "Admin",
    settings: "Settings"
  },
  shell: {
    badge: "Backoffice PWA foundation",
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
    foundationBadge: "Audit-ready",
    rbacBadge: "RBAC + RLS baseline",
    signOut: "Sign out",
    primaryNavigationLabel: "Primary navigation",
    mobileNavigationLabel: "Mobile navigation"
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
