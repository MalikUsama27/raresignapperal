import { createFileRoute } from "@tanstack/react-router";
import { CtaSection, PageHero } from "@/components/site/PageShell";
import { Reveal, SectionHeading } from "@/components/site/Reveal";

export const Route = createFileRoute("/manufacturing")({
  head: () => ({
    meta: [
      { title: "Manufacturing Process | Sportswear Production | Rare Signs Apparel" },
      {
        name: "description",
        content:
          "See how Rare Signs Apparel manufactures custom apparel: tech pack development, fabric selection, cutting, sublimation, embroidery, stitching, AQL quality control and export packing.",
      },
      { property: "og:title", content: "Sportswear Manufacturing Process | Rare Signs Apparel" },
      {
        property: "og:description",
        content: "Eight controlled production stages, all in house, from tech pack to export carton.",
      },
    ],
  }),
  component: ManufacturingPage,
});

const STAGES = [
  { step: "01", title: "Design & tech pack", body: "We work from your artwork, sketch or reference garment and return graded spec sheets with measurement tables, placement maps and Pantone references for approval." },
  { step: "02", title: "Fabric selection", body: "Performance knits, interlock, mesh, fleece and technical shells sourced to your target GSM, stretch and hand-feel. Intake testing covers shrinkage and colour fastness." },
  { step: "03", title: "Cutting", body: "Automated marker planning maximises yield while keeping panel geometry consistent across every size in the range." },
  { step: "04", title: "Printing & embroidery", body: "Full-garment sublimation, screen print, heat transfer vinyl and 12-head embroidery, all in house so colour and registration stay under our control." },
  { step: "05", title: "Stitching", body: "Dedicated lines per product family, flatlock and double-needle construction, bar-tacked stress points and taped seams where the spec calls for it." },
  { step: "06", title: "Quality control", body: "Three in-line inspection gates plus a final AQL 2.5 audit. Measurements, print alignment and trims are checked against the approved sample." },
  { step: "07", title: "Packaging", body: "Individual polybags, size and player-name labelling, custom hangtags and branded master cartons ready for retail or club distribution." },
  { step: "08", title: "Global shipping", body: "Invoice, packing list, certificate of origin and freight booking prepared in house. Air freight for urgent seasons, sea for volume programmes." },
];

const CAPABILITIES = [
  { title: "Sublimation printing", body: "Unlimited colours, full-bleed graphics, no cracking or peeling over the garment life." },
  { title: "Embroidery", body: "12-head machines for crests, sponsor logos and 3D puff, up to 15 thread colours per design." },
  { title: "Screen printing", body: "Plastisol and water-based inks for high-opacity numbers, names and block graphics." },
  { title: "Cut & sew", body: "Panelled construction from your pattern or ours, with graded sizing from youth to 5XL." },
  { title: "Heat transfer", body: "Names, numbers and league badges applied to spec with durable adhesive films." },
  { title: "Private label", body: "Woven labels, neck tape, care labels, hangtags and packaging under your own brand." },
];

function ManufacturingPage() {
  return (
    <>
      <PageHero
        eyebrow="Manufacturing"
        title="Eight controlled stages, all under one roof"
        description="Nothing critical is subcontracted out of sight. Cutting, decoration, stitching, inspection and packing happen on our floor, which is why we can commit to dates and hold colour across reorders."
      />

      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page">
          <img
            src="/images/manufacturing.jpg"
            alt="Sportswear production lines at Rare Signs Apparel"
            width={1920}
            height={1080}
            loading="lazy"
            className="aspect-16/9 w-full rounded-2xl border border-border object-cover"
          />
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {STAGES.map((stage, index) => (
              <Reveal key={stage.step} delay={index * 0.03} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-7">
                  <p className="font-display text-xs font-semibold tracking-[0.22em] text-primary">{stage.step}</p>
                  <h2 className="mt-2 font-display text-lg font-semibold">{stage.title}</h2>
                  <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{stage.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 md:py-28">
        <div className="container-page">
          <SectionHeading
            eyebrow="Capabilities"
            title="Decoration and construction options"
            description="Mix techniques within one order — sublimated body, embroidered crest, printed sponsor and heat-pressed player names on the same garment."
          />
          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {CAPABILITIES.map((item) => (
              <div key={item.title} className="bg-background p-6">
                <h3 className="font-display text-base font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page grid gap-10 lg:grid-cols-3">
          {[
            { label: "Sampling", value: "7-10 days", body: "Pre-production sample with your artwork, couriered for approval." },
            { label: "Bulk production", value: "20-35 days", body: "After sample approval and deposit, depending on quantity and decoration." },
            { label: "Quality gate", value: "AQL 2.5", body: "Final audit with photographic report per carton before shipment." },
          ].map((item) => (
            <Reveal key={item.label} className="h-full">
              <div className="h-full rounded-2xl border border-border bg-surface p-7">
                <p className="text-[11px] uppercase tracking-[0.16em] text-muted-foreground">{item.label}</p>
                <p className="mt-2 font-display text-2xl font-bold text-primary">{item.value}</p>
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
