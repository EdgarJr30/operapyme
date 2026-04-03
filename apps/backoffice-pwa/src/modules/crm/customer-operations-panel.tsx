import { type ReactNode, useEffect, useMemo, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { useTranslation } from "@operapyme/i18n";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { buildOperationalAutofillProps } from "@/lib/forms/autofill";
import {
  createCustomerFormSchema,
  type CustomerFormValues
} from "@/lib/forms/customer-form-schema";
import type { CustomerSummary } from "@/lib/supabase/backoffice-data";
import {
  CustomerFormFields,
  customerFormDefaultValues,
  mapCustomerToFormValues
} from "@/modules/crm/customer-form-fields";
import { useCustomerMutations } from "@/modules/crm/use-customer-mutations";

interface CustomerOperationsPanelProps {
  customers: CustomerSummary[];
}

export function CustomerOperationsPanel({
  customers
}: CustomerOperationsPanelProps) {
  const { t } = useTranslation("backoffice");
  const { createCustomerMutation, updateCustomerMutation } =
    useCustomerMutations();
  const customerFormSchema = createCustomerFormSchema(t);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");

  const createForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customerFormDefaultValues
  });

  const updateForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: customerFormDefaultValues
  });

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) ?? null,
    [customers, selectedCustomerId]
  );

  useEffect(() => {
    if (!selectedCustomerId && customers[0]) {
      setSelectedCustomerId(customers[0].id);
    }
  }, [customers, selectedCustomerId]);

  useEffect(() => {
    if (!selectedCustomer) {
      updateForm.reset(customerFormDefaultValues);
      return;
    }

    updateForm.reset(mapCustomerToFormValues(selectedCustomer));
  }, [selectedCustomer, updateForm]);

  async function onCreate(values: CustomerFormValues) {
    try {
      await createCustomerMutation.mutateAsync(values);
      toast.success(t("crm.customerForm.createSuccess"));
      createForm.reset(customerFormDefaultValues);
    } catch (error) {
      toast.error(
        t("crm.customerForm.createError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  async function onUpdate(values: CustomerFormValues) {
    if (!selectedCustomer) {
      toast.error(t("crm.customerForm.noCustomerSelected"));
      return;
    }

    try {
      await updateCustomerMutation.mutateAsync({
        customerId: selectedCustomer.id,
        ...values
      });
      toast.success(t("crm.customerForm.updateSuccess"));
    } catch (error) {
      toast.error(
        t("crm.customerForm.updateError", {
          message: error instanceof Error ? error.message : ""
        })
      );
    }
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <Card>
        <CardHeader>
          <CardTitle>{t("crm.customerForm.createTitle")}</CardTitle>
          <CardDescription>
            {t("crm.customerForm.createDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={createForm.handleSubmit(onCreate)}
            noValidate
            {...buildOperationalAutofillProps("off")}
          >
            <CustomerFormFields form={createForm} idPrefix="create" />

            <div className="flex flex-wrap gap-3 pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={createCustomerMutation.isPending}
              >
                {createCustomerMutation.isPending
                  ? t("crm.customerForm.createSubmitting")
                  : t("crm.customerForm.createAction")}
              </Button>
              <Button
                type="button"
                size="lg"
                variant="secondary"
                onClick={() => {
                  createForm.reset(customerFormDefaultValues);
                }}
              >
                {t("crm.customerForm.resetAction")}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="bg-paper">
        <CardHeader>
          <CardTitle>{t("crm.customerForm.updateTitle")}</CardTitle>
          <CardDescription>
            {t("crm.customerForm.updateDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label
              className="text-sm font-medium text-ink"
              htmlFor="customer-record"
            >
              {t("crm.customerForm.recordLabel")}
            </label>
            <Select
              id="customer-record"
              value={selectedCustomerId}
              {...buildOperationalAutofillProps("off")}
              onChange={(event) => {
                setSelectedCustomerId(event.target.value);
              }}
            >
              {customers.length === 0 ? (
                <option value="">{t("crm.customerForm.noCustomersOption")}</option>
              ) : (
                customers.map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.displayName}
                  </option>
                ))
              )}
            </Select>
          </div>

          {customers.length === 0 ? (
            <FeedbackBanner tone="neutral">
              {t("crm.customerForm.noCustomersHint")}
            </FeedbackBanner>
          ) : (
            <form
              className="space-y-4"
              onSubmit={updateForm.handleSubmit(onUpdate)}
              noValidate
              {...buildOperationalAutofillProps("off")}
            >
              <CustomerFormFields form={updateForm} idPrefix="update" />

              <Button
                type="submit"
                size="lg"
                disabled={updateCustomerMutation.isPending || !selectedCustomer}
              >
                {updateCustomerMutation.isPending
                  ? t("crm.customerForm.updateSubmitting")
                  : t("crm.customerForm.updateAction")}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FeedbackBanner({
  children,
  tone
}: {
  children: ReactNode;
  tone: "error" | "success" | "neutral";
}) {
  const toneClass =
    tone === "error"
      ? "border-rose-300/80 bg-rose-100/80 text-rose-900"
      : tone === "success"
        ? "border-sage-300/80 bg-sage-100/80 text-ink"
        : "border-line/70 bg-paper/70 text-ink-soft";

  return <p className={`rounded-2xl border px-4 py-3 text-sm ${toneClass}`}>{children}</p>;
}
