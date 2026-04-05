import type { ImportEntityType } from "./entity-field-definitions";
import { entityFieldMap } from "./entity-field-definitions";

/**
 * Generates and downloads a CSV template for the given entity type.
 * Uses dynamic import of SheetJS to keep it out of the initial bundle.
 */
export async function downloadTemplate(entityType: ImportEntityType): Promise<void> {
  const XLSX = await import("xlsx");
  const fields = entityFieldMap[entityType];

  const headers = fields.map((f) => f.labelEs);
  const example1 = fields.map((f) => f.exampleEs ?? "");
  const example2 = fields.map((f) => f.exampleEn ?? "");

  const ws = XLSX.utils.aoa_to_sheet([headers, example1, example2]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Importar");

  const entityLabels: Record<ImportEntityType, string> = {
    customer: "clientes",
    lead: "leads",
    catalog_item: "productos"
  };

  XLSX.writeFile(wb, `plantilla_${entityLabels[entityType]}.xlsx`);
}
