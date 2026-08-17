import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const ADMIN_TABLES = [
  "categories",
  "subcategories",
  "products",
  "blog_posts",
  "blog_categories",
  "blog_tags",
  "faqs",
  "testimonials",
  "export_countries",
] as const;

export type AdminTable = (typeof ADMIN_TABLES)[number];

const tableSchema = z.enum(ADMIN_TABLES);

/** Reads the caller's own admin role row (RLS restricts rows to the caller). */
async function isAdmin(context: { supabase: any; userId: string }): Promise<boolean> {
  const { data, error } = await context.supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", context.userId)
    .eq("role", "admin")
    .maybeSingle();
  return !error && Boolean(data);
}

/** Verifies the caller is the configured administrator; throws otherwise. */
async function assertAdmin(context: { supabase: any; userId: string }) {
  if (!(await isAdmin(context))) throw new Error("Forbidden");
}

export const getAdminSession = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    return { isAdmin: await isAdmin(context), userId: context.userId };
  });


export const adminList = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        table: tableSchema,
        orderBy: z.string().max(40).optional(),
        ascending: z.boolean().default(true),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const order = data.orderBy ?? defaultOrder(data.table);
    const { data: rows, error } = await (context.supabase as any)
      .from(data.table)
      .select("*")
      .order(order, { ascending: data.ascending });
    if (error) throw new Error(error.message);
    return (rows ?? []) as Record<string, any>[];
  });

function defaultOrder(table: AdminTable) {
  if (table === "blog_posts") return "created_at";
  if (table === "blog_tags") return "name";
  return "sort_order";
}

export const adminSave = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        table: tableSchema,
        id: z.string().uuid().optional(),
        values: z.record(z.string(), z.any()),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const client = context.supabase as any;
    if (data.id) {
      const { error } = await client.from(data.table).update(data.values).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await client.from(data.table).insert(data.values).select("id").single();
    if (error) throw new Error(error.message);
    return { id: row.id as string };
  });

export const adminDelete = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ table: tableSchema, id: z.string().uuid() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await (context.supabase as any).from(data.table).delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminReorder = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        table: tableSchema,
        items: z.array(z.object({ id: z.string().uuid(), sort_order: z.number().int() })).max(500),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    for (const item of data.items) {
      const { error } = await (context.supabase as any)
        .from(data.table)
        .update({ sort_order: item.sort_order })
        .eq("id", item.id);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const getAdminOverview = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const client = context.supabase as any;
    const count = (table: string) => client.from(table).select("id", { count: "exact", head: true });

    const [products, categories, subcategories, posts, inquiries, recentProducts, recentPosts, recentInquiries] =
      await Promise.all([
        count("products"),
        count("categories"),
        count("subcategories"),
        count("blog_posts"),
        count("inquiries"),
        client.from("products").select("id, name, slug, is_published, created_at").order("created_at", { ascending: false }).limit(5),
        client.from("blog_posts").select("id, title, slug, is_published, created_at").order("created_at", { ascending: false }).limit(5),
        client.from("inquiries").select("id, full_name, company, country, product_name, status, created_at").order("created_at", { ascending: false }).limit(6),
      ]);

    return {
      totals: {
        products: products.count ?? 0,
        categories: categories.count ?? 0,
        subcategories: subcategories.count ?? 0,
        posts: posts.count ?? 0,
        inquiries: inquiries.count ?? 0,
      },
      recentProducts: (recentProducts.data ?? []) as Record<string, any>[],
      recentPosts: (recentPosts.data ?? []) as Record<string, any>[],
      recentInquiries: (recentInquiries.data ?? []) as Record<string, any>[],
    };
  });

export const adminListInquiries = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data, error } = await (context.supabase as any)
      .from("inquiries")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);
    if (error) throw new Error(error.message);
    return (data ?? []) as Record<string, any>[];
  });

export const adminUpdateInquiryStatus = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({ id: z.string().uuid(), status: z.enum(["new", "in_progress", "quoted", "won", "closed"]) })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    const { error } = await (context.supabase as any)
      .from("inquiries")
      .update({ status: data.status })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const adminGetSettings = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context);
    const { data } = await context.supabase.from("site_settings").select("key, value").order("key");
    return (data ?? []) as { key: string; value: string | null }[];
  });

export const adminSaveSettings = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ entries: z.array(z.object({ key: z.string().max(60), value: z.string().max(2000) })).max(80) }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    for (const entry of data.entries) {
      const { error } = await context.supabase
        .from("site_settings")
        .upsert({ key: entry.key, value: entry.value }, { onConflict: "key" });
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

export const adminUploadImage = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z
      .object({
        fileName: z.string().min(1).max(160),
        contentType: z.string().max(80),
        base64: z.string().max(12_000_000),
      })
      .parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertAdmin(context);
    if (!/^image\/(png|jpe?g|webp|avif|gif|svg\+xml)$/.test(data.contentType)) {
      throw new Error("Only image uploads are allowed.");
    }
    const bytes = Uint8Array.from(atob(data.base64), (char) => char.charCodeAt(0));
    const safeName = data.fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(-80);
    const path = `uploads/${Date.now()}-${safeName}`;

    const { error } = await context.supabase.storage
      .from("media")
      .upload(path, bytes, { contentType: data.contentType, upsert: false });
    if (error) throw new Error(error.message);

    const { data: signed, error: signError } = await context.supabase.storage
      .from("media")
      .createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
    if (signError || !signed) throw new Error("Upload succeeded but the URL could not be created.");
    return { url: signed.signedUrl, path };
  });

/**
 * Idempotent bootstrap of the single administrator account from server-only
 * env vars (ADMIN_EMAIL / ADMIN_PASSWORD). Does nothing once an admin exists,
 * and never returns credential material.
 */
export const ensureAdminAccount = createServerFn({ method: "POST" }).handler(async () => {
  const email = process.env["ADMIN_EMAIL"];
  const password = process.env["ADMIN_PASSWORD"];
  if (!email || !password) return { ready: false as const, reason: "not_configured" as const };

  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

  const { count } = await supabaseAdmin.from("user_roles").select("id", { count: "exact", head: true }).eq("role", "admin");
  if ((count ?? 0) > 0) return { ready: true as const };

  const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId = created?.user?.id;
  if (error && !userId) {
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    userId = list?.users.find((user) => user.email?.toLowerCase() === email.toLowerCase())?.id;
    if (userId) await supabaseAdmin.auth.admin.updateUserById(userId, { password, email_confirm: true });
  }
  if (!userId) {
    console.error("[admin bootstrap] could not create administrator account", error?.message);
    return { ready: false as const, reason: "failed" as const };
  }

  const { error: roleError } = await supabaseAdmin
    .from("user_roles")
    .upsert({ user_id: userId, role: "admin" }, { onConflict: "user_id,role" });
  if (roleError) {
    console.error("[admin bootstrap] could not grant admin role", roleError.message);
    return { ready: false as const, reason: "failed" as const };
  }
  return { ready: true as const };
});
