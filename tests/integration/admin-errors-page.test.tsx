import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { setupBackofficeI18n } from "@/app/i18n";
import { AppProviders } from "@/app/providers";
import { AdminErrorsPage } from "@/modules/admin/admin-errors-page";

function renderRoute(route: string) {
  const i18n = setupBackofficeI18n();

  return render(
    <AppProviders i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>
        <AdminErrorsPage />
      </MemoryRouter>
    </AppProviders>
  );
}

describe("admin errors page", () => {
  it("renders the reserved operational error panel", async () => {
    renderRoute("/admin/errors");

    expect(
      await screen.findByRole("heading", {
        name: /Panel reservado para errores operativos/i
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/stress-harness/i).length).toBeGreaterThan(0);
  });
});
