import { FormEvent, useRef, useState } from "react";

import {
  ArrowRight,
  MailCheck,
  MonitorSmartphone,
  ShieldCheck,
  ShieldEllipsis,
  Sparkles
} from "lucide-react";

import { useTranslation } from "@operapyme/i18n";
import { Navigate } from "react-router-dom";

import { useBackofficeAuth } from "@/app/auth-provider";
import { LanguageSwitcher } from "@/components/layout/language-switcher";
import { ThemeToggleButton } from "@/components/layout/theme-toggle-button";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UnconfiguredPage } from "@/modules/auth/unconfigured-page";

type AuthMode = "signin" | "signup";

export function AuthPage() {
  const { t } = useTranslation("backoffice");
  const { isConfigured, isBootstrapped, signInWithOtp, status } =
    useBackofficeAuth();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isConfigured) {
    return <UnconfiguredPage />;
  }

  if (status === "signed_in") {
    return <Navigate to={isBootstrapped ? "/" : "/setup"} replace />;
  }

  const entryContent =
    mode === "signin"
      ? {
          eyebrow: t("auth.entry.signinEyebrow"),
          title: t("auth.entry.signinTitle"),
          description: t("auth.entry.signinDescription"),
          submitLabel: t("auth.form.submit")
        }
      : {
          eyebrow: t("auth.entry.signupEyebrow"),
          title: t("auth.entry.signupTitle"),
          description: t("auth.entry.signupDescription"),
          submitLabel: t("auth.form.submitFirstTime")
        };

  function activateMode(nextMode: AuthMode) {
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
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-2rem)] gap-4 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,0.92fr)]">
        <section className="order-2 flex flex-col justify-between overflow-hidden rounded-[32px] border border-butter-200/50 bg-linear-to-br from-butter-200/80 via-paper to-peach-200/35 p-5 shadow-soft sm:p-6 lg:order-1 lg:min-h-[720px] lg:p-8">
          <div className="space-y-6">
            <div className="inline-flex rounded-full border border-paper/80 bg-paper/75 px-4 py-2 text-xs font-medium uppercase tracking-[0.24em] text-ink-muted shadow-panel">
              {t("auth.hero.eyebrow")}
            </div>

            <div className="relative mx-auto flex w-full max-w-[32rem] items-center justify-center px-2 py-3 sm:px-4 sm:py-6">
              <div className="absolute inset-x-6 top-10 bottom-8 rounded-[32px] bg-[radial-gradient(circle,rgba(242,229,186,0.82)_1px,transparent_1.4px)] [background-size:16px_16px] opacity-55" />
              <div className="absolute left-8 top-10 size-28 rounded-full bg-butter-200/60 blur-3xl" />
              <div className="absolute right-10 bottom-10 size-24 rounded-full bg-sky-200/50 blur-3xl" />

              <div className="relative w-full max-w-[26rem] rounded-[30px] border border-line/70 bg-paper/95 p-3 shadow-soft sm:p-4">
                <div className="flex items-center gap-2 border-b border-line/60 pb-3">
                  <span className="size-2.5 rounded-full bg-peach-300" />
                  <span className="size-2.5 rounded-full bg-butter-200" />
                  <span className="size-2.5 rounded-full bg-sage-300" />
                  <div className="ml-2 h-2.5 flex-1 rounded-full bg-sand-strong/80" />
                </div>

                <div className="grid gap-3 pt-4 sm:grid-cols-[1.3fr_0.7fr]">
                  <div className="space-y-3">
                    <div className="grid gap-2 sm:grid-cols-3">
                      <div className="rounded-[20px] bg-sand-strong/80 p-3">
                        <div className="h-2 w-12 rounded-full bg-line/80" />
                        <div className="mt-3 h-4 w-16 rounded-full bg-ink/90" />
                      </div>
                      <div className="rounded-[20px] bg-sage-200/65 p-3">
                        <div className="h-2 w-10 rounded-full bg-sage-400/60" />
                        <div className="mt-3 h-4 w-14 rounded-full bg-ink/85" />
                      </div>
                      <div className="rounded-[20px] bg-peach-200/65 p-3">
                        <div className="h-2 w-10 rounded-full bg-peach-400/60" />
                        <div className="mt-3 h-4 w-12 rounded-full bg-ink/85" />
                      </div>
                    </div>

                    <div className="space-y-2 rounded-[24px] border border-line/60 bg-paper p-3">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <div
                          key={`auth-preview-row-${index}`}
                          className="grid grid-cols-[1.1fr_0.7fr_0.4fr] items-center gap-2 rounded-[18px] bg-sand/55 px-3 py-2"
                        >
                          <div className="h-2.5 rounded-full bg-line/85" />
                          <div className="h-2.5 rounded-full bg-line/60" />
                          <div className="h-6 rounded-full bg-paper shadow-panel" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="rounded-[24px] border border-line/60 bg-sky-200/55 p-4">
                      <MonitorSmartphone
                        className="size-5 text-ink"
                        aria-hidden="true"
                      />
                      <div className="mt-4 space-y-2">
                        <div className="h-2.5 w-16 rounded-full bg-ink/85" />
                        <div className="h-2.5 w-12 rounded-full bg-line/80" />
                      </div>
                    </div>

                    <div className="rounded-[24px] border border-line/60 bg-paper p-4">
                      <div className="h-10 rounded-[18px] bg-butter-200/70" />
                      <div className="mt-3 space-y-2">
                        <div className="h-2.5 rounded-full bg-line/80" />
                        <div className="h-2.5 w-5/6 rounded-full bg-line/65" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -left-0.5 bottom-2 w-28 rounded-[28px] border border-line/70 bg-paper/95 p-3 shadow-panel sm:w-32">
                <div className="rounded-[16px] bg-butter-200 px-3 py-2">
                  <div className="h-2 w-12 rounded-full bg-ink/80" />
                </div>
                <div className="mt-3 space-y-2">
                  <div className="h-8 rounded-[16px] bg-sand-strong/75" />
                  <div className="h-2.5 rounded-full bg-line/80" />
                  <div className="h-2.5 w-5/6 rounded-full bg-line/60" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div className="h-7 rounded-full bg-sage-300/75" />
                  <div className="h-7 rounded-full bg-peach-200/70" />
                </div>
              </div>

              <div className="absolute right-0 bottom-3 flex size-20 items-center justify-center rounded-[28px] border border-line/70 bg-paper/95 shadow-panel sm:size-24">
                <ShieldCheck className="size-10 text-ink" aria-hidden="true" />
              </div>
            </div>

            <div className="mx-auto max-w-xl text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {t("auth.hero.title")}
              </h1>
              <p className="mt-3 text-sm leading-7 text-ink-soft sm:text-base">
                {t("auth.hero.description")}
              </p>
            </div>
          </div>

          <div className="mt-8 space-y-4">
            <div className="flex items-center justify-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-ink" />
              <span className="h-1.5 w-3 rounded-full bg-butter-200/80" />
              <span className="h-1.5 w-3 rounded-full bg-butter-200/80" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <HeroBadge
                icon={MonitorSmartphone}
                label={t("auth.hero.badgeDevice")}
              />
              <HeroBadge icon={ShieldCheck} label={t("auth.hero.badgeSecurity")} />
              <HeroBadge icon={Sparkles} label={t("auth.hero.badgeSetup")} />
            </div>
          </div>
        </section>

        <section className="order-1 flex flex-col rounded-[32px] border border-line/70 bg-paper/92 p-5 shadow-panel backdrop-blur-sm sm:p-6 lg:order-2 lg:min-h-[720px] lg:px-8 lg:py-7">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src="/favicon.svg"
                alt=""
                className="size-12 rounded-[18px] border border-line/70 bg-paper p-1.5 shadow-panel"
              />
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
                  {t("auth.entry.brandLabel")}
                </p>
                <p className="text-2xl font-semibold tracking-tight text-ink">
                  OperaPyme
                </p>
              </div>
            </div>

            <ThemeToggleButton />
          </div>

          <div className="mt-4 self-start">
            <LanguageSwitcher />
          </div>

          <div className="mt-8 flex flex-1 flex-col justify-center">
            <div className="space-y-6">
              <div className="space-y-3">
                <p className="text-xl tracking-tight text-ink-soft">
                  {t("auth.entry.existingLead")}
                </p>
                <Button
                  type="button"
                  size="lg"
                  onClick={() => activateMode("signin")}
                  className={cn(
                    "h-14 w-full rounded-[18px] text-base",
                    mode === "signin"
                      ? "bg-ink text-paper hover:bg-ink/92"
                      : "border border-line-strong bg-paper text-ink shadow-none hover:bg-sand-strong/70"
                  )}
                >
                  {t("auth.entry.existingCta")}
                </Button>
              </div>

              <div className="space-y-3">
                <p className="text-xl tracking-tight text-ink-soft">
                  {t("auth.entry.firstTimeLead")}
                </p>
                <Button
                  type="button"
                  size="lg"
                  onClick={() => activateMode("signup")}
                  className={cn(
                    "h-14 w-full rounded-[18px] text-base",
                    mode === "signup"
                      ? "bg-ink text-paper hover:bg-ink/92"
                      : "border border-line-strong bg-paper text-ink shadow-none hover:bg-sand-strong/70"
                  )}
                >
                  {t("auth.entry.firstTimeCta")}
                </Button>
              </div>

              <form
                className="space-y-4 rounded-[28px] border border-line/70 bg-sand/50 p-4 sm:p-5"
                onSubmit={handleSubmit}
              >
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
                    {entryContent.eyebrow}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight text-ink">
                    {entryContent.title}
                  </h2>
                  <p className="text-sm leading-6 text-ink-soft">
                    {entryContent.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <label
                    className="text-sm font-medium text-ink"
                    htmlFor="auth-email"
                  >
                    {t("auth.form.emailLabel")}
                  </label>
                  <Input
                    ref={emailInputRef}
                    id="auth-email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder={t("auth.form.emailPlaceholder")}
                    required
                    className="h-[52px] rounded-[18px] bg-paper"
                  />
                </div>

                {error ? (
                  <p className="rounded-[20px] border border-rose-300/80 bg-rose-100/80 px-4 py-3 text-sm text-rose-900">
                    {error}
                  </p>
                ) : null}

                {emailSent ? (
                  <div className="rounded-[24px] border border-line/70 bg-paper/85 p-4">
                    <div className="flex items-start gap-3">
                      <MailCheck className="mt-1 size-4 shrink-0 text-ink" />
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          {t("auth.form.emailSentTitle")}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-soft">
                          {t("auth.form.emailSentText", { email })}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}

                <Button
                  className="h-12 w-full rounded-[18px] bg-ink text-paper hover:bg-ink/92"
                  size="lg"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("auth.form.submitting")
                    : entryContent.submitLabel}
                </Button>
              </form>

              <div className="rounded-[24px] border border-line/70 bg-paper/70 p-4">
                <div className="flex items-start gap-3">
                  <ShieldEllipsis className="mt-1 size-4 shrink-0 text-ink" />
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {t("auth.form.noteTitle")}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-ink-soft">
                      {t("auth.form.noteText")}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-ink-soft">
                <ArrowRight className="size-4 text-ink" aria-hidden="true" />
                <p>{t("auth.entry.helper")}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

interface HeroBadgeProps {
  icon: typeof MonitorSmartphone;
  label: string;
}

function HeroBadge({ icon: Icon, label }: HeroBadgeProps) {
  return (
    <div className="flex items-center gap-3 rounded-[22px] border border-paper/80 bg-paper/70 px-4 py-3 shadow-panel">
      <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-butter-200/70 text-ink">
        <Icon className="size-4" aria-hidden="true" />
      </span>
      <span className="text-sm font-medium text-ink">{label}</span>
    </div>
  );
}
