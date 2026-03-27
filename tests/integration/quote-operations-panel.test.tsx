import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import {
  QuoteCreateWorkspace,
  QuoteManageWorkspace
} from "@/modules/quotes/quote-operations-panel";

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

const quotePanelProps = {
  customers: [
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
  leads: [
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
  ],
  catalogItems: [
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
  ],
  quotes: [
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
  ]
};

function renderCreatePanel() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <QuoteCreateWorkspace {...quotePanelProps} />
    </I18nextProvider>
  );
}

function renderManagePanel() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <QuoteManageWorkspace {...quotePanelProps} />
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

    renderCreatePanel();

    await user.click(screen.getByRole("button", { name: /^Siguiente paso$/i }));

    await user.type(screen.getByLabelText(/Titulo/i), "Propuesta de soporte");
    await user.click(screen.getByRole("button", { name: /^Siguiente paso$/i }));
    await user.type(screen.getByLabelText(/Nombre del servicio o producto/i), "Soporte premium");
    await user.clear(screen.getByLabelText(/Precio unitario/i));
    await user.type(screen.getByLabelText(/Precio unitario/i), "1500");
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

  it("guides the user to the first invalid step when required fields are missing", async () => {
    const mutationState = buildMutationState();
    quoteMutationMocks.useQuoteMutations.mockReturnValue(mutationState);
    quoteMutationMocks.useQuoteDetailData.mockReturnValue({
      data: null,
      error: null,
      isError: false,
      isLoading: false
    });
    const user = userEvent.setup();

    renderCreatePanel();

    await user.click(screen.getByRole("button", { name: /Guardar cotizacion/i }));

    expect(await screen.findByLabelText(/Titulo/i)).toBeInTheDocument();
    expect(
      screen.getAllByText(/Ingresa un titulo para la cotizacion/i).length
    ).toBeGreaterThan(0);
    expect(
      mutationState.createQuoteMutation.mutateAsync
    ).not.toHaveBeenCalled();
  });

  it("creates a quote from the fast lead path without customer or lead ids", async () => {
    const mutationState = buildMutationState();
    quoteMutationMocks.useQuoteMutations.mockReturnValue(mutationState);
    quoteMutationMocks.useQuoteDetailData.mockReturnValue({
      data: null,
      error: null,
      isError: false,
      isLoading: false
    });
    const user = userEvent.setup();

    renderCreatePanel();

    await user.selectOptions(
      screen.getByLabelText(/Tipo de receptor/i),
      "ad_hoc"
    );
    const recipientInput = screen.getByLabelText(/Empresa o referencia/i);
    const emailInput = screen.getByLabelText(/^Correo$/i);
    await user.clear(recipientInput);
    await user.type(recipientInput, "Prospecto urgente");
    await user.clear(emailInput);
    await user.type(emailInput, "urgente@test.com");

    await user.click(screen.getAllByRole("button", { name: /Documento/i })[0]!);
    await user.type(await screen.findByLabelText(/Titulo/i), "Cotizacion express");

    await user.click(screen.getAllByRole("button", { name: /Lineas/i })[0]!);
    await user.type(
      await screen.findByLabelText(/Nombre del servicio o producto/i),
      "Paquete express"
    );
    await user.clear(screen.getByLabelText(/Precio unitario/i));
    await user.type(screen.getByLabelText(/Precio unitario/i), "950");

    await user.click(screen.getByRole("button", { name: /Guardar cotizacion/i }));

    expect(mutationState.createQuoteMutation.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        recipientKind: "ad_hoc",
        customerId: null,
        leadId: null,
        recipientDisplayName: "Prospecto urgente",
        recipientEmail: "urgente@test.com",
        title: "Cotizacion express"
      })
    );
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

    renderManagePanel();

    await user.click(screen.getByRole("button", { name: /^Siguiente paso$/i }));

    const updateTitleInput = await screen.findByLabelText(/Titulo/i);
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
