import React from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { CommercialCustomersPage } from "@/modules/commercial/commercial-customers-page";

const customersPageMocks = vi.hoisted(() => ({
  useCustomerMutations: vi.fn(),
  useCustomersData: vi.fn()
}));

const toastMocks = vi.hoisted(() => ({
  error: vi.fn(),
  success: vi.fn()
}));

vi.mock("@/modules/crm/use-customers-data", () => ({
  useCustomersData: customersPageMocks.useCustomersData
}));

vi.mock("@/modules/crm/use-customer-mutations", () => ({
  useCustomerMutations: customersPageMocks.useCustomerMutations
}));

vi.mock("sonner", () => ({
  toast: toastMocks
}));

const allCustomers = [
  {
    id: "customer-1",
    customerCode: "CLI-001",
    displayName: "MoonCode Demo",
    contactName: "Edgar Perez",
    legalName: "MoonCode Demo SRL",
    email: "edgar@mooncode.test",
    whatsapp: "+1 809 555 0100",
    phone: null,
    documentId: null,
    notes: "Cliente operativo",
    source: "whatsapp",
    status: "active",
    updatedAt: "2026-04-03T00:00:00.000Z"
  },
  {
    id: "customer-2",
    customerCode: "CLI-002",
    displayName: "Archived Labs",
    contactName: "Maria Perez",
    legalName: "Archived Labs SRL",
    email: "maria@archived.test",
    whatsapp: null,
    phone: null,
    documentId: null,
    notes: null,
    source: "manual",
    status: "archived",
    updatedAt: "2026-04-02T00:00:00.000Z"
  }
];

function buildMutationState() {
  return {
    archiveCustomerMutation: {
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined)
    },
    createCustomerMutation: {
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined)
    },
    updateCustomerMutation: {
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined)
    }
  };
}

function renderPage() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <CommercialCustomersPage />
    </I18nextProvider>
  );
}

describe("commercial customers page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    customersPageMocks.useCustomerMutations.mockReturnValue(
      buildMutationState()
    );
    customersPageMocks.useCustomersData.mockImplementation(
      (options?: { statuses?: string[] }) => {
        const statuses = options?.statuses ?? [];
        const filteredCustomers =
          statuses.length === 0
            ? allCustomers
            : allCustomers.filter((customer) => statuses.includes(customer.status));

        return {
          data: filteredCustomers,
          error: null,
          hasTenantContext: true,
          isError: false,
          isLoading: false,
          refetch: vi.fn()
        };
      }
    );
  });

  it("starts in a table-first operational view and can switch to archived records", async () => {
    const user = userEvent.setup();

    renderPage();

    expect((await screen.findAllByRole("heading", { name: /Clientes/i })).length)
      .toBeGreaterThan(0);
    expect(screen.getByText(/MoonCode Demo/i)).toBeInTheDocument();
    expect(screen.queryByText(/Archived Labs/i)).not.toBeInTheDocument();

    await user.selectOptions(screen.getByRole("combobox"), "archived");

    expect(await screen.findByText(/Archived Labs/i)).toBeInTheDocument();
    expect(screen.queryByText(/MoonCode Demo/i)).not.toBeInTheDocument();
  });

  it("creates customers from the modal instead of an embedded form", async () => {
    const mutationState = buildMutationState();
    customersPageMocks.useCustomerMutations.mockReturnValue(mutationState);
    const user = userEvent.setup();

    renderPage();

    await user.click(
      await screen.findByRole("button", { name: /Nuevo cliente/i })
    );
    await user.type(screen.getByLabelText(/Nombre visible/i), "Apex Machine Works");
    await user.type(screen.getByLabelText(/Contacto principal/i), "Maria Gomez");
    await user.click(screen.getByRole("button", { name: /Guardar cliente/i }));

    expect(mutationState.createCustomerMutation.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        displayName: "Apex Machine Works",
        contactName: "Maria Gomez",
        source: "manual",
        status: "active"
      })
    );
  });

  it("edits and archives customers from row actions", async () => {
    const mutationState = buildMutationState();
    customersPageMocks.useCustomerMutations.mockReturnValue(mutationState);
    const user = userEvent.setup();

    renderPage();

    await user.click(await screen.findByRole("button", { name: /^Editar$/i }));

    const dialog = await screen.findByRole("dialog");
    const displayNameInput = within(dialog).getByLabelText(/Nombre visible/i);
    await user.clear(displayNameInput);
    await user.type(displayNameInput, "MoonCode Updated");
    await user.click(screen.getByRole("button", { name: /Actualizar cliente/i }));

    expect(mutationState.updateCustomerMutation.mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        customerId: "customer-1",
        displayName: "MoonCode Updated"
      })
    );

    await user.click(await screen.findByRole("button", { name: /^Archivar$/i }));

    expect(
      mutationState.archiveCustomerMutation.mutateAsync
    ).toHaveBeenCalledWith({
      customerId: "customer-1"
    });
  });
});
