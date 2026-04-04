import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json"
};

interface DeleteTenantAccountRequest {
  tenantId?: string;
  confirmationText?: string;
}

interface AccessMembership {
  tenantId: string;
  tenantName: string;
  tenantSlug: string;
  status: "invited" | "active" | "suspended";
  tenantRoleKeys: string[];
}

interface AccessContextPayload {
  isGlobalAdmin?: boolean;
  memberships?: AccessMembership[];
}

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    headers: corsHeaders,
    status
  });
}

Deno.serve(async (request: Request) => {
  if (request.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders
    });
  }

  if (request.method !== "POST") {
    return jsonResponse(405, {
      error: "Method not allowed"
    });
  }

  const authHeader = request.headers.get("Authorization");

  if (!authHeader) {
    return jsonResponse(401, {
      error: "Missing authorization header"
    });
  }

  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY");
  const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
    return jsonResponse(500, {
      error: "Supabase environment variables are incomplete"
    });
  }

  try {
    const body = (await request.json()) as DeleteTenantAccountRequest;
    const tenantId = body.tenantId?.trim();
    const confirmationText = body.confirmationText?.trim().toLowerCase() ?? "";

    if (!tenantId) {
      return jsonResponse(400, {
        error: "Tenant id is required"
      });
    }

    const supabaseUser = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      },
      global: {
        headers: {
          Authorization: authHeader
        }
      }
    });

    const {
      data: { user },
      error: userError
    } = await supabaseUser.auth.getUser(
      authHeader.replace(/^Bearer\s+/i, "").trim()
    );

    if (userError || !user) {
      return jsonResponse(401, {
        error: "Authentication required"
      });
    }

    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    const [{ data: accessContextRaw, error: accessError }, { data: tenantRow, error: tenantError }] =
      await Promise.all([
        supabaseUser.rpc("get_my_access_context"),
        supabaseAdmin
          .from("tenants")
          .select("id, slug, name")
          .eq("id", tenantId)
          .single()
      ]);

    if (accessError) {
      return jsonResponse(403, {
        error: "We could not validate your access context"
      });
    }

    if (tenantError || !tenantRow) {
      return jsonResponse(404, {
        error: "Tenant not found"
      });
    }

    const accessContext = (accessContextRaw ?? {}) as AccessContextPayload;
    const targetMembership =
      accessContext.memberships?.find((membership) => membership.tenantId === tenantId) ??
      null;
    const isGlobalAdmin = Boolean(accessContext.isGlobalAdmin);
    const isTenantOwner = Boolean(
      targetMembership &&
        targetMembership.status === "active" &&
        targetMembership.tenantRoleKeys.includes("tenant_owner")
    );

    if (!isGlobalAdmin && !isTenantOwner) {
      return jsonResponse(403, {
        error: "You do not have permission to delete this tenant"
      });
    }

    if (confirmationText !== tenantRow.slug.toLowerCase()) {
      return jsonResponse(400, {
        error: "Confirmation text does not match the tenant slug"
      });
    }

    const { count: remainingTenantMemberships, error: membershipCountError } =
      await supabaseAdmin
        .from("tenant_memberships")
        .select("id", {
          count: "exact",
          head: true
        })
        .eq("app_user_id", user.id)
        .eq("status", "active")
        .neq("tenant_id", tenantId);

    if (membershipCountError) {
      return jsonResponse(500, {
        error: "We could not validate the remaining tenant memberships"
      });
    }

    const { data: deletedTenantRows, error: deleteTenantError } =
      await supabaseAdmin.rpc("delete_tenant_for_shutdown", {
        target_tenant_id: tenantId,
        target_actor_user_id: user.id,
        delete_reason: isTenantOwner ? "tenant_owner_requested" : "global_admin_requested"
      });

    if (deleteTenantError) {
      return jsonResponse(500, {
        error: deleteTenantError.message
      });
    }

    const deletedTenant = Array.isArray(deletedTenantRows)
      ? deletedTenantRows[0]
      : deletedTenantRows;

    if (!deletedTenant) {
      return jsonResponse(500, {
        error: "Tenant deletion returned no data"
      });
    }

    let accountDeleted = false;

    if (isTenantOwner && (remainingTenantMemberships ?? 0) === 0) {
      const { error: deleteUserError } =
        await supabaseAdmin.auth.admin.deleteUser(user.id);

      if (deleteUserError) {
        console.error("Failed to delete auth user after tenant deletion.", {
          error: deleteUserError.message,
          tenantId,
          userId: user.id
        });
      } else {
        accountDeleted = true;
      }
    }

    return jsonResponse(200, {
      accountDeleted,
      remainingTenantMemberships: remainingTenantMemberships ?? 0,
      tenant: deletedTenant
    });
  } catch (error) {
    console.error("Unexpected delete-tenant-account error.", error);

    return jsonResponse(500, {
      error: "Unexpected server error"
    });
  }
});
