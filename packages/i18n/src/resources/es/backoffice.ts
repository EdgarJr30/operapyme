const backofficeEs = {
  dashboard: {
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
        "Usa esto como patron de referencia para formularios mobile-first: labels arriba, campos compactos y una accion primaria obvia.",
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
      title: "Sistema de productos publicable",
      description:
        "El catalogo debe alimentar la cotizacion interna y el sitio publico sin obligar al tenant a duplicar contenido."
    },
    search: {
      title: "Base de busqueda y filtros",
      description:
        "Este es el primer patron para navegar productos en movil y desktop.",
      placeholder:
        "Buscar por producto, SKU, compatibilidad o categoria"
    },
    visibility: {
      public: "Publico",
      private: "Privado"
    },
    pricing: {
      onRequest: "A solicitud",
      contactSales: "Contactar ventas"
    },
    products: {
      ruggedTabletKitName: "Kit de tablet rugerizada",
      ruggedTabletKitCategory: "Computadoras",
      screenRepairName: "Servicio de reparacion de pantalla",
      screenRepairCategory: "Reparaciones moviles",
      hydraulicFilterSetName: "Set de filtros hidraulicos",
      hydraulicFilterSetCategory: "Maquinaria pesada"
    },
    vertical: {
      title: "Listo para verticales, no hardcodeado",
      description:
        "Soportar multiples tipos de negocio con estructura compartida y un numero pequeno de extensiones puntuales.",
      computersTitle: "Computadoras",
      computersText:
        "Variantes, compatibilidad y cotizacion con awareness de stock en una fase posterior.",
      repairsTitle: "Reparaciones",
      repairsText:
        "Servicios y diagnosticos pueden convivir con productos sin cambiar el core.",
      industrialTitle: "Industrial",
      industrialText:
        "PDFs tecnicos, fichas y precios restringidos importan mas que merchandising llamativo."
    },
    rules: {
      title: "Reglas UX de catalogo",
      description:
        "Estas reglas deben mantenerse tanto en backoffice como en storefront.",
      calmCards:
        "Productos, servicios y repuestos deben compartir un patron de card calmado.",
      obviousVisibility:
        "Las reglas de visibilidad y precio deben entenderse de un vistazo.",
      technicalFiles:
        "Los archivos tecnicos deben sentirse nativos al registro, no pegados al final.",
      searchSpeed:
        "En el MVP la busqueda debe priorizar velocidad sobre complejidad de filtros."
    }
  },
  quotes: {
    header: {
      eyebrow: "Modulo cotizaciones",
      title: "Base del flujo de cotizacion",
      description:
        "Cotizar es el centro comercial del producto. La UX debe sentirse rapida, confiable y auditable."
    },
    flow: {
      title: "Flujo de cotizacion a decision",
      description:
        "La secuencia debe seguir corta, visible y facil de retomar desde el telefono.",
      draftTitle: "Borrador",
      draftText: "Reunir productos, logica de precio, notas y terminos.",
      reviewTitle: "Revision",
      reviewText:
        "Revisar totales, margenes de control y aprobacion gerencial si aplica.",
      sendTitle: "Enviar",
      sendText: "Generar PDF y enlace publico con tracking.",
      decideTitle: "Decidir",
      decideText:
        "Registrar abierta, aceptada, rechazada o pendiente de seguimiento."
    },
    document: {
      title: "Principios de experiencia documental",
      description:
        "La cotizacion debe verse elegante pero operativa. La belleza tiene que apoyar confianza y velocidad.",
      structuredSections:
        "El cotizador debe usar secciones estructuradas, no formularios gigantes.",
      versioning:
        "Versionado, numeracion y visibilidad de aprobaciones son no negociables.",
      publicLinks:
        "Los enlaces publicos y estados de aceptacion deben sentirse simples para el cliente."
    },
    form: {
      createTitle: "Crear cotizacion real",
      createDescription:
        "Esta superficie ya crea borradores reales en `quotes` y refresca el dashboard al guardar.",
      updateTitle: "Actualizar cotizacion existente",
      updateDescription:
        "Edita una cotizacion real del tenant activo sin romper el contexto protegido por RLS.",
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
      needCustomerHint:
        "Necesitas al menos un cliente real antes de emitir una cotizacion operativa.",
      recordLabel: "Cotizacion a actualizar",
      noQuotesOption: "No hay cotizaciones todavia",
      noQuotesHint:
        "Crea una cotizacion real para habilitar el flujo de actualizacion.",
      versionHint: "La siguiente actualizacion incrementara la version desde v{{version}}.",
      customerLabel: "Cliente",
      customerPlaceholder: "Selecciona un cliente",
      quoteNumberLabel: "Numero de cotizacion",
      generatedNumberPlaceholder: "Se asignara automaticamente al guardar",
      generatedNumberHint:
        "La numeracion vive en Supabase y se asigna automaticamente para mantener consistencia y auditoria.",
      titleLabel: "Titulo",
      titlePlaceholder: "Propuesta de equipos y soporte",
      statusLabel: "Estado",
      currencyCodeLabel: "Moneda",
      currencyCodePlaceholder: "USD",
      validUntilLabel: "Valida hasta",
      subtotalLabel: "Subtotal",
      discountTotalLabel: "Descuento",
      taxTotalLabel: "Impuestos",
      grandTotalLabel: "Total calculado",
      notesLabel: "Notas",
      notesPlaceholder:
        "Terminos comerciales, condiciones de entrega o aclaraciones internas.",
      validation: {
        customerRequired: "Selecciona un cliente antes de guardar.",
        titleMin: "Ingresa un titulo para la cotizacion.",
        titleMax: "Mantener el titulo por debajo de 160 caracteres.",
        currencyCode: "Usa un codigo de moneda de 3 letras.",
        subtotal: "El subtotal no puede ser negativo.",
        discountTotal: "El descuento no puede ser negativo.",
        taxTotal: "Los impuestos no pueden ser negativos.",
        notesMax: "Mantener las notas por debajo de 500 caracteres."
      }
    },
    list: {
      title: "Lista de cotizaciones reales",
      description:
        "Lectura real desde `quotes` con cards mobile-first y visibilidad protegida por RLS.",
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
      customerPending: "Cliente pendiente",
      status: {
        draft: "Borrador",
        sent: "Enviada",
        viewed: "Vista",
        approved: "Aprobada",
        rejected: "Rechazada",
        expired: "Expirada"
      }
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
      eyebrow: "Acceso al backoffice",
      title: "Entra con un enlace magico y mantén la operación bajo control.",
      description:
        "La fase 2 ya empieza a operar con autenticación real, bootstrap de tenant y acceso guiado antes de tocar los módulos comerciales.",
      cardRbacTitle: "RBAC desde el inicio",
      cardRbacText:
        "El acceso se decide por roles y permisos del tenant, no por visibilidad en la UI.",
      cardAuditTitle: "Auditoría obligatoria",
      cardAuditText:
        "Toda acción sensible nace con tracking de actor, timestamps y trazabilidad."
    },
    form: {
      title: "Solicita tu acceso",
      emailLabel: "Correo de trabajo",
      emailPlaceholder: "equipo@operapyme.com",
      submit: "Enviar enlace de acceso",
      submitting: "Enviando acceso...",
      emailSentTitle: "Revisa tu correo",
      emailSentText:
        "Enviamos un enlace de acceso a {{email}}. Si no lo ves, revisa spam o vuelve a intentarlo.",
      noteTitle: "Modo actual de acceso",
      noteText:
        "En esta etapa usamos acceso por correo para acelerar activación y evitar credenciales temporales mal gestionadas."
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
