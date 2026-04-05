import type { ValidatedRow } from "./validate-rows";

interface ErrorReportRow {
  fila: number;
  campo: string;
  error: string;
  valor: string;
}

/**
 * Generates and downloads a CSV error report for rows that failed validation.
 * Uses dynamic import of SheetJS to keep it out of the initial bundle.
 */
export async function downloadErrorReport(
  invalidRows: ValidatedRow[],
  entityType: string
): Promise<void> {
  const XLSX = await import("xlsx");

  const reportRows: ErrorReportRow[] = [];

  for (const row of invalidRows) {
    for (const err of row.errors) {
      reportRows.push({
        fila: row.rowNumber,
        campo: err.field,
        error: err.message,
        valor: err.value
      });
    }
  }

  const headers = ["Fila", "Campo", "Error", "Valor Original"];
  const data = reportRows.map((r) => [r.fila, r.campo, r.error, r.valor]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Errores");

  XLSX.writeFile(wb, `errores_importacion_${entityType}.xlsx`);
}
