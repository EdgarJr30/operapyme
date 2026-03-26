import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { QuoteOperationsPanel } from "@/modules/quotes/quote-operations-panel";

const quoteMutationMocks = vi.hoisted(() => ({
  useQuoteMutations: vi.fn()
}));

vi.mock("@/modules/quotes/use-quote-mutations", () => ({
  useQuoteMutations: quoteMutationMocks.useQuoteMutations
}));

function buildMutationState() {
  return {
    createQuoteMutation: {
      isError: false,
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined)
    },
    updateQuoteMutation: {
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
      <QuoteOperationsPanel
        customers={[
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
        ]}
        quotes={[
          {
            id: "quote-1",
            customerId: "customer-1",
            quoteNumber: "COT-2026-000210",
            title: "Propuesta Northline",
            customerName: "Northline Industrial",
            currencyCode: "USD",
            subtotal: 1000,
            discountTotal: 100,
            taxTotal: 180,
            grandTotal: 1080,
            status: "draft",
            version: 1,
            validUntil: "2026-04-10",
            notes: "Notas iniciales",
            updatedAt: "2026-03-26T00:00:00.000Z"
          }
        ]}
      />
    </I18nextProvider>
  );
}

describe("quote operations panel", () => {
  it("submits a live quote create mutation", async () => {
    const mutationState = buildMutationState();
    quoteMutationMocks.useQuoteMutations.mockReturnValue(mutationState);
    const user = userEvent.setup();

    renderPanel();

    await user.type(
      screen.getAllByLabelText(/Titulo/i)[0],
      "Propuesta de soporte"
    );
    await user.clear(screen.getAllByLabelText(/Subtotal/i)[0]);
    await user.type(screen.getAllByLabelText(/Subtotal/i)[0], "1500");
    await user.click(screen.getByRole("button", { name: /Guardar cotizacion/i }));

    expect(mutationState.createQuoteMutation.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Propuesta de soporte",
        subtotal: 1500
      })
    );
  });

  it("submits a live quote update mutation with version bump input", async () => {
    const mutationState = buildMutationState();
    quoteMutationMocks.useQuoteMutations.mockReturnValue(mutationState);
    const user = userEvent.setup();

    renderPanel();

    const updateTitleInput = screen.getAllByLabelText(/Titulo/i)[1];
    await user.clear(updateTitleInput);
    await user.type(updateTitleInput, "Propuesta Northline actualizada");
    await user.click(screen.getByRole("button", { name: /Actualizar cotizacion/i }));

    expect(mutationState.updateQuoteMutation.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        quoteId: "quote-1",
        version: 1,
        title: "Propuesta Northline actualizada"
      })
    );
  });
});
