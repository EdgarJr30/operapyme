import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { CrmPage } from "@/modules/crm/crm-page";

const crmMocks = vi.hoisted(() => ({
  useCustomersData: vi.fn()
}));

vi.mock("@/modules/crm/use-customers-data", () => ({
  useCustomersData: crmMocks.useCustomersData
}));

vi.mock("@/modules/crm/customer-operations-panel", () => ({
  CustomerOperationsPanel: () => <div>Customer operations stub</div>
}));

vi.mock("@/modules/crm/lead-intake-form", () => ({
  LeadIntakeForm: () => <div>Lead intake stub</div>
}));

function renderPage() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <CrmPage />
    </I18nextProvider>
  );
}

describe("crm page", () => {
  it("shows a loading state while customers are being fetched", async () => {
    crmMocks.useCustomersData.mockReturnValue({
      data: undefined,
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: true,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/Cargando clientes reales/i)
    ).toBeInTheDocument();
  });

  it("shows the tenant guard state when there is no active tenant", async () => {
    crmMocks.useCustomersData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: false,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/No hay tenant activo para consultar clientes/i)
    ).toBeInTheDocument();
  });

  it("shows an empty state when the tenant still has no customers", async () => {
    crmMocks.useCustomersData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/Todavia no hay clientes registrados/i)
    ).toBeInTheDocument();
  });

  it("renders the live customers list when data is available", async () => {
    crmMocks.useCustomersData.mockReturnValue({
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
      await screen.findByText(/Northline Industrial/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Carga manual/i)).toBeInTheDocument();
  });
});
