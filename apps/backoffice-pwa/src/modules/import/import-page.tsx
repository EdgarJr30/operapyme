import { useTranslation } from "@operapyme/i18n";

import { ImportHistoryPanel } from "./import-history-panel";
import { ImportWizard } from "./import-wizard";

export function ImportPage() {
  const { t } = useTranslation("backoffice");

  return (
    <div className="flex flex-col gap-8 px-4 py-6 sm:px-6">
      {/* Page header */}
      <div className="flex flex-col gap-1">
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-ink-muted">
          {t("import.page.eyebrow")}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink">
          {t("import.page.title")}
        </h1>
        <p className="text-sm leading-6 text-ink-soft">
          {t("import.page.description")}
        </p>
      </div>

      {/* Wizard */}
      <ImportWizard />

      {/* History */}
      <ImportHistoryPanel />
    </div>
  );
}
