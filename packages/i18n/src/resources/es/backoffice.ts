const backofficeEs = {
  shared: {
    closeDialog: "Cerrar modal",
    slider: {
      previous: "Ver anterior",
      next: "Ver siguiente"
    }
  },
  dashboard: {
    header: {
      eyebrow: "Inicio",
      title: "Cashflow",
      description:
        "Consulta actividad reciente, prioriza el siguiente paso y entra directo a CRM, catalogo y cotizaciones.",
      customerCountBadge: "{count} clientes en cartera",
      activeCustomerCountBadge: "{count} activos",
      openQuoteCountBadge: "{count} cotizaciones abiertas",
      pendingBadge: "Esperando contexto del tenant"
    },
    actions: {
      newLead: "Nuevo lead",
      newQuote: "Nueva cotizacion",
      reviewCatalog: "Revisar catalogo",
      reviewQuotes: "Revisar cotizaciones"
    },
    ranges: {
      "7d": "Ultimos 7 dias",
      "30d": "Ultimos 30 dias",
      all: "Todo el tiempo"
    },
    checklist: {
      title: "Siguiente en cola",
      description:
        "Accede a los bloques clave del dia sin perder contexto.",
      captureLead: "Registrar un nuevo lead",
      prepareCatalog: "Actualizar productos y servicios",
      sendQuote: "Preparar o retomar una cotizacion",
      reviewSettings: "Ajustar configuracion del tenant"
    },
    emptyState: {
      title: "Todavia no hay movimiento comercial",
      description:
        "Empieza por CRM o catalogo para preparar la primera cotizacion del tenant."
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
        label: "Clientes",
        detail: "{count} clientes disponibles para cotizar y dar seguimiento.",
        change: "+{count}"
      },
      activeCustomerCount: {
        label: "Clientes activos",
        detail: "{count} clientes siguen listos para seguimiento comercial.",
        change: "+{count}"
      },
      quoteCount: {
        label: "Cotizaciones",
        detail: "{count} cotizaciones registradas para este tenant.",
        change: "-{count}"
      },
      openQuoteCount: {
        label: "Cotizaciones abiertas",
        detail: "{count} cotizaciones que siguen en gestion o espera.",
        change: "+{count}"
      },
      customersValue: "{count}",
      documentsValue: "{count}"
    },
    focus: {
      title: "Enfoque sugerido",
      description:
        "Lectura corta para decidir el siguiente bloque operativo del dia.",
      recommendedLabel: "Prioriza ahora",
      focusCaptureLead:
        "Todavia no hay cartera activa. Conviene capturar el primer lead y abrir base comercial cuanto antes.",
      focusResumeQuotes:
        "Hay {count} cotizaciones abiertas. Conviene retomarlas antes de abrir trabajo nuevo.",
      focusPrepareQuote:
        "Ya hay cartera activa, pero falta una cotizacion en curso. Conviene preparar la siguiente propuesta.",
      focusReviewCatalog:
        "La base comercial ya tiene movimiento. Revisa catalogo para cotizar mas rapido y mantener consistencia.",
      metrics: {
        activeCustomers: "Clientes activos",
        openQuotes: "Cotizaciones abiertas",
        totalQuotes: "Cotizaciones totales"
      }
    },
    activity: {
      title: "Actividad reciente",
      description:
        "Cotizaciones tocadas recientemente para retomar negociaciones sin perder contexto.",
      empty:
        "Todavia no hay cotizaciones recientes para mostrar en este tenant.",
      emptyRange:
        "No encontramos cotizaciones recientes dentro del rango seleccionado.",
      today: "Hoy",
      yesterday: "Ayer",
      headers: {
        quote: "Cotizacion",
        recipient: "Receptor",
        status: "Estado",
        amount: "Valor",
        action: "Accion"
      },
      viewAction: "Abrir",
      status: {
        positive: "Paid",
        neutral: "Withdraw",
        negative: "Overdue"
      }
    },
    livePulse: {
      noTenantTitle: "Todavia no hay un tenant activo seleccionado",
      noTenantDescription:
        "Selecciona un tenant activo antes de revisar clientes y cotizaciones.",
      loadingTitle: "Cargando el pulso comercial",
      loadingDescription:
        "Estamos leyendo clientes y cotizaciones del tenant activo.",
      errorTitle: "No pudimos cargar el pulso comercial",
      errorDescription:
        "La lectura real del tenant fallo por ahora. {message}",
      retryAction: "Reintentar carga",
      customersTitle: "Clientes recientes",
      customersDescription:
        "Ultimos clientes tocados por el equipo comercial.",
      customersAction: "Ir a CRM",
      customersEmpty: "Todavia no hay clientes recientes para mostrar.",
      quotesTitle: "Cotizaciones recientes",
      quotesDescription:
        "Cotizaciones con seguimiento reciente y salida a PDF.",
      quotesAction: "Ir a cotizaciones",
      quotesEmpty: "Todavia no hay cotizaciones recientes para mostrar.",
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
    clients: {
      title: "Clientes recientes",
      description:
        "Consulta los ultimos clientes tocados por el equipo y entra a CRM con contexto.",
      viewAll: "Abrir CRM",
      emptyRange:
        "No encontramos clientes recientes dentro del rango seleccionado.",
      lastTouchLabel: "Ultimo movimiento",
      sourceLabel: "Origen",
      amountLabel: "Monto",
      pendingCollectionStatus: "Pendiente de cobro",
      paidThisMonthStatus: "Pagado este mes",
      optionsLabel: "Opciones para {customer}"
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
  learning: {
    header: {
      eyebrow: "Aprendizaje",
      title: "Guias rapidas para avanzar con seguridad",
      description:
        "Encuentra aqui el paso a paso esencial para usar OperaPyme con mas claridad y menos dudas."
    },
    principles: {
      title: "Que encontraras aqui",
      description:
        "Este espacio reune ayudas cortas y practicas para que las pantallas de trabajo se mantengan simples y enfocadas.",
      runtimeTitle: "Menos friccion al trabajar",
      runtimeText:
        "Pantallas como crear cotizacion ahora se concentran en completar la tarea, no en explicarla de mas.",
      guidesTitle: "Pasos claros",
      guidesText:
        "Cada guia resume el orden recomendado para resolver una tarea sin perder tiempo buscando por donde empezar.",
      supportTitle: "Acceso directo",
      supportText:
        "Entra al area correcta desde aqui y completa la accion real cuando ya tengas claro el siguiente paso."
    },
    guides: {
      quotesFast: {
        eyebrow: "Cotizaciones",
        title: "Crear una cotizacion en pocos pasos",
        description:
          "Ideal para emitir una propuesta sin detener el ritmo comercial.",
        stepOne: "Elige cliente, lead o lead rapido segun el contexto.",
        stepTwo: "Completa titulo, estado, moneda y vigencia solo si aplican.",
        stepThree: "Agrega al menos una linea con cantidad y precio, luego guarda.",
        action: "Ir a nueva cotizacion"
      },
      quotesManage: {
        eyebrow: "Seguimiento",
        title: "Retomar una cotizacion existente",
        description:
          "Usa esta guia para ajustar, actualizar o cerrar documentos ya creados.",
        stepOne: "Entra a gestionar cotizaciones y elige el documento correcto.",
        stepTwo: "Corrige receptor, documento o lineas segun el caso.",
        stepThree: "Guarda cambios y valida el total antes de compartir.",
        action: "Ir a gestionar cotizaciones"
      },
      crmLead: {
        eyebrow: "CRM",
        title: "Capturar un lead y prepararlo para cotizar",
        description:
          "Cuando todavia no existe un receptor claro en cartera, este es el mejor punto de partida.",
        stepOne: "Registra empresa, contacto y canal principal.",
        stepTwo: "Resume la necesidad comercial en una frase util.",
        stepThree: "Luego pasa a cotizaciones cuando ya tengas claro que vas a ofrecer.",
        action: "Ir a CRM"
      },
      catalog: {
        eyebrow: "Catalogo",
        title: "Preparar items antes de cotizar",
        description:
          "Te ayuda a cotizar mas rapido cuando vendes productos o servicios recurrentes.",
        stepOne: "Crea productos o servicios con nombre claro y categoria.",
        stepTwo: "Define si el precio es fijo o bajo solicitud.",
        stepThree: "Usa esos items luego dentro de las lineas de una cotizacion.",
        action: "Ir a catalogo"
      }
    }
  },
  crm: {
    header: {
      eyebrow: "Modulo CRM",
      title: "Leads, clientes y seguimiento",
      description:
        "Captura oportunidades, revisa clientes recientes y actualiza datos comerciales sin salir del modulo."
    },
    actions: {
      captureLead: "Capturar lead",
      manageCustomers: "Gestionar clientes"
    },
    overview: {
      title: "Estado del CRM",
      description:
        "Usa este resumen para ver si el tenant ya tiene base activa y casos que requieren seguimiento.",
      totalCustomers: "{count} clientes",
      activeCustomers: "{count} activos",
      inactiveCustomers: "{count} por revisar",
      totalLabel: "Clientes totales",
      activeLabel: "Clientes activos",
      needsAttentionLabel: "Inactivos o archivados",
      emptyTitle: "Todavia no hay clientes en cartera",
      emptyDescription:
        "Empieza capturando un lead o creando el primer cliente del tenant."
    },
    form: {
      title: "Captura rapida de lead",
      description:
        "Registra un lead con lo minimo necesario para no perder velocidad comercial.",
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
      createError: "No pudimos crear el lead. {message}",
      noTenantHint:
        "Necesitas un tenant activo antes de capturar leads reales para CRM.",
      previewTitle: "Resumen del lead",
      previewDescription:
        "Verifica rapidamente el contacto y la necesidad antes de seguir con el cliente o la cotizacion.",
      previewDraftStatus: "Lead en captura",
      previewStatus: "Lead listo para seguimiento",
      previewEmptyTitle: "Todavia no hay nada enviado",
      previewEmptyDescription:
        "Completa el formulario para ver el resumen operativo del lead.",
      previewCompany: "Empresa",
      previewContact: "Contacto",
      previewChannel: "Canal",
      previewNeed: "Necesidad",
      previewPendingValue: "Pendiente"
    },
    recent: {
      title: "Clientes recientes",
      description:
        "Consulta los ultimos clientes tocados por el equipo y entra con contexto a cada seguimiento.",
      originLabel: "Origen",
      noTenantTitle: "No hay tenant activo para consultar clientes",
      noTenantDescription:
        "Selecciona un tenant activo antes de revisar la cartera.",
      loadingTitle: "Cargando clientes reales",
      loadingDescription:
        "Estamos leyendo los clientes del tenant activo.",
      errorTitle: "No pudimos cargar los clientes",
      errorDescription:
        "La lectura real del CRM fallo por ahora. {message}",
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
      createTitle: "Nuevo cliente",
      createDescription:
        "Completa la ficha comercial para dejar el cliente listo para seguimiento y cotizacion.",
      updateTitle: "Actualizar cliente",
      updateDescription:
        "Corrige datos, estado u observaciones del cliente sin salir del CRM.",
      createAction: "Guardar cliente",
      createSubmitting: "Guardando cliente...",
      updateAction: "Actualizar cliente",
      updateSubmitting: "Actualizando cliente...",
      resetAction: "Limpiar formulario",
      createSuccess: "Cliente creado correctamente.",
      createError: "No pudimos crear el cliente. {message}",
      updateSuccess: "Cliente actualizado correctamente.",
      updateError: "No pudimos actualizar el cliente. {message}",
      noCustomerSelected: "Selecciona un cliente antes de intentar actualizarlo.",
      recordLabel: "Cliente a actualizar",
      noCustomersOption: "No hay clientes todavia",
      noCustomersHint:
        "Primero crea un cliente real para habilitar el flujo de actualizacion.",
      customerCodeLabel: "Codigo de cliente",
      customerCodePending: "Se asigna al guardar",
      customerCodeAutoHint:
        "El sistema asigna el codigo automaticamente con el formato C00001.",
      customerCodeLockedHint:
        "Este codigo se genera una sola vez y no se puede editar.",
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
      documentIdLabel: "RNC / Cedula",
      documentIdPlaceholder: "101-5555555-1",
      isForeignLabel: "Cliente extranjero",
      isForeignHint:
        "Activalo cuando el cliente no use RNC o cedula local y necesite pasaporte.",
      passportIdLabel: "Pasaporte",
      passportIdPlaceholder: "AA1234567",
      websiteUrlLabel: "Sitio web",
      websiteUrlPlaceholder: "www.operapyme.com",
      attachmentLabel: "Anexo del cliente",
      attachmentHint:
        "Sube un documento, contrato o soporte de referencia para esta ficha.",
      attachmentUploadAction: "Cargar anexo",
      attachmentReplaceAction: "Reemplazar anexo",
      attachmentRemoveAction: "Quitar anexo",
      attachmentOpenAction: "Abrir anexo",
      attachmentEmpty: "Todavia no hay anexo cargado.",
      ncfTypeLabel: "Tipo de NCF por defecto",
      ncfTypePlaceholder: "Selecciona el tipo de NCF",
      ncfTypeEmpty: "Sin tipo de NCF",
      ncfTypeHint:
        "El tipo de NCF del cliente se usara como valor por defecto al crear facturas.",
      sourceLabel: "Origen",
      statusLabel: "Estado",
      notesLabel: "Comentarios",
      notesPlaceholder:
        "Contexto comercial, acuerdos o detalles relevantes para seguimiento.",
      validation: {
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
        passportIdMax: "Mantener el pasaporte por debajo de 60 caracteres.",
        passportIdRequired:
          "Marca el pasaporte cuando el cliente extranjero no use RNC o cedula.",
        websiteUrl: "Ingresa un sitio web valido o deja el campo vacio.",
        websiteUrlMax: "Mantener el sitio web por debajo de 160 caracteres.",
        notesMax: "Mantener los comentarios por debajo de 500 caracteres."
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
        "Organiza productos y servicios, actualiza precio y visibilidad, y deja todo listo para cotizar."
    },
    actions: {
      manageItems: "Gestionar items",
      reviewList: "Revisar listado"
    },
    overview: {
      title: "Estado del catalogo",
      description:
        "Valida rapido si el tenant ya tiene oferta publicada y cuantos items siguen a solicitud.",
      totalItems: "{count} items",
      publicItems: "{count} publicos",
      onRequestItems: "{count} a solicitud",
      totalLabel: "Items totales",
      publicLabel: "Visibles al equipo",
      onRequestLabel: "Precio a solicitud",
      emptyTitle: "Todavia no hay items cargados",
      emptyDescription:
        "Empieza creando el primer producto o servicio del tenant."
    },
    search: {
      title: "Buscar en el catalogo",
      description:
        "Filtra por nombre, codigo, categoria o descripcion sin salir del listado.",
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
      createTitle: "Nuevo item",
      createDescription:
        "Registra un producto o servicio con la informacion minima para ventas.",
      updateTitle: "Actualizar item",
      updateDescription:
        "Corrige precio, visibilidad o estado del item sin salir del catalogo.",
      createAction: "Guardar item",
      createSubmitting: "Guardando item...",
      updateAction: "Actualizar item",
      updateSubmitting: "Actualizando item...",
      resetAction: "Limpiar formulario",
      createSuccess: "Item de catalogo creado correctamente.",
      createError: "No pudimos crear el item. {message}",
      updateSuccess: "Item de catalogo actualizado correctamente.",
      updateError: "No pudimos actualizar el item. {message}",
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
        descriptionMax: "Mantener la descripcion por debajo de 2000 caracteres.",
        currencyCode: "Usa un codigo de moneda de 3 letras.",
        unitPriceRequired:
          "Ingresa un precio base o cambia el item a modo a solicitud.",
        unitPriceMin: "El precio base no puede ser negativo.",
        notesMax: "Mantener las notas por debajo de 500 caracteres."
      }
    },
    filters: {
      all: "Todos",
      active: "Solo activos",
      inactive: "Inactivos"
    },
    table: {
      nameLabel: "Nombre / Codigo",
      categoryLabel: "Categoria",
      kindLabel: "Tipo",
      visibilityLabel: "Visibilidad",
      pricingLabel: "Precio",
      statusLabel: "Estado",
      actionsLabel: "Acciones",
      editAction: "Editar"
    },
    list: {
      title: "Catalogo",
      description:
        "Consulta los items disponibles, filtra rapido y detecta faltantes antes de cotizar.",
      noTenantTitle: "No hay tenant activo para consultar el catalogo",
      noTenantDescription:
        "Selecciona un tenant activo antes de revisar el catalogo.",
      loadingTitle: "Cargando items reales del catalogo",
      loadingDescription:
        "Estamos leyendo el catalogo del tenant activo.",
      errorTitle: "No pudimos cargar el catalogo",
      errorDescription:
        "La lectura real del catalogo fallo por ahora. {message}",
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
      title: "Cotizaciones y documentos comerciales",
      description:
        "Crea, actualiza y da seguimiento a cotizaciones con receptor flexible y salida PDF lista para enviar."
    },
    actions: {
      createQuote: "Crear cotizacion",
      reviewQuotes: "Revisar cotizaciones"
    },
    subroutes: {
      createEyebrow: "Nuevo flujo",
      createTitle: "Crear cotizacion",
      createDescription:
        "Trabaja por pasos cortos para capturar receptor, documento y detalle comercial con menos friccion.",
      manageEyebrow: "Seguimiento activo",
      manageTitle: "Gestionar cotizaciones",
      manageDescription:
        "Retoma documentos existentes, ajusta lineas y conserva contexto antes de enviarlos."
    },
    createPage: {
      directEntryDescription:
        "Empieza directo: clientes {customers}, leads {leads}, items {catalogItems}. Completa lo necesario y guarda.",
      customerCount: "Clientes listos",
      customerCountHint: "Usalos si ya sabes a quien vas a cotizar.",
      leadCount: "Leads listos",
      leadCountHint: "Retoma prospectos existentes sin salir del flujo.",
      catalogCount: "Items listos",
      catalogCountHint: "Acelera el detalle comercial con catalogo reusable.",
      focusTitle: "Lo esencial para salir rapido",
      focusDescription:
        "El flujo ahora te lleva primero por lo minimo necesario y deja el resto visible solo cuando aporta.",
      focusRecipientTitle: "1. Define el receptor",
      focusRecipientDescription:
        "Escoge cliente, lead o lead rapido y completa solo los canales utiles.",
      focusDocumentTitle: "2. Ajusta el documento",
      focusDocumentDescription:
        "Titulo, estado, moneda y vigencia quedan juntos para decidir sin ruido.",
      focusItemsTitle: "3. Arma la propuesta",
      focusItemsDescription:
        "Completa lineas, revisa total y guarda sin perder contexto.",
      fastTrackTitle: "Atajo recomendado",
      fastTrackDescription:
        "Si solo necesitas cotizar ya, entra por lead rapido y completa en este orden.",
      fastTrackLead:
        "Escribe empresa o referencia y al menos un canal de contacto claro.",
      fastTrackPrice:
        "Agrega una linea con nombre, cantidad y precio para calcular el total.",
      fastTrackSave:
        "Guarda la cotizacion y decide despues si ese receptor pasa a CRM."
    },
    landing: {
      createCardTitle: "Crear una nueva cotizacion",
      createCardDescription: "Empieza con un flujo corto y enfocado por pasos.",
      manageCardTitle: "Gestionar cotizaciones existentes",
      manageCardDescription: "Entra directo a las que necesitan ajuste o seguimiento.",
      resumeCardTitle: "Retomar trabajo pendiente",
      resumeCardDescription: "Vuelve rapido a drafts, abiertas y documentos aprobados."
    },
    overview: {
      title: "Capacidad de cotizar",
      description:
        "Verifica si el tenant ya tiene base suficiente para cotizar y cuantas cotizaciones siguen abiertas.",
      totalQuotes: "{count} cotizaciones",
      openQuotes: "{count} abiertas",
      approvedQuotes: "{count} aprobadas",
      customersReady: "Clientes disponibles",
      leadsReady: "Leads disponibles",
      catalogReady: "Items de catalogo",
      readyToSend: "Cotizaciones en seguimiento"
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
      createTitle: "Nueva cotizacion",
      createDescription:
        "Completa receptor, lineas y condiciones para emitir una cotizacion lista para enviar.",
      createBadge: "Nuevo documento",
      updateTitle: "Actualizar cotizacion",
      updateDescription:
        "Retoma una cotizacion existente, ajusta lineas y conserva versionado.",
      updateBadge: "Edicion activa",
      workflowTitle: "Flujo progresivo del cotizador",
      workflowDescription:
        "Reduce ruido visual y deja solo los campos utiles en cada momento del trabajo.",
      workflowRecipientHint: "Paso 1: define receptor y canales de contacto.",
      workflowDocumentHint: "Paso 2: ajusta fecha, estado, moneda y validez del documento.",
      workflowItemsHint: "Paso 3 y 4: arma lineas, revisa totales y cierra notas.",
      newDraftLabel: "Borrador nuevo",
      summaryTitle: "Resumen rapido",
      summaryRecipient: "Receptor",
      summaryStatus: "Estado",
      summaryLineItems: "Lineas",
      pendingSummaryValue: "Pendiente",
      validationSummaryTitle: "Estado del formulario",
      validationSummaryReady: "Todo luce listo para guardar o actualizar.",
      validationSummaryReadyTitle: "Listo para guardar",
      validationSummaryReadyDescription:
        "Ya no quedan bloqueos visibles en este formulario.",
      validationSummaryPending:
        "Todavia quedan campos por revisar antes de cerrar la cotizacion.",
      validationSummaryPendingDetailed:
        "Hay {count} alertas por revisar antes de cerrar la cotizacion.",
      reviewChecklistTitle: "Revision final",
      reviewChecklistRecipient: "Confirma el receptor y los canales visibles en el documento.",
      reviewChecklistDocument: "Verifica fecha del documento, vigencia, estado y narrativa comercial.",
      reviewChecklistItems: "Confirma lineas, descuentos, impuestos y total calculado.",
      backStepAction: "Paso anterior",
      nextStepAction: "Siguiente paso",
      stepNumber: "Paso {count}",
      steps: {
        recipient: {
          title: "Receptor",
          description: "Define a quien va dirigida la cotizacion y como contactarlo."
        },
        document: {
          title: "Documento",
          description: "Ajusta metadata operativa sin mezclarla con line items."
        },
        items: {
          title: "Lineas",
          description: "Captura el detalle comercial y deja los totales claros."
        },
        review: {
          title: "Revision",
          description: "Cierra notas, valida contexto y guarda el documento."
        }
      },
      createAction: "Guardar cotizacion",
      createSubmitting: "Guardando cotizacion...",
      updateAction: "Actualizar cotizacion",
      updateSubmitting: "Actualizando cotizacion...",
      resetAction: "Limpiar formulario",
      createSuccess: "Cotizacion creada correctamente como {quoteNumber}.",
      createError: "No pudimos crear la cotizacion. {message}",
      validationToast:
        "Revisa {label}. Todavia quedan {count} alertas por resolver.",
      updateSuccess: "Cotizacion actualizada correctamente.",
      updateError: "No pudimos actualizar la cotizacion. {message}",
      noTenantError: "Necesitas un tenant activo antes de guardar la cotizacion.",
      noQuoteSelected: "Selecciona una cotizacion antes de intentar actualizarla.",
      recordLabel: "Cotizacion a actualizar",
      noQuotesOption: "No hay cotizaciones todavia",
      noQuotesHint:
        "Crea una cotizacion real para habilitar el flujo de actualizacion.",
      loadingDetailHint: "Cargando el detalle completo de la cotizacion seleccionada.",
      loadingDetailError:
        "No pudimos leer el detalle de la cotizacion. {message}",
      versionHint: "La siguiente actualizacion incrementara la version desde v{version}.",
      recipientKindLabel: "Tipo de receptor",
      recipientKinds: {
        customer: "Cliente existente",
        lead: "Lead existente",
        ad_hoc: "Lead rapido"
      },
      recipientKindDescriptions: {
        customer: "Usa un cliente ya creado y trae sus datos al documento.",
        lead: "Retoma un lead existente sin capturarlo de nuevo.",
        ad_hoc: "Cotiza ahora y decide despues si pasa a CRM."
      },
      recipientSelectorTitle: "Como quieres arrancar esta cotizacion",
      recipientSelectorDescription:
        "Elige el camino que te deje cotizar con menos pasos para este caso.",
      customerLabel: "Cliente",
      customerPlaceholder: "Selecciona un cliente",
      customerSearchPlaceholder: "Busca por empresa o RNC",
      customerSearchEmpty: "No encontramos clientes con ese nombre o RNC.",
      customerSelectedHint:
        "Cliente seleccionado:",
      noCustomersHint:
        "Aun no hay clientes reales. Puedes usar lead existente o lead rapido mientras tanto.",
      leadLabel: "Lead",
      leadPlaceholder: "Selecciona un lead",
      leadSelectedHint:
        "Al elegir un lead, sus datos se traen al documento para que no tengas que repetirlos.",
      noLeadsHint:
        "Aun no hay leads persistidos. Puedes capturarlos desde CRM o cotizar como lead rapido.",
      quickRecipientTitle: "Cotizacion rapida sin guardar lead",
      quickRecipientDescription:
        "Usa este modo cuando necesites cotizar de inmediato y decidir despues si ese receptor pasa a CRM.",
      centralFocusTitle: "Enfoque de este paso",
      centralFocusByStep: {
        recipient:
          "Deja claro para quien es la cotizacion y por donde conviene responderle.",
        document:
          "Ajusta el titulo, la moneda y la vigencia para que el documento salga limpio.",
        items:
          "Completa una propuesta entendible, con lineas claras y total confiable.",
        review:
          "Haz una ultima pasada por notas, bloqueos y total antes de guardar."
      },
      quoteNumberLabel: "Numero de cotizacion",
      generatedNumberPlaceholder: "Se asignara automaticamente al guardar",
      generatedNumberHint:
        "La numeracion se asigna automaticamente para mantener orden y trazabilidad.",
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
      issuedOnLabel: "Fecha del documento",
      documentDiscountTitle: "Descuento global del documento",
      documentDiscountDescription:
        "Aplica un ajuste general a la cotizacion completa despues de los descuentos por linea.",
      discountApplicationModeLabel: "Modo de calculo",
      discountApplicationModes: {
        before_tax: "Estandar: descuento antes de impuesto",
        after_tax: "Ajuste comercial: descuento sobre total con impuesto"
      },
      discountApplicationModeHints: {
        before_tax:
          "Este modo descuenta primero la base y luego recalcula el impuesto sobre el monto restante.",
        after_tax:
          "Este modo conserva el impuesto original y aplica el descuento comercial sobre el total con impuesto."
      },
      documentDiscountPercentLabel: "Descuento global %",
      documentDiscountAmountLabel: "Descuento global fijo",
      documentDiscountHint:
        "Se calcula sobre {amount} netos despues de los descuentos por linea.",
      validUntilLabel: "Valida hasta",
      lineItemsTitle: "Detalle comercial",
      lineItemsDescription:
        "Cada linea debe dejar claro que se ofrece, cuanto cuesta y que ajuste aplica.",
      addLineItemAction: "Agregar linea",
      removeLineItemAction: "Eliminar linea",
      lineItemLabel: "Detalle {index}",
      catalogItemLabel: "Catalogo relacionado",
      catalogItemPlaceholder: "Selecciona un item del catalogo o captura manual",
      catalogItemOnRequest: "A solicitud",
      itemCodeLabel: "Codigo del articulo",
      itemCodePlaceholder: "ART-001",
      lineItemNameLabel: "Nombre del servicio o producto",
      lineItemNamePlaceholder: "Mantenimiento preventivo trimestral",
      lineItemDescriptionLabel: "Descripcion",
      lineItemDescriptionPlaceholder:
        "Incluye alcance, entregables, cobertura o aclaraciones de esta linea.",
      unitLabelLabel: "Unidad",
      unitLabelPlaceholder: "servicio",
      quantityLabel: "Cantidad",
      unitPriceLabel: "Precio unitario",
      discountPercentLabel: "Descuento %",
      discountAmountLabel: "Descuento fijo",
      discountTotalLabel: "Descuento",
      taxTotalLabel: "Impuestos",
      discountSyncHint:
        "Puedes editar porcentaje o monto; el sistema conserva el porcentaje como referencia y recalcula el otro valor.",
      lineItemTotalLabel: "Total de la linea",
      defaultServiceUnit: "servicio",
      defaultProductUnit: "unidad",
      grandTotalLabel: "Total calculado",
      subtotalSummaryLabel: "Subtotal",
      lineDiscountSummaryLabel: "Descuentos por linea",
      documentDiscountSummaryLabel: "Descuento global",
      commercialDiscountSummaryLabel: "Descuento comercial",
      discountSummaryLabel: "Descuentos",
      taxableBaseSummaryLabel: "Base imponible",
      totalBeforeDiscountSummaryLabel: "Total antes de descuento",
      taxSummaryLabel: "Impuestos",
      totalPayableSummaryLabel: "Total a pagar",
      notesLabel: "Notas",
      notesPlaceholder:
        "Terminos comerciales, condiciones de entrega o aclaraciones internas.",
      attachmentTitle: "Anexo historico",
      attachmentDescription:
        "Adjunta un solo archivo de soporte por cotizacion para consultar antecedentes sin recargar el documento principal.",
      addAttachmentAction: "Agregar anexo",
      replaceAttachmentAction: "Reemplazar anexo",
      viewAttachmentAction: "Ver anexo",
      removeAttachmentAction: "Quitar anexo",
      attachmentEmpty: "Todavia no hay anexo cargado.",
      attachmentHint:
        "Admite PDF, imagen, Word o Excel. Por ahora solo un anexo por cotizacion.",
      attachmentPendingUpload:
        "Este archivo se cargara cuando guardes la cotizacion.",
      attachmentRemovedHint:
        "El anexo actual se quitara cuando guardes la cotizacion.",
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
        documentDiscountPercent:
          "El descuento global porcentual no puede ser negativo.",
        documentDiscountPercentMax:
          "El descuento global porcentual no puede superar 100%.",
        documentDiscountTotal:
          "El descuento global no puede ser negativo.",
        documentDiscountTotalExceeded:
          "El descuento global no puede superar el subtotal neto despues de los descuentos por linea.",
        lineItemsMin: "Agrega al menos una linea a la cotizacion.",
        itemCodeMax:
          "Mantener el codigo del articulo por debajo de 60 caracteres.",
        lineItemNameMin: "Cada linea necesita un nombre visible.",
        lineItemNameMax:
          "Mantener el nombre de la linea por debajo de 160 caracteres.",
        lineItemDescriptionMax:
          "Mantener la descripcion de la linea por debajo de 2000 caracteres.",
        quantity: "La cantidad debe ser mayor que cero.",
        unitLabelMax: "Mantener la unidad por debajo de 40 caracteres.",
        unitPrice: "El precio unitario no puede ser negativo.",
        discountPercent: "El descuento porcentual no puede ser negativo.",
        discountPercentMax:
          "El descuento porcentual no puede superar 100%.",
        discountTotal: "El descuento no puede ser negativo.",
        discountTotalExceeded:
          "El descuento fijo no puede superar el subtotal de la linea.",
        taxTotal: "Los impuestos no pueden ser negativos.",
        notesMax: "Mantener las notas por debajo de 500 caracteres."
      }
    },
    manage: {
      selectorTitle: "Cotizaciones recientes",
      selectorDescription:
        "Elige una cotizacion para retomar el flujo sin abrir una pantalla demasiado larga."
    },
    list: {
      title: "Listado de cotizaciones",
      description:
        "Consulta cotizaciones recientes, revisa estado y descarga el PDF sin salir del modulo.",
      currentValueLabel: "Valor actual",
      noTenantTitle: "No hay tenant activo para consultar cotizaciones",
      noTenantDescription:
        "Selecciona un tenant activo antes de revisar las cotizaciones.",
      loadingTitle: "Cargando cotizaciones reales",
      loadingDescription:
        "Estamos leyendo las cotizaciones del tenant activo.",
      errorTitle: "No pudimos cargar las cotizaciones",
      errorDescription:
        "La lectura real de quotes fallo por ahora. {message}",
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
      downloadSuccess: "El PDF de la cotizacion se esta descargando.",
      downloadError: "No pudimos generar el PDF. {message}",
      noTenantError: "Necesitas un tenant activo para generar el PDF."
    }
  },
  commercial: {
    summary: {
      title: "Gestion Comercial",
      description:
        "Unifica leads, clientes, cotizaciones y facturas documentales en un solo modulo operativo.",
      pipelineTitle: "Pipeline activo",
      pipelineDescription:
        "Captura, califica, cotiza y factura sin abrir rutas innecesarias.",
      stages: {
        leads: "Leads en captura",
        customers: "Clientes listos",
        quotes: "Cotizaciones abiertas",
        invoices: "Facturas documentales"
      },
      cards: {
        leads: "Captura y prioriza oportunidades nuevas.",
        customers: "Consolida cartera activa y datos listos para operar.",
        quotes: "Emite propuestas por articulos o servicios.",
        invoices: "Convierte cierres en factura documental interna."
      },
      recentTitle: "Actividad reciente",
      recentDescription:
        "Ultimos movimientos utiles para retomar el pipeline comercial.",
      recentEmpty: "Todavia no hay registros recientes en este modulo."
    },
    leads: {
      tableTitle: "Leads recientes",
      tableDescription:
        "Convierte a cliente solo cuando el lead ya este listo para operar.",
      emptyTitle: "Todavia no hay leads capturados",
      emptyDescription:
        "La primera oportunidad comercial aparecera aqui para seguimiento y conversion.",
      noContact: "Sin contacto",
      editAction: "Editar",
      editModalTitle: "Editar lead",
      editModalDescription:
        "Corrige los datos del lead sin salir del listado operativo.",
      editCancelAction: "Cancelar",
      editSaveAction: "Guardar cambios",
      editSubmitting: "Guardando...",
      editSuccess: "Actualizamos el lead {lead}.",
      editError: "No pudimos actualizar el lead. {message}",
      convertAction: "Pasar a cliente",
      convertSubmitting: "Convirtiendo...",
      convertSuccess: "{lead} ya paso a clientes.",
      convertError: "No pudimos convertir el lead. {message}",
      paginationInfo: "Página {current} de {total}"
    },
    customers: {
      pageTitle: "Clientes",
      pageDescription:
        "Consulta la cartera completa, edita fichas operativas y archiva clientes sin salir del listado.",
      tableTitle: "Clientes recientes",
      tableDescription:
        "Mantener cartera limpia acelera cotizaciones, facturas y seguimiento.",
      emptyTitle: "Todavia no hay clientes",
      emptyDescription:
        "Cuando cierres un lead o registres el primer cliente, aparecera aqui.",
      loadingTitle: "Cargando clientes",
      loadingDescription:
        "Estamos leyendo la cartera comercial del tenant activo.",
      errorTitle: "No pudimos cargar la cartera",
      errorDescription: "La lectura de clientes fallo por ahora. {message}",
      emptySearchTitle: "No encontramos clientes con ese filtro",
      emptySearchDescription:
        "Ajusta la busqueda o cambia el filtro para ver mas resultados.",
      searchPlaceholder: "Buscar por nombre, contacto, correo o codigo",
      noContact: "Sin correo ni WhatsApp",
      actionsLabel: "Acciones",
      createAction: "Nuevo cliente",
      viewAction: "Ver ficha",
      editAction: "Editar",
      archiveAction: "Archivar",
      cancelAction: "Cancelar",
      archiveConfirmTitle: "Archivar cliente",
      archiveConfirmDescription:
        "Vas a sacar a {customer} del flujo activo de clientes.",
      archiveConfirmNote:
        "El cliente seguira disponible en archivados para consulta, pero dejara de aparecer en el flujo operativo por defecto.",
      archiveConfirmAction: "Si, archivar cliente",
      archiveSubmitting: "Archivando...",
      archiveSuccess: "{customer} ya salio del flujo activo.",
      archiveError: "No pudimos archivar el cliente. {message}",
      createModalTitle: "Crear cliente",
      createModalDescription:
        "Completa la ficha comercial para dejar el cliente listo para seguimiento y cotizacion.",
      editModalTitle: "Actualizar cliente",
      editModalDescription:
        "Corrige datos, estado u observaciones del cliente sin salir del listado.",
      detailDescription:
        "Consulta la ficha completa del cliente, su saldo abierto y los datos de soporte sin salir de la mesa operativa.",
      detailBalanceTitle: "Saldo de cuenta",
      detailBalanceLoading: "Estamos calculando el saldo del cliente.",
      detailBalanceError: "No pudimos calcular el saldo ahora mismo.",
      detailBalanceEmpty:
        "Todavia no hay facturas documentales ligadas a este cliente.",
      detailBalanceOpenLabel: "Saldo abierto",
      detailBalancePaidLabel: "Pagado",
      detailProfileTitle: "Perfil comercial",
      detailExtraTitle: "Soporte y comentarios",
      detailCommentsEmpty: "Todavia no hay comentarios registrados.",
      detailBooleanYes: "Si",
      detailBooleanNo: "No",
      filters: {
        operational: "Activos e inactivos",
        archived: "Archivados",
        all: "Todos"
      }
    },
    quotes: {
      title: "Cotizaciones",
      pageTitle: "Cotizaciones",
      pageDescription:
        "Consulta todas las cotizaciones, cambia estados operativos y abre el editor sin salir del listado.",
      loadingTitle: "Cargando cotizaciones",
      loadingDescription:
        "Estamos leyendo las cotizaciones del tenant activo para abrir la mesa operativa.",
      errorTitle: "No pudimos cargar las cotizaciones",
      errorDescription:
        "La lectura de cotizaciones fallo por ahora. {message}",
      emptyTitle: "Todavia no hay cotizaciones",
      emptyDescription:
        "Cuando registres la primera propuesta comercial, aparecera aqui con su estado y total.",
      emptySearchTitle: "No encontramos cotizaciones con ese filtro",
      emptySearchDescription:
        "Ajusta la busqueda o cambia el filtro para revisar mas documentos.",
      searchPlaceholder:
        "Buscar por titulo, numero, receptor o contacto",
      recipientLabel: "Receptor",
      validUntilLabel: "Vigencia",
      statusLabel: "Estado",
      totalLabel: "Total",
      actionsLabel: "Acciones",
      createAction: "Nueva cotizacion",
      editAction: "Editar",
      createModalTitle: "Crear cotizacion",
      createModalDescription:
        "Completa el documento sin perder el contexto del listado operativo.",
      editModalTitle: "Actualizar cotizacion",
      editModalDescription:
        "Ajusta receptor, lineas o condiciones comerciales desde el mismo modal.",
      filters: {
        operational: "Abiertas",
        approved: "Aprobadas",
        closed: "Rechazadas y expiradas",
        all: "Todas"
      },
      createInvoiceAction: "Pasar a factura",
      cancellationReasonLabel: "Motivo de cierre"
    },
    invoices: {
      title: "Facturas",
      description:
        "Emite facturas documentales internas desde una cotizacion o desde cero.",
      pageTitle: "Facturas",
      pageDescription:
        "Consulta todas las facturas, cambia estados operativos y crea documentos sin salir del listado.",
      loadingTitle: "Cargando facturas",
      loadingDescription:
        "Estamos leyendo las facturas del tenant activo para abrir la mesa operativa.",
      errorTitle: "No pudimos cargar las facturas",
      errorDescription: "La lectura de facturas fallo por ahora. {message}",
      emptyTitle: "Todavia no hay facturas",
      emptyDescription:
        "Cuando registres la primera factura, aparecera aqui con su estado y total.",
      emptySearchTitle: "No encontramos facturas con ese filtro",
      emptySearchDescription:
        "Ajusta la busqueda o cambia el filtro para revisar mas documentos.",
      searchPlaceholder: "Buscar por titulo, numero o receptor",
      recipientLabel: "Receptor",
      issuedOnColumnLabel: "Emision",
      totalLabel: "Total",
      actionsLabel: "Acciones",
      newAction: "Nueva factura",
      createModalTitle: "Crear factura",
      createModalDescription:
        "Completa el documento sin perder el contexto del listado operativo.",
      cancelAction: "Cancelar",
      filters: {
        operational: "Activas",
        paid: "Pagadas",
        void: "Anuladas",
        all: "Todas"
      },
      formTitle: "Nueva factura",
      formDescription:
        "Completa receptor, detalle y fechas esenciales. Lo demas debe quedar fuera del camino.",
      historyTitle: "Facturas recientes",
      historyDescription:
        "Consulta estado, total y origen documental sin abrir pantallas innecesarias.",
      pipelineTitle: "Pipeline de facturas",
      pipelineDescription:
        "Controla emision, cobro y anulacion desde una sola vista operativa con salida a PDF.",
      historyEmpty: "Todavia no hay facturas creadas en este tenant.",
      sourceQuoteLabel: "Cotizacion origen",
      sourceQuotePlaceholder: "Selecciona una cotizacion aprobada o enviada",
      sourceQuoteEmpty: "Sin cotizaciones disponibles",
      sourceQuoteHint:
        "Si eliges una cotizacion, puedes traer receptor y lineas para no repetir trabajo.",
      importQuoteAction: "Usar datos de la cotizacion",
      recipientTitle: "Receptor",
      documentTitle: "Documento",
      linesTitle: "Detalle facturable",
      lineHint:
        "Cada linea debe dejar claro que se factura y cuanto vale, ya sea articulo o servicio.",
      statusLabel: "Estado",
      issuedOnLabel: "Fecha de emision",
      dueOnLabel: "Fecha limite",
      documentKindLabel: "Tipo de factura",
      documentKinds: {
        items: "Articulos",
        services: "Servicios"
      },
      statuses: {
        draft: "Borrador",
        issued: "Emitida",
        paid: "Pagada",
        void: "Anulada",
        cancelled: "Cancelada"
      },
      voidReasonLabel: "Motivo de anulacion",
      fiscalTitle: "Datos fiscales",
      ncfTypeLabel: "Tipo de NCF",
      ncfTypePlaceholder: "Selecciona el tipo de NCF",
      ncfTypeEmpty: "Sin tipo de NCF",
      ncfLabel: "NCF",
      ncfPlaceholder: "B0100000001",
      ncfHint: "Numero de Comprobante Fiscal (opcional, solo para referencia).",
      validation: {
        ncfMax: "El NCF no puede superar 19 caracteres."
      },
      attachmentTitle: "Anexo",
      attachmentLabel: "Anexo de la factura",
      attachmentHint:
        "Adjunta un documento de soporte historico. Maximo 1 archivo por factura.",
      attachmentUploadAction: "Cargar anexo",
      attachmentReplaceAction: "Reemplazar anexo",
      attachmentRemoveAction: "Quitar anexo",
      attachmentOpenAction: "Abrir anexo",
      attachmentEmpty: "Sin anexo adjunto.",
      attachmentUploadError: "No se pudo cargar el archivo. {message}",
      attachmentDeleteError: "No se pudo eliminar el archivo. {message}",
      createAction: "Guardar factura",
      createSubmitting: "Guardando factura...",
      createSuccess: "Factura creada correctamente como {invoiceNumber}.",
      createError: "No pudimos crear la factura. {message}",
      editDrawerTitle: "Editar {invoiceNumber}",
      editDrawerDescription:
        "Ajusta receptor, lineas o fechas. El numero de factura no cambia.",
      detailDrawerTitle: "Factura {invoiceNumber}",
      detailDrawerDescription:
        "Esta factura ya no puede editarse. Puedes cancelarla si fue un error.",
      readOnlyNotice: "Esta factura esta en estado {status} y no admite edicion directa.",
      saveChangesAction: "Guardar cambios",
      saveChangesSubmitting: "Guardando cambios...",
      saveChangesSuccess: "{invoiceNumber} actualizada correctamente.",
      saveChangesError: "No pudimos guardar los cambios. {message}",
      viewEditAction: "Ver / Editar",
      viewAction: "Ver detalle",
      invoiceNumberLabel: "Numero de factura",
      createdAtLabel: "Creada el",
      cancelInvoiceAction: "Cancelar factura",
      cancelInvoiceModalTitle: "Cancelar factura pagada",
      cancelInvoiceModalDescription:
        "Esta accion es irreversible. Se generara una nota de reverso que anula el efecto contable de esta factura. Describe el motivo con detalle.",
      cancelReasonLabel: "Motivo de cancelacion",
      cancelReasonPlaceholder: "Describe el motivo de la cancelacion...",
      cancelReasonMinError: "El motivo debe tener al menos 10 caracteres.",
      cancelSubmitting: "Cancelando...",
      cancelSuccess: "Factura cancelada. Nota de reverso: {reversalNumber}.",
      cancelError: "No pudimos cancelar la factura. {message}",
      reversalBadge: "Nota de reverso",
      pdf: {
        downloadAction: "Descargar PDF",
        generatingAction: "Generando PDF...",
        downloadSuccess: "PDF de factura listo para descargar.",
        downloadError: "No pudimos generar el PDF. {message}",
        noTenantError: "Necesitas un tenant activo para descargar la factura."
      }
    },
    documents: {
      moveTo: "Mover a {status}",
      moving: "Moviendo...",
      moveSuccess: "{document} ahora esta en {status}.",
      moveError: "No pudimos mover el documento. {message}",
      emptyStatus: "No hay documentos en este estado.",
      reasonModalTitle: "Motivo del cambio de estado",
      reasonModalDescription:
        "Este cambio requiere un motivo documentado. Quedara registrado para trazabilidad y auditoria.",
      reasonLabel: "Motivo",
      reasonPlaceholder: "Describe brevemente el motivo...",
      reasonRequiredError: "El motivo es obligatorio para este cambio de estado.",
      confirmMoveAction: "Confirmar",
      cancelMoveAction: "Cancelar",
      movePipelinePlaceholder: "Mover a..."
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
      title: "Activa tu operacion comercial desde el primer acceso.",
      description:
        "Entra desde movil o desktop con una experiencia clara para CRM, cotizaciones, clientes y control operativo del tenant.",
      cards: {
        rbac: {
          title: "RBAC desde el inicio",
          text:
            "Cada acceso responde al rol y al tenant activo para proteger datos y acciones clave."
        },
        audit: {
          title: "Auditoria obligatoria",
          text:
            "Eventos sensibles, cambios funcionales y auth quedan trazados con actor y contexto."
        }
      },
      operatingTitle: "Listo para operar",
      operating: {
        customers: {
          title: "Clientes y leads con contexto",
          text:
            "Captura rapido, sigue la relacion comercial y entra a la siguiente accion sin ruido."
        },
        documents: {
          title: "Cotizaciones y factura interna",
          text:
            "Documentos claros, compartibles y preparados para avanzar de propuesta a cierre."
        },
        roles: {
          title: "Acceso seguro por tenant",
          text:
            "OperaPyme abre el espacio correcto segun tu sesion, tu pertenencia y tu nivel de permiso."
        }
      }
    },
    capabilities: {
      mobile: {
        title: "Movil primero",
        text:
          "Consulta actividad, entra al CRM y responde rapido desde el telefono sin perder jerarquia."
      },
      desktop: {
        title: "Desktop con contexto",
        text:
          "En pantallas amplias ves onboarding, beneficios y acceso en una sola composicion limpia."
      },
      security: {
        title: "Acceso flexible",
        text:
          "Combina magic link, contraseña y recovery sin multiplicar cuentas ni perder control."
      }
    },
    story: {
      capture: {
        title: "Captura leads y clientes",
        text:
          "Empieza por la oportunidad comercial y conviertela en una cartera accionable."
      },
      quote: {
        title: "Cotiza con ritmo operativo",
        text:
          "Pasa de una necesidad detectada a una propuesta lista para compartir y dar seguimiento."
      },
      access: {
        title: "Controla permisos y trazabilidad",
        text:
          "El tenant, los roles y la auditoria viven en la base del producto, no como capas extras."
      }
    },
    metrics: {
      title: "Vista de activacion",
      crm: {
        value: "CRM",
        label: "Leads, clientes y seguimiento en el mismo flujo"
      },
      quotes: {
        value: "Docs",
        label: "Cotizaciones, proformas y factura interna no fiscal"
      },
      team: {
        value: "RBAC",
        label: "Acceso por tenant con roles y permisos coherentes"
      }
    },
    preview: {
      title: "Asi se siente OperaPyme",
      description:
        "Una entrada de producto que ya anticipa el ritmo real del backoffice.",
      badge: "Mobile y desktop",
      pipelineLabel: "Flujo comercial",
      pipelineTitle: "De lead a documento sin perder contexto",
      pipelineBadge: "Tenant listo",
      accessTitle: "Acceso sin friccion",
      accessText:
        "Entra por correo, contraseña o recovery y sigue al setup inicial o al espacio ya activo."
    },
    landing: {
      navigation: {
        product: "Producto",
        features: "Funciones",
        marketplace: "Marketplace",
        company: "Empresa"
      },
      mobileMenu: {
        open: "Abrir menu principal",
        close: "Cerrar menu principal",
        title: "Menu principal",
        description: "Navegacion principal de OperaPyme"
      },
      header: {
        login: "Iniciar sesion"
      },
      hero: {
        eyebrow: "Gestion operativa real",
        eyebrowLink: "Abrir acceso",
        title: "Una mejor forma de operar ventas, clientes y documentos desde el primer acceso.",
        description:
          "OperaPyme centraliza CRM, cotizaciones, clientes y trabajo operativo con una experiencia clara para movil y desktop.",
        primaryCta: "Entrar ahora",
        secondaryCta: "Ver lo que incluye"
      },
      logoCloud: {
        items: ["Retail", "Servicios", "Distribucion", "Comercial", "Operaciones"]
      },
      primaryFeatures: {
        title: "Activa tu operacion comercial con una base lista para trabajar hoy.",
        description:
          "El acceso no te deja en una pantalla vacia. Entras a una superficie que ya comunica ritmo operativo, seguridad y control por tenant.",
        items: [
          {
            name: "Acceso por enlace o contraseña.",
            description:
              "OperaPyme combina magic link, recovery y password para reducir friccion sin perder control."
          },
          {
            name: "Seguridad por tenant.",
            description:
              "La sesion valida el tenant correcto antes de abrir datos sensibles, acciones o rutas privadas."
          },
          {
            name: "Base operativa trazable.",
            description:
              "RBAC, auditoria y contexto de membresia viven en la base del producto, no como extras."
          }
        ]
      },
      secondaryFeatures: {
        eyebrow: "Operar con contexto",
        title: "Todo lo que el acceso debe dejar claro antes de abrir el backoffice",
        description:
          "El entrypoint ya anticipa seguridad, continuidad de trabajo y el paso natural hacia setup o espacio activo.",
        learnMore: "Ver mas",
        items: [
          {
            name: "Ingreso guiado",
            description:
              "El primer acceso conduce al bootstrap inicial cuando el tenant todavia no existe o no esta listo."
          },
          {
            name: "Recuperacion segura",
            description:
              "El flujo de callback permite redefinir contraseña sin romper la experiencia de acceso por correo."
          },
          {
            name: "Continuidad operativa",
            description:
              "El usuario vuelve al workspace correcto sin friccion innecesaria cuando la sesion ya esta validada."
          }
        ]
      },
      newsletter: {
        title: "Recibe novedades cuando abramos nuevas capacidades",
        description:
          "Seguimos construyendo una plataforma operativa para pymes. Puedes dejar tu correo para recibir avances del producto.",
        emailLabel: "Correo",
        emailPlaceholder: "tu@empresa.com",
        cta: "Avisarme"
      },
      testimonials: {
        eyebrow: "Historias",
        title: "Equipos reales necesitan una entrada clara y confiable",
        featured: {
          body:
            "Pasamos de explicar donde estaba cada flujo a entrar directo a vender, cotizar y seguir clientes con una sola experiencia de acceso.",
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
                  "La entrada se siente como producto real, no como una pantalla temporal de autenticacion.",
                author: {
                  name: "Leslie Alexander",
                  handle: "lesliealexander"
                }
              },
              {
                body:
                  "Pudimos explicar el acceso al equipo sin entrenamiento extra. Todo es mas obvio desde el primer minuto.",
                author: {
                  name: "Michael Foster",
                  handle: "michaelfoster"
                }
              }
            ],
            [
              {
                body:
                  "El recovery ya no rompe la confianza. Se siente conectado con el resto del producto.",
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
                  "La combinacion de acceso, seguridad y contexto comercial deja claro para que sirve OperaPyme.",
                author: {
                  name: "Tom Cook",
                  handle: "tomcook"
                }
              }
            ],
            [
              {
                body:
                  "Ahora el login vende mejor el producto porque ya transmite organizacion y control operativo.",
                author: {
                  name: "Leonard Krasner",
                  handle: "leonardkrasner"
                }
              },
              {
                body:
                  "La transicion entre email, contraseña y callback se siente parte del mismo sistema, no pantallas sueltas.",
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
          solutions: "Soluciones",
          support: "Soporte",
          company: "Empresa",
          legal: "Legal"
        },
        solutions: ["Marketing", "Analitica", "Automatizacion", "Comercio", "Insights"],
        support: ["Enviar ticket", "Documentacion", "Guias"],
        company: ["Acerca de", "Blog", "Empleos", "Prensa"],
        legal: ["Terminos de servicio", "Politica de privacidad", "Licencia"],
        social: {
          facebook: "Facebook",
          instagram: "Instagram",
          x: "X",
          github: "GitHub",
          youtube: "YouTube"
        },
        newsletterTitle: "Suscribete a las novedades del producto",
        newsletterDescription:
          "Noticias, articulos y avances de OperaPyme enviados a tu correo.",
        emailLabel: "Correo",
        emailPlaceholder: "tu@empresa.com",
        subscribe: "Suscribirme",
        copyright: "© 2026 OperaPyme. Todos los derechos reservados."
      }
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
      passwordLabel: "Contraseña",
      passwordPlaceholder: "Ingresa tu contraseña",
      passwordTab: "Contraseña",
      magicLinkTab: "Magic link",
      recoveryTab: "Recuperar",
      passwordSubmit: "Entrar con contraseña",
      submit: "Enviar enlace de acceso",
      submitFirstTime: "Enviar enlace para empezar",
      recoverySubmit: "Enviar enlace de recuperacion",
      submitting: "Enviando acceso...",
      passwordError: "No pudimos iniciar sesion con contraseña. {message}",
      emailSendError: "No pudimos enviar el enlace de acceso. {message}",
      recoveryError: "No pudimos enviar el enlace de recuperacion. {message}",
      emailSentTitle: "Revisa tu correo",
      emailSentText:
        "Enviamos un enlace de acceso a {email}. Si no lo ves, revisa spam o vuelve a intentarlo.",
      recoverySentTitle: "Enlace de recuperacion enviado",
      recoverySentText:
        "Enviamos un enlace para cambiar la contraseña a {email}. Revisa tu correo y vuelve aqui cuando abras el enlace.",
      passwordSuccessTitle: "Acceso validado",
      passwordSuccessText:
        "Estamos terminando de abrir tu sesion para llevarte a tu espacio de trabajo.",
      forgotPassword: "Olvide mi contraseña",
      passwordHelper:
        "Usa tu correo y la contraseña que hayas definido desde tu perfil.",
      magicLinkHelper:
        "Si prefieres no recordar una contraseña, tambien puedes entrar con un enlace de acceso por correo.",
      recoveryHelper:
        "Te enviaremos un enlace seguro para definir una nueva contraseña sin perder tu cuenta actual.",
      firstAccessHelper:
        "El primer ingreso sigue por magic link. Luego podras crear tu contraseña desde el modulo de perfil.",
      noteTitle: "Modo actual de acceso",
      noteText:
        "Usamos acceso por correo para que entres rapido desde cualquier dispositivo.",
      noteTextPassword:
        "Puedes combinar contraseña y magic link sobre la misma cuenta para tener acceso rapido y una via de contingencia.",
      showPassword: "Mostrar contraseña",
      hidePassword: "Ocultar contraseña"
    },
    footer: {
      secure: {
        title: "Arranque seguro",
        text:
          "Tu sesion valida el tenant correcto antes de abrir datos, acciones o modulos sensibles."
      },
      setup: {
        title: "Setup guiado",
        text:
          "Si todavia no existe espacio operativo, el flujo te lleva directo al wizard inicial del tenant."
      },
      privacy: "Politica de privacidad",
      terms: "Terminos y condiciones"
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
      backToAuth: "Solicitar otro enlace",
      recoveryEyebrow: "Recuperacion de acceso",
      recoveryTitle: "Define una nueva contraseña",
      recoveryDescription:
        "Este acceso temporal ya valido tu identidad. Crea una nueva contraseña para volver a entrar con correo y contraseña cuando lo necesites.",
      newPasswordLabel: "Nueva contraseña",
      newPasswordPlaceholder: "Crea una contraseña segura",
      confirmPasswordLabel: "Confirmar contraseña",
      confirmPasswordPlaceholder: "Repite la nueva contraseña",
      passwordRule:
        "Usa al menos 8 caracteres y guarda una combinacion que puedas recordar o custodiar en tu gestor de credenciales.",
      passwordSaving: "Guardando contraseña...",
      passwordSubmit: "Guardar nueva contraseña",
      continueToWorkspace: "Continuar al backoffice",
      passwordTooShort: "La contraseña debe tener al menos 8 caracteres.",
      passwordMismatch: "Las contraseñas no coinciden.",
      passwordSaveError: "No pudimos guardar la nueva contraseña. {message}",
      passwordSavedTitle: "Contraseña actualizada",
      passwordSavedDescription:
        "Ya puedes entrar con correo y contraseña, sin perder magic link como alternativa.",
      ruleMinLength: "Minimo 8 caracteres",
      ruleLowercase: "Letras minusculas",
      ruleUppercase: "Letras mayusculas",
      ruleNumbers: "Numeros"
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
    startTitle: "Empecemos",
    sidebarTagline: "Configura tu negocio en unos pocos pasos y empieza a operar desde el primer minuto.",
    stepsNav: "Pasos del proceso",
    signOut: "Cerrar sesión",
    nameLabel: "Nombre comercial",
    namePlaceholder: "OperaPyme Demo Norte",
    slugLabel: "Slug del tenant",
    slugPlaceholder: "operapyme-demo-norte",
    slugPreviewTitle: "URL operativa",
    slugUnavailable: "Este slug ya está en uso. Elige otro antes de continuar.",
    slugStates: {
      checking: "Validando slug",
      available: "Slug disponible",
      unavailable: "Slug ocupado",
      error: "No pudimos validar"
    },
    progressLabel: "Paso {current} de {total}",
    backAction: "Volver",
    nextAction: "Continuar",
    steps: {
      workspace: {
        title: "Tu negocio",
        description: "Define el nombre y el identificador de tu espacio operativo.",
        helper: "Ingresa el nombre comercial y confirma que el slug esté disponible."
      },
      review: {
        title: "Revisión final",
        description: "Confirma los datos antes de crear el tenant.",
        helper: "Revisa el nombre y el slug una última vez antes de continuar."
      }
    },
    review: {
      businessLabel: "Negocio",
      slugLabel: "Slug",
      pending: "Pendiente",
      checklist: {
        membershipTitle: "Membresía activa",
        membershipText:
          "Tu cuenta quedará vinculada de inmediato al nuevo tenant con acceso listo para operar.",
        modulesTitle: "Módulos base",
        modulesText:
          "Entrarás con acceso inicial a Gestión Comercial, catálogo y configuración del negocio.",
        launchTitle: "Apertura directa",
        launchText:
          "Después del bootstrap te llevaremos al backoffice para continuar con la operación real."
      }
    },
    submit: "Crear tenant y continuar",
    submitting: "Creando tenant...",
    unavailableError: "Supabase no está configurado para este entorno.",
    submitError: "No pudimos crear el tenant inicial. {message}",
    successTitle: "Tenant inicial creado.",
    successDescription:
      "Tu espacio operativo ya está listo para abrir Gestión Comercial, catálogo y configuración."
  },
  accessDenied: {
    eyebrow: "Acceso restringido",
    title: "Esta superficie no está disponible para tu contexto actual.",
    description:
      "La auditoría global y los errores operativos son exclusivos del rol `global_admin` en esta fase.",
    backHome: "Volver al inicio"
  },
  profile: {
    header: {
      eyebrow: "Perfil",
      title: "Cuenta y seguridad de acceso",
      description:
        "Revisa tu identidad activa y define la contraseña de esta cuenta sin salir del backoffice."
    },
    summary: {
      title: "Resumen de cuenta",
      description:
        "Estos datos representan la cuenta autenticada que opera dentro del tenant actual.",
      userLabel: "Usuario",
      emailLabel: "Correo",
      tenantLabel: "Tenant activo",
      roleLabel: "Rol visible"
    },
    security: {
      title: "Contraseña de acceso",
      description:
        "Activa o actualiza el acceso por correo y contraseña. Magic link seguira disponible como alternativa.",
      passwordLabel: "Nueva contraseña",
      passwordPlaceholder: "Crea o actualiza tu contraseña",
      confirmPasswordLabel: "Confirmar contraseña",
      confirmPasswordPlaceholder: "Repite la contraseña",
      helper:
        "Recomendamos una contraseña de al menos 8 caracteres y guardarla en un gestor seguro.",
      submit: "Guardar contraseña",
      submitting: "Guardando contraseña...",
      successTitle: "Contraseña guardada",
      successDescription:
        "Tu cuenta ya puede entrar por correo y contraseña, ademas de magic link.",
      error: "No pudimos guardar la contraseña. {message}",
      mismatch: "Las contraseñas no coinciden.",
      tooShort: "La contraseña debe tener al menos 8 caracteres."
    },
    methods: {
      title: "Metodos disponibles",
      description:
        "OperaPyme mantiene mas de una via de acceso para reducir friccion operativa.",
      magicLinkTitle: "Magic link por correo",
      magicLinkText:
        "Sigue activo para entrar rapido desde cualquier dispositivo sin depender solo de la contraseña.",
      passwordTitle: "Correo + contraseña",
      passwordText:
        "Una vez guardada la contraseña, podras entrar desde `/auth` con este segundo metodo."
    }
  },
  settings: {
    header: {
      eyebrow: "Configuracion operativa",
      title: "Ajustes de empresa",
      description:
        "Gestiona tu perfil, los datos de la empresa, la identidad visual compartida y los accesos del equipo desde una sola superficie protegida por rol y por tenant."
    },
    sections: {
      general: "General",
      tenant: "Empresa",
      appearance: "Apariencia",
      team: "Equipo",
      security: "Seguridad"
    },
    errors: {
      generic: "No pudimos completar la accion."
    },
    status: {
      active: "Activo",
      inactive: "Inactivo",
      invited: "Invitado",
      suspended: "Suspendido"
    },
    roles: {
      global_admin: "Admin global",
      tenant_owner: "Propietario",
      tenant_admin: "Administrador",
      sales_rep: "Ventas",
      finance_operator: "Finanzas",
      viewer: "Consulta",
      tenant_member: "Miembro del tenant"
    },
    states: {
      loadingTitle: "Cargando configuracion",
      loadingDescription:
        "Estamos trayendo el perfil, el tenant activo y la configuracion disponible para esta cuenta.",
      errorTitle: "No pudimos abrir configuracion",
      errorDescription: "Ocurrio un problema al cargar esta vista. {message}",
      retryAction: "Intentar de nuevo",
      noTenantTitle: "Todavia no tienes un tenant activo",
      noTenantDescription:
        "Completa el setup inicial o cambia al tenant correcto para abrir esta configuracion."
    },
    profile: {
      title: "Perfil del usuario",
      description:
        "Revisa la identidad con la que estas operando y actualiza el nombre visible de esta cuenta.",
      emailLabel: "Correo",
      roleLabel: "Rol activo",
      displayNameLabel: "Nombre visible",
      displayNamePlaceholder: "Como quieres aparecer dentro del tenant",
      saveAction: "Guardar nombre",
      saving: "Guardando...",
      openProfileAction: "Abrir perfil y contraseña",
      toastTitle: "Perfil actualizado",
      toastDescription: "Tu nombre visible ya refleja la identidad actual.",
      errorTitle: "No pudimos actualizar tu perfil",
      loadError: "No pudimos cargar tu perfil. {message}"
    },
    preferences: {
      title: "Preferencias personales",
      description:
        "Estas preferencias afectan solo a tu sesion y no cambian la identidad compartida del tenant.",
      themeTitle: "Modo de color",
      themeText:
        "Elige claro, oscuro o sistema para trabajar con la densidad visual que mejor te funcione.",
      currentTenantTitle: "Empresa activa",
      currentTenantText:
        "La configuracion compartida y los permisos de esta vista siempre dependen de la empresa seleccionada."
    },
    company: {
      title: "Datos de empresa",
      description:
        "Administra la identidad base de la empresa activa. Los cambios quedan aislados por tenant y solo pueden editarlos roles con permiso.",
      slugLabel: "Slug",
      statusLabel: "Estado",
      updatedLabel: "Ultima actualizacion",
      nameLabel: "Nombre comercial",
      namePlaceholder: "Nombre visible de la empresa",
      addressLabel: "Direccion comercial",
      addressPlaceholder: "Av. Winston Churchill 95, Santo Domingo, Republica Dominicana",
      bankLabel: "Banco",
      bankPlaceholder: "Banco Popular Dominicano",
      bankAccountLabel: "Cuenta bancaria",
      bankAccountPlaceholder: "001234567890",
      websiteLabel: "Direccion Internet",
      websitePlaceholder: "www.operapyme.com",
      emailLabel: "Correo electronico",
      emailPlaceholder: "hola@operapyme.com",
      phoneLabel: "Telefono principal",
      phonePlaceholder: "+1 809 555 0140",
      secondaryPhoneLabel: "Telefono secundario",
      secondaryPhonePlaceholder: "+1 829 555 0199",
      rncLabel: "RNC",
      rncPlaceholder: "1-31-12345-6",
      cedulaLabel: "Cédula (persona física)",
      cedulaPlaceholder: "001-1234567-8",
      logoLabel: "Logo de la empresa",
      logoHelp:
        "Sube el logo para reutilizarlo en cotizaciones, facturas documentales y futuras descargas PDF.",
      logoHint:
        "Formatos permitidos: PNG, JPG, WEBP o SVG. Peso maximo: 2 MB.",
      logoEmptyTitle: "Todavia no hay logo guardado",
      logoEmptyDescription:
        "Cuando subas el logo de la empresa lo usaremos como cabecera visual en los documentos PDF.",
      logoDropHere: "Suelta el archivo aqui",
      logoUploadAction: "Subir logo",
      logoReplaceAction: "Cambiar logo",
      logoRemoveAction: "Quitar logo",
      logoPreviewAlt: "Logo de {company}",
      logoErrorTitle: "No pudimos usar ese logo",
      logoInvalidType:
        "Sube un archivo PNG, JPG, WEBP o SVG para continuar.",
      logoInvalidSize:
        "El logo supera el limite de 2 MB. Usa una version mas ligera para continuar.",
      editHelp:
        "Solo los roles con `tenant.update` pueden guardar cambios de identidad o branding para esta empresa.",
      readOnlyHelp:
        "Tu rol puede revisar los datos de la empresa activa, pero no editar su identidad ni su branding.",
      saveAction: "Guardar empresa",
      saving: "Guardando empresa...",
      toastTitle: "Empresa actualizada",
      toastDescription:
        "Los datos base de la empresa, su logo y la apariencia compartida ya fueron actualizados.",
      errorTitle: "No pudimos actualizar la empresa",
      validation: {
        nameRequired: "Ingresa el nombre comercial de la empresa.",
        addressRequired: "Ingresa la direccion comercial de la empresa.",
        websiteInvalid:
          "Usa una direccion de Internet valida, por ejemplo operapyme.com o https://operapyme.com.",
        emailInvalid: "Usa un correo electronico valido para la empresa.",
        phoneRequired: "Ingresa el telefono principal de la empresa.",
        phoneInvalid:
          "Usa un telefono valido con numeros y signos habituales como +, espacios o guiones.",
        secondaryPhoneInvalid:
          "Usa un telefono secundario valido con numeros y signos habituales como +, espacios o guiones.",
        rncInvalid:
          "El RNC debe tener 9 digitos, con o sin guiones.",
        cedulaInvalid:
          "La cedula debe tener 11 digitos. Formato valido: 001-1234567-8."
      }
    },
    palette: {
      title: "Paleta visual de la empresa",
      description:
        "Elige una paleta curada o arma una propia para que toda la empresa comparta una identidad consistente en backoffice y superficies futuras, sin mezclarla con otras empresas.",
      sharedBadge: "Una marca, dos apps",
      previewBadge: "Preview en vivo",
      readOnlyBadge: "Solo lectura",
      ruleTitle: "Branding simple, consistente y usable",
      ruleText:
        "Las paletas base ya nacen equilibradas y la paleta propia de la empresa solo pide cuatro colores semilla para mantener contraste, velocidad de configuracion y coherencia operativa.",
      storageTitle: "Persistencia de empresa",
      storageText:
        "La paleta y sus semillas quedan guardadas sobre la empresa activa para que la identidad compartida no dependa del dispositivo actual ni se mezcle con otros tenants.",
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
      reviewLabel: "Revisar contraste",
      toastTitle: "Paleta actualizada",
      toastDescription: "La identidad visual activa ahora usa {palette}.",
      customBadge: "Editable",
      custom: {
        paperLabel: "Base clara",
        primaryLabel: "Color principal",
        secondaryLabel: "Color secundario",
        tertiaryLabel: "Color de apoyo",
        helperTitle: "Como funciona la paleta propia",
        helperText:
          "Estos cuatro colores generan superficies, bordes, fondos y estados para mantener una identidad profesional sin abrir un editor avanzado. La configuracion queda aislada dentro de la empresa activa.",
        reset: "Restaurar base"
      }
    },
    appearance: {
      saveTitle: "Aplicar cambios visuales",
      saveText:
        "Guarda el nombre y la paleta para publicar la identidad compartida de la empresa activa.",
      readOnlyText:
        "Puedes revisar el branding actual, pero tu rol no puede publicar cambios para esta empresa.",
      saveAction: "Guardar apariencia",
      saving: "Guardando apariencia...",
      toastTitle: "Apariencia actualizada",
      toastDescription:
        "La identidad visual compartida de la empresa ya quedo publicada.",
      errorTitle: "No pudimos actualizar la apariencia"
    },
    team: {
      title: "Equipo de la empresa",
      description:
        "Consulta quienes operan dentro de la empresa activa y con que roles entran a la aplicacion.",
      loadingDescription:
        "Estamos cargando las membresias visibles para este tenant.",
      emptyDescription:
        "Todavia no hay mas miembros visibles en este tenant.",
      errorTitle: "No pudimos cargar el equipo",
      errorDescription: "Ocurrio un problema al traer las membresias. {message}",
      lockedTitle: "Tu rol no puede gestionar equipo",
      lockedDescription:
        "Solo los roles con `membership.manage` pueden revisar el directorio completo del tenant."
    },
    security: {
      title: "Eliminacion permanente",
      description:
        "Desde aqui puedes cerrar por completo la empresa activa. Esta accion vive detras de permisos, confirmacion explicita y borrado seguro en backend.",
      delete: {
        eyebrow: "Zona de peligro",
        scopeTitle: "Que hace esta accion",
        scopeText:
          "El tenant activo se elimina de forma permanente junto con sus membresias, clientes, catalogo, cotizaciones, facturas documentales y demas datos tenant-scoped.",
        warningTitle: "No hay papelera ni restauracion automatica",
        warningText:
          "Para evitar errores, te vamos a pedir escribir el slug exacto `{slug}` antes de confirmar.",
        cardTitle: "Eliminar empresa por completo",
        cardDescription:
          "Usa esta accion solo cuando quieras cerrar definitivamente este workspace. Si tu usuario no pertenece a otras empresas activas, tambien intentaremos eliminar su cuenta de acceso.",
        impacts: {
          memberships:
            "Se cierran todos los accesos y membresias asociados a esta empresa.",
          documents:
            "Se eliminan cotizaciones, facturas documentales, leads, clientes y trazas operativas ligadas al tenant.",
          catalog:
            "Se elimina el catalogo comercial y la configuracion visual compartida del tenant.",
          account:
            "Si esta era tu unica empresa activa, la cuenta autenticada tambien se elimina para cerrar el acceso por completo."
        },
        openAction: "Eliminar empresa",
        lockedTitle: "Solo el propietario puede hacer esto",
        lockedDescription:
          "Esta accion exige el permiso `tenant.delete`. Si necesitas continuar, entra con la cuenta propietaria del tenant.",
        dialogTitle: "Confirmar eliminacion permanente",
        dialogDescription:
          "Vas a eliminar definitivamente `{tenant}` y todos sus datos asociados.",
        confirmationTitle: "Confirmacion requerida",
        confirmationText:
          "Escribe el slug `{slug}` para habilitar la eliminacion permanente.",
        confirmationLabel: "Slug del tenant",
        cancelAction: "Cancelar",
        confirmAction: "Eliminar para siempre",
        submitting: "Eliminando empresa...",
        toastAccountDeletedTitle: "Empresa y cuenta eliminadas",
        toastAccountDeletedDescription:
          "`{tenant}` se elimino por completo y tu sesion se cerrara ahora.",
        toastTenantDeletedTitle: "Empresa eliminada",
        toastTenantDeletedDescription:
          "`{tenant}` se elimino por completo. Te llevaremos al siguiente workspace disponible.",
        toastTenantDeletedNoMembershipsDescription:
          "`{tenant}` se elimino por completo. Tu cuenta sigue activa, pero ya no tiene una empresa configurada.",
        errorTitle: "No pudimos eliminar la empresa"
      }
    }
  },
  import: {
    nav: "Importar datos",
    page: {
      eyebrow: "Modulo de importacion",
      title: "Importar datos masivamente",
      description:
        "Sube un archivo CSV o Excel con tus registros existentes y los importamos de forma segura con validacion, mapeo de columnas e historial."
    },
    entityType: {
      label: "Que tipo de datos vas a importar?",
      customer: "Clientes",
      lead: "Leads",
      catalog_item: "Productos y servicios"
    },
    importMode: {
      label: "Que deseas hacer con los datos?",
      create: "Solo crear nuevos registros",
      update: "Solo actualizar registros existentes",
      upsert: "Crear nuevos y actualizar existentes"
    },
    steps: {
      upload: "Subir archivo",
      mapping: "Mapear columnas",
      preview: "Validar y previsualizar",
      processing: "Procesando",
      complete: "Completado"
    },
    upload: {
      title: "Selecciona el archivo",
      description:
        "Acepta archivos CSV y Excel (.xlsx, .xls). Maximo 5 MB. La primera fila debe contener los nombres de columnas.",
      dropzoneLabel: "Arrastra tu archivo aqui o haz clic para seleccionarlo",
      dropzoneActiveLabel: "Suelta el archivo para cargarlo",
      dropzoneHint: "CSV o Excel (.xlsx, .xls), maximo 5 MB",
      changeFile: "Cambiar",
      fileSelected: "{name} — {count} filas detectadas",
      downloadTemplate: "Descargar plantilla de {entity}",
      errors: {
        tooLarge: "El archivo supera el limite de 5 MB.",
        invalidFormat: "Solo se aceptan archivos CSV (.csv) y Excel (.xlsx, .xls).",
        noHeaders: "El archivo no tiene fila de encabezados.",
        noRows: "El archivo esta vacio o solo tiene encabezados.",
        parseError: "No pudimos leer el archivo. Verifica que no este corrupto."
      }
    },
    mapping: {
      title: "Mapea las columnas",
      description:
        "Indica a que campo del sistema corresponde cada columna de tu archivo. Las columnas sin mapear seran ignoradas.",
      fileColumnHeader: "Columna en tu archivo",
      systemFieldHeader: "Campo del sistema",
      skipOption: "Omitir esta columna",
      requiredBadge: "Requerido",
      previewTitle: "Primeras {count} filas con el mapeo actual",
      autoMappedNotice: "Mapeamos automaticamente {count} de {total} columnas. Revisa y ajusta si es necesario."
    },
    preview: {
      title: "Validacion y resumen",
      description:
        "Revisa los resultados de la validacion antes de confirmar la importacion.",
      validRows: "{count} filas validas",
      invalidRows: "{count} filas con errores",
      duplicateRows: "{count} posibles duplicados",
      showAllRows: "Mostrar todas las filas",
      showErrorsOnly: "Mostrar solo filas con errores",
      errorTableRow: "Fila",
      errorTableField: "Campo",
      errorTableError: "Error",
      errorTableValue: "Valor original",
      continueWithErrors: "Continuar y omitir filas con error",
      goBackToFix: "Volver a corregir el archivo",
      noErrors: "Todas las filas son validas. Listo para importar."
    },
    processing: {
      title: "Importando datos...",
      description:
        "No cierres esta ventana mientras la importacion este en progreso. Los datos ya guardados se conservan si detienes el proceso.",
      batchProgress: "Lote {current} de {total}",
      rowProgress: "{processed} de {total} registros procesados",
      continueOnError: "Continuar",
      stopOnError: "Detener importacion",
      batchErrorTitle: "Error en el lote {batch}",
      batchErrorDescription: "Hubo un error al procesar este lote. Puedes continuar con el siguiente o detener la importacion."
    },
    complete: {
      title: "Importacion completada",
      description: "El proceso de importacion finalizo.",
      created: "{count} registros creados",
      updated: "{count} registros actualizados",
      skipped: "{count} registros omitidos",
      errored: "{count} registros con error",
      downloadErrorReport: "Descargar reporte de errores",
      viewImportedRecords: "Ver registros importados",
      importMore: "Importar mas datos"
    },
    history: {
      title: "Historial de importaciones",
      description: "Importaciones realizadas en este tenant.",
      emptyTitle: "Sin importaciones aun",
      emptyDescription: "Las importaciones que realices apareceran aqui con su estado y detalle.",
      entity: {
        customer: "Clientes",
        lead: "Leads",
        catalog_item: "Productos y servicios"
      },
      mode: {
        create: "Solo crear",
        update: "Solo actualizar",
        upsert: "Crear y actualizar"
      },
      status: {
        pending: "Pendiente",
        processing: "En proceso",
        completed: "Completada",
        failed: "Fallida",
        rolled_back: "Revertida"
      },
      rollbackAction: "Revertir importacion",
      rollbackConfirmTitle: "Revertir importacion",
      rollbackConfirmDescription:
        "Se eliminaran los {count} registros que fueron importados en este lote. Esta accion no se puede deshacer. Continuar?",
      rollbackConfirm: "Si, revertir",
      rollbackCancel: "Cancelar",
      rollbackSuccess: "Importacion revertida correctamente.",
      rollbackError: "No pudimos revertir la importacion. {message}",
      rollbackExpired: "El periodo de reversion de 72 horas ya expiro para esta importacion."
    },
    errors: {
      required: "Este campo es requerido.",
      invalidEmail: "El correo no tiene un formato valido.",
      invalidEnum: "Valor no permitido. Opciones validas: {values}.",
      tooLong: "El valor supera los {max} caracteres permitidos.",
      duplicateInFile: "Este codigo aparece mas de una vez en el archivo.",
      duplicateInDb: "Ya existe un registro con este codigo en el sistema."
    }
  }
};

export default backofficeEs;
