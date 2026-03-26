import type { PropsWithChildren, ReactElement } from "react";

import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { setupBackofficeI18n } from "@/app/i18n";
import { AppProviders } from "@/app/providers";

interface RenderWithBackofficeOptions {
  route?: string;
}

function TestHarness({
  children,
  route
}: PropsWithChildren<Required<RenderWithBackofficeOptions>>) {
  const i18n = setupBackofficeI18n();

  return (
    <MemoryRouter initialEntries={[route]}>
      <AppProviders i18n={i18n}>{children}</AppProviders>
    </MemoryRouter>
  );
}

export function renderWithBackoffice(
  ui: ReactElement,
  options: RenderWithBackofficeOptions = {}
) {
  return render(
    <TestHarness route={options.route ?? "/"}>{ui}</TestHarness>
  );
}
