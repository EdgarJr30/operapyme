import { FormEvent, useRef, useState } from 'react';

import { MailCheck, ShieldCheck } from 'lucide-react';

import { useTranslation } from '@operapyme/i18n';
import { Navigate } from 'react-router-dom';

import { useBackofficeAuth } from '@/app/auth-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UnconfiguredPage } from '@/modules/auth/unconfigured-page';

type AuthMode = 'signin' | 'signup';

export function AuthPage() {
  const { t } = useTranslation('backoffice');
  const { isConfigured, isBootstrapped, signInWithOtp, status } =
    useBackofficeAuth();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState('');
  const [mode, setMode] = useState<AuthMode>('signin');
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isConfigured) {
    return <UnconfiguredPage />;
  }

  if (status === 'signed_in') {
    return <Navigate to={isBootstrapped ? '/' : '/setup'} replace />;
  }

  const entryContent =
    mode === 'signin'
      ? {
          title: t('auth.entry.signinPanelTitle'),
          switchLead: t('auth.entry.signinSwitchLead'),
          switchAction: t('auth.entry.signinSwitchAction'),
          description: t('auth.entry.signinDescription'),
          submitLabel: t('auth.form.submit'),
        }
      : {
          title: t('auth.entry.signupPanelTitle'),
          switchLead: t('auth.entry.signupSwitchLead'),
          switchAction: t('auth.entry.signupSwitchAction'),
          description: t('auth.entry.signupDescription'),
          submitLabel: t('auth.form.submitFirstTime'),
        };

  function setAuthMode(nextMode: AuthMode) {
    setMode(nextMode);
    setError(null);
    setEmailSent(false);
    requestAnimationFrame(() => {
      emailInputRef.current?.focus();
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setEmailSent(false);

    const nextError = await signInWithOtp(email.trim());

    setIsSubmitting(false);

    if (nextError) {
      setError(nextError);
      return;
    }

    setEmailSent(true);
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <img
                src="/favicon.svg"
                alt="OperaPyme"
                className="h-10 w-auto rounded-[14px]"
              />
              <h1 className="mt-8 text-3xl font-bold tracking-tight text-ink">
                {entryContent.title}
              </h1>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {entryContent.switchLead}{' '}
                <button
                  type="button"
                  onClick={() =>
                    setAuthMode(mode === 'signin' ? 'signup' : 'signin')
                  }
                  className="font-semibold text-[#1f2c38] transition hover:text-[#17212b]"
                >
                  {entryContent.switchAction}
                </button>
              </p>
              <p className="mt-3 text-sm leading-6 text-ink-soft">
                {entryContent.description}
              </p>
            </div>

            <div className="mt-10">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="auth-email"
                    className="block text-sm font-medium text-ink"
                  >
                    {t('auth.form.emailLabel')}
                  </label>
                  <div className="mt-2">
                    <Input
                      ref={emailInputRef}
                      id="auth-email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={t('auth.form.emailPlaceholder')}
                      required
                      className="h-11.5 rounded-md border-line/80 bg-white px-3 py-2"
                    />
                  </div>
                </div>

                {error ? (
                  <p className="rounded-xl border border-rose-300/80 bg-rose-100/80 px-4 py-3 text-sm text-rose-900">
                    {error}
                  </p>
                ) : null}

                {emailSent ? (
                  <div className="rounded-xl border border-line/70 bg-sage-200/25 p-4">
                    <div className="flex items-start gap-3">
                      <MailCheck className="mt-0.5 size-4 shrink-0 text-ink" />
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {t('auth.form.emailSentTitle')}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-soft">
                          {t('auth.form.emailSentText', { email })}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <div>
                  <Button
                    className="flex h-11 w-full justify-center rounded-md bg-[#1f2c38] px-3 py-1.5 text-sm font-semibold text-white shadow-none hover:bg-[#17212b]"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t('auth.form.submitting')
                      : entryContent.submitLabel}
                  </Button>
                </div>
              </form>

              <div className="mt-10">
                <div className="relative">
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 flex items-center"
                  >
                    <div className="w-full border-t border-line/70" />
                  </div>
                  <div className="relative flex justify-center text-sm font-medium">
                    <span className="bg-white px-6 text-ink">
                      {t('auth.form.noteTitle')}
                    </span>
                  </div>
                </div>

                <div className="mt-6 rounded-xl border border-line/70 bg-white px-4 py-3">
                  <p className="text-sm leading-6 text-ink-soft">
                    {t('auth.form.noteText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative hidden w-0 flex-1 overflow-hidden lg:block">
          <div className="absolute inset-0 bg-linear-to-br from-butter-200/85 via-butter-200/35 to-paper" />
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(234,199,74,0.22)_1px,transparent_1.5px)] bg-size-[18px_18px] opacity-65" />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-10">
            <div className="relative w-full max-w-lg">
              <div className="rounded-[22px] border border-paper/60 bg-paper/95 p-4 shadow-soft">
                <div className="flex items-center gap-2 border-b border-line/60 pb-3">
                  <span className="size-2.5 rounded-full bg-peach-300" />
                  <span className="size-2.5 rounded-full bg-butter-200" />
                  <span className="size-2.5 rounded-full bg-sage-300" />
                  <div className="ml-3 h-2.5 flex-1 rounded-full bg-sand-strong/75" />
                </div>

                <div className="grid gap-3 pt-4">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-12 rounded-xl bg-sand-strong/75" />
                    <div className="h-12 rounded-xl bg-sage-200/70" />
                    <div className="h-12 rounded-xl bg-sky-200/70" />
                    <div className="h-12 rounded-xl bg-peach-200/70" />
                  </div>

                  <div className="rounded-[18px] border border-line/60 bg-white p-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div
                        key={`auth-visual-row-${index}`}
                        className="grid grid-cols-[1.1fr_0.8fr_0.5fr] gap-2 border-b border-line/35 px-1 py-2 last:border-b-0"
                      >
                        <div className="h-2.5 rounded-full bg-line/80" />
                        <div className="h-2.5 rounded-full bg-line/55" />
                        <div className="h-2.5 rounded-full bg-butter-200/90" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute -left-6 bottom-6 w-28 rounded-3xl border border-line/70 bg-paper/95 p-3 shadow-panel">
                <div className="rounded-[14px] bg-butter-200 px-3 py-3" />
                <div className="mt-3 space-y-2">
                  <div className="h-7 rounded-[14px] bg-sand-strong/75" />
                  <div className="h-2 rounded-full bg-line/80" />
                  <div className="h-2 w-4/5 rounded-full bg-line/60" />
                </div>
              </div>

              <div className="absolute -right-6 bottom-3 flex size-24 items-center justify-center rounded-[30px] border border-line/70 bg-paper/95 shadow-panel">
                <ShieldCheck className="size-10 text-ink" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-10 text-center">
              <h2 className="text-5xl font-semibold tracking-tight text-ink">
                {t('auth.hero.title')}
              </h2>
              <p className="mt-4 text-xl text-ink-soft">
                {t('auth.hero.description')}
              </p>
              <div className="mt-12 flex items-center justify-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-[#ab8500]" />
                <span className="h-1.5 w-3 rounded-full bg-butter-200" />
                <span className="h-1.5 w-3 rounded-full bg-butter-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
