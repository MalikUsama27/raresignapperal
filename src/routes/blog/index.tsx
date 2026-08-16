import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { z } from "zod";
import { ArrowRight, Clock } from "lucide-react";
import { blogPostsQuery } from "@/lib/queries";
import { CtaSection, PageHero } from "@/components/site/PageShell";
import { Reveal } from "@/components/site/Reveal";
import { canonical } from "@/lib/site";
import { cn } from "@/lib/utils";

const searchSchema = z.object({ category: z.string().trim().max(120).optional() });

const TITLE = "Sportswear Manufacturing Insights & Export Guides | Rare Signs Apparel";
const DESCRIPTION =
  "Fabric guides, decoration methods, sourcing tips and export compliance advice from a Sialkot-based sportswear manufacturer and exporter.";

export const Route = createFileRoute("/blog/")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ category: search.category }),
  loader: async ({ context, deps }) => {
    await context.queryClient.ensureQueryData(blogPostsQuery({ category: deps.category }));
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: canonical("/blog") },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: canonical("/blog") }],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  const { category } = Route.useSearch();
  const { data } = useSuspenseQuery(blogPostsQuery({ category }));
  const posts = data.items;
  const [lead, ...rest] = posts;

  return (
    <>
      <PageHero
        eyebrow="Insights"
        title="Sportswear manufacturing, fabric and export insights"
        description="Practical guides written for teamwear buyers, wholesalers and brand owners — fabric selection, decoration methods, sourcing and export documentation."
      />

      <section className="border-t border-border py-16 md:py-24">
        <div className="container-page">
          <div className="flex flex-wrap gap-2">
            <Link
              to="/blog"
              search={{}}
              className={cn(
                "rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                !category ? "border-primary/50 bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              All topics
            </Link>
            {data.categories.map((item) => (
              <Link
                key={item.id}
                to="/blog"
                search={{ category: item.slug }}
                className={cn(
                  "rounded-full border border-border px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition-colors",
                  category === item.slug
                    ? "border-primary/50 bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {posts.length === 0 ? (
            <p className="mt-16 text-sm text-muted-foreground">No articles published in this topic yet.</p>
          ) : null}

          {lead ? (
            <Reveal>
              <Link
                to="/blog/$slug"
                params={{ slug: lead.slug }}
                className="group mt-10 grid overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/40 lg:grid-cols-2"
              >
                {lead.cover_image_url ? (
                  <img
                    src={lead.cover_image_url}
                    alt={lead.title}
                    className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-[1.03] lg:h-full"
                  />
                ) : null}
                <div className="p-8 md:p-12">
                  <p className="eyebrow">{lead.blog_categories?.name ?? "Insight"}</p>
                  <h2 className="display-lg mt-4 text-balance">{lead.title}</h2>
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{lead.excerpt}</p>
                  <p className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Clock className="size-3.5 text-primary" /> {lead.read_minutes} min read
                    </span>
                    <time dateTime={lead.published_at ?? undefined}>{formatDate(lead.published_at)}</time>
                  </p>
                  <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Read article <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ) : null}

          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Reveal key={post.id}>
                <Link
                  to="/blog/$slug"
                  params={{ slug: post.slug }}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/40"
                >
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      loading="lazy"
                      className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                  ) : null}
                  <div className="flex flex-1 flex-col p-6">
                    <p className="eyebrow">{post.blog_categories?.name ?? "Insight"}</p>
                    <h3 className="mt-3 font-display text-lg font-bold tracking-tight text-balance">{post.title}</h3>
                    <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{post.excerpt}</p>
                    <p className="mt-5 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Clock className="size-3.5 text-primary" /> {post.read_minutes} min
                      </span>
                      <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}

export function formatDate(value: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}
