import { useState } from "react";

import { RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@operapyme/i18n";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";

import type { ImportJob } from "./import-data";
import { useImportJobsData } from "./use-import-jobs-data";
import { useImportMutations } from "./use-import-mutations";

const ROLLBACK_WINDOW_HOURS = 72;

function isRollbackEligible(job: ImportJob): boolean {
  if (job.status !== "completed") return false;
  const created = new Date(job.createdAt).getTime();
  const windowMs = ROLLBACK_WINDOW_HOURS * 60 * 60 * 1000;
  return Date.now() - created < windowMs;
}

export function ImportHistoryPanel() {
  const { t } = useTranslation("backoffice");
  const { data: jobs, isLoading } = useImportJobsData();
  const { rollback } = useImportMutations();
  const [confirmJobId, setConfirmJobId] = useState<string | null>(null);

  const confirmJob = jobs?.find((j) => j.id === confirmJobId);

  async function handleRollbackConfirm() {
    if (!confirmJobId) return;
    setConfirmJobId(null);
    try {
      await rollback.mutateAsync(confirmJobId);
      toast.success(t("import.history.rollbackSuccess"));
    } catch (err) {
      toast.error(t("import.history.rollbackError", { message: (err as Error).message }));
    }
  }

  if (isLoading) return null;
  if (!jobs || jobs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("import.history.title")}</CardTitle>
          <CardDescription>{t("import.history.description")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-1 py-8 text-center">
            <p className="text-sm font-medium text-ink">{t("import.history.emptyTitle")}</p>
            <p className="text-xs text-ink-muted">{t("import.history.emptyDescription")}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("import.history.title")}</CardTitle>
          <CardDescription>{t("import.history.description")}</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted">
                  {t("import.history.entity.customer").replace("Clientes", "Entidad")}
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted">Archivo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted">Modo</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted">Estado</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-ink-muted">Creados</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-ink-muted">Actualizados</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-ink-muted">Errores</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-ink-muted">Fecha</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {jobs.map((job) => {
                const eligible = isRollbackEligible(job);
                return (
                  <tr key={job.id} className="hover:bg-surface/50 transition-colors">
                    <td className="px-4 py-3 font-medium text-ink">
                      {t(`import.history.entity.${job.entityType}`)}
                    </td>
                    <td className="max-w-40 truncate px-4 py-3 text-ink-soft" title={job.fileName}>
                      {job.fileName}
                    </td>
                    <td className="px-4 py-3 text-ink-soft">
                      {t(`import.history.mode.${job.importMode}`)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={job.status} t={t} />
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-green-700">
                      {job.rowsCreated}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-blue-700">
                      {job.rowsUpdated}
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums text-red-600">
                      {job.rowsErrored}
                    </td>
                    <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">
                      {formatDate(job.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {eligible && (
                        <button
                          type="button"
                          onClick={() => setConfirmJobId(job.id)}
                          className="inline-flex cursor-pointer items-center gap-1 text-xs text-ink-muted underline hover:text-red-600 transition-colors"
                        >
                          <RotateCcw className="size-3" aria-hidden />
                          {t("import.history.rollbackAction")}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Confirm rollback dialog */}
      <Dialog open={!!confirmJobId} onOpenChange={(open) => { if (!open) setConfirmJobId(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("import.history.rollbackConfirmTitle")}</DialogTitle>
            <DialogDescription>
              {confirmJob
                ? t("import.history.rollbackConfirmDescription", {
                    count: confirmJob.rowsCreated + confirmJob.rowsUpdated
                  })
                : null}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" onClick={() => setConfirmJobId(null)}>
              {t("import.history.rollbackCancel")}
            </Button>
            <Button
              onClick={handleRollbackConfirm}
              disabled={rollback.isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {t("import.history.rollbackConfirm")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function StatusBadge({
  status,
  t
}: {
  status: ImportJob["status"];
  t: (key: string) => string;
}) {
  const map: Record<ImportJob["status"], string> = {
    pending: "bg-yellow-100 text-yellow-700",
    processing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
    rolled_back: "bg-surface text-ink-muted"
  };

  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${map[status]}`}>
      {t(`import.history.status.${status}`)}
    </span>
  );
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("es", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
