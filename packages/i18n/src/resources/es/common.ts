const commonEs = {
  language: {
    label: "Idioma"
  },
  theme: {
    label: "Tema",
    light: "Claro",
    dark: "Oscuro",
    system: "Sistema",
    switchToLight: "Activar tema claro",
    switchToDark: "Activar tema oscuro",
    aaReady: "AA validada",
    palettes: {
      slate: {
        name: "Slate operativo",
        description:
          "Azul pizarra, naranja vibrante y gris azulado para una identidad moderna, clara y con fuerza."
      },
      linen: {
        name: "Lino editorial",
        description:
          "Neutros crema, verde salvia y azul empolvado para una marca elegante y versatil."
      },
      mist: {
        name: "Bruma ejecutiva",
        description:
          "Grises calidos con azul niebla para una presencia sobria, moderna y profesional."
      },
      clay: {
        name: "Arcilla premium",
        description:
          "Terracotas suaves, verdes desaturados y azul limpio para negocios cercanos y confiables."
      },
      dusk: {
        name: "Dusk refinado",
        description:
          "Lavanda gris, teal humo y arena rosada para una identidad contemporanea sin ruido."
      },
      custom: {
        name: "Paleta propia",
        description:
          "Parte de una base profesional y ajusta cuatro colores clave para crear una identidad propia."
      }
    }
  },
  navigation: {
    dashboard: "Inicio",
    commercial: "Gestion Comercial",
    commercialShort: "Comercial",
    commercialSummary: "Resumen",
    commercialLeads: "Leads",
    commercialCustomers: "Clientes",
    commercialQuotes: "Cotizaciones",
    commercialInvoices: "Facturas",
    crm: "CRM",
    catalog: "Catalogo",
    quotes: "Cotizaciones",
    quotesShort: "Cotiz.",
    quotesOverview: "Resumen",
    quotesNew: "Nueva cotizacion",
    quotesManage: "Gestionar cotizaciones",
    learning: "Aprendizaje",
    admin: "Admin",
    profile: "Perfil",
    settings: "Configuracion",
    settingsGeneral: "General",
    settingsTenant: "Tenant",
    settingsAppearance: "Apariencia",
    settingsTeam: "Equipo",
    settingsSecurity: "Seguridad",
    errors: "Errores",
    more: "Mas"
  },
  shell: {
    badge: "Base PWA del backoffice",
    mobileBadge: "Shell operativo",
    productName: "OperaPyme",
    title: "Plataforma comercial operativa",
    description:
      "Mobile-first, clara y lista para operar cotizaciones, gastos, reportes y seguimiento diario en pymes.",
    designTitle: "Direccion de diseno",
    designDescription:
      "Superficies calmadas, degradados suaves, alta legibilidad y una accion fuerte por bloque.",
    workspaceTitle: "Espacio de trabajo del backoffice",
    workspaceDescription:
      "CRM, cotizaciones, gastos y reportes pensados para movil.",
    workspaceTenantDescription: "Operando dentro de {tenant}.",
    tenantLabel: "Negocio activo",
    tenantFallback: "Sin tenant activo",
    tenantSwitcherLabel: "Cambiar negocio",
    tenantOwner: "Propietario",
    quickActionsTitle: "Atajos operativos",
    quickActionLead: "Capturar lead",
    quickActionQuote: "Nueva cotizacion",
    sidebarCoreLabel: "Gestiona tu negocio",
    sidebarPlatformLabel: "Plataforma y soporte",
    foundationBadge: "Audit-ready",
    rbacBadge: "RBAC + RLS base",
    signOut: "Salir",
    signOutSuccess: "Sesion cerrada correctamente.",
    signOutError: "No pudimos cerrar la sesion. {message}",
    globalAdmin: "Administrador global",
    tenantOperator: "Operador del tenant",
    emailFallback: "Sin correo disponible",
    primaryNavigationLabel: "Navegacion principal",
    mobileNavigationLabel: "Navegacion movil",
    mobileMenuLabel: "Abrir menu principal",
    mobileMenuTitle: "Menu principal",
    mobileMenuDescription:
      "Accede a modulos, configuracion y soporte desde este panel movil.",
    closeMenuLabel: "Cerrar menu principal",
    collapseSidebarLabel: "Colapsar menu lateral",
    expandSidebarLabel: "Expandir menu lateral",
    sidebarFooterLegal:
      "© {year} {tenant}. Todos los derechos reservados.",
    sidebarFooterProduct: "OperaPyme backoffice",
    breadcrumbsLabel: "Ruta actual",
    searchLabel: "Buscar en el workspace",
    searchPlaceholder: "Buscar modulo o accion",
    openNotificationsLabel: "Abrir notificaciones",
    profileMenuLabel: "Abrir menu del usuario",
    profileAction: "Abrir perfil",
    pageDescriptions: {
      dashboard: "Resumen operativo, accesos rapidos y actividad reciente.",
      commercial:
        "Pipeline comercial completo: leads, clientes, cotizaciones y facturas.",
      commercialSummary:
        "Pulso general del pipeline comercial y accesos directos para avanzar.",
      commercialLeads:
        "Captura y seguimiento inicial de oportunidades comerciales.",
      commercialCustomers:
        "Clientes listos para seguimiento, cotizacion y facturacion documental.",
      commercialQuotes:
        "Cotizaciones por articulos o servicios con seguimiento y versionado.",
      commercialInvoices:
        "Facturas documentales internas creadas desde cotizaciones o desde cero.",
      crm: "Leads, clientes y seguimiento comercial en una misma vista.",
      catalog: "Productos y servicios listos para cotizar.",
      quotes: "Cotizaciones activas y documentos listos para enviar.",
      quotesNew: "Wizard corto para crear una cotizacion sin perder contexto.",
      quotesManage: "Retoma cotizaciones existentes, ajusta detalles y conserva versionado.",
      learning: "Guias y ayuda rapida para operar con mas claridad.",
      profile: "Cuenta, seguridad de acceso y datos basicos del usuario.",
      settings: "Configuracion transversal del tenant, branding y preferencias.",
      admin: "Auditoria global y controles reservados para perfiles autorizados.",
      errors: "Incidencias operativas y trazabilidad de errores visibles."
    },
    notifications: {
      title: "Notificaciones",
      description: "Recordatorios utiles para operar el backoffice con contexto.",
      newBadge: "Nuevo",
      tenantTitle: "Contexto del tenant",
      tenantDescription:
        "Estas trabajando dentro de {tenant}. Todo lo que guardes en gestion comercial, catalogo y cotizaciones usara este contexto.",
      tenantFallback:
        "Todavia no vemos un tenant activo. Revisa el contexto antes de operar datos comerciales.",
      appearanceTitle: "Apariencia sincronizada",
      appearanceDescription:
        "La paleta activa es {palette} y sigue separada del modo visual del usuario.",
      governanceTitle: "Gobernanza del workspace",
      governanceDescription:
        "Admin y configuracion siguen fuera del flujo comercial principal para evitar mezclar contextos.",
      governanceAdminTitle: "Acceso administrativo visible",
      governanceAdminDescription:
        "Tu perfil puede entrar al area de auditoria global sin mezclarla con la operacion diaria del tenant."
    }
  },
  states: {
    routeNotFoundEyebrow: "Ruta no encontrada",
    routeNotFoundTitle:
      "Esta ruta del espacio de trabajo todavia no esta conectada.",
    routeNotFoundDescription:
      "Sigue construyendo desde el shell del backoffice y conecta los siguientes modulos cuando ya sean funciones reales.",
    loadingModule: "Cargando modulo...",
    loadingWorkspaceTitle: "Preparando tu espacio de trabajo",
    loadingWorkspaceDescription:
      "Estamos validando la sesion, el tenant activo y los permisos antes de abrir el backoffice.",
    loadingSetupTitle: "Preparando tu acceso",
    loadingSetupDescription:
      "Estamos conectando tu sesion y cargando el contexto inicial antes de mostrar el flujo correcto."
  }
};

export default commonEs;
