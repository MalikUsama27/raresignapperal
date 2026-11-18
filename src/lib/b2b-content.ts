export type B2BContent = {
  specs: [string, string][];
  faqs: { q: string; a: string }[];
};

const HOODIE: B2BContent = {
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

/** Returns factory spec sheet + buyer FAQs for seasonal products, matched by name/category. */
export function b2bContentFor(...names: (string | null | undefined)[]): B2BContent | null {
  const text = names.filter(Boolean).join(" ").toLowerCase();
  if (/basketball/.test(text)) return BASKETBALL;
  if (/tracksuit|track suit|jogging suit/.test(text)) return TRACKSUIT;
  if (/hoodie|hoody|sweatshirt/.test(text)) return HOODIE;
  return null;
}
