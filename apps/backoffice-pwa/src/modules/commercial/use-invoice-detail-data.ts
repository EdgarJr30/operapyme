import { useQuery } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import { getInvoiceDetail } from "@/lib/supabase/backoffice-data";

export function useInvoiceDetailData(invoiceId: string | null) {
  const { activeTenantId, isConfigured, status } = useBackofficeAuth();

  return useQuery({
    queryKey: ["invoice-detail", activeTenantId, invoiceId],
    queryFn: () => getInvoiceDetail(activeTenantId ?? "", invoiceId ?? ""),
    enabled: Boolean(
      isConfigured && status === "signed_in" && activeTenantId && invoiceId
    )
  });
}
