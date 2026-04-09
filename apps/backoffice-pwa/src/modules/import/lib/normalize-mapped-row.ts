import type { ImportEntityType } from "./entity-field-definitions";

function normalizeImportToken(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function normalizeCatalogItemKind(value: string): string {
  const normalizedValue = normalizeImportToken(value);

  if (normalizedValue === "producto" || normalizedValue === "product") {
    return "product";
  }

  if (normalizedValue === "servicio" || normalizedValue === "service") {
    return "service";
  }

  return value.trim();
}

export function normalizeMappedRow(
  entityType: ImportEntityType,
  row: Record<string, string>
): Record<string, string> {
  if (entityType !== "catalog_item") {
    return row;
  }

  return {
    ...row,
    kind: row.kind ? normalizeCatalogItemKind(row.kind) : row.kind
  };
}
