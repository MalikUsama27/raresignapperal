-- Core catalog schema for the sportswear export site

CREATE TABLE public.categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  tagline text,
  description text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT ALL ON public.categories TO service_role;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT TO anon, authenticated USING (is_active);

CREATE TABLE public.subcategories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  slug text NOT NULL,
  name text NOT NULL,
  description text,
  image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  seo_title text,
  seo_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);
CREATE INDEX subcategories_category_idx ON public.subcategories (category_id, sort_order);
CREATE INDEX subcategories_slug_idx ON public.subcategories (slug);
GRANT SELECT ON public.subcategories TO anon, authenticated;
GRANT ALL ON public.subcategories TO service_role;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Subcategories are publicly readable" ON public.subcategories FOR SELECT TO anon, authenticated USING (is_active);

CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  sku text,
  category_id uuid NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  subcategory_id uuid REFERENCES public.subcategories(id) ON DELETE SET NULL,
  short_description text,
  description text,
  specifications jsonb NOT NULL DEFAULT '{}'::jsonb,
  material text,
  sizes text[] NOT NULL DEFAULT '{}',
  colors text[] NOT NULL DEFAULT '{}',
  customization text,
  moq text,
  image_url text,
  gallery text[] NOT NULL DEFAULT '{}',
  keywords text,
  seo_title text,
  seo_description text,
  is_featured boolean NOT NULL DEFAULT false,
  is_published boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX products_category_idx ON public.products (category_id);
CREATE INDEX products_subcategory_idx ON public.products (subcategory_id);
CREATE INDEX products_featured_idx ON public.products (is_featured) WHERE is_published;
CREATE INDEX products_search_idx ON public.products USING gin (to_tsvector('english', name || ' ' || coalesce(short_description, '') || ' ' || coalesce(keywords, '')));
GRANT SELECT ON public.products TO anon, authenticated;
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Published products are publicly readable" ON public.products FOR SELECT TO anon, authenticated USING (is_published);

CREATE TABLE public.export_countries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text NOT NULL,
  region text,
  lat numeric NOT NULL,
  lng numeric NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.export_countries TO anon, authenticated;
GRANT ALL ON public.export_countries TO service_role;
ALTER TABLE public.export_countries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Export countries are publicly readable" ON public.export_countries FOR SELECT TO anon, authenticated USING (is_active);

CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  author text NOT NULL,
  role text,
  company text,
  country text,
  quote text NOT NULL,
  rating smallint NOT NULL DEFAULT 5,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Testimonials are publicly readable" ON public.testimonials FOR SELECT TO anon, authenticated USING (is_active);

CREATE TABLE public.faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0
);
GRANT SELECT ON public.faqs TO anon, authenticated;
GRANT ALL ON public.faqs TO service_role;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "FAQs are publicly readable" ON public.faqs FOR SELECT TO anon, authenticated USING (is_active);

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text
);
GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Site settings are publicly readable" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.inquiries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  company text,
  email text NOT NULL,
  phone text,
  whatsapp text,
  country text,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  product_name text,
  quantity text,
  message text NOT NULL,
  status text NOT NULL DEFAULT 'new',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX inquiries_created_idx ON public.inquiries (created_at DESC);
GRANT INSERT ON public.inquiries TO anon, authenticated;
GRANT ALL ON public.inquiries TO service_role;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit an inquiry" ON public.inquiries FOR INSERT TO anon, authenticated WITH CHECK (true);

-- ------------------------------------------------------------------
-- Demo content
-- ------------------------------------------------------------------

INSERT INTO public.categories (slug, name, tagline, description, image_url, sort_order, seo_title, seo_description) VALUES
('sportswear','Sportswear','Competition-grade team kits','Sublimated, performance-engineered team kits built for professional clubs, colleges and academies across every major sport.','/images/cat-sportswear.jpg',1,'Custom Sportswear Manufacturer & Exporter','Bulk custom sportswear manufacturing: sublimated jerseys, uniforms and team kits exported worldwide with low MOQs.'),
('casual-wear','Casual Wear','Premium everyday essentials','Heavyweight fleece, oversized silhouettes and street-ready essentials produced to premium retail specification.','/images/cat-casual.jpg',2,'Custom Casual Wear Manufacturer','Private-label hoodies, tees, tracksuits and jackets manufactured for international brands and retailers.'),
('fitness-wear','Fitness Wear','Engineered for performance','Four-way stretch compression, moisture management and squat-proof knits developed for gyms and fitness labels.','/images/cat-fitness.jpg',3,'Fitness & Gym Wear Manufacturer','Custom gym and fitness apparel manufacturing for fitness brands, studios and distributors worldwide.'),
('custom-teamwear','Custom Teamwear','Full club kit programmes','End-to-end club programmes: playing kit, training range, travel wear and staff apparel under one production line.','/images/cat-teamwear.jpg',4,'Custom Teamwear Manufacturing & Export','Complete club teamwear programmes manufactured to spec and shipped worldwide.'),
('activewear','Activewear','Studio to street','Technical seamless knits, running layers and yoga essentials with premium hand-feel and colour fastness.','/images/cat-fitness.jpg',5,'Activewear Manufacturer & Exporter','Custom activewear production for international brands: seamless knits, running and studio ranges.'),
('outdoor-wear','Outdoor Wear','Built for the elements','Softshells, windbreakers and insulated layers tested for water resistance, breathability and durability.','/images/cat-teamwear.jpg',6,'Outdoor & Technical Wear Manufacturer','Softshell, windbreaker and insulated outdoor apparel manufactured for export markets.'),
('corporate-apparel','Corporate Apparel','Brand-ready workwear','Corporate polos, shirting and softshells with precision embroidery for enterprise and hospitality clients.','/images/cat-corporate.jpg',7,'Corporate Apparel & Uniform Manufacturer','Branded corporate uniforms and workwear manufactured with embroidery and bulk export logistics.'),
('kids-sportswear','Kids Sportswear','Academy and youth kits','Youth-graded patterns and skin-safe fabrics for academies, schools and junior leagues.','/images/cat-sportswear.jpg',8,'Kids & Youth Sportswear Manufacturer','Youth sportswear and academy kits manufactured in bulk for clubs, schools and distributors.'),
('accessories','Accessories','Complete the kit','Caps, headwear, sleeves, socks and gameday bags manufactured alongside your main apparel order.','/images/cat-accessories.jpg',9,'Sports Accessories Manufacturer & Exporter','Custom caps, sleeves, socks and gameday bags produced for teams and sports brands worldwide.'),
('private-label-apparel','Private Label Apparel','Your label, our factory','Full private-label development: tech packs, sampling, labelling, packaging and export documentation.','/images/cat-corporate.jpg',10,'Private Label Apparel Manufacturing','Private label apparel manufacturing with tech-pack development, sampling and worldwide export.');

INSERT INTO public.subcategories (category_id, slug, name, description, image_url, sort_order)
SELECT c.id, v.slug, v.name,
  v.name || ' manufactured to competition specification with full customisation, sublimation or embroidery and export-ready packaging.',
  c.image_url, v.ord
FROM (VALUES
  ('sportswear','crew-neck-jersey','Crew Neck Jersey',1),
  ('sportswear','basketball-uniforms','Basketball Uniforms',2),
  ('sportswear','baseball-softball-uniforms','Baseball / Softball Uniforms',3),
  ('sportswear','volleyball-uniforms','Volleyball Uniforms',4),
  ('sportswear','soccer-football-uniforms','Soccer / Football Uniforms',5),
  ('sportswear','american-football-uniforms','American Football Uniforms',6),
  ('sportswear','ice-hockey-uniforms','Ice Hockey Uniforms',7),
  ('sportswear','wrestling-singlets','Wrestling Singlets',8),
  ('sportswear','lacrosse-jerseys','Lacrosse Jerseys',9),
  ('sportswear','shooting-shirts','Shooting Shirts',10),
  ('sportswear','arm-sleeves-headbands','Arm Sleeves / Headbands',11),
  ('sportswear','sports-caps','Sports Caps',12),
  ('sportswear','gameday-backpack','Gameday Backpack',13),
  ('casual-wear','t-shirts','T-Shirts',1),
  ('casual-wear','oversized-t-shirts','Oversized T-Shirts',2),
  ('casual-wear','polo-shirts','Polo Shirts',3),
  ('casual-wear','zip-up-quarter-zip-hoodie','Zip-Up / Quarter-Zip Hoodie',4),
  ('casual-wear','pullover-hoodies','Pullover Hoodies',5),
  ('casual-wear','tracksuits','Tracksuits',6),
  ('casual-wear','sweatshirts','Sweatshirts',7),
  ('casual-wear','varsity-jacket','Varsity Jacket',8),
  ('casual-wear','bomber-denim-jacket','Bomber / Denim Jacket',9),
  ('casual-wear','joggers-trousers','Joggers / Trousers',10),
  ('fitness-wear','gym-t-shirts','Gym T-Shirts',1),
  ('fitness-wear','sleeveless-shirts','Sleeveless Shirts',2),
  ('fitness-wear','tank-tops','Tank Tops',3),
  ('fitness-wear','compression-uniforms','Compression Uniforms',4),
  ('fitness-wear','rash-guards','Rash Guards',5),
  ('fitness-wear','warm-up-suits','Warm-Up Suits',6),
  ('fitness-wear','mma-shorts','MMA Shorts',7),
  ('custom-teamwear','club-playing-kits','Club Playing Kits',1),
  ('custom-teamwear','training-bibs-vests','Training Bibs & Vests',2),
  ('custom-teamwear','travel-tracksuits','Travel Tracksuits',3),
  ('custom-teamwear','staff-sideline-wear','Staff & Sideline Wear',4),
  ('activewear','running-layers','Running Layers',1),
  ('activewear','seamless-leggings','Seamless Leggings',2),
  ('activewear','yoga-sets','Yoga Sets',3),
  ('outdoor-wear','softshell-jackets','Softshell Jackets',1),
  ('outdoor-wear','windbreakers','Windbreakers',2),
  ('outdoor-wear','insulated-puffer-jackets','Insulated Puffer Jackets',3),
  ('corporate-apparel','corporate-polos','Corporate Polos',1),
  ('corporate-apparel','branded-shirting','Branded Shirting',2),
  ('corporate-apparel','workwear-softshells','Workwear Softshells',3),
  ('kids-sportswear','youth-team-kits','Youth Team Kits',1),
  ('kids-sportswear','kids-training-wear','Kids Training Wear',2),
  ('accessories','custom-socks','Custom Socks',1),
  ('accessories','beanies-headwear','Beanies & Headwear',2),
  ('accessories','kit-bags','Kit Bags',3),
  ('private-label-apparel','white-label-basics','White Label Basics',1),
  ('private-label-apparel','cut-and-sew-development','Cut & Sew Development',2)
) AS v(cat, slug, name, ord)
JOIN public.categories c ON c.slug = v.cat;

INSERT INTO public.products (slug, name, sku, category_id, subcategory_id, short_description, description, specifications, material, sizes, colors, customization, moq, image_url, keywords, seo_title, seo_description, is_featured, sort_order)
SELECT
  s.slug || '-' || lower(replace(t.tier, ' ', '-')),
  t.tier || ' ' || s.name,
  'AX-' || upper(left(s.slug, 3)) || '-' || t.n || '0' || row_number() over (order by s.sort_order, t.n),
  s.category_id,
  s.id,
  t.tier || '-tier ' || lower(s.name) || ' built for ' || t.audience || ', fully customisable in your team colours, logos and player names.',
  'The ' || t.tier || ' ' || s.name || ' is produced on our dedicated ' || lower(c.name) || ' line using ' || t.fabric ||
  '. Every unit is cut and sewn in-house, inspected at three separate quality gates and finished with reinforced seams for competitive use. '
  || 'Artwork is applied using ' || t.decoration || ', delivering colour-fast graphics that survive repeated industrial laundering. '
  || 'We produce this style for ' || t.audience || ' across more than forty export markets, with full-package development available from sketch or tech pack to delivered cartons.',
  jsonb_build_object(
    'Fabric', t.fabric,
    'Weight', t.weight,
    'Decoration', t.decoration,
    'Fit', t.fit,
    'Stitching', 'Double-needle reinforced seams',
    'Packaging', 'Individual polybag, master carton, custom labelling available',
    'Lead Time', t.lead_time,
    'Sampling', 'Pre-production sample in 7-10 days'
  ),
  t.fabric,
  ARRAY['XS','S','M','L','XL','2XL','3XL'],
  ARRAY['Navy','Black','White','Royal Blue','Cyan','Red','Charcoal'],
  'Sublimation, screen print, embroidery, heat-transfer vinyl, woven labels, custom neck tape, player names and numbers, custom packaging.',
  t.moq,
  s.image_url,
  lower(s.name) || ', custom ' || lower(s.name) || ', ' || lower(c.name) || ' manufacturer, wholesale ' || lower(s.name) || ', ' || lower(s.name) || ' exporter',
  t.tier || ' ' || s.name || ' | Custom Manufacturing & Export',
  'Bulk ' || t.tier || ' ' || s.name || ' manufactured to order with full customisation, low MOQs and worldwide export. Request a quote today.',
  (t.n = 1 AND s.sort_order <= 2),
  t.n
FROM public.subcategories s
JOIN public.categories c ON c.id = s.category_id
CROSS JOIN (VALUES
  (1,'Pro Elite','professional clubs and first teams','160 GSM recycled interlock polyester with four-way stretch panels','160 GSM','full-sublimation print','Athletic performance fit','25-30 days','50 pieces per design'),
  (2,'Academy','academies, colleges and development squads','180 GSM double-knit performance polyester with mesh ventilation','180 GSM','sublimation and heat-transfer vinyl','Regular team fit','20-25 days','50 pieces per design'),
  (3,'Heritage','clubs and retail programmes wanting a premium hand-feel','280 GSM brushed cotton-rich fleece with anti-pill finish','280 GSM','embroidery and screen print','Relaxed premium fit','30-35 days','100 pieces per design')
) AS t(n, tier, audience, fabric, weight, decoration, fit, lead_time, moq);

INSERT INTO public.export_countries (name, code, region, lat, lng, sort_order) VALUES
('United States','US','North America',39.8,-98.5,1),
('Canada','CA','North America',56.1,-106.3,2),
('United Kingdom','GB','Europe',54.0,-2.0,3),
('Italy','IT','Europe',41.9,12.6,4),
('Denmark','DK','Europe',56.3,9.5,5),
('Germany','DE','Europe',51.2,10.4,6),
('Netherlands','NL','Europe',52.1,5.3,7),
('Australia','AU','Oceania',-25.3,133.8,8),
('New Zealand','NZ','Oceania',-41.0,174.9,9),
('United Arab Emirates','AE','Middle East',24.5,54.4,10),
('Saudi Arabia','SA','Middle East',24.0,45.1,11),
('Japan','JP','Asia',36.2,138.3,12),
('South Africa','ZA','Africa',-30.6,22.9,13),
('Brazil','BR','South America',-14.2,-51.9,14);

INSERT INTO public.testimonials (author, role, company, country, quote, sort_order) VALUES
('Marcus Bennett','Head of Product','Northline Athletic','United States','We moved three full teamwear programmes to Axiom and the consistency between sample and bulk was the best we have seen from any supplier. Colour matching on sublimated kit is exact, every run.',1),
('Elena Rossi','Founder','Corsa Sport Milano','Italy','Their tech-pack team caught fit issues we had missed internally. Six seasons in, our reorders land on schedule and our retailers have stopped asking about quality.',2),
('Daniel Kruse','Purchasing Manager','Nordisk Klubsport','Denmark','Communication is the difference. We get production photos at every stage and clear export documentation, which makes customs clearance painless.',3),
('Aisha Rahman','Brand Director','Vertex Active','United Arab Emirates','Low minimums let us launch a private-label range without tying up capital. The seamless knits compare directly with the tier-one brands we benchmark against.',4),
('James Whitfield','Club Secretary','Ashford Rugby Club','United Kingdom','Full club kit, training range and travel wear from a single order. Delivered inside five weeks, individually bagged and numbered by player.',5),
('Chloe Martin','Sourcing Lead','Southbank Teamwear','Australia','Quality control reports with photographic evidence per carton. That level of transparency is rare at this price point.',6);

INSERT INTO public.faqs (question, answer, category, sort_order) VALUES
('What is your minimum order quantity?','Most styles start at 50 pieces per design, and select private-label programmes start at 100 pieces. Mixed sizes and player names are included at no additional cost.','Ordering',1),
('Can you manufacture from our own designs or tech packs?','Yes. We work from tech packs, CADs, reference samples or even sketches. Our pattern team returns a graded spec sheet for approval before sampling begins.','Production',2),
('How long does production take?','Sampling takes 7-10 days. Bulk production runs 20-35 days depending on fabric, decoration method and order size, plus transit time to your destination.','Production',3),
('Which decoration methods do you offer?','Full sublimation, screen printing, embroidery, heat-transfer vinyl, applique, woven and printed labels, custom neck tape and custom packaging.','Customisation',4),
('Do you supply samples before bulk production?','Every order includes a pre-production sample for fit, colour and construction approval. Bulk production only starts after written sign-off.','Production',5),
('Which countries do you export to?','We ship to more than forty countries, with established logistics into North America, Europe, the Middle East, Oceania and Asia via air and sea freight.','Export',6),
('What are your payment terms?','Standard terms are 50% advance and 50% against shipping documents via bank transfer. Established accounts can request extended terms.','Ordering',7),
('Do you offer private-label and branding services?','Yes. Private-label programmes include custom labelling, hangtags, size tags, polybag printing and retail-ready packaging under your own brand.','Customisation',8),
('How is quality controlled?','Fabric inspection on intake, in-line checks during stitching, and a final AQL inspection before packing. Photographic QC reports are shared per shipment.','Quality',9),
('Can we visit the factory or request an audit?','Buyers are welcome to visit, and we support third-party audits and compliance documentation on request.','Quality',10);

INSERT INTO public.site_settings (key, value) VALUES
('company_name','Axiom Sportswear'),
('company_legal_name','Axiom Sportswear Industries'),
('tagline','Premium sportswear manufacturing and export'),
('whatsapp','923337408106'),
('whatsapp_display','+92 333 7408106'),
('phone','+92 333 7408106'),
('email','export@axiomsportswear.com'),
('address','Small Industrial Estate, Sialkot 51310, Punjab, Pakistan'),
('founded_year','2009'),
('countries_served','40'),
('units_per_month','120000'),
('team_size','450'),
('instagram','https://instagram.com'),
('linkedin','https://linkedin.com'),
('facebook','https://facebook.com'),
('footer_note','Axiom Sportswear manufactures and exports performance sportswear, teamwear and private-label apparel for clubs, brands and distributors worldwide.');