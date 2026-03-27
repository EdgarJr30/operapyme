import type { PropsWithChildren } from "react";
import {
  useCallback,
  createContext,
  startTransition,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";

import type { Session, User } from "@supabase/supabase-js";

import {
  createEmptyBackofficeAccessContext,
  getPrimaryTenantMembership,
  hasBootstrappedTenant,
  platformPermissionKeys,
  platformRoleKeys,
  tenantPermissionKeys,
  tenantRoleKeys,
  type BackofficeAccessContext
} from "@operapyme/domain";

import {
  isSupabaseConfigured,
  supabase
} from "@/lib/supabase/client";

const tenantStorageKey = "operapyme.backoffice.tenant";

export type BackofficeAuthStatus =
  | "loading"
  | "signed_out"
  | "signed_in"
  | "unconfigured";

interface BackofficeAuthContextValue {
  status: BackofficeAuthStatus;
  session: Session | null;
  user: User | null;
  accessContext: BackofficeAccessContext | null;
  activeTenantId: string | null;
  isBootstrapped: boolean;
  isAccessContextLoading: boolean;
  isConfigured: boolean;
  signInWithOtp: (email: string) => Promise<string | null>;
  signInWithPassword: (email: string, password: string) => Promise<string | null>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  setPassword: (password: string) => Promise<string | null>;
  signOut: () => Promise<string | null>;
  refreshAccessContext: () => Promise<void>;
  setActiveTenantId: (tenantId: string) => void;
}

export const BackofficeAuthContext =
  createContext<BackofficeAuthContextValue | null>(null);

interface AccessContextRequestState {
  userId: string;
  promise: Promise<BackofficeAccessContext>;
}

let accessContextRequestState: AccessContextRequestState | null = null;
let accessContextRequestVersion = 0;

function readStoredTenantId() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(tenantStorageKey);
}

function writeStoredTenantId(tenantId: string | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (tenantId) {
    window.localStorage.setItem(tenantStorageKey, tenantId);
    return;
  }

  window.localStorage.removeItem(tenantStorageKey);
}

function parseAccessContext(raw: unknown): BackofficeAccessContext {
  if (!raw || typeof raw !== "object") {
    return createEmptyBackofficeAccessContext();
  }

  const value = raw as Record<string, unknown>;
  const memberships = Array.isArray(value.memberships)
    ? value.memberships
        .map((membership) => {
          if (!membership || typeof membership !== "object") {
            return null;
          }

          const item = membership as Record<string, unknown>;

          return {
            membershipId:
              typeof item.membershipId === "string" ? item.membershipId : "",
            tenantId: typeof item.tenantId === "string" ? item.tenantId : "",
            tenantName:
              typeof item.tenantName === "string" ? item.tenantName : "",
            tenantSlug:
              typeof item.tenantSlug === "string" ? item.tenantSlug : "",
            status:
              item.status === "invited" ||
              item.status === "active" ||
              item.status === "suspended"
                ? item.status
                : "invited",
            tenantRoleKeys: Array.isArray(item.tenantRoleKeys)
              ? item.tenantRoleKeys.filter((roleKey) =>
                  tenantRoleKeys.includes(roleKey as (typeof tenantRoleKeys)[number])
                )
              : []
          };
        })
        .filter(
          (
            membership
          ): membership is BackofficeAccessContext["memberships"][number] =>
            Boolean(
              membership &&
                membership.membershipId &&
                membership.tenantId &&
                membership.tenantName &&
                membership.tenantSlug
            )
        )
    : [];

  return {
    appUserId: typeof value.appUserId === "string" ? value.appUserId : null,
    email: typeof value.email === "string" ? value.email : null,
    displayName:
      typeof value.displayName === "string" ? value.displayName : null,
    isGlobalAdmin: Boolean(value.isGlobalAdmin),
    memberships,
    platformRoleKeys: Array.isArray(value.platformRoleKeys)
      ? value.platformRoleKeys.filter(
          (
            roleKey
          ): roleKey is BackofficeAccessContext["platformRoleKeys"][number] =>
            platformRoleKeys.includes(
              roleKey as (typeof platformRoleKeys)[number]
            )
        )
      : [],
    platformPermissionKeys: Array.isArray(value.platformPermissionKeys)
      ? value.platformPermissionKeys.filter(
          (
            permissionKey
          ): permissionKey is BackofficeAccessContext["platformPermissionKeys"][number] =>
            platformPermissionKeys.includes(
              permissionKey as (typeof platformPermissionKeys)[number]
            )
        )
      : [],
    tenantPermissionKeys: Array.isArray(value.tenantPermissionKeys)
      ? value.tenantPermissionKeys.filter(
          (
            permissionKey
          ): permissionKey is BackofficeAccessContext["tenantPermissionKeys"][number] =>
            tenantPermissionKeys.includes(
              permissionKey as (typeof tenantPermissionKeys)[number]
            )
        )
      : []
  };
}

function clearAccessContextRequestState() {
  accessContextRequestState = null;
}

async function loadAccessContextForUser(
  userId: string,
  force = false
) {
  if (!supabase) {
    return createEmptyBackofficeAccessContext();
  }

  if (
    !force &&
    accessContextRequestState &&
    accessContextRequestState.userId === userId
  ) {
    return accessContextRequestState.promise;
  }

  const requestVersion = ++accessContextRequestVersion;
  const request = Promise.resolve(supabase.rpc("get_my_access_context"))
    .then(({ data, error }) => {
      if (error) {
        console.error("Failed to load access context.", error);
        return createEmptyBackofficeAccessContext();
      }

      return parseAccessContext(data);
    })
    .finally(() => {
      if (accessContextRequestVersion === requestVersion) {
        clearAccessContextRequestState();
      }
    });

  accessContextRequestState = {
    userId,
    promise: request
  };

  return request;
}

export function BackofficeAuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<BackofficeAuthStatus>(
    isSupabaseConfigured ? "loading" : "unconfigured"
  );
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [accessContext, setAccessContext] =
    useState<BackofficeAccessContext | null>(null);
  const [isAccessContextLoading, setIsAccessContextLoading] = useState(
    isSupabaseConfigured
  );
  const [activeTenantId, setActiveTenantIdState] = useState<string | null>(() =>
    readStoredTenantId()
  );

  const refreshAccessContext = useCallback(async () => {
    if (!supabase || !user?.id) {
      startTransition(() => {
        setAccessContext(null);
        setIsAccessContextLoading(false);
      });
      return;
    }

    startTransition(() => {
      setIsAccessContextLoading(true);
    });

    const nextAccessContext = await loadAccessContextForUser(user.id, true);

    startTransition(() => {
      setAccessContext(nextAccessContext);
      setIsAccessContextLoading(false);
    });
  }, [user?.id]);

  useEffect(() => {
    if (!supabase) {
      startTransition(() => {
        setStatus("unconfigured");
        setSession(null);
        setUser(null);
        setAccessContext(null);
        setIsAccessContextLoading(false);
      });
      return;
    }

    const supabaseClient = supabase;

    const {
      data: { subscription }
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      startTransition(() => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        setStatus(nextSession ? "signed_in" : "signed_out");
      });

      if (!nextSession) {
        clearAccessContextRequestState();
        startTransition(() => {
          setAccessContext(null);
          setActiveTenantIdState(null);
          setIsAccessContextLoading(false);
        });
        writeStoredTenantId(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!supabase || status === "loading") {
      return;
    }

    if (!user?.id) {
      startTransition(() => {
        setAccessContext(null);
        setIsAccessContextLoading(false);
      });
      return;
    }

    let isActive = true;

    startTransition(() => {
      setIsAccessContextLoading(true);
    });

    void loadAccessContextForUser(user.id).then((nextAccessContext) => {
      if (!isActive) {
        return;
      }

      startTransition(() => {
        setAccessContext(nextAccessContext);
        setIsAccessContextLoading(false);
      });
    });

    return () => {
      isActive = false;
    };
  }, [status, user?.id]);

  useEffect(() => {
    const primaryTenant = getPrimaryTenantMembership(accessContext, activeTenantId);
    const nextTenantId = primaryTenant?.tenantId ?? null;

    if (nextTenantId !== activeTenantId) {
      startTransition(() => {
        setActiveTenantIdState(nextTenantId);
      });
      writeStoredTenantId(nextTenantId);
      return;
    }

    writeStoredTenantId(activeTenantId);
  }, [accessContext, activeTenantId]);

  const signInWithOtp = useCallback(async (email: string) => {
    if (!supabase) {
      return "Supabase no esta configurado para este entorno.";
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    return error?.message ?? null;
  }, []);

  const signInWithPassword = useCallback(
    async (email: string, password: string) => {
      if (!supabase) {
        return "Supabase no esta configurado para este entorno.";
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      return error?.message ?? null;
    },
    []
  );

  const requestPasswordReset = useCallback(async (email: string) => {
    if (!supabase) {
      return "Supabase no esta configurado para este entorno.";
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?flow=recovery`
    });

    return error?.message ?? null;
  }, []);

  const setPassword = useCallback(async (password: string) => {
    if (!supabase) {
      return "Supabase no esta configurado para este entorno.";
    }

    const { error } = await supabase.auth.updateUser({
      password
    });

    return error?.message ?? null;
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) {
      return "Supabase no esta configurado para este entorno.";
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Failed to sign out from Supabase.", error);
      return error.message;
    }

    return null;
  }, []);

  const setActiveTenantId = useCallback((tenantId: string) => {
    startTransition(() => {
      setActiveTenantIdState(tenantId);
    });
    writeStoredTenantId(tenantId);
  }, []);

  const value = useMemo<BackofficeAuthContextValue>(
    () => ({
      status,
      session,
      user,
      accessContext,
      activeTenantId,
      isBootstrapped: hasBootstrappedTenant(accessContext),
      isAccessContextLoading,
      isConfigured: isSupabaseConfigured,
      signInWithOtp,
      signInWithPassword,
      requestPasswordReset,
      setPassword,
      signOut,
      refreshAccessContext,
      setActiveTenantId
    }),
    [
      status,
      session,
      user,
      accessContext,
      activeTenantId,
      isAccessContextLoading,
      signInWithOtp,
      signInWithPassword,
      requestPasswordReset,
      setPassword,
      signOut,
      refreshAccessContext,
      setActiveTenantId
    ]
  );

  return (
    <BackofficeAuthContext.Provider value={value}>
      {children}
    </BackofficeAuthContext.Provider>
  );
}

export function useBackofficeAuth() {
  const context = useContext(BackofficeAuthContext);

  if (!context) {
    throw new Error("useBackofficeAuth must be used inside BackofficeAuthProvider.");
  }

  return context;
}
