CREATE TABLE public.search_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  result_count integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT INSERT ON public.search_logs TO anon, authenticated;
GRANT SELECT, DELETE ON public.search_logs TO authenticated;
GRANT ALL ON public.search_logs TO service_role;
ALTER TABLE public.search_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can log a search" ON public.search_logs FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(term) BETWEEN 2 AND 120 AND result_count BETWEEN 0 AND 100000);
CREATE POLICY "Admins read searches" ON public.search_logs FOR SELECT TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins delete searches" ON public.search_logs FOR DELETE TO authenticated USING (private.has_role(auth.uid(), 'admin'));
CREATE INDEX search_logs_created_at_idx ON public.search_logs (created_at DESC);