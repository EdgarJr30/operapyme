import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase/client";
import type { ImportEntityType } from "./lib/entity-field-definitions";

function requireSupabaseClient(): SupabaseClient {
  if (!supabase) throw new Error("Supabase is not configured for this environment.");
  return supabase;
}

// ─── Types ───────────────────────────────────────────────────────────────────

export type ImportJobStatus =
  | "pending"
  | "processing"
  | "completed"
  | "failed"
  | "rolled_back";

export type ImportMode = "create" | "update" | "upsert";

export interface ImportJob {
  id: string;
  entityType: ImportEntityType;
  importMode: ImportMode;
  status: ImportJobStatus;
  fileName: string;
  fileRowCount: number;
  columnMapping: Record<string, string>;
  rowsCreated: number;
  rowsUpdated: number;
  rowsSkipped: number;
  rowsErrored: number;
  batchTag: string;
  startedAt: string | null;
  finishedAt: string | null;
  createdAt: string;
}

export interface BulkUpsertResult {
  created: number;
  updated: number;
  errors: Array<{
    row_number: number;
    field: string | null;
    code: string;
    message: string;
  }>;
}

// ─── Job CRUD ─────────────────────────────────────────────────────────────────

export interface CreateImportJobInput {
  tenantId: string;
  entityType: ImportEntityType;
  importMode: ImportMode;
  fileName: string;
  fileRowCount: number;
  columnMapping: Record<string, string>;
}

export async function createImportJob(input: CreateImportJobInput): Promise<ImportJob> {
  const db = requireSupabaseClient();
  const { data, error } = await db
    .from("import_jobs")
    .insert({
      tenant_id: input.tenantId,
      entity_type: input.entityType,
      import_mode: input.importMode,
      file_name: input.fileName,
      file_row_count: input.fileRowCount,
      column_mapping: input.columnMapping,
      status: "pending"
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return mapImportJob(data);
}

export async function updateImportJobStatus(
  jobId: string,
  tenantId: string,
  status: ImportJobStatus,
  counters?: {
    rowsCreated?: number;
    rowsUpdated?: number;
    rowsSkipped?: number;
    rowsErrored?: number;
  }
): Promise<void> {
  const patch: Record<string, unknown> = { status };
  if (status === "processing") patch.started_at = new Date().toISOString();
  if (status === "completed" || status === "failed") patch.finished_at = new Date().toISOString();
  if (counters) {
    if (counters.rowsCreated !== undefined) patch.rows_created = counters.rowsCreated;
    if (counters.rowsUpdated !== undefined) patch.rows_updated = counters.rowsUpdated;
    if (counters.rowsSkipped !== undefined) patch.rows_skipped = counters.rowsSkipped;
    if (counters.rowsErrored !== undefined) patch.rows_errored = counters.rowsErrored;
  }

  const db = requireSupabaseClient();
  const { error } = await db
    .from("import_jobs")
    .update(patch)
    .eq("id", jobId)
    .eq("tenant_id", tenantId);

  if (error) throw new Error(error.message);
}

export async function listImportJobs(tenantId: string): Promise<ImportJob[]> {
  const db = requireSupabaseClient();
  const { data, error } = await db
    .from("import_jobs")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) throw new Error(error.message);
  return (data ?? []).map(mapImportJob);
}

// ─── Staging RPCs ─────────────────────────────────────────────────────────────

export interface StagingRowInput {
  row_number: number;
  raw_data: Record<string, string>;
  mapped_data: Record<string, string>;
}

export async function insertStagingRows(
  tenantId: string,
  jobId: string,
  rows: StagingRowInput[]
): Promise<number> {
  const { data, error } = await requireSupabaseClient().rpc("insert_staging_rows", {
    target_tenant_id: tenantId,
    target_job_id: jobId,
    p_rows: rows
  });

  if (error) throw new Error(error.message);
  return data as number;
}

export interface StagingValidationResult {
  row_number: number;
  status: "valid" | "invalid";
  validation_errors: Array<{ field: string; code: string; message: string }> | null;
}

export async function updateStagingValidation(
  tenantId: string,
  jobId: string,
  results: StagingValidationResult[]
): Promise<void> {
  const { error } = await requireSupabaseClient().rpc("update_staging_validation", {
    target_tenant_id: tenantId,
    target_job_id: jobId,
    p_results: results
  });

  if (error) throw new Error(error.message);
}

// ─── Bulk upsert RPCs ─────────────────────────────────────────────────────────

export async function bulkUpsertCustomers(
  tenantId: string,
  jobId: string,
  batchTag: string,
  importMode: ImportMode,
  batchSize = 50
): Promise<BulkUpsertResult> {
  const { data, error } = await requireSupabaseClient().rpc("bulk_upsert_customers", {
    target_tenant_id: tenantId,
    target_job_id: jobId,
    p_batch_tag: batchTag,
    p_import_mode: importMode,
    p_batch_size: batchSize
  });

  if (error) throw new Error(error.message);
  return data as BulkUpsertResult;
}

export async function bulkUpsertLeads(
  tenantId: string,
  jobId: string,
  batchTag: string,
  importMode: ImportMode,
  batchSize = 50
): Promise<BulkUpsertResult> {
  const { data, error } = await requireSupabaseClient().rpc("bulk_upsert_leads", {
    target_tenant_id: tenantId,
    target_job_id: jobId,
    p_batch_tag: batchTag,
    p_import_mode: importMode,
    p_batch_size: batchSize
  });

  if (error) throw new Error(error.message);
  return data as BulkUpsertResult;
}

export async function bulkUpsertCatalogItems(
  tenantId: string,
  jobId: string,
  batchTag: string,
  importMode: ImportMode,
  batchSize = 50
): Promise<BulkUpsertResult> {
  const { data, error } = await requireSupabaseClient().rpc("bulk_upsert_catalog_items", {
    target_tenant_id: tenantId,
    target_job_id: jobId,
    p_batch_tag: batchTag,
    p_import_mode: importMode,
    p_batch_size: batchSize
  });

  if (error) throw new Error(error.message);
  return data as BulkUpsertResult;
}

// ─── Rollback & cleanup ───────────────────────────────────────────────────────

export async function rollbackImportJob(tenantId: string, jobId: string): Promise<void> {
  const { error } = await requireSupabaseClient().rpc("rollback_import_job", {
    target_tenant_id: tenantId,
    target_job_id: jobId
  });

  if (error) throw new Error(error.message);
}

export async function cleanupStagingRows(tenantId: string, jobId: string): Promise<void> {
  const { error } = await requireSupabaseClient().rpc("cleanup_staging_rows", {
    target_tenant_id: tenantId,
    target_job_id: jobId
  });

  if (error) throw new Error(error.message);
}

// ─── Mapper ───────────────────────────────────────────────────────────────────

function mapImportJob(row: Record<string, unknown>): ImportJob {
  return {
    id: row.id as string,
    entityType: row.entity_type as ImportEntityType,
    importMode: row.import_mode as ImportMode,
    status: row.status as ImportJobStatus,
    fileName: row.file_name as string,
    fileRowCount: row.file_row_count as number,
    columnMapping: (row.column_mapping ?? {}) as Record<string, string>,
    rowsCreated: row.rows_created as number,
    rowsUpdated: row.rows_updated as number,
    rowsSkipped: row.rows_skipped as number,
    rowsErrored: row.rows_errored as number,
    batchTag: row.batch_tag as string,
    startedAt: row.started_at as string | null,
    finishedAt: row.finished_at as string | null,
    createdAt: row.created_at as string
  };
}
