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
      websitePublishing: "Publicacion del sitio web"
    },
    stats: {
      timeToFirstQuote: {
        label: "Tiempo a primera cotizacion",
        value: "11 min",
        detail: "Meta para tenants guiados por onboarding"
      },
      mobileUsageGoal: {
        label: "Objetivo de uso movil",
        value: "70%",
        detail: "Flujos core optimizados para equipos en campo"
      },
      conversionSurface: {
        label: "Superficie de conversion",
        value: "Catalogo + CRM + Web",
        detail: "Un modelo de datos, multiples puntos de contacto"
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
        "Mantener las cards del CRM ligeras en movil y con suficiente detalle para actuar al instante.",
      originLabel: "Origen",
      techportCompany: "TechPort Systems",
      techportContact: "Maria Gomez",
      techportChannel: "WhatsApp",
      techportStage: "Nuevo",
      motofixCompany: "MotoFix Lab",
      motofixContact: "Luis Herrera",
      motofixChannel: "Sitio web",
      motofixStage: "Calificado",
      atlasCompany: "Atlas Heavy Supply",
      atlasContact: "Carla Nunez",
      atlasChannel: "Recurrente",
      atlasStage: "Cotizado"
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
    list: {
      title: "Lista de cotizaciones de ejemplo",
      description:
        "Primero cards para movil. Las tablas densas pueden llegar despues en desktop.",
      currentValueLabel: "Valor actual",
      quote184Customer: "Apex Machine Works",
      quote184Status: "Pendiente de seguimiento",
      quote185Customer: "MobileCare Express",
      quote185Status: "Aprobada",
      quote186Customer: "Blue Orbit Retail",
      quote186Status: "Borrador"
    }
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
