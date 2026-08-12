import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

export function publicClient() {
  return createClient<Database>(
    import.meta.env["VITE_SUPABASE_URL"] as string,
    import.meta.env["VITE_SUPABASE_PUBLISHABLE_KEY"] as string,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export const CATEGORY_FIELDS =
  "id, slug, name, tagline, description, image_url, sort_order, seo_title, seo_description";
export const SUBCATEGORY_FIELDS =
  "id, category_id, slug, name, description, image_url, sort_order, seo_title, seo_description";
export const PRODUCT_CARD_FIELDS =
  "id, slug, name, sku, short_description, image_url, moq, is_featured, category_id, subcategory_id";
