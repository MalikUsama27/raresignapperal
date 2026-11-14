import { createFileRoute } from "@tanstack/react-router";
import type {} from "@tanstack/react-start";
import { publicClient } from "@/lib/catalog.server";
import { SITE_URL } from "@/lib/site";
import { publicPath } from "@/lib/seo";

type Entry = { path: string; changefreq?: string; priority?: string; lastmod?: string };

const STATIC_ENTRIES: Entry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/products", changefreq: "weekly", priority: "0.9" },
  { path: "/blog", changefreq: "weekly", priority: "0.8" },
  { path: "/about", changefreq: "monthly", priority: "0.7" },
  { path: "/manufacturing", changefreq: "monthly", priority: "0.7" },
  { path: "/customization", changefreq: "monthly", priority: "0.7" },
  { path: "/export-markets", changefreq: "monthly", priority: "0.7" },
  { path: "/faq", changefreq: "monthly", priority: "0.6" },
  { path: "/contact", changefreq: "monthly", priority: "0.8" },
  { path: "/privacy-policy", changefreq: "yearly", priority: "0.3" },
  { path: "/terms", changefreq: "yearly", priority: "0.3" },
];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const supabase = publicClient();
        async function pages<T>(read: (from: number, to: number) => PromiseLike<{ data: T[] | null; error: unknown }>): Promise<T[]> {
          const rows: T[] = [];
          for (let from = 0; ; from += 500) {
            const result = await read(from, from + 499);
            if (result.error) throw new Error("Sitemap source unavailable", { cause: result.error });
            const batch = result.data ?? [];
            rows.push(...batch);
            if (batch.length < 500) return rows;
          }
        }
        const [categories, subcategories, products, posts] = await Promise.all([
          pages((from, to) => supabase.from("categories").select("id, slug").eq("is_active", true).order("id").range(from, to)),
          pages((from, to) => supabase.from("subcategories").select("slug, category_id").eq("is_active", true).order("id").range(from, to)),
          pages((from, to) => supabase.from("products").select("slug, updated_at").eq("is_published", true).order("id").range(from, to)),
          pages((from, to) => supabase
            .from("blog_posts")
            .select("slug, updated_at")
            .eq("is_published", true)
            .order("id").range(from, to)),
        ]);

        const categoryRows = categories;
        const slugById = new Map(categories.map((row) => [row.id, row.slug]));

        const entries: Entry[] = [
          ...STATIC_ENTRIES,
          ...categoryRows.map((row) => ({
            path: `/category/${row.slug}`,
            changefreq: "weekly",
            priority: "0.8",
          })),
          ...subcategories.flatMap((row) => {
            const parent = slugById.get(row.category_id);
            return parent
              ? [{ path: `/category/${parent}/${row.slug}`, changefreq: "weekly", priority: "0.7" }]
              : [];
          }),
          ...products.map((row) => ({
            path: `/products/${row.slug}`,
            changefreq: "monthly",
            priority: "0.7",
            lastmod: row.updated_at ?? undefined,
          })),
          ...posts.map((row) => ({
            path: `/blog/${row.slug}`,
            changefreq: "monthly",
            priority: "0.6",
            lastmod: row.updated_at ?? undefined,
          })),
        ];
        const uniqueEntries = [...new Map(entries.map((entry) => [publicPath(entry.path), { ...entry, path: publicPath(entry.path) }])).values()];
        const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

        const xml = [
          '<?xml version="1.0" encoding="UTF-8"?>',
          '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
          ...uniqueEntries.map((entry) =>
            [
              "  <url>",
              `    <loc>${escapeXml(`${SITE_URL}${entry.path === "/" ? "/" : entry.path}`)}</loc>`,
              entry.lastmod ? `    <lastmod>${new Date(entry.lastmod).toISOString()}</lastmod>` : null,
              entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
              entry.priority ? `    <priority>${entry.priority}</priority>` : null,
              "  </url>",
            ]
              .filter(Boolean)
              .join("\n"),
          ),
          "</urlset>",
        ].join("\n");

        return new Response(xml, {
          headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" },
        });
      },
    },
  },
});
