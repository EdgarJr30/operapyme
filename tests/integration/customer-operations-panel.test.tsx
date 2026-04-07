import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { CustomerOperationsPanel } from "@/modules/crm/customer-operations-panel";

const customerMutationMocks = vi.hoisted(() => ({
  useCustomerMutations: vi.fn()
}));

vi.mock("@/modules/crm/use-customer-mutations", () => ({
  useCustomerMutations: customerMutationMocks.useCustomerMutations
}));

function buildMutationState() {
  return {
    createCustomerMutation: {
      isError: false,
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined)
    },
    updateCustomerMutation: {
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
      <CustomerOperationsPanel
        customers={[
          {
            id: "customer-1",
            customerCode: "CLI-001",
            displayName: "Northline Industrial",
            contactName: "Andrea Castillo",
            legalName: "Northline Industrial SRL",
            email: "sales@northline.test",
            whatsapp: "+1 809 555 0100",
            phone: null,
            documentId: null,
            isForeign: false,
            passportId: null,
            websiteUrl: null,
            attachmentName: null,
            attachmentPath: null,
            notes: "Cliente inicial",
            source: "manual",
            status: "active",
            createdAt: "2026-03-20T00:00:00.000Z",
            updatedAt: "2026-03-26T00:00:00.000Z"
          }
        ]}
      />
    </I18nextProvider>
  );
}

describe("customer operations panel", () => {
  it("submits a live customer create mutation", async () => {
    const mutationState = buildMutationState();
    customerMutationMocks.useCustomerMutations.mockReturnValue(mutationState);
    const user = userEvent.setup();

    renderPanel();

    await user.type(
      screen.getAllByLabelText(/Nombre visible/i)[0],
      "Apex Machine Works"
    );
    await user.type(
      screen.getAllByLabelText(/Contacto principal/i)[0],
      "Maria Gomez"
    );
    await user.type(
      screen.getAllByLabelText(/Correo|Email/i)[0],
      "maria@apex.test"
    );
    await user.click(screen.getByRole("button", { name: /Guardar cliente/i }));

    expect(mutationState.createCustomerMutation.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: "Apex Machine Works",
        contactName: "Maria Gomez",
        email: "maria@apex.test"
      })
    );
  });

  it("submits a live customer update mutation", async () => {
    const mutationState = buildMutationState();
    customerMutationMocks.useCustomerMutations.mockReturnValue(mutationState);
    const user = userEvent.setup();

    renderPanel();

    const updateNameInput = screen.getAllByLabelText(/Nombre visible/i)[1];
    await user.clear(updateNameInput);
    await user.type(updateNameInput, "Northline Industrial Updated");
    await user.click(screen.getByRole("button", { name: /Actualizar cliente/i }));

    expect(mutationState.updateCustomerMutation.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "customer-1",
        displayName: "Northline Industrial Updated"
      })
    );
  });

  it("scopes customer forms away from auth autofill overlays", () => {
    const mutationState = buildMutationState();
    customerMutationMocks.useCustomerMutations.mockReturnValue(mutationState);

    const { container } = renderPanel();

    const createDisplayNameInput =
      container.querySelector<HTMLInputElement>("#create-customer-display-name");
    const createCustomerCodeInput =
      container.querySelector<HTMLInputElement>("#create-customer-code");
    const customerRecordSelect =
      container.querySelector<HTMLSelectElement>("#customer-record");
    const updateEmailInput =
      container.querySelector<HTMLInputElement>("#update-customer-email");

    expect(createDisplayNameInput).toHaveAttribute(
      "autocomplete",
      "section-create-customer organization"
    );
    expect(createDisplayNameInput).toHaveAttribute("data-1p-ignore", "true");
    expect(createCustomerCodeInput).toHaveAttribute("autocomplete", "off");
    expect(customerRecordSelect).toHaveAttribute("autocomplete", "off");
    expect(updateEmailInput).toHaveAttribute(
      "autocomplete",
      "section-update-customer email"
    );
  });
});
