import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | Axiom Sportswear" },
      {
        name: "description",
        content:
          "Terms governing quotations, samples, minimum order quantities, production, payment, shipping and claims for orders placed with Axiom Sportswear.",
      },
      { property: "og:title", content: "Terms & Conditions | Axiom Sportswear" },
      { property: "og:description", content: "Quotation, production, payment and shipping terms for export orders." },
    ],
  }),
  component: TermsPage,
});

const SECTIONS = [
  {
    title: "Quotations",
    body: "Quotations are indicative until a specification sheet is confirmed in writing. Prices depend on quantity, fabric, decoration method and incoterm, and remain valid for 30 days unless stated otherwise.",
  },
  {
    title: "Samples",
    body: "Pre-production samples are chargeable and typically ready in 7-10 working days. Sample charges may be credited against a confirmed bulk order at our discretion.",
  },
  {
    title: "Minimum order quantities",
    body: "MOQs are stated per product and generally start at 50 pieces per design. Mixed sizes are included within an MOQ; additional colourways may carry their own minimum.",
  },
  {
    title: "Production & lead times",
    body: "Bulk production begins after written sample approval and receipt of the agreed deposit. Standard lead time is 20-35 days, subject to quantity, decoration and material availability.",
  },
  {
    title: "Payment terms",
    body: "Standard terms are an advance deposit with the balance before shipment. Bank transfer and letter of credit are accepted. Bank charges are borne by the remitter.",
  },
  {
    title: "Shipping & risk",
    body: "Risk transfers according to the agreed incoterm. Transit times quoted by carriers are estimates; we are not liable for carrier or customs delays outside our control.",
  },
  {
    title: "Quality claims",
    body: "Claims for manufacturing defects must be raised within 14 days of delivery with photographic evidence and affected quantities. Verified defects are remade or credited.",
  },
  {
    title: "Intellectual property",
    body: "You confirm you hold the rights to any logo, crest or artwork supplied. We do not reuse client artwork for other customers or in marketing without written permission.",
  },
];

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms & conditions"
        description="These terms apply to quotations, samples and export orders placed with Axiom Sportswear unless superseded by a signed supply agreement."
      />
      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page max-w-3xl space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-lg font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
