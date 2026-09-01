import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, BadgeCheck, Boxes, Factory, Globe2, Palette, ShieldCheck, Timer, Truck } from "lucide-react";
import { homeContentQuery, siteSettingsQuery } from "@/lib/queries";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { ProductCard } from "@/components/site/ProductCard";
import { WorldMap } from "@/components/site/WorldMap";
import { InquiryDialog } from "@/components/site/InquiryDialog";
import { CtaSection } from "@/components/site/PageShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { canonical, LOGO_URL, OG_IMAGE_URL, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(homeContentQuery());
  },
  head: () => ({
    links: [{ rel: "canonical", href: canonical("/") }],
    meta: [
      { property: "og:url", content: canonical("/") },
      { title: "Rare Signs Apparel | Custom Sportswear Manufacturer & Exporter" },
      {
        name: "description",
        content:
          "Custom sportswear, teamwear, fitness and private-label apparel manufactured in Sialkot and exported to 40+ countries. Fast shipping, full customisation, 20-35 day production.",
      },
      { property: "og:title", content: "Rare Signs Apparel | Custom Sportswear Manufacturer & Exporter" },
      {
        property: "og:description",
        content:
          "Premium sportswear manufacturing and export for clubs, brands and distributors worldwide. Request a quote in one business day.",
      },
      { property: "og:image", content: OG_IMAGE_URL },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Rare Signs Apparel — custom sportswear manufacturer" },
      { name: "twitter:image", content: OG_IMAGE_URL },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Rare Signs Apparel",
          url: SITE_URL,
          logo: { "@type": "ImageObject", url: LOGO_URL, width: 1920, height: 1370 },
          image: OG_IMAGE_URL,
          description:
            "Manufacturer and exporter of premium custom sportswear, teamwear and private-label apparel.",
          address: {
            "@type": "PostalAddress",
            streetAddress: "Small Industrial Estate",
            addressLocality: "Sialkot",
            postalCode: "51310",
            addressCountry: "PK",
          },
          telephone: "+92-333-7408106",
          email: "export@raresignsapparel.com",
        }),
      },
    ],
  }),
  component: Home,
});

const WHY = [
  { icon: BadgeCheck, title: "Premium quality", body: "Fabric intake testing, in-line checks and final AQL inspection on every order." },
  { icon: Palette, title: "Custom manufacturing", body: "Sublimation, embroidery, screen print and full cut-and-sew development from tech pack." },
  { icon: Globe2, title: "Global export", body: "Documentation, freight and delivery handled into 40+ markets by air and sea." },
  { icon: Boxes, title: "Flexible orders", body: "Mixed sizes, player names and numbers included at no extra cost on every order." },
  { icon: ShieldCheck, title: "Quality control", body: "Photographic QC reports shared per carton before shipment leaves the floor." },
  { icon: Timer, title: "Fast production", body: "Samples in 7-10 days, bulk in 20-35 days with weekly production updates." },
  { icon: Factory, title: "Custom branding", body: "Woven labels, hangtags, neck tape and retail-ready packaging under your brand." },
  { icon: Truck, title: "Reliable delivery", body: "On-time performance tracked per shipment, with consolidated freight options." },
];

const PROCESS = [
  { step: "01", title: "Design & tech pack", body: "Your artwork or our design team; graded spec sheets approved before cutting." },
  { step: "02", title: "Fabric selection", body: "Performance knits, fleece and technical shells sourced to your GSM and hand-feel." },
  { step: "03", title: "Cutting", body: "Automated marker planning and precision cutting for consistent panel geometry." },
  { step: "04", title: "Printing & embroidery", body: "Full sublimation, screen print, HTV and 12-head embroidery in-house." },
  { step: "05", title: "Stitching", body: "Dedicated lines per product family with double-needle reinforced construction." },
  { step: "06", title: "Quality control", body: "Three inspection gates plus a final AQL audit with photographic reporting." },
  { step: "07", title: "Packaging", body: "Individual polybags, player numbering, custom labelling and master cartons." },
  { step: "08", title: "Global shipping", body: "Export documentation, freight booking and door delivery where required." },
];

function Home() {
  const { data } = useSuspenseQuery(homeContentQuery());
  const { data: settings } = useSuspenseQuery(siteSettingsQuery());

  const stats = [
    { value: `${settings["countries_served"] ?? "40"}+`, label: "Export markets" },
    { value: `${Number(settings["units_per_month"] ?? 0).toLocaleString()}`, label: "Units per month" },
    { value: `${settings["team_size"] ?? "50+"}`, label: "In-house team" },
    { value: "10 Yrs", label: "Experience" },
  ];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero pt-28 pb-16 md:pt-36 md:pb-24">
        <img
          src="/images/hero.jpg"
          alt="Athletes wearing premium custom sportswear"
          width={1920}
          height={1080}
          className="pointer-events-none absolute inset-0 size-full object-cover opacity-35"
        />
        <div className="pointer-events-none absolute inset-0 bg-fade-bottom" />
        <div className="container-page relative grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <Reveal>
              <p className="eyebrow">Manufacturer &amp; exporter · Since {settings["founded_year"]}</p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display-xl mt-5 text-balance">
                Delivering premium sportswear <span className="text-gradient">worldwide</span>
              </h1>
            </Reveal>
            <Reveal delay={0.16}>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
                Rare Signs Apparel manufactures competition-grade teamwear, fitness apparel and private-label ranges for
                clubs, brands and distributors in {settings["countries_served"]}+ countries. Full customisation, low
                minimums, verified quality control.
              </p>
            </Reveal>
            <Reveal delay={0.24}>
              <div className="mt-9 flex flex-wrap gap-3">
                <InquiryDialog
                  trigger={
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
                    >
                      Request a quote <ArrowRight className="size-4" />
                    </button>
                  }
                />
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
                >
                  Explore products
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.32}>
              <dl className="mt-12 grid max-w-lg grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <dt className="font-display text-2xl font-bold tracking-tight text-foreground md:text-[1.75rem]">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>

          <Reveal delay={0.2}>
            <WorldMap countries={data.countries} />
            <div className="mt-4 flex flex-wrap gap-2">
              {data.countries.slice(0, 6).map((country) => (
                <span
                  key={country.id}
                  className="rounded-full border border-border bg-surface/70 px-3 py-1 text-xs text-muted-foreground"
                >
                  {country.name}
                </span>
              ))}
              <Link
                to="/export-markets"
                className="rounded-full border border-primary/40 px-3 py-1 text-xs font-medium text-primary"
              >
                All markets
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Categories */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Product range"
            title="Ten production lines, one factory floor"
            description="Every category is manufactured in-house, so a single order can span playing kit, training range, travel wear and staff apparel without splitting suppliers."
          >
            <Link
              to="/products"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              View all products <ArrowRight className="size-4" />
            </Link>
          </SectionHeading>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.categories.map((category, index) => (
              <Reveal key={category.id} delay={index * 0.04}>
                <Link
                  to="/category/$slug"
                  params={{ slug: category.slug }}
                  className="group relative flex h-full min-h-56 flex-col justify-end overflow-hidden rounded-2xl border border-border p-6 transition-all duration-500 hover:-translate-y-1 hover:border-primary/40"
                >
                  {category.image_url ? (
                    <img
                      src={category.image_url}
                      alt={category.name}
                      width={1200}
                      height={900}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-55"
                    />
                  ) : null}
                  <div className="absolute inset-0 bg-fade-bottom" />
                  <div className="relative">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
                      {category.tagline}
                    </p>
                    <h3 className="mt-2 font-display text-xl font-semibold">{category.name}</h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="border-t border-border bg-surface py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Featured styles"
            title="Best-selling export styles"
            description={`A selection from ${data.productCount}+ catalogue styles, all built to order in your colours and branding.`}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {data.featured.slice(0, 8).map((product, index) => (
              <Reveal key={product.id} delay={index * 0.04}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Why Rare Signs"
            title="Built for buyers who cannot afford surprises"
            description="Sourcing teams stay with us because the second order looks exactly like the approved sample — and the paperwork clears customs without chasing."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {WHY.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.03} className="h-full">
                <div className="h-full bg-background p-6 transition-colors duration-500 hover:bg-surface">
                  <item.icon className="size-5 text-primary" />
                  <h3 className="mt-4 font-display text-base font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing process */}
      <section className="border-t border-border bg-surface py-20 md:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              eyebrow="Manufacturing"
              title="Eight controlled stages from sketch to carton"
              description="Nothing is subcontracted out of sight. Every stage happens on our floor, which is why we can commit to dates and hold colour across reorders."
            />
            <img
              src="/images/manufacturing.jpg"
              alt="Rare Signs Apparel production floor with stitching lines"
              width={1200}
              height={900}
              loading="lazy"
              className="mt-10 aspect-4/3 w-full rounded-2xl border border-border object-cover"
            />
          </div>
          <ol className="relative space-y-5 border-l border-border pl-6">
            {PROCESS.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.04}>
                <li className="relative">
                  <span className="absolute -left-[31px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-surface" />
                  <p className="font-display text-xs font-semibold tracking-[0.2em] text-primary">{item.step}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Export markets */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Global reach"
            title="Shipping to clubs and brands on five continents"
            description="Consolidated sea freight for volume programmes, air freight for season-critical deliveries, and full export documentation prepared in-house."
          />
          <div className="mt-12 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
            <WorldMap countries={data.countries} />
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {["North America", "Europe", "Middle East", "Oceania"].map((region) => (
                <div key={region} className="rounded-xl border border-border bg-surface p-5">
                  <p className="font-display text-sm font-semibold">{region}</p>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                    {data.countries
                      .filter((country) => country.region === region)
                      .map((country) => country.name)
                      .join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="border-t border-border bg-surface py-20 md:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="Client voices" title="Trusted by sourcing teams and clubs" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {data.testimonials.map((testimonial, index) => (
              <Reveal key={testimonial.id} delay={index * 0.04} className="h-full">
                <figure className="flex h-full flex-col rounded-2xl border border-border bg-background p-6">
                  <blockquote className="text-sm leading-relaxed text-muted-foreground">
                    “{testimonial.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-border pt-4">
                    <p className="font-display text-sm font-semibold">{testimonial.author}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {testimonial.role}, {testimonial.company} · {testimonial.country}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="FAQ"
            title="Answers before you send the first email"
            description="Still unsure about something? Message our export team on WhatsApp for a direct answer."
          />
          <Accordion type="single" collapsible className="w-full">
            {data.faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-border">
                <AccordionTrigger className="text-left font-display text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
