import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useBackofficeAuth } from "@/app/auth-provider";
import {
  cancelInvoice,
  createInvoice,
  moveInvoiceStatus,
  updateInvoice,
  type CancelInvoiceInput,
  type CreateInvoiceInput,
  type MoveInvoiceStatusInput,
  type UpdateInvoiceInput
} from "@/lib/supabase/backoffice-data";

function ensureTenantId(tenantId: string | null) {
  if (!tenantId) {
    throw new Error("No active tenant available for this operation.");
  }

  return tenantId;
}

export function useInvoiceMutations() {
  const queryClient = useQueryClient();
  const { activeTenantId } = useBackofficeAuth();

  const invalidate = async (tenantId: string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["invoices", tenantId] }),
      queryClient.invalidateQueries({ queryKey: ["dashboard-snapshot", tenantId] })
    ]);
  };

  const createInvoiceMutation = useMutation({
    mutationFn: (input: Omit<CreateInvoiceInput, "tenantId">) =>
      createInvoice({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async () => {
      await invalidate(ensureTenantId(activeTenantId));
    }
  });

  const moveInvoiceStatusMutation = useMutation({
    mutationFn: (input: Omit<MoveInvoiceStatusInput, "tenantId">) =>
      moveInvoiceStatus({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async () => {
      await invalidate(ensureTenantId(activeTenantId));
    }
  });

  const updateInvoiceMutation = useMutation({
    mutationFn: (input: Omit<UpdateInvoiceInput, "tenantId">) =>
      updateInvoice({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async (updated) => {
      const tenantId = ensureTenantId(activeTenantId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["invoices", tenantId] }),
        queryClient.invalidateQueries({
          queryKey: ["invoice-detail", tenantId, updated.id]
        })
      ]);
    }
  });

  const cancelInvoiceMutation = useMutation({
    mutationFn: (input: Omit<CancelInvoiceInput, "tenantId">) =>
      cancelInvoice({
        ...input,
        tenantId: ensureTenantId(activeTenantId)
      }),
    onSuccess: async (_result, input) => {
      const tenantId = ensureTenantId(activeTenantId);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["invoices", tenantId] }),
        queryClient.invalidateQueries({ queryKey: ["dashboard-snapshot", tenantId] }),
        queryClient.invalidateQueries({
          queryKey: ["invoice-detail", tenantId, input.invoiceId]
        })
      ]);
    }
  });

  return {
    cancelInvoiceMutation,
    createInvoiceMutation,
    moveInvoiceStatusMutation,
    updateInvoiceMutation
  };
}
