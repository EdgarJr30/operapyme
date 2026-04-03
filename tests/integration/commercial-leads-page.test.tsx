import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { CommercialLeadsPage } from "@/modules/commercial/commercial-leads-page";

const leadsPageMocks = vi.hoisted(() => ({
  useLeadMutations: vi.fn(),
  useLeadsData: vi.fn()
}));

const toastMocks = vi.hoisted(() => ({
  error: vi.fn(),
  success: vi.fn()
}));

vi.mock("@/modules/crm/use-leads-data", () => ({
  useLeadsData: leadsPageMocks.useLeadsData
}));

vi.mock("@/modules/crm/use-lead-mutations", () => ({
  useLeadMutations: leadsPageMocks.useLeadMutations
}));

vi.mock("@/modules/crm/lead-intake-form", () => ({
  LeadIntakeForm: () => <div>Lead intake stub</div>
}));

vi.mock("sonner", () => ({
  toast: toastMocks
}));

function createDeferredPromise() {
  let resolvePromise: (value?: unknown) => void = () => undefined;
  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });

  return {
    promise,
    resolve: resolvePromise
  };
}

function renderPage() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <CommercialLeadsPage />
    </I18nextProvider>
  );
}

describe("commercial leads page", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    leadsPageMocks.useLeadsData.mockReturnValue({
      data: [
        {
          id: "lead-1",
          displayName: "MoonCode",
          contactName: "Edgar Perez",
          email: "edgar@mooncode.test",
          whatsapp: null,
          source: "manual",
          status: "qualified",
          needSummary: "Otra prueba es esto",
          notes: "Listo para cotizar",
          convertedCustomerId: null,
          convertedAt: null,
          updatedAt: "2026-04-03T00:00:00.000Z"
        },
        {
          id: "lead-2",
          displayName: "Northline",
          contactName: "Maria Gomez",
          email: "maria@northline.test",
          whatsapp: null,
          source: "manual",
          status: "proposal",
          needSummary: "Ya convertido",
          notes: null,
          convertedCustomerId: "customer-2",
          convertedAt: "2026-04-02T00:00:00.000Z",
          updatedAt: "2026-04-02T00:00:00.000Z"
        }
      ],
      error: null,
      hasTenantContext: true,
      isError: false,
      isLoading: false,
      refetch: vi.fn()
    });
  });

  it("keeps already converted leads disabled in the table", async () => {
    leadsPageMocks.useLeadMutations.mockReturnValue({
      convertLeadToCustomerMutation: {
        isPending: false,
        mutateAsync: vi.fn().mockResolvedValue("customer-1")
      },
      createLeadMutation: {
        isPending: false,
        mutateAsync: vi.fn().mockResolvedValue(undefined)
      }
    });

    renderPage();

    const convertedRow = (await screen.findByText(/Northline/i)).closest("tr");
    const convertedButton = convertedRow
      ? screen.getAllByRole("button", { name: /Pasar a cliente/i })[1]
      : null;

    expect(convertedButton).toBeDisabled();
  });

  it("converts operational leads once and blocks repeated clicks while pending", async () => {
    const deferred = createDeferredPromise();
    const mutateAsync = vi.fn().mockReturnValue(deferred.promise);
    leadsPageMocks.useLeadMutations.mockReturnValue({
      convertLeadToCustomerMutation: {
        isPending: false,
        mutateAsync
      },
      createLeadMutation: {
        isPending: false,
        mutateAsync: vi.fn().mockResolvedValue(undefined)
      }
    });
    const user = userEvent.setup();

    renderPage();

    const buttons = await screen.findAllByRole("button", {
      name: /Pasar a cliente/i
    });
    await user.click(buttons[0]);

    expect(mutateAsync).toHaveBeenCalledWith({
      leadId: "lead-1"
    });
    expect(
      await screen.findByRole("button", { name: /Convirtiendo/i })
    ).toBeDisabled();

    deferred.resolve("customer-1");
    await deferred.promise;
  });
});
