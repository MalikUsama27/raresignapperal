import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Clock, MessageCircle } from "lucide-react";
import { blogPostQuery } from "@/lib/queries";
import { Breadcrumbs, CtaSection } from "@/components/site/PageShell";
import { Markdown } from "@/components/site/Markdown";
import { Reveal } from "@/components/site/Reveal";
import { GENERAL_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/whatsapp";
import { canonical, COMPANY_NAME, SITE_URL } from "@/lib/site";
import { formatDate } from "./index";

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(blogPostQuery(params.slug));
    if (!data) throw notFound();
    const { post } = data;
    return {
      slug: post.slug,
      title: post.seo_title ?? post.title,
      description: post.seo_description ?? post.excerpt ?? "",
      keywords: post.keywords ?? "",
      image: post.cover_image_url ?? null,
      publishedAt: post.published_at,
      updatedAt: post.updated_at,
      headline: post.title,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {};
    const url = canonical(`/blog/${loaderData.slug}`);
    const image = loaderData.image ? `${SITE_URL}${loaderData.image}` : null;

    return {
      meta: [
        { title: loaderData.title },
        { name: "description", content: loaderData.description },
        ...(loaderData.keywords ? [{ name: "keywords", content: loaderData.keywords }] : []),
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { name: "twitter:card", content: "summary_large_image" },
        ...(image
          ? [
              { property: "og:image", content: image },
              { name: "twitter:image", content: image },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            headline: loaderData.headline,
            description: loaderData.description,
            ...(image ? { image: [image] } : {}),
            datePublished: loaderData.publishedAt,
            dateModified: loaderData.updatedAt,
            mainEntityOfPage: { "@type": "WebPage", "@id": url },
            author: { "@type": "Organization", name: COMPANY_NAME },
            publisher: { "@type": "Organization", name: COMPANY_NAME },
          }),
        },
      ],
    };
  },
  component: BlogPostPage,
});

function BlogPostPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(blogPostQuery(slug));
  if (!data) return null;
  const { post, related, tags } = data;

  return (
    <>
      <article>
        <header className="bg-hero pt-28 pb-14 md:pt-36 md:pb-16">
          <div className="container-page max-w-3xl">
            <Breadcrumbs items={[{ label: "Insights", to: "/blog" }, { label: post.title }]} />
            <p className="eyebrow">{post.blog_categories?.name ?? "Insight"}</p>
            <h1 className="display-lg mt-4 text-balance">{post.title}</h1>
            {post.excerpt ? (
              <p className="mt-6 text-base leading-relaxed text-muted-foreground md:text-lg">{post.excerpt}</p>
            ) : null}
            <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              <span>{post.author}</span>
              <time dateTime={post.published_at ?? undefined}>{formatDate(post.published_at)}</time>
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-primary" /> {post.read_minutes} min read
              </span>
            </div>
          </div>
        </header>

        {post.cover_image_url ? (
          <div className="container-page max-w-4xl">
            <img
              src={post.cover_image_url}
              alt={post.title}
              className="aspect-[16/8] w-full rounded-2xl border border-border object-cover"
            />
          </div>
        ) : null}

        <div className="container-page max-w-3xl py-14 md:py-20">
          <Markdown content={post.content} />

          {tags.length > 0 ? (
            <ul className="mt-12 flex flex-wrap gap-2">
              {tags.map((tag) => (
                <li
                  key={tag.slug}
                  className="rounded-full border border-border px-3 py-1.5 text-xs text-muted-foreground"
                >
                  #{tag.name}
                </li>
              ))}
            </ul>
          ) : null}

          <div className="mt-12 glass-panel rounded-2xl p-7">
            <h2 className="font-display text-lg font-bold tracking-tight">Planning a production run?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Share your styles, quantities and target market. Our export team replies with fabric options, MOQ and a
              delivered price.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
              >
                Request a quote <ArrowRight className="size-4" />
              </Link>
              <a
                href={whatsappLink(GENERAL_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md border border-primary/40 px-5 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
              >
                <MessageCircle className="size-4" /> WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 ? (
        <section className="border-t border-border py-16 md:py-24">
          <div className="container-page">
            <h2 className="display-lg">More insights</h2>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {related.map((item) => (
                <Reveal key={item.id}>
                  <Link
                    to="/blog/$slug"
                    params={{ slug: item.slug }}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-colors hover:border-primary/40"
                  >
                    {item.cover_image_url ? (
                      <img
                        src={item.cover_image_url}
                        alt={item.title}
                        loading="lazy"
                        className="h-40 w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    ) : null}
                    <div className="p-6">
                      <p className="eyebrow">{item.blog_categories?.name ?? "Insight"}</p>
                      <h3 className="mt-3 font-display text-base font-bold tracking-tight">{item.title}</h3>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted-foreground">{item.excerpt}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <CtaSection />
    </>
  );
}
