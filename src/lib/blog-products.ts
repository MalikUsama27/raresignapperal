// Blog slug -> product pages to feature under the article (internal links for SEO).
export type FeaturedProduct = { slug: string; label: string };

const HOODIES: [FeaturedProduct, FeaturedProduct, FeaturedProduct] = [
  { slug: "pullover-hoodies-elite", label: "Custom heavyweight pullover hoodies" },
  { slug: "full-zip-hoodie-elite", label: "Full zip fleece hoodies manufacturer" },
  { slug: "quarter-zip-hoodie-prime", label: "Quarter zip team hoodies" },
];
const TRACKSUITS: [FeaturedProduct, FeaturedProduct] = [
  { slug: "tracksuits-prime", label: "Custom team tracksuits manufacturer" },
  { slug: "street-tracksuits-elite", label: "Wholesale street tracksuits" },
];
const BASKETBALL: [FeaturedProduct, FeaturedProduct] = [
  { slug: "basketball-uniforms-elite", label: "Sublimated basketball uniforms supplier" },
  { slug: "basketball-uniforms-academy", label: "Youth & academy basketball kits" },
];

const MAP: Record<string, FeaturedProduct[]> = {
  "gsm-guide-hoodies-fleece-activewear": [...HOODIES, TRACKSUITS[0]],
  "how-to-order-custom-team-uniforms-in-bulk": [...BASKETBALL, TRACKSUITS[0]],
  "sublimation-vs-screen-printing-sportswear": [BASKETBALL[0], HOODIES[0], TRACKSUITS[0]],
  "how-to-choose-right-fabric-custom-sportswear": [HOODIES[0], TRACKSUITS[0], BASKETBALL[0]],
  "how-to-choose-fabric-for-team-uniforms": [...BASKETBALL, TRACKSUITS[0]],
  "wholesale-sportswear-sourcing-guide-for-retailers": [HOODIES[0], TRACKSUITS[1], BASKETBALL[0]],
  "private-label-sportswear-manufacturing-partner": [HOODIES[0], HOODIES[1], TRACKSUITS[1]],
  "private-label-sportswear-launch-checklist": [HOODIES[0], TRACKSUITS[1], HOODIES[2]],
  "how-to-choose-a-sportswear-manufacturer": [HOODIES[0], TRACKSUITS[0], BASKETBALL[0]],
  "exporting-custom-teamwear-worldwide": [BASKETBALL[0], TRACKSUITS[0], HOODIES[0]],
  "sportswear-export-guide-compliance-documents": [HOODIES[0], TRACKSUITS[0], BASKETBALL[0]],
  "custom-basketball-uniforms-bulk-guide": [...BASKETBALL, TRACKSUITS[0]],
  "winter-hoodies-tracksuits-wholesale-guide": [...HOODIES, ...TRACKSUITS],
};

const DEFAULT = [HOODIES[0], TRACKSUITS[0], BASKETBALL[0]];

export function featuredProductsFor(blogSlug: string): FeaturedProduct[] {
  return MAP[blogSlug] ?? DEFAULT;
}
