export type FieldType = "text" | "email" | "number" | "enum";

export interface EntityFieldDef {
  key: string;
  labelEs: string;
  labelEn: string;
  type: FieldType;
  required: boolean;
  maxLength?: number;
  enumValues?: string[];
  exampleEs?: string;
  exampleEn?: string;
}

export type ImportEntityType = "customer" | "lead" | "catalog_item";

export const customerFields: EntityFieldDef[] = [
  {
    key: "customer_code",
    labelEs: "Codigo interno",
    labelEn: "Internal code",
    type: "text",
    required: false,
    maxLength: 40,
    exampleEs: "CLI-001",
    exampleEn: "CLI-001"
  },
  {
    key: "display_name",
    labelEs: "Nombre visible",
    labelEn: "Display name",
    type: "text",
    required: true,
    maxLength: 120,
    exampleEs: "Northline Industrial",
    exampleEn: "Northline Industrial"
  },
  {
    key: "contact_name",
    labelEs: "Contacto principal",
    labelEn: "Main contact",
    type: "text",
    required: false,
    maxLength: 120,
    exampleEs: "Andrea Castillo",
    exampleEn: "Andrea Castillo"
  },
  {
    key: "email",
    labelEs: "Correo",
    labelEn: "Email",
    type: "email",
    required: false,
    maxLength: 120,
    exampleEs: "andrea@northline.test",
    exampleEn: "andrea@northline.test"
  },
  {
    key: "whatsapp",
    labelEs: "WhatsApp",
    labelEn: "WhatsApp",
    type: "text",
    required: false,
    maxLength: 30,
    exampleEs: "+1 809 555 0186",
    exampleEn: "+1 809 555 0186"
  },
  {
    key: "phone",
    labelEs: "Telefono alterno",
    labelEn: "Alternate phone",
    type: "text",
    required: false,
    maxLength: 30,
    exampleEs: "+1 809 555 0140",
    exampleEn: "+1 809 555 0140"
  },
  {
    key: "document_id",
    labelEs: "Documento o RNC",
    labelEn: "Document or ID",
    type: "text",
    required: false,
    maxLength: 60,
    exampleEs: "101-5555555-1",
    exampleEn: "101-5555555-1"
  },
  {
    key: "status",
    labelEs: "Estado",
    labelEn: "Status",
    type: "enum",
    required: false,
    enumValues: ["active", "inactive", "archived"],
    exampleEs: "active",
    exampleEn: "active"
  },
  {
    key: "source",
    labelEs: "Origen",
    labelEn: "Source",
    type: "text",
    required: false,
    maxLength: 60,
    exampleEs: "referido",
    exampleEn: "referral"
  },
  {
    key: "notes",
    labelEs: "Notas operativas",
    labelEn: "Operational notes",
    type: "text",
    required: false,
    maxLength: 500,
    exampleEs: "Cliente recurrente, descuento del 10%",
    exampleEn: "Recurring client, 10% discount"
  }
];

export const leadFields: EntityFieldDef[] = [
  {
    key: "lead_code",
    labelEs: "Codigo de lead",
    labelEn: "Lead code",
    type: "text",
    required: false,
    maxLength: 40,
    exampleEs: "LEAD-001",
    exampleEn: "LEAD-001"
  },
  {
    key: "display_name",
    labelEs: "Nombre visible",
    labelEn: "Display name",
    type: "text",
    required: true,
    maxLength: 120,
    exampleEs: "Tech Solutions SRL",
    exampleEn: "Tech Solutions LLC"
  },
  {
    key: "contact_name",
    labelEs: "Contacto principal",
    labelEn: "Main contact",
    type: "text",
    required: false,
    maxLength: 120,
    exampleEs: "Carlos Gomez",
    exampleEn: "Carlos Gomez"
  },
  {
    key: "email",
    labelEs: "Correo",
    labelEn: "Email",
    type: "email",
    required: false,
    maxLength: 120,
    exampleEs: "carlos@techsolutions.test",
    exampleEn: "carlos@techsolutions.test"
  },
  {
    key: "whatsapp",
    labelEs: "WhatsApp",
    labelEn: "WhatsApp",
    type: "text",
    required: false,
    maxLength: 30,
    exampleEs: "+1 809 555 0200",
    exampleEn: "+1 809 555 0200"
  },
  {
    key: "phone",
    labelEs: "Telefono alterno",
    labelEn: "Alternate phone",
    type: "text",
    required: false,
    maxLength: 30,
    exampleEs: "+1 809 555 0201",
    exampleEn: "+1 809 555 0201"
  },
  {
    key: "source",
    labelEs: "Origen",
    labelEn: "Source",
    type: "text",
    required: false,
    maxLength: 60,
    exampleEs: "web",
    exampleEn: "web"
  },
  {
    key: "status",
    labelEs: "Estado",
    labelEn: "Status",
    type: "enum",
    required: false,
    enumValues: ["new", "qualified", "proposal", "won", "lost", "archived"],
    exampleEs: "new",
    exampleEn: "new"
  },
  {
    key: "need_summary",
    labelEs: "Resumen de necesidad",
    labelEn: "Need summary",
    type: "text",
    required: false,
    maxLength: 500,
    exampleEs: "Necesita sistema de facturacion",
    exampleEn: "Needs invoicing system"
  },
  {
    key: "notes",
    labelEs: "Notas",
    labelEn: "Notes",
    type: "text",
    required: false,
    maxLength: 500,
    exampleEs: "Contactado por ferias",
    exampleEn: "Contacted at trade fair"
  }
];

export const catalogItemFields: EntityFieldDef[] = [
  {
    key: "item_code",
    labelEs: "Codigo del item",
    labelEn: "Item code",
    type: "text",
    required: false,
    maxLength: 40,
    exampleEs: "PROD-001",
    exampleEn: "PROD-001"
  },
  {
    key: "name",
    labelEs: "Nombre del item",
    labelEn: "Item name",
    type: "text",
    required: true,
    maxLength: 160,
    exampleEs: "Mantenimiento mensual",
    exampleEn: "Monthly maintenance"
  },
  {
    key: "description",
    labelEs: "Descripcion",
    labelEn: "Description",
    type: "text",
    required: false,
    maxLength: 2000,
    exampleEs: "Servicio mensual de mantenimiento preventivo",
    exampleEn: "Monthly preventive maintenance service"
  },
  {
    key: "category",
    labelEs: "Categoria",
    labelEn: "Category",
    type: "text",
    required: false,
    maxLength: 80,
    exampleEs: "Servicios",
    exampleEn: "Services"
  },
  {
    key: "kind",
    labelEs: "Tipo",
    labelEn: "Kind",
    type: "enum",
    required: false,
    enumValues: ["product", "service"],
    exampleEs: "service",
    exampleEn: "service"
  },
  {
    key: "visibility",
    labelEs: "Visibilidad",
    labelEn: "Visibility",
    type: "enum",
    required: false,
    enumValues: ["public", "private"],
    exampleEs: "public",
    exampleEn: "public"
  },
  {
    key: "pricing_mode",
    labelEs: "Modo de precio",
    labelEn: "Pricing mode",
    type: "enum",
    required: false,
    enumValues: ["fixed", "on_request"],
    exampleEs: "fixed",
    exampleEn: "fixed"
  },
  {
    key: "currency_code",
    labelEs: "Moneda",
    labelEn: "Currency",
    type: "text",
    required: false,
    maxLength: 10,
    exampleEs: "DOP",
    exampleEn: "USD"
  },
  {
    key: "unit_price",
    labelEs: "Precio unitario",
    labelEn: "Unit price",
    type: "number",
    required: false,
    exampleEs: "1500.00",
    exampleEn: "150.00"
  },
  {
    key: "status",
    labelEs: "Estado",
    labelEn: "Status",
    type: "enum",
    required: false,
    enumValues: ["active", "draft", "archived"],
    exampleEs: "active",
    exampleEn: "active"
  }
];

export const entityFieldMap: Record<ImportEntityType, EntityFieldDef[]> = {
  customer: customerFields,
  lead: leadFields,
  catalog_item: catalogItemFields
};

export function getEntityFields(entityType: ImportEntityType): EntityFieldDef[] {
  return entityFieldMap[entityType];
}

export function getRequiredFields(entityType: ImportEntityType): EntityFieldDef[] {
  return entityFieldMap[entityType].filter((f) => f.required);
}

/** Canonical code key per entity — used for idempotency checks */
export const entityCodeKey: Record<ImportEntityType, string> = {
  customer: "customer_code",
  lead: "lead_code",
  catalog_item: "item_code"
};
