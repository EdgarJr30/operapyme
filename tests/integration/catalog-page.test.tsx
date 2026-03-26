import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { CatalogPage } from "@/modules/catalog/catalog-page";

const catalogMocks = vi.hoisted(() => ({
  useCatalogItemsData: vi.fn()
}));

vi.mock("@/modules/catalog/use-catalog-items-data", () => ({
  useCatalogItemsData: catalogMocks.useCatalogItemsData
}));

vi.mock("@/modules/catalog/catalog-operations-panel", () => ({
  CatalogOperationsPanel: () => <div>Catalog operations stub</div>
}));

function renderPage() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <CatalogPage />
    </I18nextProvider>
  );
}

describe("catalog page", () => {
  it("shows a loading state while catalog items are being fetched", async () => {
    catalogMocks.useCatalogItemsData.mockReturnValue({
      data: undefined,
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: true,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/Cargando items reales del catalogo/i)
    ).toBeInTheDocument();
  });

  it("shows the tenant guard state when there is no active tenant", async () => {
    catalogMocks.useCatalogItemsData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: false,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/No hay tenant activo para consultar el catalogo/i)
    ).toBeInTheDocument();
  });

  it("shows an empty state when the tenant still has no catalog items", async () => {
    catalogMocks.useCatalogItemsData.mockReturnValue({
      data: [],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });

    renderPage();

    expect(
      await screen.findByText(/Todavia no hay items registrados/i)
    ).toBeInTheDocument();
  });

  it("renders the live catalog list when data is available", async () => {
    catalogMocks.useCatalogItemsData.mockReturnValue({
      data: [
        {
          id: "item-1",
          itemCode: "CAT-001",
          name: "Kit de mantenimiento preventivo",
          description: "Visita y repuestos base",
          category: "Servicios tecnicos",
          kind: "service",
          visibility: "private",
          pricingMode: "on_request",
          currencyCode: "USD",
          unitPrice: null,
          status: "active",
          notes: null,
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
      await screen.findByText(/Kit de mantenimiento preventivo/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Servicios tecnicos/i)).toBeInTheDocument();
    expect(screen.getAllByText(/A solicitud/i).length).toBeGreaterThan(0);
  });

  it("shows a search empty state when the filter hides every item", async () => {
    catalogMocks.useCatalogItemsData.mockReturnValue({
      data: [
        {
          id: "item-1",
          itemCode: "CAT-001",
          name: "Kit de mantenimiento preventivo",
          description: "Visita y repuestos base",
          category: "Servicios tecnicos",
          kind: "service",
          visibility: "private",
          pricingMode: "on_request",
          currencyCode: "USD",
          unitPrice: null,
          status: "active",
          notes: null,
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
    const user = userEvent.setup();

    await user.type(
      await screen.findByLabelText(/Buscar en el catalogo/i),
      "sin-coincidencia"
    );

    expect(
      await screen.findByText(/No encontramos coincidencias para esta busqueda/i)
    ).toBeInTheDocument();
  });
});
