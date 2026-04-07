const backofficeEn = {
  shared: {
    closeDialog: "Close dialog",
    slider: {
      previous: "View previous",
      next: "View next"
    }
  },
  dashboard: {
    header: {
      eyebrow: "Home",
      title: "Cashflow",
      description:
        "Review recent activity, prioritize the next step, and jump straight into CRM, catalog, or quotes.",
      customerCountBadge: "{count} customers in pipeline",
      activeCustomerCountBadge: "{count} active",
      openQuoteCountBadge: "{count} open quotes",
      pendingBadge: "Waiting for tenant context"
    },
    actions: {
      newLead: "New lead",
      newQuote: "New quote",
      reviewCatalog: "Review catalog",
      reviewQuotes: "Review quotes"
    },
    ranges: {
      "7d": "Last 7 days",
      "30d": "Last 30 days",
      all: "All time"
    },
    checklist: {
      title: "Next in queue",
      description:
        "Open the key blocks of the day without losing context.",
      captureLead: "Register a new lead",
      prepareCatalog: "Update products and services",
      sendQuote: "Prepare or resume a quote",
      reviewSettings: "Adjust tenant settings"
    },
    emptyState: {
      title: "There is no commercial movement yet",
      description:
        "Start from CRM or catalog to prepare the tenant's first quote."
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
        label: "Customers",
        detail: "{count} customers available to quote and follow up.",
        change: "+{count}"
      },
      activeCustomerCount: {
        label: "Active customers",
        detail: "{count} customers remain ready for commercial follow-up.",
        change: "+{count}"
      },
      quoteCount: {
        label: "Quotes",
        detail: "{count} quotes currently stored for this tenant.",
        change: "-{count}"
      },
      openQuoteCount: {
        label: "Open quotes",
        detail: "{count} quotes still moving through the pipeline.",
        change: "+{count}"
      },
      customersValue: "{count}",
      documentsValue: "{count}"
    },
    focus: {
      title: "Suggested focus",
      description:
        "A short read so you can decide the next operational block of the day.",
      recommendedLabel: "Prioritize now",
      focusCaptureLead:
        "There is no active customer base yet. Capture the first lead and open the commercial pipeline as soon as possible.",
      focusResumeQuotes:
        "There are {count} open quotes. Resume them before opening new work.",
      focusPrepareQuote:
        "There is already an active pipeline, but no quote is in motion. Prepare the next proposal.",
      focusReviewCatalog:
        "The commercial base already has movement. Review the catalog so quoting stays faster and more consistent.",
      metrics: {
        activeCustomers: "Active customers",
        openQuotes: "Open quotes",
        totalQuotes: "Total quotes"
      }
    },
    activity: {
      title: "Recent activity",
      description:
        "Recently touched quotes so the team can resume negotiations without losing context.",
      empty:
        "There are no recent quotes to show for this tenant yet.",
      emptyRange:
        "We could not find recent quotes within the selected range.",
      today: "Today",
      yesterday: "Yesterday",
      headers: {
        quote: "Quote",
        recipient: "Recipient",
        status: "Status",
        amount: "Value",
        action: "Action"
      },
      viewAction: "Open",
      status: {
        positive: "Paid",
        neutral: "Withdraw",
        negative: "Overdue"
      }
    },
    livePulse: {
      noTenantTitle: "There is no active tenant selected yet",
      noTenantDescription:
        "Select an active tenant before reviewing customers and quotes.",
      loadingTitle: "Loading the commercial pulse",
      loadingDescription:
        "We are reading customers and quotes for the active tenant.",
      errorTitle: "We could not load the commercial pulse",
      errorDescription:
        "The live tenant read failed for now. {message}",
      retryAction: "Retry load",
      customersTitle: "Recent customers",
      customersDescription:
        "Latest customers touched by the commercial team.",
      customersAction: "Go to CRM",
      customersEmpty: "There are no recent customers to show yet.",
      quotesTitle: "Recent quotes",
      quotesDescription:
        "Quotes with recent follow-up and PDF output.",
      quotesAction: "Go to quotes",
      quotesEmpty: "There are no recent quotes to show yet.",
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
    clients: {
      title: "Recent customers",
      description:
        "Review the latest customers touched by the team and open CRM with context.",
      viewAll: "Open CRM",
      emptyRange:
        "We could not find recent customers within the selected range.",
      lastTouchLabel: "Last touch",
      sourceLabel: "Source",
      amountLabel: "Amount",
      pendingCollectionStatus: "Pending collection",
      paidThisMonthStatus: "Paid this month",
      optionsLabel: "Options for {customer}"
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
  learning: {
    header: {
      eyebrow: "Learning",
      title: "Quick guides to move forward with confidence",
      description:
        "Find the essential step-by-step guidance here so using OperaPyme feels clearer and easier."
    },
    principles: {
      title: "What you will find here",
      description:
        "This space gathers short, practical help so work screens can stay simple and focused.",
      runtimeTitle: "Less friction while working",
      runtimeText:
        "Screens like create quote now stay focused on completing the task instead of over-explaining it.",
      guidesTitle: "Clear steps",
      guidesText:
        "Each guide summarizes the recommended order to solve a task without wasting time figuring out where to start.",
      supportTitle: "Direct access",
      supportText:
        "Jump into the right area from here and complete the real action once the next step is clear."
    },
    guides: {
      quotesFast: {
        eyebrow: "Quotes",
        title: "Create a quote in a few steps",
        description:
          "Ideal for sending a proposal without slowing down the commercial flow.",
        stepOne: "Choose customer, lead, or fast lead based on the context.",
        stepTwo: "Fill title, status, currency, and validity only when they matter.",
        stepThree: "Add at least one line with quantity and price, then save.",
        action: "Go to new quote"
      },
      quotesManage: {
        eyebrow: "Follow-up",
        title: "Resume an existing quote",
        description:
          "Use this guide to adjust, update, or close documents that already exist.",
        stepOne: "Open manage quotes and pick the correct document.",
        stepTwo: "Adjust recipient, document, or line items depending on the case.",
        stepThree: "Save changes and verify the total before sharing.",
        action: "Go to manage quotes"
      },
      crmLead: {
        eyebrow: "CRM",
        title: "Capture a lead and prepare it for quoting",
        description:
          "When there is still no clear recipient in the pipeline, this is the best place to start.",
        stepOne: "Register company, contact, and the main channel.",
        stepTwo: "Summarize the commercial need in one useful sentence.",
        stepThree: "Then move into quotes once you know what you will offer.",
        action: "Go to CRM"
      },
      catalog: {
        eyebrow: "Catalog",
        title: "Prepare items before quoting",
        description:
          "This helps you quote faster when you sell recurring products or services.",
        stepOne: "Create products or services with a clear name and category.",
        stepTwo: "Define whether pricing is fixed or on request.",
        stepThree: "Use those items later inside quote line items.",
        action: "Go to catalog"
      }
    }
  },
  crm: {
    header: {
      eyebrow: "CRM module",
      title: "Leads, customers, and follow-up",
      description:
        "Capture opportunities, review recent customers, and update commercial data without leaving the module."
    },
    actions: {
      captureLead: "Capture lead",
      manageCustomers: "Manage customers"
    },
    overview: {
      title: "CRM status",
      description:
        "Use this summary to see whether the tenant already has an active base and cases that need follow-up.",
      totalCustomers: "{count} customers",
      activeCustomers: "{count} active",
      inactiveCustomers: "{count} to review",
      totalLabel: "Total customers",
      activeLabel: "Active customers",
      needsAttentionLabel: "Inactive or archived",
      emptyTitle: "There are no customers in the pipeline yet",
      emptyDescription:
        "Start by capturing a lead or creating the tenant's first customer."
    },
    form: {
      title: "Fast lead intake",
      description:
        "Capture a lead with the minimum information needed to keep commercial speed.",
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
      createError: "We could not create the lead. {message}",
      noTenantHint:
        "You need an active tenant before capturing live CRM leads.",
      previewTitle: "Lead summary",
      previewDescription:
        "Quickly verify the contact and the need before moving into customer or quote work.",
      previewDraftStatus: "Lead in capture",
      previewStatus: "Lead ready for follow-up",
      previewEmptyTitle: "Nothing submitted yet",
      previewEmptyDescription:
        "Fill the form to see the operational summary for this lead.",
      previewCompany: "Company",
      previewContact: "Contact",
      previewChannel: "Channel",
      previewNeed: "Need",
      previewPendingValue: "Pending"
    },
    recent: {
      title: "Recent customers",
      description:
        "Review the latest customers touched by the team and enter each follow-up with context.",
      originLabel: "Origin",
      noTenantTitle: "There is no active tenant to read customers from",
      noTenantDescription:
        "Select an active tenant before reviewing the customer base.",
      loadingTitle: "Loading live customers",
      loadingDescription:
        "We are reading customers for the active tenant.",
      errorTitle: "We could not load customers",
      errorDescription:
        "The live CRM read failed for now. {message}",
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
      createTitle: "New customer",
      createDescription:
        "Complete the commercial profile so the customer is ready for follow-up and quoting.",
      updateTitle: "Update customer",
      updateDescription:
        "Correct customer data, status, or notes without leaving CRM.",
      createAction: "Save customer",
      createSubmitting: "Saving customer...",
      updateAction: "Update customer",
      updateSubmitting: "Updating customer...",
      resetAction: "Clear form",
      createSuccess: "Customer created successfully.",
      createError: "We could not create the customer. {message}",
      updateSuccess: "Customer updated successfully.",
      updateError: "We could not update the customer. {message}",
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
        "Organize products and services, update pricing and visibility, and keep everything ready for quoting."
    },
    actions: {
      manageItems: "Manage items",
      reviewList: "Review list"
    },
    overview: {
      title: "Catalog status",
      description:
        "Quickly validate whether the tenant already has a published offer and how many items stay on-request.",
      totalItems: "{count} items",
      publicItems: "{count} public",
      onRequestItems: "{count} on request",
      totalLabel: "Total items",
      publicLabel: "Visible to the team",
      onRequestLabel: "On-request pricing",
      emptyTitle: "There are no items yet",
      emptyDescription:
        "Start by creating the first product or service for this tenant."
    },
    search: {
      title: "Search the catalog",
      description:
        "Filter by name, code, category, or description without leaving the list.",
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
      createTitle: "New item",
      createDescription:
        "Register a product or service with the minimum information sales needs.",
      updateTitle: "Update item",
      updateDescription:
        "Adjust pricing, visibility, or state without leaving the catalog.",
      createAction: "Save item",
      createSubmitting: "Saving item...",
      updateAction: "Update item",
      updateSubmitting: "Updating item...",
      resetAction: "Clear form",
      createSuccess: "Catalog item created successfully.",
      createError: "We could not create the item. {message}",
      updateSuccess: "Catalog item updated successfully.",
      updateError: "We could not update the item. {message}",
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
    filters: {
      all: "All",
      active: "Active only",
      inactive: "Inactive"
    },
    table: {
      nameLabel: "Name / Code",
      categoryLabel: "Category",
      kindLabel: "Type",
      visibilityLabel: "Visibility",
      pricingLabel: "Price",
      statusLabel: "Status",
      actionsLabel: "Actions",
      editAction: "Edit"
    },
    list: {
      title: "Catalog",
      description:
        "Review available items, filter quickly, and detect missing information before quoting.",
      noTenantTitle: "There is no active tenant to read the catalog from",
      noTenantDescription:
        "Select an active tenant before reviewing the catalog.",
      loadingTitle: "Loading live catalog items",
      loadingDescription:
        "We are reading the active tenant catalog.",
      errorTitle: "We could not load the catalog",
      errorDescription:
        "The live catalog read failed for now. {message}",
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
      title: "Quotes and commercial documents",
      description:
        "Create, update, and follow quotes with flexible recipients and PDF output ready to send."
    },
    actions: {
      createQuote: "Create quote",
      reviewQuotes: "Review quotes"
    },
    subroutes: {
      createEyebrow: "New flow",
      createTitle: "Create quote",
      createDescription:
        "Work through short steps to capture the recipient, document, and commercial detail with less friction.",
      manageEyebrow: "Active follow-up",
      manageTitle: "Manage quotes",
      manageDescription:
        "Resume existing documents, adjust line items, and keep context before sending."
    },
    createPage: {
      directEntryDescription:
        "Start directly: customers {customers}, leads {leads}, items {catalogItems}. Complete what you need and save.",
      customerCount: "Customers ready",
      customerCountHint: "Use them when you already know who you are quoting.",
      leadCount: "Leads ready",
      leadCountHint: "Resume existing prospects without leaving the flow.",
      catalogCount: "Items ready",
      catalogCountHint: "Speed up the commercial detail with reusable catalog items.",
      focusTitle: "What matters most right now",
      focusDescription:
        "This flow now keeps the minimum work front and center and only reveals the rest when it actually helps.",
      focusRecipientTitle: "1. Define the recipient",
      focusRecipientDescription:
        "Choose customer, lead, or fast lead and fill only the useful contact channels.",
      focusDocumentTitle: "2. Adjust the document",
      focusDocumentDescription:
        "Title, status, currency, and validity now stay together so decisions feel cleaner.",
      focusItemsTitle: "3. Build the proposal",
      focusItemsDescription:
        "Complete line items, review totals, and save without losing context.",
      fastTrackTitle: "Recommended shortcut",
      fastTrackDescription:
        "If you just need to quote now, start with fast lead and move in this order.",
      fastTrackLead:
        "Enter the company or reference plus at least one clear contact channel.",
      fastTrackPrice:
        "Add one line with name, quantity, and price so the total becomes clear.",
      fastTrackSave:
        "Save the quote and decide later whether this recipient should move into CRM."
    },
    landing: {
      createCardTitle: "Create a new quote",
      createCardDescription: "Start with a short, step-based flow.",
      manageCardTitle: "Manage existing quotes",
      manageCardDescription: "Jump straight into the quotes that need changes or follow-up.",
      resumeCardTitle: "Resume pending work",
      resumeCardDescription: "Return quickly to drafts, open quotes, and approved documents."
    },
    overview: {
      title: "Quoting readiness",
      description:
        "Check whether the tenant already has enough base data to quote and how many quotes stay open.",
      totalQuotes: "{count} quotes",
      openQuotes: "{count} open",
      approvedQuotes: "{count} approved",
      customersReady: "Available customers",
      leadsReady: "Available leads",
      catalogReady: "Catalog items",
      readyToSend: "Quotes in follow-up"
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
      createTitle: "New quote",
      createDescription:
        "Complete the recipient, line items, and terms to issue a quote ready to send.",
      createBadge: "New document",
      updateTitle: "Update quote",
      updateDescription:
        "Resume an existing quote, adjust line items, and keep versioning intact.",
      updateBadge: "Active edit",
      workflowTitle: "Progressive quote flow",
      workflowDescription:
        "Reduce visual noise and keep only the useful fields visible at each step.",
      workflowRecipientHint: "Step 1: define the recipient and contact channels.",
      workflowDocumentHint: "Step 2: adjust status, currency, and document validity.",
      workflowItemsHint: "Step 3 and 4: build line items, review totals, and close with notes.",
      newDraftLabel: "New draft",
      summaryTitle: "Quick summary",
      summaryRecipient: "Recipient",
      summaryStatus: "Status",
      summaryLineItems: "Lines",
      pendingSummaryValue: "Pending",
      validationSummaryTitle: "Form health",
      validationSummaryReady: "Everything looks ready to save or update.",
      validationSummaryReadyTitle: "Ready to save",
      validationSummaryReadyDescription:
        "There are no visible blockers left in this form.",
      validationSummaryPending:
        "There are still fields to review before closing the quote.",
      validationSummaryPendingDetailed:
        "There are {count} items to review before closing the quote.",
      reviewChecklistTitle: "Final review",
      reviewChecklistRecipient: "Confirm the recipient and channels visible in the document.",
      reviewChecklistDocument: "Verify validity date, status, and commercial narrative.",
      reviewChecklistItems: "Confirm line items, discounts, taxes, and the computed total.",
      backStepAction: "Previous step",
      nextStepAction: "Next step",
      stepNumber: "Step {count}",
      steps: {
        recipient: {
          title: "Recipient",
          description: "Define who the quote is for and how they should be reached."
        },
        document: {
          title: "Document",
          description: "Adjust operational metadata without mixing it with line items."
        },
        items: {
          title: "Line items",
          description: "Capture the commercial detail and keep totals clear."
        },
        review: {
          title: "Review",
          description: "Close notes, validate context, and save the document."
        }
      },
      createAction: "Save quote",
      createSubmitting: "Saving quote...",
      updateAction: "Update quote",
      updateSubmitting: "Updating quote...",
      resetAction: "Clear form",
      createSuccess: "Quote created successfully as {quoteNumber}.",
      createError: "We could not create the quote. {message}",
      validationToast:
        "Review {label}. There are still {count} items to fix.",
      updateSuccess: "Quote updated successfully.",
      updateError: "We could not update the quote. {message}",
      noQuoteSelected: "Select a quote before trying to update it.",
      recordLabel: "Quote to update",
      noQuotesOption: "There are no quotes yet",
      noQuotesHint:
        "Create a live quote first to unlock the update flow.",
      loadingDetailHint: "Loading the full detail for the selected quote.",
      loadingDetailError:
        "We could not read the quote detail. {message}",
      versionHint: "The next update will bump the version from v{version}.",
      recipientKindLabel: "Recipient type",
      recipientKinds: {
        customer: "Existing customer",
        lead: "Existing lead",
        ad_hoc: "Fast lead"
      },
      recipientKindDescriptions: {
        customer: "Use an existing customer and bring their data into the document.",
        lead: "Resume an existing lead without capturing it again.",
        ad_hoc: "Quote now and decide later whether it belongs in CRM."
      },
      recipientSelectorTitle: "How do you want to start this quote",
      recipientSelectorDescription:
        "Pick the path that gets this quote out with the fewest steps.",
      customerLabel: "Customer",
      customerPlaceholder: "Select a customer",
      customerSearchPlaceholder: "Search by company or tax id",
      customerSearchEmpty: "We could not find customers with that company or tax id.",
      customerSelectedHint:
        "Selected customer:",
      noCustomersHint:
        "There are no live customers yet. You can use an existing lead or a fast lead instead.",
      leadLabel: "Lead",
      leadPlaceholder: "Select a lead",
      leadSelectedHint:
        "When you choose a lead, their data fills into the document so you do not repeat work.",
      noLeadsHint:
        "There are no saved leads yet. Capture them from CRM or quote as a fast lead instead.",
      quickRecipientTitle: "Fast quote without saving a lead",
      quickRecipientDescription:
        "Use this mode when you need to quote immediately and decide later whether the recipient belongs in CRM.",
      centralFocusTitle: "Focus for this step",
      centralFocusByStep: {
        recipient:
          "Make it clear who this quote is for and which channel should be used to respond.",
        document:
          "Adjust the title, currency, and validity so the document reads cleanly.",
        items:
          "Build a proposal that is easy to understand, with clear lines and a reliable total.",
        review:
          "Do one final pass on notes, blockers, and total before saving."
      },
      quoteNumberLabel: "Quote number",
      generatedNumberPlaceholder: "Assigned automatically after save",
      generatedNumberHint:
        "Numbering is assigned automatically to keep order and traceability.",
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
      documentDiscountTitle: "Document-level discount",
      documentDiscountDescription:
        "Apply a general adjustment to the full quote after line-level discounts.",
      documentDiscountPercentLabel: "Document discount %",
      documentDiscountAmountLabel: "Fixed document discount",
      documentDiscountHint:
        "It is calculated on {amount} net after line-level discounts.",
      validUntilLabel: "Valid until",
      lineItemsTitle: "Commercial detail",
      lineItemsDescription:
        "Each line should make it clear what is being offered, how much it costs, and which adjustment applies.",
      addLineItemAction: "Add line",
      removeLineItemAction: "Remove line",
      lineItemLabel: "Line {index}",
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
      discountPercentLabel: "Discount %",
      discountAmountLabel: "Fixed discount",
      discountTotalLabel: "Discount",
      taxTotalLabel: "Tax",
      discountSyncHint:
        "You can edit the percentage or the amount; the system keeps percentage as the reference and recalculates the other value.",
      lineItemTotalLabel: "Line total",
      defaultServiceUnit: "service",
      defaultProductUnit: "unit",
      grandTotalLabel: "Calculated total",
      subtotalSummaryLabel: "Subtotal",
      lineDiscountSummaryLabel: "Line discounts",
      documentDiscountSummaryLabel: "Document discount",
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
        documentDiscountPercent:
          "Document percentage discount cannot be negative.",
        documentDiscountPercentMax:
          "Document percentage discount cannot exceed 100%.",
        documentDiscountTotal: "Document discount cannot be negative.",
        documentDiscountTotalExceeded:
          "Document discount cannot exceed the net subtotal after line discounts.",
        lineItemsMin: "Add at least one line item to the quote.",
        lineItemNameMin: "Each line needs a visible name.",
        lineItemNameMax:
          "Keep the line item name under 160 characters.",
        lineItemDescriptionMax:
          "Keep the line item description under 500 characters.",
        quantity: "Quantity must be greater than zero.",
        unitLabelMax: "Keep the unit label under 40 characters.",
        unitPrice: "Unit price cannot be negative.",
        discountPercent: "Percentage discount cannot be negative.",
        discountPercentMax: "Percentage discount cannot exceed 100%.",
        discountTotal: "Discount cannot be negative.",
        discountTotalExceeded:
          "Fixed discount cannot exceed the line subtotal.",
        taxTotal: "Tax cannot be negative.",
        notesMax: "Keep the notes under 500 characters."
      }
    },
    manage: {
      selectorTitle: "Recent quotes",
      selectorDescription:
        "Choose a quote to resume the flow without opening an overly long screen."
    },
    list: {
      title: "Quote list",
      description:
        "Review recent quotes, check status, and download the PDF without leaving the module.",
      currentValueLabel: "Current value",
      noTenantTitle: "There is no active tenant to read quotes from",
      noTenantDescription:
        "Select an active tenant before reviewing quotes.",
      loadingTitle: "Loading live quotes",
      loadingDescription:
        "We are reading quotes for the active tenant.",
      errorTitle: "We could not load quotes",
      errorDescription:
        "The live quotes read failed for now. {message}",
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
      downloadSuccess: "The quote PDF is downloading now.",
      downloadError: "We could not generate the PDF. {message}",
      noTenantError: "You need an active tenant before generating the PDF."
    }
  },
  commercial: {
    summary: {
      title: "Commercial Management",
      description:
        "Unify leads, customers, quotes, and documentary invoices in one operational module.",
      pipelineTitle: "Active pipeline",
      pipelineDescription:
        "Capture, qualify, quote, and invoice without opening unnecessary routes.",
      stages: {
        leads: "Leads in capture",
        customers: "Customers ready",
        quotes: "Open quotes",
        invoices: "Documentary invoices"
      },
      cards: {
        leads: "Capture and prioritize new opportunities.",
        customers: "Consolidate an active customer base with ready-to-use data.",
        quotes: "Issue proposals for items or services.",
        invoices: "Convert closed work into an internal documentary invoice."
      },
      recentTitle: "Recent activity",
      recentDescription:
        "Latest useful movements to resume the commercial pipeline.",
      recentEmpty: "There is no recent activity in this module yet."
    },
    leads: {
      tableTitle: "Recent leads",
      tableDescription:
        "Convert to customer only when the lead is already ready to operate.",
      emptyTitle: "There are no captured leads yet",
      emptyDescription:
        "The first commercial opportunity will appear here for follow-up and conversion.",
      noContact: "No contact",
      editAction: "Edit",
      editModalTitle: "Edit lead",
      editModalDescription:
        "Fix lead data without leaving the operating list.",
      editCancelAction: "Cancel",
      editSaveAction: "Save changes",
      editSubmitting: "Saving...",
      editSuccess: "We updated lead {lead}.",
      editError: "We could not update the lead. {message}",
      convertAction: "Move to customers",
      convertSubmitting: "Converting...",
      convertSuccess: "{lead} is now in customers.",
      convertError: "We could not convert the lead. {message}",
      paginationInfo: "Page {current} of {total}"
    },
    customers: {
      pageTitle: "Customers",
      pageDescription:
        "Review the full portfolio, edit operational records, and archive customers without leaving the table.",
      tableTitle: "Recent customers",
      tableDescription:
        "A clean customer base speeds up quotes, invoices, and follow-up.",
      emptyTitle: "There are no customers yet",
      emptyDescription:
        "Once you close a lead or register the first customer, it will show here.",
      loadingTitle: "Loading customers",
      loadingDescription:
        "We are reading the commercial portfolio for the active tenant.",
      errorTitle: "We could not load the portfolio",
      errorDescription: "Customer loading failed for now. {message}",
      emptySearchTitle: "We could not find customers with that filter",
      emptySearchDescription:
        "Adjust the search or switch filters to see more results.",
      searchPlaceholder: "Search by name, contact, email, or code",
      noContact: "No email or WhatsApp",
      actionsLabel: "Actions",
      createAction: "New customer",
      editAction: "Edit",
      archiveAction: "Archive",
      cancelAction: "Cancel",
      archiveConfirmTitle: "Archive customer",
      archiveConfirmDescription:
        "You are about to remove {customer} from the active customer flow.",
      archiveConfirmNote:
        "The customer will still be available under archived records for reference, but will stop showing in the default operating flow.",
      archiveConfirmAction: "Yes, archive customer",
      archiveSubmitting: "Archiving...",
      archiveSuccess: "{customer} is now out of the active flow.",
      archiveError: "We could not archive the customer. {message}",
      createModalTitle: "Create customer",
      createModalDescription:
        "Complete the commercial profile so the customer is ready for follow-up and quoting.",
      editModalTitle: "Update customer",
      editModalDescription:
        "Correct data, status, or notes without leaving the table.",
      filters: {
        operational: "Active and inactive",
        archived: "Archived",
        all: "All"
      }
    },
    quotes: {
      title: "Quotes",
      pageTitle: "Quotes",
      pageDescription:
        "Review every quote, update operating statuses, and open the editor without leaving the table.",
      loadingTitle: "Loading quotes",
      loadingDescription:
        "We are reading quotes for the active tenant so the operating table is ready.",
      errorTitle: "We could not load quotes",
      errorDescription:
        "Quote loading failed for now. {message}",
      emptyTitle: "There are no quotes yet",
      emptyDescription:
        "Once you register the first commercial proposal, it will appear here with its status and total.",
      emptySearchTitle: "We could not find quotes with that filter",
      emptySearchDescription:
        "Adjust the search or switch filters to review more documents.",
      searchPlaceholder:
        "Search by title, number, recipient, or contact",
      recipientLabel: "Recipient",
      validUntilLabel: "Valid until",
      statusLabel: "Status",
      totalLabel: "Total",
      actionsLabel: "Actions",
      createAction: "New quote",
      editAction: "Edit",
      createModalTitle: "Create quote",
      createModalDescription:
        "Complete the document without losing context from the operating table.",
      editModalTitle: "Update quote",
      editModalDescription:
        "Adjust recipient, line items, or commercial terms from the same modal.",
      filters: {
        operational: "Open",
        approved: "Approved",
        closed: "Rejected and expired",
        all: "All"
      },
      createInvoiceAction: "Convert to invoice",
      cancellationReasonLabel: "Closing reason"
    },
    invoices: {
      title: "Invoices",
      description:
        "Issue internal documentary invoices from a quote or from scratch.",
      pageTitle: "Invoices",
      pageDescription:
        "Review all invoices, change operational statuses, and create documents without leaving the list.",
      loadingTitle: "Loading invoices",
      loadingDescription:
        "We are reading the invoices for the active tenant to open the operating board.",
      errorTitle: "We could not load the invoices",
      errorDescription: "Reading invoices failed for now. {message}",
      emptyTitle: "No invoices yet",
      emptyDescription:
        "When you register the first invoice, it will appear here with its status and total.",
      emptySearchTitle: "No invoices match that filter",
      emptySearchDescription:
        "Adjust the search or change the filter to review more documents.",
      searchPlaceholder: "Search by title, number, or recipient",
      recipientLabel: "Recipient",
      issuedOnColumnLabel: "Issued",
      totalLabel: "Total",
      actionsLabel: "Actions",
      newAction: "New invoice",
      createModalTitle: "Create invoice",
      createModalDescription:
        "Complete the document without losing context from the operating list.",
      cancelAction: "Cancel",
      filters: {
        operational: "Active",
        paid: "Paid",
        void: "Voided",
        all: "All"
      },
      formTitle: "New invoice",
      formDescription:
        "Complete recipient, detail, and essential dates. Everything else stays out of the way.",
      historyTitle: "Recent invoices",
      historyDescription:
        "Review status, total, and document origin without opening unnecessary screens.",
      pipelineTitle: "Invoice pipeline",
      pipelineDescription:
        "Control issuing, collection, and voiding from one operating view with PDF output.",
      historyEmpty: "There are no invoices for this tenant yet.",
      sourceQuoteLabel: "Source quote",
      sourceQuotePlaceholder: "Select an approved or sent quote",
      sourceQuoteEmpty: "No quotes available",
      sourceQuoteHint:
        "If you choose a quote, you can import recipient and lines to avoid repeating work.",
      importQuoteAction: "Use quote data",
      recipientTitle: "Recipient",
      documentTitle: "Document",
      linesTitle: "Billable detail",
      lineHint:
        "Each line should make clear what is being billed and how much it costs, whether it is an item or a service.",
      statusLabel: "Status",
      issuedOnLabel: "Issue date",
      dueOnLabel: "Due date",
      documentKindLabel: "Invoice type",
      documentKinds: {
        items: "Items",
        services: "Services"
      },
      statuses: {
        draft: "Draft",
        issued: "Issued",
        paid: "Paid",
        void: "Void",
        cancelled: "Cancelled"
      },
      voidReasonLabel: "Void reason",
      createAction: "Save invoice",
      createSubmitting: "Saving invoice...",
      createSuccess: "Invoice created successfully as {invoiceNumber}.",
      createError: "We could not create the invoice. {message}",
      editDrawerTitle: "Edit {invoiceNumber}",
      editDrawerDescription:
        "Adjust recipient, lines or dates. The invoice number does not change.",
      detailDrawerTitle: "Invoice {invoiceNumber}",
      detailDrawerDescription:
        "This invoice can no longer be edited. You can cancel it if it was a mistake.",
      readOnlyNotice: "This invoice is in {status} status and cannot be edited directly.",
      saveChangesAction: "Save changes",
      saveChangesSubmitting: "Saving changes...",
      saveChangesSuccess: "{invoiceNumber} updated successfully.",
      saveChangesError: "We could not save the changes. {message}",
      viewEditAction: "View / Edit",
      viewAction: "View detail",
      invoiceNumberLabel: "Invoice number",
      createdAtLabel: "Created on",
      cancelInvoiceAction: "Cancel invoice",
      cancelInvoiceModalTitle: "Cancel paid invoice",
      cancelInvoiceModalDescription:
        "This action is irreversible. A reversal note will be generated to offset the accounting effect of this invoice. Describe the reason in detail.",
      cancelReasonLabel: "Cancellation reason",
      cancelReasonPlaceholder: "Describe the reason for the cancellation...",
      cancelReasonMinError: "The reason must be at least 10 characters.",
      cancelSubmitting: "Cancelling...",
      cancelSuccess: "Invoice cancelled. Reversal note: {reversalNumber}.",
      cancelError: "We could not cancel the invoice. {message}",
      reversalBadge: "Reversal note",
      pdf: {
        downloadAction: "Download PDF",
        generatingAction: "Generating PDF...",
        downloadSuccess: "Invoice PDF is ready to download.",
        downloadError: "We could not generate the PDF. {message}",
        noTenantError: "You need an active tenant to download the invoice."
      }
    },
    documents: {
      moveTo: "Move to {status}",
      moving: "Moving...",
      moveSuccess: "{document} is now in {status}.",
      moveError: "We could not move the document. {message}",
      emptyStatus: "There are no documents in this state.",
      reasonModalTitle: "Reason for status change",
      reasonModalDescription:
        "This change requires a documented reason. It will be recorded for traceability and audit.",
      reasonLabel: "Reason",
      reasonPlaceholder: "Briefly describe the reason...",
      reasonRequiredError: "A reason is required for this status change.",
      confirmMoveAction: "Confirm",
      cancelMoveAction: "Cancel",
      movePipelinePlaceholder: "Move to..."
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
      title: "Turn on your commercial operation from the very first access.",
      description:
        "Sign in from mobile or desktop with a clear experience for CRM, quotes, customers, and tenant operations.",
      cards: {
        rbac: {
          title: "RBAC from day one",
          text:
            "Every access responds to the active role and tenant so key data and actions stay protected."
        },
        audit: {
          title: "Required auditing",
          text:
            "Sensitive events, functional changes, and auth flows stay traceable with actor and context."
        }
      },
      operatingTitle: "Ready to operate",
      operating: {
        customers: {
          title: "Customers and leads with context",
          text:
            "Capture quickly, follow the commercial relationship, and move into the next action without noise."
        },
        documents: {
          title: "Quotes and internal invoice",
          text:
            "Clear, shareable documents prepared to move from proposal to close."
        },
        roles: {
          title: "Secure tenant access",
          text:
            "OperaPyme opens the right workspace based on your session, membership, and permission level."
        }
      }
    },
    capabilities: {
      mobile: {
        title: "Mobile first",
        text:
          "Review activity, jump into CRM, and respond fast from your phone without losing hierarchy."
      },
      desktop: {
        title: "Desktop with context",
        text:
          "On larger screens you see onboarding, benefits, and access in one clean composition."
      },
      security: {
        title: "Flexible access",
        text:
          "Combine magic link, password, and recovery without multiplying accounts or losing control."
      }
    },
    story: {
      capture: {
        title: "Capture leads and customers",
        text:
          "Start from the sales opportunity and turn it into an actionable portfolio."
      },
      quote: {
        title: "Quote with operating rhythm",
        text:
          "Move from a detected need into a proposal that is ready to share and follow up."
      },
      access: {
        title: "Control permissions and traceability",
        text:
          "Tenant scope, roles, and auditing live in the product foundation, not as extra layers."
      }
    },
    metrics: {
      title: "Activation view",
      crm: {
        value: "CRM",
        label: "Leads, customers, and follow-up in the same flow"
      },
      quotes: {
        value: "Docs",
        label: "Quotes, proformas, and non-fiscal internal invoice"
      },
      team: {
        value: "RBAC",
        label: "Tenant access with coherent roles and permissions"
      }
    },
    preview: {
      title: "How OperaPyme feels",
      description:
        "A product entrypoint that already previews the real backoffice rhythm.",
      badge: "Mobile and desktop",
      pipelineLabel: "Commercial flow",
      pipelineTitle: "From lead to document without losing context",
      pipelineBadge: "Tenant ready",
      accessTitle: "Low-friction access",
      accessText:
        "Sign in by email, password, or recovery and continue to the initial setup or the active workspace."
    },
    landing: {
      navigation: {
        product: "Product",
        features: "Features",
        marketplace: "Marketplace",
        company: "Company"
      },
      mobileMenu: {
        open: "Open main menu",
        close: "Close main menu",
        title: "Main menu",
        description: "Primary OperaPyme navigation"
      },
      header: {
        login: "Log in"
      },
      hero: {
        eyebrow: "Real operational management",
        eyebrowLink: "Open access",
        title: "A better way to run sales, customers, and documents from the first access.",
        description:
          "OperaPyme centralizes CRM, quotes, customers, and operational work in one clear mobile and desktop experience.",
        primaryCta: "Sign in now",
        secondaryCta: "See what is included"
      },
      logoCloud: {
        items: ["Retail", "Services", "Distribution", "Commercial", "Operations"]
      },
      primaryFeatures: {
        title: "Turn on your commercial operation with a base that is ready to work today.",
        description:
          "The access flow does not leave users in an empty state. It opens a surface that already communicates operating rhythm, security, and tenant control.",
        items: [
          {
            name: "Access by link or password.",
            description:
              "OperaPyme combines magic link, recovery, and password to reduce friction without losing control."
          },
          {
            name: "Tenant-scoped security.",
            description:
              "The session validates the correct tenant before opening sensitive data, actions, or private routes."
          },
          {
            name: "Traceable operating base.",
            description:
              "RBAC, auditing, and membership context live in the product foundation, not as extras."
          }
        ]
      },
      secondaryFeatures: {
        eyebrow: "Operate with context",
        title: "Everything the access surface should clarify before opening the backoffice",
        description:
          "The entrypoint already previews security, work continuity, and the natural step into setup or the active workspace.",
        learnMore: "Learn more",
        items: [
          {
            name: "Guided sign-in",
            description:
              "The first access route moves into the bootstrap flow when the tenant does not exist yet or is not ready."
          },
          {
            name: "Secure recovery",
            description:
              "The callback flow lets users define a new password without breaking the email-based access experience."
          },
          {
            name: "Operational continuity",
            description:
              "The user returns to the right workspace without unnecessary friction once the session is validated."
          }
        ]
      },
      newsletter: {
        title: "Get updates when we open new capabilities",
        description:
          "We are still building an operational platform for small businesses. Leave your email to receive product updates.",
        emailLabel: "Email",
        emailPlaceholder: "you@company.com",
        cta: "Notify me"
      },
      testimonials: {
        eyebrow: "Stories",
        title: "Real teams need an entrypoint that feels clear and trustworthy",
        featured: {
          body:
            "We moved from explaining where every flow lived to signing in and getting straight into selling, quoting, and following up customers in one experience.",
          author: {
            name: "Brenna Goyette",
            handle: "brennagoyette"
          }
        },
        columns: [
          [
            [
              {
                body:
                  "The entrypoint now feels like a real product surface instead of a temporary authentication screen.",
                author: {
                  name: "Leslie Alexander",
                  handle: "lesliealexander"
                }
              },
              {
                body:
                  "We were able to explain sign-in to the team without extra training. Everything is easier to understand from minute one.",
                author: {
                  name: "Michael Foster",
                  handle: "michaelfoster"
                }
              }
            ],
            [
              {
                body:
                  "Recovery no longer breaks trust. It feels connected to the rest of the product.",
                author: {
                  name: "Lindsay Walton",
                  handle: "lindsaywalton"
                }
              }
            ]
          ],
          [
            [
              {
                body:
                  "The mix of access, security, and commercial context makes OperaPyme easier to understand immediately.",
                author: {
                  name: "Tom Cook",
                  handle: "tomcook"
                }
              }
            ],
            [
              {
                body:
                  "The login now sells the product better because it already communicates organization and operational control.",
                author: {
                  name: "Leonard Krasner",
                  handle: "leonardkrasner"
                }
              },
              {
                body:
                  "The transition between email, password, and callback feels like one system instead of disconnected screens.",
                author: {
                  name: "Emily Selman",
                  handle: "emilyselman"
                }
              }
            ]
          ]
        ]
      },
      footer: {
        labels: {
          solutions: "Solutions",
          support: "Support",
          company: "Company",
          legal: "Legal"
        },
        solutions: ["Marketing", "Analytics", "Automation", "Commerce", "Insights"],
        support: ["Submit ticket", "Documentation", "Guides"],
        company: ["About", "Blog", "Jobs", "Press"],
        legal: ["Terms of service", "Privacy policy", "License"],
        social: {
          facebook: "Facebook",
          instagram: "Instagram",
          x: "X",
          github: "GitHub",
          youtube: "YouTube"
        },
        newsletterTitle: "Subscribe to product updates",
        newsletterDescription:
          "News, articles, and OperaPyme progress delivered to your inbox.",
        emailLabel: "Email",
        emailPlaceholder: "you@company.com",
        subscribe: "Subscribe",
        copyright: "© 2026 OperaPyme. All rights reserved."
      }
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
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      passwordTab: "Password",
      magicLinkTab: "Magic link",
      recoveryTab: "Recover",
      passwordSubmit: "Sign in with password",
      submit: "Send access link",
      submitFirstTime: "Send link to get started",
      recoverySubmit: "Send recovery link",
      submitting: "Sending access...",
      passwordError: "We could not sign you in with password. {message}",
      emailSendError: "We could not send the access link. {message}",
      recoveryError: "We could not send the recovery link. {message}",
      emailSentTitle: "Check your inbox",
      emailSentText:
        "We sent an access link to {email}. If you do not see it, check spam or try again.",
      recoverySentTitle: "Recovery link sent",
      recoverySentText:
        "We sent a link to change the password to {email}. Check your inbox and come back here once you open it.",
      passwordSuccessTitle: "Access validated",
      passwordSuccessText:
        "We are finishing your session so we can take you into the workspace.",
      forgotPassword: "Forgot my password",
      passwordHelper:
        "Use your email and the password you already defined from your profile.",
      magicLinkHelper:
        "If you prefer not to remember a password, you can still use an email access link.",
      recoveryHelper:
        "We will send you a secure link so you can define a new password without losing your current account.",
      firstAccessHelper:
        "The first session still starts with magic link. After that you can create a password from the profile module.",
      noteTitle: "Current access mode",
      noteText:
        "We use email access so you can sign in quickly from any device.",
      noteTextPassword:
        "You can combine password and magic link on the same account to keep fast access plus a contingency path.",
      showPassword: "Show password",
      hidePassword: "Hide password"
    },
    footer: {
      secure: {
        title: "Secure start",
        text:
          "Your session validates the correct tenant before opening data, actions, or sensitive modules."
      },
      setup: {
        title: "Guided setup",
        text:
          "If no operating workspace exists yet, the flow takes you directly into the tenant bootstrap wizard."
      },
      privacy: "Privacy Policy",
      terms: "Terms and Conditions"
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
      backToAuth: "Request another link",
      recoveryEyebrow: "Access recovery",
      recoveryTitle: "Set a new password",
      recoveryDescription:
        "This temporary access already validated your identity. Create a new password so you can sign in later with email and password whenever you need it.",
      newPasswordLabel: "New password",
      newPasswordPlaceholder: "Create a secure password",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Repeat the new password",
      passwordRule:
        "Use at least 8 characters and save a combination you can remember or store in a secure credential manager.",
      passwordSaving: "Saving password...",
      passwordSubmit: "Save new password",
      continueToWorkspace: "Continue to backoffice",
      passwordTooShort: "Password must be at least 8 characters long.",
      passwordMismatch: "Passwords do not match.",
      passwordSaveError: "We could not save the new password. {message}",
      passwordSavedTitle: "Password updated",
      passwordSavedDescription:
        "You can now sign in with email and password without losing magic link as an alternative.",
      ruleMinLength: "Minimum 8 characters",
      ruleLowercase: "Lowercase characters",
      ruleUppercase: "Uppercase characters",
      ruleNumbers: "Numbers"
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
    startTitle: "Let's get started",
    sidebarTagline: "Set up your business in a few steps and start operating from day one.",
    stepsNav: "Setup steps",
    signOut: "Sign out",
    nameLabel: "Business name",
    namePlaceholder: "OperaPyme Demo North",
    slugLabel: "Tenant slug",
    slugPlaceholder: "operapyme-demo-north",
    slugPreviewTitle: "Operating URL",
    slugUnavailable: "This slug is already in use. Choose another one before continuing.",
    slugStates: {
      checking: "Checking slug",
      available: "Slug available",
      unavailable: "Slug taken",
      error: "Validation failed"
    },
    progressLabel: "Step {current} of {total}",
    backAction: "Back",
    nextAction: "Continue",
    steps: {
      workspace: {
        title: "Your business",
        description: "Define the name and identifier of your operating workspace.",
        helper: "Enter your business name and confirm the slug is available."
      },
      review: {
        title: "Final review",
        description: "Confirm your details before creating the tenant.",
        helper: "Review the name and slug one last time before continuing."
      }
    },
    review: {
      businessLabel: "Business",
      slugLabel: "Slug",
      pending: "Pending",
      checklist: {
        membershipTitle: "Active membership",
        membershipText:
          "Your account will be linked immediately to the new tenant with access ready to operate.",
        modulesTitle: "Base modules",
        modulesText:
          "You will enter with initial access to Commercial Management, catalog, and business settings.",
        launchTitle: "Direct launch",
        launchText:
          "After bootstrap we will take you into the backoffice to continue with real operations."
      }
    },
    submit: "Create tenant and continue",
    submitting: "Creating tenant...",
    unavailableError: "Supabase is not configured for this environment.",
    submitError: "We could not create the initial tenant. {message}",
    successTitle: "Initial tenant created.",
    successDescription:
      "Your operating workspace is now ready for Commercial Management, catalog, and settings."
  },
  accessDenied: {
    eyebrow: "Restricted access",
    title: "This surface is not available for your current context.",
    description:
      "Global auditing and operational errors are exclusive to the `global_admin` role in this phase.",
    backHome: "Back to home"
  },
  profile: {
    header: {
      eyebrow: "Profile",
      title: "Account and access security",
      description:
        "Review your active identity and define this account's password without leaving the backoffice."
    },
    summary: {
      title: "Account summary",
      description:
        "These details represent the authenticated account currently operating inside the active tenant.",
      userLabel: "User",
      emailLabel: "Email",
      tenantLabel: "Active tenant",
      roleLabel: "Visible role"
    },
    security: {
      title: "Access password",
      description:
        "Enable or update email + password access. Magic link will remain available as an alternative.",
      passwordLabel: "New password",
      passwordPlaceholder: "Create or update your password",
      confirmPasswordLabel: "Confirm password",
      confirmPasswordPlaceholder: "Repeat the password",
      helper:
        "We recommend using at least 8 characters and storing it in a secure manager.",
      submit: "Save password",
      submitting: "Saving password...",
      successTitle: "Password saved",
      successDescription:
        "Your account can now sign in with email and password in addition to magic link.",
      error: "We could not save the password. {message}",
      mismatch: "Passwords do not match.",
      tooShort: "Password must be at least 8 characters long."
    },
    methods: {
      title: "Available methods",
      description:
        "OperaPyme keeps more than one sign-in path available to reduce operational friction.",
      magicLinkTitle: "Magic link by email",
      magicLinkText:
        "It remains active so you can sign in quickly from any device without depending only on a password.",
      passwordTitle: "Email + password",
      passwordText:
        "Once the password is saved, you will be able to sign in from `/auth` using this second method."
    }
  },
  settings: {
    header: {
      eyebrow: "Operational settings",
      title: "Company settings",
      description:
        "Manage your profile, company details, shared visual identity, and team access from one surface protected by role and tenant boundaries."
    },
    sections: {
      general: "General",
      tenant: "Company",
      appearance: "Appearance",
      team: "Team",
      security: "Security"
    },
    errors: {
      generic: "We could not complete the action."
    },
    status: {
      active: "Active",
      inactive: "Inactive",
      invited: "Invited",
      suspended: "Suspended"
    },
    roles: {
      global_admin: "Global admin",
      tenant_owner: "Owner",
      tenant_admin: "Admin",
      sales_rep: "Sales",
      finance_operator: "Finance",
      viewer: "Viewer",
      tenant_member: "Tenant member"
    },
    states: {
      loadingTitle: "Loading settings",
      loadingDescription:
        "We are loading the profile, active tenant, and available configuration for this account.",
      errorTitle: "We could not open settings",
      errorDescription:
        "There was a problem while loading this view. {message}",
      retryAction: "Try again",
      noTenantTitle: "You do not have an active tenant yet",
      noTenantDescription:
        "Complete the initial setup or switch to the correct tenant to open these settings."
    },
    profile: {
      title: "User profile",
      description:
        "Review the identity you are using to operate and update the visible name for this account.",
      emailLabel: "Email",
      roleLabel: "Active role",
      displayNameLabel: "Display name",
      displayNamePlaceholder: "How you want to appear inside the tenant",
      saveAction: "Save name",
      saving: "Saving...",
      openProfileAction: "Open profile and password",
      toastTitle: "Profile updated",
      toastDescription:
        "Your visible name now reflects the current account identity.",
      errorTitle: "We could not update your profile",
      loadError: "We could not load your profile. {message}"
    },
    preferences: {
      title: "Personal preferences",
      description:
        "These preferences affect only your session and do not change the shared tenant identity.",
      themeTitle: "Color mode",
      themeText:
        "Choose light, dark, or system to work with the visual density that suits you best.",
      currentTenantTitle: "Active company",
      currentTenantText:
        "Shared configuration and permissions in this view always depend on the selected company."
    },
    company: {
      title: "Company details",
      description:
        "Manage the base identity of the active company. Changes stay isolated per tenant and only roles with permission can edit them.",
      slugLabel: "Slug",
      statusLabel: "Status",
      updatedLabel: "Last update",
      nameLabel: "Business name",
      namePlaceholder: "Visible company name",
      addressLabel: "Business address",
      addressPlaceholder: "Av. Winston Churchill 95, Santo Domingo, Dominican Republic",
      phoneLabel: "Primary phone",
      phonePlaceholder: "+1 809 555 0140",
      rncLabel: "RNC",
      rncPlaceholder: "1-31-12345-6",
      cedulaLabel: "ID number (individual)",
      cedulaPlaceholder: "001-1234567-8",
      logoLabel: "Company logo",
      logoHelp:
        "Upload the logo so we can reuse it in quotes, documentary invoices, and future PDF downloads.",
      logoHint:
        "Allowed formats: PNG, JPG, WEBP, or SVG. Maximum size: 2 MB.",
      logoEmptyTitle: "There is no saved logo yet",
      logoEmptyDescription:
        "Once you upload the company logo we will use it as the visual header in PDF documents.",
      logoDropHere: "Drop the file here",
      logoUploadAction: "Upload logo",
      logoReplaceAction: "Replace logo",
      logoRemoveAction: "Remove logo",
      logoPreviewAlt: "{company} logo",
      logoErrorTitle: "We could not use that logo",
      logoInvalidType:
        "Upload a PNG, JPG, WEBP, or SVG file to continue.",
      logoInvalidSize:
        "The logo is larger than 2 MB. Use a lighter version to continue.",
      editHelp:
        "Only roles with `tenant.update` can save identity or branding changes for this company.",
      readOnlyHelp:
        "Your role can review the active company data, but cannot edit its identity or branding.",
      saveAction: "Save company",
      saving: "Saving company...",
      toastTitle: "Company updated",
      toastDescription:
        "The company base information, logo, and shared appearance have been updated.",
      errorTitle: "We could not update the company",
      validation: {
        nameRequired: "Enter the company business name.",
        addressRequired: "Enter the company business address.",
        phoneRequired: "Enter the company primary phone number.",
        phoneInvalid:
          "Use a valid phone number with digits and common symbols like +, spaces, or dashes.",
        rncInvalid:
          "The RNC must contain 9 digits, with or without dashes.",
        cedulaInvalid:
          "The ID number must have 11 digits. Valid format: 001-1234567-8."
      }
    },
    palette: {
      title: "Company visual palette",
      description:
        "Choose a curated palette or build your own so the whole company shares a consistent identity across backoffice and future surfaces without leaking into other businesses.",
      sharedBadge: "One brand, two apps",
      previewBadge: "Live preview",
      readOnlyBadge: "Read only",
      ruleTitle: "Simple, consistent, usable branding",
      ruleText:
        "The base palettes already start balanced, and the company custom palette only asks for four seed colors to preserve contrast, setup speed, and operational consistency.",
      storageTitle: "Company persistence",
      storageText:
        "The palette and its seed colors are stored on the active company so the shared identity does not depend on the current device and does not get mixed with other tenants.",
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
      reviewLabel: "Review contrast",
      toastTitle: "Palette updated",
      toastDescription: "The active visual identity now uses {palette}.",
      customBadge: "Editable",
      custom: {
        paperLabel: "Light base",
        primaryLabel: "Primary color",
        secondaryLabel: "Secondary color",
        tertiaryLabel: "Support color",
        helperTitle: "How the custom palette works",
        helperText:
          "These four colors generate surfaces, borders, backgrounds, and states to keep a professional identity without opening an advanced editor. The configuration stays isolated inside the active company.",
        reset: "Restore base"
      }
    },
    appearance: {
      saveTitle: "Apply visual changes",
      saveText:
        "Save the name and palette to publish the shared identity of the active company.",
      readOnlyText:
        "You can review the current branding, but your role cannot publish changes for this company.",
      saveAction: "Save appearance",
      saving: "Saving appearance...",
      toastTitle: "Appearance updated",
      toastDescription:
        "The shared company visual identity is now published.",
      errorTitle: "We could not update the appearance"
    },
    team: {
      title: "Company team",
      description:
        "Review who operates inside the active company and which roles they use to access the application.",
      loadingDescription:
        "We are loading the memberships visible for this tenant.",
      emptyDescription: "There are no additional visible members in this tenant yet.",
      errorTitle: "We could not load the team",
      errorDescription:
        "There was a problem while loading memberships. {message}",
      lockedTitle: "Your role cannot manage the team",
      lockedDescription:
        "Only roles with `membership.manage` can review the full tenant directory."
    },
    security: {
      title: "Permanent deletion",
      description:
        "From here you can fully close the active company. This action stays behind permissions, explicit confirmation, and secure backend deletion.",
      delete: {
        eyebrow: "Danger zone",
        scopeTitle: "What this action does",
        scopeText:
          "The active tenant is permanently deleted together with its memberships, customers, catalog, quotes, documentary invoices, and the rest of its tenant-scoped data.",
        warningTitle: "There is no trash bin or automatic restore",
        warningText:
          "To reduce mistakes, we will ask you to type the exact slug `{slug}` before confirming.",
        cardTitle: "Delete company permanently",
        cardDescription:
          "Use this action only when you want to shut down this workspace for good. If your user does not belong to any other active companies, we will also try to delete the sign-in account.",
        impacts: {
          memberships:
            "Every access and membership associated with this company will be closed.",
          documents:
            "Quotes, documentary invoices, leads, customers, and tenant-linked operational traces will be removed.",
          catalog:
            "The commercial catalog and the shared tenant visual configuration will be deleted.",
          account:
            "If this was your only active company, the authenticated account will also be removed to close access completely."
        },
        openAction: "Delete company",
        lockedTitle: "Only the owner can do this",
        lockedDescription:
          "This action requires the `tenant.delete` permission. If you need to continue, sign in with the tenant owner account.",
        dialogTitle: "Confirm permanent deletion",
        dialogDescription:
          "You are about to permanently delete `{tenant}` and all of its associated data.",
        confirmationTitle: "Confirmation required",
        confirmationText:
          "Type the slug `{slug}` to enable permanent deletion.",
        confirmationLabel: "Tenant slug",
        cancelAction: "Cancel",
        confirmAction: "Delete forever",
        submitting: "Deleting company...",
        toastAccountDeletedTitle: "Company and account deleted",
        toastAccountDeletedDescription:
          "`{tenant}` was fully deleted and your session will close now.",
        toastTenantDeletedTitle: "Company deleted",
        toastTenantDeletedDescription:
          "`{tenant}` was fully deleted. We will move you to the next available workspace.",
        toastTenantDeletedNoMembershipsDescription:
          "`{tenant}` was fully deleted. Your account remains active, but it no longer has a configured company.",
        errorTitle: "We could not delete the company"
      }
    }
  },
  import: {
    nav: "Import data",
    page: {
      eyebrow: "Import module",
      title: "Bulk import data",
      description:
        "Upload a CSV or Excel file with your existing records and we will import them safely with validation, column mapping, and history."
    },
    entityType: {
      label: "What type of data are you importing?",
      customer: "Customers",
      lead: "Leads",
      catalog_item: "Products and services"
    },
    importMode: {
      label: "What do you want to do with the data?",
      create: "Only create new records",
      update: "Only update existing records",
      upsert: "Create new and update existing"
    },
    steps: {
      upload: "Upload file",
      mapping: "Map columns",
      preview: "Validate and preview",
      processing: "Processing",
      complete: "Completed"
    },
    upload: {
      title: "Select the file",
      description:
        "Accepts CSV and Excel (.xlsx) files. Maximum 5 MB. The first row must contain column names.",
      dropzoneLabel: "Drag your file here or click to select",
      dropzoneHint: "CSV or Excel, maximum 5 MB",
      fileSelected: "{name} — {count} rows detected",
      downloadTemplate: "Download {entity} template",
      errors: {
        tooLarge: "The file exceeds the 5 MB limit.",
        invalidFormat: "Only CSV (.csv) and Excel (.xlsx) files are accepted.",
        noHeaders: "The file does not have a header row.",
        noRows: "The file is empty or only has headers.",
        parseError: "We could not read the file. Please verify it is not corrupted."
      }
    },
    mapping: {
      title: "Map the columns",
      description:
        "Indicate which system field each column in your file corresponds to. Unmapped columns will be ignored.",
      fileColumnHeader: "Column in your file",
      systemFieldHeader: "System field",
      skipOption: "Skip this column",
      requiredBadge: "Required",
      previewTitle: "First {count} rows with current mapping",
      autoMappedNotice: "We automatically mapped {count} of {total} columns. Review and adjust if needed."
    },
    preview: {
      title: "Validation and summary",
      description:
        "Review the validation results before confirming the import.",
      validRows: "{count} valid rows",
      invalidRows: "{count} rows with errors",
      duplicateRows: "{count} possible duplicates",
      showAllRows: "Show all rows",
      showErrorsOnly: "Show only rows with errors",
      errorTableRow: "Row",
      errorTableField: "Field",
      errorTableError: "Error",
      errorTableValue: "Original value",
      continueWithErrors: "Continue and skip rows with errors",
      goBackToFix: "Go back to fix the file",
      noErrors: "All rows are valid. Ready to import."
    },
    processing: {
      title: "Importing data...",
      description:
        "Do not close this window while the import is in progress. Data already saved will be preserved if you stop the process.",
      batchProgress: "Batch {current} of {total}",
      rowProgress: "{processed} of {total} records processed",
      continueOnError: "Continue",
      stopOnError: "Stop import",
      batchErrorTitle: "Error in batch {batch}",
      batchErrorDescription: "There was an error processing this batch. You can continue with the next one or stop the import."
    },
    complete: {
      title: "Import completed",
      description: "The import process has finished.",
      created: "{count} records created",
      updated: "{count} records updated",
      skipped: "{count} records skipped",
      errored: "{count} records with errors",
      downloadErrorReport: "Download error report",
      viewImportedRecords: "View imported records",
      importMore: "Import more data"
    },
    history: {
      title: "Import history",
      description: "Imports performed in this tenant.",
      emptyTitle: "No imports yet",
      emptyDescription: "Imports you perform will appear here with their status and details.",
      entity: {
        customer: "Customers",
        lead: "Leads",
        catalog_item: "Products and services"
      },
      mode: {
        create: "Create only",
        update: "Update only",
        upsert: "Create and update"
      },
      status: {
        pending: "Pending",
        processing: "Processing",
        completed: "Completed",
        failed: "Failed",
        rolled_back: "Rolled back"
      },
      rollbackAction: "Rollback import",
      rollbackConfirmTitle: "Rollback import",
      rollbackConfirmDescription:
        "The {count} records imported in this batch will be deleted. This action cannot be undone. Continue?",
      rollbackConfirm: "Yes, rollback",
      rollbackCancel: "Cancel",
      rollbackSuccess: "Import rolled back successfully.",
      rollbackError: "We could not rollback the import. {message}",
      rollbackExpired: "The 72-hour rollback window has expired for this import."
    },
    errors: {
      required: "This field is required.",
      invalidEmail: "The email does not have a valid format.",
      invalidEnum: "Value not allowed. Valid options: {values}.",
      tooLong: "The value exceeds the allowed {max} characters.",
      duplicateInFile: "This code appears more than once in the file.",
      duplicateInDb: "A record with this code already exists in the system."
    }
  }
};

export default backofficeEn;
