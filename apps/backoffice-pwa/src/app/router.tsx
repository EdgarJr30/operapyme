import { Suspense, lazy, type ReactNode } from "react";

import { useTranslation } from "@operapyme/i18n";
import {
  Navigate,
  Outlet,
  createBrowserRouter,
  type RouteObject,
  useLocation
} from "react-router-dom";

import { useBackofficeAuth } from "@/app/auth-provider";
import { RequireGlobalAdmin } from "@/components/guards/require-global-admin";
import { AppLoadingScreen } from "@/components/layout/app-loading-screen";

const AuthCallbackPage = lazy(async () => {
  const module = await import("@/modules/auth/auth-callback-page");

  return { default: module.AuthCallbackPage };
});

const AuthPage = lazy(async () => {
  const module = await import("@/modules/auth/auth-page");

  return { default: module.AuthPage };
});

const UnconfiguredPage = lazy(async () => {
  const module = await import("@/modules/auth/unconfigured-page");

  return { default: module.UnconfiguredPage };
});

const PublicLandingPage = lazy(async () => {
  const module = await import("@/modules/public/public-landing-page");

  return { default: module.PublicLandingPage };
});

const SetupTenantPage = lazy(async () => {
  const module = await import("@/modules/setup/setup-tenant-page");

  return { default: module.SetupTenantPage };
});

const BackofficeDataProvider = lazy(async () => {
  const module = await import("@/app/backoffice-data-provider");

  return { default: module.BackofficeDataProvider };
});

const AppShell = lazy(async () => {
  const module = await import("@/components/layout/app-shell");

  return { default: module.AppShell };
});

function NotFoundPage() {
  const { t } = useTranslation("common");

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-3xl border border-line/70 bg-paper p-8 text-center shadow-panel">
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
  return <AppLoadingScreen variant="module" />;
}

function isPublicSurfacePath(pathname: string) {
  return pathname === "/" || pathname.startsWith("/auth");
}

function AuthStatusBoundary({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { isAccessContextLoading, isConfigured, status } = useBackofficeAuth();
  const publicVariant = isPublicSurfacePath(location.pathname)
    ? "public"
    : "workspace";

  if (!isConfigured || status === "unconfigured") {
    return (
      <Suspense fallback={<AppLoadingScreen variant={publicVariant} />}>
        <UnconfiguredPage />
      </Suspense>
    );
  }

  if (status === "loading") {
    return <AppLoadingScreen variant={publicVariant} />;
  }

  if (status === "signed_in" && isAccessContextLoading) {
    return <AppLoadingScreen variant="workspace" />;
  }

  return children;
}

function AuthOnlyRoute() {
  const { isBootstrapped, status } = useBackofficeAuth();

  return (
    <AuthStatusBoundary>
      {status === "signed_in" ? (
        <Navigate replace to={isBootstrapped ? "/" : "/setup"} />
      ) : (
        <Suspense fallback={<AppLoadingScreen variant="public" />}>
          <AuthPage />
        </Suspense>
      )}
    </AuthStatusBoundary>
  );
}

function RequireSignedIn() {
  const { status } = useBackofficeAuth();

  return (
    <AuthStatusBoundary>
      {status === "signed_in" ? <Outlet /> : <Navigate replace to="/auth" />}
    </AuthStatusBoundary>
  );
}

function RequireBootstrappedShell() {
  const { isBootstrapped, status } = useBackofficeAuth();
  const location = useLocation();

  return (
    <AuthStatusBoundary>
      {status === "signed_in" ? (
        isBootstrapped ? (
          <Suspense fallback={<AppLoadingScreen variant="workspace" />}>
            <BackofficeDataProvider>
              <AppShell />
            </BackofficeDataProvider>
          </Suspense>
        ) : (
          <Navigate replace to="/setup" />
        )
      ) : location.pathname === "/" ? (
        <Suspense fallback={<AppLoadingScreen variant="public" />}>
          <PublicLandingPage />
        </Suspense>
      ) : (
        <Navigate replace to="/auth" />
      )}
    </AuthStatusBoundary>
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

async function loadCommercialRoute() {
  const { CommercialPage } = await import("@/modules/commercial/commercial-page");

  return {
    Component: function CommercialRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <CommercialPage />
        </Suspense>
      );
    }
  };
}

async function loadCommercialLeadsRoute() {
  const { CommercialLeadsPage } = await import(
    "@/modules/commercial/commercial-leads-page"
  );

  return {
    Component: function CommercialLeadsRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <CommercialLeadsPage />
        </Suspense>
      );
    }
  };
}

async function loadCommercialCustomersRoute() {
  const { CommercialCustomersPage } = await import(
    "@/modules/commercial/commercial-customers-page"
  );

  return {
    Component: function CommercialCustomersRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <CommercialCustomersPage />
        </Suspense>
      );
    }
  };
}

async function loadCommercialQuotesRoute() {
  const { CommercialQuotesPage } = await import(
    "@/modules/commercial/commercial-quotes-page"
  );

  return {
    Component: function CommercialQuotesRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <CommercialQuotesPage />
        </Suspense>
      );
    }
  };
}

async function loadCommercialInvoicesRoute() {
  const { CommercialInvoicesPage } = await import(
    "@/modules/commercial/commercial-invoices-page"
  );

  return {
    Component: function CommercialInvoicesRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <CommercialInvoicesPage />
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

async function loadLearningRoute() {
  const { LearningPage } = await import("@/modules/learning/learning-page");

  return {
    Component: function LearningRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <LearningPage />
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

async function loadProfileRoute() {
  const { ProfilePage } = await import("@/modules/profile/profile-page");

  return {
    Component: function ProfileRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <ProfilePage />
        </Suspense>
      );
    }
  };
}

async function loadAdminAuditRoute() {
  const { AdminAuditPage } = await import("@/modules/admin/admin-audit-page");

  return {
    Component: function AdminAuditRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <AdminAuditPage />
        </Suspense>
      );
    }
  };
}

async function loadAdminErrorsRoute() {
  const { AdminErrorsPage } = await import("@/modules/admin/admin-errors-page");

  return {
    Component: function AdminErrorsRoute() {
      return (
        <Suspense fallback={<RouteLoader />}>
          <AdminErrorsPage />
        </Suspense>
      );
    }
  };
}

export const appRoutes: RouteObject[] = [
  {
    path: "/auth",
    element: <AuthOnlyRoute />
  },
  {
    path: "/auth/callback",
    element: (
      <Suspense fallback={<AppLoadingScreen variant="public" />}>
        <AuthCallbackPage />
      </Suspense>
    )
  },
  {
    path: "/setup",
    element: <RequireSignedIn />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<AppLoadingScreen variant="setup" />}>
            <SetupTenantPage />
          </Suspense>
        )
      }
    ]
  },
  {
    path: "/",
    element: <RequireBootstrappedShell />,
    errorElement: <NotFoundPage />,
    children: [
      {
        index: true,
        lazy: loadDashboardRoute
      },
      {
        path: "commercial",
        lazy: loadCommercialRoute
      },
      {
        path: "commercial/leads",
        lazy: loadCommercialLeadsRoute
      },
      {
        path: "commercial/customers",
        lazy: loadCommercialCustomersRoute
      },
      {
        path: "commercial/quotes",
        lazy: loadCommercialQuotesRoute
      },
      {
        path: "commercial/invoices",
        lazy: loadCommercialInvoicesRoute
      },
      {
        path: "crm",
        element: <Navigate replace to="/commercial/leads" />
      },
      {
        path: "catalog",
        lazy: loadCatalogRoute
      },
      {
        path: "quotes",
        element: <Navigate replace to="/commercial/quotes" />
      },
      {
        path: "quotes/new",
        element: <Navigate replace to="/commercial/quotes?tab=create" />
      },
      {
        path: "quotes/manage",
        element: <Navigate replace to="/commercial/quotes?tab=manage" />
      },
      {
        path: "learning",
        lazy: loadLearningRoute
      },
      {
        path: "admin",
        lazy: async () => {
          const route = await loadAdminAuditRoute();

          return {
            Component: function GuardedAdminAuditRoute() {
              const Component = route.Component;

              return (
                <RequireGlobalAdmin>
                  <Component />
                </RequireGlobalAdmin>
              );
            }
          };
        }
      },
      {
        path: "admin/errors",
        lazy: async () => {
          const route = await loadAdminErrorsRoute();

          return {
            Component: function GuardedAdminErrorsRoute() {
              const Component = route.Component;

              return (
                <RequireGlobalAdmin>
                  <Component />
                </RequireGlobalAdmin>
              );
            }
          };
        }
      },
      {
        path: "settings",
        element: <Navigate replace to="/settings/general" />
      },
      {
        path: "settings/general",
        lazy: loadSettingsRoute
      },
      {
        path: "settings/tenant",
        lazy: loadSettingsRoute
      },
      {
        path: "settings/appearance",
        lazy: loadSettingsRoute
      },
      {
        path: "settings/team",
        lazy: loadSettingsRoute
      },
      {
        path: "settings/security",
        lazy: loadSettingsRoute
      },
      {
        path: "profile",
        lazy: loadProfileRoute
      }
    ]
  }
];

export function createAppRouter() {
  return createBrowserRouter(appRoutes);
}
