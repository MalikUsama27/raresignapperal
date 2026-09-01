INSERT INTO public.site_settings (key, value) VALUES
  ('instagram_url', 'https://www.instagram.com/raresignsapparel'),
  ('facebook_url', 'https://www.facebook.com/raresignsapparel')
ON CONFLICT (key) DO NOTHING;