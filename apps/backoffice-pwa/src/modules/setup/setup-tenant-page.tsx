import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Building2,
  Globe2,
  Layers3,
  Palette,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { useForm } from "react-hook-form";

import { useTenantTheme } from "@operapyme/ui";
import { useTranslation } from "@operapyme/i18n";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  slugifyTenantName,
  tenantSetupSchema,
  type TenantSetupFormValues
} from "@/lib/forms/tenant-setup-schema";
import { supabase } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { UnconfiguredPage } from "@/modules/auth/unconfigured-page";
import { CompactTenantPaletteSelector } from "@/modules/settings/tenant-palette-section";

type SetupStepKey = "workspace" | "branding" | "review";
type SlugAvailabilityState = "idle" | "checking" | "available" | "unavailable" | "error";

const setupSteps: SetupStepKey[] = ["workspace", "branding", "review"];

export function SetupTenantPage() {
  const { t } = useTranslation("backoffice");
  const navigate = useNavigate();
  const { activePalette, paletteId } = useTenantTheme();
  const { isBootstrapped, isConfigured, refreshAccessContext, status } =
    useBackofficeAuth();
  const [currentStep, setCurrentStep] = useState<SetupStepKey>("workspace");
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugAvailability, setSlugAvailability] =
    useState<SlugAvailabilityState>("idle");
  const slugCheckRequestRef = useRef(0);
  const lastCheckedSlugRef = useRef("");

  const {
    clearErrors,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    register,
    setError,
    setValue,
    trigger,
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
  const currentStepIndex = setupSteps.indexOf(currentStep);
  const paletteName = t(`theme.palettes.${paletteId}.name`, { ns: "common" });

  const launchCards = useMemo(
    () => [
      {
        icon: Layers3,
        title: t("setup.launchCards.commercialTitle"),
        text: t("setup.launchCards.commercialText")
      },
      {
        icon: BadgeCheck,
        title: t("setup.launchCards.catalogTitle"),
        text: t("setup.launchCards.catalogText")
      },
      {
        icon: ShieldCheck,
        title: t("setup.launchCards.accessTitle"),
        text: t("setup.launchCards.accessText")
      }
    ],
    [t]
  );

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

  useEffect(() => {
    const normalizedSlug = tenantSlug.trim();

    if (!normalizedSlug || errors.slug) {
      setSlugAvailability("idle");
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void validateSlugAvailability(normalizedSlug, false);
    }, 280);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [errors.slug, tenantSlug]);

  if (!isConfigured) {
    return <UnconfiguredPage />;
  }

  async function validateSlugAvailability(slug: string, force: boolean) {
    const normalizedSlug = slug.trim();

    if (!supabase) {
      setSlugAvailability("error");
      return false;
    }

    if (!force && normalizedSlug === lastCheckedSlugRef.current) {
      return slugAvailability === "available";
    }

    const requestId = slugCheckRequestRef.current + 1;
    slugCheckRequestRef.current = requestId;
    setSlugAvailability("checking");

    const { data, error } = await supabase.rpc("is_tenant_slug_available", {
      target_slug: normalizedSlug
    });

    if (requestId !== slugCheckRequestRef.current) {
      return false;
    }

    lastCheckedSlugRef.current = normalizedSlug;

    if (error) {
      setSlugAvailability("error");
      return false;
    }

    if (!data) {
      setError("slug", {
        type: "manual",
        message: t("setup.slugUnavailable")
      });
      setSlugAvailability("unavailable");
      return false;
    }

    clearErrors("slug");
    setSlugAvailability("available");
    return true;
  }

  async function handleAdvanceStep() {
    if (currentStep === "workspace") {
      const isValid = await trigger(["name", "slug"], { shouldFocus: true });

      if (!isValid) {
        return;
      }

      const slugIsAvailable = await validateSlugAvailability(getValues("slug"), true);

      if (!slugIsAvailable) {
        return;
      }
    }

    const currentIndex = setupSteps.indexOf(currentStep);
    const nextStep = setupSteps[currentIndex + 1];

    if (nextStep) {
      setCurrentStep(nextStep);
    }
  }

  async function onSubmit(values: TenantSetupFormValues) {
    if (!supabase) {
      toast.error(t("setup.unavailableError"));
      return;
    }

    const slugIsAvailable = await validateSlugAvailability(values.slug, true);

    if (!slugIsAvailable) {
      setCurrentStep("workspace");
      return;
    }

    const { error } = await supabase.rpc("create_tenant_with_owner", {
      target_name: values.name.trim(),
      target_slug: values.slug.trim()
    });

    if (error) {
      if (
        /slug/i.test(error.message) ||
        /tenants_slug_key/i.test(error.message) ||
        /already in use/i.test(error.message)
      ) {
        setError("slug", {
          type: "manual",
          message: t("setup.slugUnavailable")
        });
        setCurrentStep("workspace");
      }

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
    <div className="min-h-screen bg-[linear-gradient(180deg,theme(colors.paper)_0%,theme(colors.sand/35)_100%)]">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-[0.2em]">
            {t("setup.eyebrow")}
          </Badge>
          <p className="text-sm text-ink-soft">
            <span className="font-semibold text-ink">
              {t("setup.progressLabel", {
                current: currentStepIndex + 1,
                total: setupSteps.length
              })}
            </span>{" "}
            {t(`setup.steps.${currentStep}.title`)}
          </p>
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="overflow-hidden border-line/80 bg-paper shadow-panel">
            <div className="border-b border-line/70 bg-[linear-gradient(180deg,theme(colors.paper)_0%,theme(colors.sand/45)_100%)] px-5 py-6 sm:px-6">
              <div className="space-y-3">
                <h1 className="max-w-3xl text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                  {t("setup.title")}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-ink-soft">
                  {t("setup.description")}
                </p>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {setupSteps.map((step, index) => (
                  <StepCard
                    key={step}
                    index={index}
                    isActive={step === currentStep}
                    isCompleted={index < currentStepIndex}
                    title={t(`setup.steps.${step}.title`)}
                    description={t(`setup.steps.${step}.description`)}
                    t={t}
                  />
                ))}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div className="space-y-6 px-5 py-6 sm:px-6">
                <div className="space-y-1">
                  <h2 className="text-xl font-semibold text-ink">
                    {t(`setup.steps.${currentStep}.title`)}
                  </h2>
                  <p className="text-sm leading-6 text-ink-soft">
                    {t(`setup.steps.${currentStep}.helper`)}
                  </p>
                </div>

                {currentStep === "workspace" ? (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field
                        error={errors.name?.message}
                        htmlFor="tenant-name"
                        label={t("setup.nameLabel")}
                      >
                        <Input
                          id="tenant-name"
                          placeholder={t("setup.namePlaceholder")}
                          className="h-12 rounded-2xl"
                          {...register("name")}
                        />
                      </Field>

                      <Field
                        error={errors.slug?.message}
                        htmlFor="tenant-slug"
                        label={t("setup.slugLabel")}
                      >
                        <Input
                          id="tenant-slug"
                          placeholder={t("setup.slugPlaceholder")}
                          className="h-12 rounded-2xl"
                          {...register("slug", {
                            onChange: () => {
                              setSlugTouched(true);
                              lastCheckedSlugRef.current = "";
                            }
                          })}
                        />
                      </Field>
                    </div>

                    <div
                      className="rounded-2xl border border-line/70 bg-sand/45 p-4"
                      aria-live="polite"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                            {t("setup.slugPreviewTitle")}
                          </p>
                          <p className="text-base font-semibold text-ink">
                            {tenantSlug || "operapyme-demo"}
                          </p>
                          <p className="text-sm leading-6 text-ink-soft">
                            {tenantSlug
                              ? t("setup.slugHint", { slug: tenantSlug })
                              : t("setup.slugPreviewEmpty")}
                          </p>
                        </div>
                        <SlugAvailabilityBadge state={slugAvailability} t={t} />
                      </div>
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <InfoCard
                        icon={Building2}
                        title={t("setup.workspaceCards.tenantTitle")}
                        text={t("setup.workspaceCards.tenantText")}
                      />
                      <InfoCard
                        icon={Globe2}
                        title={t("setup.workspaceCards.slugTitle")}
                        text={t("setup.workspaceCards.slugText")}
                      />
                    </div>
                  </div>
                ) : null}

                {currentStep === "branding" ? (
                  <div className="space-y-5">
                    <CompactTenantPaletteSelector />

                    <div className="grid gap-3 md:grid-cols-2">
                      <InfoCard
                        icon={Layers3}
                        title={t("setup.brandingCards.focusTitle")}
                        text={t("setup.brandingCards.focusText")}
                      />
                      <InfoCard
                        icon={Palette}
                        title={t("setup.brandingCards.identityTitle")}
                        text={t("setup.brandingCards.identityText")}
                      />
                    </div>
                  </div>
                ) : null}

                {currentStep === "review" ? (
                  <div className="space-y-5">
                    <div className="grid gap-3 sm:grid-cols-3">
                      <ReviewCard
                        label={t("setup.review.businessLabel")}
                        value={tenantName || t("setup.review.pending")}
                      />
                      <ReviewCard
                        label={t("setup.review.slugLabel")}
                        value={tenantSlug || t("setup.review.pending")}
                      />
                      <ReviewCard
                        label={t("setup.review.paletteLabel")}
                        value={paletteName}
                      />
                    </div>

                    <div className="grid gap-3 md:grid-cols-2">
                      <ReviewChecklistItem
                        title={t("setup.review.checklist.membershipTitle")}
                        text={t("setup.review.checklist.membershipText")}
                      />
                      <ReviewChecklistItem
                        title={t("setup.review.checklist.modulesTitle")}
                        text={t("setup.review.checklist.modulesText")}
                      />
                      <ReviewChecklistItem
                        title={t("setup.review.checklist.brandTitle")}
                        text={t("setup.review.checklist.brandText", {
                          palette: paletteName
                        })}
                      />
                      <ReviewChecklistItem
                        title={t("setup.review.checklist.launchTitle")}
                        text={t("setup.review.checklist.launchText")}
                      />
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line/70 bg-paper/90 px-5 py-4 sm:px-6">
                <p className="text-sm text-ink-soft">
                  <span className="font-medium text-ink">
                    {t("setup.progressLabel", {
                      current: currentStepIndex + 1,
                      total: setupSteps.length
                    })}
                  </span>{" "}
                  {t(`setup.steps.${currentStep}.title`)}
                </p>

                <div className="flex flex-wrap gap-3">
                  {currentStepIndex > 0 ? (
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        const previousStep = setupSteps[currentStepIndex - 1];

                        if (previousStep) {
                          setCurrentStep(previousStep);
                        }
                      }}
                    >
                      <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
                      {t("setup.backAction")}
                    </Button>
                  ) : null}

                  {currentStep !== "review" ? (
                    <Button
                      key={`advance-${currentStep}`}
                      type="button"
                      onClick={() => {
                        void handleAdvanceStep();
                      }}
                      disabled={slugAvailability === "checking"}
                    >
                      {t("setup.nextAction")}
                      <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                    </Button>
                  ) : (
                    <Button
                      key="submit-review"
                      type="submit"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? t("setup.submitting") : t("setup.submit")}
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </Card>

          <div className="space-y-4 xl:sticky xl:top-6 xl:self-start">
            <Card className="border-line/80 bg-paper shadow-sm">
              <CardHeader className="space-y-1 pb-3">
                <CardTitle className="text-base">{t("setup.previewTitle")}</CardTitle>
                <p className="text-sm leading-6 text-ink-soft">
                  {t("setup.previewDescription")}
                </p>
              </CardHeader>
              <CardContent className="space-y-3">
                <SummaryRow
                  label={t("setup.review.businessLabel")}
                  value={tenantName || t("setup.review.pending")}
                />
                <SummaryRow
                  label={t("setup.review.slugLabel")}
                  value={tenantSlug || t("setup.review.pending")}
                />
                <SummaryRow
                  label={t("setup.review.paletteLabel")}
                  value={paletteName}
                />
              </CardContent>
            </Card>

            <Card className="border-line/80 bg-paper shadow-sm">
              <CardContent className="space-y-3 p-4">
                {launchCards.map(({ icon: Icon, text, title }) => (
                  <div
                    key={title}
                    className="rounded-2xl border border-line/70 bg-sand/35 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft/20 text-brand">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-ink">{title}</p>
                        <p className="text-sm leading-6 text-ink-soft">{text}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

function StepCard({
  description,
  index,
  isActive,
  isCompleted,
  t,
  title
}: {
  description: string;
  index: number;
  isActive: boolean;
  isCompleted: boolean;
  t: (key: string, options?: Record<string, unknown>) => string;
  title: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-3 transition",
        isActive
          ? "border-brand bg-brand-soft/14 shadow-sm"
          : "border-line/70 bg-paper/80",
        isCompleted ? "border-brand/40" : ""
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "flex size-8 items-center justify-center rounded-full border text-sm font-semibold",
              isActive || isCompleted
                ? "border-brand/30 bg-brand text-brand-contrast"
                : "border-line/80 bg-paper text-ink-soft"
            )}
          >
            {index + 1}
          </span>
          <p className="text-sm font-semibold text-ink">{title}</p>
        </div>
        {isCompleted ? (
          <Badge variant="outline" className="rounded-full border-brand/30 text-brand">
            {t("setup.completed")}
          </Badge>
        ) : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-ink-soft">{description}</p>
    </div>
  );
}

function Field({
  children,
  error,
  htmlFor,
  label
}: {
  children: ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
}) {
  return (
    <div className="space-y-2.5">
      <label className="text-sm font-medium text-ink" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}

function InfoCard({
  icon: Icon,
  text,
  title
}: {
  icon: typeof Building2;
  text: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-line/70 bg-paper p-4">
      <div className="flex items-start gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-brand-soft/16 text-brand">
          <Icon className="size-4" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold text-ink">{title}</p>
          <p className="mt-1 text-sm leading-6 text-ink-soft">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ReviewCard({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-line/70 bg-paper p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
        {label}
      </p>
      <p className="mt-3 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function ReviewChecklistItem({
  text,
  title
}: {
  text: string;
  title: string;
}) {
  return (
    <div className="rounded-2xl border border-line/70 bg-sand/35 p-4">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm leading-6 text-ink-soft">{text}</p>
    </div>
  );
}

function SummaryRow({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-line/70 bg-sand/35 px-4 py-3">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
        {label}
      </p>
      <p className="mt-2 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function SlugAvailabilityBadge({
  state,
  t
}: {
  state: SlugAvailabilityState;
  t: (key: string) => string;
}) {
  if (state === "idle") {
    return null;
  }

  const tone =
    state === "available"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : state === "checking"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : "border-rose-200 bg-rose-50 text-rose-700";

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-xs font-semibold",
        tone
      )}
    >
      {t(`setup.slugStates.${state}`)}
    </span>
  );
}
