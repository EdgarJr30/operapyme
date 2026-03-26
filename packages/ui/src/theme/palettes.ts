export type ThemePaletteId = "sage" | "lagoon" | "terracotta" | "graphite";

export type ThemeAppMode = "backoffice" | "storefront";

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

export const defaultThemePaletteId: ThemePaletteId = "sage";

export const tenantThemePalettes = [
  {
    id: "sage",
    colors: {
      paper: "#fffdf9",
      sand: "#f7f4ef",
      sandStrong: "#f0ebe4",
      line: "#d8d1c8",
      lineStrong: "#c7beb3",
      ink: "#201c17",
      inkSoft: "#554f49",
      inkMuted: "#7c746c",
      primary200: "#cfe3d8",
      primary300: "#b7d4c5",
      primary400: "#99c3b0",
      secondary200: "#d6e4f3",
      secondary300: "#c2d7ec",
      secondary400: "#a9c4e5",
      tertiary200: "#f0d7c7",
      tertiary300: "#e8c5b0",
      tertiary400: "#ddb299",
      highlight200: "#f2e5ba"
    }
  },
  {
    id: "lagoon",
    colors: {
      paper: "#fbfdff",
      sand: "#f0f6fa",
      sandStrong: "#e4edf3",
      line: "#cad7e0",
      lineStrong: "#b8c6d0",
      ink: "#17232b",
      inkSoft: "#465764",
      inkMuted: "#6d7f8c",
      primary200: "#cde7e2",
      primary300: "#add8cf",
      primary400: "#84c2b5",
      secondary200: "#d9e7f7",
      secondary300: "#bfd7f1",
      secondary400: "#97bee6",
      tertiary200: "#f3d8d1",
      tertiary300: "#ebbbb1",
      tertiary400: "#d99b8f",
      highlight200: "#f4e7b9"
    }
  },
  {
    id: "terracotta",
    colors: {
      paper: "#fffaf6",
      sand: "#f8efe8",
      sandStrong: "#efe2d7",
      line: "#d9c9bd",
      lineStrong: "#c7b4a6",
      ink: "#241913",
      inkSoft: "#5d4a41",
      inkMuted: "#847065",
      primary200: "#f0d8ce",
      primary300: "#e6bfb0",
      primary400: "#d59b82",
      secondary200: "#e2ead8",
      secondary300: "#ccdcb9",
      secondary400: "#acc08e",
      tertiary200: "#dbe6f4",
      tertiary300: "#bfd4eb",
      tertiary400: "#97b7dc",
      highlight200: "#f5dfb1"
    }
  },
  {
    id: "graphite",
    colors: {
      paper: "#fcfbfa",
      sand: "#f1eeea",
      sandStrong: "#e6e0d9",
      line: "#cdc5bc",
      lineStrong: "#b8aea2",
      ink: "#1d1a18",
      inkSoft: "#504943",
      inkMuted: "#766d65",
      primary200: "#d7dee3",
      primary300: "#bcc8d1",
      primary400: "#97a9b7",
      secondary200: "#dde8f1",
      secondary300: "#c6d8e6",
      secondary400: "#a8bfd3",
      tertiary200: "#f0dad4",
      tertiary300: "#e2beb4",
      tertiary400: "#ca9a8d",
      highlight200: "#ede1b8"
    }
  }
] as const satisfies readonly ThemePalette[];

export function isThemePaletteId(
  value: string | null | undefined
): value is ThemePaletteId {
  return tenantThemePalettes.some((palette) => palette.id === value);
}

export function getThemePalette(paletteId: ThemePaletteId) {
  const palette = tenantThemePalettes.find((item) => item.id === paletteId);

  return palette ?? tenantThemePalettes[0];
}
