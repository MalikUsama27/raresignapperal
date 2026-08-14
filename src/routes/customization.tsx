import { createFileRoute } from "@tanstack/react-router";
import { CtaSection, PageHero } from "@/components/site/PageShell";
import { Reveal, SectionHeading } from "@/components/site/Reveal";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/customization")({
  head: () => ({
    links: [{ rel: "canonical", href: canonical("/customization") }],
    meta: [
      { property: "og:url", content: canonical("/customization") },
      { title: "Custom Sportswear & Private Label Services | Rare Signs Apparel" },
      {
        name: "description",
        content:
          "Custom kit design, sublimation, embroidery, woven labels, hangtags and full private-label sportswear manufacturing from 50 pieces per design.",
      },
      { property: "og:title", content: "Customisation & Private Label | Rare Signs Apparel" },
      {
        property: "og:description",
        content: "Your colours, crest, sponsors, labels and packaging — manufactured to spec from 50 pieces.",
      },
    ],
  }),
  component: CustomizationPage,
});

const OPTIONS = [
  { title: "Kit design", body: "Send a sketch, a reference photo or a full tech pack. Our design team returns a mock-up in your colours within 48 hours." },
  { title: "Colour matching", body: "Pantone-referenced approvals and lab dips on request, so club colours stay identical across reorders." },
  { title: "Logos & sponsors", body: "Crests, sponsor blocks and federation badges applied by sublimation, embroidery, screen print or HTV." },
  { title: "Names & numbers", body: "Player names, squad numbers and captain marks included at no additional charge on teamwear orders." },
  { title: "Woven labels & tags", body: "Custom woven neck labels, care labels, neck tape and printed hangtags under your own brand." },
  { title: "Retail packaging", body: "Individual polybags, branded boxes, barcode stickers and size stickers for retail-ready delivery." },
];

const STEPS = [
  { step: "01", title: "Share your brief", body: "Product, quantity, colours, decoration and target delivery date." },
  { step: "02", title: "Receive mock-ups", body: "Digital mock-ups plus a costed spec sheet with MOQ and lead time." },
  { step: "03", title: "Approve a sample", body: "Physical pre-production sample couriered for fit and colour approval." },
  { step: "04", title: "Bulk & ship", body: "Production, QC report, then air or sea freight with full export documents." },
];

function CustomizationPage() {
  return (
    <>
      <PageHero
        eyebrow="Customisation"
        title="Your brand, built into every garment"
        description="Nothing in our catalogue ships generic. Every order is cut, printed and labelled to your specification — from a 50-piece club kit to a full private-label retail range."
      />

      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page">
          <SectionHeading eyebrow="What you can customise" title="Complete control over the finished garment" />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {OPTIONS.map((option, index) => (
              <Reveal key={option.title} delay={index * 0.04} className="h-full">
                <div className="h-full rounded-2xl border border-border bg-surface p-7">
                  <h2 className="font-display text-base font-semibold">{option.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{option.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-20 md:py-28">
        <div className="container-page grid gap-14 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionHeading
              eyebrow="How it works"
              title="Four steps from brief to delivery"
              description="Most clients approve a design in two rounds. Keep artwork in vector where possible — it prints sharper and speeds up approval."
            />
            <img
              src="/images/cat-teamwear.jpg"
              alt="Custom sublimated team kits produced by Rare Signs Apparel"
              width={1200}
              height={900}
              loading="lazy"
              className="mt-10 aspect-4/3 w-full rounded-2xl border border-border object-cover"
            />
          </div>
          <ol className="space-y-4">
            {STEPS.map((item, index) => (
              <Reveal key={item.step} delay={index * 0.05}>
                <li className="flex gap-5 rounded-2xl border border-border bg-background p-6">
                  <span className="font-display text-sm font-bold tracking-[0.18em] text-primary">{item.step}</span>
                  <div>
                    <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                  </div>
                </li>
              </Reveal>
            ))}
            <li className="rounded-2xl border border-border bg-background p-6">
              <h3 className="font-display text-base font-semibold">Artwork guidelines</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
                <li>Vector files preferred: AI, EPS, PDF or SVG.</li>
                <li>Raster artwork at 300 DPI minimum, actual print size.</li>
                <li>Provide Pantone codes for exact colour matching.</li>
                <li>Include a size breakdown per design and per colourway.</li>
              </ul>
            </li>
          </ol>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
