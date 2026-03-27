import React from "react";
import { render } from "@testing-library/react";
import { vi } from "vitest";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { LeadIntakeForm } from "@/modules/crm/lead-intake-form";

const leadFormMocks = vi.hoisted(() => ({
  useBackofficeAuth: vi.fn(),
  useLeadMutations: vi.fn()
}));

vi.mock("@/app/auth-provider", () => ({
  useBackofficeAuth: leadFormMocks.useBackofficeAuth
}));

vi.mock("@/modules/crm/use-lead-mutations", () => ({
  useLeadMutations: leadFormMocks.useLeadMutations
}));

function buildMutationState() {
  return {
    createLeadMutation: {
      isError: false,
      isPending: false,
      mutateAsync: vi.fn().mockResolvedValue(undefined)
    }
  };
}

function renderForm() {
  const i18n = setupBackofficeI18n();

  return render(
    <I18nextProvider i18n={i18n}>
      <LeadIntakeForm />
    </I18nextProvider>
  );
}

describe("lead intake form", () => {
  it("uses scoped autofill semantics for CRM lead capture", () => {
    leadFormMocks.useBackofficeAuth.mockReturnValue({
      activeTenantId: "tenant-1"
    });
    leadFormMocks.useLeadMutations.mockReturnValue(buildMutationState());

    const { container } = renderForm();

    const form = container.querySelector("form");
    const companyInput = container.querySelector<HTMLInputElement>("#company");
    const contactNameInput =
      container.querySelector<HTMLInputElement>("#contactName");
    const sourceSelect = container.querySelector<HTMLSelectElement>("#source");
    const summaryTextarea =
      container.querySelector<HTMLTextAreaElement>("#needSummary");

    expect(form).toHaveAttribute("autocomplete", "off");
    expect(form).toHaveAttribute("data-bwignore", "true");
    expect(companyInput).toHaveAttribute(
      "autocomplete",
      "section-crm-lead organization"
    );
    expect(contactNameInput).toHaveAttribute(
      "autocomplete",
      "section-crm-lead name"
    );
    expect(sourceSelect).toHaveAttribute("autocomplete", "off");
    expect(summaryTextarea).toHaveAttribute("data-protonpass-ignore", "true");
  });
});
