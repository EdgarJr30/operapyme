import { CheckCircle, Download } from "lucide-react";

import { useTranslation } from "@operapyme/i18n";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { downloadErrorReport } from "../lib/generate-error-report";
import type { ImportWizardControls } from "../use-import-wizard-state";

interface ImportStepCompleteProps {
  controls: ImportWizardControls;
}

const entityListPath: Record<string, string> = {
  customer: "/commercial/customers",
  lead: "/commercial/leads",
  catalog_item: "/catalog"
};

export function ImportStepComplete({ controls }: ImportStepCompleteProps) {
  const { t } = useTranslation("backoffice");
  const { state, reset } = controls;
  const { completeSummary, entityType, validationSummary } = state;

  if (!completeSummary) return null;

  async function handleDownloadErrors() {
    if (!validationSummary || !entityType) return;
    await downloadErrorReport(validationSummary.invalidRows, entityType);
  }

  const listPath = entityType ? entityListPath[entityType] : "/";
  const hasErrors = completeSummary.rowsErrored > 0 || (validationSummary?.invalidCount ?? 0) > 0;

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <CheckCircle className="size-12 text-green-500" aria-hidden />
        <h2 className="text-xl font-semibold text-ink">{t("import.complete.title")}</h2>
        <p className="text-sm text-ink-soft">{t("import.complete.description")}</p>
      </div>

      {/* Summary counters */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-base">Resumen de la importacion</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryItem
              value={completeSummary.rowsCreated}
              label={t("import.complete.created", { count: completeSummary.rowsCreated })}
              color="green"
            />
            <SummaryItem
              value={completeSummary.rowsUpdated}
              label={t("import.complete.updated", { count: completeSummary.rowsUpdated })}
              color="blue"
            />
            <SummaryItem
              value={completeSummary.rowsSkipped}
              label={t("import.complete.skipped", { count: completeSummary.rowsSkipped })}
              color="yellow"
            />
            <SummaryItem
              value={completeSummary.rowsErrored}
              label={t("import.complete.errored", { count: completeSummary.rowsErrored })}
              color={completeSummary.rowsErrored > 0 ? "red" : "gray"}
            />
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        {hasErrors && (
          <Button variant="secondary" onClick={handleDownloadErrors}>
            <Download className="mr-2 size-4" aria-hidden />
            {t("import.complete.downloadErrorReport")}
          </Button>
        )}

        <Link
          to={listPath}
          className="inline-flex h-12 min-w-11 items-center justify-center rounded-full border border-line-strong bg-paper/90 px-4 text-sm font-medium tracking-tight text-ink shadow-panel transition duration-200 ease-out hover:bg-sand-strong/80 sm:h-11"
        >
          {t("import.complete.viewImportedRecords")}
        </Link>

        <Button onClick={reset}>
          {t("import.complete.importMore")}
        </Button>
      </div>
    </div>
  );
}

function SummaryItem({
  value,
  label,
  color
}: {
  value: number;
  label: string;
  color: "green" | "blue" | "yellow" | "red" | "gray";
}) {
  const colorMap = {
    green: "text-green-700",
    blue: "text-blue-700",
    yellow: "text-yellow-700",
    red: "text-red-700",
    gray: "text-ink-muted"
  };

  return (
    <div className="flex flex-col gap-1 rounded-xl border border-line bg-surface p-3">
      <span className={`text-2xl font-semibold ${colorMap[color]}`}>{value}</span>
      <span className="text-xs text-ink-muted leading-tight">{label}</span>
    </div>
  );
}
