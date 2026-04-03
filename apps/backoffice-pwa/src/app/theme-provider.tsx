import type { PropsWithChildren } from "react";
import { useEffect } from "react";

import { TenantThemeProvider } from "@operapyme/ui";
import {
  ThemeProvider as NextThemesProvider,
  useTheme
} from "next-themes";

import { useBackofficeAuth } from "@/app/auth-provider";

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

function TenantScopedThemeProvider({ children }: PropsWithChildren) {
  const { activeTenantId } = useBackofficeAuth();
  const storageKey = activeTenantId
    ? `operapyme.backoffice.palette.v2.${activeTenantId}`
    : "operapyme.backoffice.palette.v2.default";

  return (
    <TenantThemeProvider
      key={storageKey}
      appMode="backoffice"
      defaultPaletteId="slate"
      storageKey={storageKey}
    >
      <ThemeMetaSync />
      {children}
    </TenantThemeProvider>
  );
}

export function BackofficeThemeProvider({ children }: PropsWithChildren) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      enableColorScheme
      enableSystem
      storageKey="operapyme-backoffice-theme-v2"
    >
      <TenantScopedThemeProvider>{children}</TenantScopedThemeProvider>
    </NextThemesProvider>
  );
}
