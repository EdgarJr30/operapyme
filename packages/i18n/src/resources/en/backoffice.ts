const backofficeEn = {
  dashboard: {
    hero: {
      badgeBlueprint: "Blueprint translated into code",
      badgePastel: "Minimal pastel system active",
      eyebrow: "Backoffice foundation",
      title:
        "Build one calm, serious interface that works across multiple business types.",
      description:
        "This shell is already optimized for mobile-first navigation, modular domains, and a premium product experience without visual noise.",
      primaryAction: "Start tenant wizard",
      secondaryAction: "Review UX rules"
    },
    milestones: {
      title: "Next product milestones",
      description:
        "Keep the first 8 weeks focused on activation and commercial value.",
      setupWizard: "Tenant setup wizard",
      catalogCrud: "Catalog CRUD with media and visibility",
      crmKanban: "CRM lead capture and Kanban",
      quoteBuilder: "Quote builder with versioning and PDF",
      websitePublishing: "Public website publishing",
      securityFoundation: "Secure foundation with RBAC, RLS, and auditing"
    },
    stats: {
      customerCount: {
        label: "Visible customers",
        detail: "{{count}} customers currently visible for the active tenant."
      },
      quoteCount: {
        label: "Stored quotes",
        detail: "{{count}} quotes protected by RLS inside this tenant."
      },
      openQuoteCount: {
        label: "Open quotes",
        detail: "{{count}} quotes still in draft, sent, or viewed state."
      }
    },
    livePulse: {
      noTenantTitle: "There is no active tenant selected yet",
      noTenantDescription:
        "Complete bootstrap or reload the access context before requesting live commercial data.",
      loadingTitle: "Loading the commercial pulse",
      loadingDescription:
        "We are reading live customers and quotes from Supabase for this tenant.",
      errorTitle: "We could not load the commercial pulse",
      errorDescription:
        "The live tenant read failed for now. {{message}}",
      retryAction: "Retry load",
      emptyTitle: "There is no commercial activity yet",
      emptyDescription:
        "As soon as the tenant starts creating customers and quotes, this dashboard will show the live metrics and snapshots.",
      customersTitle: "Recent customers",
      customersDescription:
        "Direct read from `customers` while respecting the active tenant and RLS.",
      quotesTitle: "Recent quotes",
      quotesDescription:
        "Direct read from `quotes` with visibility protected by permissions.",
      contactPending: "Pending contact",
      customerCodeLabel: "Code",
      customerCodePending: "No code yet",
      quoteValueLabel: "Current value",
      customerStatus: {
        active: "Active",
        inactive: "Inactive",
        archived: "Archived"
      },
      quoteStatus: {
        draft: "Draft",
        sent: "Sent",
        viewed: "Viewed",
        approved: "Approved",
        rejected: "Rejected",
        expired: "Expired"
      }
    },
    operatingModel: {
      title: "Operating model",
      description:
        "Keep the architecture honest: horizontal platform first, vertical packs later.",
      catalogTitle: "Catalog operations",
      catalogText:
        "Products, categories, technical files, and public or private visibility.",
      crmTitle: "CRM and lead intake",
      crmText:
        "Capture opportunities quickly and move them through a simple pipeline.",
      quotesTitle: "Quotes and proformas",
      quotesText:
        "Versioned documents, share links, approvals, and clean PDF output.",
      aiTitle: "AI add-ons",
      aiText:
        "Quote assistance and the public chatbot stay modular and billable."
    },
    uxWhy: {
      title: "Why this UX direction matters",
      description:
        "Good B2B products earn trust through calm interfaces, not decorative overload.",
      learnFaster:
        "Lower visual noise helps small teams learn the product faster.",
      formQuality:
        "Clear form structure improves data quality and quote speed.",
      aiFocus:
        "AI should stay focused on commercial acceleration, not gimmicks."
    }
  },
  crm: {
    header: {
      eyebrow: "CRM module",
      title: "Lead capture and follow-up",
      description:
        "This first scaffold focuses on an intake pattern that works on mobile, validates quickly, and stays ready for Supabase persistence."
    },
    form: {
      title: "Fast lead intake",
      description:
        "Use this as the reference pattern for mobile-first forms: top labels, compact fields, and one obvious primary action.",
      companyLabel: "Company",
      companyPlaceholder: "Northline Industrial",
      contactNameLabel: "Contact name",
      contactNamePlaceholder: "Andrea Castillo",
      emailLabel: "Email",
      emailPlaceholder: "andrea@northline.com",
      whatsappLabel: "WhatsApp",
      whatsappPlaceholder: "+1 809 555 0186",
      sourceLabel: "Source",
      sourceWebsite: "Website form",
      sourceWhatsapp: "WhatsApp",
      sourceWalkIn: "Walk-in",
      sourceRepeat: "Existing customer",
      needSummaryLabel: "Need summary",
      needSummaryPlaceholder:
        "The client needs three rugged tablets, protective cases, and next-day delivery pricing.",
      submit: "Create lead",
      submitting: "Saving lead...",
      clear: "Clear form",
      previewTitle: "Submission preview",
      previewDescription:
        "This panel becomes useful later for AI enrichment, assignment rules, and suggested next steps.",
      previewDraftStatus: "Draft ready for review",
      previewStatus: "Lead captured in draft mode",
      previewEmptyTitle: "Nothing submitted yet",
      previewEmptyDescription:
        "Fill the form to validate the scaffolded form stack, field styles, and mobile-first spacing.",
      previewCompany: "Company",
      previewContact: "Contact",
      previewChannel: "Channel",
      previewNeed: "Need",
      previewPendingValue: "Pending"
    },
    recent: {
      title: "Recent pipeline snapshots",
      description:
        "Live customer read for the active tenant while keeping CRM cards lightweight on mobile.",
      originLabel: "Origin",
      noTenantTitle: "There is no active tenant to read customers from",
      noTenantDescription:
        "The user must belong to an active tenant before the CRM can read live data.",
      loadingTitle: "Loading live customers",
      loadingDescription:
        "We are reading the `customers` module with the current tenant context.",
      errorTitle: "We could not load customers",
      errorDescription:
        "The live CRM read failed for now. {{message}}",
      retryAction: "Retry load",
      emptyTitle: "There are no customers yet",
      emptyDescription:
        "When you start creating real customers, this panel will show them here with their baseline data.",
      contactPending: "Pending contact",
      customerStatus: {
        active: "Active",
        inactive: "Inactive",
        archived: "Archived"
      },
      source: {
        manual: "Manual entry",
        website: "Website form",
        whatsapp: "WhatsApp",
        walkIn: "Walk-in",
        repeat: "Repeat customer"
      }
    },
    rules: {
      title: "UX rules for CRM views",
      description:
        "These patterns should stay stable as the module grows.",
      captureTitle: "Capture from any channel",
      captureText:
        "Website, WhatsApp, walk-in, and repeat requests should end up in the same clean lead model.",
      followUpTitle: "Keep follow-up visible",
      followUpText:
        "The next action should be obvious and reachable from mobile without opening multiple screens.",
      responseTimeTitle: "Reduce response time",
      responseTimeText:
        "Good UX here is not cosmetic. It directly affects quote speed and conversion."
    },
    validation: {
      companyMin: "Enter the company or business name.",
      companyMax: "Keep the company name under 120 characters.",
      contactNameMin: "Enter the contact name.",
      contactNameMax: "Keep the contact name under 120 characters.",
      email: "Enter a valid email address.",
      whatsappMin: "Enter a valid WhatsApp number.",
      whatsappMax: "Keep the phone number under 30 characters.",
      needSummaryMin: "Describe the need in at least 12 characters.",
      needSummaryMax: "Keep the summary under 500 characters."
    }
  },
  catalog: {
    header: {
      eyebrow: "Catalog module",
      title: "Publishable product system",
      description:
        "The catalog must power internal quoting and the public website without forcing tenants to duplicate content."
    },
    search: {
      title: "Search and filter shell",
      description:
        "This is the first pattern for product browsing on mobile and desktop.",
      placeholder:
        "Search by product, SKU, compatibility, or category"
    },
    visibility: {
      public: "Public",
      private: "Private"
    },
    pricing: {
      onRequest: "On request",
      contactSales: "Contact sales"
    },
    products: {
      ruggedTabletKitName: "Rugged tablet kit",
      ruggedTabletKitCategory: "Computers",
      screenRepairName: "Screen repair service",
      screenRepairCategory: "Mobile repairs",
      hydraulicFilterSetName: "Hydraulic filter set",
      hydraulicFilterSetCategory: "Heavy equipment"
    },
    vertical: {
      title: "Vertical-ready, not hardcoded",
      description:
        "Support multiple business types with shared structure and a small number of targeted extensions.",
      computersTitle: "Computers",
      computersText:
        "Variants, compatibility, and stock-aware quoting later.",
      repairsTitle: "Repairs",
      repairsText:
        "Services and diagnostics can live beside products without changing the core.",
      industrialTitle: "Industrial",
      industrialText:
        "Technical PDFs, specs, and gated pricing matter more than flashy merchandising."
    },
    rules: {
      title: "Catalog UX rules",
      description:
        "These rules should stay true for both backoffice and storefront.",
      calmCards:
        "Products, services, and parts should share a calm card pattern.",
      obviousVisibility:
        "Visibility and pricing rules must be obvious at a glance.",
      technicalFiles:
        "Technical files should feel native to the record, not bolted on.",
      searchSpeed:
        "Search should prioritize speed over filter complexity in the MVP."
    }
  },
  quotes: {
    header: {
      eyebrow: "Quotes module",
      title: "Quote workflow scaffold",
      description:
        "Quoting is the commercial center of the product. The UX must feel fast, reliable, and auditable."
    },
    flow: {
      title: "Quote-to-decision flow",
      description:
        "This sequence should stay short, visible, and easy to resume from a phone.",
      draftTitle: "Draft",
      draftText: "Collect products, pricing logic, notes, and terms.",
      reviewTitle: "Review",
      reviewText:
        "Check totals, margin guardrails, and manager approval if needed.",
      sendTitle: "Send",
      sendText: "Generate PDF and public share link with tracking.",
      decideTitle: "Decide",
      decideText:
        "Capture open, accepted, rejected, or follow-up needed."
    },
    document: {
      title: "Document experience principles",
      description:
        "Keep quoting elegant but operational. Beauty should support trust and speed.",
      structuredSections:
        "Quote builders should use structured sections, not giant forms.",
      versioning:
        "Versioning, numbering, and approval visibility are non-negotiable.",
      publicLinks:
        "Public quote links and acceptance states should feel simple for the customer too."
    },
    list: {
      title: "Live quote list",
      description:
        "Live read from `quotes` with mobile-first cards and RLS-protected visibility.",
      currentValueLabel: "Current value",
      noTenantTitle: "There is no active tenant to read quotes from",
      noTenantDescription:
        "The shell needs an active tenant before reading commercial activity.",
      loadingTitle: "Loading live quotes",
      loadingDescription:
        "We are reading the `quotes` module with the current tenant context.",
      errorTitle: "We could not load quotes",
      errorDescription:
        "The live quotes read failed for now. {{message}}",
      retryAction: "Retry load",
      emptyTitle: "There are no quotes yet",
      emptyDescription:
        "The first live quotes will appear here with their state and current value.",
      customerPending: "Pending customer",
      status: {
        draft: "Draft",
        sent: "Sent",
        viewed: "Viewed",
        approved: "Approved",
        rejected: "Rejected",
        expired: "Expired"
      }
    }
  },
  admin: {
    audit: {
      eyebrow: "Global admin",
      title: "Audit and traceability center",
      description:
        "This surface is reserved for global observability. In phase 1 only the global_admin role will have full access to the live data behind it.",
      accessTitle: "Access contract",
      accessDescription:
        "The UI can reserve the route, but real access still depends on RLS and global permissions.",
      requiredRole: "Required role",
      requiredPermissions: "Base global permissions",
      feedTitle: "Initial audit coverage",
      feedDescription:
        "Phase 1 covers functional changes, errors, and auth events.",
      entitiesTitle: "Entities that must leave a trail",
      nextTitle: "Next expansion",
      nextDescription:
        "Partial access for tenant admins will be evaluated in a later phase.",
      errorsLink: "Open the error panel",
      settingsLink: "Review system checkpoints"
    },
    errors: {
      eyebrow: "Errors and observability",
      title: "Reserved panel for operational errors",
      description:
        "This is where visible errors, edge function events, and remediation states will live for the platform.",
      severityTitle: "Expected severities",
      severityDescription:
        "The system should distinguish noise, warning, error, and critical events to prioritize response.",
      controlsTitle: "Required controls",
      controlsDescription:
        "Errors should log actor, tenant, source, and remediation state.",
      controlActors: "Actor and tenant when applicable",
      controlSource: "Technical source and severity",
      controlResolution: "Pending or fixed state",
      controlStress: "Future relation to the stress harness",
      auditLink: "Back to the audit center"
    }
  },
  auth: {
    hero: {
      eyebrow: "Backoffice access",
      title: "Sign in with a magic link and keep operations under control.",
      description:
        "Phase 2 now starts operating with real authentication, tenant bootstrap, and guided access before opening the commercial modules.",
      cardRbacTitle: "RBAC from day one",
      cardRbacText:
        "Access is decided by tenant roles and permissions, not by UI visibility.",
      cardAuditTitle: "Required auditing",
      cardAuditText:
        "Every sensitive action starts with actor tracking, timestamps, and traceability."
    },
    form: {
      title: "Request access",
      emailLabel: "Work email",
      emailPlaceholder: "team@operapyme.com",
      submit: "Send access link",
      submitting: "Sending access...",
      emailSentTitle: "Check your inbox",
      emailSentText:
        "We sent an access link to {{email}}. If you do not see it, check spam or try again.",
      noteTitle: "Current access mode",
      noteText:
        "At this stage we use email access to accelerate activation and avoid poorly managed temporary credentials."
    },
    callback: {
      eyebrow: "Validating access",
      title: "We are confirming your session.",
      description:
        "If everything works, we will take you either to the initial setup or to your workspace."
    },
    unconfigured: {
      eyebrow: "Supabase pending",
      title: "The backoffice needs a Supabase connection before opening a session.",
      description:
        "This environment still does not have the public variables or MCP alias ready to work with the remote OperaPyme project.",
      stepsTitle: "What to review",
      stepAliasTitle: "Correct MCP alias",
      stepAliasText:
        "Use `supabase_operapyme` as the canonical alias for this repo.",
      stepEnvTitle: "Public backoffice variables",
      stepEnvText:
        "Complete `apps/backoffice-pwa/.env.local` with the URL and publishable key for the correct project.",
      stepMigrationsTitle: "Migrations and bootstrap",
      stepMigrationsText:
        "Apply the secure migrations and then reload the backoffice to continue with auth."
    }
  },
  setup: {
    eyebrow: "Initial tenant bootstrap",
    title: "Create the first operating workspace before opening CRM and quotes.",
    description:
      "A first-time authenticated user should end with a real tenant, an active membership, and the tenant owner role.",
    cardTenantTitle: "Tenant first",
    cardTenantText:
      "Everything in OperaPyme starts under a tenant, with `tenant_id`, RLS, and actor tracking.",
    cardRolesTitle: "Initial owner",
    cardRolesText:
      "The first membership starts with the `tenant_owner` role to unlock setup and the next modules.",
    formTitle: "Create initial tenant",
    nameLabel: "Business name",
    namePlaceholder: "OperaPyme Demo North",
    slugLabel: "Tenant slug",
    slugPlaceholder: "operapyme-demo-north",
    slugHint: "Suggested operating URL: {{slug}}",
    submit: "Create tenant and continue",
    submitting: "Creating tenant...",
    noteTitle: "Operating rule",
    noteText:
      "Later this flow can become a multi-step wizard, but today it already leaves the membership and base role ready.",
    nextTitle: "What comes next",
    nextText:
      "After bootstrap the backoffice is ready to connect customers, quotes, and real tenant configuration."
  },
  accessDenied: {
    eyebrow: "Restricted access",
    title: "This surface is not available for your current context.",
    description:
      "Global auditing and operational errors are exclusive to the `global_admin` role in this phase.",
    backHome: "Back to home"
  },
  settings: {
    header: {
      eyebrow: "System readiness",
      title: "Environment and architecture checkpoints",
      description:
        "Use this page as the implementation bridge between the visual scaffold and the real Supabase-powered product."
    },
    env: {
      title: "Environment status",
      description:
        "The app already knows whether Supabase keys exist locally.",
      detected: "Supabase env detected",
      missing: "Supabase env missing",
      instructions:
        "Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` in `apps/backoffice-pwa/.env`."
    },
    checklist: {
      title: "Implementation checklist",
      description:
        "Keep the sequence disciplined so the product grows without structural debt.",
      connectSupabase: "Connect Supabase URL and publishable key",
      addAuth: "Add auth and initial tenant bootstrap flows",
      createRbac: "Create root RBAC tables and policies",
      wireQuery: "Wire the first React Query hooks to live data",
      enableOffline: "Enable draft-safe offline persistence"
    },
    theme: {
      title: "Color mode",
      description:
        "Each user can choose light, dark, or system without changing the tenant visual brand.",
      helper:
        "This preference belongs to the current user. The tenant palette is managed separately and affects the shared identity."
    },
    palette: {
      title: "Tenant visual palette",
      description:
        "Choose a curated palette so backoffice and storefront share the same brand without losing readability or consistency.",
      sharedBadge: "One brand, two apps",
      previewBadge: "Live preview",
      ruleTitle: "Why we start with presets instead of a free color picker",
      ruleText:
        "These palettes are curated to keep contrast, setup speed, and visual consistency across modules and screens.",
      storageTitle: "Current persistence",
      storageText:
        "In this scaffold the selection is stored locally for fast iteration. The next real step is persisting `palette_id` per tenant in Supabase and using local cache only as an optimization.",
      backofficeTitle: "Operational backoffice",
      backofficeDescription:
        "More structure, more useful density, and a more contained canvas for daily work.",
      storefrontTitle: "Editorial storefront",
      storefrontDescription:
        "More atmosphere, stronger commercial tone, and more emphasis on public conversion.",
      previewCardTitle: "Shared card",
      previewCardDescription:
        "The same brand adapts to the context without creating two different systems.",
      previewCta: "Primary CTA",
      previewAction: "Apply",
      apply: "Apply palette",
      active: "Active palette",
      contrastLabel: "CTA contrast",
      reviewLabel: "Review contrast"
    },
    principles: {
      rbacTitle: "RBAC before polish",
      rbacText:
        "Roles and RLS should shape the app early so later screens do not assume unsafe permissions.",
      offlineTitle: "Offline with purpose",
      offlineText:
        "Start with cached reads and draft queues instead of promising full offline too early.",
      edgeTitle: "Edge functions for power features",
      edgeText:
        "AI, push, PDF generation, and webhooks belong in Supabase Edge Functions, not in the client."
    }
  }
};

export default backofficeEn;
