import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Award, Building2, Eye, Target, Users } from "lucide-react";
import { siteSettingsQuery } from "@/lib/queries";
import { CtaSection, PageHero } from "@/components/site/PageShell";
import { Reveal, SectionHeading } from "@/components/site/Reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Rare Signs Apparel | Sportswear Manufacturer in Sialkot" },
      {
        name: "description",
        content:
          "Rare Signs Apparel is a Sialkot-based sportswear manufacturer and exporter supplying clubs, brands and distributors in 40+ countries with custom teamwear and fitness apparel.",
      },
      { property: "og:title", content: "About Rare Signs Apparel | Manufacturer & Exporter" },
      {
        property: "og:description",
        content: "Our story, capacity, certifications and the sourcing teams we supply worldwide.",
      },
    ],
  }),
  component: AboutPage,
});

const MILESTONES = [
  { year: "2009", title: "Founded in Sialkot", body: "Started as a 14-machine stitching unit producing club kits for regional leagues." },
  { year: "2013", title: "First export programme", body: "Began direct shipments to distributors in the United Kingdom and Germany." },
  { year: "2016", title: "In-house sublimation", body: "Installed wide-format sublimation and heat-press lines to control print quality." },
  { year: "2019", title: "Compliance audits", body: "Passed social and technical audits required by European retail buyers." },
  { year: "2022", title: "Capacity expansion", body: "Added dedicated fitness and outerwear lines, tripling monthly output." },
  { year: "Today", title: "40+ markets", body: "Supplying clubs, federations, gym brands and corporate buyers on five continents." },
];

const VALUES = [
  { icon: Target, title: "Mission", body: "Give clubs and brands of any size access to manufacturing quality normally reserved for large accounts." },
  { icon: Eye, title: "Vision", body: "Be the most dependable custom sportswear partner between South Asia and Western markets." },
  { icon: Award, title: "Standards", body: "Consistent GSM, colour-fast prints and reinforced construction verified before every shipment." },
];

function AboutPage() {
  const { data: settings } = useSuspenseQuery(siteSettingsQuery());

  return (
    <>
      <PageHero
        eyebrow="About us"
        title="A manufacturing partner built around repeat orders"
        description={`Founded in ${settings["founded_year"]}, Rare Signs Apparel designs, manufactures and exports performance apparel from Sialkot, Pakistan — the same industrial cluster that supplies much of the world's professional sporting goods.`}
      />

      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Our story" title="From a 14-machine unit to a full export house" />
            <div className="mt-8 space-y-5 text-sm leading-relaxed text-muted-foreground md:text-base">
              <p>
                We began by stitching kits for local leagues where budgets were tight and expectations were high. That
                taught us the discipline that still defines the factory: hold the spec, hold the date, and never let a
                reorder drift from the approved sample.
              </p>
              <p>
                Today the same floor handles competition teamwear, technical fitness apparel, outerwear, travel wear
                and private-label programmes. Cutting, printing, embroidery, stitching and finishing all happen in
                house, so nothing disappears into an unmonitored subcontractor.
              </p>
              <p>
                Our clients are club managers ordering 60 shirts and distributors ordering 6,000. Both get the same
                spec sheets, the same inspection gates and the same photographic QC reporting before cartons close.
              </p>
            </div>
          </div>
          <Reveal>
            <img
              src="/images/manufacturing.jpg"
              alt="Rare Signs Apparel factory floor in Sialkot"
              width={1200}
              height={900}
              loading="lazy"
              className="aspect-4/3 w-full rounded-2xl border border-border object-cover"
            />
            <dl className="mt-6 grid grid-cols-2 gap-4">
              {[
                { label: "Units per month", value: Number(settings["units_per_month"] ?? 0).toLocaleString() },
                { label: "In-house team", value: String(settings["team_size"] ?? "") },
                { label: "Export markets", value: `${settings["countries_served"] ?? ""}+` },
                { label: "Sample lead time", value: "7-10 days" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-border bg-surface p-5">
                  <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{item.label}</dt>
                  <dd className="mt-1.5 font-display text-xl font-bold">{item.value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 md:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="What guides us" title="Mission, vision and standards" />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {VALUES.map((value, index) => (
              <Reveal key={value.title} delay={index * 0.05} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-background p-7">
                  <value.icon className="size-5 text-primary" />
                  <h3 className="mt-4 font-display text-lg font-semibold">{value.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading eyebrow="Timeline" title="Milestones that shaped the factory" />
          <ol className="relative space-y-6 border-l border-border pl-6">
            {MILESTONES.map((item, index) => (
              <Reveal key={item.year} delay={index * 0.04}>
                <li className="relative">
                  <span className="absolute -left-[31px] top-1.5 size-2.5 rounded-full bg-primary ring-4 ring-background" />
                  <p className="font-display text-xs font-semibold tracking-[0.2em] text-primary">{item.year}</p>
                  <h3 className="mt-1 font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 md:py-28">
        <div className="container-page grid gap-5 md:grid-cols-3">
          {[
            { icon: Building2, title: "Registered exporter", body: "Chamber-registered exporter with full documentation handled in house." },
            { icon: Users, title: "Compliant workplace", body: "Audited working conditions, fair wages and no child labour — verifiable on request." },
            { icon: Award, title: "Quality systems", body: "Documented AQL inspection, fabric intake testing and colour approval process." },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 0.05} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-background p-7">
                <item.icon className="size-5 text-primary" />
                <h3 className="mt-4 font-display text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <CtaSection />
    </>
  );
}
