import { useEffect, useRef, useState, type ReactNode } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, ArrowRight, Building2, Check, LogOut } from 'lucide-react';
import { useForm } from 'react-hook-form';

import { useTranslation } from '@operapyme/i18n';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useBackofficeAuth } from '@/app/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  slugifyTenantName,
  tenantSetupSchema,
  type TenantSetupFormValues,
} from '@/lib/forms/tenant-setup-schema';
import { supabase } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import { UnconfiguredPage } from '@/modules/auth/unconfigured-page';

type SetupStepKey = 'workspace' | 'review';
type SlugAvailabilityState =
  | 'idle'
  | 'checking'
  | 'available'
  | 'unavailable'
  | 'error';

const setupSteps: SetupStepKey[] = ['workspace', 'review'];

export function SetupTenantPage() {
  const { t } = useTranslation('backoffice');
  const navigate = useNavigate();
  const { isBootstrapped, isConfigured, refreshAccessContext, signOut, status, user } =
    useBackofficeAuth();
  const [currentStep, setCurrentStep] = useState<SetupStepKey>('workspace');
  const [slugTouched, setSlugTouched] = useState(false);
  const [slugAvailability, setSlugAvailability] =
    useState<SlugAvailabilityState>('idle');
  const slugCheckRequestRef = useRef(0);
  const lastCheckedSlugRef = useRef('');

  const {
    clearErrors,
    formState: { errors, isSubmitting },
    getValues,
    handleSubmit,
    register,
    setError,
    setValue,
    trigger,
    watch,
  } = useForm<TenantSetupFormValues>({
    resolver: zodResolver(tenantSetupSchema),
    defaultValues: { name: '', slug: '' },
  });

  const tenantName = watch('name');
  const tenantSlug = watch('slug');
  const currentStepIndex = setupSteps.indexOf(currentStep);

  useEffect(() => {
    if (!slugTouched) {
      setValue('slug', slugifyTenantName(tenantName), {
        shouldDirty: true,
        shouldValidate: true,
      });
    }
  }, [slugTouched, tenantName, setValue]);

  useEffect(() => {
    if (status === 'signed_in' && isBootstrapped) {
      navigate('/', { replace: true });
    }
  }, [isBootstrapped, navigate, status]);

  useEffect(() => {
    const normalizedSlug = tenantSlug.trim();

    if (!normalizedSlug || errors.slug) {
      setSlugAvailability('idle');
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
      setSlugAvailability('error');
      return false;
    }

    if (!force && normalizedSlug === lastCheckedSlugRef.current) {
      return slugAvailability === 'available';
    }

    const requestId = slugCheckRequestRef.current + 1;
    slugCheckRequestRef.current = requestId;
    setSlugAvailability('checking');

    const { data, error } = await supabase.rpc('is_tenant_slug_available', {
      target_slug: normalizedSlug,
    });

    if (requestId !== slugCheckRequestRef.current) {
      return false;
    }

    lastCheckedSlugRef.current = normalizedSlug;

    if (error) {
      setSlugAvailability('error');
      return false;
    }

    if (!data) {
      setError('slug', {
        type: 'manual',
        message: t('setup.slugUnavailable'),
      });
      setSlugAvailability('unavailable');
      return false;
    }

    clearErrors('slug');
    setSlugAvailability('available');
    return true;
  }

  async function handleAdvanceStep() {
    if (currentStep === 'workspace') {
      const isValid = await trigger(['name', 'slug'], { shouldFocus: true });

      if (!isValid) {
        return;
      }

      const slugIsAvailable = await validateSlugAvailability(
        getValues('slug'),
        true
      );

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
      toast.error(t('setup.unavailableError'));
      return;
    }

    const slugIsAvailable = await validateSlugAvailability(values.slug, true);

    if (!slugIsAvailable) {
      setCurrentStep('workspace');
      return;
    }

    const { error } = await supabase.rpc('create_tenant_with_owner', {
      target_name: values.name.trim(),
      target_slug: values.slug.trim(),
      next_palette_id: 'slate',
      next_palette_seed_colors: null,
    });

    if (error) {
      if (
        /slug/i.test(error.message) ||
        /tenants_slug_key/i.test(error.message) ||
        /already in use/i.test(error.message)
      ) {
        setError('slug', {
          type: 'manual',
          message: t('setup.slugUnavailable'),
        });
        setCurrentStep('workspace');
      }

      toast.error(t('setup.submitError', { message: error.message }));
      return;
    }

    await refreshAccessContext();
    toast.success(t('setup.successTitle'), {
      description: t('setup.successDescription'),
    });
    navigate('/', { replace: true });
  }

  return (
    <div className="flex min-h-screen flex-col sm:flex-row">
      {/* Sidebar */}
      <aside className="flex shrink-0 flex-col bg-ink text-paper sm:w-72 sm:min-h-screen">
        {/* Mobile: compact top bar */}
        <div className="flex items-center justify-between border-b border-paper/10 px-5 py-4 sm:hidden">
          <span className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-brand">
              <Building2 className="size-4 text-brand-contrast" aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold text-paper">OperaPyme</span>
          </span>
          <span className="text-xs text-paper/60">
            {t('setup.progressLabel', {
              current: currentStepIndex + 1,
              total: setupSteps.length,
            })}
          </span>
        </div>

        {/* Desktop: full sidebar */}
        <div className="hidden flex-1 flex-col px-7 py-10 sm:flex">
          {/* Brand mark */}
          <div className="mb-10">
            <span className="mb-4 flex size-10 items-center justify-center rounded-xl bg-brand">
              <Building2 className="size-5 text-brand-contrast" aria-hidden="true" />
            </span>
            <p className="text-sm leading-6 text-paper/60">
              {t('setup.sidebarTagline')}
            </p>
          </div>

          {/* Step list */}
          <nav
            className="flex-1 space-y-1"
            aria-label={t('setup.stepsNav')}
          >
            {setupSteps.map((step, index) => {
              const isCompleted = index < currentStepIndex;
              const isActive = step === currentStep;

              return (
                <div key={step} className="flex items-start gap-3 py-3">
                  <span
                    className={cn(
                      'mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold',
                      isCompleted
                        ? 'border-brand bg-brand text-brand-contrast'
                        : isActive
                          ? 'border-paper/70 bg-paper/10 text-paper'
                          : 'border-paper/25 text-paper/35'
                    )}
                  >
                    {isCompleted ? (
                      <Check className="size-3.5" aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <div>
                    <p
                      className={cn(
                        'text-sm font-semibold leading-snug',
                        isActive
                          ? 'text-paper'
                          : isCompleted
                            ? 'text-paper/75'
                            : 'text-paper/35'
                      )}
                    >
                      {t(`setup.steps.${step}.title`)}
                    </p>
                    <p
                      className={cn(
                        'mt-0.5 text-xs leading-5',
                        isActive ? 'text-paper/60' : 'text-paper/30'
                      )}
                    >
                      {t(`setup.steps.${step}.description`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </nav>

          {/* User + sign out */}
          <div className="mt-8 space-y-3 border-t border-paper/10 pt-6">
            {user?.email ? (
              <p className="truncate text-xs text-paper/50">{user.email}</p>
            ) : null}
            <button
              type="button"
              onClick={() => {
                void signOut();
              }}
              className="flex min-h-11 items-center gap-2 text-xs text-paper/50 transition-colors hover:text-paper/90"
            >
              <LogOut className="size-3.5" aria-hidden="true" />
              {t('setup.signOut')}
            </button>
          </div>
        </div>
      </aside>

      {/* Main form area */}
      <main className="flex flex-1 flex-col bg-paper">
        <div className="flex flex-1 items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
          <div className="w-full max-w-lg">
            <h1 className="mb-2 text-3xl font-bold tracking-tight text-ink">
              {t('setup.startTitle')}
            </h1>
            <p className="mb-8 text-sm leading-6 text-ink-soft">
              {t(`setup.steps.${currentStep}.helper`)}
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              {currentStep === 'workspace' ? (
                <>
                  <Field
                    htmlFor="tenant-name"
                    label={t('setup.nameLabel')}
                    error={errors.name?.message}
                  >
                    <Input
                      id="tenant-name"
                      placeholder={t('setup.namePlaceholder')}
                      className="h-12 rounded-2xl"
                      {...register('name')}
                    />
                  </Field>

                  <Field
                    htmlFor="tenant-slug"
                    label={t('setup.slugLabel')}
                    error={errors.slug?.message}
                  >
                    <Input
                      id="tenant-slug"
                      placeholder={t('setup.slugPlaceholder')}
                      className="h-12 rounded-2xl"
                      {...register('slug', {
                        onChange: () => {
                          setSlugTouched(true);
                          lastCheckedSlugRef.current = '';
                        },
                      })}
                    />
                  </Field>

                  {tenantSlug ? (
                    <div
                      className="flex items-center justify-between rounded-2xl border border-line/70 bg-sand/35 px-4 py-3"
                      aria-live="polite"
                    >
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-muted">
                          {t('setup.slugPreviewTitle')}
                        </p>
                        <p className="text-sm font-semibold text-ink">
                          {tenantSlug}
                        </p>
                      </div>
                      <SlugAvailabilityBadge state={slugAvailability} t={t} />
                    </div>
                  ) : null}
                </>
              ) : null}

              {currentStep === 'review' ? (
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ReviewCard
                      label={t('setup.review.businessLabel')}
                      value={tenantName || t('setup.review.pending')}
                    />
                    <ReviewCard
                      label={t('setup.review.slugLabel')}
                      value={tenantSlug || t('setup.review.pending')}
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <ReviewChecklistItem
                      title={t('setup.review.checklist.membershipTitle')}
                      text={t('setup.review.checklist.membershipText')}
                    />
                    <ReviewChecklistItem
                      title={t('setup.review.checklist.modulesTitle')}
                      text={t('setup.review.checklist.modulesText')}
                    />
                    <ReviewChecklistItem
                      title={t('setup.review.checklist.launchTitle')}
                      text={t('setup.review.checklist.launchText')}
                    />
                  </div>
                </div>
              ) : null}

              <div className="flex items-center justify-between pt-4">
                {currentStepIndex > 0 ? (
                  <Button
                    type="button"
                    variant="ghost"
                    className="min-h-11"
                    onClick={() => {
                      const prev = setupSteps[currentStepIndex - 1];

                      if (prev) {
                        setCurrentStep(prev);
                      }
                    }}
                  >
                    <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
                    {t('setup.backAction')}
                  </Button>
                ) : (
                  <span />
                )}

                {currentStep !== 'review' ? (
                  <Button
                    type="button"
                    className="min-h-11 rounded-full px-6"
                    onClick={() => {
                      void handleAdvanceStep();
                    }}
                    disabled={slugAvailability === 'checking'}
                  >
                    {t('setup.nextAction')}
                    <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="min-h-11 rounded-full px-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t('setup.submitting') : t('setup.submit')}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  children,
  error,
  htmlFor,
  label,
}: {
  children: ReactNode;
  error?: string;
  htmlFor: string;
  label: string;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-ink" htmlFor={htmlFor}>
        {label}
      </label>
      {children}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
    </div>
  );
}

function ReviewCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-paper p-4">
      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-muted">
        {label}
      </p>
      <p className="mt-3 text-sm font-semibold text-ink">{value}</p>
    </div>
  );
}

function ReviewChecklistItem({ text, title }: { text: string; title: string }) {
  return (
    <div className="rounded-2xl border border-line/70 bg-sand/35 p-4">
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="mt-1 text-sm leading-6 text-ink-soft">{text}</p>
    </div>
  );
}

function SlugAvailabilityBadge({
  state,
  t,
}: {
  state: SlugAvailabilityState;
  t: (key: string) => string;
}) {
  if (state === 'idle') {
    return null;
  }

  const tone =
    state === 'available'
      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
      : state === 'checking'
        ? 'border-amber-200 bg-amber-50 text-amber-700'
        : 'border-rose-200 bg-rose-50 text-rose-700';

  return (
    <span
      className={cn(
        'inline-flex rounded-full border px-3 py-1 text-xs font-semibold',
        tone
      )}
    >
      {t(`setup.slugStates.${state}`)}
    </span>
  );
}
