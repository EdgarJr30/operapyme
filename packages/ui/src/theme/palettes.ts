export type ThemePaletteId = "linen" | "mist" | "clay" | "dusk";

export type ThemePaletteSelectionId = ThemePaletteId | "custom";

export type ThemeAppMode = "backoffice" | "storefront";

export interface ThemePaletteSeedColors {
  paper: string;
  primary: string;
  secondary: string;
  tertiary: string;
}

export interface ThemePaletteColors {
  paper: string;
  sand: string;
  sandStrong: string;
  line: string;
  lineStrong: string;
  ink: string;
  inkSoft: string;
  inkMuted: string;
  primary200: string;
  primary300: string;
  primary400: string;
  secondary200: string;
  secondary300: string;
  secondary400: string;
  tertiary200: string;
  tertiary300: string;
  tertiary400: string;
  highlight200: string;
}

export interface ThemePalette {
  id: ThemePaletteId;
  colors: ThemePaletteColors;
}

export interface CustomThemePalette {
  id: "custom";
  colors: ThemePaletteColors;
  seeds: ThemePaletteSeedColors;
}

export type ThemePaletteDefinition = ThemePalette | CustomThemePalette;

function normalizeHex(hex: string) {
  const value = hex.replace("#", "").trim();

  if (!/^[0-9a-f]{3}$|^[0-9a-f]{6}$/i.test(value)) {
    return null;
  }

  if (value.length === 3) {
    return value
      .split("")
      .map((character) => `${character}${character}`)
      .join("");
  }

  return value.toLowerCase();
}

function ensureHex(hex: string, fallback: string) {
  const normalized = normalizeHex(hex);

  if (!normalized) {
    return fallback;
  }

  return `#${normalized}`;
}

function hexToRgb(hex: string) {
  const value = normalizeHex(hex);

  if (!value) {
    return { red: 0, green: 0, blue: 0 };
  }

  return {
    red: Number.parseInt(value.slice(0, 2), 16),
    green: Number.parseInt(value.slice(2, 4), 16),
    blue: Number.parseInt(value.slice(4, 6), 16)
  };
}

function mixHex(base: string, blend: string, weight = 0.5) {
  const clampedWeight = Math.max(0, Math.min(1, weight));
  const baseRgb = hexToRgb(base);
  const blendRgb = hexToRgb(blend);

  const red = Math.round(baseRgb.red * (1 - clampedWeight) + blendRgb.red * clampedWeight);
  const green = Math.round(
    baseRgb.green * (1 - clampedWeight) + blendRgb.green * clampedWeight
  );
  const blue = Math.round(baseRgb.blue * (1 - clampedWeight) + blendRgb.blue * clampedWeight);

  return `#${[red, green, blue]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

function buildDerivedPaletteColors(seeds: ThemePaletteSeedColors): ThemePaletteColors {
  const paper = ensureHex(seeds.paper, "#fffaf4");
  const primary = ensureHex(seeds.primary, "#7f927a");
  const secondary = ensureHex(seeds.secondary, "#8ea6b8");
  const tertiary = ensureHex(seeds.tertiary, "#c7907d");

  return {
    paper,
    sand: paper,
    sandStrong: paper,
    line: secondary,
    lineStrong: secondary,
    ink: mixHex("#171311", primary, 0.08),
    inkSoft: mixHex("#47403a", primary, 0.12),
    inkMuted: mixHex("#706860", primary, 0.12),
    primary200: primary,
    primary300: primary,
    primary400: primary,
    secondary200: secondary,
    secondary300: secondary,
    secondary400: secondary,
    tertiary200: tertiary,
    tertiary300: tertiary,
    tertiary400: tertiary,
    highlight200: mixHex(primary, tertiary, 0.5)
  };
}

export const defaultThemePaletteId: ThemePaletteSelectionId = "custom";

export const defaultCustomThemePaletteSeeds: ThemePaletteSeedColors = {
  paper: "#f4f7f9",
  primary: "#2d3e50",
  secondary: "#ff7a00",
  tertiary: "#4b637a"
};

export const tenantThemePalettes = [
  {
    id: "linen",
    colors: {
      paper: "#fffaf6",
      sand: "#f6eee8",
      sandStrong: "#eee1d7",
      line: "#d9c9bd",
      lineStrong: "#c7b5a7",
      ink: "#201914",
      inkSoft: "#574b42",
      inkMuted: "#7d6f66",
      primary200: "#d9e4d8",
      primary300: "#c3d4c2",
      primary400: "#9fb59e",
      secondary200: "#dce5ee",
      secondary300: "#c6d5e3",
      secondary400: "#a6bace",
      tertiary200: "#efd8d0",
      tertiary300: "#e3c0b7",
      tertiary400: "#cda091",
      highlight200: "#eadfbf"
    }
  },
  {
    id: "mist",
    colors: {
      paper: "#fcfbf8",
      sand: "#f1f0eb",
      sandStrong: "#e7e4dc",
      line: "#d2d0c6",
      lineStrong: "#bbb8ae",
      ink: "#191b1d",
      inkSoft: "#47505a",
      inkMuted: "#707884",
      primary200: "#d8e0dc",
      primary300: "#becbc5",
      primary400: "#97aaa4",
      secondary200: "#d9e3ec",
      secondary300: "#c4d3df",
      secondary400: "#a3b7c8",
      tertiary200: "#e8ddd2",
      tertiary300: "#d7c6b8",
      tertiary400: "#bda493",
      highlight200: "#e4e4cb"
    }
  },
  {
    id: "clay",
    colors: {
      paper: "#fffbf8",
      sand: "#f7efe8",
      sandStrong: "#efdfd4",
      line: "#dbc9bc",
      lineStrong: "#c9b3a3",
      ink: "#241813",
      inkSoft: "#5f4740",
      inkMuted: "#866b63",
      primary200: "#efd9d2",
      primary300: "#e2c0b4",
      primary400: "#c99b8d",
      secondary200: "#dbe5dc",
      secondary300: "#c4d4c3",
      secondary400: "#9fb39f",
      tertiary200: "#e0e5f1",
      tertiary300: "#c6d1e6",
      tertiary400: "#9fb0d0",
      highlight200: "#efdfbe"
    }
  },
  {
    id: "dusk",
    colors: {
      paper: "#fbfaf8",
      sand: "#f2efec",
      sandStrong: "#e8e1dc",
      line: "#d2cac2",
      lineStrong: "#bcb2a9",
      ink: "#18171b",
      inkSoft: "#494655",
      inkMuted: "#6f6a7c",
      primary200: "#ddd8e7",
      primary300: "#cbc2db",
      primary400: "#aba0c2",
      secondary200: "#d8e3e8",
      secondary300: "#c0d1d7",
      secondary400: "#9fb6be",
      tertiary200: "#eadbd5",
      tertiary300: "#dcc1b6",
      tertiary400: "#c2a08e",
      highlight200: "#e7dfc8"
    }
  }
] as const satisfies readonly ThemePalette[];

export function isThemePaletteId(
  value: string | null | undefined
): value is ThemePaletteId {
  return tenantThemePalettes.some((palette) => palette.id === value);
}

export function isThemePaletteSelectionId(
  value: string | null | undefined
): value is ThemePaletteSelectionId {
  return value === "custom" || isThemePaletteId(value);
}

export function isThemePaletteSeedColors(
  value: unknown
): value is ThemePaletteSeedColors {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;

  return (
    typeof normalizeHex(String(candidate.paper ?? "")) === "string" &&
    typeof normalizeHex(String(candidate.primary ?? "")) === "string" &&
    typeof normalizeHex(String(candidate.secondary ?? "")) === "string" &&
    typeof normalizeHex(String(candidate.tertiary ?? "")) === "string"
  );
}

export function createCustomThemePalette(
  seeds: ThemePaletteSeedColors = defaultCustomThemePaletteSeeds
): CustomThemePalette {
  const normalizedSeeds = {
    paper: ensureHex(seeds.paper, defaultCustomThemePaletteSeeds.paper),
    primary: ensureHex(seeds.primary, defaultCustomThemePaletteSeeds.primary),
    secondary: ensureHex(seeds.secondary, defaultCustomThemePaletteSeeds.secondary),
    tertiary: ensureHex(seeds.tertiary, defaultCustomThemePaletteSeeds.tertiary)
  };

  return {
    id: "custom",
    seeds: normalizedSeeds,
    colors: buildDerivedPaletteColors(normalizedSeeds)
  };
}

export function getThemePalette(paletteId: ThemePaletteId) {
  const palette = tenantThemePalettes.find((item) => item.id === paletteId);

  return palette ?? tenantThemePalettes[0];
}

export function resolveThemePalette(
  paletteId: ThemePaletteSelectionId,
  customPaletteSeeds?: ThemePaletteSeedColors | null
): ThemePaletteDefinition {
  if (paletteId === "custom") {
    return createCustomThemePalette(customPaletteSeeds ?? defaultCustomThemePaletteSeeds);
  }

  return getThemePalette(paletteId);
}
