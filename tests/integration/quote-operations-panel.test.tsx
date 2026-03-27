import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { QuoteOperationsPanel } from "@/modules/quotes/quote-operations-panel";

const quoteMutationMocks = vi.hoisted(() => ({
  useQuoteMutations: vi.fn(),
  useQuoteDetailData: vi.fn()
}));

vi.mock("@/modules/quotes/use-quote-mutations", () => ({
  useQuoteMutations: quoteMutationMocks.useQuoteMutations
}));

vi.mock("@/modules/quotes/use-quote-detail-data", () => ({
  useQuoteDetailData: quoteMutationMocks.useQuoteDetailData
}));

function buildMutationState() {
  return {
    createQuoteMutation: {
      isError: false,
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue({
        id: "quote-2",
        quoteNumber: "COT-2026-000211"
      })
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
        leads={[
          {
            id: "lead-1",
            leadCode: "LEA-001",
            displayName: "Northline Prospect",
            contactName: "Andrea Castillo",
            email: "sales@northline.test",
            whatsapp: null,
            phone: null,
            source: "whatsapp",
            status: "new",
            needSummary: "Mantenimiento preventivo",
            notes: null,
            updatedAt: "2026-03-26T00:00:00.000Z"
          }
        ]}
        catalogItems={[
          {
            id: "item-1",
            itemCode: "CAT-001",
            name: "Mantenimiento preventivo",
            description: "Visita tecnica trimestral",
            category: "Servicios",
            kind: "service",
            visibility: "private",
            pricingMode: "fixed",
            currencyCode: "USD",
            unitPrice: 1500,
            status: "active",
            notes: null,
            updatedAt: "2026-03-26T00:00:00.000Z"
          }
        ]}
        quotes={[
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
            subtotal: 1000,
            discountTotal: 100,
            taxTotal: 180,
            grandTotal: 1080,
            status: "draft",
            version: 1,
            validUntil: "2026-04-10",
            notes: "Notas iniciales",
            createdAt: "2026-03-25T00:00:00.000Z",
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
    quoteMutationMocks.useQuoteDetailData.mockReturnValue({
      data: {
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
        subtotal: 1000,
        discountTotal: 100,
        taxTotal: 180,
        grandTotal: 1080,
        status: "draft",
        version: 1,
        validUntil: "2026-04-10",
        notes: "Notas iniciales",
        createdAt: "2026-03-25T00:00:00.000Z",
        updatedAt: "2026-03-26T00:00:00.000Z",
        lineItems: [
          {
            id: "line-1",
            catalogItemId: "item-1",
            sortOrder: 0,
            itemName: "Mantenimiento preventivo",
            itemDescription: "Visita tecnica trimestral",
            quantity: 1,
            unitLabel: "servicio",
            unitPrice: 1000,
            discountTotal: 100,
            taxTotal: 180,
            lineSubtotal: 1000,
            lineTotal: 1080
          }
        ]
      },
      error: null,
      isError: false,
      isLoading: false
    });
    const user = userEvent.setup();

    renderPanel();

    await user.type(
      screen.getAllByLabelText(/Titulo/i)[0],
      "Propuesta de soporte"
    );
    await user.type(
      screen.getAllByLabelText(/Nombre del servicio o producto/i)[0],
      "Soporte premium"
    );
    await user.clear(screen.getAllByLabelText(/Precio unitario/i)[0]);
    await user.type(screen.getAllByLabelText(/Precio unitario/i)[0], "1500");
    await user.click(screen.getByRole("button", { name: /Guardar cotizacion/i }));

    expect(mutationState.createQuoteMutation.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "Propuesta de soporte",
        recipientKind: "customer"
      })
    );
    expect(
      mutationState.createQuoteMutation.mutateAsync.mock.calls[0][0].lineItems[0]
    ).toEqual(
      expect.objectContaining({
        itemName: "Soporte premium",
        unitPrice: 1500
      })
    );

    expect(
      mutationState.createQuoteMutation.mutateAsync.mock.calls[0][0]
    ).not.toHaveProperty("quoteNumber");
  });

  it("submits a live quote update mutation with expected version input", async () => {
    const mutationState = buildMutationState();
    quoteMutationMocks.useQuoteMutations.mockReturnValue(mutationState);
    quoteMutationMocks.useQuoteDetailData.mockReturnValue({
      data: {
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
        subtotal: 1000,
        discountTotal: 100,
        taxTotal: 180,
        grandTotal: 1080,
        status: "draft",
        version: 1,
        validUntil: "2026-04-10",
        notes: "Notas iniciales",
        createdAt: "2026-03-25T00:00:00.000Z",
        updatedAt: "2026-03-26T00:00:00.000Z",
        lineItems: [
          {
            id: "line-1",
            catalogItemId: "item-1",
            sortOrder: 0,
            itemName: "Mantenimiento preventivo",
            itemDescription: "Visita tecnica trimestral",
            quantity: 1,
            unitLabel: "servicio",
            unitPrice: 1000,
            discountTotal: 100,
            taxTotal: 180,
            lineSubtotal: 1000,
            lineTotal: 1080
          }
        ]
      },
      error: null,
      isError: false,
      isLoading: false
    });
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

    expect(
      mutationState.updateQuoteMutation.mutateAsync.mock.calls[0][0]
    ).not.toHaveProperty("quoteNumber");
  });
});
