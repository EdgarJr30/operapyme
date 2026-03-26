import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { QuotesPage } from "@/modules/quotes/quotes-page";

const quotesMocks = vi.hoisted(() => ({
  useQuotesData: vi.fn()
}));

vi.mock("@/modules/quotes/use-quotes-data", () => ({
  useQuotesData: quotesMocks.useQuotesData
}));

function renderPage() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <QuotesPage />
    </I18nextProvider>
  );
}

describe("quotes page", () => {
  it("shows an error state when the quotes query fails", async () => {
    quotesMocks.useQuotesData.mockReturnValue({
      data: undefined,
      error: new Error("permission denied"),
      hasTenantContext: true,
      isError: true,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/No pudimos cargar las cotizaciones/i)
    ).toBeInTheDocument();
  });

  it("shows an empty state when the tenant still has no quotes", async () => {
    quotesMocks.useQuotesData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/Todavia no hay cotizaciones registradas/i)
    ).toBeInTheDocument();
  });

  it("renders the live quotes list when data is available", async () => {
    quotesMocks.useQuotesData.mockReturnValue({
      data: [
        {
          id: "quote-1",
          quoteNumber: "COT-2026-000210",
          title: "Propuesta Northline",
          customerName: "Northline Industrial",
          currencyCode: "USD",
          grandTotal: 12840,
          status: "sent",
          updatedAt: "2026-03-26T00:00:00.000Z"
        }
      ],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/COT-2026-000210/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Northline Industrial/i)).toBeInTheDocument();
  });
});
