import {
  lazy,
  Suspense,
  type PropsWithChildren
} from "react";

import {
  I18nextProvider,
  type I18nInstance
} from "@operapyme/i18n";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";

import { BackofficeAuthProvider } from "@/app/auth-provider";
import { BackofficeThemeProvider } from "@/app/theme-provider";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(async () => {
      const module = await import("@tanstack/react-query-devtools");

      return { default: module.ReactQueryDevtools };
    })
  : null;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false
    },
    mutations: {
      retry: 0
    }
  }
});

interface AppProvidersProps extends PropsWithChildren {
  i18n: I18nInstance;
}

export function AppProviders({ children, i18n }: AppProvidersProps) {
  return (
    <BackofficeThemeProvider>
      <I18nextProvider i18n={i18n}>
        <BackofficeAuthProvider>
          <QueryClientProvider client={queryClient}>
            {children}
            {ReactQueryDevtools ? (
              <Suspense fallback={null}>
                <ReactQueryDevtools
                  initialIsOpen={false}
                  buttonPosition="bottom-left"
                />
              </Suspense>
            ) : null}
          </QueryClientProvider>
        </BackofficeAuthProvider>
      </I18nextProvider>
    </BackofficeThemeProvider>
  );
}
