import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren
} from "react";

import {
  defaultThemePaletteId,
  getThemePalette,
  isThemePaletteId,
  tenantThemePalettes,
  type ThemeAppMode,
  type ThemePaletteId
} from "./palettes";
import { applyTenantTheme } from "./runtime";

interface TenantThemeProviderProps extends PropsWithChildren {
  appMode: ThemeAppMode;
  defaultPaletteId?: ThemePaletteId;
  storageKey?: string;
}

interface TenantThemeContextValue {
  appMode: ThemeAppMode;
  paletteId: ThemePaletteId;
  setPaletteId: (paletteId: ThemePaletteId) => void;
  palettes: typeof tenantThemePalettes;
}

const TenantThemeContext = createContext<TenantThemeContextValue | null>(null);

function readStoredPalette(
  storageKey: string,
  fallbackPaletteId: ThemePaletteId
): ThemePaletteId {
  if (typeof window === "undefined") {
    return fallbackPaletteId;
  }

  const storedPaletteId = window.localStorage.getItem(storageKey);

  return isThemePaletteId(storedPaletteId) ? storedPaletteId : fallbackPaletteId;
}

export function TenantThemeProvider({
  children,
  appMode,
  defaultPaletteId = defaultThemePaletteId,
  storageKey = "operapyme.theme.palette"
}: TenantThemeProviderProps) {
  const [paletteId, setPaletteId] = useState<ThemePaletteId>(() =>
    readStoredPalette(storageKey, defaultPaletteId)
  );

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    applyTenantTheme(document.documentElement, paletteId, appMode);
  }, [appMode, paletteId]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(storageKey, paletteId);
  }, [paletteId, storageKey]);

  return (
    <TenantThemeContext.Provider
      value={{
        appMode,
        paletteId,
        setPaletteId,
        palettes: tenantThemePalettes
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
    palette: getThemePalette(context.paletteId)
  };
}
