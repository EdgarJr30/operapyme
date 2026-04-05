export interface ParsedFile {
  headers: string[];
  rows: Record<string, string>[];
  rowCount: number;
  fileName: string;
}

export type ParseFileError =
  | "too_large"
  | "invalid_format"
  | "no_headers"
  | "no_rows"
  | "parse_error";

export class ParseFileException extends Error {
  constructor(public readonly code: ParseFileError) {
    super(code);
    this.name = "ParseFileException";
  }
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls"];

function getExtension(fileName: string): string {
  const dot = fileName.lastIndexOf(".");
  return dot === -1 ? "" : fileName.slice(dot).toLowerCase();
}

/**
 * Parses a CSV or XLSX file using SheetJS (loaded dynamically).
 * Returns headers and rows as string records.
 * Throws ParseFileException on structural errors.
 */
export async function parseFile(file: File): Promise<ParsedFile> {
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new ParseFileException("too_large");
  }

  const ext = getExtension(file.name);
  if (!ACCEPTED_EXTENSIONS.includes(ext)) {
    throw new ParseFileException("invalid_format");
  }

  // Dynamic import to keep SheetJS out of the initial bundle
  const XLSX = await import("xlsx");

  const arrayBuffer = await file.arrayBuffer();

  let workbook: ReturnType<typeof XLSX.read>;
  try {
    workbook = XLSX.read(arrayBuffer, {
      type: "array",
      codepage: 65001, // UTF-8
      raw: false,
      dateNF: "yyyy-mm-dd"
    });
  } catch {
    throw new ParseFileException("parse_error");
  }

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new ParseFileException("no_rows");
  }

  const worksheet = workbook.Sheets[firstSheetName];

  // sheet_to_json with header:1 returns rows as arrays; first row = headers
  const rawRows = XLSX.utils.sheet_to_json<string[]>(worksheet, {
    header: 1,
    defval: "",
    blankrows: false
  });

  if (rawRows.length === 0) {
    throw new ParseFileException("no_headers");
  }

  const headerRow = rawRows[0].map((h) => String(h ?? "").trim()).filter(Boolean);

  if (headerRow.length === 0) {
    throw new ParseFileException("no_headers");
  }

  const dataRows = rawRows.slice(1);

  if (dataRows.length === 0) {
    throw new ParseFileException("no_rows");
  }

  const rows: Record<string, string>[] = dataRows.map((rawRow) => {
    const record: Record<string, string> = {};
    for (let i = 0; i < headerRow.length; i++) {
      const key = headerRow[i];
      record[key] = String(rawRow[i] ?? "").trim();
    }
    return record;
  });

  return {
    headers: headerRow,
    rows,
    rowCount: rows.length,
    fileName: file.name
  };
}
