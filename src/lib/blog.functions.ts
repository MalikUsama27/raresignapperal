import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { publicClient, BLOG_CARD_FIELDS } from "./catalog.server";

export const listBlogPostsInput = z.object({
  category: z.string().trim().max(120).optional(),
  search: z.string().trim().max(120).optional(),
  limit: z.number().int().min(1).max(50).default(24),
});

export const listBlogPosts = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => listBlogPostsInput.parse(data ?? {}))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    let query = supabase
      .from("blog_posts")
      .select(`${BLOG_CARD_FIELDS}, blog_categories(name, slug)`)
      .eq("is_published", true);

    if (data.category) {
      const { data: category } = await supabase
        .from("blog_categories")
        .select("id")
        .eq("slug", data.category)
        .maybeSingle();
      if (!category) return { items: [], categories: [] };
      query = query.eq("category_id", category.id);
    }

    if (data.search) {
      const term = `%${data.search.replace(/[%_,]/g, " ")}%`;
      query = query.or(`title.ilike.${term},excerpt.ilike.${term},keywords.ilike.${term}`);
    }

    const [{ data: items }, { data: categories }] = await Promise.all([
      query.order("published_at", { ascending: false }).limit(data.limit),
      supabase.from("blog_categories").select("id, slug, name, description").order("sort_order"),
    ]);

    return { items: items ?? [], categories: categories ?? [] };
  });

export const getBlogPost = createServerFn({ method: "GET" })
  .inputValidator((data: unknown) => z.object({ slug: z.string().trim().max(200) }).parse(data))
  .handler(async ({ data }) => {
    const supabase = publicClient();
    const { data: post } = await supabase
      .from("blog_posts")
      .select("*, blog_categories(name, slug)")
      .eq("slug", data.slug)
      .eq("is_published", true)
      .maybeSingle();

    if (!post) return null;

    const [{ data: related }, { data: tagRows }] = await Promise.all([
      supabase
        .from("blog_posts")
        .select(`${BLOG_CARD_FIELDS}, blog_categories(name, slug)`)
        .eq("is_published", true)
        .neq("id", post.id)
        .order("published_at", { ascending: false })
        .limit(3),
      supabase.from("blog_post_tags").select("blog_tags(name, slug)").eq("post_id", post.id),
    ]);

    return {
      post,
      related: related ?? [],
      tags: (tagRows ?? []).flatMap((row) => (row.blog_tags ? [row.blog_tags] : [])),
    };
  });

/** Slugs + timestamps for the sitemap. */
export const listBlogSitemapEntries = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = publicClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("slug, updated_at, published_at")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
});
