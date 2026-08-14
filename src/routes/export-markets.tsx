import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { exportCountriesQuery } from "@/lib/queries";
import { CtaSection, PageHero } from "@/components/site/PageShell";
import { WorldMap } from "@/components/site/WorldMap";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/export-markets")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(exportCountriesQuery());
  },
  head: () => ({
    links: [{ rel: "canonical", href: canonical("/export-markets") }],
    meta: [
      { property: "og:url", content: canonical("/export-markets") },
      { title: "Export Markets | Global Sportswear Shipping | Rare Signs Apparel" },
      {
        name: "description",
        content:
          "Rare Signs Apparel exports custom apparel to 40+ countries across North America, Europe, the Middle East and Oceania with full documentation and air or sea freight.",
      },
      { property: "og:title", content: "Global Export Markets | Rare Signs Apparel" },
      {
        property: "og:description",
        content: "Shipping custom sportswear to clubs, brands and distributors on five continents.",
      },
    ],
  }),
  component: ExportMarketsPage,
});

const LOGISTICS = [
  { title: "Air freight", body: "5-8 days door to door for season-critical deliveries and sample shipments." },
  { title: "Sea freight", body: "Consolidated LCL or full container for volume programmes at lowest landed cost." },
  { title: "Documentation", body: "Commercial invoice, packing list, certificate of origin and GSP forms prepared in house." },
  { title: "Incoterms", body: "EXW, FOB, CIF and DDP available depending on your customs preference." },
];

function ExportMarketsPage() {
  const { data: countries } = useSuspenseQuery(exportCountriesQuery());
  const regions = Array.from(new Set(countries.map((country) => country.region)));

  return (
    <>
      <PageHero
        eyebrow="Global reach"
        title="Exporting to clubs and brands on five continents"
        description="We ship from Sialkot to distributors, clubs, federations and retail brands worldwide. Documentation, freight booking and delivery are handled by our own export desk."
      />

      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page">
          <WorldMap countries={countries} />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {regions.map((region, index) => (
              <Reveal key={region} delay={index * 0.05} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-7">
                  <h2 className="font-display text-lg font-semibold">{region}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {countries
                      .filter((country) => country.region === region)
                      .map((country) => (
                        <span
                          key={country.id}
                          className="rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground"
                        >
                          {country.name}
                        </span>
                      ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Logistics"
            title="Freight and paperwork handled for you"
            description="Tell us your port or door address and preferred incoterm — we quote landed cost so there are no surprises at customs."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {LOGISTICS.map((item) => (
              <div key={item.title} className="bg-background p-6">
                <h3 className="font-display text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
