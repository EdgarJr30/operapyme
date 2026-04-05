import { describe, it, expect } from "vitest";
import {
  validateRows,
  toStagingValidationPayload
} from "../../apps/backoffice-pwa/src/modules/import/lib/validate-rows";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function customerRow(overrides: Record<string, string> = {}): Record<string, string> {
  return { display_name: "Acme Corp", ...overrides };
}

function leadRow(overrides: Record<string, string> = {}): Record<string, string> {
  return { display_name: "Beta Lead", ...overrides };
}

function catalogRow(overrides: Record<string, string> = {}): Record<string, string> {
  return { name: "Mantenimiento mensual", ...overrides };
}

// ─── Required field validation ────────────────────────────────────────────────

describe("validateRows – required field", () => {
  it("marks a customer row invalid when display_name is missing", () => {
    const result = validateRows([{ display_name: "" }], "customer");
    expect(result.invalidCount).toBe(1);
    expect(result.invalidRows[0].errors[0]).toMatchObject({
      field: "display_name",
      code: "required"
    });
  });

  it("marks a lead row invalid when display_name is missing", () => {
    const result = validateRows([{ display_name: "  " }], "lead");
    expect(result.invalidCount).toBe(1);
    expect(result.invalidRows[0].errors[0].code).toBe("required");
  });

  it("marks a catalog_item row invalid when name is missing", () => {
    const result = validateRows([{ name: "" }], "catalog_item");
    expect(result.invalidCount).toBe(1);
    expect(result.invalidRows[0].errors[0]).toMatchObject({ field: "name", code: "required" });
  });

  it("marks a row valid when all required fields are present", () => {
    const result = validateRows([customerRow()], "customer");
    expect(result.validCount).toBe(1);
    expect(result.invalidCount).toBe(0);
  });
});

// ─── Email validation ─────────────────────────────────────────────────────────

describe("validateRows – email field", () => {
  it("accepts a properly formatted email", () => {
    const result = validateRows([customerRow({ email: "user@example.com" })], "customer");
    expect(result.validCount).toBe(1);
  });

  it("rejects a malformed email", () => {
    const result = validateRows([customerRow({ email: "not-an-email" })], "customer");
    expect(result.invalidCount).toBe(1);
    expect(result.invalidRows[0].errors[0]).toMatchObject({
      field: "email",
      code: "invalid_email"
    });
  });

  it("skips email validation when the field is empty (not required)", () => {
    const result = validateRows([customerRow({ email: "" })], "customer");
    expect(result.validCount).toBe(1);
  });
});

// ─── Enum validation ──────────────────────────────────────────────────────────

describe("validateRows – enum field", () => {
  it("accepts a valid customer status", () => {
    const result = validateRows([customerRow({ status: "active" })], "customer");
    expect(result.validCount).toBe(1);
  });

  it("rejects an invalid customer status", () => {
    const result = validateRows([customerRow({ status: "unknown_status" })], "customer");
    expect(result.invalidCount).toBe(1);
    expect(result.invalidRows[0].errors[0]).toMatchObject({
      field: "status",
      code: "invalid_enum"
    });
  });

  it("accepts all valid lead status values", () => {
    const validStatuses = ["new", "qualified", "proposal", "won", "lost", "archived"];
    for (const status of validStatuses) {
      const result = validateRows([leadRow({ status })], "lead");
      expect(result.validCount).toBe(1);
    }
  });

  it("accepts valid catalog_item kind values (product, service)", () => {
    expect(validateRows([catalogRow({ kind: "product" })], "catalog_item").validCount).toBe(1);
    expect(validateRows([catalogRow({ kind: "service" })], "catalog_item").validCount).toBe(1);
  });

  it("rejects invalid catalog_item kind", () => {
    const result = validateRows([catalogRow({ kind: "goods" })], "catalog_item");
    expect(result.invalidCount).toBe(1);
    expect(result.invalidRows[0].errors[0].code).toBe("invalid_enum");
  });

  it("skips enum validation when the field is empty (not required)", () => {
    const result = validateRows([customerRow({ status: "" })], "customer");
    expect(result.validCount).toBe(1);
  });
});

// ─── Max length validation ────────────────────────────────────────────────────

describe("validateRows – maxLength", () => {
  it("rejects a display_name that exceeds 120 characters", () => {
    const longName = "A".repeat(121);
    const result = validateRows([customerRow({ display_name: longName })], "customer");
    expect(result.invalidCount).toBe(1);
    expect(result.invalidRows[0].errors[0]).toMatchObject({
      field: "display_name",
      code: "too_long"
    });
  });

  it("accepts a display_name at exactly the max length (120 chars)", () => {
    const maxName = "B".repeat(120);
    const result = validateRows([customerRow({ display_name: maxName })], "customer");
    expect(result.validCount).toBe(1);
  });

  it("rejects a notes field exceeding 500 characters", () => {
    const longNotes = "X".repeat(501);
    const result = validateRows([customerRow({ notes: longNotes })], "customer");
    expect(result.invalidCount).toBe(1);
    expect(result.invalidRows[0].errors[0].code).toBe("too_long");
  });
});

// ─── Number validation ────────────────────────────────────────────────────────

describe("validateRows – number field (unit_price)", () => {
  it("accepts valid numeric strings", () => {
    expect(validateRows([catalogRow({ unit_price: "1500.00" })], "catalog_item").validCount).toBe(1);
    expect(validateRows([catalogRow({ unit_price: "0" })], "catalog_item").validCount).toBe(1);
    expect(validateRows([catalogRow({ unit_price: "1500,00" })], "catalog_item").validCount).toBe(1);
  });

  it("rejects a non-numeric unit_price", () => {
    const result = validateRows([catalogRow({ unit_price: "mil quinientos" })], "catalog_item");
    expect(result.invalidCount).toBe(1);
    expect(result.invalidRows[0].errors[0]).toMatchObject({
      field: "unit_price",
      code: "invalid_number"
    });
  });

  it("skips number validation when unit_price is empty (not required)", () => {
    const result = validateRows([catalogRow({ unit_price: "" })], "catalog_item");
    expect(result.validCount).toBe(1);
  });
});

// ─── Duplicate code detection (intra-file) ────────────────────────────────────

describe("validateRows – duplicate_in_file", () => {
  it("flags duplicate customer_code in the same file", () => {
    const rows = [
      customerRow({ customer_code: "CLI-001" }),
      customerRow({ customer_code: "CLI-001" })
    ];
    const result = validateRows(rows, "customer");
    expect(result.duplicateInFileCount).toBe(1);
    const dupRow = result.invalidRows[0];
    expect(dupRow.errors[0]).toMatchObject({
      field: "customer_code",
      code: "duplicate_in_file"
    });
  });

  it("marks only the second occurrence as a duplicate (first row is valid)", () => {
    const rows = [
      customerRow({ customer_code: "CLI-001" }),
      customerRow({ customer_code: "CLI-001" })
    ];
    const result = validateRows(rows, "customer");
    // First row should be valid (rowNumber 1)
    expect(result.validRows.some((r) => r.rowNumber === 1)).toBe(true);
    // Second row should be invalid
    expect(result.invalidRows.some((r) => r.rowNumber === 2)).toBe(true);
  });

  it("flags duplicate lead_code for leads", () => {
    const rows = [
      leadRow({ lead_code: "LEAD-001" }),
      leadRow({ lead_code: "LEAD-001" }),
      leadRow({ lead_code: "LEAD-002" })
    ];
    const result = validateRows(rows, "lead");
    expect(result.duplicateInFileCount).toBe(1);
    expect(result.validCount).toBe(2);
  });

  it("flags duplicate item_code for catalog_items", () => {
    const rows = [
      catalogRow({ item_code: "SKU-001" }),
      catalogRow({ item_code: "SKU-001" })
    ];
    const result = validateRows(rows, "catalog_item");
    expect(result.duplicateInFileCount).toBe(1);
  });

  it("does not flag rows without a code value as duplicates", () => {
    const rows = [customerRow(), customerRow()]; // no customer_code
    const result = validateRows(rows, "customer");
    expect(result.duplicateInFileCount).toBe(0);
    expect(result.validCount).toBe(2);
  });
});

// ─── ValidationSummary counts ─────────────────────────────────────────────────

describe("validateRows – summary counters", () => {
  it("returns correct total, validCount, and invalidCount", () => {
    const rows = [
      customerRow(),
      customerRow({ display_name: "" }),
      customerRow({ email: "bad" })
    ];
    const result = validateRows(rows, "customer");
    expect(result.totalRows).toBe(3);
    expect(result.validCount).toBe(1);
    expect(result.invalidCount).toBe(2);
  });

  it("assigns 1-indexed rowNumbers", () => {
    const rows = [customerRow(), customerRow({ display_name: "" })];
    const result = validateRows(rows, "customer");
    expect(result.validRows[0].rowNumber).toBe(1);
    expect(result.invalidRows[0].rowNumber).toBe(2);
  });

  it("sets isValid correctly", () => {
    const rows = [customerRow(), customerRow({ display_name: "" })];
    const result = validateRows(rows, "customer");
    expect(result.validRows[0].isValid).toBe(true);
    expect(result.invalidRows[0].isValid).toBe(false);
  });
});

// ─── toStagingValidationPayload ───────────────────────────────────────────────

describe("toStagingValidationPayload", () => {
  it("maps valid rows to status 'valid' with null errors", () => {
    const { validRows } = validateRows([customerRow()], "customer");
    const payload = toStagingValidationPayload(validRows);
    expect(payload[0]).toMatchObject({ status: "valid", validation_errors: null });
  });

  it("maps invalid rows to status 'invalid' with errors array", () => {
    const { invalidRows } = validateRows([customerRow({ display_name: "" })], "customer");
    const payload = toStagingValidationPayload(invalidRows);
    expect(payload[0].status).toBe("invalid");
    expect(Array.isArray(payload[0].validation_errors)).toBe(true);
    expect(payload[0].validation_errors!.length).toBeGreaterThan(0);
  });

  it("includes row_number in each payload entry", () => {
    const { validRows, invalidRows } = validateRows(
      [customerRow(), customerRow({ display_name: "" })],
      "customer"
    );
    const payload = toStagingValidationPayload([...validRows, ...invalidRows]);
    const rowNumbers = payload.map((p) => p.row_number);
    expect(rowNumbers).toContain(1);
    expect(rowNumbers).toContain(2);
  });
});
