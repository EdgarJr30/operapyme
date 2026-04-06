import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import {
  AlertTriangle,
  ImageUp,
  Trash2
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { StatusPill } from "@/components/ui/status-pill";
import { Textarea } from "@/components/ui/textarea";
import { AccessDeniedPage } from "@/modules/auth/access-denied-page";
import { TenantPaletteSection } from "@/modules/settings/tenant-palette-section";
import {
  deleteTenantLogo,
  uploadTenantLogo
} from "@/lib/supabase/settings-data";
import { useSettingsData } from "@/modules/settings/use-settings-data";
import { useSettingsMutations } from "@/modules/settings/use-settings-mutations";

type SettingsSectionId =
  | "general"
  | "tenant"
  | "appearance"
  | "team"
  | "security";

const LOGO_MAX_SIZE_BYTES = 2 * 1024 * 1024;
const ALLOWED_LOGO_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/webp"
]);

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

function normalizeDraft(value: string) {
  return value.trim();
}

function isCompanyPhoneValid(value: string) {
  return /^[0-9+()\-.\s]{7,30}$/.test(value);
}

function isCompanyRncValid(value: string) {
  return /^[0-9-]{9,11}$/.test(value);
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
  const { accessContext, activeTenantId, refreshAccessContext, signOut, user } =
    useBackofficeAuth();
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
  const canDeleteTenant = Boolean(
    accessContext?.isGlobalAdmin ||
      hasTenantPermissionForRoleKeys(activeRoleKeys, "tenant.delete")
  );
  const canReadTenant = Boolean(
    accessContext?.isGlobalAdmin ||
      hasTenantPermissionForRoleKeys(activeRoleKeys, "tenant.read") ||
      canEditTenant ||
      canManageMembers
  );

  const { tenantSettingsQuery, tenantMembersQuery, userProfileQuery } =
    useSettingsData(canManageMembers);
  const {
    deleteTenantAccountMutation,
    updateTenantSettingsMutation,
    updateUserProfileMutation
  } =
    useSettingsMutations();
  const [displayNameDraft, setDisplayNameDraft] = useState("");
  const [tenantNameDraft, setTenantNameDraft] = useState("");
  const [companyAddressDraft, setCompanyAddressDraft] = useState("");
  const [companyPhoneDraft, setCompanyPhoneDraft] = useState("");
  const [companyRncDraft, setCompanyRncDraft] = useState("");
  const [logoDraftFile, setLogoDraftFile] = useState<File | null>(null);
  const [isLogoMarkedForRemoval, setIsLogoMarkedForRemoval] = useState(false);
  const [logoPreviewUrl, setLogoPreviewUrl] = useState<string | null>(null);
  const [deleteConfirmationDraft, setDeleteConfirmationDraft] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const tenantThemeSyncRef = useRef<string | null>(null);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
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
    setCompanyAddressDraft(tenantSettingsQuery.data.address ?? "");
    setCompanyPhoneDraft(tenantSettingsQuery.data.phone ?? "");
    setCompanyRncDraft(tenantSettingsQuery.data.rnc ?? "");
    setLogoDraftFile(null);
    setIsLogoMarkedForRemoval(false);
    setLogoPreviewUrl(tenantSettingsQuery.data.logoUrl);

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
    setCompanyAddressDraft,
    setCompanyPhoneDraft,
    setCompanyRncDraft,
    setCustomPalette,
    setLogoDraftFile,
    setIsLogoMarkedForRemoval,
    setLogoPreviewUrl,
    setPaletteId,
    setTenantNameDraft,
    tenantSettingsQuery.data
  ]);

  useEffect(() => {
    if (!logoDraftFile) {
      return;
    }

    const objectUrl = window.URL.createObjectURL(logoDraftFile);
    setLogoPreviewUrl(objectUrl);

    return () => {
      window.URL.revokeObjectURL(objectUrl);
    };
  }, [logoDraftFile]);

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
  const normalizedTenantNameDraft = normalizeDraft(tenantNameDraft);
  const normalizedCompanyAddressDraft = normalizeDraft(companyAddressDraft);
  const normalizedCompanyPhoneDraft = normalizeDraft(companyPhoneDraft);
  const normalizedCompanyRncDraft = normalizeDraft(companyRncDraft);

  const isProfileDirty =
    (displayNameDraft.trim() || "") !== (userProfile?.displayName?.trim() || "");
  const isTenantNameDirty = Boolean(
    tenantSettings && normalizedTenantNameDraft !== tenantSettings.name
  );
  const isCompanyFieldsDirty = Boolean(
    tenantSettings &&
      (normalizedCompanyAddressDraft !== (tenantSettings.address ?? "") ||
        normalizedCompanyPhoneDraft !== (tenantSettings.phone ?? "") ||
        normalizedCompanyRncDraft !== (tenantSettings.rnc ?? "") ||
        Boolean(logoDraftFile) ||
        isLogoMarkedForRemoval)
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
  const isTenantSettingsDirty =
    isTenantNameDirty || isCompanyFieldsDirty || isPaletteDirty;
  const deleteConfirmationValue = deleteConfirmationDraft.trim().toLowerCase();
  const deleteConfirmationSlug = tenantSettings?.slug.toLowerCase() ?? "";
  const isDeleteConfirmationValid =
    deleteConfirmationValue.length > 0 &&
    deleteConfirmationValue === deleteConfirmationSlug;

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

    if (!normalizedTenantNameDraft) {
      toast.error(t("settings.company.errorTitle"), {
        description: t("settings.company.validation.nameRequired")
      });
      return;
    }

    if (!normalizedCompanyAddressDraft) {
      toast.error(t("settings.company.errorTitle"), {
        description: t("settings.company.validation.addressRequired")
      });
      return;
    }

    if (!normalizedCompanyPhoneDraft) {
      toast.error(t("settings.company.errorTitle"), {
        description: t("settings.company.validation.phoneRequired")
      });
      return;
    }

    if (!isCompanyPhoneValid(normalizedCompanyPhoneDraft)) {
      toast.error(t("settings.company.errorTitle"), {
        description: t("settings.company.validation.phoneInvalid")
      });
      return;
    }

    if (
      normalizedCompanyRncDraft.length > 0 &&
      !isCompanyRncValid(normalizedCompanyRncDraft)
    ) {
      toast.error(t("settings.company.errorTitle"), {
        description: t("settings.company.validation.rncInvalid")
      });
      return;
    }

    let uploadedLogoPath: string | null = null;

    try {
      let nextLogoPath = tenantSettings.logoPath;

      if (logoDraftFile) {
        uploadedLogoPath = await uploadTenantLogo(tenantSettings.id, logoDraftFile);
        nextLogoPath = uploadedLogoPath;
      } else if (isLogoMarkedForRemoval) {
        nextLogoPath = null;
      }

      await updateTenantSettingsMutation.mutateAsync({
        name: normalizedTenantNameDraft,
        address: normalizedCompanyAddressDraft,
        phone: normalizedCompanyPhoneDraft,
        rnc: normalizedCompanyRncDraft || null,
        logoPath: nextLogoPath,
        paletteId,
        paletteSeedColors: paletteId === "custom" ? customPalette.seeds : null
      });

      if (tenantSettings.logoPath && tenantSettings.logoPath !== nextLogoPath) {
        void deleteTenantLogo(tenantSettings.logoPath).catch(() => undefined);
      }

      setLogoDraftFile(null);
      setIsLogoMarkedForRemoval(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }

      toast.success(t("settings.company.toastTitle"), {
        description: t("settings.company.toastDescription")
      });
    } catch (error) {
      if (uploadedLogoPath) {
        void deleteTenantLogo(uploadedLogoPath).catch(() => undefined);
      }

      toast.error(t("settings.company.errorTitle"), {
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
        address: tenantSettings.address,
        phone: tenantSettings.phone,
        rnc: tenantSettings.rnc,
        logoPath: tenantSettings.logoPath,
        paletteId,
        paletteSeedColors: paletteId === "custom" ? customPalette.seeds : null
      });

      toast.success(t("settings.appearance.toastTitle"), {
        description: t("settings.appearance.toastDescription")
      });
    } catch (error) {
      toast.error(t("settings.appearance.errorTitle"), {
        description: getErrorMessage(error, t("settings.errors.generic"))
      });
    }
  }

  function handleOpenLogoPicker() {
    logoInputRef.current?.click();
  }

  function handleRemoveLogoSelection() {
    setLogoDraftFile(null);
    setIsLogoMarkedForRemoval(true);
    setLogoPreviewUrl(null);
    if (logoInputRef.current) {
      logoInputRef.current.value = "";
    }
  }

  function handleLogoFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;

    if (!nextFile) {
      return;
    }

    if (!ALLOWED_LOGO_MIME_TYPES.has(nextFile.type)) {
      toast.error(t("settings.company.logoErrorTitle"), {
        description: t("settings.company.logoInvalidType")
      });
      event.target.value = "";
      return;
    }

    if (nextFile.size > LOGO_MAX_SIZE_BYTES) {
      toast.error(t("settings.company.logoErrorTitle"), {
        description: t("settings.company.logoInvalidSize")
      });
      event.target.value = "";
      return;
    }

    setLogoDraftFile(nextFile);
    setIsLogoMarkedForRemoval(false);
  }

  function closeDeleteDialog() {
    if (deleteTenantAccountMutation.isPending) {
      return;
    }

    setIsDeleteDialogOpen(false);
    setDeleteConfirmationDraft("");
  }

  async function handleDeleteTenant() {
    if (!tenantSettings || !canDeleteTenant) {
      return;
    }

    try {
      const result = await deleteTenantAccountMutation.mutateAsync({
        confirmationText: deleteConfirmationDraft.trim()
      });

      closeDeleteDialog();

      if (result.accountDeleted) {
        toast.success(t("settings.security.delete.toastAccountDeletedTitle"), {
          description: t("settings.security.delete.toastAccountDeletedDescription", {
            tenant: result.tenant.name
          })
        });

        const errorMessage = await signOut();

        if (errorMessage) {
          toast.error(t("settings.security.delete.errorTitle"), {
            description: errorMessage
          });
        }

        navigate("/auth", {
          replace: true
        });
        return;
      }

      await refreshAccessContext();

      toast.success(t("settings.security.delete.toastTenantDeletedTitle"), {
        description:
          result.remainingTenantMemberships > 0
            ? t("settings.security.delete.toastTenantDeletedDescription", {
                tenant: result.tenant.name
              })
            : t("settings.security.delete.toastTenantDeletedNoMembershipsDescription", {
                tenant: result.tenant.name
              })
      });

      navigate(result.remainingTenantMemberships > 0 ? "/" : "/setup", {
        replace: true
      });
    } catch (error) {
      toast.error(t("settings.security.delete.errorTitle"), {
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
                    <CardTitle>{t("settings.company.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.company.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="sr-only"
                      onChange={handleLogoFileChange}
                      aria-label={t("settings.company.logoUploadAction")}
                    />

                    <div className="grid gap-4 sm:grid-cols-3">
                      <InfoCard
                        label={t("settings.company.slugLabel")}
                        value={tenantSettings.slug}
                      />
                      <InfoCard
                        label={t("settings.company.statusLabel")}
                        value={t(`settings.status.${tenantSettings.status}`)}
                      />
                      <InfoCard
                        label={t("settings.company.updatedLabel")}
                        value={formatOptionalDateLabel(tenantSettings.updatedAt)}
                      />
                    </div>

                    <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label
                            htmlFor="settings-company-name"
                            className="text-sm font-medium text-ink"
                          >
                            {t("settings.company.nameLabel")}
                          </label>
                          <Input
                            id="settings-company-name"
                            value={tenantNameDraft}
                            disabled={!canEditTenant}
                            onChange={(event) => {
                              setTenantNameDraft(event.target.value);
                            }}
                            placeholder={t("settings.company.namePlaceholder")}
                          />
                        </div>

                        <div className="space-y-2">
                          <label
                            htmlFor="settings-company-address"
                            className="text-sm font-medium text-ink"
                          >
                            {t("settings.company.addressLabel")}
                          </label>
                          <Textarea
                            id="settings-company-address"
                            value={companyAddressDraft}
                            disabled={!canEditTenant}
                            onChange={(event) => {
                              setCompanyAddressDraft(event.target.value);
                            }}
                            placeholder={t("settings.company.addressPlaceholder")}
                            rows={3}
                          />
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <label
                              htmlFor="settings-company-phone"
                              className="text-sm font-medium text-ink"
                            >
                              {t("settings.company.phoneLabel")}
                            </label>
                            <Input
                              id="settings-company-phone"
                              value={companyPhoneDraft}
                              disabled={!canEditTenant}
                              onChange={(event) => {
                                setCompanyPhoneDraft(event.target.value);
                              }}
                              placeholder={t("settings.company.phonePlaceholder")}
                            />
                          </div>

                          <div className="space-y-2">
                            <label
                              htmlFor="settings-company-rnc"
                              className="text-sm font-medium text-ink"
                            >
                              {t("settings.company.rncLabel")}
                            </label>
                            <Input
                              id="settings-company-rnc"
                              value={companyRncDraft}
                              disabled={!canEditTenant}
                              onChange={(event) => {
                                setCompanyRncDraft(event.target.value);
                              }}
                              placeholder={t("settings.company.rncPlaceholder")}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="rounded-3xl border border-line/70 bg-paper p-4">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-ink">
                            {t("settings.company.logoLabel")}
                          </p>
                          <p className="text-sm leading-6 text-ink-soft">
                            {t("settings.company.logoHelp")}
                          </p>
                        </div>

                        <div className="mt-4 space-y-4">
                          <div className="flex min-h-52 items-center justify-center rounded-3xl border border-dashed border-line bg-surface/70 p-4">
                            {logoPreviewUrl ? (
                              <img
                                src={logoPreviewUrl}
                                alt={t("settings.company.logoPreviewAlt", {
                                  company: tenantNameDraft.trim() || tenantSettings.name
                                })}
                                className="max-h-36 max-w-full object-contain"
                              />
                            ) : (
                              <div className="space-y-2 text-center">
                                <p className="text-sm font-semibold text-ink">
                                  {t("settings.company.logoEmptyTitle")}
                                </p>
                                <p className="text-sm leading-6 text-ink-soft">
                                  {t("settings.company.logoEmptyDescription")}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex flex-wrap gap-3">
                            <Button
                              type="button"
                              variant="secondary"
                              onClick={handleOpenLogoPicker}
                              disabled={!canEditTenant}
                            >
                              <ImageUp className="size-4" aria-hidden="true" />
                              {logoPreviewUrl
                                ? t("settings.company.logoReplaceAction")
                                : t("settings.company.logoUploadAction")}
                            </Button>
                            {logoPreviewUrl ? (
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={handleRemoveLogoSelection}
                                disabled={!canEditTenant}
                              >
                                <Trash2 className="size-4" aria-hidden="true" />
                                {t("settings.company.logoRemoveAction")}
                              </Button>
                            ) : null}
                          </div>

                          <p className="text-xs leading-5 text-ink-muted">
                            {t("settings.company.logoHint")}
                          </p>
                        </div>
                      </div>
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
                          ? t("settings.company.saving")
                          : t("settings.company.saveAction")}
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
                    <CardTitle>{t("settings.security.title")}</CardTitle>
                    <CardDescription>
                      {t("settings.security.description")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
                    <div className="space-y-4">
                      <div className="rounded-3xl border border-line/70 bg-paper p-4">
                        <p className="text-sm font-semibold text-ink">
                          {t("settings.security.delete.scopeTitle")}
                        </p>
                        <p className="mt-2 text-sm leading-6 text-ink-soft">
                          {t("settings.security.delete.scopeText")}
                        </p>
                      </div>

                      <div className="rounded-3xl border border-amber-200/80 bg-amber-50/90 p-4">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 flex size-8 items-center justify-center rounded-full bg-amber-100 text-amber-700">
                            <AlertTriangle className="size-4" aria-hidden="true" />
                          </span>
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-ink">
                              {t("settings.security.delete.warningTitle")}
                            </p>
                            <p className="text-sm leading-6 text-ink-soft">
                              {t("settings.security.delete.warningText", {
                                slug: tenantSettings.slug
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-red-200/80 bg-red-50/85 p-5 sm:p-6">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-red-700/80">
                          {t("settings.security.delete.eyebrow")}
                        </p>
                        <h2 className="text-xl font-semibold tracking-tight text-ink">
                          {t("settings.security.delete.cardTitle")}
                        </h2>
                        <p className="text-sm leading-6 text-ink-soft">
                          {t("settings.security.delete.cardDescription")}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <SecurityImpactItem
                          label={t("settings.security.delete.impacts.memberships")}
                        />
                        <SecurityImpactItem
                          label={t("settings.security.delete.impacts.documents")}
                        />
                        <SecurityImpactItem
                          label={t("settings.security.delete.impacts.catalog")}
                        />
                        <SecurityImpactItem
                          label={t("settings.security.delete.impacts.account")}
                        />
                      </div>

                      {canDeleteTenant ? (
                        <Button
                          type="button"
                          className="w-full justify-center bg-red-600 text-white hover:bg-red-700"
                          onClick={() => {
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="mr-2 size-4" aria-hidden="true" />
                          {t("settings.security.delete.openAction")}
                        </Button>
                      ) : (
                        <div className="rounded-3xl border border-line/70 bg-paper/90 p-4">
                          <p className="text-sm font-semibold text-ink">
                            {t("settings.security.delete.lockedTitle")}
                          </p>
                          <p className="mt-2 text-sm leading-6 text-ink-soft">
                            {t("settings.security.delete.lockedDescription")}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </section>
            ) : null
          ) : null}
        </main>
      </div>

      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            closeDeleteDialog();
            return;
          }

          setIsDeleteDialogOpen(nextOpen);
        }}
      >
        <DialogContent closeLabel={t("shared.closeDialog")} className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("settings.security.delete.dialogTitle")}</DialogTitle>
            <DialogDescription>
              {t("settings.security.delete.dialogDescription", {
                tenant: tenantSettings?.name ?? "-"
              })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-3xl border border-red-200/80 bg-red-50/85 p-4">
              <p className="text-sm font-semibold text-ink">
                {t("settings.security.delete.confirmationTitle")}
              </p>
              <p className="mt-2 text-sm leading-6 text-ink-soft">
                {t("settings.security.delete.confirmationText", {
                  slug: tenantSettings?.slug ?? "-"
                })}
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="settings-delete-confirmation"
                className="text-sm font-medium text-ink"
              >
                {t("settings.security.delete.confirmationLabel")}
              </label>
              <Input
                id="settings-delete-confirmation"
                value={deleteConfirmationDraft}
                onChange={(event) => {
                  setDeleteConfirmationDraft(event.target.value);
                }}
                placeholder={tenantSettings?.slug ?? ""}
                autoComplete="off"
                autoCapitalize="none"
                autoCorrect="off"
                spellCheck={false}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="secondary"
                onClick={closeDeleteDialog}
                disabled={deleteTenantAccountMutation.isPending}
              >
                {t("settings.security.delete.cancelAction")}
              </Button>
              <Button
                type="button"
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  void handleDeleteTenant();
                }}
                disabled={
                  !isDeleteConfirmationValid ||
                  deleteTenantAccountMutation.isPending
                }
              >
                {deleteTenantAccountMutation.isPending
                  ? t("settings.security.delete.submitting")
                  : t("settings.security.delete.confirmAction")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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

function SecurityImpactItem({ label }: { label: string }) {
  return (
    <div className="flex items-start gap-3 rounded-3xl border border-line/70 bg-paper/90 p-4">
      <span className="mt-1 flex size-2.5 shrink-0 rounded-full bg-red-500" />
      <p className="text-sm leading-6 text-ink-soft">{label}</p>
    </div>
  );
}
