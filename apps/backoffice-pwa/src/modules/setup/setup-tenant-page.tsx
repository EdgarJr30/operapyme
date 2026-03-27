import { useEffect, useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Building2, Sparkles } from "lucide-react";
import { useForm } from "react-hook-form";

import { useTranslation } from "@operapyme/i18n";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  slugifyTenantName,
  tenantSetupSchema,
  type TenantSetupFormValues
} from "@/lib/forms/tenant-setup-schema";
import { supabase } from "@/lib/supabase/client";
import { UnconfiguredPage } from "@/modules/auth/unconfigured-page";

export function SetupTenantPage() {
  const { t } = useTranslation("backoffice");
  const navigate = useNavigate();
  const { isBootstrapped, isConfigured, refreshAccessContext, status } =
    useBackofficeAuth();
  const [slugTouched, setSlugTouched] = useState(false);

  const {
    formState: { errors, isSubmitting },
    handleSubmit,
    register,
    setValue,
    watch
  } = useForm<TenantSetupFormValues>({
    resolver: zodResolver(tenantSetupSchema),
    defaultValues: {
      name: "",
      slug: ""
    }
  });

  const tenantName = watch("name");
  const tenantSlug = watch("slug");

  useEffect(() => {
    if (!slugTouched) {
      setValue("slug", slugifyTenantName(tenantName), {
        shouldDirty: true,
        shouldValidate: true
      });
    }
  }, [slugTouched, tenantName, setValue]);

  useEffect(() => {
    if (status === "signed_in" && isBootstrapped) {
      navigate("/", { replace: true });
    }
  }, [isBootstrapped, navigate, status]);

  if (!isConfigured) {
    return <UnconfiguredPage />;
  }

  async function onSubmit(values: TenantSetupFormValues) {
    if (!supabase) {
      toast.error(t("setup.unavailableError"));
      return;
    }

    const { error } = await supabase.rpc("create_tenant_with_owner", {
      target_name: values.name.trim(),
      target_slug: values.slug.trim()
    });

    if (error) {
      toast.error(t("setup.submitError", { message: error.message }));
      return;
    }

    await refreshAccessContext();
    toast.success(t("setup.successTitle"), {
      description: t("setup.successDescription")
    });
    navigate("/", { replace: true });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12 sm:px-6">
      <div className="grid w-full gap-4 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="overflow-hidden bg-linear-to-br from-paper via-paper to-peach-200/55">
          <CardContent className="space-y-5 p-6 sm:p-8">
            <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
              {t("setup.eyebrow")}
            </p>
            <h1 className="max-w-2xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
              {t("setup.title")}
            </h1>
            <p className="max-w-2xl text-sm leading-7 text-ink-soft sm:text-base">
              {t("setup.description")}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-line/70 bg-paper/85 p-4">
                <p className="text-sm font-semibold text-ink">
                  {t("setup.cardTenantTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t("setup.cardTenantText")}
                </p>
              </div>
              <div className="rounded-3xl border border-line/70 bg-paper/85 p-4">
                <p className="text-sm font-semibold text-ink">
                  {t("setup.cardRolesTitle")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {t("setup.cardRolesText")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("setup.formTitle")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2">
                <label className="text-sm font-medium text-ink" htmlFor="tenant-name">
                  {t("setup.nameLabel")}
                </label>
                <Input
                  id="tenant-name"
                  placeholder={t("setup.namePlaceholder")}
                  {...register("name")}
                />
                {errors.name ? (
                  <p className="text-sm text-rose-900">{errors.name.message}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-ink" htmlFor="tenant-slug">
                  {t("setup.slugLabel")}
                </label>
                <Input
                  id="tenant-slug"
                  placeholder={t("setup.slugPlaceholder")}
                  {...register("slug", {
                    onChange: () => setSlugTouched(true)
                  })}
                />
                {errors.slug ? (
                  <p className="text-sm text-rose-900">{errors.slug.message}</p>
                ) : null}
                {!errors.slug && tenantSlug ? (
                  <p className="text-sm text-ink-soft">
                    {t("setup.slugHint", { slug: tenantSlug })}
                  </p>
                ) : null}
              </div>

              <Button className="w-full" size="lg" type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("setup.submitting") : t("setup.submit")}
              </Button>
            </form>

            <div className="rounded-3xl border border-line/70 bg-paper/70 p-4">
              <div className="flex items-start gap-3">
                <Building2 className="mt-1 size-4 shrink-0 text-ink" />
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {t("setup.noteTitle")}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {t("setup.noteText")}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-line/70 bg-sand-strong/80 p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="mt-1 size-4 shrink-0 text-ink" />
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {t("setup.nextTitle")}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink-soft">
                    {t("setup.nextText")}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
