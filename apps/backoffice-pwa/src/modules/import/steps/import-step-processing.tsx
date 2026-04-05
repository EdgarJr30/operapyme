import { useEffect } from "react";

import { useTranslation } from "@operapyme/i18n";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { ImportWizardControls, WizardCompleteSummary } from "../use-import-wizard-state";
import { useImportProcessor } from "../use-import-processor";

interface ImportStepProcessingProps {
  controls: ImportWizardControls;
  onComplete: (summary: WizardCompleteSummary) => void;
}

export function ImportStepProcessing({ controls, onComplete }: ImportStepProcessingProps) {
  const { t } = useTranslation("backoffice");
  const { progress, isProcessing, start, stop, resume } = useImportProcessor(
    controls,
    onComplete
  );

  // Auto-start on mount
  useEffect(() => {
    start();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const progressPct =
    progress.totalRows > 0
      ? Math.round((progress.processedRows / progress.totalRows) * 100)
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("import.processing.title")}</CardTitle>
          <CardDescription>{t("import.processing.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          {/* Progress bar */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm text-ink-soft">
              <span>
                {t("import.processing.batchProgress", {
                  current: progress.currentBatch,
                  total: progress.totalBatches || "—"
                })}
              </span>
              <span>{progressPct}%</span>
            </div>
            <div
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 w-full overflow-hidden rounded-full bg-line"
            >
              <div
                className="h-full rounded-full bg-accent transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-ink-muted">
              {t("import.processing.rowProgress", {
                processed: progress.processedRows,
                total: progress.totalRows
              })}
            </p>
          </div>

          {/* Counters */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <CounterCard label="Creados" value={progress.rowsCreated} color="green" />
            <CounterCard label="Actualizados" value={progress.rowsUpdated} color="blue" />
            <CounterCard label="Errores" value={progress.rowsErrored} color={progress.rowsErrored > 0 ? "red" : "gray"} />
            <CounterCard label="Pendientes" value={Math.max(0, progress.totalRows - progress.processedRows)} color="gray" />
          </div>

          {/* Batch error */}
          {progress.currentError && (
            <div
              role="alert"
              className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4"
            >
              <p className="text-sm font-medium text-red-700">
                {t("import.processing.batchErrorTitle", { batch: progress.currentBatch })}
              </p>
              <p className="text-sm text-red-600">{progress.currentError}</p>
              <div className="flex gap-2">
                <Button size="sm" variant="secondary" onClick={resume}>
                  {t("import.processing.continueOnError")}
                </Button>
              </div>
            </div>
          )}

          {/* Stop button */}
          {isProcessing && !progress.currentError && (
            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={stop}
                disabled={progress.isStopped}
              >
                {t("import.processing.stopOnError")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function CounterCard({
  label,
  value,
  color
}: {
  label: string;
  value: number;
  color: "green" | "blue" | "red" | "gray";
}) {
  const colorMap = {
    green: "text-green-700",
    blue: "text-blue-700",
    red: "text-red-700",
    gray: "text-ink-muted"
  };

  return (
    <div className="rounded-xl border border-line bg-surface p-3">
      <div className={`text-xl font-semibold ${colorMap[color]}`}>{value}</div>
      <div className="mt-1 text-xs text-ink-muted">{label}</div>
    </div>
  );
}
