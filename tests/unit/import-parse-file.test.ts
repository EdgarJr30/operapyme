import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ParseFileException,
  parseFile
} from "../../apps/backoffice-pwa/src/modules/import/lib/parse-file";

// ─── SheetJS mock ────────────────────────────────────────────────────────────
// parseFile() does `await import("xlsx")` at runtime. We intercept it so tests
// run without a real binary dependency and without touching the filesystem.

const mockSheetToJson = vi.fn();
const mockRead = vi.fn();

vi.mock("xlsx", () => ({
  read: mockRead,
  utils: {
    sheet_to_json: mockSheetToJson
  }
}));

// ─── Helpers ─────────────────────────────────────────────────────────────────

function makeFile(
  name: string,
  sizeBytes: number,
  content = "",
  bufferFactory?: () => ArrayBuffer
): File {
  const blob = new Blob([content.padEnd(sizeBytes, " ")], { type: "text/plain" });
  const file = new File([blob], name);
  // jsdom does not implement File.arrayBuffer(); provide a minimal stub
  (file as unknown as { arrayBuffer: () => Promise<ArrayBuffer> }).arrayBuffer = () =>
    Promise.resolve(bufferFactory ? bufferFactory() : new ArrayBuffer(sizeBytes));
  return file;
}

function makeWorkbook(rows: string[][]): ReturnType<typeof mockRead> {
  return {
    SheetNames: ["Sheet1"],
    Sheets: { Sheet1: {} }
  };
}

beforeEach(() => {
  vi.clearAllMocks();

  // Default workbook: headers + 1 data row
  mockRead.mockReturnValue(makeWorkbook([["nombre", "email"], ["Acme", "acme@test.com"]]));
  mockSheetToJson.mockReturnValue([["nombre", "email"], ["Acme", "acme@test.com"]]);
});

// ─── Tests ───────────────────────────────────────────────────────────────────

describe("parseFile – format validation", () => {
  it("rejects a file that exceeds 5 MB", async () => {
    const big = makeFile("data.csv", 5 * 1024 * 1024 + 1);
    await expect(parseFile(big)).rejects.toMatchObject({ code: "too_large" });
  });

  it("rejects unsupported extensions", async () => {
    const txt = makeFile("data.txt", 100);
    await expect(parseFile(txt)).rejects.toMatchObject({ code: "invalid_format" });

    const pdf = makeFile("data.pdf", 100);
    await expect(parseFile(pdf)).rejects.toMatchObject({ code: "invalid_format" });
  });

  it("accepts .csv, .xlsx, and .xls extensions", async () => {
    for (const ext of [".csv", ".xlsx", ".xls"]) {
      const file = makeFile(`import${ext}`, 200, "a,b\n1,2");
      await expect(parseFile(file)).resolves.toBeDefined();
    }
  });

  it("decodes CSV text before handing it to SheetJS", async () => {
    const csvContent = "nombre,descripcion\nCafe,Servicio con acentos y ñ";
    const bytes = new TextEncoder().encode(csvContent);
    const file = makeFile("utf8.csv", bytes.byteLength, csvContent, () => bytes.buffer);

    await parseFile(file);

    expect(mockRead).toHaveBeenCalledWith(
      csvContent,
      expect.objectContaining({ type: "string" })
    );
  });

  it("keeps binary parsing for Excel workbooks", async () => {
    const file = makeFile("workbook.xlsx", 200);

    await parseFile(file);

    expect(mockRead).toHaveBeenCalledWith(
      expect.any(ArrayBuffer),
      expect.objectContaining({ type: "array" })
    );
  });
});

describe("parseFile – SheetJS error handling", () => {
  it("throws parse_error when SheetJS cannot read the buffer", async () => {
    mockRead.mockImplementation(() => { throw new Error("Corrupt file"); });
    const file = makeFile("bad.csv", 100, "garbage");
    await expect(parseFile(file)).rejects.toMatchObject({ code: "parse_error" });
  });

  it("throws no_rows when the workbook has no sheets", async () => {
    mockRead.mockReturnValue({ SheetNames: [], Sheets: {} });
    const file = makeFile("empty.csv", 100, "");
    await expect(parseFile(file)).rejects.toMatchObject({ code: "no_rows" });
  });

  it("throws no_headers when the first row is empty", async () => {
    mockSheetToJson.mockReturnValue([["", "  ", ""]]);
    const file = makeFile("noheaders.csv", 100, ",\n");
    await expect(parseFile(file)).rejects.toMatchObject({ code: "no_headers" });
  });

  it("throws no_headers when sheet_to_json returns zero rows", async () => {
    mockSheetToJson.mockReturnValue([]);
    const file = makeFile("empty2.csv", 100, "");
    await expect(parseFile(file)).rejects.toMatchObject({ code: "no_headers" });
  });

  it("throws no_rows when the sheet has only a header row and no data rows", async () => {
    mockSheetToJson.mockReturnValue([["nombre", "email"]]);
    const file = makeFile("headersonly.csv", 100, "nombre,email\n");
    await expect(parseFile(file)).rejects.toMatchObject({ code: "no_rows" });
  });
});

describe("parseFile – successful parse", () => {
  it("returns correct headers, rows, rowCount, and fileName", async () => {
    mockSheetToJson.mockReturnValue([
      ["nombre", "email"],
      ["Acme Corp", "acme@test.com"],
      ["Beta SRL", "beta@test.com"]
    ]);

    const file = makeFile("customers.csv", 200, "");
    const result = await parseFile(file);

    expect(result.fileName).toBe("customers.csv");
    expect(result.headers).toEqual(["nombre", "email"]);
    expect(result.rowCount).toBe(2);
    expect(result.rows).toEqual([
      { nombre: "Acme Corp", email: "acme@test.com" },
      { nombre: "Beta SRL", email: "beta@test.com" }
    ]);
  });

  it("trims whitespace from header names", async () => {
    mockSheetToJson.mockReturnValue([
      ["  nombre  ", " email "],
      ["Acme", "acme@test.com"]
    ]);

    const file = makeFile("spaced.csv", 200, "");
    const result = await parseFile(file);

    expect(result.headers).toEqual(["nombre", "email"]);
  });

  it("ignores null/undefined cell values and defaults to empty string", async () => {
    mockSheetToJson.mockReturnValue([
      ["nombre", "email"],
      ["Acme", null]
    ]);

    const file = makeFile("nulls.csv", 200, "");
    const result = await parseFile(file);

    expect(result.rows[0].email).toBe("");
  });
});

describe("ParseFileException", () => {
  it("sets name and code correctly", () => {
    const err = new ParseFileException("too_large");
    expect(err.name).toBe("ParseFileException");
    expect(err.code).toBe("too_large");
    expect(err instanceof Error).toBe(true);
  });
});
