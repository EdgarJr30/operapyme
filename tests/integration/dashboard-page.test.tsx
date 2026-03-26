import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { DashboardPage } from "@/modules/dashboard/dashboard-page";

const dashboardMocks = vi.hoisted(() => ({
  useDashboardData: vi.fn()
}));

vi.mock("@/modules/dashboard/use-dashboard-data", () => ({
  useDashboardData: dashboardMocks.useDashboardData
}));

function renderPage() {
  const i18n = setupBackofficeI18n();

  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <DashboardPage />
      </I18nextProvider>
    </MemoryRouter>
  );
}

describe("dashboard page", () => {
  it("shows a loading state while the tenant snapshot is being fetched", async () => {
    dashboardMocks.useDashboardData.mockReturnValue({
      data: undefined,
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: true,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/Cargando el pulso comercial/i)
    ).toBeInTheDocument();
  });

  it("shows the tenant guard state when there is no active tenant context", async () => {
    dashboardMocks.useDashboardData.mockReturnValue({
      data: undefined,
      error: null,
      hasTenantContext: false,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/Todavia no hay un tenant activo seleccionado/i)
    ).toBeInTheDocument();
  });

  it("shows an empty state when the tenant still has no customers or quotes", async () => {
    dashboardMocks.useDashboardData.mockReturnValue({
      data: {
        customerCount: 0,
        activeCustomerCount: 0,
        quoteCount: 0,
        openQuoteCount: 0,
        recentCustomers: [],
        recentQuotes: []
      },
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/Aun no hay actividad comercial para mostrar/i)
    ).toBeInTheDocument();
  });

  it("renders live customer and quote snapshots when data is available", async () => {
    dashboardMocks.useDashboardData.mockReturnValue({
      data: {
        customerCount: 5,
        activeCustomerCount: 4,
        quoteCount: 3,
        openQuoteCount: 2,
        recentCustomers: [
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
        recentQuotes: [
          {
            id: "quote-1",
            customerId: "customer-1",
            quoteNumber: "COT-2026-000210",
            title: "Propuesta Northline",
            customerName: "Northline Industrial",
            currencyCode: "USD",
            subtotal: 12000,
            discountTotal: 200,
            taxTotal: 1040,
            grandTotal: 12840,
            status: "sent",
            version: 1,
            validUntil: null,
            notes: null,
            updatedAt: "2026-03-26T00:00:00.000Z"
          }
        ]
      },
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      (await screen.findAllByText(/Northline Industrial/i)).length
    ).toBeGreaterThan(0);
    expect(screen.getByText(/COT-2026-000210/i)).toBeInTheDocument();
    expect(screen.getByText(/Clientes visibles/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^5$/).length).toBeGreaterThan(0);
  });
});
