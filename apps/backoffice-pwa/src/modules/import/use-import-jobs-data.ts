import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { listImportJobs } from "./import-data";

export const IMPORT_JOBS_QUERY_KEY = (tenantId: string) => ["import_jobs", tenantId];

export function useImportJobsData() {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();

  const query = useQuery({
    queryKey: IMPORT_JOBS_QUERY_KEY(activeTenantId ?? ""),
    queryFn: () => listImportJobs(activeTenantId ?? ""),
    enabled: Boolean(isConfigured && status === "signed_in" && activeTenantId),
    staleTime: 30_000
  });

  return {
    ...query,
    hasTenantContext: Boolean(activeTenantId)
  };
}
