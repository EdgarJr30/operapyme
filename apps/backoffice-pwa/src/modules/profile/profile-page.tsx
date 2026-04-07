import { FormEvent, useEffect, useState } from "react";

import { Mail, UserRound } from "lucide-react";

import { getPrimaryTenantMembership } from "@operapyme/domain";
import { useTranslation } from "@operapyme/i18n";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";
import { Button } from "@/components/ui/button";
import { useSettingsData } from "@/modules/settings/use-settings-data";
import { useSettingsMutations } from "@/modules/settings/use-settings-mutations";

export function ProfilePage() {
  const { t } = useTranslation("backoffice");
  const { accessContext, activeTenantId, setPassword, user } = useBackofficeAuth();
  const [password, setPasswordValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [displayNameDraft, setDisplayNameDraft] = useState("");

  const { userProfileQuery } = useSettingsData(false);
  const { updateUserProfileMutation } = useSettingsMutations();

  const activeTenantMembership = getPrimaryTenantMembership(
    accessContext,
    activeTenantId
  );
  const userLabel =
    accessContext?.displayName?.trim() || user?.email?.trim() || "OperaPyme";
  const roleLabel = accessContext?.isGlobalAdmin
    ? "global_admin"
    : activeTenantMembership?.tenantRoleKeys.join(", ") || "tenant_member";

  const userProfile = userProfileQuery.data;
  const isProfileDirty =
    (displayNameDraft.trim() || "") !== (userProfile?.displayName?.trim() || "");

  useEffect(() => {
    if (userProfile) {
      setDisplayNameDraft(userProfile.displayName ?? "");
    }
  }, [userProfile]);

  async function handleSaveProfile() {
    try {
      await updateUserProfileMutation.mutateAsync({
        displayName: displayNameDraft.trim() || null
      });
      toast.success(t("settings.profile.toastTitle"), {
        description: t("settings.profile.toastDescription")
      });
    } catch (error) {
      toast.error(t("settings.profile.errorTitle"), {
        description:
          error instanceof Error ? error.message : t("settings.errors.generic")
      });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (password.length < 8) {
      toast.error(t("profile.security.tooShort"));
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t("profile.security.mismatch"));
      return;
    }

    setIsSubmitting(true);
    const nextError = await setPassword(password);
    setIsSubmitting(false);

    if (nextError) {
      toast.error(t("profile.security.error", { message: nextError }));
      return;
    }

    setPasswordValue("");
    setConfirmPassword("");
    toast.success(t("profile.security.successTitle"), {
      description: t("profile.security.successDescription")
    });
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
          {t("profile.header.eyebrow")}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {t("profile.header.title")}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-ink-soft">
          {t("profile.header.description")}
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("profile.summary.title")}</CardTitle>
            <CardDescription>
              {t("profile.summary.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-3xl border border-line/70 bg-paper p-4 shadow-panel">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sand-strong">
                <UserRound className="size-5 text-ink" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-ink">
                  {t("profile.summary.userLabel")}
                </p>
                <p className="text-sm leading-6 text-ink-soft">{userLabel}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-3xl border border-line/70 bg-paper p-4 shadow-panel">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-sand-strong">
                <Mail className="size-5 text-ink" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-ink">
                  {t("profile.summary.emailLabel")}
                </p>
                <p className="text-sm leading-6 text-ink-soft">
                  {user?.email ?? accessContext?.email ?? userLabel}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-line/70 bg-paper p-4 shadow-panel">
                <p className="text-sm font-semibold text-ink">
                  {t("profile.summary.tenantLabel")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {activeTenantMembership?.tenantName ?? "Sin tenant activo"}
                </p>
              </div>

              <div className="rounded-3xl border border-line/70 bg-paper p-4 shadow-panel">
                <p className="text-sm font-semibold text-ink">
                  {t("profile.summary.roleLabel")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {roleLabel}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("profile.security.title")}</CardTitle>
            <CardDescription>
              {t("profile.security.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <StatusPill tone="success">
              {t("profile.methods.magicLinkTitle")}
            </StatusPill>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="profile-password"
                  className="block text-sm font-medium text-ink"
                >
                  {t("profile.security.passwordLabel")}
                </label>
                <Input
                  id="profile-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(event) => setPasswordValue(event.target.value)}
                  placeholder={t("profile.security.passwordPlaceholder")}
                  required
                  className="mt-2 rounded-xl border-line/80 bg-white"
                />
              </div>

              <div>
                <label
                  htmlFor="profile-confirm-password"
                  className="block text-sm font-medium text-ink"
                >
                  {t("profile.security.confirmPasswordLabel")}
                </label>
                <Input
                  id="profile-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder={t("profile.security.confirmPasswordPlaceholder")}
                  required
                  className="mt-2 rounded-xl border-line/80 bg-white"
                />
              </div>

              <div className="rounded-3xl border border-line/70 bg-sand/35 p-4">
                <p className="text-sm leading-6 text-ink-soft">
                  {t("profile.security.helper")}
                </p>
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full justify-center rounded-xl bg-brand text-sm font-semibold text-brand-contrast shadow-soft transition duration-200 ease-out hover:bg-brand-hover"
              >
                {isSubmitting
                  ? t("profile.security.submitting")
                  : t("profile.security.submit")}
              </Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t("settings.profile.title")}</CardTitle>
            <CardDescription>
              {t("settings.profile.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-3xl border border-line/70 bg-paper p-4">
                <p className="text-sm font-semibold text-ink">
                  {t("settings.profile.emailLabel")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {userProfile?.email ?? user?.email ?? "-"}
                </p>
              </div>
              <div className="rounded-3xl border border-line/70 bg-paper p-4">
                <p className="text-sm font-semibold text-ink">
                  {t("settings.profile.roleLabel")}
                </p>
                <p className="mt-2 text-sm leading-6 text-ink-soft">
                  {roleLabel}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile-display-name"
                className="text-sm font-medium text-ink"
              >
                {t("settings.profile.displayNameLabel")}
              </label>
              <Input
                id="profile-display-name"
                value={displayNameDraft}
                onChange={(event) => {
                  setDisplayNameDraft(event.target.value);
                }}
                placeholder={t("settings.profile.displayNamePlaceholder")}
              />
            </div>

            <Button
              type="button"
              onClick={() => {
                void handleSaveProfile();
              }}
              disabled={!isProfileDirty || updateUserProfileMutation.isPending}
            >
              {updateUserProfileMutation.isPending
                ? t("settings.profile.saving")
                : t("settings.profile.saveAction")}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("settings.preferences.title")}</CardTitle>
            <CardDescription>
              {t("settings.preferences.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3 rounded-3xl border border-line/70 bg-paper p-4">
              <p className="text-sm font-semibold text-ink">
                {t("settings.preferences.themeTitle")}
              </p>
              <ThemeSwitcher />
              <p className="text-sm leading-6 text-ink-soft">
                {t("settings.preferences.themeText")}
              </p>
            </div>

            <div className="space-y-3 rounded-3xl border border-line/70 bg-paper p-4">
              <p className="text-sm font-semibold text-ink">
                {t("settings.preferences.currentTenantTitle")}
              </p>
              <p className="text-sm leading-6 text-ink-soft">
                {activeTenantMembership?.tenantName ?? "-"}
              </p>
              <p className="text-sm leading-6 text-ink-soft">
                {t("settings.preferences.currentTenantText")}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
