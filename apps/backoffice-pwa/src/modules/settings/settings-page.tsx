import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";

import {
  Building2,
  Check,
  ChevronRight,
  KeyRound,
  ShieldCheck,
  Palette
} from "lucide-react";
import {
  getPrimaryTenantMembership,
  hasTenantPermissionForRoleKeys
} from "@operapyme/domain";
import { useTranslation } from "@operapyme/i18n";
import { useTenantTheme } from "@operapyme/ui";
import type { ThemePaletteSeedColors } from "@operapyme/ui";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { useBackofficeAuth } from "@/app/auth-provider";
import { ThemeSwitcher } from "@/components/layout/theme-switcher";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";
import { AccessDeniedPage } from "@/modules/auth/access-denied-page";
import { TenantPaletteSection } from "@/modules/settings/tenant-palette-section";
import { useSettingsData } from "@/modules/settings/use-settings-data";
import { useSettingsMutations } from "@/modules/settings/use-settings-mutations";

type SettingsSectionId =
  | "general"
  | "tenant"
  | "appearance"
  | "team"
  | "security";

function getStatusTone(status: "active" | "inactive" | "suspended" | "invited") {
  if (status === "active") {
    return "success";
  }

  if (status === "invited") {
    return "info";
  }

  return "warning";
}

function arePaletteSeedsEqual(
  left: ThemePaletteSeedColors,
  right: ThemePaletteSeedColors
) {
  return (
    left.paper === right.paper &&
    left.primary === right.primary &&
    left.secondary === right.secondary &&
    left.tertiary === right.tertiary
  );
}

function formatOptionalDateLabel(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium"
  }).format(date);
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string" &&
    error.message.trim()
  ) {
    return error.message;
  }

  return fallback;
}

function SettingsState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-ink">{title}</h2>
          <p className="max-w-2xl text-sm leading-6 text-ink-soft">
            {description}
          </p>
        </div>
        {action ?? null}
      </CardContent>
    </Card>
  );
}

export function SettingsPage() {
  const { t } = useTranslation("backoffice");
  const navigate = useNavigate();
  const location = useLocation();
  const { accessContext, activeTenantId, user } = useBackofficeAuth();
  const { customPalette, paletteId, setCustomPalette, setPaletteId } =
    useTenantTheme();
  const activeTenantMembership = getPrimaryTenantMembership(
    accessContext,
    activeTenantId
  );
  const activeRoleKeys = activeTenantMembership?.tenantRoleKeys;
  const canEditTenant = Boolean(
    accessContext?.isGlobalAdmin ||
      hasTenantPermissionForRoleKeys(activeRoleKeys, "tenant.update")
  );
  const canManageMembers = Boolean(
    accessContext?.isGlobalAdmin ||
      hasTenantPermissionForRoleKeys(activeRoleKeys, "membership.manage")
  );
  const canReadTenant = Boolean(
    accessContext?.isGlobalAdmin ||
      hasTenantPermissionForRoleKeys(activeRoleKeys, "tenant.read") ||
      canEditTenant ||
      canManageMembers
  );

  const { tenantSettingsQuery, tenantMembersQuery, userProfileQuery } =
    useSettingsData(canManageMembers);
  const { updateTenantSettingsMutation, updateUserProfileMutation } =
    useSettingsMutations();
  const [displayNameDraft, setDisplayNameDraft] = useState("");
  const [tenantNameDraft, setTenantNameDraft] = useState("");
  const tenantThemeSyncRef = useRef<string | null>(null);
  const activeSection = useMemo<SettingsSectionId>(() => {
    if (location.pathname.startsWith("/settings/tenant")) {
      return "tenant";
    }

    if (location.pathname.startsWith("/settings/appearance")) {
      return "appearance";
    }

    if (location.pathname.startsWith("/settings/team")) {
      return "team";
    }

    if (location.pathname.startsWith("/settings/security")) {
      return "security";
    }

    return "general";
  }, [location.pathname]);

  useEffect(() => {
    if (userProfileQuery.data) {
      setDisplayNameDraft(userProfileQuery.data.displayName ?? "");
    }
  }, [userProfileQuery.data]);

  useEffect(() => {
    if (!tenantSettingsQuery.data || !activeTenantId) {
      return;
    }

    setTenantNameDraft(tenantSettingsQuery.data.name);

    const syncKey = `${activeTenantId}:${tenantSettingsQuery.data.updatedAt}`;

    if (tenantThemeSyncRef.current === syncKey) {
      return;
    }

    if (
      tenantSettingsQuery.data.paletteId === "custom" &&
      tenantSettingsQuery.data.paletteSeedColors
    ) {
      setCustomPalette(tenantSettingsQuery.data.paletteSeedColors);
    } else {
      setPaletteId(tenantSettingsQuery.data.paletteId);
    }

    tenantThemeSyncRef.current = syncKey;
  }, [
    activeTenantId,
    setCustomPalette,
    setPaletteId,
    tenantSettingsQuery.data
  ]);

  if (!activeTenantId) {
    return (
      <SettingsState
        title={t("settings.states.noTenantTitle")}
        description={t("settings.states.noTenantDescription")}
      />
    );
  }

  if (!canReadTenant) {
    return <AccessDeniedPage />;
  }

  const currentRoleLabel = accessContext?.isGlobalAdmin
    ? t("settings.roles.global_admin")
    : activeRoleKeys?.length
      ? activeRoleKeys.map((roleKey) => t(`settings.roles.${roleKey}`)).join(" / ")
      : t("settings.roles.tenant_member");

  const userProfile = userProfileQuery.data;
  const tenantSettings = tenantSettingsQuery.data;
  const members = tenantMembersQuery.data ?? [];

  const isProfileDirty =
    (displayNameDraft.trim() || "") !== (userProfile?.displayName?.trim() || "");
  const isTenantNameDirty = Boolean(
    tenantSettings && tenantNameDraft.trim() !== tenantSettings.name
  );
  const isPaletteDirty = Boolean(
    tenantSettings &&
      (paletteId !== tenantSettings.paletteId ||
        (paletteId === "custom" &&
          (!tenantSettings.paletteSeedColors ||
            !arePaletteSeedsEqual(
              customPalette.seeds,
              tenantSettings.paletteSeedColors
            ))))
  );
  const isTenantSettingsDirty = isTenantNameDirty || isPaletteDirty;

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
        description: getErrorMessage(error, t("settings.errors.generic"))
      });
    }
  }

  async function handleSaveTenant() {
    if (!tenantSettings) {
      return;
    }

    try {
      await updateTenantSettingsMutation.mutateAsync({
        name: tenantNameDraft.trim(),
        paletteId,
        paletteSeedColors: paletteId === "custom" ? customPalette.seeds : null
      });

      toast.success(t("settings.tenant.toastTitle"), {
        description: t("settings.tenant.toastDescription")
      });
    } catch (error) {
      toast.error(t("settings.tenant.errorTitle"), {
        description: getErrorMessage(error, t("settings.errors.generic"))
      });
    }
  }

  async function handleSaveAppearance() {
    if (!tenantSettings) {
      return;
    }

    try {
      await updateTenantSettingsMutation.mutateAsync({
        name: tenantSettings.name,
        paletteId,
        paletteSeedColors: paletteId === "custom" ? customPalette.seeds : null
      });

      toast.success(t("settings.tenant.toastTitle"), {
        description: t("settings.tenant.toastDescription")
      });
    } catch (error) {
      toast.error(t("settings.tenant.errorTitle"), {
        description: getErrorMessage(error, t("settings.errors.generic"))
      });
    }
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <section className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-ink-muted">
          {t("settings.header.eyebrow")}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
          {t("settings.header.title")}
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-ink-soft">
          {t("settings.header.description")}
        </p>
      </section>
      <div className="space-y-4">
        <main className="min-w-0 space-y-4">
          {activeSection === "general" ? (
            <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.profile.title")}</CardTitle>
                  <CardDescription>
                    {t("settings.profile.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {userProfileQuery.isLoading ? (
                    <p className="text-sm leading-6 text-ink-soft">
                      {t("settings.states.loadingDescription")}
                    </p>
                  ) : userProfileQuery.isError ? (
                    <p className="text-sm leading-6 text-ink-soft">
                      {t("settings.profile.loadError", {
                        message:
                          userProfileQuery.error instanceof Error
                            ? userProfileQuery.error.message
                            : ""
                      })}
                    </p>
                  ) : (
                    <>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <InfoCard
                          label={t("settings.profile.emailLabel")}
                          value={userProfile?.email ?? user?.email ?? "-"}
                        />
                        <InfoCard
                          label={t("settings.profile.roleLabel")}
                          value={currentRoleLabel}
                        />
                      </div>

                      <div className="space-y-2">
                        <label
                          htmlFor="settings-display-name"
                          className="text-sm font-medium text-ink"
                        >
                          {t("settings.profile.displayNameLabel")}
                        </label>
                        <Input
                          id="settings-display-name"
                          value={displayNameDraft}
                          onChange={(event) => {
                            setDisplayNameDraft(event.target.value);
                          }}
                          placeholder={t("settings.profile.displayNamePlaceholder")}
                        />
                      </div>

                      <div className="flex flex-wrap gap-3">
                        <Button
                          type="button"
                          onClick={() => {
                            void handleSaveProfile();
                          }}
                          disabled={
                            !isProfileDirty || updateUserProfileMutation.isPending
                          }
                        >
                          {updateUserProfileMutation.isPending
                            ? t("settings.profile.saving")
                            : t("settings.profile.saveAction")}
                        </Button>
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() => {
                            navigate("/profile");
                          }}
                        >
                          {t("settings.profile.openProfileAction")}
                        </Button>
                      </div>
                    </>
                  )}
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
                      {activeTenantMembership?.tenantName ?? t("settings.states.noTenantTitle")}
                    </p>
                    <p className="text-sm leading-6 text-ink-soft">
                      {t("settings.preferences.currentTenantText")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </section>
          ) : null}

          {activeSection === "tenant" ? (
            tenantSettingsQuery.isLoading ? (
              <SettingsState
                title={t("settings.states.loadingTitle")}
                description={t("settings.states.loadingDescription")}
              />
            ) : tenantSettingsQuery.isError ? (
              <SettingsState
                title={t("settings.states.errorTitle")}
                description={t("settings.states.errorDescription", {
                  message:
                    tenantSettingsQuery.error instanceof Error
                      ? tenantSettingsQuery.error.message
                      : ""
                })}
                action={
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      void tenantSettingsQuery.refetch();
                    }}
                  >
                    {t("settings.states.retryAction")}
                  </Button>
                }
              />
            ) : tenantSettings ? (
              <section className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.tenant.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.tenant.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 sm:grid-cols-3">
                      <InfoCard
                        label={t("settings.tenant.slugLabel")}
                        value={tenantSettings.slug}
                      />
                      <InfoCard
                        label={t("settings.tenant.statusLabel")}
                        value={t(`settings.status.${tenantSettings.status}`)}
                      />
                      <InfoCard
                        label={t("settings.tenant.updatedLabel")}
                        value={formatOptionalDateLabel(tenantSettings.updatedAt)}
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="settings-tenant-name"
                        className="text-sm font-medium text-ink"
                      >
                        {t("settings.tenant.nameLabel")}
                      </label>
                      <Input
                        id="settings-tenant-name"
                        value={tenantNameDraft}
                        disabled={!canEditTenant}
                        onChange={(event) => {
                          setTenantNameDraft(event.target.value);
                        }}
                        placeholder={t("settings.tenant.namePlaceholder")}
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <Button
                        type="button"
                        onClick={() => {
                          void handleSaveTenant();
                        }}
                        disabled={
                          !canEditTenant ||
                          !isTenantSettingsDirty ||
                          updateTenantSettingsMutation.isPending
                        }
                      >
                        {updateTenantSettingsMutation.isPending
                          ? t("settings.tenant.saving")
                          : t("settings.tenant.saveAction")}
                      </Button>
                      <StatusPill tone={getStatusTone(tenantSettings.status)}>
                        {t(`settings.status.${tenantSettings.status}`)}
                      </StatusPill>
                    </div>
                  </CardContent>
                </Card>
              </section>
            ) : null
          ) : null}

          {activeSection === "appearance" ? (
            <section className="space-y-4">
              <TenantPaletteSection canEdit={canEditTenant} />

              <Card>
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-5 sm:p-6">
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-ink">
                      {t("settings.appearance.saveTitle")}
                    </p>
                    <p className="text-sm leading-6 text-ink-soft">
                      {canEditTenant
                        ? t("settings.appearance.saveText")
                        : t("settings.appearance.readOnlyText")}
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      void handleSaveAppearance();
                    }}
                    disabled={
                      !canEditTenant ||
                      !isPaletteDirty ||
                      updateTenantSettingsMutation.isPending
                    }
                  >
                    {updateTenantSettingsMutation.isPending
                      ? t("settings.appearance.saving")
                      : t("settings.appearance.saveAction")}
                  </Button>
                </CardContent>
              </Card>
            </section>
          ) : null}

          {activeSection === "team" ? (
            canManageMembers ? (
              tenantMembersQuery.isLoading ? (
                <SettingsState
                  title={t("settings.states.loadingTitle")}
                  description={t("settings.team.loadingDescription")}
                />
              ) : tenantMembersQuery.isError ? (
                <SettingsState
                  title={t("settings.team.errorTitle")}
                  description={t("settings.team.errorDescription", {
                    message:
                      tenantMembersQuery.error instanceof Error
                        ? tenantMembersQuery.error.message
                        : ""
                  })}
                  action={
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        void tenantMembersQuery.refetch();
                      }}
                    >
                      {t("settings.states.retryAction")}
                    </Button>
                  }
                />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{t("settings.team.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.team.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {members.length === 0 ? (
                      <p className="text-sm leading-6 text-ink-soft">
                        {t("settings.team.emptyDescription")}
                      </p>
                    ) : (
                      members.map((member) => (
                        <div
                          key={member.membershipId}
                          className="space-y-3 rounded-3xl border border-line/70 bg-paper p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="space-y-1">
                              <p className="text-sm font-semibold text-ink">
                                {member.displayName?.trim() || member.email}
                              </p>
                              <p className="text-sm leading-6 text-ink-soft">
                                {member.email}
                              </p>
                            </div>
                            <StatusPill tone={getStatusTone(member.status)}>
                              {t(`settings.status.${member.status}`)}
                            </StatusPill>
                          </div>

                          <div className="flex flex-wrap gap-2">
                            {member.tenantRoleKeys.map((roleKey) => (
                              <StatusPill key={roleKey} tone="neutral">
                                {t(`settings.roles.${roleKey}`)}
                              </StatusPill>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              )
            ) : (
              <SettingsState
                title={t("settings.team.lockedTitle")}
                description={t("settings.team.lockedDescription")}
              />
            )
          ) : null}

          {activeSection === "security" ? (
            <section className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.security.title")}</CardTitle>
                  <CardDescription>
                    {t("settings.security.description")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-3xl border border-line/70 bg-paper p-4">
                    <p className="text-sm font-semibold text-ink">
                      {t("settings.security.rbacTitle")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">
                      {t("settings.security.rbacText")}
                    </p>
                  </div>

                  <div className="rounded-3xl border border-line/70 bg-paper p-4">
                    <p className="text-sm font-semibold text-ink">
                      {t("settings.security.passwordTitle")}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-ink-soft">
                      {t("settings.security.passwordText")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("settings.security.actionsTitle")}</CardTitle>
                  <CardDescription>
                    {t("settings.security.actionsDescription")}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    type="button"
                    className="w-full justify-between"
                    onClick={() => {
                      navigate("/profile");
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <KeyRound className="size-4" aria-hidden="true" />
                      {t("settings.security.openProfileAction")}
                    </span>
                    <ChevronRight className="size-4" aria-hidden="true" />
                  </Button>

                  <div className="rounded-3xl border border-line/70 bg-sand/35 p-4">
                    <div className="flex items-start gap-3">
                      <span className="mt-0.5 flex size-6 items-center justify-center rounded-full bg-brand text-brand-contrast">
                        <Check className="size-3.5" aria-hidden="true" />
                      </span>
                      <p className="text-sm leading-6 text-ink-soft">
                        {t("settings.security.auditText")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </section>
          ) : null}
        </main>
      </div>
    </div>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-3xl border border-line/70 bg-paper p-4">
      <p className="text-sm font-semibold text-ink">{label}</p>
      <p className="mt-2 text-sm leading-6 text-ink-soft">{value}</p>
    </div>
  );
}
