import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CtaSection, PageHero } from "@/components/site/PageShell";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { countryMarket } from "@/lib/country-markets";
import { breadcrumbSchema } from "@/lib/seo";
import { canonical, COMPANY_NAME, OG_IMAGE_URL } from "@/lib/site";

export const Route = createFileRoute("/export-markets_/$country")({
  loader: ({ params }) => {
    const market = countryMarket(params.country);
    if (!market) throw notFound();
    return market;
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: `Export Markets | ${COMPANY_NAME}` }, { name: "robots", content: "noindex" }] };
    const path = `/export-markets/${params.country.toLowerCase()}`;
    return {
      links: [{ rel: "canonical", href: canonical(path) }],
      meta: [
        { title: loaderData.title },
        { name: "description", content: loaderData.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonical(path) },
        { property: "og:title", content: loaderData.title },
        { property: "og:description", content: loaderData.description },
        { property: "og:image", content: OG_IMAGE_URL },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "Export Markets", path: "/export-markets" },
              { name: loaderData.name, path },
            ]),
          ),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            name: loaderData.title,
            description: loaderData.description,
            provider: { "@type": "Organization", name: COMPANY_NAME },
            areaServed: loaderData.name,
          }),
        },
      ],
    };
  },
  notFoundComponent: () => (
    <div className="container-page py-32 text-center">
      <h1 className="font-display text-3xl font-semibold">Market not found</h1>
      <Link to="/export-markets" className="mt-6 inline-block text-primary">See all export markets</Link>
    </div>
  ),
  component: CountryPage,
});

function CountryPage() {
  const m = Route.useLoaderData();
  return (
    <>
      <PageHero eyebrow={`Exporting to ${m.name}`} title={m.title} description={m.intro} />

      <section className="border-t border-border py-20">
        <div className="container-page grid gap-10 lg:grid-cols-2">
          <Reveal>
            <h2 className="font-display text-2xl font-semibold">What we make for {m.name} buyers</h2>
            <div className="mt-6 flex flex-wrap gap-2">
              {m.sports.map((s) => (
                <span key={s} className="rounded-full border border-border bg-surface px-4 py-2 text-sm">{s}</span>
              ))}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="font-display text-2xl font-semibold">Shipping to {m.name}</h2>
            <dl className="mt-6 divide-y divide-border rounded-2xl border border-border bg-surface">
              {m.shipping.map((row) => (
                <div key={row.label} className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-5 py-4 text-sm">
                  <dt className="min-w-0 text-muted-foreground">{row.label}</dt>
                  <dd className="text-right font-medium">{row.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Popular styles" title={`Best sellers for ${m.name}`} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {m.products.map((p) => (
              <Link
                key={p.slug}
                to="/products/$slug"
                params={{ slug: p.slug }}
                className="group flex items-center justify-between gap-3 rounded-2xl border border-border bg-surface p-5 transition-colors hover:border-primary/50"
              >
                <span className="min-w-0 font-medium">{p.label}</span>
                <ArrowRight className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20">
        <div className="container-page max-w-3xl">
          <SectionHeading eyebrow="Buyer questions" title={`Ordering from ${m.name}`} />
          <div className="mt-8 space-y-3">
            {m.faqs.map((f) => (
              <details key={f.q} className="rounded-2xl border border-border bg-surface p-5">
                <summary className="cursor-pointer font-medium">{f.q}</summary>
                <p className="mt-3 text-sm text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
