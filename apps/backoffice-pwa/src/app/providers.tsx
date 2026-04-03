import {
  Suspense,
  lazy,
  type PropsWithChildren
} from "react";

import {
  I18nextProvider,
  type I18nInstance
} from "@operapyme/i18n";

import { BackofficeAuthProvider } from "@/app/auth-provider";
import { BackofficeThemeProvider } from "@/app/theme-provider";

const GlobalToaster = lazy(async () => {
  const module = await import("@/components/ui/sonner");

  return { default: module.Toaster };
});

interface AppProvidersProps extends PropsWithChildren {
  i18n: I18nInstance;
}

export function AppProviders({ children, i18n }: AppProvidersProps) {
  return (
    <I18nextProvider i18n={i18n}>
      <BackofficeAuthProvider>
        <BackofficeThemeProvider>
          {children}
          <Suspense fallback={null}>
            <GlobalToaster />
          </Suspense>
        </BackofficeThemeProvider>
      </BackofficeAuthProvider>
    </I18nextProvider>
  );
}
