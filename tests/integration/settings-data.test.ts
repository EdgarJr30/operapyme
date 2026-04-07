import { beforeEach, describe, expect, it, vi } from "vitest";

const storageBucketMock = vi.hoisted(() => ({
  createSignedUrl: vi.fn(),
  remove: vi.fn(),
  upload: vi.fn()
}));

const supabaseMocks = vi.hoisted(() => ({
  from: vi.fn(),
  rpc: vi.fn(),
  storageFrom: vi.fn(() => storageBucketMock)
}));

vi.mock("@/lib/supabase/client", () => ({
  supabase: {
    from: supabaseMocks.from,
    rpc: supabaseMocks.rpc,
    storage: {
      from: supabaseMocks.storageFrom
    }
  }
}));

import {
  deleteTenantLogo,
  getTenantBrandingSettings,
  updateTenantBrandingSettings,
  uploadTenantLogo
} from "@/lib/supabase/settings-data";

function createThenableBuilder<TResult>(result: TResult) {
  const builder = {
    eq: vi.fn(() => builder),
    select: vi.fn(() => builder),
    single: vi.fn(() => builder),
    then: (
      onFulfilled?: (value: TResult) => unknown,
      onRejected?: (reason: unknown) => unknown
    ) => Promise.resolve(result).then(onFulfilled, onRejected)
  };

  return builder;
}

describe("settings data access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads company settings and resolves a signed tenant logo url", async () => {
    const tenantQuery = createThenableBuilder({
      data: {
        id: "tenant-1",
        name: "OperaPyme Demo",
        slug: "operapyme-demo",
        status: "active",
        address: "Av. 27 de Febrero 12, Santo Domingo",
        website_url: "operapyme.com",
        email: "hola@operapyme.com",
        phone: "+1 809 555 0140",
        secondary_phone: "+1 829 555 0141",
        rnc: "1-31-12345-6",
        cedula: "001-1234567-8",
        logo_path: "tenant-1/logo.png",
        palette_id: "slate",
        palette_seed_colors: null,
        created_at: "2026-04-05T10:00:00.000Z",
        updated_at: "2026-04-06T09:00:00.000Z"
      },
      error: null
    });

    supabaseMocks.from.mockReturnValueOnce(tenantQuery);
    storageBucketMock.createSignedUrl.mockResolvedValueOnce({
      data: {
        signedUrl: "https://example.test/logo-signed"
      },
      error: null
    });

    const settings = await getTenantBrandingSettings("tenant-1");

    expect(supabaseMocks.from).toHaveBeenCalledWith("tenants");
    expect(tenantQuery.eq).toHaveBeenCalledWith("id", "tenant-1");
    expect(supabaseMocks.storageFrom).toHaveBeenCalledWith("tenant-assets");
    expect(storageBucketMock.createSignedUrl).toHaveBeenCalledWith(
      "tenant-1/logo.png",
      3600
    );
    expect(settings).toEqual({
      id: "tenant-1",
      name: "OperaPyme Demo",
      slug: "operapyme-demo",
      status: "active",
      address: "Av. 27 de Febrero 12, Santo Domingo",
      websiteUrl: "operapyme.com",
      email: "hola@operapyme.com",
      phone: "+1 809 555 0140",
      secondaryPhone: "+1 829 555 0141",
      rnc: "1-31-12345-6",
      cedula: "001-1234567-8",
      logoPath: "tenant-1/logo.png",
      logoUrl: "https://example.test/logo-signed",
      paletteId: "slate",
      paletteSeedColors: null,
      createdAt: "2026-04-05T10:00:00.000Z",
      updatedAt: "2026-04-06T09:00:00.000Z"
    });
  });

  it("sends the company fields and logo path through the tenant settings rpc", async () => {
    supabaseMocks.rpc.mockResolvedValueOnce({
      data: [
        {
          id: "tenant-1",
          name: "Northline Industrial",
          slug: "northline-industrial",
          status: "active",
          address: "Av. Sarasota 10",
          website_url: "northline.do",
          email: "operaciones@northline.do",
          phone: "+1 829 555 0102",
          secondary_phone: "+1 829 555 0103",
          rnc: null,
          cedula: null,
          logo_path: null,
          palette_id: "slate",
          palette_seed_colors: null,
          created_at: "2026-04-05T10:00:00.000Z",
          updated_at: "2026-04-06T11:00:00.000Z"
        }
      ],
      error: null
    });

    const settings = await updateTenantBrandingSettings({
      tenantId: "tenant-1",
      name: "Northline Industrial",
      address: "Av. Sarasota 10",
      websiteUrl: "northline.do",
      email: "operaciones@northline.do",
      phone: "+1 829 555 0102",
      secondaryPhone: "+1 829 555 0103",
      rnc: null,
      cedula: null,
      logoPath: null,
      paletteId: "slate",
      paletteSeedColors: null
    });

    expect(supabaseMocks.rpc).toHaveBeenCalledWith(
      "update_tenant_branding_settings",
      {
        target_tenant_id: "tenant-1",
        next_name: "Northline Industrial",
        next_address: "Av. Sarasota 10",
        next_website_url: "northline.do",
        next_email: "operaciones@northline.do",
        next_phone: "+1 829 555 0102",
        next_secondary_phone: "+1 829 555 0103",
        next_rnc: "",
        next_cedula: "",
        next_logo_path: "",
        next_palette_id: "slate",
        next_palette_seed_colors: null
      }
    );
    expect(settings.address).toBe("Av. Sarasota 10");
    expect(settings.websiteUrl).toBe("northline.do");
    expect(settings.email).toBe("operaciones@northline.do");
    expect(settings.phone).toBe("+1 829 555 0102");
    expect(settings.secondaryPhone).toBe("+1 829 555 0103");
    expect(settings.logoPath).toBeNull();
    expect(settings.logoUrl).toBeNull();
  });

  it("uploads and removes tenant logos from the protected assets bucket", async () => {
    const logoFile = new File(["logo"], "logo.png", {
      type: "image/png"
    });

    storageBucketMock.upload.mockResolvedValueOnce({
      error: null
    });
    storageBucketMock.remove.mockResolvedValueOnce({
      error: null
    });

    const logoPath = await uploadTenantLogo("tenant-1", logoFile);

    expect(supabaseMocks.storageFrom).toHaveBeenCalledWith("tenant-assets");
    expect(storageBucketMock.upload).toHaveBeenCalledOnce();
    expect(logoPath).toMatch(/^tenant-1\/.+\.png$/);

    await deleteTenantLogo(logoPath);

    expect(storageBucketMock.remove).toHaveBeenCalledWith([logoPath]);
  });
});
