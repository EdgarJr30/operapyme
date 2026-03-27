import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { QuotesPage } from "@/modules/quotes/quotes-page";

const quotesMocks = vi.hoisted(() => ({
  useQuotesData: vi.fn(),
  useCustomersData: vi.fn(),
  useLeadsData: vi.fn(),
  useCatalogItemsData: vi.fn()
}));

vi.mock("@/modules/quotes/use-quotes-data", () => ({
  useQuotesData: quotesMocks.useQuotesData
}));

vi.mock("@/modules/crm/use-customers-data", () => ({
  useCustomersData: quotesMocks.useCustomersData
}));

vi.mock("@/modules/crm/use-leads-data", () => ({
  useLeadsData: quotesMocks.useLeadsData
}));

vi.mock("@/modules/catalog/use-catalog-items-data", () => ({
  useCatalogItemsData: quotesMocks.useCatalogItemsData
}));

vi.mock("@/modules/quotes/quote-pdf-download-button", () => ({
  QuotePdfDownloadButton: () => <div>Quote PDF stub</div>
}));

function renderPage() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <MemoryRouter>
        <QuotesPage />
      </MemoryRouter>
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
    quotesMocks.useCustomersData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });
    quotesMocks.useLeadsData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });
    quotesMocks.useCatalogItemsData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/No pudimos cargar las cotizaciones/i)
    ).toBeInTheDocument();
  });

  it("shows the tenant guard state when there is no active tenant", async () => {
    quotesMocks.useQuotesData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: false,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });
    quotesMocks.useCustomersData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: false,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });
    quotesMocks.useLeadsData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: false,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });
    quotesMocks.useCatalogItemsData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: false,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/No hay tenant activo para consultar cotizaciones/i)
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
    quotesMocks.useCustomersData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });
    quotesMocks.useLeadsData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });
    quotesMocks.useCatalogItemsData.mockReturnValue({
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
          customerId: "customer-1",
          leadId: null,
          recipientKind: "customer",
          recipientDisplayName: "Northline Industrial",
          recipientContactName: "Andrea Castillo",
          recipientEmail: "sales@northline.test",
          recipientWhatsApp: null,
          recipientPhone: null,
          quoteNumber: "COT-2026-000210",
          title: "Propuesta Northline",
          currencyCode: "USD",
          subtotal: 12000,
          discountTotal: 200,
          taxTotal: 1040,
          grandTotal: 12840,
          status: "sent",
          version: 1,
          validUntil: null,
          notes: null,
          createdAt: "2026-03-26T00:00:00.000Z",
          updatedAt: "2026-03-26T00:00:00.000Z"
        }
      ],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });
    quotesMocks.useLeadsData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });
    quotesMocks.useCatalogItemsData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });
    quotesMocks.useCustomersData.mockReturnValue({
      data: [
        {
          id: "customer-1",
          customerCode: "CLI-001",
          displayName: "Northline Industrial",
          contactName: "Andrea Castillo",
          legalName: null,
          email: "sales@northline.test",
          whatsapp: null,
          phone: null,
          documentId: null,
          notes: null,
          source: "manual",
          status: "active",
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
      await screen.findByRole("link", { name: /Crear cotizacion/i })
    ).toHaveAttribute("href", "/quotes/new");
    expect(
      await screen.findByRole("link", { name: /Revisar cotizaciones/i })
    ).toHaveAttribute("href", "/quotes/manage");
    expect(
      await screen.findByText(/COT-2026-000210/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Northline Industrial/i)).toBeInTheDocument();
  });
});
