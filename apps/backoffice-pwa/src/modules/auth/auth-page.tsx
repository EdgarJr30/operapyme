import { FormEvent, useRef, useState } from "react";

import {
  Building2,
  ChevronRight,
  FileText,
  KeyRound,
  Laptop,
  MailCheck,
  ShieldCheck,
  Smartphone,
  Users
} from "lucide-react";
import { motion } from "motion/react";

import { useTranslation } from "@operapyme/i18n";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { backofficeTransition, pageTransitionVariants } from "@/lib/motion";
import { UnconfiguredPage } from "@/modules/auth/unconfigured-page";

type AuthMode = "signin" | "signup";
type SignInView = "password" | "magic_link" | "recovery";

type StoryItem = {
  key: string;
  icon: typeof Users;
};

const storyItems: StoryItem[] = [
  { key: "capture", icon: Users },
  { key: "quote", icon: FileText },
  { key: "access", icon: ShieldCheck }
];

const capabilityItems: StoryItem[] = [
  { key: "mobile", icon: Smartphone },
  { key: "desktop", icon: Laptop },
  { key: "security", icon: KeyRound }
];

export function AuthPage() {
  const { t } = useTranslation("backoffice");
  const {
    isConfigured,
    isBootstrapped,
    requestPasswordReset,
    signInWithOtp,
    signInWithPassword,
    status
  } = useBackofficeAuth();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<AuthMode>("signin");
  const [signInView, setSignInView] = useState<SignInView>("password");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isConfigured) {
    return <UnconfiguredPage />;
  }

  if (status === "signed_in") {
    return <Navigate to={isBootstrapped ? "/" : "/setup"} replace />;
  }

  const isFirstAccess = mode === "signup";
  const isPasswordView = !isFirstAccess && signInView === "password";
  const isRecoveryView = !isFirstAccess && signInView === "recovery";

  const entryContent =
    mode === "signin"
      ? {
          title: t("auth.entry.signinPanelTitle"),
          switchLead: t("auth.entry.signinSwitchLead"),
          switchAction: t("auth.entry.signinSwitchAction"),
          description: t("auth.entry.signinDescription"),
          badge: t("auth.entry.signinEyebrow"),
          submitLabel: isRecoveryView
            ? t("auth.form.recoverySubmit")
            : isPasswordView
              ? t("auth.form.passwordSubmit")
              : t("auth.form.submit")
        }
      : {
          title: t("auth.entry.signupPanelTitle"),
          switchLead: t("auth.entry.signupSwitchLead"),
          switchAction: t("auth.entry.signupSwitchAction"),
          description: t("auth.entry.signupDescription"),
          badge: t("auth.entry.signupEyebrow"),
          submitLabel: t("auth.form.submitFirstTime")
        };

  function focusEmailField() {
    requestAnimationFrame(() => {
      emailInputRef.current?.focus();
    });
  }

  function setAuthMode(nextMode: AuthMode) {
    setMode(nextMode);
    setSignInView(nextMode === "signin" ? "password" : "magic_link");
    setPassword("");
    focusEmailField();
  }

  function handleSignInViewChange(nextView: SignInView) {
    setSignInView(nextView);
    if (nextView !== "password") {
      setPassword("");
    }
    focusEmailField();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const trimmedEmail = email.trim();
    let nextError: string | null = null;

    if (isPasswordView) {
      nextError = await signInWithPassword(trimmedEmail, password);
    } else if (isRecoveryView) {
      nextError = await requestPasswordReset(trimmedEmail);
    } else {
      nextError = await signInWithOtp(trimmedEmail);
    }

    setIsSubmitting(false);

    if (nextError) {
      const errorKey = isRecoveryView
        ? "auth.form.recoveryError"
        : isPasswordView
          ? "auth.form.passwordError"
          : "auth.form.emailSendError";

      toast.error(t(errorKey, { message: nextError }));
      return;
    }

    if (isRecoveryView) {
      toast.success(t("auth.form.recoverySentTitle"), {
        description: t("auth.form.recoverySentText", { email: trimmedEmail })
      });
      handleSignInViewChange("password");
      return;
    }

    if (isPasswordView) {
      toast.success(t("auth.form.passwordSuccessTitle"), {
        description: t("auth.form.passwordSuccessText")
      });
      return;
    }

    toast.success(t("auth.form.emailSentTitle"), {
      description: t("auth.form.emailSentText", { email: trimmedEmail })
    });
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#f8fbfd_0%,#eef4f8_38%,#f8fafc_100%)]">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
        <motion.div
          className="grid min-h-full flex-1 gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(22rem,30rem)] xl:grid-cols-[minmax(0,1.12fr)_30rem]"
          initial="initial"
          animate="animate"
          variants={pageTransitionVariants}
        >
          <motion.section
            className="relative overflow-hidden rounded-[2rem] border border-line/60 bg-[linear-gradient(155deg,rgba(45,62,80,0.96),rgba(45,62,80,0.9)_38%,rgba(75,99,122,0.88)_100%)] px-4 py-5 text-sidebar-text shadow-soft sm:px-6 sm:py-6 lg:min-h-[calc(100vh-4rem)] lg:px-8 lg:py-8"
            transition={backofficeTransition}
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,185,127,0.28),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,231,207,0.16),transparent_30%)]" />
            <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_58%)]" />

            <div className="relative flex h-full flex-col">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex min-h-11 items-center rounded-full border border-white/12 bg-white/10 px-4 text-sm font-semibold tracking-tight text-white">
                    {t("auth.hero.eyebrow")}
                  </div>
                  <div className="max-w-xl space-y-3">
                    <h1 className="text-[2rem] font-semibold leading-tight tracking-tight text-white sm:text-4xl xl:text-[3.4rem]">
                      {t("auth.hero.title")}
                    </h1>
                    <p className="max-w-lg text-sm leading-6 text-sidebar-muted sm:text-base">
                      {t("auth.hero.description")}
                    </p>
                  </div>
                </div>

                <div className="hidden rounded-[1.75rem] border border-white/12 bg-white/10 p-3 lg:block">
                  <img
                    src="/favicon.svg"
                    alt="OperaPyme"
                    className="h-10 w-10 rounded-2xl"
                  />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {capabilityItems.map(({ key, icon: Icon }, index) => (
                  <motion.div
                    key={key}
                    className="rounded-[1.5rem] border border-white/12 bg-white/8 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ ...backofficeTransition, delay: 0.06 * (index + 1) }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex size-11 items-center justify-center rounded-2xl bg-white/12">
                        <Icon className="size-5 text-white" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {t(`auth.capabilities.${key}.title`)}
                        </p>
                        <p className="mt-1 text-xs leading-5 text-sidebar-muted">
                          {t(`auth.capabilities.${key}.text`)}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(18rem,0.85fr)]">
                <motion.div
                  className="rounded-[1.75rem] border border-white/12 bg-white/8 p-4 backdrop-blur-sm sm:p-5"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...backofficeTransition, delay: 0.12 }}
                >
                  <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {t("auth.preview.title")}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-sidebar-muted">
                        {t("auth.preview.description")}
                      </p>
                    </div>
                    <div className="rounded-full border border-white/12 bg-white/10 px-3 py-2 text-xs font-semibold text-white">
                      {t("auth.preview.badge")}
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
                    <div className="rounded-[1.4rem] bg-white p-4 text-ink shadow-panel">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                            {t("auth.preview.pipelineLabel")}
                          </p>
                          <p className="mt-2 text-lg font-semibold tracking-tight text-ink">
                            {t("auth.preview.pipelineTitle")}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-brand-soft px-3 py-2 text-xs font-semibold text-ink">
                          {t("auth.preview.pipelineBadge")}
                        </div>
                      </div>

                      <div className="mt-4 space-y-3">
                        {storyItems.map(({ key, icon: Icon }) => (
                          <div
                            key={key}
                            className="rounded-[1.2rem] border border-line/60 bg-sand/40 p-3"
                          >
                            <div className="flex items-center gap-3">
                              <div className="flex size-11 items-center justify-center rounded-2xl bg-paper">
                                <Icon className="size-5 text-brand" aria-hidden="true" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <p className="text-sm font-semibold text-ink">
                                    {t(`auth.story.${key}.title`)}
                                  </p>
                                  <ChevronRight
                                    className="size-4 shrink-0 text-ink-muted"
                                    aria-hidden="true"
                                  />
                                </div>
                                <p className="mt-1 text-xs leading-5 text-ink-soft">
                                  {t(`auth.story.${key}.text`)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid gap-3">
                      <div className="rounded-[1.4rem] border border-white/12 bg-white/10 p-4 text-white">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                          {t("auth.metrics.title")}
                        </p>
                        <div className="mt-4 grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
                          {["crm", "quotes", "team"].map((key) => (
                            <div
                              key={key}
                              className="rounded-[1.2rem] bg-white/8 px-4 py-3"
                            >
                              <p className="text-xl font-semibold tracking-tight text-white">
                                {t(`auth.metrics.${key}.value`)}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-sidebar-muted">
                                {t(`auth.metrics.${key}.label`)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-[1.4rem] border border-white/12 bg-[linear-gradient(135deg,rgba(255,255,255,0.14),rgba(255,255,255,0.06))] p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-11 items-center justify-center rounded-2xl bg-white/14">
                            <MailCheck className="size-5 text-white" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {t("auth.preview.accessTitle")}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-sidebar-muted">
                              {t("auth.preview.accessText")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="grid gap-3"
                  initial={{ opacity: 0, y: 22 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...backofficeTransition, delay: 0.16 }}
                >
                  {["rbac", "audit"].map((key) => (
                    <Card
                      key={key}
                      className="border-white/12 bg-white/8 p-4 text-white shadow-none backdrop-blur-sm"
                    >
                      <CardHeader className="mb-0">
                        <CardTitle className="text-base text-white">
                          {t(`auth.hero.cards.${key}.title`)}
                        </CardTitle>
                        <CardDescription className="text-sidebar-muted">
                          {t(`auth.hero.cards.${key}.text`)}
                        </CardDescription>
                      </CardHeader>
                    </Card>
                  ))}

                  <div className="rounded-[1.5rem] border border-dashed border-white/16 bg-white/6 p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                      {t("auth.hero.operatingTitle")}
                    </p>
                    <div className="mt-3 space-y-3">
                      {["customers", "documents", "roles"].map((key) => (
                        <div
                          key={key}
                          className="flex items-start gap-3 rounded-[1.15rem] bg-white/8 px-3 py-3"
                        >
                          <div className="mt-0.5 size-2 rounded-full bg-sky-300" />
                          <div>
                            <p className="text-sm font-semibold text-white">
                              {t(`auth.hero.operating.${key}.title`)}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-sidebar-muted">
                              {t(`auth.hero.operating.${key}.text`)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.section>

          <motion.section
            className="relative"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...backofficeTransition, delay: 0.08 }}
          >
            <div className="h-full rounded-[2rem] border border-line/60 bg-white/92 p-3 shadow-soft backdrop-blur-sm sm:p-4 lg:sticky lg:top-8 lg:min-h-[calc(100vh-4rem)]">
              <div className="flex h-full flex-col rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(244,247,249,0.92),rgba(255,255,255,0.98))] p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="inline-flex min-h-11 items-center rounded-full border border-line/70 bg-white px-4 text-sm font-semibold text-ink shadow-panel">
                    {t("auth.entry.brandLabel")}
                  </div>
                  <img
                    src="/favicon.svg"
                    alt="OperaPyme"
                    className="h-11 w-11 rounded-2xl bg-white p-2 shadow-panel lg:hidden"
                  />
                </div>

                <div className="mt-5 rounded-[1.6rem] border border-line/70 bg-white px-4 py-4 shadow-panel sm:px-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-muted">
                        {entryContent.badge}
                      </p>
                      <h2 className="mt-2 text-[1.8rem] font-semibold leading-tight tracking-tight text-ink">
                        {entryContent.title}
                      </h2>
                    </div>
                    <div className="hidden size-12 items-center justify-center rounded-2xl bg-brand text-brand-contrast sm:flex">
                      <Building2 className="size-5" aria-hidden="true" />
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-ink-soft">
                    {entryContent.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2 text-sm leading-6 text-ink-soft">
                    <span>{entryContent.switchLead}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setAuthMode(mode === "signin" ? "signup" : "signin")
                      }
                      className="font-semibold text-brand transition hover:text-brand-hover"
                    >
                      {entryContent.switchAction}
                    </button>
                  </div>

                  <div className="mt-5 grid gap-2 sm:grid-cols-3">
                    <button
                      type="button"
                      onClick={() => setAuthMode("signin")}
                      className={
                        mode === "signin"
                          ? "min-h-12 rounded-[1rem] bg-brand px-4 text-sm font-semibold text-brand-contrast shadow-panel"
                          : "min-h-12 rounded-[1rem] border border-line/70 bg-paper px-4 text-sm font-medium text-ink transition hover:bg-sand/65"
                      }
                    >
                      {t("auth.entry.existingCta")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAuthMode("signup")}
                      className={
                        mode === "signup"
                          ? "min-h-12 rounded-[1rem] bg-brand px-4 text-sm font-semibold text-brand-contrast shadow-panel"
                          : "min-h-12 rounded-[1rem] border border-line/70 bg-paper px-4 text-sm font-medium text-ink transition hover:bg-sand/65"
                      }
                    >
                      {t("auth.entry.firstTimeCta")}
                    </button>
                    <div className="flex min-h-12 items-center rounded-[1rem] border border-dashed border-line/70 bg-paper/70 px-4 text-xs leading-5 text-ink-soft sm:col-span-1">
                      {t("auth.entry.helper")}
                    </div>
                  </div>
                </div>

                {!isFirstAccess ? (
                  <div className="mt-4 grid grid-cols-3 gap-2 rounded-[1.4rem] border border-line/70 bg-paper/72 p-1.5">
                    <button
                      type="button"
                      onClick={() => handleSignInViewChange("password")}
                      className={
                        signInView === "password"
                          ? "min-h-12 rounded-[1rem] bg-white px-3 text-sm font-semibold text-ink shadow-panel"
                          : "min-h-12 rounded-[1rem] px-3 text-sm font-medium text-ink-soft transition hover:bg-white/75 hover:text-ink"
                      }
                    >
                      {t("auth.form.passwordTab")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSignInViewChange("magic_link")}
                      className={
                        signInView === "magic_link"
                          ? "min-h-12 rounded-[1rem] bg-white px-3 text-sm font-semibold text-ink shadow-panel"
                          : "min-h-12 rounded-[1rem] px-3 text-sm font-medium text-ink-soft transition hover:bg-white/75 hover:text-ink"
                      }
                    >
                      {t("auth.form.magicLinkTab")}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSignInViewChange("recovery")}
                      className={
                        signInView === "recovery"
                          ? "min-h-12 rounded-[1rem] bg-white px-3 text-sm font-semibold text-ink shadow-panel"
                          : "min-h-12 rounded-[1rem] px-3 text-sm font-medium text-ink-soft transition hover:bg-white/75 hover:text-ink"
                      }
                    >
                      {t("auth.form.recoveryTab")}
                    </button>
                  </div>
                ) : null}

                <form
                  className="mt-4 flex flex-1 flex-col gap-4"
                  onSubmit={handleSubmit}
                  autoComplete={isPasswordView ? "on" : "off"}
                >
                  <div className="rounded-[1.6rem] border border-line/70 bg-white p-4 shadow-panel sm:p-5">
                    <div className="space-y-4">
                      <div>
                        <label
                          htmlFor="auth-email"
                          className="block text-sm font-medium text-ink"
                        >
                          {t("auth.form.emailLabel")}
                        </label>
                        <div className="mt-2">
                          <Input
                            ref={emailInputRef}
                            id="auth-email"
                            type="email"
                            autoComplete="email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            placeholder={t("auth.form.emailPlaceholder")}
                            required
                            className="h-12 rounded-[1rem] border-line/80 bg-white px-4 text-base"
                          />
                        </div>
                      </div>

                      {isPasswordView ? (
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <label
                              htmlFor="auth-password"
                              className="block text-sm font-medium text-ink"
                            >
                              {t("auth.form.passwordLabel")}
                            </label>
                            <button
                              type="button"
                              onClick={() => handleSignInViewChange("recovery")}
                              className="text-sm font-semibold text-brand transition hover:text-brand-hover"
                            >
                              {t("auth.form.forgotPassword")}
                            </button>
                          </div>
                          <div className="mt-2">
                            <Input
                              id="auth-password"
                              type="password"
                              autoComplete="current-password"
                              value={password}
                              onChange={(event) => setPassword(event.target.value)}
                              placeholder={t("auth.form.passwordPlaceholder")}
                              required
                              className="h-12 rounded-[1rem] border-line/80 bg-white px-4 text-base"
                            />
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <div className="mt-4 rounded-[1.2rem] border border-line/60 bg-sand/45 px-4 py-3">
                      <p className="text-sm leading-6 text-ink-soft">
                        {isRecoveryView
                          ? t("auth.form.recoveryHelper")
                          : isPasswordView
                            ? t("auth.form.passwordHelper")
                            : isFirstAccess
                              ? t("auth.form.firstAccessHelper")
                              : t("auth.form.magicLinkHelper")}
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      <Button
                        className="flex w-full justify-center rounded-[1rem] text-sm font-semibold"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting
                          ? t("auth.form.submitting")
                          : entryContent.submitLabel}
                      </Button>

                      <div className="grid gap-2 rounded-[1.2rem] border border-dashed border-line/70 bg-paper/70 p-3">
                        <div className="flex items-start gap-3">
                          <div className="flex size-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                            <MailCheck className="size-5" aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-ink">
                              {t("auth.form.noteTitle")}
                            </p>
                            <p className="mt-1 text-sm leading-6 text-ink-soft">
                              {isPasswordView
                                ? t("auth.form.noteTextPassword")
                                : t("auth.form.noteText")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 lg:mt-auto lg:grid-cols-1 xl:grid-cols-2">
                    {["secure", "setup"].map((key) => (
                      <div
                        key={key}
                        className="rounded-[1.4rem] border border-line/70 bg-white/80 px-4 py-4"
                      >
                        <p className="text-sm font-semibold text-ink">
                          {t(`auth.footer.${key}.title`)}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-ink-soft">
                          {t(`auth.footer.${key}.text`)}
                        </p>
                      </div>
                    ))}
                  </div>
                </form>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </div>
    </main>
  );
}
