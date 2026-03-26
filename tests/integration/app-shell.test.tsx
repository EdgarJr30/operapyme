import React from "react";
import { render, screen } from "@testing-library/react";
import {
  MemoryRouter,
  Route,
  Routes
} from "react-router-dom";

import { setupBackofficeI18n } from "@/app/i18n";
import { AppProviders } from "@/app/providers";
import { AppShell } from "@/components/layout/app-shell";
import { AdminAuditPage } from "@/modules/admin/admin-audit-page";
import { AdminErrorsPage } from "@/modules/admin/admin-errors-page";

function renderRoute(route: string) {
  const i18n = setupBackofficeI18n();

  return render(
    <AppProviders i18n={i18n}>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<div>Dashboard stub</div>} />
            <Route path="admin" element={<AdminAuditPage />} />
            <Route path="admin/errors" element={<AdminErrorsPage />} />
            <Route path="settings" element={<div>Settings stub</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AppProviders>
  );
}

describe("backoffice shell", () => {
  it("renders the new admin route and its reserved content", async () => {
    renderRoute("/admin");

    expect(
      await screen.findByRole("heading", {
        name: /Centro de auditoria y trazabilidad/i
      })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/global_admin/i).length).toBeGreaterThan(0);
  });

  it("keeps the admin entry visible in the primary navigation", async () => {
    renderRoute("/");

    expect((await screen.findAllByRole("link", { name: /^Admin$/i })).length).toBe(
      2
    );
  });
});
