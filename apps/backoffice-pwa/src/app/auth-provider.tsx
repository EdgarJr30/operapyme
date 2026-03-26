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
  isConfigured: boolean;
  signInWithOtp: (email: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  refreshAccessContext: () => Promise<void>;
  setActiveTenantId: (tenantId: string) => void;
}

export const BackofficeAuthContext =
  createContext<BackofficeAuthContextValue | null>(null);

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

export function BackofficeAuthProvider({ children }: PropsWithChildren) {
  const [status, setStatus] = useState<BackofficeAuthStatus>(
    isSupabaseConfigured ? "loading" : "unconfigured"
  );
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [accessContext, setAccessContext] =
    useState<BackofficeAccessContext | null>(null);
  const [activeTenantId, setActiveTenantIdState] = useState<string | null>(() =>
    readStoredTenantId()
  );

  const refreshAccessContext = useCallback(async () => {
    if (!supabase) {
      return;
    }

    const { data, error } = await supabase.rpc("get_my_access_context");

    if (error) {
      console.error("Failed to load access context.", error);
      startTransition(() => {
        setAccessContext(createEmptyBackofficeAccessContext());
      });
      return;
    }

    startTransition(() => {
      setAccessContext(parseAccessContext(data));
    });
  }, []);

  useEffect(() => {
    if (!supabase) {
      startTransition(() => {
        setStatus("unconfigured");
        setSession(null);
        setUser(null);
        setAccessContext(null);
      });
      return;
    }

    const supabaseClient = supabase;
    let isMounted = true;

    async function hydrateSession() {
      const { data, error } = await supabaseClient.auth.getSession();

      if (!isMounted) {
        return;
      }

      if (error) {
        console.error("Failed to hydrate Supabase session.", error);
      }

      const nextSession = data.session;

      startTransition(() => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        setStatus(nextSession ? "signed_in" : "signed_out");
      });

      if (nextSession) {
        await refreshAccessContext();
      } else {
        startTransition(() => {
          setAccessContext(null);
          setActiveTenantIdState(null);
        });
      }
    }

    void hydrateSession();

    const {
      data: { subscription }
    } = supabaseClient.auth.onAuthStateChange((_event, nextSession) => {
      startTransition(() => {
        setSession(nextSession);
        setUser(nextSession?.user ?? null);
        setStatus(nextSession ? "signed_in" : "signed_out");
      });

      if (nextSession) {
        void refreshAccessContext();
      } else {
        startTransition(() => {
          setAccessContext(null);
          setActiveTenantIdState(null);
        });
        writeStoredTenantId(null);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

  const signOut = useCallback(async () => {
    if (!supabase) {
      return;
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Failed to sign out from Supabase.", error);
    }
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
      isConfigured: isSupabaseConfigured,
      signInWithOtp,
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
      signInWithOtp,
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
