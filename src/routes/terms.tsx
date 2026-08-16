import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageShell";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/terms")({
  head: () => ({
    links: [{ rel: "canonical", href: canonical("/terms") }],
    meta: [
      { property: "og:url", content: canonical("/terms") },
      { title: "Terms & Conditions | Rare Signs Apparel" },
      {
        name: "description",
        content:
          "Terms governing quotations, samples, production, payment, shipping and claims for orders placed with Rare Signs Apparel.",
      },
      { property: "og:title", content: "Terms & Conditions | Rare Signs Apparel" },
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
    title: "Order quantities",
    body: "Order quantities are agreed per product at quotation stage. Mixed sizes are included within an order; additional colourways may be quoted separately.",
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
        description="These terms apply to quotations, samples and export orders placed with Rare Signs Apparel unless superseded by a signed supply agreement."
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
