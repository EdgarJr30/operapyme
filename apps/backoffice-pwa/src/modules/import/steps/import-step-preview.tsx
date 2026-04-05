import { useEffect, useMemo, useState } from "react";

import { useTranslation } from "@operapyme/i18n";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { applyMapping } from "../lib/column-mapping";
import { validateRows } from "../lib/validate-rows";
import type { RowValidationError } from "../lib/validate-rows";
import type { ImportWizardControls } from "../use-import-wizard-state";

interface ImportStepPreviewProps {
  controls: ImportWizardControls;
  onNext: () => void;
  onBack: () => void;
}

const PAGE_SIZE = 20;

export function ImportStepPreview({ controls, onNext, onBack }: ImportStepPreviewProps) {
  const { t } = useTranslation("backoffice");
  const { state, setValidationSummary, setSkipInvalidRows } = controls;
  const [showErrorsOnly, setShowErrorsOnly] = useState(false);
  const [page, setPage] = useState(0);

  const mappedRows = useMemo(() => {
    if (!state.parsedFile || !state.entityType) return [];
    return state.parsedFile.rows.map((row) => applyMapping(row, state.columnMapping));
  }, [state.parsedFile, state.columnMapping, state.entityType]);

  // Run validation once on mount or when returning to this step
  useEffect(() => {
    if (!state.entityType || mappedRows.length === 0) return;
    const summary = validateRows(mappedRows, state.entityType);
    setValidationSummary(summary);
  }, [mappedRows, state.entityType]); // eslint-disable-line react-hooks/exhaustive-deps

  const summary = state.validationSummary;
  if (!summary) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-sm text-ink-muted">Validando filas...</p>
      </div>
    );
  }

  const displayRows = showErrorsOnly ? summary.invalidRows : [...summary.validRows, ...summary.invalidRows].sort((a, b) => a.rowNumber - b.rowNumber);
  const paged = displayRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(displayRows.length / PAGE_SIZE);

  function handleContinue() {
    setSkipInvalidRows(true);
    onNext();
  }

  const hasErrors = summary.invalidCount > 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryCard
          value={summary.validCount}
          label={t("import.preview.validRows", { count: summary.validCount })}
          color="green"
        />
        <SummaryCard
          value={summary.invalidCount}
          label={t("import.preview.invalidRows", { count: summary.invalidCount })}
          color={hasErrors ? "red" : "gray"}
        />
        <SummaryCard
          value={summary.duplicateInFileCount}
          label={t("import.preview.duplicateRows", { count: summary.duplicateInFileCount })}
          color={summary.duplicateInFileCount > 0 ? "yellow" : "gray"}
        />
        <SummaryCard
          value={summary.totalRows}
          label="Total de filas"
          color="gray"
        />
      </div>

      {/* No errors */}
      {!hasErrors && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {t("import.preview.noErrors")}
        </div>
      )}

      {/* Error table */}
      {hasErrors && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between gap-4">
              <div>
                <CardTitle className="text-base">Errores de validacion</CardTitle>
                <CardDescription>Revisa y decide si continuar o volver a corregir.</CardDescription>
              </div>
              <button
                type="button"
                onClick={() => { setShowErrorsOnly((v) => !v); setPage(0); }}
                className="cursor-pointer text-xs text-accent underline"
              >
                {showErrorsOnly
                  ? t("import.preview.showAllRows")
                  : t("import.preview.showErrorsOnly")}
              </button>
            </div>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="pb-2 pr-3 text-left text-xs font-medium text-ink-muted">
                    {t("import.preview.errorTableRow")}
                  </th>
                  <th className="pb-2 pr-3 text-left text-xs font-medium text-ink-muted">
                    {t("import.preview.errorTableField")}
                  </th>
                  <th className="pb-2 pr-3 text-left text-xs font-medium text-ink-muted">
                    {t("import.preview.errorTableError")}
                  </th>
                  <th className="pb-2 text-left text-xs font-medium text-ink-muted">
                    {t("import.preview.errorTableValue")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {paged.map((row) =>
                  row.errors.length > 0
                    ? row.errors.map((err: RowValidationError, i: number) => (
                        <tr key={`${row.rowNumber}-${i}`} className="border-t border-line">
                          {i === 0 && (
                            <td rowSpan={row.errors.length} className="py-2 pr-3 font-medium text-ink-muted">
                              {row.rowNumber}
                            </td>
                          )}
                          <td className="py-2 pr-3 text-ink-soft">{err.field}</td>
                          <td className="py-2 pr-3 text-red-600">{err.message}</td>
                          <td className="py-2 text-ink-muted">{err.value || "—"}</td>
                        </tr>
                      ))
                    : (
                        <tr key={row.rowNumber} className="border-t border-line">
                          <td className="py-2 pr-3 font-medium text-ink-muted">{row.rowNumber}</td>
                          <td colSpan={3} className="py-2 text-green-600 text-xs">Sin errores</td>
                        </tr>
                      )
                )}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between text-xs text-ink-muted">
                <button
                  type="button"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                  className="cursor-pointer disabled:opacity-40"
                >
                  ← Anterior
                </button>
                <span>
                  Pagina {page + 1} de {totalPages}
                </span>
                <button
                  type="button"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                  className="cursor-pointer disabled:opacity-40"
                >
                  Siguiente →
                </button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
        <Button variant="secondary" onClick={onBack}>
          ← {t("import.steps.mapping")}
        </Button>
        <div className="flex flex-col gap-2 sm:flex-row">
          {hasErrors && (
            <Button variant="secondary" onClick={onBack}>
              {t("import.preview.goBackToFix")}
            </Button>
          )}
          <Button
            onClick={handleContinue}
            disabled={summary.validCount === 0}
            className="min-w-45"
          >
            {hasErrors
              ? t("import.preview.continueWithErrors")
              : t("import.steps.processing") + " →"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  value,
  label,
  color
}: {
  value: number;
  label: string;
  color: "green" | "red" | "yellow" | "gray";
}) {
  const colorMap = {
    green: "border-green-200 bg-green-50 text-green-700",
    red: "border-red-200 bg-red-50 text-red-700",
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-700",
    gray: "border-line bg-surface text-ink-soft"
  };

  return (
    <div className={`rounded-xl border p-3 ${colorMap[color]}`}>
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs leading-tight">{label}</div>
    </div>
  );
}
