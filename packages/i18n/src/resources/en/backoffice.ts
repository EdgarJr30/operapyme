const backofficeEn = {
  dashboard: {
    header: {
      eyebrow: "Home",
      title: "Operational business summary",
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
      reviewCatalog: "Review catalog"
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
        detail: "{count} customers available to quote and follow up."
      },
      quoteCount: {
        label: "Quotes",
        detail: "{count} quotes currently stored for this tenant."
      },
      openQuoteCount: {
        label: "Open",
        detail: "{count} quotes still moving through the pipeline."
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
      quotesTitle: "Recent quotes",
      quotesDescription:
        "Quotes with recent follow-up and PDF output.",
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
    list: {
      title: "Catalog list",
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
      customerSelectedHint:
        "When you choose a customer, their data fills into the document and you can still adjust it.",
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
      convertAction: "Move to customers",
      convertSuccess: "{lead} is now in customers.",
      convertError: "We could not convert the lead. {message}"
    },
    customers: {
      tableTitle: "Recent customers",
      tableDescription:
        "A clean customer base speeds up quotes, invoices, and follow-up.",
      emptyTitle: "There are no customers yet",
      emptyDescription:
        "Once you close a lead or register the first customer, it will show here."
    },
    quotes: {
      title: "Quotes",
      description:
        "Work proposals for items or services with a short and focused flow.",
      createTab: "New",
      manageTab: "Manage"
    },
    invoices: {
      title: "Invoices",
      description:
        "Issue internal documentary invoices from a quote or from scratch.",
      formTitle: "New invoice",
      formDescription:
        "Complete recipient, detail, and essential dates. Everything else stays out of the way.",
      historyTitle: "Recent invoices",
      historyDescription:
        "Review status, total, and document origin without opening unnecessary screens.",
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
        void: "Void"
      },
      createAction: "Save invoice",
      createSubmitting: "Saving invoice...",
      createSuccess: "Invoice created successfully as {invoiceNumber}.",
      createError: "We could not create the invoice. {message}"
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
        "You can combine password and magic link on the same account to keep fast access plus a contingency path."
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
        "You can now sign in with email and password without losing magic link as an alternative."
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
    title: "Create the first operating workspace and start with clear context from minute one.",
    description:
      "This onboarding leaves the business name, operating slug, initial visual identity, and owner access ready before opening daily operations.",
    nameLabel: "Business name",
    namePlaceholder: "OperaPyme Demo North",
    slugLabel: "Tenant slug",
    slugPlaceholder: "operapyme-demo-north",
    slugHint: "Suggested operating URL: {slug}",
    slugPreviewTitle: "Operating URL",
    slugPreviewEmpty:
      "The slug will appear here once you complete the business name or edit it manually.",
    slugUnavailable: "This slug is already in use. Choose another one before continuing.",
    slugStates: {
      checking: "Checking slug",
      available: "Slug available",
      unavailable: "Slug taken",
      error: "Validation failed"
    },
    stepNumber: "Step {count}",
    completed: "Done",
    progressLabel: "Step {current} of {total}",
    backAction: "Back",
    nextAction: "Continue",
    previewTitle: "What will be ready when you finish",
    previewDescription:
      "The goal is not only to create a tenant, but to leave an operational base ready for Commercial Management, catalog, and settings.",
    workspaceCards: {
      tenantTitle: "Operational workspace",
      tenantText:
        "Everything you create afterward will stay isolated by tenant with active membership and base permissions.",
      slugTitle: "Clean URL from day one",
      slugText:
        "We validate the slug before creating the workspace to avoid conflicts and rework."
    },
    brandingCards: {
      focusTitle: "Identity without friction",
      focusText:
        "You leave with a visual base that works now and can still be refined later in settings.",
      identityTitle: "Backoffice ready for real use",
      identityText:
        "The visual identity supports onboarding, but it does not slow down the start of sales and operations."
    },
    launchCards: {
      commercialTitle: "Commercial Management",
      commercialText:
        "Capture leads, convert customers, build quotes, and issue documentary invoices.",
      catalogTitle: "Reusable catalog",
      catalogText:
        "Prepare items and services once so quoting is faster from the first day.",
      accessTitle: "Active owner access",
      accessText:
        "The first account signs in as `tenant_owner` and can then open settings and invite the team."
    },
    steps: {
      workspace: {
        title: "Business",
        description: "Define how the workspace will be named and identified.",
        helper:
          "Start by locking the business name and confirming the slug is available."
      },
      branding: {
        title: "Initial identity",
        description: "Choose the visual base the workspace will start with.",
        helper:
          "The visual identity is set now, but you will still be able to refine it later without blocking the start."
      },
      review: {
        title: "Final review",
        description: "Confirm the essentials before creating the tenant and entering the backoffice.",
        helper:
          "Do a final pass over the name, slug, and palette before creating the workspace."
      }
    },
    review: {
      businessLabel: "Business",
      slugLabel: "Slug",
      paletteLabel: "Palette",
      pending: "Pending",
      nextTitle: "We will do this for you when the tenant is created",
      checklist: {
        membershipTitle: "Active membership",
        membershipText:
          "Your account will be linked immediately to the new tenant with access ready to operate.",
        modulesTitle: "Base modules",
        modulesText:
          "You will enter with initial access to Commercial Management, catalog, and business settings.",
        brandTitle: "Active identity",
        brandText:
          "The workspace will start with {palette} as its visual base so you do not begin with a generic interface.",
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
      "Your operating workspace is now ready for Commercial Management, catalog, and settings.",
    paletteTitle: "Initial visual identity",
    paletteDescription:
      "You can start with a curated palette or with the business custom palette, then refine it later in settings."
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
        "Choose a curated palette or build your own so backoffice and storefront share an elegant brand without losing readability or consistency.",
      sharedBadge: "One brand, two apps",
      previewBadge: "Live preview",
      ruleTitle: "Why we combine curated presets with simple customization",
      ruleText:
        "The base palettes already start balanced, and the custom palette only asks for four seed colors to preserve contrast, setup speed, and visual consistency.",
      storageTitle: "Current persistence",
      storageText:
        "In this scaffold both the selection and the custom palette are stored locally for fast iteration. The next real step is persisting `palette_id` and branding seeds per tenant in Supabase.",
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
          "These four colors generate surfaces, borders, backgrounds, and states to keep a professional identity without opening an advanced editor.",
        reset: "Restore base"
      }
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
