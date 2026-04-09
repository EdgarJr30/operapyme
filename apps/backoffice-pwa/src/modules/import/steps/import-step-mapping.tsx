import { useEffect, useMemo } from "react";

import { useTranslation } from "@operapyme/i18n";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import {
  autoMapColumns,
  countMappedColumns,
  getMissingRequiredFields,
  applyMapping
} from "../lib/column-mapping";
import { getEntityFields } from "../lib/entity-field-definitions";
import { normalizeMappedRow } from "../lib/normalize-mapped-row";
import type { ImportWizardControls } from "../use-import-wizard-state";

interface ImportStepMappingProps {
  controls: ImportWizardControls;
  onNext: () => void;
  onBack: () => void;
}

const PREVIEW_ROW_COUNT = 3;

export function ImportStepMapping({ controls, onNext, onBack }: ImportStepMappingProps) {
  const { t } = useTranslation("backoffice");
  const { state, setColumnMapping } = controls;

  const { parsedFile, entityType, columnMapping } = state;

  const fields = useMemo(
    () => (entityType ? getEntityFields(entityType) : []),
    [entityType]
  );

  // Auto-map on mount if not yet mapped
  useEffect(() => {
    if (!parsedFile || !entityType || Object.keys(columnMapping).length > 0) return;
    const autoMapped = autoMapColumns(parsedFile.headers, entityType);
    setColumnMapping(autoMapped);
  }, [parsedFile, entityType]); // eslint-disable-line react-hooks/exhaustive-deps

  const missingRequired = useMemo(
    () => getMissingRequiredFields(columnMapping, fields),
    [columnMapping, fields]
  );

  const mappedCount = countMappedColumns(columnMapping);
  const totalHeaders = parsedFile?.headers.length ?? 0;

  const previewRows = useMemo(() => {
    if (!parsedFile || !entityType) return [];
    return parsedFile.rows
      .slice(0, PREVIEW_ROW_COUNT)
      .map((row) => normalizeMappedRow(entityType, applyMapping(row, columnMapping)));
  }, [parsedFile, entityType, columnMapping]);

  const mappedFields = fields.filter((f) =>
    Object.values(columnMapping).includes(f.key)
  );

  function handleSelectChange(fileCol: string, value: string) {
    setColumnMapping({ ...columnMapping, [fileCol]: value });
  }

  const canProceed = missingRequired.length === 0 && mappedCount > 0;

  if (!parsedFile || !entityType) return null;

  return (
    <div className="flex flex-col gap-6">
      {/* Auto-map notice */}
      {mappedCount > 0 && (
        <p className="text-sm text-ink-soft">
          {t("import.mapping.autoMappedNotice", {
            count: mappedCount,
            total: totalHeaders
          })}
        </p>
      )}

      {/* Missing required notice */}
      {missingRequired.length > 0 && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          Faltan campos requeridos:{" "}
          {missingRequired.map((f) => f.labelEs).join(", ")}
        </div>
      )}

      {/* Column mapping table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("import.mapping.title")}</CardTitle>
          <CardDescription>{t("import.mapping.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col divide-y divide-line">
            {/* Header row */}
            <div className="hidden grid-cols-2 gap-4 pb-2 sm:grid">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {t("import.mapping.fileColumnHeader")}
              </span>
              <span className="text-xs font-medium uppercase tracking-wide text-ink-muted">
                {t("import.mapping.systemFieldHeader")}
              </span>
            </div>

            {parsedFile.headers.map((header) => (
              <div
                key={header}
                className="flex flex-col gap-1 py-3 sm:grid sm:grid-cols-2 sm:items-center sm:gap-4"
              >
                <span className="text-sm font-medium text-ink">{header}</span>
                <select
                  value={columnMapping[header] ?? "skip"}
                  onChange={(e) => handleSelectChange(header, e.target.value)}
                  aria-label={`Mapear columna "${header}"`}
                  className="h-10 rounded-lg border border-line bg-paper px-3 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-accent"
                >
                  <option value="skip">{t("import.mapping.skipOption")}</option>
                  {fields.map((field) => (
                    <option key={field.key} value={field.key}>
                      {field.labelEs}
                      {field.required ? " *" : ""}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Preview */}
      {previewRows.length > 0 && mappedFields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              {t("import.mapping.previewTitle", { count: previewRows.length })}
            </CardTitle>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  {mappedFields.map((f) => (
                    <th
                      key={f.key}
                      className="pb-2 pr-4 text-left text-xs font-medium text-ink-muted"
                    >
                      {f.labelEs}
                      {f.required && (
                        <Badge variant="secondary" className="ml-1 text-[10px]">
                          {t("import.mapping.requiredBadge")}
                        </Badge>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewRows.map((row, i) => (
                  <tr key={i} className="border-t border-line">
                    {mappedFields.map((f) => (
                      <td
                        key={f.key}
                        className="py-2 pr-4 text-ink-soft"
                      >
                        {row[f.key] || <span className="text-ink-muted/50">—</span>}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="secondary" onClick={onBack}>
          ← {t("import.steps.upload")}
        </Button>
        <Button onClick={onNext} disabled={!canProceed} className="min-w-30">
          {t("import.steps.preview")} →
        </Button>
      </div>
    </div>
  );
}
