import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { rollbackImportJob } from "./import-data";
import { IMPORT_JOBS_QUERY_KEY } from "./use-import-jobs-data";

function ensureTenantId(tenantId: string | null): string {
  if (!tenantId) throw new Error("No active tenant available for this operation.");
  return tenantId;
}

export function useImportMutations() {
  const queryClient = useQueryClient();
  const { activeTenantId } = useBackofficeAuth();

  const rollback = useMutation({
    mutationFn: (jobId: string) =>
      rollbackImportJob(ensureTenantId(activeTenantId), jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: IMPORT_JOBS_QUERY_KEY(activeTenantId ?? "")
      });
    }
  });

  return { rollback };
}
