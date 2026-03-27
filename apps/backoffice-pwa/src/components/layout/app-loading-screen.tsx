import { useTranslation } from "@operapyme/i18n";

import { Skeleton } from "@/components/ui/skeleton";

type AppLoadingScreenVariant = "workspace" | "module" | "setup";

function WorkspaceSkeleton() {
  return (
    <div className="min-h-screen bg-paper">
      <div className="flex min-h-screen">
        <aside className="hidden w-[272px] border-r border-line/70 bg-sidebar-surface px-3 py-4 lg:flex lg:flex-col">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-xl bg-white/12" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-28 bg-white/12" />
              <Skeleton className="h-3 w-20 bg-white/10" />
            </div>
          </div>

          <div className="mt-8 space-y-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton
                key={`workspace-nav-${index}`}
                className="h-11 w-full rounded-xl bg-white/10"
              />
            ))}
          </div>

          <div className="mt-auto rounded-3xl border border-white/10 p-4">
            <div className="flex items-center gap-3">
              <Skeleton className="size-10 rounded-full bg-white/12" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-24 bg-white/12" />
                <Skeleton className="h-3 w-18 bg-white/10" />
              </div>
            </div>
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="border-b border-line/70 bg-paper/95 px-4 py-3 backdrop-blur sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-screen-2xl items-center gap-4">
              <Skeleton className="size-10 rounded-xl lg:hidden" />
              <div className="min-w-0 flex-1 space-y-2">
                <Skeleton className="h-3.5 w-36" />
                <Skeleton className="h-3 w-64 max-w-full" />
              </div>
              <div className="hidden max-w-sm flex-1 lg:block">
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="size-10 rounded-xl" />
                <Skeleton className="size-10 rounded-xl" />
                <Skeleton className="h-10 w-28 rounded-xl sm:w-40" />
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-5">
              <div className="space-y-3">
                <Skeleton className="h-4 w-28 rounded-full" />
                <Skeleton className="h-10 w-80 max-w-full" />
                <Skeleton className="h-4 w-full max-w-2xl" />
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
                <div className="rounded-3xl border border-line/70 bg-paper/88 p-5 shadow-panel">
                  <div className="grid gap-4 sm:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div
                        key={`workspace-stat-${index}`}
                        className="rounded-3xl border border-line/60 bg-sand/35 p-4"
                      >
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="mt-4 h-8 w-24" />
                        <Skeleton className="mt-4 h-3 w-28" />
                      </div>
                    ))}
                  </div>
                  <div className="mt-5 rounded-3xl border border-line/60 p-4">
                    <Skeleton className="h-4 w-32" />
                    <div className="mt-4 space-y-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={`workspace-row-${index}`}
                          className="grid gap-3 sm:grid-cols-[1.4fr_0.8fr_0.5fr]"
                        >
                          <Skeleton className="h-11 w-full rounded-2xl" />
                          <Skeleton className="h-11 w-full rounded-2xl" />
                          <Skeleton className="h-11 w-full rounded-2xl" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-line/70 bg-paper/88 p-5 shadow-panel">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-24 w-full rounded-3xl" />
                  <Skeleton className="h-32 w-full rounded-3xl" />
                  <Skeleton className="h-14 w-full rounded-full" />
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

function SetupSkeleton() {
  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10 sm:px-6">
      <div className="grid w-full gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="rounded-3xl border border-line/70 bg-paper p-5 shadow-panel sm:p-6">
          <div className="space-y-5">
            <Skeleton className="h-3 w-40 rounded-full" />
            <Skeleton className="h-14 w-full max-w-xl" />
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-4/5 max-w-lg" />
            <div className="grid gap-3 sm:grid-cols-2">
              <Skeleton className="h-40 w-full rounded-3xl" />
              <Skeleton className="h-40 w-full rounded-3xl" />
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-line/70 bg-paper/88 p-5 shadow-panel sm:p-6">
          <div className="space-y-5">
            <Skeleton className="h-7 w-44" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-12 w-full rounded-2xl" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-12 w-full rounded-2xl" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="h-12 w-full rounded-full" />
            <Skeleton className="h-28 w-full rounded-3xl" />
            <Skeleton className="h-28 w-full rounded-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ModuleSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-5 px-4 py-5 sm:px-6 lg:px-8">
      <div className="space-y-3">
        <Skeleton className="h-3.5 w-24 rounded-full" />
        <Skeleton className="h-9 w-64 max-w-full" />
        <Skeleton className="h-4 w-full max-w-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={`module-card-${index}`}
            className="rounded-3xl border border-line/70 bg-paper/88 p-4 shadow-panel sm:p-5"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-8 w-20" />
            <Skeleton className="mt-4 h-3 w-28" />
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-line/70 bg-paper/88 p-4 shadow-panel sm:p-5">
        <Skeleton className="h-4 w-36" />
        <div className="mt-5 space-y-3">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`module-row-${index}`}
              className="grid gap-3 sm:grid-cols-[1.2fr_0.8fr_0.6fr]"
            >
              <Skeleton className="h-11 w-full rounded-2xl" />
              <Skeleton className="h-11 w-full rounded-2xl" />
              <Skeleton className="h-11 w-full rounded-2xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppLoadingScreen({
  variant = "workspace"
}: {
  variant?: AppLoadingScreenVariant;
}) {
  const { t } = useTranslation("common");

  if (variant === "setup") {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        className="min-h-screen bg-paper"
      >
        <div className="px-4 pt-10 text-center sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">
            {t("states.loadingSetupTitle")}
          </p>
          <p className="mt-3 text-sm leading-6 text-ink-soft">
            {t("states.loadingSetupDescription")}
          </p>
        </div>
        <SetupSkeleton />
      </div>
    );
  }

  if (variant === "module") {
    return (
      <div aria-busy="true" aria-live="polite" className="py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-ink-soft">
            {t("states.loadingModule")}
          </p>
        </div>
        <ModuleSkeleton />
      </div>
    );
  }

  return (
    <div aria-busy="true" aria-live="polite" className="relative">
      <div className="absolute inset-x-0 top-0 z-10 px-4 pt-6 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-screen-2xl">
          <div className="max-w-md rounded-3xl border border-line/70 bg-paper/92 px-5 py-4 shadow-panel backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-ink-muted">
              {t("states.loadingWorkspaceTitle")}
            </p>
            <p className="mt-2 text-sm leading-6 text-ink-soft">
              {t("states.loadingWorkspaceDescription")}
            </p>
          </div>
        </div>
      </div>
      <WorkspaceSkeleton />
    </div>
  );
}
