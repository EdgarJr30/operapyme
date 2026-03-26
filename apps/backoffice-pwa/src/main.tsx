import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { setupBackofficeI18n } from "@/app/i18n";
import { registerBackofficeServiceWorker } from "@/app/pwa";
import { AppProviders } from "@/app/providers";
import { createAppRouter } from "@/app/router";

import "@/app/styles.css";

registerBackofficeServiceWorker();

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Backoffice root element was not found.");
}

const root = ReactDOM.createRoot(rootElement);

try {
  const i18n = setupBackofficeI18n();
  const router = createAppRouter();

  root.render(
    <React.StrictMode>
      <AppProviders i18n={i18n}>
        <RouterProvider router={router} />
      </AppProviders>
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to initialize backoffice i18n.", error);

  root.render(
    <React.StrictMode>
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="max-w-md rounded-[28px] border border-line bg-paper/90 p-6 text-center shadow-panel">
          <p className="text-sm font-semibold text-ink">
            No se pudo iniciar el sistema de idioma.
          </p>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            Revisa la consola del navegador para mas detalle.
          </p>
        </div>
      </div>
    </React.StrictMode>
  );
}
