CREATE TABLE public.blog_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  excerpt text,
  content text NOT NULL DEFAULT '',
  cover_image_url text,
  author text NOT NULL DEFAULT 'Rare Signs Apparel',
  category_id uuid REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  read_minutes integer NOT NULL DEFAULT 5,
  seo_title text,
  seo_description text,
  keywords text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.blog_post_tags (
  post_id uuid NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id uuid NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

CREATE INDEX blog_posts_published_idx ON public.blog_posts (is_published, published_at DESC);
CREATE INDEX blog_posts_category_idx ON public.blog_posts (category_id);

GRANT SELECT ON public.blog_categories TO anon, authenticated;
GRANT SELECT ON public.blog_tags TO anon, authenticated;
GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT SELECT ON public.blog_post_tags TO anon, authenticated;
GRANT ALL ON public.blog_categories TO service_role;
GRANT ALL ON public.blog_tags TO service_role;
GRANT ALL ON public.blog_posts TO service_role;
GRANT ALL ON public.blog_post_tags TO service_role;

ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Blog categories are publicly readable" ON public.blog_categories FOR SELECT TO anon, authenticated USING (is_active);
CREATE POLICY "Blog tags are publicly readable" ON public.blog_tags FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Published blog posts are publicly readable" ON public.blog_posts FOR SELECT TO anon, authenticated USING (is_published);
CREATE POLICY "Blog post tags are publicly readable" ON public.blog_post_tags FOR SELECT TO anon, authenticated USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_blog_categories_updated_at BEFORE UPDATE ON public.blog_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.blog_categories (slug, name, description, sort_order) VALUES
('manufacturing', 'Manufacturing', 'How performance apparel is engineered, cut, stitched and inspected.', 1),
('fabrics-materials', 'Fabrics & Materials', 'Fabric construction, GSM, stretch and finishing explained for buyers.', 2),
('export-logistics', 'Export & Logistics', 'Shipping, compliance and documentation for international apparel orders.', 3),
('branding-private-label', 'Branding & Private Label', 'Launching and scaling your own sportswear label.', 4);

INSERT INTO public.blog_tags (slug, name) VALUES
('teamwear', 'Teamwear'), ('fabric', 'Fabric'), ('moq', 'MOQ'), ('sublimation', 'Sublimation'),
('export', 'Export'), ('private-label', 'Private Label'), ('quality-control', 'Quality Control');

INSERT INTO public.blog_posts (slug, title, excerpt, content, cover_image_url, category_id, read_minutes, seo_title, seo_description, keywords, is_featured, is_published, published_at, sort_order) VALUES
(
  'how-to-choose-fabric-for-team-uniforms',
  'How to Choose the Right Fabric for Team Uniforms',
  'A buyer-friendly guide to polyester interlock, mesh, pique and spandex blends — and how to match fabric to sport, climate and budget.',
  $md$Fabric decides how a uniform performs on the field and how long it survives a season. Before you approve a sample, it helps to understand the four variables every mill works with: fibre, knit construction, weight (GSM) and finish.

## Start with the sport, not the swatch

Contact sports need abrasion resistance and seam strength. Endurance sports need airflow and low water retention. Indoor sports need stretch recovery so garments keep their shape through repeated pivots.

- **Football and rugby:** 150-180 GSM polyester interlock, or a heavier 200 GSM knit for rugby shirts that take pulling loads.
- **Basketball:** 130-160 GSM micro mesh for airflow, with a bonded or double-stitched armhole.
- **Training and running:** 120-150 GSM birdseye or hex mesh with a moisture-wicking finish.
- **Compression base layers:** 200-240 GSM polyester-spandex (usually 82/18 or 88/12) for support without restriction.

## Understand GSM before you compare prices

GSM (grams per square metre) is the single most common cause of quotation confusion. A 20 GSM difference changes the hand feel, opacity and cost per garment. When comparing two suppliers, always compare fabrics at the same GSM, the same fibre blend and the same finish — otherwise you are comparing two different products.

## Climate matters as much as sport

Teams in humid regions benefit from open-structure mesh and a hydrophilic wicking finish that moves sweat outward quickly. In cold or variable climates, brushed-back poly fleece and bonded softshell keep athletes warm without adding bulk. If you supply distributors across multiple regions, consider a single silhouette produced in two fabric weights.

## Colour, print method and fabric are one decision

Sublimation only bonds to polyester-rich fabrics, so full-colour graphic kits must be built on polyester. Cotton-rich fabrics take screen printing and embroidery beautifully but cannot hold sublimated all-over graphics. Decide the decoration method before locking fabric — not after.

## What to ask your manufacturer

1. What is the exact fibre blend, GSM and knit construction?
2. Which wicking or anti-odour finish is applied, and how many washes is it rated for?
3. What is the colourfastness and shrinkage result after industrial laundering?
4. Can you supply a physical sample in the final fabric before bulk production?

At Rare Signs Apparel we keep validated fabric libraries for each category so buyers can compare hand feel side by side before committing to bulk. Browse the [full product range](/products) or read about our [customization services](/customization) to see how fabric, fit and branding come together.

Ready to spec a kit? [Request a quote](/contact) with your sport, quantity and target price, and our export team will recommend two or three fabric options with samples.$md$,
  '/images/cat-teamwear.jpg',
  (SELECT id FROM public.blog_categories WHERE slug = 'fabrics-materials'),
  7,
  'How to Choose Fabric for Team Uniforms | Rare Signs Apparel',
  'Match polyester interlock, mesh, pique and spandex blends to your sport, climate and budget. A practical fabric guide for teamwear buyers and wholesalers.',
  'team uniform fabric, polyester interlock, sportswear GSM, teamwear manufacturing',
  true, true, '2026-05-12T09:00:00Z', 1
),
(
  'sublimation-vs-screen-printing-sportswear',
  'Sublimation vs Screen Printing vs Embroidery: Choosing a Decoration Method',
  'Which decoration method suits your kit, your quantity and your artwork? A side-by-side comparison for sportswear buyers.',
  $md$Three decoration methods cover the vast majority of sportswear orders. Each has a sweet spot in terms of artwork complexity, fabric compatibility and order quantity.

## Sublimation

Dye-sublimation transfers ink into polyester fibres, so the graphic becomes part of the fabric. There is no surface layer to crack or peel.

- **Best for:** all-over graphics, gradients, photographic detail, numbered kits, unlimited colours.
- **Fabric:** polyester-rich only.
- **Quantity:** efficient even at low volumes because there are no screens to prepare.
- **Watch for:** panel alignment across seams — always approve a placement proof.

## Screen printing

Ink is pushed through a stencil onto the garment surface. Cost per piece drops sharply as quantity rises, because screen setup is a fixed cost.

- **Best for:** bold logos, 1-4 spot colours, cotton and cotton-blend casualwear.
- **Fabric:** cotton, cotton-poly, most jersey.
- **Quantity:** strongest economics above a few hundred pieces per design.
- **Watch for:** colour count — each additional colour adds a screen and a cost step.

## Embroidery

Thread is stitched directly into the fabric, giving a premium tactile finish that reads as corporate quality.

- **Best for:** crests, chest logos, caps, polos, jackets.
- **Fabric:** almost anything with enough stability, plus backing.
- **Quantity:** priced by stitch count, so small logos stay affordable at any volume.
- **Watch for:** fine text below 4mm and very thin gradients do not translate to thread.

## A practical decision path

1. Does the artwork include photographic imagery or gradients? Choose sublimation.
2. Is the garment cotton-rich with 1-3 flat colours? Choose screen printing.
3. Is the goal a premium, understated brand mark? Choose embroidery.
4. Mixed requirement? Combine methods — sublimated body with an embroidered crest is common in premium teamwear.

## Artwork you should send

Vector files (AI, EPS, PDF or SVG) for logos, 300 DPI raster for photographic panels, plus Pantone references for brand colours. Send a size chart or reference garment if fit is critical.

See how these methods are applied across our [teamwear and sportswear catalogue](/products), or review our [customization process](/customization) for artwork, sampling and approval timelines.

Want a recommendation for your artwork? [Message our export team on WhatsApp](/contact) with your design and quantity for a same-day method and price suggestion.$md$,
  '/images/cat-sportswear.jpg',
  (SELECT id FROM public.blog_categories WHERE slug = 'manufacturing'),
  6,
  'Sublimation vs Screen Printing vs Embroidery | Rare Signs Apparel',
  'Compare sublimation, screen printing and embroidery for sportswear: artwork suitability, fabric compatibility, quantity economics and file requirements.',
  'sublimation printing sportswear, screen printing vs sublimation, embroidery teamwear',
  true, true, '2026-05-26T09:00:00Z', 2
),
(
  'minimum-order-quantities-explained',
  'Minimum Order Quantities Explained: Why MOQ Exists and How to Work With It',
  'MOQ is not an arbitrary barrier — it reflects fabric dyeing, cutting efficiency and line setup. Here is how to plan an order around it.',
  $md$Every buyer asks about MOQ, and most quotes hinge on it. Understanding what drives minimums makes negotiation far more productive.

## What actually sets the minimum

- **Fabric dyeing:** dye lots have a practical floor. Custom colours usually require a minimum fabric run, which translates into a garment minimum.
- **Cutting efficiency:** markers are laid to minimise waste. Very small runs waste fabric per garment, raising unit cost.
- **Line setup:** a sewing line needs setup, training on the style and an initial quality loop. That cost is spread across the run.
- **Decoration setup:** screens, embroidery digitising and sublimation profiling are fixed costs per design.

## Typical structures

MOQ is usually expressed per style per colour, not per order. A 300-piece order across three colourways behaves differently from 300 pieces in a single colour. Sublimated kits are generally the most flexible because stock white polyester is used and colour arrives through print.

## Five ways to work within MOQ

1. **Consolidate colourways.** Fewer colours, more sizes.
2. **Use stock fabric colours** instead of custom dye lots.
3. **Choose sublimation** for low-volume, high-variation designs.
4. **Combine styles** in a single order to share line setup.
5. **Plan a seasonal calendar** so repeat orders sit above the efficient threshold.

## What a realistic first order looks like

New distributors often start with one or two styles, a single fabric and two colourways, then scale into a wider range once retail data arrives. That approach keeps working capital sensible while proving fit, fabric and lead time with a real customer base.

## Questions worth asking

Ask whether MOQ applies per style, per colour or per order; whether sampling counts toward it; and what the price difference is at the next quantity tier. A good manufacturer will show you both, so you can decide whether a slightly larger run improves margin.

Each product page in our [catalogue](/products) lists an indicative MOQ, and our [FAQ](/faq) covers sampling, lead times and payment terms in detail.

Have a target quantity in mind? [Send us your requirement](/contact) and we will confirm MOQ, tiered pricing and lead time for your exact spec.$md$,
  '/images/manufacturing.jpg',
  (SELECT id FROM public.blog_categories WHERE slug = 'manufacturing'),
  5,
  'Sportswear MOQ Explained | Minimum Order Quantity Guide',
  'Why sportswear manufacturers set minimum order quantities, how MOQ is calculated per style and colour, and five practical ways to plan an order around it.',
  'sportswear MOQ, minimum order quantity apparel, custom uniform minimums',
  false, true, '2026-06-09T09:00:00Z', 3
),
(
  'sportswear-export-guide-compliance-documents',
  'Sportswear Export Guide: Documents, Incoterms and Compliance',
  'From commercial invoice to Incoterms and labelling rules — what importers of custom apparel should expect at each stage.',
  $md$Importing apparel is routine once the paperwork is understood. This guide covers the documents, terms and labelling standards that appear in most sportswear shipments.

## Core export documents

- **Commercial invoice** — values, HS codes and terms of sale.
- **Packing list** — carton contents, size breakdown, net and gross weights.
- **Bill of lading or air waybill** — the transport contract and title document.
- **Certificate of origin** — often required for preferential duty treatment.
- **Test reports** — where the destination market requires them for chemical or flammability standards.

## Incoterms in plain language

- **FOB:** the manufacturer delivers to the port of origin and clears export. You arrange freight onward. Most common for repeat importers with their own forwarder.
- **CIF:** the manufacturer arranges sea freight and insurance to your destination port. Simpler for newer importers.
- **DAP/DDP:** delivered to your door. Convenient, but compare landed cost carefully.

## Labelling and compliance

Most markets require fibre composition, care instructions, country of origin and importer identification on a permanent label. The EU expects fibre naming in line with textile regulation; the US requires country of origin and identification of the responsible company. Confirm language requirements early — multilingual care labels are cheap to plan and expensive to retrofit.

## Lead time planning

A realistic timeline for a first custom order is: artwork and sampling, sample approval, bulk fabric and trims, production, inspection, then transit. Sea freight adds several weeks depending on lane; air freight compresses transit at a higher cost per kilo. Build buffer around your season launch rather than your production date.

## Quality assurance before shipment

Insist on a pre-shipment inspection covering measurements against the approved size chart, colour against approved swatches, print and stitch quality, and carton marking. A short inspection report with photos prevents most post-arrival disputes.

Our [export markets page](/export-markets) shows the regions we ship to regularly, and our [manufacturing process](/manufacturing) explains where inspection sits in the production flow.

Planning your first shipment? [Talk to our export team](/contact) — we will outline documents, Incoterms options and a realistic delivery date for your market.$md$,
  '/images/hero.jpg',
  (SELECT id FROM public.blog_categories WHERE slug = 'export-logistics'),
  8,
  'Sportswear Export Guide: Documents, Incoterms & Compliance',
  'Documents, Incoterms, labelling rules and inspection steps importers should expect when buying custom sportswear from an export manufacturer.',
  'apparel export documents, incoterms FOB CIF apparel, sportswear import compliance',
  false, true, '2026-06-23T09:00:00Z', 4
),
(
  'private-label-sportswear-launch-checklist',
  'Private Label Sportswear: A Launch Checklist for New Brands',
  'Nine steps from brand positioning to first repeat order — the practical sequence we walk new private-label clients through.',
  $md$Launching a private-label sportswear line is a supply chain project as much as a branding one. This is the sequence that keeps first-time brands out of trouble.

## 1. Define the customer and the price ladder

Decide who buys, at what retail price, and what margin the channel needs. Everything downstream — fabric, trims, packaging — follows from that number.

## 2. Choose a tight opening range

Three to five styles that share fabric and construction beat a twelve-style catalogue. Shared fabric means better pricing and fewer moving parts.

## 3. Lock the brand assets

Vector logo, Pantone palette, label artwork, size chart and a naming convention for styles and colourways.

## 4. Build a tech pack

Front and back sketches, measurement chart with tolerances, fabric and trim specification, decoration placement and packaging instructions. A clear tech pack is the single biggest predictor of a smooth first order.

## 5. Sample deliberately

Expect a fit sample, then a pre-production sample in final fabric with final branding. Approve in writing, with photographs and measurements attached.

## 6. Plan branding details

Woven neck labels or heat transfer, hang tags, size tabs, polybags and carton labels. These small items carry a large share of perceived quality.

## 7. Agree quality standards

Define acceptable measurement tolerance, colour tolerance and a defect classification before production, not after inspection.

## 8. Sequence the launch

Photography and ecommerce assets can be produced from pre-production samples, so your storefront is ready when stock lands.

## 9. Prepare the repeat order

Track sell-through by size and colour from week one. Repeat orders placed with real data are where private-label margin actually compounds.

Our [customization services](/customization) cover tech pack support, label and packaging development and sampling, and the [product catalogue](/products) is a useful starting point for base silhouettes you can brand as your own.

Building a label this season? [Send us your concept](/contact) and we will map a sampling and production calendar around your launch date.$md$,
  '/images/cat-casual.jpg',
  (SELECT id FROM public.blog_categories WHERE slug = 'branding-private-label'),
  7,
  'Private Label Sportswear Launch Checklist | Rare Signs Apparel',
  'Nine practical steps to launch a private-label sportswear brand: range planning, tech packs, sampling, branding details, quality standards and repeat orders.',
  'private label sportswear, start a sportswear brand, tech pack apparel',
  true, true, '2026-07-07T09:00:00Z', 5
),
(
  'gsm-guide-hoodies-fleece-activewear',
  'GSM Explained: Picking the Right Weight for Hoodies, Fleece and Activewear',
  'What GSM really tells you about a garment, and the weight ranges that work for training tops, hoodies and winter layers.',
  $md$GSM — grams per square metre — describes fabric weight, not quality. Two fabrics at the same GSM can feel completely different depending on fibre and knit. Still, GSM is the fastest way to align expectations between buyer and manufacturer.

## Weight ranges that work

- **110-140 GSM:** lightweight training tees and running singlets. Very breathable, more transparent in light colours.
- **150-180 GSM:** everyday performance tees and football shirts. The most common range in teamwear.
- **180-220 GSM:** premium tees, polos and compression pieces with a substantial hand feel.
- **240-280 GSM:** French terry and light fleece hoodies for transitional weather.
- **300-380 GSM:** brushed-back fleece hoodies and heavyweight streetwear silhouettes.
- **400 GSM and above:** winter layers, sherpa-lined pieces and heavy oversized hoodies.

## Why the same GSM feels different

Knit construction changes everything. A 320 GSM French terry feels crisp and structured; a 320 GSM brushed fleece feels soft and warmer because the inner face is raised. Fibre blend also matters: cotton-rich fabric feels heavier and drapes differently from a poly-rich blend at identical weight.

## Practical selection tips

1. Match weight to climate first, then to the price point.
2. For light colours, avoid the bottom of the range to control transparency.
3. For printed hoodies, mid-to-heavy weights hold decoration better and resist distortion.
4. Always confirm GSM after finishing — some finishes shift measured weight.
5. Approve a physical sample. GSM narrows the options; only hand feel confirms them.

## What we do at Rare Signs Apparel

We maintain fabric libraries in each range so buyers can compare weights in the same colour and construction, and we state GSM on every quotation so like-for-like comparison is straightforward. Browse [fitness and casual ranges](/products) or read about our [manufacturing standards](/manufacturing).

Not sure which weight suits your market? [Request a swatch set](/contact) and our team will send weight options with pricing for your target quantity.$md$,
  '/images/cat-fitness.jpg',
  (SELECT id FROM public.blog_categories WHERE slug = 'fabrics-materials'),
  6,
  'GSM Guide for Hoodies, Fleece & Activewear | Rare Signs Apparel',
  'GSM weight ranges for tees, football shirts, French terry and fleece hoodies, plus why identical GSM fabrics can feel completely different.',
  'GSM fabric guide, hoodie GSM, fleece weight activewear',
  false, true, '2026-07-21T09:00:00Z', 6
);

INSERT INTO public.blog_post_tags (post_id, tag_id)
SELECT p.id, t.id FROM public.blog_posts p, public.blog_tags t
WHERE (p.slug = 'how-to-choose-fabric-for-team-uniforms' AND t.slug IN ('fabric','teamwear'))
   OR (p.slug = 'sublimation-vs-screen-printing-sportswear' AND t.slug IN ('sublimation','teamwear'))
   OR (p.slug = 'minimum-order-quantities-explained' AND t.slug IN ('moq','quality-control'))
   OR (p.slug = 'sportswear-export-guide-compliance-documents' AND t.slug IN ('export','quality-control'))
   OR (p.slug = 'private-label-sportswear-launch-checklist' AND t.slug IN ('private-label','export'))
   OR (p.slug = 'gsm-guide-hoodies-fleece-activewear' AND t.slug IN ('fabric'));