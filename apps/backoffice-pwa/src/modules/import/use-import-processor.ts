import { useCallback, useEffect, useRef, useState } from "react";

import { useBackofficeAuth } from "@/app/auth-provider";

import {
  createImportJob,
  updateImportJobStatus,
  insertStagingRows,
  updateStagingValidation,
  bulkUpsertCustomers,
  bulkUpsertLeads,
  bulkUpsertCatalogItems,
  cleanupStagingRows,
  type ImportMode
} from "./import-data";
import type { ImportWizardControls, WizardCompleteSummary } from "./use-import-wizard-state";
import { applyMapping } from "./lib/column-mapping";
import { validateRows, toStagingValidationPayload } from "./lib/validate-rows";
import type { ImportEntityType } from "./lib/entity-field-definitions";

const BATCH_SIZE = 50;

export interface ProcessingProgress {
  totalBatches: number;
  currentBatch: number;
  totalRows: number;
  processedRows: number;
  rowsCreated: number;
  rowsUpdated: number;
  rowsErrored: number;
  isStopped: boolean;
  currentError: string | null;
}

const initialProgress: ProcessingProgress = {
  totalBatches: 0,
  currentBatch: 0,
  totalRows: 0,
  processedRows: 0,
  rowsCreated: 0,
  rowsUpdated: 0,
  rowsErrored: 0,
  isStopped: false,
  currentError: null
};

export function useImportProcessor(
  controls: ImportWizardControls,
  onComplete: (summary: WizardCompleteSummary) => void
) {
  const { activeTenantId } = useBackofficeAuth();
  const [progress, setProgress] = useState<ProcessingProgress>(initialProgress);
  const [isProcessing, setIsProcessing] = useState(false);
  const shouldStopRef = useRef(false);

  // Prevent accidental navigation during processing
  useEffect(() => {
    if (!isProcessing) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isProcessing]);

  const stop = useCallback(() => {
    shouldStopRef.current = true;
    setProgress((p) => ({ ...p, isStopped: true }));
  }, []);

  const resume = useCallback(() => {
    shouldStopRef.current = false;
    setProgress((p) => ({ ...p, isStopped: false, currentError: null }));
  }, []);

  const start = useCallback(async () => {
    const { state } = controls;
    const tenantId = activeTenantId;

    if (
      !tenantId ||
      !state.entityType ||
      !state.parsedFile ||
      !state.validationSummary
    ) return;

    shouldStopRef.current = false;
    setIsProcessing(true);
    setProgress(initialProgress);

    const entityType = state.entityType;
    const importMode: ImportMode = state.importMode;
    const parsedFile = state.parsedFile;
    const summary = state.validationSummary;

    try {
      // 1. Create job
      const job = await createImportJob({
        tenantId,
        entityType,
        importMode,
        fileName: parsedFile.fileName,
        fileRowCount: parsedFile.rowCount,
        columnMapping: Object.fromEntries(
          Object.entries(state.columnMapping).filter(([, v]) => v !== "skip")
        ) as Record<string, string>
      });

      controls.setCurrentJobId(job.id);

      // 2. Apply mapping and insert staging rows
      const allMappedRows = parsedFile.rows.map((row, i) => ({
        row_number: i + 1,
        raw_data: row,
        mapped_data: applyMapping(row, state.columnMapping)
      }));

      await insertStagingRows(tenantId, job.id, allMappedRows);

      // 3. Run validation and update staging
      const validationResult = validateRows(
        allMappedRows.map((r) => r.mapped_data),
        entityType as ImportEntityType
      );
      const stagingValidation = toStagingValidationPayload([
        ...validationResult.validRows,
        ...validationResult.invalidRows
      ]);
      await updateStagingValidation(tenantId, job.id, stagingValidation);

      // 4. Process valid rows in batches
      await updateImportJobStatus(job.id, tenantId, "processing");

      const validCount = validationResult.validCount;
      const totalBatches = Math.ceil(validCount / BATCH_SIZE);

      setProgress((p) => ({
        ...p,
        totalBatches,
        totalRows: validCount,
        currentBatch: 0,
        processedRows: 0
      }));

      let totalCreated = 0;
      let totalUpdated = 0;
      let totalErrored = 0;
      let processedRows = 0;

      const bulkFn = entityType === "customer"
        ? bulkUpsertCustomers
        : entityType === "lead"
          ? bulkUpsertLeads
          : bulkUpsertCatalogItems;

      for (let batch = 0; batch < totalBatches; batch++) {
        if (shouldStopRef.current) break;

        setProgress((p) => ({
          ...p,
          currentBatch: batch + 1,
          currentError: null
        }));

        try {
          const result = await bulkFn(
            tenantId,
            job.id,
            job.batchTag,
            importMode,
            BATCH_SIZE
          );

          totalCreated += result.created;
          totalUpdated += result.updated;
          totalErrored += result.errors.length;
          processedRows += result.created + result.updated + result.errors.length;

          setProgress((p) => ({
            ...p,
            rowsCreated: totalCreated,
            rowsUpdated: totalUpdated,
            rowsErrored: totalErrored,
            processedRows
          }));
        } catch (err) {
          const message = err instanceof Error ? err.message : "Error desconocido";
          setProgress((p) => ({ ...p, currentError: message }));
          // Stop and wait for user decision
          shouldStopRef.current = true;
          break;
        }
      }

      // 5. Update job status
      const finalStatus = shouldStopRef.current && processedRows < validCount
        ? "completed" // partial but durable
        : "completed";

      await updateImportJobStatus(job.id, tenantId, finalStatus, {
        rowsCreated: totalCreated,
        rowsUpdated: totalUpdated,
        rowsSkipped: validationResult.invalidCount,
        rowsErrored: totalErrored
      });

      // 6. Cleanup processed staging rows
      await cleanupStagingRows(tenantId, job.id);

      const completeSummary: WizardCompleteSummary = {
        jobId: job.id,
        rowsCreated: totalCreated,
        rowsUpdated: totalUpdated,
        rowsSkipped: validationResult.invalidCount,
        rowsErrored: totalErrored
      };

      controls.setCompleteSummary(completeSummary);
      onComplete(completeSummary);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error desconocido";
      setProgress((p) => ({ ...p, currentError: message }));
    } finally {
      setIsProcessing(false);
    }
  }, [controls, activeTenantId, onComplete]);

  return { progress, isProcessing, start, stop, resume };
}
