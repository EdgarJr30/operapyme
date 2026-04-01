import type { CSSProperties } from "react";

import { pickBestContrastColor } from "./contrast";
import {
  resolveThemePalette,
  type CustomThemePalette,
  type ThemeAppMode,
  type ThemePaletteDefinition,
  type ThemePaletteSeedColors,
  type ThemePaletteSelectionId
} from "./palettes";

function normalizeHex(hex: string) {
  const value = hex.replace("#", "").trim();

  if (value.length === 3) {
    return value
      .split("")
      .map((character) => `${character}${character}`)
      .join("");
  }

  return value;
}

function hexToRgb(hex: string) {
  const value = normalizeHex(hex);

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

function withAlpha(hex: string, alpha: number) {
  const { red, green, blue } = hexToRgb(hex);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function resolvePaletteDefinition(
  paletteSource: ThemePaletteSelectionId | ThemePaletteDefinition,
  customPaletteSeeds?: ThemePaletteSeedColors | null
) {
  if (typeof paletteSource === "string") {
    return resolveThemePalette(paletteSource, customPaletteSeeds);
  }

  return paletteSource;
}

function isCustomThemePalette(
  palette: ThemePaletteDefinition
): palette is CustomThemePalette {
  return palette.id === "custom";
}

function buildLightAppBackground(palette: ThemePaletteDefinition, appMode: ThemeAppMode) {
  if (isCustomThemePalette(palette)) {
    return palette.colors.paper;
  }

  if (appMode === "storefront") {
    return [
      `linear-gradient(180deg, ${withAlpha(palette.colors.paper, 0.92)}, ${withAlpha(
        palette.colors.paper,
        0.98
      )})`,
      `radial-gradient(circle at top center, ${withAlpha(
        palette.colors.primary300,
        0.42
      )}, transparent 36%)`,
      `radial-gradient(circle at left 18%, ${withAlpha(
        palette.colors.secondary200,
        0.34
      )}, transparent 30%)`,
      `radial-gradient(circle at bottom right, ${withAlpha(
        palette.colors.tertiary300,
        0.38
      )}, transparent 34%)`,
      palette.colors.paper
    ].join(", ");
  }

  return [
    `radial-gradient(circle at top left, ${withAlpha(
      palette.colors.secondary200,
      0.62
    )}, transparent 32%)`,
    `radial-gradient(circle at top right, ${withAlpha(
      palette.colors.primary200,
      0.72
    )}, transparent 28%)`,
    `radial-gradient(circle at bottom left, ${withAlpha(
      palette.colors.tertiary200,
      0.66
    )}, transparent 34%)`,
    palette.colors.sand
  ].join(", ");
}

function buildDarkThemePalette(palette: ThemePaletteDefinition) {
  if (isCustomThemePalette(palette)) {
    const darkPaper = "#121212";
    const darkSand = "#171717";
    const darkSandStrong = "#1f1f1f";
    const darkLine = "#303030";
    const darkLineStrong = "#404040";
    const primaryAccent = mixHex(darkPaper, palette.seeds.primary, 0.7);
    const secondaryAccent = mixHex(darkPaper, palette.seeds.secondary, 0.62);
    const tertiaryAccent = mixHex(darkPaper, palette.seeds.tertiary, 0.64);

    return {
      paper: darkPaper,
      sand: darkSand,
      sandStrong: darkSandStrong,
      line: darkLine,
      lineStrong: darkLineStrong,
      ink: "#f5f2ed",
      inkSoft: "#dbd3ca",
      inkMuted: "#a89d93",
      primary200: mixHex(darkPaper, palette.seeds.primary, 0.18),
      primary300: mixHex(darkPaper, palette.seeds.primary, 0.34),
      primary400: primaryAccent,
      secondary200: mixHex(darkPaper, palette.seeds.secondary, 0.16),
      secondary300: mixHex(darkPaper, palette.seeds.secondary, 0.3),
      secondary400: secondaryAccent,
      tertiary200: mixHex(darkPaper, palette.seeds.tertiary, 0.16),
      tertiary300: mixHex(darkPaper, palette.seeds.tertiary, 0.3),
      tertiary400: tertiaryAccent,
      highlight200: mixHex(primaryAccent, tertiaryAccent, 0.5)
    };
  }

  const darkPaper = mixHex("#1b1815", palette.colors.primary200, 0.08);
  const darkSand = mixHex("#12100e", palette.colors.secondary200, 0.06);
  const darkSandStrong = mixHex("#27221d", palette.colors.primary300, 0.1);
  const darkLine = mixHex("#3c3630", palette.colors.primary400, 0.16);
  const darkLineStrong = mixHex("#524940", palette.colors.primary400, 0.18);

  return {
    paper: darkPaper,
    sand: darkSand,
    sandStrong: darkSandStrong,
    line: darkLine,
    lineStrong: darkLineStrong,
    ink: "#f6f0e8",
    inkSoft: "#ddd4c8",
    inkMuted: "#aa9f93",
    primary200: mixHex("#22362e", palette.colors.primary300, 0.28),
    primary300: mixHex("#355346", palette.colors.primary400, 0.32),
    primary400: mixHex("#8ab9a3", palette.colors.primary400, 0.35),
    secondary200: mixHex("#1c2d3b", palette.colors.secondary300, 0.28),
    secondary300: mixHex("#28475d", palette.colors.secondary400, 0.3),
    secondary400: mixHex("#94bbdb", palette.colors.secondary400, 0.34),
    tertiary200: mixHex("#392820", palette.colors.tertiary300, 0.24),
    tertiary300: mixHex("#51392d", palette.colors.tertiary400, 0.26),
    tertiary400: mixHex("#d7a48a", palette.colors.tertiary400, 0.3),
    highlight200: mixHex("#44371b", palette.colors.highlight200, 0.22)
  };
}

function buildDarkAppBackground(
  palette: ReturnType<typeof buildDarkThemePalette>,
  appMode: ThemeAppMode,
  flatMode = false
) {
  if (flatMode) {
    return palette.sand;
  }

  if (appMode === "storefront") {
    return [
      `linear-gradient(180deg, ${withAlpha(palette.paper, 0.94)}, ${withAlpha(
        palette.paper,
        0.98
      )})`,
      `radial-gradient(circle at top center, ${withAlpha(
        palette.primary300,
        0.3
      )}, transparent 36%)`,
      `radial-gradient(circle at left 18%, ${withAlpha(
        palette.secondary300,
        0.24
      )}, transparent 32%)`,
      `radial-gradient(circle at bottom right, ${withAlpha(
        palette.tertiary300,
        0.24
      )}, transparent 34%)`,
      palette.sand
    ].join(", ");
  }

  return [
    `radial-gradient(circle at top left, ${withAlpha(
      palette.secondary300,
      0.42
    )}, transparent 32%)`,
    `radial-gradient(circle at top right, ${withAlpha(
      palette.primary300,
      0.46
    )}, transparent 28%)`,
    `radial-gradient(circle at bottom left, ${withAlpha(
      palette.tertiary300,
      0.4
    )}, transparent 34%)`,
    palette.sand
  ].join(", ");
}

function buildHeroBackground(
  primary: string,
  secondary: string,
  tertiary: string,
  paper: string,
  appMode: ThemeAppMode,
  darkMode: boolean,
  flatMode = false
) {
  if (flatMode) {
    return `linear-gradient(135deg, ${withAlpha(primary, 0.34)}, ${withAlpha(
      paper,
      0.96
    )} 46%, ${withAlpha(secondary, 0.24)})`;
  }

  if (appMode === "storefront") {
    return `linear-gradient(135deg, ${withAlpha(secondary, darkMode ? 0.44 : 0.86)}, ${withAlpha(
      paper,
      darkMode ? 0.9 : 0.94
    )} 45%, ${withAlpha(tertiary, darkMode ? 0.42 : 0.9)})`;
  }

  return `linear-gradient(135deg, ${withAlpha(primary, darkMode ? 0.42 : 0.82)}, ${withAlpha(
    paper,
    darkMode ? 0.9 : 0.92
  )} 42%, ${withAlpha(secondary, darkMode ? 0.38 : 0.84)})`;
}

function buildSidebarVariables(
  palette: ThemePaletteDefinition,
  darkPalette: ReturnType<typeof buildDarkThemePalette>
) {
  if (isCustomThemePalette(palette)) {
    return {
      "--vf-light-sidebar-surface": palette.seeds.primary,
      "--vf-light-sidebar-elevated": mixHex(palette.seeds.primary, "#ffffff", 0.12),
      "--vf-light-sidebar-border": mixHex(palette.seeds.primary, "#ffffff", 0.2),
      "--vf-light-sidebar-text": pickBestContrastColor(palette.seeds.primary),
      "--vf-light-sidebar-muted": mixHex(pickBestContrastColor(palette.seeds.primary), "#a7b6c6", 0.24),
      "--vf-light-sidebar-accent": mixHex(palette.seeds.secondary, "#ffffff", 0.22),
      "--vf-light-sidebar-accent-hover": mixHex(palette.seeds.secondary, "#ffffff", 0.34),
      "--vf-light-sidebar-accent-contrast": pickBestContrastColor(palette.seeds.secondary),
      "--vf-dark-sidebar-surface": "#151515",
      "--vf-dark-sidebar-elevated": "#1d1d1d",
      "--vf-dark-sidebar-border": "#303030",
      "--vf-dark-sidebar-text": "#f5f2ed",
      "--vf-dark-sidebar-muted": "#b9ada1",
      "--vf-dark-sidebar-accent": darkPalette.primary400,
      "--vf-dark-sidebar-accent-hover": mixHex("#151515", darkPalette.primary400, 0.78),
      "--vf-dark-sidebar-accent-contrast": pickBestContrastColor(darkPalette.primary400)
    } as const;
  }

  const lightSidebarSurface = mixHex("#111217", palette.colors.primary400, 0.26);
  const lightSidebarElevated = mixHex(lightSidebarSurface, "#ffffff", 0.08);
  const lightSidebarAccent = palette.colors.primary400;
  const darkSidebarSurface = mixHex("#0a0d12", darkPalette.primary300, 0.22);
  const darkSidebarElevated = mixHex(darkSidebarSurface, "#ffffff", 0.12);
  const darkSidebarAccent = darkPalette.primary400;

  return {
    "--vf-light-sidebar-surface": lightSidebarSurface,
    "--vf-light-sidebar-elevated": lightSidebarElevated,
    "--vf-light-sidebar-border": mixHex(lightSidebarSurface, "#ffffff", 0.12),
    "--vf-light-sidebar-text": "#f7f3ee",
    "--vf-light-sidebar-muted": mixHex("#d7d0c8", palette.colors.secondary300, 0.2),
    "--vf-light-sidebar-accent": lightSidebarAccent,
    "--vf-light-sidebar-accent-hover": mixHex(lightSidebarAccent, "#ffffff", 0.1),
    "--vf-light-sidebar-accent-contrast": pickBestContrastColor(lightSidebarAccent),
    "--vf-dark-sidebar-surface": darkSidebarSurface,
    "--vf-dark-sidebar-elevated": darkSidebarElevated,
    "--vf-dark-sidebar-border": mixHex(darkSidebarSurface, "#ffffff", 0.1),
    "--vf-dark-sidebar-text": "#f6f1ea",
    "--vf-dark-sidebar-muted": mixHex("#bdb3a6", darkPalette.secondary300, 0.22),
    "--vf-dark-sidebar-accent": darkSidebarAccent,
    "--vf-dark-sidebar-accent-hover": mixHex(darkSidebarAccent, "#ffffff", 0.12),
    "--vf-dark-sidebar-accent-contrast": pickBestContrastColor(darkSidebarAccent)
  } as const;
}

export function buildTenantThemeVariables(
  paletteSource: ThemePaletteSelectionId | ThemePaletteDefinition,
  appMode: ThemeAppMode,
  customPaletteSeeds?: ThemePaletteSeedColors | null
) {
  const palette = resolvePaletteDefinition(paletteSource, customPaletteSeeds);
  const darkPalette = buildDarkThemePalette(palette);
  const sidebarVariables = buildSidebarVariables(palette, darkPalette);
  const lightBrand = isCustomThemePalette(palette)
    ? palette.seeds.secondary
    : palette.colors.primary400;
  const darkBrand = isCustomThemePalette(palette)
    ? darkPalette.secondary400
    : darkPalette.primary400;

  return {
    "--vf-light-paper": palette.colors.paper,
    "--vf-light-sand": palette.colors.sand,
    "--vf-light-sand-strong": palette.colors.sandStrong,
    "--vf-light-line": palette.colors.line,
    "--vf-light-line-strong": palette.colors.lineStrong,
    "--vf-light-ink": palette.colors.ink,
    "--vf-light-ink-soft": palette.colors.inkSoft,
    "--vf-light-ink-muted": palette.colors.inkMuted,
    "--vf-light-primary-200": palette.colors.primary200,
    "--vf-light-primary-300": palette.colors.primary300,
    "--vf-light-primary-400": palette.colors.primary400,
    "--vf-light-secondary-200": palette.colors.secondary200,
    "--vf-light-secondary-300": palette.colors.secondary300,
    "--vf-light-secondary-400": palette.colors.secondary400,
    "--vf-light-tertiary-200": palette.colors.tertiary200,
    "--vf-light-tertiary-300": palette.colors.tertiary300,
    "--vf-light-tertiary-400": palette.colors.tertiary400,
    "--vf-light-highlight-200": palette.colors.highlight200,
    "--vf-light-brand": lightBrand,
    "--vf-light-brand-hover": isCustomThemePalette(palette)
      ? mixHex(lightBrand, palette.colors.ink, 0.14)
      : mixHex(lightBrand, palette.colors.ink, 0.14),
    "--vf-light-brand-soft": isCustomThemePalette(palette)
      ? palette.colors.secondary200
      : palette.colors.primary200,
    "--vf-light-brand-contrast": pickBestContrastColor(lightBrand),
    "--vf-light-app-background": buildLightAppBackground(palette, appMode),
    "--vf-light-hero-background": buildHeroBackground(
      palette.colors.primary200,
      palette.colors.secondary200,
      palette.colors.tertiary200,
      palette.colors.paper,
      appMode,
      false,
      isCustomThemePalette(palette)
    ),
    "--vf-dark-paper": darkPalette.paper,
    "--vf-dark-sand": darkPalette.sand,
    "--vf-dark-sand-strong": darkPalette.sandStrong,
    "--vf-dark-line": darkPalette.line,
    "--vf-dark-line-strong": darkPalette.lineStrong,
    "--vf-dark-ink": darkPalette.ink,
    "--vf-dark-ink-soft": darkPalette.inkSoft,
    "--vf-dark-ink-muted": darkPalette.inkMuted,
    "--vf-dark-primary-200": darkPalette.primary200,
    "--vf-dark-primary-300": darkPalette.primary300,
    "--vf-dark-primary-400": darkPalette.primary400,
    "--vf-dark-secondary-200": darkPalette.secondary200,
    "--vf-dark-secondary-300": darkPalette.secondary300,
    "--vf-dark-secondary-400": darkPalette.secondary400,
    "--vf-dark-tertiary-200": darkPalette.tertiary200,
    "--vf-dark-tertiary-300": darkPalette.tertiary300,
    "--vf-dark-tertiary-400": darkPalette.tertiary400,
    "--vf-dark-highlight-200": darkPalette.highlight200,
    "--vf-dark-brand": darkBrand,
    "--vf-dark-brand-hover": isCustomThemePalette(palette)
      ? mixHex(darkBrand, darkPalette.ink, 0.12)
      : mixHex(darkBrand, darkPalette.ink, 0.12),
    "--vf-dark-brand-soft": isCustomThemePalette(palette)
      ? darkPalette.secondary200
      : darkPalette.primary200,
    "--vf-dark-brand-contrast": pickBestContrastColor(darkBrand),
    "--vf-dark-app-background": buildDarkAppBackground(
      darkPalette,
      appMode,
      isCustomThemePalette(palette)
    ),
    "--vf-dark-hero-background": buildHeroBackground(
      darkPalette.primary300,
      darkPalette.secondary300,
      darkPalette.tertiary300,
      darkPalette.paper,
      appMode,
      true,
      isCustomThemePalette(palette)
    ),
    ...sidebarVariables,
    "--vf-shadow-soft": "0 24px 80px -42px rgba(63, 43, 24, 0.28)",
    "--vf-shadow-panel": "0 18px 45px -34px rgba(43, 24, 7, 0.22)",
    "--vf-shadow-soft-dark": "0 24px 80px -46px rgba(0, 0, 0, 0.72)",
    "--vf-shadow-panel-dark": "0 18px 45px -30px rgba(0, 0, 0, 0.58)"
  } as const;
}

export function applyTenantTheme(
  root: HTMLElement,
  paletteSource: ThemePaletteSelectionId | ThemePaletteDefinition,
  appMode: ThemeAppMode,
  customPaletteSeeds?: ThemePaletteSeedColors | null
) {
  const palette = resolvePaletteDefinition(paletteSource, customPaletteSeeds);
  const variables = buildTenantThemeVariables(palette, appMode);

  Object.entries(variables).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });

  root.dataset.operapymePalette = palette.id;
  root.dataset.operapymeApp = appMode;
}

export function buildThemePreviewStyle(
  paletteSource: ThemePaletteSelectionId | ThemePaletteDefinition,
  appMode: ThemeAppMode,
  darkMode = false,
  customPaletteSeeds?: ThemePaletteSeedColors | null
): CSSProperties {
  const variables = buildTenantThemeVariables(paletteSource, appMode, customPaletteSeeds);

  return {
    background: darkMode
      ? variables["--vf-dark-app-background"]
      : variables["--vf-light-app-background"],
    borderColor: darkMode
      ? variables["--vf-dark-line"]
      : variables["--vf-light-line"],
    color: darkMode ? variables["--vf-dark-ink"] : variables["--vf-light-ink"]
  };
}

export function buildThemeScopeStyle(
  paletteSource: ThemePaletteSelectionId | ThemePaletteDefinition,
  appMode: ThemeAppMode,
  darkMode = false,
  customPaletteSeeds?: ThemePaletteSeedColors | null
): CSSProperties {
  const variables = buildTenantThemeVariables(paletteSource, appMode, customPaletteSeeds);
  const scopeStyle: CSSProperties & Record<string, string> = {
    "--vf-active-paper": darkMode
      ? variables["--vf-dark-paper"]
      : variables["--vf-light-paper"],
    "--vf-active-sand": darkMode
      ? variables["--vf-dark-sand"]
      : variables["--vf-light-sand"],
    "--vf-active-sand-strong": darkMode
      ? variables["--vf-dark-sand-strong"]
      : variables["--vf-light-sand-strong"],
    "--vf-active-line": darkMode
      ? variables["--vf-dark-line"]
      : variables["--vf-light-line"],
    "--vf-active-line-strong": darkMode
      ? variables["--vf-dark-line-strong"]
      : variables["--vf-light-line-strong"],
    "--vf-active-ink": darkMode
      ? variables["--vf-dark-ink"]
      : variables["--vf-light-ink"],
    "--vf-active-ink-soft": darkMode
      ? variables["--vf-dark-ink-soft"]
      : variables["--vf-light-ink-soft"],
    "--vf-active-ink-muted": darkMode
      ? variables["--vf-dark-ink-muted"]
      : variables["--vf-light-ink-muted"],
    "--vf-active-primary-200": darkMode
      ? variables["--vf-dark-primary-200"]
      : variables["--vf-light-primary-200"],
    "--vf-active-primary-300": darkMode
      ? variables["--vf-dark-primary-300"]
      : variables["--vf-light-primary-300"],
    "--vf-active-primary-400": darkMode
      ? variables["--vf-dark-primary-400"]
      : variables["--vf-light-primary-400"],
    "--vf-active-secondary-200": darkMode
      ? variables["--vf-dark-secondary-200"]
      : variables["--vf-light-secondary-200"],
    "--vf-active-secondary-300": darkMode
      ? variables["--vf-dark-secondary-300"]
      : variables["--vf-light-secondary-300"],
    "--vf-active-secondary-400": darkMode
      ? variables["--vf-dark-secondary-400"]
      : variables["--vf-light-secondary-400"],
    "--vf-active-tertiary-200": darkMode
      ? variables["--vf-dark-tertiary-200"]
      : variables["--vf-light-tertiary-200"],
    "--vf-active-tertiary-300": darkMode
      ? variables["--vf-dark-tertiary-300"]
      : variables["--vf-light-tertiary-300"],
    "--vf-active-tertiary-400": darkMode
      ? variables["--vf-dark-tertiary-400"]
      : variables["--vf-light-tertiary-400"],
    "--vf-active-highlight-200": darkMode
      ? variables["--vf-dark-highlight-200"]
      : variables["--vf-light-highlight-200"],
    "--vf-active-brand": darkMode
      ? variables["--vf-dark-brand"]
      : variables["--vf-light-brand"],
    "--vf-active-brand-hover": darkMode
      ? variables["--vf-dark-brand-hover"]
      : variables["--vf-light-brand-hover"],
    "--vf-active-brand-soft": darkMode
      ? variables["--vf-dark-brand-soft"]
      : variables["--vf-light-brand-soft"],
    "--vf-active-brand-contrast": darkMode
      ? variables["--vf-dark-brand-contrast"]
      : variables["--vf-light-brand-contrast"],
    "--vf-active-sidebar-surface": darkMode
      ? variables["--vf-dark-sidebar-surface"]
      : variables["--vf-light-sidebar-surface"],
    "--vf-active-sidebar-elevated": darkMode
      ? variables["--vf-dark-sidebar-elevated"]
      : variables["--vf-light-sidebar-elevated"],
    "--vf-active-sidebar-border": darkMode
      ? variables["--vf-dark-sidebar-border"]
      : variables["--vf-light-sidebar-border"],
    "--vf-active-sidebar-text": darkMode
      ? variables["--vf-dark-sidebar-text"]
      : variables["--vf-light-sidebar-text"],
    "--vf-active-sidebar-muted": darkMode
      ? variables["--vf-dark-sidebar-muted"]
      : variables["--vf-light-sidebar-muted"],
    "--vf-active-sidebar-accent": darkMode
      ? variables["--vf-dark-sidebar-accent"]
      : variables["--vf-light-sidebar-accent"],
    "--vf-active-sidebar-accent-hover": darkMode
      ? variables["--vf-dark-sidebar-accent-hover"]
      : variables["--vf-light-sidebar-accent-hover"],
    "--vf-active-sidebar-accent-contrast": darkMode
      ? variables["--vf-dark-sidebar-accent-contrast"]
      : variables["--vf-light-sidebar-accent-contrast"],
    "--vf-active-app-background": darkMode
      ? variables["--vf-dark-app-background"]
      : variables["--vf-light-app-background"],
    "--vf-active-hero-background": darkMode
      ? variables["--vf-dark-hero-background"]
      : variables["--vf-light-hero-background"],
    "--vf-active-shadow-soft": darkMode
      ? variables["--vf-shadow-soft-dark"]
      : variables["--vf-shadow-soft"],
    "--vf-active-shadow-panel": darkMode
      ? variables["--vf-shadow-panel-dark"]
      : variables["--vf-shadow-panel"],
    background: darkMode
      ? variables["--vf-dark-app-background"]
      : variables["--vf-light-app-background"],
    color: darkMode ? variables["--vf-dark-ink"] : variables["--vf-light-ink"]
  };

  return scopeStyle;
}

export function buildThemeHeroStyle(
  paletteSource: ThemePaletteSelectionId | ThemePaletteDefinition,
  appMode: ThemeAppMode,
  darkMode = false,
  customPaletteSeeds?: ThemePaletteSeedColors | null
): CSSProperties {
  const variables = buildTenantThemeVariables(paletteSource, appMode, customPaletteSeeds);

  return {
    background: darkMode
      ? variables["--vf-dark-hero-background"]
      : variables["--vf-light-hero-background"],
    color: darkMode ? variables["--vf-dark-ink"] : variables["--vf-light-ink"]
  };
}
