const backofficeEs = {
  dashboard: {
    header: {
      eyebrow: "Panel comercial",
      title: "Empieza el dia con contexto claro y acciones visibles.",
      description:
        "La entrada del backoffice debe ayudarte a ver el pulso del tenant, saltar rapido a CRM o cotizaciones y retomar trabajo sin ruido visual."
    },
    actions: {
      newLead: "Nuevo lead",
      newQuote: "Nueva cotizacion"
    },
    checklist: {
      title: "Siguiente bloque sugerido",
      description:
        "Usa esta base para mantener la operacion comercial corta, visible y facil de retomar.",
      captureLead: "Captura o actualiza el siguiente lead que necesita seguimiento.",
      prepareCatalog:
        "Completa los productos o servicios minimos antes de emitir nuevas cotizaciones.",
      sendQuote:
        "Convierte una oportunidad activa en cotizacion real y revisa su estado.",
      reviewSettings:
        "Ajusta branding, preferencias y permisos antes de abrir nuevas superficies."
    },
    emptyState: {
      title: "Aun no hay actividad comercial para mostrar",
      description:
        "Cuando el tenant empiece a registrar clientes y cotizaciones, esta entrada mostrara el resumen operativo y los ultimos movimientos."
    },
    hero: {
      badgeBlueprint: "Blueprint convertido en codigo",
      badgePastel: "Sistema pastel minimo activo",
      eyebrow: "Base del backoffice",
      title:
        "Construye una interfaz calmada y seria que funcione para multiples tipos de negocio.",
      description:
        "Este shell ya esta optimizado para navegacion mobile-first, dominios modulares y una experiencia de producto premium sin ruido visual.",
      primaryAction: "Iniciar wizard del tenant",
      secondaryAction: "Revisar reglas de UX"
    },
    milestones: {
      title: "Siguientes hitos del producto",
      description:
        "Mantener las primeras 8 semanas enfocadas en activacion y valor comercial.",
      setupWizard: "Wizard de setup por tenant",
      catalogCrud: "CRUD de catalogo con media y visibilidad",
      crmKanban: "Captura de leads y Kanban de CRM",
      quoteBuilder: "Cotizador con versionado y PDF",
      websitePublishing: "Publicacion del sitio web",
      securityFoundation: "Fundacion segura con RBAC, RLS y auditoria"
    },
    stats: {
      customerCount: {
        label: "Clientes visibles",
        detail: "{{count}} clientes disponibles para el tenant activo."
      },
      quoteCount: {
        label: "Cotizaciones registradas",
        detail: "{{count}} cotizaciones protegidas por RLS en este tenant."
      },
      openQuoteCount: {
        label: "Cotizaciones abiertas",
        detail: "{{count}} cotizaciones en borrador, enviadas o vistas."
      }
    },
    livePulse: {
      noTenantTitle: "Todavia no hay un tenant activo seleccionado",
      noTenantDescription:
        "Completa el bootstrap o vuelve a cargar el contexto antes de pedir datos comerciales.",
      loadingTitle: "Cargando el pulso comercial",
      loadingDescription:
        "Estamos leyendo clientes y cotizaciones reales desde Supabase para este tenant.",
      errorTitle: "No pudimos cargar el pulso comercial",
      errorDescription:
        "La lectura real del tenant fallo por ahora. {{message}}",
      retryAction: "Reintentar carga",
      emptyTitle: "Aun no hay actividad comercial cargada",
      emptyDescription:
        "Cuando el tenant empiece a registrar clientes y cotizaciones, este dashboard mostrara sus metricas y snapshots reales.",
      customersTitle: "Clientes recientes",
      customersDescription:
        "Lectura directa desde `customers` respetando tenant activo y RLS.",
      quotesTitle: "Cotizaciones recientes",
      quotesDescription:
        "Lectura directa desde `quotes` con visibilidad protegida por permisos.",
      contactPending: "Contacto pendiente",
      customerCodeLabel: "Codigo",
      customerCodePending: "Sin codigo",
      quoteValueLabel: "Valor actual",
      customerStatus: {
        active: "Activo",
        inactive: "Inactivo",
        archived: "Archivado"
      },
      quoteStatus: {
        draft: "Borrador",
        sent: "Enviada",
        viewed: "Vista",
        approved: "Aprobada",
        rejected: "Rechazada",
        expired: "Expirada"
      }
    },
    operatingModel: {
      title: "Modelo operativo",
      description:
        "Mantener la arquitectura honesta: primero plataforma horizontal, luego packs verticales.",
      catalogTitle: "Operacion de catalogo",
      catalogText:
        "Productos, categorias, fichas tecnicas y visibilidad publica o privada.",
      crmTitle: "CRM y captura de leads",
      crmText:
        "Captura oportunidades rapido y muvelas por un pipeline simple.",
      quotesTitle: "Cotizaciones y proformas",
      quotesText:
        "Documentos versionados, enlaces compartibles, aprobaciones y PDF limpio.",
      aiTitle: "Add-ons de IA",
      aiText:
        "La asistencia para cotizar y el chatbot publico siguen modulares y cobrables."
    },
    uxWhy: {
      title: "Por que importa esta direccion UX",
      description:
        "Los buenos productos B2B ganan confianza con interfaces calmadas, no con sobrecarga decorativa.",
      learnFaster:
        "Menos ruido visual ayuda a que los equipos pequenos aprendan el producto mas rapido.",
      formQuality:
        "Una estructura clara de formularios mejora la calidad de datos y la velocidad de cotizacion.",
      aiFocus:
        "La IA debe enfocarse en acelerar lo comercial, no en meter gimmicks."
    }
  },
  crm: {
    header: {
      eyebrow: "Modulo CRM",
      title: "Captura de leads y seguimiento",
      description:
        "Este primer scaffold se enfoca en un patron de intake que funciona en movil, valida rapido y queda listo para persistencia con Supabase."
    },
    form: {
      title: "Captura rapida de lead",
      description:
        "Usa esta superficie para capturar leads reales del tenant activo sin perder el patron mobile-first.",
      companyLabel: "Empresa",
      companyPlaceholder: "Northline Industrial",
      contactNameLabel: "Nombre del contacto",
      contactNamePlaceholder: "Andrea Castillo",
      emailLabel: "Correo",
      emailPlaceholder: "andrea@northline.com",
      whatsappLabel: "WhatsApp",
      whatsappPlaceholder: "+1 809 555 0186",
      sourceLabel: "Origen",
      sourceWebsite: "Formulario web",
      sourceWhatsapp: "WhatsApp",
      sourceWalkIn: "Visita presencial",
      sourceRepeat: "Cliente existente",
      needSummaryLabel: "Resumen de la necesidad",
      needSummaryPlaceholder:
        "El cliente necesita tres tablets rugerizadas, fundas de proteccion y precio de entrega para el dia siguiente.",
      submit: "Crear lead",
      submitting: "Guardando lead...",
      clear: "Limpiar formulario",
      createSuccess: "Lead creado correctamente.",
      createError: "No pudimos crear el lead. {{message}}",
      noTenantHint:
        "Necesitas un tenant activo antes de capturar leads reales para CRM.",
      previewTitle: "Vista previa del envio",
      previewDescription:
        "Este panel luego sirve para enriquecimiento con IA, reglas de asignacion y siguientes pasos sugeridos.",
      previewDraftStatus: "Borrador listo para revisar",
      previewStatus: "Lead capturado en modo borrador",
      previewEmptyTitle: "Todavia no hay nada enviado",
      previewEmptyDescription:
        "Completa el formulario para validar el stack de formularios, los estilos de campo y el espaciado mobile-first.",
      previewCompany: "Empresa",
      previewContact: "Contacto",
      previewChannel: "Canal",
      previewNeed: "Necesidad",
      previewPendingValue: "Pendiente"
    },
    recent: {
      title: "Snapshots recientes del pipeline",
      description:
        "Lectura real de clientes para el tenant activo, manteniendo las cards del CRM ligeras en movil.",
      originLabel: "Origen",
      noTenantTitle: "No hay tenant activo para consultar clientes",
      noTenantDescription:
        "Primero el usuario debe quedar dentro de un tenant activo antes de leer el CRM.",
      loadingTitle: "Cargando clientes reales",
      loadingDescription:
        "Estamos leyendo el modulo `customers` con el contexto actual del tenant.",
      errorTitle: "No pudimos cargar los clientes",
      errorDescription:
        "La lectura real del CRM fallo por ahora. {{message}}",
      retryAction: "Reintentar carga",
      emptyTitle: "Todavia no hay clientes registrados",
      emptyDescription:
        "Cuando empieces a crear clientes reales, este panel los mostrara aqui con sus datos base.",
      contactPending: "Contacto pendiente",
      customerStatus: {
        active: "Activo",
        inactive: "Inactivo",
        archived: "Archivado"
      },
      source: {
        manual: "Carga manual",
        website: "Formulario web",
        whatsapp: "WhatsApp",
        walkIn: "Visita presencial",
        repeat: "Cliente recurrente"
      }
    },
    rules: {
      title: "Reglas UX para vistas CRM",
      description:
        "Estos patrones deben mantenerse estables a medida que el modulo crece.",
      captureTitle: "Captura desde cualquier canal",
      captureText:
        "Sitio web, WhatsApp, visita en tienda y solicitudes recurrentes deben terminar en el mismo modelo limpio de lead.",
      followUpTitle: "Haz visible el seguimiento",
      followUpText:
        "La siguiente accion debe ser obvia y alcanzable desde movil sin abrir multiples pantallas.",
      responseTimeTitle: "Reduce el tiempo de respuesta",
      responseTimeText:
        "Buena UX aqui no es algo cosmetico. Impacta de forma directa la velocidad de cotizacion y la conversion."
    },
    customerForm: {
      createTitle: "Crear cliente real",
      createDescription:
        "Este formulario ya escribe en `customers` usando el tenant activo y las politicas RLS.",
      updateTitle: "Actualizar cliente existente",
      updateDescription:
        "Usa esta superficie para mantener datos operativos reales sin salir del modulo CRM.",
      createAction: "Guardar cliente",
      createSubmitting: "Guardando cliente...",
      updateAction: "Actualizar cliente",
      updateSubmitting: "Actualizando cliente...",
      resetAction: "Limpiar formulario",
      createSuccess: "Cliente creado correctamente.",
      createError: "No pudimos crear el cliente. {{message}}",
      updateSuccess: "Cliente actualizado correctamente.",
      updateError: "No pudimos actualizar el cliente. {{message}}",
      noCustomerSelected: "Selecciona un cliente antes de intentar actualizarlo.",
      recordLabel: "Cliente a actualizar",
      noCustomersOption: "No hay clientes todavia",
      noCustomersHint:
        "Primero crea un cliente real para habilitar el flujo de actualizacion.",
      customerCodeLabel: "Codigo interno",
      customerCodePlaceholder: "CLI-001",
      displayNameLabel: "Nombre visible",
      displayNamePlaceholder: "Northline Industrial",
      contactNameLabel: "Contacto principal",
      contactNamePlaceholder: "Andrea Castillo",
      legalNameLabel: "Nombre legal",
      legalNamePlaceholder: "Northline Industrial SRL",
      emailLabel: "Correo",
      emailPlaceholder: "andrea@northline.test",
      whatsappLabel: "WhatsApp",
      whatsappPlaceholder: "+1 809 555 0186",
      phoneLabel: "Telefono alterno",
      phonePlaceholder: "+1 809 555 0140",
      documentIdLabel: "Documento o RNC",
      documentIdPlaceholder: "101-5555555-1",
      sourceLabel: "Origen",
      statusLabel: "Estado",
      notesLabel: "Notas operativas",
      notesPlaceholder:
        "Contexto comercial, necesidades recurrentes o detalles relevantes para seguimiento.",
      validation: {
        customerCodeMax: "Mantener el codigo por debajo de 40 caracteres.",
        displayNameMin: "Ingresa el nombre visible del cliente.",
        displayNameMax: "Mantener el nombre visible por debajo de 120 caracteres.",
        contactNameMin: "Ingresa el contacto principal.",
        contactNameMax: "Mantener el contacto por debajo de 120 caracteres.",
        legalNameMax: "Mantener el nombre legal por debajo de 160 caracteres.",
        email: "Ingresa un correo valido o deja el campo vacio.",
        emailMax: "Mantener el correo por debajo de 120 caracteres.",
        whatsappMax: "Mantener el WhatsApp por debajo de 30 caracteres.",
        phoneMax: "Mantener el telefono por debajo de 30 caracteres.",
        documentIdMax: "Mantener el documento por debajo de 60 caracteres.",
        notesMax: "Mantener las notas por debajo de 500 caracteres."
      }
    },
    validation: {
      companyMin: "Ingresa el nombre de la empresa o negocio.",
      companyMax: "Mantener el nombre de la empresa por debajo de 120 caracteres.",
      contactNameMin: "Ingresa el nombre del contacto.",
      contactNameMax: "Mantener el nombre del contacto por debajo de 120 caracteres.",
      email: "Ingresa un correo valido.",
      whatsappMin: "Ingresa un numero de WhatsApp valido.",
      whatsappMax: "Mantener el telefono por debajo de 30 caracteres.",
      needSummaryMin: "Describe la necesidad con al menos 12 caracteres.",
      needSummaryMax: "Mantener el resumen por debajo de 500 caracteres."
    }
  },
  catalog: {
    header: {
      eyebrow: "Modulo catalogo",
      title: "Catalogo comercial del tenant",
      description:
        "Gestiona productos y servicios reales del tenant activo con visibilidad, precio y estados listos para cotizacion."
    },
    search: {
      title: "Buscar en el catalogo",
      description:
        "Filtra por nombre, codigo, categoria o descripcion sin salir de la vista principal.",
      placeholder:
        "Buscar por item, codigo o categoria"
    },
    kind: {
      product: "Producto",
      service: "Servicio"
    },
    status: {
      active: "Activo",
      draft: "Borrador",
      archived: "Archivado"
    },
    visibility: {
      public: "Publico",
      private: "Privado"
    },
    pricingMode: {
      fixed: "Precio fijo",
      on_request: "A solicitud"
    },
    pricing: {
      onRequest: "A solicitud"
    },
    form: {
      createTitle: "Crear item real",
      createDescription:
        "Este formulario ya escribe en `catalog_items` para el tenant activo con permisos `catalog.write`.",
      updateTitle: "Actualizar item existente",
      updateDescription:
        "Mantiene nombre, precio, visibilidad y estado del item sin salir del modulo.",
      createAction: "Guardar item",
      createSubmitting: "Guardando item...",
      updateAction: "Actualizar item",
      updateSubmitting: "Actualizando item...",
      resetAction: "Limpiar formulario",
      createSuccess: "Item de catalogo creado correctamente.",
      createError: "No pudimos crear el item. {{message}}",
      updateSuccess: "Item de catalogo actualizado correctamente.",
      updateError: "No pudimos actualizar el item. {{message}}",
      noItemSelected: "Selecciona un item antes de intentar actualizarlo.",
      recordLabel: "Item a actualizar",
      noItemsOption: "No hay items todavia",
      noItemsHint:
        "Primero crea un item real para habilitar el flujo de actualizacion.",
      itemCodeLabel: "Codigo interno",
      itemCodePlaceholder: "CAT-001",
      nameLabel: "Nombre visible",
      namePlaceholder: "Kit de mantenimiento preventivo",
      categoryLabel: "Categoria",
      categoryPlaceholder: "Servicios tecnicos",
      descriptionLabel: "Descripcion corta",
      descriptionPlaceholder:
        "Resumen comercial breve para que ventas entienda rapido que se ofrece.",
      kindLabel: "Tipo",
      visibilityLabel: "Visibilidad",
      pricingModeLabel: "Modo de precio",
      currencyCodeLabel: "Moneda",
      currencyCodePlaceholder: "USD",
      unitPriceLabel: "Precio base",
      unitPricePlaceholder: "1890",
      statusLabel: "Estado",
      notesLabel: "Notas operativas",
      notesPlaceholder:
        "Aclaraciones internas, condiciones o contexto comercial del item.",
      validation: {
        itemCodeMax: "Mantener el codigo por debajo de 40 caracteres.",
        nameMin: "Ingresa el nombre visible del item.",
        nameMax: "Mantener el nombre por debajo de 120 caracteres.",
        categoryMax: "Mantener la categoria por debajo de 80 caracteres.",
        descriptionMax: "Mantener la descripcion por debajo de 240 caracteres.",
        currencyCode: "Usa un codigo de moneda de 3 letras.",
        unitPriceRequired:
          "Ingresa un precio base o cambia el item a modo a solicitud.",
        unitPriceMin: "El precio base no puede ser negativo.",
        notesMax: "Mantener las notas por debajo de 500 caracteres."
      }
    },
    list: {
      title: "Items reales del catalogo",
      description:
        "Lectura real desde `catalog_items` con tarjetas compactas y foco mobile-first.",
      noTenantTitle: "No hay tenant activo para consultar el catalogo",
      noTenantDescription:
        "El shell necesita un tenant activo antes de leer items comerciales reales.",
      loadingTitle: "Cargando items reales del catalogo",
      loadingDescription:
        "Estamos leyendo `catalog_items` con el contexto actual del tenant.",
      errorTitle: "No pudimos cargar el catalogo",
      errorDescription:
        "La lectura real del catalogo fallo por ahora. {{message}}",
      retryAction: "Reintentar carga",
      emptyTitle: "Todavia no hay items registrados",
      emptyDescription:
        "Los primeros productos o servicios reales apareceran aqui cuando empieces a cargarlos.",
      searchEmptyTitle: "No encontramos coincidencias para esta busqueda",
      searchEmptyDescription:
        "Prueba con otro termino o limpia el filtro para volver a ver todo el catalogo.",
      noCode: "Sin codigo interno",
      noCategory: "Categoria pendiente",
      noDescription: "Sin descripcion adicional todavia."
    },
    rules: {
      title: "Reglas operativas del catalogo",
      description:
        "Estas reglas mantienen el slice util para ventas sin meter complejidad de inventario o ERP.",
      captureTitle: "Captura comun para producto o servicio",
      captureText:
        "El mismo formulario debe servir para servicios y productos sin bifurcar el core.",
      pricingTitle: "Precio claro o a solicitud",
      pricingText:
        "Cada item debe dejar obvio si el precio esta listo para cotizar o si requiere validacion manual.",
      visibilityTitle: "Visibilidad entendible al instante",
      visibilityText:
        "La diferencia entre publico y privado debe entenderse rapido para el equipo comercial."
    },
    guidelines: {
      title: "Siguiente uso del modulo",
      description:
        "Este primer corte prepara el terreno para quotes y proformas sin saltar a features pesadas.",
      mobileCapture:
        "La captura debe ser rapida en movil y no depender de tablas densas o drawers complejos.",
      sharedLanguage:
        "Productos y servicios comparten lenguaje operativo, no estructuras separadas por vertical.",
      noInventory:
        "Este modulo no abre inventario, stock ni POS; solo catalogo comercial util para vender.",
      readyForQuotes:
        "La siguiente evolucion natural es conectar estos items a cotizaciones y proformas."
    }
  },
  quotes: {
    header: {
      eyebrow: "Modulo cotizaciones",
      title: "Cotizaciones con receptor flexible y PDF comercial",
      description:
        "El cotizador debe servir para clientes, leads ya registrados y leads rapidos sin guardar, manteniendo versionado, trazabilidad y un PDF serio."
    },
    flow: {
      title: "Flujo de cotizacion a decision",
      description:
        "La secuencia debe seguir corta, visible y facil de retomar desde el telefono.",
      draftTitle: "Borrador",
      draftText:
        "Definir receptor, line items y condiciones sin perder velocidad comercial.",
      reviewTitle: "Revision",
      reviewText:
        "Revisar snapshots del receptor, totales calculados y narrativa comercial.",
      sendTitle: "Enviar",
      sendText: "Generar un PDF limpio con branding, fechas y detalle del servicio.",
      decideTitle: "Decidir",
      decideText:
        "Mantener la cotizacion viva mientras escala a lead, cliente, proforma o cierre."
    },
    document: {
      title: "Principios de experiencia documental",
      description:
        "La cotizacion debe verse elegante pero operativa. La belleza tiene que apoyar confianza y velocidad.",
      structuredSections:
        "El cotizador debe trabajar con receptor, line items, totales y notas en bloques claros.",
      versioning:
        "Versionado, numeracion y snapshot del receptor son no negociables.",
      publicLinks:
        "El PDF debe poder enviarse rapido sin depender de un paso manual de maquetacion."
    },
    form: {
      createTitle: "Crear cotizacion real",
      createDescription:
        "Crea cotizaciones reales con cliente, lead existente o lead rapido, y calcula totales desde line items.",
      updateTitle: "Actualizar cotizacion existente",
      updateDescription:
        "Edita una cotizacion real del tenant activo con versionado y detalle persistido por linea.",
      createAction: "Guardar cotizacion",
      createSubmitting: "Guardando cotizacion...",
      updateAction: "Actualizar cotizacion",
      updateSubmitting: "Actualizando cotizacion...",
      resetAction: "Limpiar formulario",
      createSuccess: "Cotizacion creada correctamente como {{quoteNumber}}.",
      createError: "No pudimos crear la cotizacion. {{message}}",
      updateSuccess: "Cotizacion actualizada correctamente.",
      updateError: "No pudimos actualizar la cotizacion. {{message}}",
      noQuoteSelected: "Selecciona una cotizacion antes de intentar actualizarla.",
      recordLabel: "Cotizacion a actualizar",
      noQuotesOption: "No hay cotizaciones todavia",
      noQuotesHint:
        "Crea una cotizacion real para habilitar el flujo de actualizacion.",
      loadingDetailHint: "Cargando el detalle completo de la cotizacion seleccionada.",
      loadingDetailError:
        "No pudimos leer el detalle de la cotizacion. {{message}}",
      versionHint: "La siguiente actualizacion incrementara la version desde v{{version}}.",
      recipientKindLabel: "Tipo de receptor",
      recipientKinds: {
        customer: "Cliente existente",
        lead: "Lead existente",
        ad_hoc: "Lead rapido"
      },
      customerLabel: "Cliente",
      customerPlaceholder: "Selecciona un cliente",
      noCustomersHint:
        "Aun no hay clientes reales. Puedes usar lead existente o lead rapido mientras tanto.",
      leadLabel: "Lead",
      leadPlaceholder: "Selecciona un lead",
      noLeadsHint:
        "Aun no hay leads persistidos. Puedes capturarlos desde CRM o cotizar como lead rapido.",
      quickRecipientTitle: "Cotizacion rapida sin guardar lead",
      quickRecipientDescription:
        "Usa este modo cuando necesites emitir una cotizacion inmediata y decidir despues si el receptor debe escalarse a lead o cliente.",
      quoteNumberLabel: "Numero de cotizacion",
      generatedNumberPlaceholder: "Se asignara automaticamente al guardar",
      generatedNumberHint:
        "La numeracion vive en Supabase y se asigna automaticamente para mantener consistencia y auditoria.",
      recipientDisplayNameLabel: "Empresa o referencia",
      recipientDisplayNamePlaceholder: "Northline Industrial",
      recipientContactNameLabel: "Contacto",
      recipientContactNamePlaceholder: "Andrea Castillo",
      recipientEmailLabel: "Correo",
      recipientEmailPlaceholder: "andrea@northline.test",
      recipientWhatsAppLabel: "WhatsApp",
      recipientWhatsAppPlaceholder: "+1 809 555 0186",
      recipientPhoneLabel: "Telefono alterno",
      recipientPhonePlaceholder: "+1 809 555 0140",
      titleLabel: "Titulo",
      titlePlaceholder: "Propuesta de equipos y soporte",
      statusLabel: "Estado",
      currencyCodeLabel: "Moneda",
      currencyCodePlaceholder: "USD",
      validUntilLabel: "Valida hasta",
      lineItemsTitle: "Detalle comercial",
      lineItemsDescription:
        "Cada linea debe reflejar un servicio o producto ofertado con cantidad, precio y ajustes visibles.",
      addLineItemAction: "Agregar linea",
      removeLineItemAction: "Eliminar linea",
      lineItemLabel: "Detalle {{index}}",
      catalogItemLabel: "Catalogo relacionado",
      catalogItemPlaceholder: "Selecciona un item del catalogo o captura manual",
      catalogItemOnRequest: "A solicitud",
      lineItemNameLabel: "Nombre del servicio o producto",
      lineItemNamePlaceholder: "Mantenimiento preventivo trimestral",
      lineItemDescriptionLabel: "Descripcion",
      lineItemDescriptionPlaceholder:
        "Incluye alcance, entregables, cobertura o aclaraciones de esta linea.",
      unitLabelLabel: "Unidad",
      unitLabelPlaceholder: "servicio",
      quantityLabel: "Cantidad",
      unitPriceLabel: "Precio unitario",
      discountTotalLabel: "Descuento",
      taxTotalLabel: "Impuestos",
      lineItemTotalLabel: "Total de la linea",
      defaultServiceUnit: "servicio",
      defaultProductUnit: "unidad",
      grandTotalLabel: "Total calculado",
      subtotalSummaryLabel: "Subtotal",
      discountSummaryLabel: "Descuentos",
      taxSummaryLabel: "Impuestos",
      notesLabel: "Notas",
      notesPlaceholder:
        "Terminos comerciales, condiciones de entrega o aclaraciones internas.",
      validation: {
        customerRequired: "Selecciona un cliente antes de guardar.",
        leadRequired: "Selecciona un lead antes de guardar.",
        recipientDisplayNameMin: "Ingresa la empresa o referencia del receptor.",
        recipientDisplayNameMax:
          "Mantener la empresa o referencia por debajo de 120 caracteres.",
        recipientContactNameMax:
          "Mantener el contacto por debajo de 120 caracteres.",
        recipientEmail:
          "Ingresa un correo valido o deja el campo vacio.",
        recipientEmailMax:
          "Mantener el correo por debajo de 120 caracteres.",
        recipientWhatsAppMax:
          "Mantener el WhatsApp por debajo de 30 caracteres.",
        recipientPhoneMax:
          "Mantener el telefono por debajo de 30 caracteres.",
        titleMin: "Ingresa un titulo para la cotizacion.",
        titleMax: "Mantener el titulo por debajo de 160 caracteres.",
        currencyCode: "Usa un codigo de moneda de 3 letras.",
        lineItemsMin: "Agrega al menos una linea a la cotizacion.",
        lineItemNameMin: "Cada linea necesita un nombre visible.",
        lineItemNameMax:
          "Mantener el nombre de la linea por debajo de 160 caracteres.",
        lineItemDescriptionMax:
          "Mantener la descripcion de la linea por debajo de 500 caracteres.",
        quantity: "La cantidad debe ser mayor que cero.",
        unitLabelMax: "Mantener la unidad por debajo de 40 caracteres.",
        unitPrice: "El precio unitario no puede ser negativo.",
        discountTotal: "El descuento no puede ser negativo.",
        taxTotal: "Los impuestos no pueden ser negativos.",
        notesMax: "Mantener las notas por debajo de 500 caracteres."
      }
    },
    list: {
      title: "Lista de cotizaciones reales",
      description:
        "Lectura real desde `quotes` con snapshot del receptor, cards mobile-first y descarga de PDF.",
      currentValueLabel: "Valor actual",
      noTenantTitle: "No hay tenant activo para consultar cotizaciones",
      noTenantDescription:
        "El shell necesita un tenant activo antes de leer la operacion comercial.",
      loadingTitle: "Cargando cotizaciones reales",
      loadingDescription:
        "Estamos leyendo el modulo `quotes` con el contexto actual del tenant.",
      errorTitle: "No pudimos cargar las cotizaciones",
      errorDescription:
        "La lectura real de quotes fallo por ahora. {{message}}",
      retryAction: "Reintentar carga",
      emptyTitle: "Todavia no hay cotizaciones registradas",
      emptyDescription:
        "Las primeras cotizaciones reales apareceran aqui con su estado y valor actual.",
      customerPending: "Receptor pendiente",
      status: {
        draft: "Borrador",
        sent: "Enviada",
        viewed: "Vista",
        approved: "Aprobada",
        rejected: "Rechazada",
        expired: "Expirada"
      }
    },
    pdf: {
      downloadAction: "Descargar PDF",
      generatingAction: "Generando PDF...",
      downloadError: "No pudimos generar el PDF. {{message}}",
      noTenantError: "Necesitas un tenant activo para generar el PDF."
    }
  },
  admin: {
    audit: {
      eyebrow: "Admin global",
      title: "Centro de auditoria y trazabilidad",
      description:
        "Esta superficie queda reservada para observabilidad global. En fase 1 solo el rol global_admin tendra acceso completo a estos datos reales.",
      accessTitle: "Contrato de acceso",
      accessDescription:
        "La UI puede reservar la ruta, pero el acceso real depende de RLS y permisos globales.",
      requiredRole: "Rol requerido",
      requiredPermissions: "Permisos globales base",
      feedTitle: "Cobertura inicial de auditoria",
      feedDescription:
        "La fase 1 cubre cambios funcionales, errores y eventos de auth.",
      entitiesTitle: "Entidades que deben dejar rastro",
      nextTitle: "Siguiente expansion",
      nextDescription:
        "El acceso parcial para admins de tenant se evaluara en una fase posterior.",
      errorsLink: "Ver panel de errores",
      settingsLink: "Revisar checkpoints del sistema"
    },
    errors: {
      eyebrow: "Errores y observabilidad",
      title: "Panel reservado para errores operativos",
      description:
        "Aqui viviran los errores visibles, eventos de edge functions y estados de correccion para la plataforma.",
      severityTitle: "Severidades esperadas",
      severityDescription:
        "El sistema debe distinguir ruido, warning, error y eventos criticos para priorizar respuesta.",
      controlsTitle: "Controles obligatorios",
      controlsDescription:
        "Los errores deben registrar actor, tenant, fuente y estado de remediacion.",
      controlActors: "Actor y tenant cuando aplique",
      controlSource: "Fuente tecnica y severidad",
      controlResolution: "Estado pendiente o corregido",
      controlStress: "Relacion futura con stress-harness",
      auditLink: "Volver al centro de auditoria"
    }
  },
  auth: {
    hero: {
      eyebrow: "OperaPyme en la web",
      title: "Sincronizado en todos tus dispositivos.",
      description:
        "Usa OperaPyme en tu celular o en tu PC con la misma experiencia de trabajo.",
      cardRbacTitle: "RBAC desde el inicio",
      cardRbacText:
        "El acceso se decide por roles y permisos del tenant, no por visibilidad en la UI.",
      cardAuditTitle: "Auditoría obligatoria",
      cardAuditText:
        "Toda acción sensible nace con tracking de actor, timestamps y trazabilidad."
    },
    entry: {
      brandLabel: "Backoffice operativo",
      existingLead: "Si ya usas OperaPyme:",
      existingCta: "Inicia sesión",
      firstTimeLead: "Si es tu primera vez en OperaPyme:",
      firstTimeCta: "Crea tu cuenta",
      signinEyebrow: "Acceso existente",
      signinPanelTitle: "Inicia sesión en tu cuenta",
      signinSwitchLead: "¿Todavía no tienes acceso?",
      signinSwitchAction: "Crea tu cuenta",
      formTitle: "Ingresa tu correo para continuar",
      signinDescription:
        "Te enviaremos un enlace de acceso a tu correo de trabajo para entrar a tu cuenta.",
      signupEyebrow: "Primer ingreso",
      signupPanelTitle: "Crea tu cuenta",
      signupSwitchLead: "¿Ya tienes acceso?",
      signupSwitchAction: "Inicia sesión",
      signupDescription:
        "Te enviaremos un enlace para crear tu acceso y empezar a configurar tu espacio.",
      helper:
        "Usa el correo con el que administras tu negocio para continuar."
    },
    form: {
      title: "Solicita tu acceso",
      emailLabel: "Correo de trabajo",
      emailPlaceholder: "equipo@operapyme.com",
      submit: "Enviar enlace de acceso",
      submitFirstTime: "Enviar enlace para empezar",
      submitting: "Enviando acceso...",
      emailSentTitle: "Revisa tu correo",
      emailSentText:
        "Enviamos un enlace de acceso a {{email}}. Si no lo ves, revisa spam o vuelve a intentarlo.",
      noteTitle: "Modo actual de acceso",
      noteText:
        "Usamos acceso por correo para que entres rapido desde cualquier dispositivo."
    },
    callback: {
      eyebrow: "Validando acceso",
      title: "Estamos confirmando tu sesión.",
      description:
        "Si todo sale bien, te llevaremos al setup inicial o a tu espacio de trabajo.",
      errorMissing:
        "El enlace de acceso no tiene los datos necesarios o ya fue consumido. Solicita uno nuevo desde el inicio de sesión.",
      errorUnsupported:
        "El enlace de acceso usa un formato que este backoffice todavía no puede validar.",
      backToAuth: "Solicitar otro enlace"
    },
    unconfigured: {
      eyebrow: "Supabase pendiente",
      title: "El backoffice necesita conexión a Supabase antes de abrir sesión.",
      description:
        "Este entorno todavía no tiene variables públicas o alias MCP listos para trabajar con el proyecto remoto de OperaPyme.",
      stepsTitle: "Qué revisar",
      stepAliasTitle: "Alias MCP correcto",
      stepAliasText:
        "Usa `supabase_operapyme` como alias canónico para este repo.",
      stepEnvTitle: "Variables públicas del backoffice",
      stepEnvText:
        "Completa `apps/backoffice-pwa/.env.local` con la URL y la publishable key del proyecto correcto.",
      stepMigrationsTitle: "Migraciones y bootstrap",
      stepMigrationsText:
        "Aplica las migraciones seguras y luego vuelve a cargar el backoffice para continuar con auth."
    }
  },
  setup: {
    eyebrow: "Bootstrap inicial del tenant",
    title: "Crea el primer espacio operativo antes de abrir CRM y cotizaciones.",
    description:
      "El primer ingreso de un usuario autenticado debe terminar con un tenant real, una membresía activa y el rol dueño del tenant.",
    cardTenantTitle: "Tenant primero",
    cardTenantText:
      "Todo en OperaPyme nace bajo tenant, con `tenant_id`, RLS y rastreo de actor.",
    cardRolesTitle: "Dueño inicial",
    cardRolesText:
      "La primera membresía nace con rol `tenant_owner` para destrabar configuración y siguientes módulos.",
    formTitle: "Crear tenant inicial",
    nameLabel: "Nombre comercial",
    namePlaceholder: "OperaPyme Demo Norte",
    slugLabel: "Slug del tenant",
    slugPlaceholder: "operapyme-demo-norte",
    slugHint: "URL operativa sugerida: {{slug}}",
    submit: "Crear tenant y continuar",
    submitting: "Creando tenant...",
    noteTitle: "Regla de operación",
    noteText:
      "Más adelante este flujo podrá vivir como wizard multi paso, pero hoy ya deja la membresía y el rol base listos.",
    nextTitle: "Lo siguiente",
    nextText:
      "Después del bootstrap el backoffice queda listo para conectar clientes, cotizaciones y configuración real por tenant."
  },
  accessDenied: {
    eyebrow: "Acceso restringido",
    title: "Esta superficie no está disponible para tu contexto actual.",
    description:
      "La auditoría global y los errores operativos son exclusivos del rol `global_admin` en esta fase.",
    backHome: "Volver al inicio"
  },
  settings: {
    header: {
      eyebrow: "Preparacion del sistema",
      title: "Checkpoints de entorno y arquitectura",
      description:
        "Usa esta vista como puente de implementacion entre el scaffold visual y el producto real con Supabase."
    },
    env: {
      title: "Estado del entorno",
      description:
        "La app ya sabe si las llaves de Supabase existen de forma local.",
      detected: "Variables de Supabase detectadas",
      missing: "Faltan variables de Supabase",
      instructions:
        "Agrega `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` en `apps/backoffice-pwa/.env`."
    },
    checklist: {
      title: "Checklist de implementacion",
      description:
        "Mantener la secuencia disciplinada para que el producto crezca sin deuda estructural.",
      connectSupabase: "Conectar URL de Supabase y publishable key",
      addAuth: "Agregar auth y bootstrap inicial del tenant",
      createRbac: "Crear tablas raiz de RBAC y politicas",
      wireQuery: "Conectar los primeros hooks de React Query a datos reales",
      enableOffline: "Habilitar persistencia segura para borradores offline"
    },
    theme: {
      title: "Modo de color",
      description:
        "Cada usuario puede elegir claro, oscuro o seguir el sistema sin tocar la marca visual del tenant.",
      helper:
        "Esta preferencia es personal del usuario actual. La paleta del tenant se gestiona aparte y afecta la identidad compartida."
    },
    palette: {
      title: "Paleta visual del tenant",
      description:
        "Elige una paleta curada para que backoffice y storefront compartan la misma marca sin perder legibilidad ni consistencia.",
      sharedBadge: "Una marca, dos apps",
      previewBadge: "Preview en vivo",
      ruleTitle: "Por que empezamos por presets y no por un color picker libre",
      ruleText:
        "Las paletas vienen curadas para mantener contraste, velocidad de setup y consistencia visual en multiples modulos y pantallas.",
      storageTitle: "Persistencia actual",
      storageText:
        "En este scaffold la seleccion se guarda localmente para iterar rapido. El siguiente paso real es persistir `palette_id` por tenant en Supabase y usar cache local solo como optimizacion.",
      backofficeTitle: "Backoffice operativo",
      backofficeDescription:
        "Mas estructura, mas densidad util y un fondo contenido para trabajo diario.",
      storefrontTitle: "Storefront editorial",
      storefrontDescription:
        "Mas atmosfera visual, tono comercial y acento sobre conversion publica.",
      previewCardTitle: "Card compartida",
      previewCardDescription:
        "La misma marca se adapta al contexto sin crear dos sistemas distintos.",
      previewCta: "CTA principal",
      previewAction: "Aplicar",
      apply: "Aplicar paleta",
      active: "Paleta activa",
      contrastLabel: "Contraste CTA",
      reviewLabel: "Revisar contraste"
    },
    principles: {
      rbacTitle: "RBAC antes del polish",
      rbacText:
        "Roles y RLS deben moldear la app temprano para que las pantallas futuras no asuman permisos inseguros.",
      offlineTitle: "Offline con proposito",
      offlineText:
        "Empieza con lecturas cacheadas y colas de borrador en lugar de prometer offline total demasiado temprano.",
      edgeTitle: "Edge Functions para funciones potentes",
      edgeText:
        "IA, push, generacion de PDFs y webhooks deben vivir en Supabase Edge Functions, no en el cliente."
    }
  }
};

export default backofficeEs;
