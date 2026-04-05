import { useState } from "react";

import type { ParsedFile } from "./lib/parse-file";
import type { ColumnMapping } from "./lib/column-mapping";
import type { ValidationSummary } from "./lib/validate-rows";
import type { ImportEntityType } from "./lib/entity-field-definitions";
import type { ImportMode } from "./import-data";

export type WizardStep = "upload" | "mapping" | "preview" | "processing" | "complete";

export interface WizardCompleteSummary {
  jobId: string;
  rowsCreated: number;
  rowsUpdated: number;
  rowsSkipped: number;
  rowsErrored: number;
}

export interface ImportWizardState {
  step: WizardStep;
  // Step 1
  entityType: ImportEntityType | null;
  importMode: ImportMode;
  parsedFile: ParsedFile | null;
  // Step 2
  columnMapping: ColumnMapping;
  // Step 3
  validationSummary: ValidationSummary | null;
  skipInvalidRows: boolean;
  // Step 4
  currentJobId: string | null;
  // Step 5
  completeSummary: WizardCompleteSummary | null;
}

const initialState: ImportWizardState = {
  step: "upload",
  entityType: null,
  importMode: "upsert",
  parsedFile: null,
  columnMapping: {},
  validationSummary: null,
  skipInvalidRows: true,
  currentJobId: null,
  completeSummary: null
};

export function useImportWizardState() {
  const [state, setState] = useState<ImportWizardState>(initialState);

  function setStep(step: WizardStep) {
    setState((s) => ({ ...s, step }));
  }

  function setEntityType(entityType: ImportEntityType) {
    setState((s) => ({ ...s, entityType, columnMapping: {}, validationSummary: null }));
  }

  function setImportMode(importMode: ImportMode) {
    setState((s) => ({ ...s, importMode }));
  }

  function setParsedFile(parsedFile: ParsedFile) {
    setState((s) => ({ ...s, parsedFile, columnMapping: {}, validationSummary: null }));
  }

  function setColumnMapping(columnMapping: ColumnMapping) {
    setState((s) => ({ ...s, columnMapping, validationSummary: null }));
  }

  function setValidationSummary(validationSummary: ValidationSummary) {
    setState((s) => ({ ...s, validationSummary }));
  }

  function setSkipInvalidRows(skipInvalidRows: boolean) {
    setState((s) => ({ ...s, skipInvalidRows }));
  }

  function setCurrentJobId(jobId: string) {
    setState((s) => ({ ...s, currentJobId: jobId }));
  }

  function setCompleteSummary(completeSummary: WizardCompleteSummary) {
    setState((s) => ({ ...s, completeSummary }));
  }

  function goToNextStep() {
    const order: WizardStep[] = ["upload", "mapping", "preview", "processing", "complete"];
    const idx = order.indexOf(state.step);
    if (idx < order.length - 1) {
      setState((s) => ({ ...s, step: order[idx + 1] }));
    }
  }

  function goToPrevStep() {
    const order: WizardStep[] = ["upload", "mapping", "preview", "processing", "complete"];
    const idx = order.indexOf(state.step);
    if (idx > 0) {
      setState((s) => ({ ...s, step: order[idx - 1] }));
    }
  }

  function reset() {
    setState(initialState);
  }

  return {
    state,
    setStep,
    setEntityType,
    setImportMode,
    setParsedFile,
    setColumnMapping,
    setValidationSummary,
    setSkipInvalidRows,
    setCurrentJobId,
    setCompleteSummary,
    goToNextStep,
    goToPrevStep,
    reset
  };
}

export type ImportWizardControls = ReturnType<typeof useImportWizardState>;
