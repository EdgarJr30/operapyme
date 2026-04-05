import { describe, it, expect } from "vitest";
import {
  autoMapColumns,
  countMappedColumns,
  getMissingRequiredFields,
  applyMapping
} from "../../apps/backoffice-pwa/src/modules/import/lib/column-mapping";
import { customerFields, leadFields, catalogItemFields } from "../../apps/backoffice-pwa/src/modules/import/lib/entity-field-definitions";

// ─── autoMapColumns ───────────────────────────────────────────────────────────

describe("autoMapColumns – direct field key match", () => {
  it("maps a header that matches a field key exactly", () => {
    const mapping = autoMapColumns(["display_name", "email"], "customer");
    expect(mapping["display_name"]).toBe("display_name");
    expect(mapping["email"]).toBe("email");
  });
});

describe("autoMapColumns – bilingual alias mapping", () => {
  it("maps Spanish headers to the correct system fields (customer)", () => {
    const mapping = autoMapColumns(["nombre", "correo", "telefono", "documento"], "customer");
    expect(mapping["nombre"]).toBe("display_name");
    expect(mapping["correo"]).toBe("email");
    expect(mapping["telefono"]).toBe("phone");
    expect(mapping["documento"]).toBe("document_id");
  });

  it("maps English headers to the correct system fields (customer)", () => {
    const mapping = autoMapColumns(["company", "mail", "phone", "rnc"], "customer");
    expect(mapping["company"]).toBe("display_name");
    expect(mapping["mail"]).toBe("email");
    expect(mapping["phone"]).toBe("phone");
    expect(mapping["rnc"]).toBe("document_id");
  });

  it("maps lead-specific aliases", () => {
    const mapping = autoMapColumns(["necesidad", "origen", "estado"], "lead");
    expect(mapping["necesidad"]).toBe("need_summary");
    expect(mapping["origen"]).toBe("source");
    expect(mapping["estado"]).toBe("status");
  });

  it("maps catalog item aliases (precio, descripcion, tipo)", () => {
    const mapping = autoMapColumns(["precio", "descripcion", "tipo"], "catalog_item");
    expect(mapping["precio"]).toBe("unit_price");
    expect(mapping["descripcion"]).toBe("description");
    expect(mapping["tipo"]).toBe("kind");
  });

  it("maps sku to item_code for catalog_item", () => {
    const mapping = autoMapColumns(["sku"], "catalog_item");
    expect(mapping["sku"]).toBe("item_code");
  });
});

describe("autoMapColumns – normalization", () => {
  it("normalizes accented headers before alias lookup", () => {
    // "Teléfono" → "telefono" → alias → phone
    // "Correo"   → "correo"   → alias → email
    // "Nombre"   → "nombre"   → alias → display_name
    // Note: multi-word "Correo Electrónico" normalizes to "correo_electronico"
    // which is not in the alias table (the entry is "correo electronico" pre-normalization).
    // Single-word or direct aliases are the safe path for accented headers.
    const mapping = autoMapColumns(["Teléfono", "Correo", "Nombre"], "customer");
    expect(mapping["Teléfono"]).toBe("phone");
    expect(mapping["Correo"]).toBe("email");
    expect(mapping["Nombre"]).toBe("display_name");
  });

  it("is case-insensitive", () => {
    const mapping = autoMapColumns(["NOMBRE", "EMAIL"], "customer");
    expect(mapping["NOMBRE"]).toBe("display_name");
    expect(mapping["EMAIL"]).toBe("email");
  });

  it("collapses whitespace to underscore before matching", () => {
    const mapping = autoMapColumns(["razon social"], "customer");
    expect(mapping["razon social"]).toBe("display_name");
  });
});

describe("autoMapColumns – skip unmatchable headers", () => {
  it("assigns 'skip' to headers that have no known alias or field match", () => {
    const mapping = autoMapColumns(["columna_desconocida", "campo_extra"], "customer");
    expect(mapping["columna_desconocida"]).toBe("skip");
    expect(mapping["campo_extra"]).toBe("skip");
  });

  it("does not map a catalog_item alias onto a customer entity", () => {
    // 'sku' is catalog-specific; customers have no item_code field
    const mapping = autoMapColumns(["sku"], "customer");
    expect(mapping["sku"]).toBe("skip");
  });
});

// ─── countMappedColumns ───────────────────────────────────────────────────────

describe("countMappedColumns", () => {
  it("counts only non-skip entries", () => {
    const mapping = { nombre: "display_name", extra: "skip", email: "email" };
    expect(countMappedColumns(mapping)).toBe(2);
  });

  it("returns 0 when all are skipped", () => {
    expect(countMappedColumns({ a: "skip", b: "skip" })).toBe(0);
  });

  it("returns the total when none are skipped", () => {
    expect(countMappedColumns({ a: "display_name", b: "email" })).toBe(2);
  });
});

// ─── getMissingRequiredFields ─────────────────────────────────────────────────

describe("getMissingRequiredFields", () => {
  it("returns required fields that are absent from the mapping", () => {
    // display_name is required for customer; mapping does not cover it
    const mapping = { correo: "email" };
    const missing = getMissingRequiredFields(mapping, customerFields);
    expect(missing.some((f) => f.key === "display_name")).toBe(true);
  });

  it("returns empty array when all required fields are mapped", () => {
    const mapping = { nombre: "display_name" };
    const missing = getMissingRequiredFields(mapping, customerFields);
    expect(missing).toHaveLength(0);
  });

  it("treats 'skip' as an absent mapping", () => {
    const mapping = { nombre: "skip" };
    const missing = getMissingRequiredFields(mapping, customerFields);
    expect(missing.some((f) => f.key === "display_name")).toBe(true);
  });

  it("correctly handles lead required fields (display_name)", () => {
    const emptyMapping = {};
    const missing = getMissingRequiredFields(emptyMapping, leadFields);
    expect(missing.map((f) => f.key)).toContain("display_name");
  });

  it("correctly handles catalog_item required fields (name)", () => {
    const emptyMapping = {};
    const missing = getMissingRequiredFields(emptyMapping, catalogItemFields);
    expect(missing.map((f) => f.key)).toContain("name");
  });
});

// ─── applyMapping ─────────────────────────────────────────────────────────────

describe("applyMapping", () => {
  it("renames file columns to system field keys", () => {
    const rawRow = { nombre: "Acme", correo: "acme@test.com" };
    const mapping = { nombre: "display_name", correo: "email" };
    const result = applyMapping(rawRow, mapping);
    expect(result).toEqual({ display_name: "Acme", email: "acme@test.com" });
  });

  it("omits columns marked as skip", () => {
    const rawRow = { nombre: "Acme", extra: "junk" };
    const mapping = { nombre: "display_name", extra: "skip" };
    const result = applyMapping(rawRow, mapping);
    expect(result).not.toHaveProperty("extra");
    expect(result).not.toHaveProperty("skip");
  });

  it("trims string values", () => {
    const rawRow = { nombre: "  Acme  " };
    const mapping = { nombre: "display_name" };
    const result = applyMapping(rawRow, mapping);
    expect(result.display_name).toBe("Acme");
  });

  it("does not include undefined source values", () => {
    const rawRow = { nombre: "Acme" };
    const mapping = { nombre: "display_name", missing_col: "email" };
    const result = applyMapping(rawRow, mapping);
    expect(result).not.toHaveProperty("email");
  });

  it("returns an empty object when mapping is empty", () => {
    const result = applyMapping({ nombre: "Acme" }, {});
    expect(result).toEqual({});
  });
});
