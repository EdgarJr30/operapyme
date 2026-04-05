import type { EntityFieldDef, ImportEntityType } from "./entity-field-definitions";
import { entityFieldMap } from "./entity-field-definitions";

export type ColumnMapping = Record<string, string | "skip">;

/** Bilingual aliases: normalized file header → system field key */
const FIELD_ALIASES: Record<string, string> = {
  // display_name
  nombre: "display_name",
  name: "display_name",
  empresa: "display_name",
  company: "display_name",
  razon_social: "display_name",
  "razon social": "display_name",
  negocio: "display_name",
  business: "display_name",
  display_name: "display_name",

  // contact_name
  contacto: "contact_name",
  contact: "contact_name",
  contact_name: "contact_name",
  "nombre contacto": "contact_name",
  "contact name": "contact_name",
  responsable: "contact_name",

  // email
  correo: "email",
  email: "email",
  "e-mail": "email",
  mail: "email",
  "correo electronico": "email",
  "electronic mail": "email",

  // whatsapp
  whatsapp: "whatsapp",
  celular: "whatsapp",
  movil: "whatsapp",
  mobile: "whatsapp",
  cell: "whatsapp",

  // phone
  telefono: "phone",
  phone: "phone",
  tel: "phone",
  "telefono alterno": "phone",
  "alternate phone": "phone",
  fijo: "phone",

  // document_id
  documento: "document_id",
  document: "document_id",
  rnc: "document_id",
  cedula: "document_id",
  nit: "document_id",
  rfc: "document_id",
  document_id: "document_id",
  "id fiscal": "document_id",

  // customer_code
  codigo: "customer_code",
  code: "customer_code",
  customer_code: "customer_code",
  "codigo cliente": "customer_code",
  "customer code": "customer_code",
  id: "customer_code",
  ref: "customer_code",
  referencia: "customer_code",

  // lead_code
  lead_code: "lead_code",
  "codigo lead": "lead_code",
  "lead code": "lead_code",

  // item_code / sku
  item_code: "item_code",
  sku: "item_code",
  codigo_producto: "item_code",
  "codigo producto": "item_code",
  "product code": "item_code",
  "item code": "item_code",
  codigo_item: "item_code",

  // status
  estado: "status",
  status: "status",
  estatus: "status",

  // source / origen
  origen: "source",
  source: "source",
  fuente: "source",
  canal: "source",
  channel: "source",

  // notes
  notas: "notes",
  notes: "notes",
  observaciones: "notes",
  comentarios: "notes",
  comments: "notes",
  remarks: "remarks",

  // need_summary
  necesidad: "need_summary",
  need: "need_summary",
  need_summary: "need_summary",
  "resumen necesidad": "need_summary",
  "need summary": "need_summary",
  requerimiento: "need_summary",

  // catalog item fields
  nombre_item: "name",
  "nombre item": "name",
  item: "name",
  producto: "name",
  product: "name",
  servicio: "name",
  service: "name",

  descripcion: "description",
  description: "description",
  detalle: "description",
  detail: "description",

  categoria: "category",
  category: "category",
  tipo_producto: "category",
  "product category": "category",

  tipo: "kind",
  kind: "kind",
  type: "kind",

  visibilidad: "visibility",
  visibility: "visibility",

  precio: "unit_price",
  price: "unit_price",
  unit_price: "unit_price",
  "precio unitario": "unit_price",
  "unit price": "unit_price",
  valor: "unit_price",
  value: "unit_price",
  costo: "unit_price",
  cost: "unit_price",

  moneda: "currency_code",
  currency: "currency_code",
  currency_code: "currency_code",
  divisa: "currency_code",

  modo_precio: "pricing_mode",
  pricing_mode: "pricing_mode",
  "pricing mode": "pricing_mode",
  "modo precio": "pricing_mode"
};

function normalizeHeader(header: string): string {
  return header
    .toLowerCase()
    .trim()
    .replace(/[áàä]/g, "a")
    .replace(/[éèë]/g, "e")
    .replace(/[íìï]/g, "i")
    .replace(/[óòö]/g, "o")
    .replace(/[úùü]/g, "u")
    .replace(/ñ/g, "n")
    .replace(/[^a-z0-9_\s-]/g, "")
    .replace(/\s+/g, "_");
}

/**
 * Attempts to auto-map file column headers to entity field keys.
 * Returns a mapping where each fileColumn → systemFieldKey | 'skip'.
 */
export function autoMapColumns(
  fileHeaders: string[],
  entityType: ImportEntityType
): ColumnMapping {
  const fields = entityFieldMap[entityType];
  const fieldKeys = new Set(fields.map((f) => f.key));
  const mapping: ColumnMapping = {};

  for (const header of fileHeaders) {
    const normalized = normalizeHeader(header);

    // Direct match with a known field key
    if (fieldKeys.has(normalized)) {
      mapping[header] = normalized;
      continue;
    }

    // Alias match
    const aliasMatch = FIELD_ALIASES[normalized];
    if (aliasMatch && fieldKeys.has(aliasMatch)) {
      mapping[header] = aliasMatch;
      continue;
    }

    // Label match: the platform's own template uses labelEs/labelEn as headers,
    // so always auto-map when the normalized header matches a field label exactly.
    let labelMatch: string | undefined;
    for (const field of fields) {
      if (
        normalizeHeader(field.labelEs) === normalized ||
        normalizeHeader(field.labelEn) === normalized
      ) {
        labelMatch = field.key;
        break;
      }
    }
    if (labelMatch) {
      mapping[header] = labelMatch;
      continue;
    }

    // Partial match: check if any field key is contained in the normalized header
    let partialMatch: string | undefined;
    for (const field of fields) {
      if (normalized.includes(field.key) || field.key.includes(normalized)) {
        partialMatch = field.key;
        break;
      }
    }

    mapping[header] = partialMatch ?? "skip";
  }

  return mapping;
}

/**
 * Returns how many file columns were mapped to system fields (not skipped).
 */
export function countMappedColumns(mapping: ColumnMapping): number {
  return Object.values(mapping).filter((v) => v !== "skip").length;
}

/**
 * Returns the list of required fields that are not covered by the mapping.
 */
export function getMissingRequiredFields(
  mapping: ColumnMapping,
  fields: EntityFieldDef[]
): EntityFieldDef[] {
  const mappedTargets = new Set(Object.values(mapping).filter((v) => v !== "skip"));
  return fields.filter((f) => f.required && !mappedTargets.has(f.key));
}

/**
 * Applies a column mapping to a raw row object.
 * Returns a new object with system field keys.
 */
export function applyMapping(
  rawRow: Record<string, string>,
  mapping: ColumnMapping
): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [fileCol, systemField] of Object.entries(mapping)) {
    if (systemField === "skip") continue;
    const value = rawRow[fileCol];
    if (value !== undefined && value !== null) {
      result[systemField] = String(value).trim();
    }
  }

  return result;
}
