import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { CatalogOperationsPanel } from "@/modules/catalog/catalog-operations-panel";

const catalogMutationMocks = vi.hoisted(() => ({
  useCatalogMutations: vi.fn()
}));

vi.mock("@/modules/catalog/use-catalog-mutations", () => ({
  useCatalogMutations: catalogMutationMocks.useCatalogMutations
}));

function buildMutationState() {
  return {
    createCatalogItemMutation: {
      isError: false,
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined)
    },
    updateCatalogItemMutation: {
      isError: false,
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined)
    }
  };
}

function renderPanel() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <CatalogOperationsPanel
        items={[
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
            notes: "Incluye visita inicial",
            updatedAt: "2026-03-26T00:00:00.000Z"
          }
        ]}
      />
    </I18nextProvider>
  );
}

describe("catalog operations panel", () => {
  it("submits a live catalog create mutation", async () => {
    const mutationState = buildMutationState();
    catalogMutationMocks.useCatalogMutations.mockReturnValue(mutationState);
    const user = userEvent.setup();

    renderPanel();

    await user.type(
      screen.getAllByLabelText(/Nombre visible/i)[0],
      "Kit de instalacion premium"
    );
    await user.type(
      screen.getAllByLabelText(/Categoria/i)[0],
      "Servicios de campo"
    );
    await user.clear(screen.getAllByLabelText(/Precio base/i)[0]);
    await user.type(screen.getAllByLabelText(/Precio base/i)[0], "1890");
    await user.click(screen.getByRole("button", { name: /Guardar item/i }));

    expect(
      mutationState.createCatalogItemMutation.mutateAsync
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "Kit de instalacion premium",
        category: "Servicios de campo",
        unitPrice: 1890
      })
    );
  });

  it("submits a live catalog update mutation", async () => {
    const mutationState = buildMutationState();
    catalogMutationMocks.useCatalogMutations.mockReturnValue(mutationState);
    const user = userEvent.setup();

    renderPanel();

    const updateNameInput = screen.getAllByLabelText(/Nombre visible/i)[1];
    await user.clear(updateNameInput);
    await user.type(updateNameInput, "Kit de mantenimiento enterprise");
    await user.click(screen.getByRole("button", { name: /Actualizar item/i }));

    expect(
      mutationState.updateCatalogItemMutation.mutateAsync
    ).toHaveBeenCalledWith(
      expect.objectContaining({
        itemId: "item-1",
        name: "Kit de mantenimiento enterprise"
      })
    );
  });
});
