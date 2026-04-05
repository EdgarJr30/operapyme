import { useRef, useState } from "react";

import { Check, Download, FileSpreadsheet, Upload } from "lucide-react";
import { useTranslation } from "@operapyme/i18n";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import type { ImportEntityType } from "../lib/entity-field-definitions";
import { parseFile, ParseFileException } from "../lib/parse-file";
import { downloadTemplate } from "../lib/generate-template";
import type { ImportMode } from "../import-data";
import type { ImportWizardControls } from "../use-import-wizard-state";

interface ImportStepUploadProps {
  controls: ImportWizardControls;
  onNext: () => void;
}

const ENTITY_TYPES: ImportEntityType[] = ["customer", "lead", "catalog_item"];
const IMPORT_MODES: ImportMode[] = ["create", "update", "upsert"];

export function ImportStepUpload({ controls, onNext }: ImportStepUploadProps) {
  const { t } = useTranslation("backoffice");
  const { state, setEntityType, setImportMode, setParsedFile } = controls;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDownloadingTemplate, setIsDownloadingTemplate] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setParseError(null);

    try {
      const parsed = await parseFile(file);
      setParsedFile(parsed);
    } catch (err) {
      if (err instanceof ParseFileException) {
        setParseError(t(`import.upload.errors.${err.code}`));
      } else {
        setParseError(t("import.upload.errors.parse_error"));
      }
    }

    // Reset input so re-uploading same file triggers onChange
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleTemplateDownload() {
    if (!state.entityType) return;
    setIsDownloadingTemplate(true);
    try {
      await downloadTemplate(state.entityType);
    } finally {
      setIsDownloadingTemplate(false);
    }
  }

  const canProceed = !!state.entityType && !!state.parsedFile;

  return (
    <div className="flex flex-col gap-6">
      {/* Entity type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("import.entityType.label")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {ENTITY_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setEntityType(type)}
                className={[
                  "flex h-11 min-w-35 flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors",
                  state.entityType === type
                    ? "border-accent bg-accent/10 text-accent ring-1 ring-accent/30"
                    : "border-line bg-paper text-ink-soft hover:border-accent/50 hover:text-ink"
                ].join(" ")}
              >
                {state.entityType === type && (
                  <Check className="size-4 shrink-0" aria-hidden="true" />
                )}
                {t(`import.entityType.${type}`)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Import mode */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("import.importMode.label")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {IMPORT_MODES.map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setImportMode(mode)}
                className={[
                  "flex h-11 cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm transition-colors text-left",
                  state.importMode === mode
                    ? "border-accent bg-accent/10 text-accent ring-1 ring-accent/30"
                    : "border-line bg-paper text-ink-soft hover:border-accent/50 hover:text-ink"
                ].join(" ")}
              >
                <span
                  className={[
                    "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                    state.importMode === mode ? "border-accent" : "border-line"
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {state.importMode === mode && (
                    <span className="size-1.5 rounded-full bg-accent" />
                  )}
                </span>
                {t(`import.importMode.${mode}`)}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* File upload */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("import.upload.title")}</CardTitle>
          <CardDescription>{t("import.upload.description")}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.xlsx,.xls"
            className="sr-only"
            onChange={handleFileChange}
            aria-label={t("import.upload.dropzoneLabel")}
          />

          {state.parsedFile ? (
            <div className="flex items-center gap-3 rounded-xl border border-line bg-surface p-4">
              <FileSpreadsheet className="size-5 shrink-0 text-accent" aria-hidden />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-ink">{state.parsedFile.fileName}</span>
                <span className="text-xs text-ink-muted">
                  {t("import.upload.fileSelected", {
                    name: state.parsedFile.fileName,
                    count: state.parsedFile.rowCount
                  })}
                </span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="ml-auto cursor-pointer text-xs text-ink-muted underline hover:text-ink"
              >
                Cambiar
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex h-24 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-line bg-surface text-sm text-ink-soft transition-colors hover:border-accent/50 hover:text-ink"
            >
              <Upload className="size-5" aria-hidden />
              <span>{t("import.upload.dropzoneLabel")}</span>
              <span className="text-xs text-ink-muted">{t("import.upload.dropzoneHint")}</span>
            </button>
          )}

          {parseError && (
            <p role="alert" className="text-sm text-red-600">
              {parseError}
            </p>
          )}

          {state.entityType && (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTemplateDownload}
              disabled={isDownloadingTemplate}
              className="w-full sm:w-auto"
            >
              <Download className="mr-2 size-4" aria-hidden />
              {t("import.upload.downloadTemplate", {
                entity: t(`import.entityType.${state.entityType}`)
              })}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button onClick={onNext} disabled={!canProceed} className="min-w-30">
          {t("import.steps.mapping")} →
        </Button>
      </div>
    </div>
  );
}
