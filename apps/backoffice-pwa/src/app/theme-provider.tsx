import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import { TenantThemeProvider } from "@operapyme/ui";
import {
  ThemeProvider as NextThemesProvider,
  useTheme
} from "next-themes";

function ThemeMetaSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');

    if (!themeColorMeta) {
      return;
    }

    const syncThemeColor = () => {
      const computedStyles = window.getComputedStyle(document.documentElement);
      const nextThemeColor = computedStyles
        .getPropertyValue("--vf-active-sand")
        .trim();

      if (nextThemeColor) {
        themeColorMeta.setAttribute("content", nextThemeColor);
      }
    };

    syncThemeColor();

    const observer = new MutationObserver(() => {
      syncThemeColor();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style", "data-operapyme-palette"]
    });

    return () => {
      observer.disconnect();
    };
  }, [resolvedTheme]);

  return null;
}

export function BackofficeThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      enableColorScheme
      enableSystem={false}
      forcedTheme="light"
      storageKey="operapyme-backoffice-theme-v2"
    >
      <TenantThemeProvider
        appMode="backoffice"
        defaultPaletteId="custom"
        storageKey="operapyme.backoffice.palette.v2"
      >
        <ThemeMetaSync />
        {children}
      </TenantThemeProvider>
    </NextThemesProvider>
  );
}
