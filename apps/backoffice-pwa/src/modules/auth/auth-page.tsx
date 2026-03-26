import { FormEvent, useRef, useState } from "react";

import {
  MailCheck,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles
} from "lucide-react";

import { useTranslation } from "@operapyme/i18n";
import { Navigate } from "react-router-dom";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { UnconfiguredPage } from "@/modules/auth/unconfigured-page";

type AuthMode = "signin" | "signup" | null;

export function AuthPage() {
  const { t } = useTranslation("backoffice");
  const { isConfigured, isBootstrapped, signInWithOtp, status } =
    useBackofficeAuth();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState<AuthMode>(null);
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
          title: t("auth.entry.formTitle"),
          description: t("auth.entry.signinDescription"),
          submitLabel: t("auth.form.submit")
        }
      : {
          eyebrow: t("auth.entry.signupEyebrow"),
          title: t("auth.entry.formTitle"),
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
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen flex-col lg:flex-row">
        <section className="order-2 flex flex-1 items-center justify-center bg-linear-to-br from-butter-200/75 via-butter-200/40 to-paper px-4 py-12 sm:px-6 lg:order-1 lg:px-12 xl:px-16">
          <div className="w-full max-w-2xl">
            <div className="relative mx-auto aspect-[1.1/0.82] max-w-xl">
              <div className="absolute inset-0 rounded-[36px] bg-[radial-gradient(circle,rgba(234,199,74,0.25)_1px,transparent_1.5px)] [background-size:16px_16px] opacity-70" />

              <div className="absolute left-10 top-8 right-6 rounded-[18px] border border-line/70 bg-paper shadow-soft">
                <div className="flex items-center gap-2 border-b border-line/60 px-4 py-3">
                  <span className="size-2.5 rounded-full bg-peach-300" />
                  <span className="size-2.5 rounded-full bg-butter-200" />
                  <span className="size-2.5 rounded-full bg-sage-300" />
                  <div className="ml-3 h-2.5 flex-1 rounded-full bg-sand-strong/75" />
                </div>

                <div className="space-y-3 px-4 py-4">
                  <div className="grid grid-cols-4 gap-2">
                    <div className="h-11 rounded-xl bg-sand-strong/75" />
                    <div className="h-11 rounded-xl bg-sage-200/70" />
                    <div className="h-11 rounded-xl bg-sky-200/70" />
                    <div className="h-11 rounded-xl bg-peach-200/70" />
                  </div>

                  <div className="rounded-[20px] border border-line/60 bg-white p-3">
                    {Array.from({ length: 7 }).map((_, index) => (
                      <div
                        key={`business-row-${index}`}
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

              <div className="absolute bottom-6 left-2 w-24 rounded-[22px] border border-line/70 bg-paper p-2.5 shadow-panel sm:w-28">
                <div className="rounded-[14px] bg-butter-200 px-3 py-2" />
                <div className="mt-2 space-y-2">
                  <div className="h-6 rounded-[14px] bg-sand-strong/80" />
                  <div className="h-2 rounded-full bg-line/80" />
                  <div className="h-2 w-4/5 rounded-full bg-line/60" />
                </div>
              </div>

              <div className="absolute bottom-3 right-3 flex size-20 items-center justify-center rounded-[26px] border border-line/70 bg-paper shadow-panel sm:size-24">
                <ShieldCheck className="size-10 text-ink" aria-hidden="true" />
              </div>
            </div>

            <div className="mt-8 text-center">
              <h1 className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
                {t("auth.hero.title")}
              </h1>
              <p className="mt-3 text-base text-ink-soft">
                {t("auth.hero.description")}
              </p>
            </div>

            <div className="mt-12 flex items-center justify-center gap-2">
              <span className="h-1.5 w-6 rounded-full bg-[#ab8500]" />
              <span className="h-1.5 w-3 rounded-full bg-butter-200" />
              <span className="h-1.5 w-3 rounded-full bg-butter-200" />
            </div>
          </div>
        </section>

        <section className="order-1 flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:order-2 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/favicon.svg"
                  alt=""
                  className="h-12 w-12 rounded-[16px]"
                />
                <p className="text-4xl font-semibold tracking-tight text-[#66727f]">
                  OperaPyme
                </p>
              </div>

              <div className="mt-10 space-y-10">
                <div>
                  <p className="text-[2rem] leading-tight font-semibold tracking-tight text-ink">
                    {t("auth.entry.existingLead")}
                  </p>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => activateMode("signin")}
                    className={cn(
                      "mt-4 h-14 w-full rounded-[14px] text-base font-semibold shadow-none",
                      mode === "signin"
                        ? "bg-[#1f2c38] text-white hover:bg-[#17212b]"
                        : "border border-[#243444] bg-white text-ink hover:bg-slate-50"
                    )}
                  >
                    {t("auth.entry.existingCta")}
                  </Button>
                </div>

                <div>
                  <p className="text-[2rem] leading-tight font-semibold tracking-tight text-ink">
                    {t("auth.entry.firstTimeLead")}
                  </p>
                  <Button
                    type="button"
                    size="lg"
                    onClick={() => activateMode("signup")}
                    className={cn(
                      "mt-4 h-14 w-full rounded-[14px] text-base font-semibold shadow-none",
                      mode === "signup"
                        ? "bg-[#1f2c38] text-white hover:bg-[#17212b]"
                        : "border border-[#243444] bg-white text-ink hover:bg-slate-50"
                    )}
                  >
                    {t("auth.entry.firstTimeCta")}
                  </Button>
                </div>
              </div>
            </div>

            {mode ? (
              <div className="mt-10 rounded-[24px] border border-line/70 bg-white p-5 shadow-panel">
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

                <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium text-ink"
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
                      className="h-[52px] rounded-[14px] border-line/80 bg-white"
                    />
                  </div>

                  {error ? (
                    <p className="rounded-[18px] border border-rose-300/80 bg-rose-100/80 px-4 py-3 text-sm text-rose-900">
                      {error}
                    </p>
                  ) : null}

                  {emailSent ? (
                    <div className="rounded-[20px] border border-line/70 bg-sage-200/30 p-4">
                      <div className="flex items-start gap-3">
                        <MailCheck className="mt-0.5 size-4 shrink-0 text-ink" />
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
                    className="h-12 w-full rounded-[14px] bg-[#1f2c38] text-white hover:bg-[#17212b]"
                    size="lg"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting
                      ? t("auth.form.submitting")
                      : entryContent.submitLabel}
                  </Button>
                </form>

                <div className="mt-4 flex items-center gap-3 rounded-[18px] bg-butter-200/25 px-4 py-3">
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-butter-200/80 text-ink">
                    {mode === "signin" ? (
                      <MonitorSmartphone className="size-4" aria-hidden="true" />
                    ) : (
                      <Sparkles className="size-4" aria-hidden="true" />
                    )}
                  </span>
                  <p className="text-sm text-ink-soft">
                    {t("auth.entry.helper")}
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>
    </div>
  );
}
