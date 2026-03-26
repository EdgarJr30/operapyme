import type { CSSProperties } from "react";

import { getThemePalette, type ThemeAppMode, type ThemePalette, type ThemePaletteId } from "./palettes";

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

function buildLightAppBackground(palette: ThemePalette, appMode: ThemeAppMode) {
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

function buildDarkThemePalette(palette: ThemePalette) {
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

function buildDarkAppBackground(palette: ReturnType<typeof buildDarkThemePalette>, appMode: ThemeAppMode) {
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
  darkMode: boolean
) {
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

export function buildTenantThemeVariables(
  paletteId: ThemePaletteId,
  appMode: ThemeAppMode
) {
  const palette = getThemePalette(paletteId);
  const darkPalette = buildDarkThemePalette(palette);

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
    "--vf-light-brand": palette.colors.primary400,
    "--vf-light-brand-hover": mixHex(palette.colors.primary400, palette.colors.ink, 0.14),
    "--vf-light-brand-soft": palette.colors.primary200,
    "--vf-light-brand-contrast": palette.colors.ink,
    "--vf-light-app-background": buildLightAppBackground(palette, appMode),
    "--vf-light-hero-background": buildHeroBackground(
      palette.colors.primary200,
      palette.colors.secondary200,
      palette.colors.tertiary200,
      palette.colors.paper,
      appMode,
      false
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
    "--vf-dark-brand": darkPalette.primary400,
    "--vf-dark-brand-hover": mixHex(darkPalette.primary400, darkPalette.ink, 0.12),
    "--vf-dark-brand-soft": darkPalette.primary200,
    "--vf-dark-brand-contrast": darkPalette.ink,
    "--vf-dark-app-background": buildDarkAppBackground(darkPalette, appMode),
    "--vf-dark-hero-background": buildHeroBackground(
      darkPalette.primary300,
      darkPalette.secondary300,
      darkPalette.tertiary300,
      darkPalette.paper,
      appMode,
      true
    ),
    "--vf-shadow-soft": "0 24px 80px -42px rgba(63, 43, 24, 0.28)",
    "--vf-shadow-panel": "0 18px 45px -34px rgba(43, 24, 7, 0.22)",
    "--vf-shadow-soft-dark": "0 24px 80px -46px rgba(0, 0, 0, 0.72)",
    "--vf-shadow-panel-dark": "0 18px 45px -30px rgba(0, 0, 0, 0.58)"
  } as const;
}

export function applyTenantTheme(
  root: HTMLElement,
  paletteId: ThemePaletteId,
  appMode: ThemeAppMode
) {
  const variables = buildTenantThemeVariables(paletteId, appMode);

  Object.entries(variables).forEach(([name, value]) => {
    root.style.setProperty(name, value);
  });

  root.dataset.operapymePalette = paletteId;
  root.dataset.operapymeApp = appMode;
}

export function buildThemePreviewStyle(
  paletteId: ThemePaletteId,
  appMode: ThemeAppMode,
  darkMode = false
): CSSProperties {
  const variables = buildTenantThemeVariables(paletteId, appMode);

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
  paletteId: ThemePaletteId,
  appMode: ThemeAppMode,
  darkMode = false
): CSSProperties {
  const variables = buildTenantThemeVariables(paletteId, appMode);
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
  paletteId: ThemePaletteId,
  appMode: ThemeAppMode,
  darkMode = false
): CSSProperties {
  const variables = buildTenantThemeVariables(paletteId, appMode);

  return {
    background: darkMode
      ? variables["--vf-dark-hero-background"]
      : variables["--vf-light-hero-background"],
    color: darkMode ? variables["--vf-dark-ink"] : variables["--vf-light-ink"]
  };
}
