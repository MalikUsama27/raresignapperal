import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { listProductsInput, inquirySchema } from "./catalog.schemas";
import {
  publicClient,
  CATEGORY_FIELDS,
  SUBCATEGORY_FIELDS,
  PRODUCT_CARD_FIELDS,
} from "./catalog.server";

export type NavCategory = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  image_url: string | null;
  subcategories: { id: string; slug: string; name: string }[];
};

export const getNavigation = createServerFn({ method: "GET" }).handler(async (): Promise<NavCategory[]> => {
  const supabase = publicClient();
  const [{ data: categories }, { data: subcategories }] = await Promise.all([
    supabase.from("categories").select(CATEGORY_FIELDS).order("sort_order"),
    supabase.from("subcategories").select(SUBCATEGORY_FIELDS).order("sort_order"),
  ]);

  return (categories ?? []).map((category) => ({
    id: category.id,
    slug: category.slug,
    name: category.name,
    tagline: category.tagline,
    image_url: category.image_url,
    subcategories: (subcategories ?? [])
      .filter((sub) => sub.category_id === category.id)
      .map((sub) => ({ id: sub.id, slug: sub.slug, name: sub.name })),
  }));
});

export const getSiteSettings = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data } = await supabase.from("site_settings").select("key, value");
  return Object.fromEntries((data ?? []).map((row) => [row.key, row.value ?? ""])) as Record<string, string>;
});

export const getHomeContent = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const [categories, featured, countries, testimonials, faqs, productCount] = await Promise.all([
    supabase.from("categories").select(CATEGORY_FIELDS).order("sort_order"),
    supabase
      .from("products")
      .select(PRODUCT_CARD_FIELDS)
      .eq("is_featured", true)
      .order("sort_order")
      .limit(8),
    supabase.from("export_countries").select("id, name, code, region, lat, lng").order("sort_order"),
    supabase.from("testimonials").select("id, author, role, company, country, quote, rating").order("sort_order"),
    supabase.from("faqs").select("id, question, answer, category").order("sort_order").limit(8),
    supabase.from("products").select("id", { count: "exact", head: true }),
  ]);

  return {
    categories: categories.data ?? [],
    featured: featured.data ?? [],
    countries: countries.data ?? [],
    testimonials: testimonials.data ?? [],
    faqs: faqs.data ?? [],
    productCount: productCount.count ?? 0,
  };
});

export const getFaqs = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data } = await supabase.from("faqs").select("id, question, answer, category").order("sort_order");
  return data ?? [];
});

export const getExportCountries = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data } = await supabase
    .from("export_countries")
    .select("id, name, code, region, lat, lng")
    .order("sort_order");
  return data ?? [];
});


export const listProducts = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => listProductsInput.parse(data ?? {}))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const from = (data.page - 1) * data.perPage;

    let query = supabase
      .from("products")
      .select("id, slug, name, sku, short_description, image_url, moq, is_featured, category_id, subcategory_id, categories(name, slug), subcategories(name, slug)", { count: "exact" });

    if (data.category) {
      const { data: category } = await supabase
        .from("categories")
        .select("id")
        .eq("slug", data.category)
        .maybeSingle();
      if (!category) return { items: [], total: 0, page: data.page, perPage: data.perPage };
      query = query.eq("category_id", category.id);
    }

    if (data.subcategory) {
      const { data: sub } = await supabase
        .from("subcategories")
        .select("id")
        .eq("slug", data.subcategory)
        .maybeSingle();
      if (!sub) return { items: [], total: 0, page: data.page, perPage: data.perPage };
      query = query.eq("subcategory_id", sub.id);
    }

    if (data.featured) query = query.eq("is_featured", true);

    if (data.search) {
      const term = `%${data.search.replace(/[%_,]/g, " ")}%`;
      query = query.or(`name.ilike.${term},short_description.ilike.${term},keywords.ilike.${term}`);
    }

    if (data.sort === "name") query = query.order("name");
    else if (data.sort === "newest") query = query.order("created_at", { ascending: false });
    else query = query.order("is_featured", { ascending: false }).order("name");

    const { data: items, count } = await query.range(from, from + data.perPage - 1);

    return {
      items: items ?? [],
      total: count ?? 0,
      page: data.page,
      perPage: data.perPage,
    };
  });

export const getProduct = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().trim().max(160) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: product } = await supabase
      .from("products")
      .select("*, categories(name, slug), subcategories(name, slug)")
      .eq("slug", data.slug)
      .maybeSingle();

    if (!product) return null;

    const { data: related } = await supabase
      .from("products")
      .select("id, slug, name, sku, short_description, image_url, moq, is_featured, category_id, subcategory_id, categories(name, slug), subcategories(name, slug)")
      .eq("category_id", product.category_id)
      .neq("id", product.id)
      .limit(4);

    return { product, related: related ?? [] };
  });

export const getCategory = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().trim().max(160) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: category } = await supabase
      .from("categories")
      .select(CATEGORY_FIELDS)
      .eq("slug", data.slug)
      .maybeSingle();
    if (!category) return null;

    const [{ data: subcategories }, { count }] = await Promise.all([
      supabase.from("subcategories").select(SUBCATEGORY_FIELDS).eq("category_id", category.id).order("sort_order"),
      supabase.from("products").select("id", { count: "exact", head: true }).eq("category_id", category.id),
    ]);

    return { category, subcategories: subcategories ?? [], productCount: count ?? 0 };
  });

export const getSubcategory = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) =>
    z.object({ category: z.string().trim().max(160), subcategory: z.string().trim().max(160) }).parse(data),
  )
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: category } = await supabase
      .from("categories")
      .select(CATEGORY_FIELDS)
      .eq("slug", data.category)
      .maybeSingle();
    if (!category) return null;

    const { data: subcategory } = await supabase
      .from("subcategories")
      .select(SUBCATEGORY_FIELDS)
      .eq("category_id", category.id)
      .eq("slug", data.subcategory)
      .maybeSingle();
    if (!subcategory) return null;

    return { category, subcategory };
  });



export const submitInquiry = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => inquirySchema.parse(data))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { error } = await supabase.from("inquiries").insert({
      full_name: data.full_name,
      company: data.company || null,
      email: data.email,
      phone: data.phone || null,
      whatsapp: data.whatsapp || null,
      country: data.country || null,
      product_id: data.product_id ?? null,
      product_name: data.product_name || null,
      quantity: data.quantity || null,
      message: data.message,
    });

    if (error) throw new Error("We could not submit your inquiry. Please try again or contact us on WhatsApp.");
    return { ok: true };
  });
