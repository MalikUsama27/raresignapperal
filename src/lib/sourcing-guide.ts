import { b2bContentFor, type B2BContent } from "@/lib/b2b-content";

export type SourcingGuide = B2BContent & {
  intro: string[];
  guides: { slug: string; label: string }[];
};

const GUIDE_LABELS: Record<string, string> = {
  "custom-basketball-uniforms-bulk-guide": "Custom basketball uniforms bulk ordering guide",
  "winter-hoodies-tracksuits-wholesale-guide": "Winter hoodies & tracksuits wholesale guide",
  "gsm-guide-hoodies-fleece-activewear": "GSM guide for hoodies, fleece and activewear",
  "how-to-order-custom-team-uniforms-in-bulk": "How to order custom team uniforms in bulk",
  "sublimation-vs-screen-printing-sportswear": "Sublimation vs screen printing for sportswear",
  "how-to-choose-a-sportswear-manufacturer": "How to choose a sportswear manufacturer",
  "private-label-sportswear-launch-checklist": "Private label sportswear launch checklist",
};

function guidesFor(text: string): string[] {
  if (/basketball/.test(text)) return ["custom-basketball-uniforms-bulk-guide", "sublimation-vs-screen-printing-sportswear", "how-to-order-custom-team-uniforms-in-bulk"];
  if (/hoodie|hoody|sweatshirt|tracksuit|jogger|fleece|winter|casual/.test(text)) return ["winter-hoodies-tracksuits-wholesale-guide", "gsm-guide-hoodies-fleece-activewear", "private-label-sportswear-launch-checklist"];
  if (/uniform|team|soccer|football|hockey|sports/.test(text)) return ["how-to-order-custom-team-uniforms-in-bulk", "sublimation-vs-screen-printing-sportswear", "how-to-choose-a-sportswear-manufacturer"];
  return ["how-to-choose-a-sportswear-manufacturer", "private-label-sportswear-launch-checklist", "gsm-guide-hoodies-fleece-activewear"];
}

/** B2B sourcing guide for a category or sub-range page: intro copy, specs, FAQs, blog and market links. */
export function sourcingGuideFor(name: string, parent?: string | null): SourcingGuide {
  const text = `${name} ${parent ?? ""}`.toLowerCase();
  const base = b2bContentFor(name, parent) ?? { specs: [], faqs: [] };
  const lower = name.toLowerCase();
  const intro = [
    `Rare Signs Apparel manufactures custom ${lower} in Sialkot, Pakistan for sports teams, clubs, wholesalers and private label brands. Every order is cut, sewn, decorated and quality-checked in-house, so buyers work directly with the factory rather than a trading agent.`,
    `You can supply your own tech pack or start from one of our ${lower} base styles. We match Pantone colours, add your logos by embroidery, sublimation or screen print, and finish the range with woven labels, hang tags and branded packaging ready for retail or team distribution.`,
    `Before bulk production we send a digital mockup and a physical pre-production sample for approval. Finished ${lower} orders ship worldwide by air or sea, with export documentation prepared for buyers in the USA, UK, Europe and Australia.`,
  ];
  return {
    ...base,
    intro,
    guides: guidesFor(text).map((slug) => ({ slug, label: GUIDE_LABELS[slug] ?? slug })),
  };
}
