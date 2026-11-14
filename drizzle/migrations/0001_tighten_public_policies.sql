ALTER TABLE public.site_settings ADD COLUMN IF NOT EXISTS is_public boolean NOT NULL DEFAULT false;
UPDATE public.site_settings SET is_public = true WHERE key IN ('address','company_legal_name','company_name','countries_served','email','facebook','facebook_url','footer_note','founded_year','instagram','instagram_url','linkedin','phone','tagline','team_size','units_per_month','whatsapp','whatsapp_display');
DROP POLICY IF EXISTS "Site settings are publicly readable" ON public.site_settings;
CREATE POLICY "Public site settings are readable" ON public.site_settings FOR SELECT TO anon, authenticated USING (is_public);

DROP POLICY IF EXISTS "Anyone can submit an inquiry" ON public.inquiries;
CREATE POLICY "Anyone can submit a valid inquiry" ON public.inquiries FOR INSERT TO anon, authenticated
WITH CHECK (
  status = 'new'
  AND char_length(btrim(full_name)) BETWEEN 1 AND 120
  AND char_length(email) BETWEEN 3 AND 255
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND char_length(btrim(message)) BETWEEN 1 AND 5000
  AND coalesce(char_length(company),0) <= 160
  AND coalesce(char_length(phone),0) <= 40
  AND coalesce(char_length(whatsapp),0) <= 40
  AND coalesce(char_length(country),0) <= 80
  AND coalesce(char_length(product_name),0) <= 200
  AND coalesce(char_length(quantity),0) <= 80
);