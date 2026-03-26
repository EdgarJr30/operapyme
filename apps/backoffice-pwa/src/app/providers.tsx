import type { PropsWithChildren } from "react";

import {
  I18nextProvider,
  type I18nInstance
} from "@operapyme/i18n";
import {
  QueryClient,
  QueryClientProvider
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { BackofficeThemeProvider } from "@/app/theme-provider";

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
        <QueryClientProvider client={queryClient}>
          {children}
          <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
        </QueryClientProvider>
      </I18nextProvider>
    </BackofficeThemeProvider>
  );
}
