import React from "react";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren
} from "react";

import {
  createCustomThemePalette,
  defaultCustomThemePaletteSeeds,
  defaultThemePaletteId,
  getThemePalette,
  isThemePaletteId,
  isThemePaletteSeedColors,
  resolveThemePalette,
  tenantThemePalettes,
  type ThemeAppMode,
  type ThemePaletteSeedColors,
  type ThemePaletteSelectionId
} from "./palettes";
import { applyTenantTheme } from "./runtime";

interface TenantThemeProviderProps extends PropsWithChildren {
  appMode: ThemeAppMode;
  defaultPaletteId?: ThemePaletteSelectionId;
  storageKey?: string;
}

interface StoredThemeState {
  selectionId: ThemePaletteSelectionId;
  customPaletteSeeds: ThemePaletteSeedColors;
}

interface TenantThemeContextValue {
  appMode: ThemeAppMode;
  paletteId: ThemePaletteSelectionId;
  setPaletteId: (paletteId: ThemePaletteSelectionId) => void;
  palettes: typeof tenantThemePalettes;
  customPalette: ReturnType<typeof createCustomThemePalette>;
  setCustomPalette: (palette: ThemePaletteSeedColors) => void;
  resetCustomPalette: () => void;
}

const TenantThemeContext = createContext<TenantThemeContextValue | null>(null);

function readStoredPalette(
  storageKey: string,
  fallbackPaletteId: ThemePaletteSelectionId
): StoredThemeState {
  if (typeof window === "undefined") {
    return {
      selectionId: fallbackPaletteId,
      customPaletteSeeds: defaultCustomThemePaletteSeeds
    };
  }

  const rawValue = window.localStorage.getItem(storageKey);

  if (!rawValue) {
    return {
      selectionId: fallbackPaletteId,
      customPaletteSeeds: defaultCustomThemePaletteSeeds
    };
  }

  if (isThemePaletteId(rawValue)) {
    return {
      selectionId: rawValue,
      customPaletteSeeds: defaultCustomThemePaletteSeeds
    };
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredThemeState>;
    const selectionId =
      parsedValue.selectionId === "custom" || isThemePaletteId(parsedValue.selectionId)
        ? parsedValue.selectionId
        : fallbackPaletteId;

    return {
      selectionId,
      customPaletteSeeds: isThemePaletteSeedColors(parsedValue.customPaletteSeeds)
        ? parsedValue.customPaletteSeeds
        : defaultCustomThemePaletteSeeds
    };
  } catch {
    return {
      selectionId: fallbackPaletteId,
      customPaletteSeeds: defaultCustomThemePaletteSeeds
    };
  }
}

export function TenantThemeProvider({
  children,
  appMode,
  defaultPaletteId = defaultThemePaletteId,
  storageKey = "operapyme.theme.palette"
}: TenantThemeProviderProps) {
  const [themeState, setThemeState] = useState<StoredThemeState>(() =>
    readStoredPalette(storageKey, defaultPaletteId)
  );

  const customPalette = createCustomThemePalette(themeState.customPaletteSeeds);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    applyTenantTheme(
      document.documentElement,
      themeState.selectionId,
      appMode,
      themeState.customPaletteSeeds
    );
  }, [appMode, themeState]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, JSON.stringify(themeState));
  }, [themeState, storageKey]);

  return (
    <TenantThemeContext.Provider
      value={{
        appMode,
        paletteId: themeState.selectionId,
        setPaletteId: (paletteId) => {
          setThemeState((currentState) => ({
            ...currentState,
            selectionId: paletteId
          }));
        },
        palettes: tenantThemePalettes,
        customPalette,
        setCustomPalette: (palette) => {
          setThemeState({
            selectionId: "custom",
            customPaletteSeeds: palette
          });
        },
        resetCustomPalette: () => {
          setThemeState((currentState) => ({
            ...currentState,
            selectionId: "custom",
            customPaletteSeeds: defaultCustomThemePaletteSeeds
          }));
        }
      }}
    >
      {children}
    </TenantThemeContext.Provider>
  );
}

export function useTenantTheme() {
  const context = useContext(TenantThemeContext);

  if (!context) {
    throw new Error("useTenantTheme must be used within TenantThemeProvider.");
  }

  return {
    ...context,
    palette:
      context.paletteId === "custom"
        ? context.customPalette
        : getThemePalette(context.paletteId),
    activePalette: resolveThemePalette(
      context.paletteId,
      context.customPalette.seeds
    )
  };
}
