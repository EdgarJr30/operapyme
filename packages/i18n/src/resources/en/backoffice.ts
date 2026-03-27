const backofficeEn = {
  dashboard: {
    header: {
      eyebrow: "Commercial dashboard",
      title: "Start the day with clear context and visible actions.",
      description:
        "The backoffice entry should help you read the tenant pulse, jump quickly into CRM or quoting, and resume work without visual noise."
    },
    actions: {
      newLead: "New lead",
      newQuote: "New quote"
    },
    checklist: {
      title: "Suggested next block",
      description:
        "Use this baseline to keep commercial work short, visible, and easy to resume.",
      captureLead: "Capture or update the next lead that needs follow-up.",
      prepareCatalog:
        "Complete the minimum products or services before sending new quotes.",
      sendQuote:
        "Turn one active opportunity into a live quote and review its status.",
      reviewSettings:
        "Adjust branding, preferences, and permissions before opening new surfaces."
    },
    emptyState: {
      title: "There is no commercial activity to show yet",
      description:
        "As soon as the tenant starts registering customers and quotes, this entry will show the operational summary and latest movement."
    },
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
        "Use this surface to capture live leads for the active tenant without losing the mobile-first pattern.",
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
      createSuccess: "Lead created successfully.",
      createError: "We could not create the lead. {{message}}",
      noTenantHint:
        "You need an active tenant before capturing live CRM leads.",
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
    customerForm: {
      createTitle: "Create live customer",
      createDescription:
        "This form now writes into `customers` using the active tenant and RLS policies.",
      updateTitle: "Update existing customer",
      updateDescription:
        "Use this surface to keep live operational data current without leaving the CRM module.",
      createAction: "Save customer",
      createSubmitting: "Saving customer...",
      updateAction: "Update customer",
      updateSubmitting: "Updating customer...",
      resetAction: "Clear form",
      createSuccess: "Customer created successfully.",
      createError: "We could not create the customer. {{message}}",
      updateSuccess: "Customer updated successfully.",
      updateError: "We could not update the customer. {{message}}",
      noCustomerSelected: "Select a customer before trying to update it.",
      recordLabel: "Customer to update",
      noCustomersOption: "There are no customers yet",
      noCustomersHint:
        "Create a live customer first to unlock the update flow.",
      customerCodeLabel: "Internal code",
      customerCodePlaceholder: "CLI-001",
      displayNameLabel: "Display name",
      displayNamePlaceholder: "Northline Industrial",
      contactNameLabel: "Primary contact",
      contactNamePlaceholder: "Andrea Castillo",
      legalNameLabel: "Legal name",
      legalNamePlaceholder: "Northline Industrial LLC",
      emailLabel: "Email",
      emailPlaceholder: "andrea@northline.test",
      whatsappLabel: "WhatsApp",
      whatsappPlaceholder: "+1 809 555 0186",
      phoneLabel: "Alternate phone",
      phonePlaceholder: "+1 809 555 0140",
      documentIdLabel: "Document or tax id",
      documentIdPlaceholder: "101-5555555-1",
      sourceLabel: "Source",
      statusLabel: "Status",
      notesLabel: "Operational notes",
      notesPlaceholder:
        "Commercial context, recurring needs, or important follow-up details.",
      validation: {
        customerCodeMax: "Keep the code under 40 characters.",
        displayNameMin: "Enter the customer display name.",
        displayNameMax: "Keep the display name under 120 characters.",
        contactNameMin: "Enter the primary contact.",
        contactNameMax: "Keep the contact under 120 characters.",
        legalNameMax: "Keep the legal name under 160 characters.",
        email: "Enter a valid email or leave the field empty.",
        emailMax: "Keep the email under 120 characters.",
        whatsappMax: "Keep the WhatsApp number under 30 characters.",
        phoneMax: "Keep the phone number under 30 characters.",
        documentIdMax: "Keep the document under 60 characters.",
        notesMax: "Keep the notes under 500 characters."
      }
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
      title: "Tenant commercial catalog",
      description:
        "Manage live products and services for the active tenant with visibility, pricing, and state ready for quoting."
    },
    search: {
      title: "Search the catalog",
      description:
        "Filter by name, code, category, or description without leaving the main view.",
      placeholder:
        "Search by item, code, or category"
    },
    kind: {
      product: "Product",
      service: "Service"
    },
    status: {
      active: "Active",
      draft: "Draft",
      archived: "Archived"
    },
    visibility: {
      public: "Public",
      private: "Private"
    },
    pricingMode: {
      fixed: "Fixed price",
      on_request: "On request"
    },
    pricing: {
      onRequest: "On request"
    },
    form: {
      createTitle: "Create live item",
      createDescription:
        "This form now writes into `catalog_items` for the active tenant under `catalog.write` permissions.",
      updateTitle: "Update existing item",
      updateDescription:
        "Keep the item name, price, visibility, and status current without leaving the module.",
      createAction: "Save item",
      createSubmitting: "Saving item...",
      updateAction: "Update item",
      updateSubmitting: "Updating item...",
      resetAction: "Clear form",
      createSuccess: "Catalog item created successfully.",
      createError: "We could not create the item. {{message}}",
      updateSuccess: "Catalog item updated successfully.",
      updateError: "We could not update the item. {{message}}",
      noItemSelected: "Select an item before trying to update it.",
      recordLabel: "Item to update",
      noItemsOption: "There are no items yet",
      noItemsHint:
        "Create a live item first to unlock the update flow.",
      itemCodeLabel: "Internal code",
      itemCodePlaceholder: "CAT-001",
      nameLabel: "Display name",
      namePlaceholder: "Preventive maintenance kit",
      categoryLabel: "Category",
      categoryPlaceholder: "Technical services",
      descriptionLabel: "Short description",
      descriptionPlaceholder:
        "A short commercial summary so sales understands the offer immediately.",
      kindLabel: "Type",
      visibilityLabel: "Visibility",
      pricingModeLabel: "Pricing mode",
      currencyCodeLabel: "Currency",
      currencyCodePlaceholder: "USD",
      unitPriceLabel: "Base price",
      unitPricePlaceholder: "1890",
      statusLabel: "Status",
      notesLabel: "Operational notes",
      notesPlaceholder:
        "Internal clarifications, conditions, or commercial context for the item.",
      validation: {
        itemCodeMax: "Keep the code under 40 characters.",
        nameMin: "Enter the item display name.",
        nameMax: "Keep the name under 120 characters.",
        categoryMax: "Keep the category under 80 characters.",
        descriptionMax: "Keep the description under 240 characters.",
        currencyCode: "Use a 3-letter currency code.",
        unitPriceRequired:
          "Enter a base price or switch the item to on-request pricing.",
        unitPriceMin: "Base price cannot be negative.",
        notesMax: "Keep the notes under 500 characters."
      }
    },
    list: {
      title: "Live catalog items",
      description:
        "Live read from `catalog_items` with compact cards and mobile-first focus.",
      noTenantTitle: "There is no active tenant to read the catalog from",
      noTenantDescription:
        "The shell needs an active tenant before it can read live commercial items.",
      loadingTitle: "Loading live catalog items",
      loadingDescription:
        "We are reading `catalog_items` with the current tenant context.",
      errorTitle: "We could not load the catalog",
      errorDescription:
        "The live catalog read failed for now. {{message}}",
      retryAction: "Retry load",
      emptyTitle: "There are no items yet",
      emptyDescription:
        "The first live products or services will appear here as soon as you start creating them.",
      searchEmptyTitle: "We could not find anything for this search",
      searchEmptyDescription:
        "Try another term or clear the filter to see the full catalog again.",
      noCode: "No internal code yet",
      noCategory: "Category pending",
      noDescription: "No additional description yet."
    },
    rules: {
      title: "Catalog operating rules",
      description:
        "These rules keep the slice useful for sales without dragging inventory or ERP complexity in.",
      captureTitle: "Shared capture for products and services",
      captureText:
        "The same form should work for both services and products without splitting the core model.",
      pricingTitle: "Clear price or on-request pricing",
      pricingText:
        "Every item should make it obvious whether the price is ready for quoting or still requires manual validation.",
      visibilityTitle: "Instantly understandable visibility",
      visibilityText:
        "The difference between public and private should be obvious to the commercial team."
    },
    guidelines: {
      title: "Next use of this module",
      description:
        "This first cut prepares the ground for quotes and proformas without jumping into heavier features.",
      mobileCapture:
        "Capture must stay fast on mobile and avoid dense tables or complex drawers.",
      sharedLanguage:
        "Products and services share the same operating language, not separate vertical-only structures.",
      noInventory:
        "This module does not open stock, inventory, or POS; it stays focused on the commercial catalog.",
      readyForQuotes:
        "The natural next step is connecting these items to quotes and proformas."
    }
  },
  quotes: {
    header: {
      eyebrow: "Quotes module",
      title: "Quotes with flexible recipients and commercial PDF output",
      description:
        "The quote builder must work for customers, saved leads, and fast ad hoc leads while keeping versioning, traceability, and a serious PDF output."
    },
    flow: {
      title: "Quote-to-decision flow",
      description:
        "This sequence should stay short, visible, and easy to resume from a phone.",
      draftTitle: "Draft",
      draftText:
        "Define the recipient, line items, and conditions without losing commercial speed.",
      reviewTitle: "Review",
      reviewText:
        "Review recipient snapshots, computed totals, and the commercial narrative.",
      sendTitle: "Send",
      sendText: "Generate a clean PDF with branding, dates, and service detail.",
      decideTitle: "Decide",
      decideText:
        "Keep the quote alive while it scales into a lead, customer, proforma, or close."
    },
    document: {
      title: "Document experience principles",
      description:
        "Keep quoting elegant but operational. Beauty should support trust and speed.",
      structuredSections:
        "The quote builder should work in clear recipient, line item, total, and notes blocks.",
      versioning:
        "Versioning, numbering, and recipient snapshots are non-negotiable.",
      publicLinks:
        "The PDF should be ready to send quickly without a manual layout step."
    },
    form: {
      createTitle: "Create live quote",
      createDescription:
        "Create live quotes with a customer, a saved lead, or a fast ad hoc lead, while totals are computed from line items.",
      updateTitle: "Update existing quote",
      updateDescription:
        "Edit a live quote for the active tenant with versioning and persisted line detail.",
      createAction: "Save quote",
      createSubmitting: "Saving quote...",
      updateAction: "Update quote",
      updateSubmitting: "Updating quote...",
      resetAction: "Clear form",
      createSuccess: "Quote created successfully as {{quoteNumber}}.",
      createError: "We could not create the quote. {{message}}",
      updateSuccess: "Quote updated successfully.",
      updateError: "We could not update the quote. {{message}}",
      noQuoteSelected: "Select a quote before trying to update it.",
      recordLabel: "Quote to update",
      noQuotesOption: "There are no quotes yet",
      noQuotesHint:
        "Create a live quote first to unlock the update flow.",
      loadingDetailHint: "Loading the full detail for the selected quote.",
      loadingDetailError:
        "We could not read the quote detail. {{message}}",
      versionHint: "The next update will bump the version from v{{version}}.",
      recipientKindLabel: "Recipient type",
      recipientKinds: {
        customer: "Existing customer",
        lead: "Existing lead",
        ad_hoc: "Fast lead"
      },
      customerLabel: "Customer",
      customerPlaceholder: "Select a customer",
      noCustomersHint:
        "There are no live customers yet. You can use an existing lead or a fast lead instead.",
      leadLabel: "Lead",
      leadPlaceholder: "Select a lead",
      noLeadsHint:
        "There are no saved leads yet. Capture them from CRM or quote as a fast lead instead.",
      quickRecipientTitle: "Fast quote without saving a lead",
      quickRecipientDescription:
        "Use this mode when you need to issue a quote immediately and decide later whether the recipient should be promoted to a lead or customer.",
      quoteNumberLabel: "Quote number",
      generatedNumberPlaceholder: "Assigned automatically after save",
      generatedNumberHint:
        "Numbering now lives in Supabase and is assigned automatically to keep consistency and auditability.",
      recipientDisplayNameLabel: "Company or reference",
      recipientDisplayNamePlaceholder: "Northline Industrial",
      recipientContactNameLabel: "Contact",
      recipientContactNamePlaceholder: "Andrea Castillo",
      recipientEmailLabel: "Email",
      recipientEmailPlaceholder: "andrea@northline.test",
      recipientWhatsAppLabel: "WhatsApp",
      recipientWhatsAppPlaceholder: "+1 809 555 0186",
      recipientPhoneLabel: "Alternate phone",
      recipientPhonePlaceholder: "+1 809 555 0140",
      titleLabel: "Title",
      titlePlaceholder: "Equipment and support proposal",
      statusLabel: "Status",
      currencyCodeLabel: "Currency",
      currencyCodePlaceholder: "USD",
      validUntilLabel: "Valid until",
      lineItemsTitle: "Commercial detail",
      lineItemsDescription:
        "Each row should represent one offered service or product with quantity, price, and visible adjustments.",
      addLineItemAction: "Add line",
      removeLineItemAction: "Remove line",
      lineItemLabel: "Line {{index}}",
      catalogItemLabel: "Related catalog item",
      catalogItemPlaceholder: "Select a catalog item or capture it manually",
      catalogItemOnRequest: "On request",
      lineItemNameLabel: "Service or product name",
      lineItemNamePlaceholder: "Quarterly preventive maintenance",
      lineItemDescriptionLabel: "Description",
      lineItemDescriptionPlaceholder:
        "Include scope, deliverables, coverage, or clarifications for this line.",
      unitLabelLabel: "Unit",
      unitLabelPlaceholder: "service",
      quantityLabel: "Quantity",
      unitPriceLabel: "Unit price",
      discountTotalLabel: "Discount",
      taxTotalLabel: "Tax",
      lineItemTotalLabel: "Line total",
      defaultServiceUnit: "service",
      defaultProductUnit: "unit",
      grandTotalLabel: "Calculated total",
      subtotalSummaryLabel: "Subtotal",
      discountSummaryLabel: "Discounts",
      taxSummaryLabel: "Taxes",
      notesLabel: "Notes",
      notesPlaceholder:
        "Commercial terms, delivery conditions, or internal clarifications.",
      validation: {
        customerRequired: "Select a customer before saving.",
        leadRequired: "Select a lead before saving.",
        recipientDisplayNameMin: "Enter the company or reference for this recipient.",
        recipientDisplayNameMax:
          "Keep the company or reference under 120 characters.",
        recipientContactNameMax:
          "Keep the contact under 120 characters.",
        recipientEmail:
          "Enter a valid email or leave the field empty.",
        recipientEmailMax:
          "Keep the email under 120 characters.",
        recipientWhatsAppMax:
          "Keep the WhatsApp number under 30 characters.",
        recipientPhoneMax:
          "Keep the phone number under 30 characters.",
        titleMin: "Enter a title for the quote.",
        titleMax: "Keep the title under 160 characters.",
        currencyCode: "Use a 3-letter currency code.",
        lineItemsMin: "Add at least one line item to the quote.",
        lineItemNameMin: "Each line needs a visible name.",
        lineItemNameMax:
          "Keep the line item name under 160 characters.",
        lineItemDescriptionMax:
          "Keep the line item description under 500 characters.",
        quantity: "Quantity must be greater than zero.",
        unitLabelMax: "Keep the unit label under 40 characters.",
        unitPrice: "Unit price cannot be negative.",
        discountTotal: "Discount cannot be negative.",
        taxTotal: "Tax cannot be negative.",
        notesMax: "Keep the notes under 500 characters."
      }
    },
    list: {
      title: "Live quote list",
      description:
        "Live read from `quotes` with recipient snapshots, mobile-first cards, and PDF download.",
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
      customerPending: "Pending recipient",
      status: {
        draft: "Draft",
        sent: "Sent",
        viewed: "Viewed",
        approved: "Approved",
        rejected: "Rejected",
        expired: "Expired"
      }
    },
    pdf: {
      downloadAction: "Download PDF",
      generatingAction: "Generating PDF...",
      downloadError: "We could not generate the PDF. {{message}}",
      noTenantError: "You need an active tenant before generating the PDF."
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
      eyebrow: "OperaPyme on the web",
      title: "Synced across all your devices.",
      description:
        "Use OperaPyme on your phone or your computer with the same work experience.",
      cardRbacTitle: "RBAC from day one",
      cardRbacText:
        "Access is decided by tenant roles and permissions, not by UI visibility.",
      cardAuditTitle: "Required auditing",
      cardAuditText:
        "Every sensitive action starts with actor tracking, timestamps, and traceability."
    },
    entry: {
      brandLabel: "Operational backoffice",
      existingLead: "If you already use OperaPyme:",
      existingCta: "Sign in",
      firstTimeLead: "If this is your first time with OperaPyme:",
      firstTimeCta: "Create your account",
      signinEyebrow: "Existing access",
      signinPanelTitle: "Sign in to your account",
      signinSwitchLead: "Do not have access yet?",
      signinSwitchAction: "Create your account",
      formTitle: "Enter your email to continue",
      signinDescription:
        "We will send an access link to your work email so you can sign in to your account.",
      signupEyebrow: "First session",
      signupPanelTitle: "Create your account",
      signupSwitchLead: "Already have access?",
      signupSwitchAction: "Sign in",
      signupDescription:
        "We will send a link so you can create your access and start setting up your workspace.",
      helper:
        "Use the email address you run your business with to continue."
    },
    form: {
      title: "Request access",
      emailLabel: "Work email",
      emailPlaceholder: "team@operapyme.com",
      submit: "Send access link",
      submitFirstTime: "Send link to get started",
      submitting: "Sending access...",
      emailSentTitle: "Check your inbox",
      emailSentText:
        "We sent an access link to {{email}}. If you do not see it, check spam or try again.",
      noteTitle: "Current access mode",
      noteText:
        "We use email access so you can sign in quickly from any device."
    },
    callback: {
      eyebrow: "Validating access",
      title: "We are confirming your session.",
      description:
        "If everything works, we will take you either to the initial setup or to your workspace.",
      errorMissing:
        "The access link is missing the required data or it was already consumed. Request a fresh one from sign in.",
      errorUnsupported:
        "The access link uses a format that this backoffice cannot validate yet.",
      backToAuth: "Request another link"
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
