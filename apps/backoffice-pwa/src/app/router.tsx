import { Suspense } from "react";

import { useTranslation } from "@operapyme/i18n";
import { createBrowserRouter } from "react-router-dom";

import { AppShell } from "@/components/layout/app-shell";

function NotFoundPage() {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-[28px] border border-line/70 bg-paper/90 p-8 text-center shadow-panel">
      <p className="text-sm font-medium uppercase tracking-[0.24em] text-ink-muted">
        {t("states.routeNotFoundEyebrow")}
      </p>
      <h1 className="max-w-md text-3xl font-semibold tracking-tight text-ink">
        {t("states.routeNotFoundTitle")}
      </h1>
      <p className="max-w-lg text-sm leading-6 text-ink-soft">
        {t("states.routeNotFoundDescription")}
      </p>
    </div>
  );
}

function RouteLoader() {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="rounded-full border border-line/70 bg-paper/80 px-4 py-2 text-sm text-ink-soft shadow-panel">
        {t("states.loadingModule")}
      </div>
    </div>
  );
}

async function loadDashboardRoute() {
  const { DashboardPage } = await import("@/modules/dashboard/dashboard-page");

  return {
    Component: function DashboardRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <DashboardPage />
        </Suspense>
      );
    }
  };
}

async function loadCrmRoute() {
  const { CrmPage } = await import("@/modules/crm/crm-page");

  return {
    Component: function CrmRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <CrmPage />
        </Suspense>
      );
    }
  };
}

async function loadCatalogRoute() {
  const { CatalogPage } = await import("@/modules/catalog/catalog-page");

  return {
    Component: function CatalogRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <CatalogPage />
        </Suspense>
      );
    }
  };
}

async function loadQuotesRoute() {
  const { QuotesPage } = await import("@/modules/quotes/quotes-page");

  return {
    Component: function QuotesRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <QuotesPage />
        </Suspense>
      );
    }
  };
}

async function loadSettingsRoute() {
  const { SettingsPage } = await import("@/modules/settings/settings-page");

  return {
    Component: function SettingsRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <SettingsPage />
        </Suspense>
      );
    }
  };
}

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        lazy: loadDashboardRoute
      },
      {
        path: "crm",
        lazy: loadCrmRoute
      },
      {
        path: "catalog",
        lazy: loadCatalogRoute
      },
      {
        path: "quotes",
        lazy: loadQuotesRoute
      },
      {
        path: "settings",
        lazy: loadSettingsRoute
      }
    ]
  }
]);
