import type { EntityFieldDef, ImportEntityType } from "./entity-field-definitions";
import { entityFieldMap, entityCodeKey } from "./entity-field-definitions";

export interface RowValidationError {
  field: string;
  code:
    | "required"
    | "invalid_email"
    | "invalid_enum"
    | "too_long"
    | "invalid_number"
    | "duplicate_in_file";
  message: string;
  value: string;
}

export interface ValidatedRow {
  rowNumber: number;
  data: Record<string, string>;
  errors: RowValidationError[];
  isValid: boolean;
}

export interface ValidationSummary {
  validRows: ValidatedRow[];
  invalidRows: ValidatedRow[];
  totalRows: number;
  validCount: number;
  invalidCount: number;
  duplicateInFileCount: number;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(
  field: EntityFieldDef,
  value: string
): RowValidationError | null {
  const trimmed = value.trim();

  if (field.required && trimmed === "") {
    return {
      field: field.key,
      code: "required",
      message: `El campo "${field.labelEs}" es requerido.`,
      value
    };
  }

  if (trimmed === "") return null;

  if (field.type === "email" && !EMAIL_RE.test(trimmed)) {
    return {
      field: field.key,
      code: "invalid_email",
      message: `El correo "${trimmed}" no tiene un formato valido.`,
      value
    };
  }

  if (field.type === "enum" && field.enumValues && !field.enumValues.includes(trimmed)) {
    return {
      field: field.key,
      code: "invalid_enum",
      message: `"${trimmed}" no es un valor valido. Opciones: ${field.enumValues.join(", ")}.`,
      value
    };
  }

  if (field.maxLength !== undefined && trimmed.length > field.maxLength) {
    return {
      field: field.key,
      code: "too_long",
      message: `El campo "${field.labelEs}" supera los ${field.maxLength} caracteres permitidos.`,
      value
    };
  }

  if (field.type === "number" && trimmed !== "") {
    const num = Number(trimmed.replace(",", "."));
    if (isNaN(num)) {
      return {
        field: field.key,
        code: "invalid_number",
        message: `"${trimmed}" no es un numero valido para el campo "${field.labelEs}".`,
        value
      };
    }
  }

  return null;
}

/**
 * Validates all mapped rows against entity field definitions.
 *
 * Phase 1 (structural): required, type, length, enum
 * Phase 2 (intra-file): duplicate codes within the uploaded file
 *
 * Returns a summary with valid/invalid rows and counts.
 */
export function validateRows(
  rows: Record<string, string>[],
  entityType: ImportEntityType
): ValidationSummary {
  const fields = entityFieldMap[entityType];
  const codeKey = entityCodeKey[entityType];

  // Phase 2 prep: track codes seen in this file
  const codesSeen = new Map<string, number>(); // code → first row number (1-indexed)

  // First pass: collect codes
  for (let i = 0; i < rows.length; i++) {
    const code = rows[i][codeKey]?.trim();
    if (code) {
      if (!codesSeen.has(code)) {
        codesSeen.set(code, i + 1);
      }
    }
  }

  // Track duplicates: codes that appear more than once
  const codeCounts = new Map<string, number>();
  for (const row of rows) {
    const code = row[codeKey]?.trim();
    if (code) {
      codeCounts.set(code, (codeCounts.get(code) ?? 0) + 1);
    }
  }

  const validRows: ValidatedRow[] = [];
  const invalidRows: ValidatedRow[] = [];
  let duplicateInFileCount = 0;

  for (let i = 0; i < rows.length; i++) {
    const rowNumber = i + 1;
    const rowData = rows[i];
    const errors: RowValidationError[] = [];

    // Phase 1: field-level validation
    for (const field of fields) {
      const value = rowData[field.key] ?? "";
      const error = validateField(field, value);
      if (error) errors.push(error);
    }

    // Phase 2: duplicate code check within file
    const code = rowData[codeKey]?.trim();
    if (code && (codeCounts.get(code) ?? 0) > 1) {
      const firstRow = codesSeen.get(code);
      if (firstRow !== rowNumber) {
        errors.push({
          field: codeKey,
          code: "duplicate_in_file",
          message: `El codigo "${code}" ya aparece en la fila ${firstRow} del mismo archivo.`,
          value: code
        });
        duplicateInFileCount++;
      }
    }

    const validated: ValidatedRow = {
      rowNumber,
      data: rowData,
      errors,
      isValid: errors.length === 0
    };

    if (validated.isValid) {
      validRows.push(validated);
    } else {
      invalidRows.push(validated);
    }
  }

  return {
    validRows,
    invalidRows,
    totalRows: rows.length,
    validCount: validRows.length,
    invalidCount: invalidRows.length,
    duplicateInFileCount
  };
}

/**
 * Converts validation results to the format expected by the
 * update_staging_validation RPC.
 */
export function toStagingValidationPayload(
  results: ValidatedRow[]
): { row_number: number; status: "valid" | "invalid"; validation_errors: RowValidationError[] | null }[] {
  return results.map((r) => ({
    row_number: r.rowNumber,
    status: r.isValid ? "valid" : "invalid",
    validation_errors: r.errors.length > 0 ? r.errors : null
  }));
}
