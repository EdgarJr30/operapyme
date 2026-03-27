import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { I18nextProvider } from "@operapyme/i18n";

import { setupBackofficeI18n } from "@/app/i18n";
import { LearningPage } from "@/modules/learning/learning-page";

function renderPage() {
  const i18n = setupBackofficeI18n();

  return render(
    <MemoryRouter>
      <I18nextProvider i18n={i18n}>
        <LearningPage />
      </I18nextProvider>
    </MemoryRouter>
  );
}

describe("learning page", () => {
  it("renders operational guides outside the quote runtime", async () => {
    renderPage();

    expect(
      await screen.findByRole("heading", {
        name: /Guias rapidas para avanzar con seguridad/i
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Ir a nueva cotizacion/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Menos friccion al trabajar/i)).toBeInTheDocument();
  });
});
