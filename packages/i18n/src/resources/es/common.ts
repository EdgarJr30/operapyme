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
      sage: {
        name: "Sage calmado",
        description:
          "Verdes suaves y balanceados para una experiencia serena y premium."
      },
      lagoon: {
        name: "Laguna fresca",
        description:
          "Azules limpios y acentos frios para una marca mas tecnologica."
      },
      terracotta: {
        name: "Arcilla comercial",
        description:
          "Tonos calidos para negocios de servicio, cercania y conversion."
      },
      graphite: {
        name: "Grafito preciso",
        description:
          "Neutros serios con acentos controlados para marcas sobrias o industriales."
      }
    }
  },
  navigation: {
    dashboard: "Inicio",
    crm: "CRM",
    catalog: "Catalogo",
    quotes: "Cotizaciones",
    quotesShort: "Cotiz.",
    quotesOverview: "Resumen",
    quotesNew: "Nueva cotizacion",
    quotesManage: "Gestionar cotizaciones",
    admin: "Admin",
    settings: "Configuracion",
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
    pageDescriptions: {
      dashboard: "Resumen operativo, accesos rapidos y actividad reciente.",
      crm: "Leads, clientes y seguimiento comercial en una misma vista.",
      catalog: "Productos y servicios listos para cotizar.",
      quotes: "Cotizaciones activas y documentos listos para enviar.",
      quotesNew: "Wizard corto para crear una cotizacion sin perder contexto.",
      quotesManage: "Retoma cotizaciones existentes, ajusta detalles y conserva versionado.",
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
        "Estas trabajando dentro de {tenant}. Todo lo que guardes en CRM, catalogo y cotizaciones usara este contexto.",
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
    loadingModule: "Cargando modulo..."
  }
};

export default commonEs;
