export type B2BContent = {
  specs: [string, string][];
  faqs: { q: string; a: string }[];
  /** Country export page slugs most relevant to this product type. */
  markets?: string[];
};

const HOODIE: B2BContent = {
  markets: ["usa", "uk", "europe", "australia"],
  specs: [
    ["Fabric & GSM", "320–380 GSM heavyweight fleece, 80% combed cotton / 20% polyester, anti-pilling, brushed back interior"],
    ["Decoration", "3D puff screen print, high-density embroidery, chenille patches, DTG, vintage acid wash"],
    ["Turnaround", "Sample in 7 days (DHL/FedEx door delivery) · Bulk production in 18–25 days"],
    ["Private label", "Woven neck labels, satin care labels, branded drawstrings with metal aglets, barcode stickers, printed polybags"],
    ["Sizing", "US & European size charts, custom size patterns on request"],
  ],
  faqs: [
    { q: "What is the recommended GSM for winter wholesale hoodies?", a: "320–380 GSM heavyweight fleece gives a premium structure, warmth and retail durability." },
    { q: "Can you match our Pantone colour and custom size chart?", a: "Yes. Lab dips match your Pantone shade and we follow your US/EU size chart." },
    { q: "Do you provide a pre-production sample before the bulk run?", a: "Yes. A physical sample is shipped for your approval before full production begins." },
  ],
};

const TRACKSUIT: B2BContent = {
  markets: ["uk", "europe", "australia"],
  specs: [
    ["Fabric & GSM", "280–320 GSM poly-cotton interlock, French terry or micro-poly tricot; moisture-wicking and thermal comfort"],
    ["Features", "YKK full-front zip, zippered side pockets, ribbed cuffs and waistband, reinforced drawcord"],
    ["Turnaround", "Sample in 7 days · Bulk delivery in 20–25 days"],
    ["Private label", "Embossed zip pulls, woven brand tags, silicone chest patches, custom hang tags"],
    ["Sizing", "US & European size charts; jackets and pants can be ordered in different size splits"],
  ],
  faqs: [
    { q: "Which fabric is best for athletic vs casual tracksuits?", a: "Poly-spandex tricot suits athletic warm-ups; heavy cotton-poly French terry suits premium streetwear." },
    { q: "Can jackets and pants be ordered in different sizes?", a: "Yes. Custom size assortments, such as a medium jacket with a large pant, are supported." },
    { q: "Can we send our own tech pack?", a: "Yes. We accept tech packs and mockups in PDF, AI or PSD format." },
  ],
};

const BASKETBALL: B2BContent = {
  markets: ["usa", "australia"],
  specs: [
    ["Fabric & GSM", "180–220 GSM 100% polyester micro-interlock or birdseye mesh, quick-dry with anti-odour finish"],
    ["Decoration", "All-over digital sublimation (fade-proof, no cracking), tackle twill lettering, screen-printed numbers"],
    ["Turnaround", "Team sample in 5–7 days · Full team orders in 12–18 days"],
    ["Private label", "Custom jock tags at the hem, woven league tags, size print inside the neck"],
    ["Sizing", "Youth to adult US & European sizes, men's and women's cuts"],
  ],
  faqs: [
    { q: "Will sublimated colours fade after washing?", a: "No. Sublimation infuses the ink into the polyester fibres, so colours do not peel or fade." },
    { q: "Can we send a roster of names and numbers?", a: "Yes. Share a spreadsheet with sizes, player names and numbers and we personalise every uniform." },
    { q: "Do you supply matching shorts and warm-ups?", a: "Yes. Jerseys, shorts, shooting shirts and warm-up sets can be made in one matching team order." },
  ],
};

const SOCCER: B2BContent = {
  markets: ["uk", "europe", "australia"],
  specs: [
    ["Fabric & GSM", "140–180 GSM 100% polyester interlock or eyelet mesh, breathable and quick-dry"],
    ["Decoration", "Full sublimation, heat-transfer names and numbers, embroidered or silicone crests, sponsor logos"],
    ["Turnaround", "Kit sample in 5–7 days · Full club orders in 12–18 days"],
    ["Private label", "Custom neck tape, woven club tags, printed size labels, individual polybags per player"],
    ["Sizing", "Kids to adult UK, EU and US sizes, men's and women's cuts"],
  ],
  faqs: [
    { q: "Can you make matching shirts, shorts and socks?", a: "Yes. Full kits including shirts, shorts, socks and goalkeeper sets are made in one order." },
    { q: "Can you add sponsor logos and player names?", a: "Yes. Sponsors, crests, names and numbers can be sublimated or heat-applied on every kit." },
    { q: "Do you make training wear to match the match kit?", a: "Yes. Training tops, quarter zips and tracksuits can follow the same club design." },
  ],
};

const AMERICAN_FOOTBALL: B2BContent = {
  markets: ["usa"],
  specs: [
    ["Fabric & GSM", "Pro-cut 200–240 GSM polyester mesh body with stretch spandex side panels; 4-way stretch pants"],
    ["Decoration", "Sublimation, tackle twill numbers, screen print, embroidered patches"],
    ["Turnaround", "Sample in 7 days · Full team orders in 15–20 days"],
    ["Private label", "Custom jock tags, woven labels, printed neck size labels"],
    ["Sizing", "US youth and adult sizes, cut to fit over shoulder pads"],
  ],
  faqs: [
    { q: "Are jerseys cut to fit over shoulder pads?", a: "Yes. Patterns are built with room for pads, and you can choose a tight pro cut or a looser practice cut." },
    { q: "Can you make game pants and practice jerseys too?", a: "Yes. Game pants, practice jerseys and reversibles can be ordered with the game uniform." },
    { q: "How are numbers applied?", a: "Choose sublimated numbers for light weight or tackle twill for a classic stitched look." },
  ],
};

const ICE_HOCKEY: B2BContent = {
  markets: ["usa", "europe"],
  specs: [
    ["Fabric & GSM", "220–260 GSM durable polyester knit with mesh underarm vents; fight strap available"],
    ["Decoration", "Full sublimation, tackle twill crests, embroidered shoulder patches, names and numbers"],
    ["Turnaround", "Sample in 7 days · Full team orders in 15–20 days"],
    ["Private label", "Woven tags, custom lace-up necks, printed size labels"],
    ["Sizing", "Youth to adult goalie-cut and player-cut sizes"],
  ],
  faqs: [
    { q: "Do you make goalie-cut jerseys?", a: "Yes. Goalie-cut jerseys are made with extra room in the chest and arms." },
    { q: "Can you add a fight strap and lace-up neck?", a: "Yes. Both can be added to any style on request." },
    { q: "Do you make matching hockey socks?", a: "Yes. Knitted or sublimated socks can be made to match the jersey design." },
  ],
};

const GENERAL: B2BContent = {
  markets: ["usa", "uk", "europe", "australia"],
  specs: [
    ["Fabric & GSM", "Chosen per style: performance polyester, poly-cotton blends or cotton fleece, with GSM matched to the use"],
    ["Decoration", "Sublimation, screen print, embroidery, heat transfer, woven and silicone patches"],
    ["Turnaround", "Sample in 7 days · Bulk production in 15–25 days"],
    ["Private label", "Woven labels, hang tags, printed neck labels, branded polybags"],
    ["Sizing", "US, UK, EU and AU size charts, or your own spec sheet"],
  ],
  faqs: [
    { q: "Can you make this style with our logo and colours?", a: "Yes. Share your logo and Pantone colours and we prepare a digital mockup before sampling." },
    { q: "Do you send a sample before bulk production?", a: "Yes. A physical sample is shipped for approval before the full order starts." },
    { q: "Do you ship worldwide?", a: "Yes. We ship by air or sea with DDP, FOB, CIF or EXW terms." },
  ],
};

/** Returns factory spec sheet + buyer FAQs for seasonal products, matched by name/category. */
export function b2bContentFor(...names: (string | null | undefined)[]): B2BContent | null {
  const text = names.filter(Boolean).join(" ").toLowerCase();
  if (/basketball/.test(text)) return BASKETBALL;
  if (/tracksuit|track suit|jogging suit/.test(text)) return TRACKSUIT;
  if (/hoodie|hoody|sweatshirt/.test(text)) return HOODIE;
  if (/american football/.test(text)) return AMERICAN_FOOTBALL;
  if (/hockey/.test(text)) return ICE_HOCKEY;
  if (/soccer|football/.test(text)) return SOCCER;
  return GENERAL;
}
