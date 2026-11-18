export type CountryMarket = {
  slug: string;
  name: string;
  title: string;
  description: string;
  intro: string;
  sports: string[];
  shipping: { label: string; value: string }[];
  products: { slug: string; label: string }[];
  faqs: { q: string; a: string }[];
};

export const COUNTRY_MARKETS: CountryMarket[] = [
  {
    slug: "usa",
    name: "USA",
    title: "Custom Sportswear Manufacturer for USA Teams & Brands",
    description: "Custom basketball, American football and hockey uniforms made in Sialkot and shipped to the USA. US sizing, DDP delivery and private label for teams and wholesalers.",
    intro: "We make team uniforms, hoodies and tracksuits for American clubs, schools, leagues and private label brands, cut to US sizing and delivered to your door.",
    sports: ["Basketball", "American football", "Ice hockey", "Soccer", "Winter hoodies & tracksuits"],
    shipping: [
      { label: "Air freight", value: "About 5–8 days door to door" },
      { label: "Sea freight", value: "About 25–35 days to East or West Coast ports" },
      { label: "Incoterms", value: "DDP, FOB, CIF or EXW" },
      { label: "Sizing", value: "US youth and adult sizes (YS–4XL)" },
    ],
    products: [
      { slug: "basketball-uniforms-elite", label: "Custom basketball uniforms" },
      { slug: "american-football-uniforms-elite", label: "American football uniforms" },
      { slug: "ice-hockey-uniforms-elite", label: "Ice hockey jerseys" },
      { slug: "pullover-hoodies-elite", label: "Wholesale pullover hoodies" },
    ],
    faqs: [
      { q: "Do you ship custom uniforms DDP to the USA?", a: "Yes. We can ship DDP so duties and customs are handled before the goods reach you, or FOB/CIF if you use your own forwarder." },
      { q: "Do you use US sizing?", a: "Yes. We work from US youth and adult size charts and can follow your own spec sheet." },
      { q: "Can you make private label products for my US brand?", a: "Yes. We add your woven labels, hang tags, printed neck labels and polybags with your branding." },
    ],
  },
  {
    slug: "uk",
    name: "UK",
    title: "Teamwear & Football Kit Manufacturer for the UK",
    description: "Custom football kits, rugby shirts, hoodies and tracksuits made for UK clubs, schools and brands. UK sizing, DDP delivery and private label from Sialkot.",
    intro: "We supply UK football and rugby clubs, academies, schools and clothing brands with sublimated kits, training wear and winter essentials.",
    sports: ["Football", "Rugby", "Training wear", "Hoodies & tracksuits"],
    shipping: [
      { label: "Air freight", value: "About 5–7 days door to door" },
      { label: "Sea freight", value: "About 25–30 days to UK ports" },
      { label: "Incoterms", value: "DDP, FOB, CIF or EXW" },
      { label: "Sizing", value: "UK junior and adult sizes" },
    ],
    products: [
      { slug: "soccer-football-uniforms-elite", label: "Custom football kits" },
      { slug: "tracksuits-elite", label: "Club tracksuits" },
      { slug: "full-zip-hoodie-elite", label: "Full zip club hoodies" },
      { slug: "quarter-zip-hoodie-prime", label: "Quarter zip training tops" },
    ],
    faqs: [
      { q: "Can you deliver football kits DDP to the UK?", a: "Yes. We can ship with duties paid so your kits arrive without customs work on your side." },
      { q: "Do you add player names, numbers and sponsor logos?", a: "Yes. Names, numbers, crests and sponsor logos can be sublimated, printed or embroidered." },
      { q: "Can you match our club colours exactly?", a: "Yes. Send Pantone references and we confirm colours on a sample before bulk production." },
    ],
  },
  {
    slug: "europe",
    name: "Europe",
    title: "Custom Sportswear Manufacturer for European Clubs",
    description: "Football, handball and ice hockey uniforms, hoodies and tracksuits made for clubs and brands in Germany, France, Netherlands and across Europe. EU sizing and DDP delivery.",
    intro: "We work with clubs, federations, distributors and brands across Germany, France, the Netherlands, Scandinavia and the rest of the EU.",
    sports: ["Football", "Handball", "Ice hockey", "Basketball", "Winter teamwear"],
    shipping: [
      { label: "Air freight", value: "About 5–8 days door to door" },
      { label: "Sea freight", value: "About 25–35 days to Hamburg, Rotterdam or Antwerp" },
      { label: "Incoterms", value: "DDP, FOB, CIF or EXW" },
      { label: "Sizing", value: "EU sizing or your own size chart" },
    ],
    products: [
      { slug: "soccer-football-uniforms-prime", label: "Custom football uniforms" },
      { slug: "ice-hockey-uniforms-prime", label: "Ice hockey jerseys" },
      { slug: "basketball-uniforms-prime", label: "Basketball uniforms" },
      { slug: "tracksuits-prime", label: "Team tracksuits" },
    ],
    faqs: [
      { q: "Which European countries do you ship to?", a: "All EU countries, plus Switzerland and Norway, by air or sea." },
      { q: "Can you ship with duties paid to the EU?", a: "Yes. DDP is available, or we can ship FOB/CIF to your forwarder." },
      { q: "Do you work with distributors and brands, not just clubs?", a: "Yes. We make private label lines for distributors and retail brands." },
    ],
  },
  {
    slug: "australia",
    name: "Australia",
    title: "Custom Teamwear Manufacturer for Australia & NZ",
    description: "Custom basketball, football and club teamwear, hoodies and tracksuits for Australian and New Zealand clubs, schools and brands. AU sizing and DDP delivery from Sialkot.",
    intro: "We make club uniforms, school sportswear and branded hoodies and tracksuits for teams and brands across Australia and New Zealand.",
    sports: ["Basketball", "Football", "Rugby", "Club training wear", "Hoodies & tracksuits"],
    shipping: [
      { label: "Air freight", value: "About 6–9 days door to door" },
      { label: "Sea freight", value: "About 25–35 days to Sydney, Melbourne or Brisbane" },
      { label: "Incoterms", value: "DDP, FOB, CIF or EXW" },
      { label: "Sizing", value: "AU kids and adult sizes" },
    ],
    products: [
      { slug: "basketball-uniforms-academy", label: "Club basketball uniforms" },
      { slug: "soccer-football-uniforms-academy", label: "Football uniforms" },
      { slug: "pullover-hoodies-prime", label: "School and club hoodies" },
      { slug: "tracksuits-standard", label: "Team tracksuits" },
    ],
    faqs: [
      { q: "Do you ship to Australia and New Zealand?", a: "Yes, by air or sea, with DDP delivery available to both countries." },
      { q: "Can you make school sports uniforms?", a: "Yes. We make sports polos, shorts, hoodies and tracksuits in school colours with embroidered crests." },
      { q: "Do you follow Australian sizing?", a: "Yes. We use AU kids and adult size charts or your own measurements." },
    ],
  },
];

export function countryMarket(slug: string) {
  return COUNTRY_MARKETS.find((m) => m.slug === slug.toLowerCase());
}
