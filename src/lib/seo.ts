import { canonical, COMPANY_NAME, SITE_URL } from "./site";

/** Resolve existing media locations without prefixing absolute storage URLs. */
export function absoluteImageUrl(path?: string | null): string | null {
  if (!path?.trim()) return null;
  try {
    const url = new URL(path.trim(), `${SITE_URL}/`);
    return url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function cleanMetadata(value: string) {
  return value
    .replace(/\b(?:low\s+)?MOQs?\b/gi, "flexible orders")
    .replace(/\b(?:low\s+)?minimum[- ]order(?:\s+quantities|\s+quantity)?\b/gi, "custom orders")
    .replace(/\b(?:low\s+)?minimums\b/gi, "custom orders")
    .replace(/\s+/g, " ")
    .trim();
}

function shorten(value: string, limit: number) {
  if (value.length <= limit) return value;
  const cut = value.slice(0, limit - 1);
  const space = cut.lastIndexOf(" ");
  return `${cut.slice(0, space > limit * 0.6 ? space : cut.length).replace(/[ ,;:|–-]+$/, "")}…`;
}

export function seoTitle(name: string, preferred?: string | null) {
  const title = cleanMetadata(preferred || `${name} | ${COMPANY_NAME}`);
  return title.length <= 60 && title.toLowerCase().startsWith(name.toLowerCase())
    ? title : shorten(`${name} | ${COMPANY_NAME}`, 60);
}

export function seoDescription(name: string, preferred?: string | null) {
  const text = cleanMetadata(preferred || "Custom sportswear manufactured in Sialkot, Pakistan, for teams, brands and wholesalers. Request a worldwide export quote.");
  return shorten(text.toLowerCase().startsWith(name.toLowerCase()) ? text : `${name}: ${text}`, 160);
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem", position: index + 1, name: item.name, item: canonical(item.path),
    })),
  };
}

const LEGACY_PATHS: Record<string, string> = {
  "/products/sports-wretling-singlets": "/products/sports-wrestling-singlets",
  "/category/outdoor-wear/puffer-jackts": "/category/outdoor-wear/puffer-jackets",
};

export function publicPath(path: string) { return LEGACY_PATHS[path] ?? path; }
export function productSlug(slug: string) { return slug === "sports-wretling-singlets" ? "sports-wrestling-singlets" : slug; }
export function storedProductSlug(slug: string) { return slug === "sports-wrestling-singlets" ? "sports-wretling-singlets" : slug; }
export function subcategorySlug(slug: string) { return slug === "puffer-jackts" ? "puffer-jackets" : slug; }
export function storedSubcategorySlug(slug: string) { return slug === "puffer-jackets" ? "puffer-jackts" : slug; }

/** Hosts that must consolidate onto the official domain (www and the old published Lovable address). */
const OFFICIAL_ALIASES = new Set(["www.raresignsapparel.com", "raresignapperal.lovable.app"]);

/** Redirect only official alias hosts and explicitly enumerated legacy paths. */
export function permanentRedirect(requestUrl: string) {
  const url = new URL(requestUrl);
  const path = publicPath(url.pathname);
  const official = OFFICIAL_ALIASES.has(url.hostname);
  if (!official && path === url.pathname) return null;
  const destination = new URL(path, official ? SITE_URL : url.origin);
  destination.search = url.search;
  return destination.href;
}
/** Normalise a search term to its singular stem ("jerseys" -> "jersey", "hoodies" -> "hoodie"). */
export function searchStem(term: string) {
  const t = term.trim().toLowerCase();
  if (t.length > 3 && t.endsWith("s") && !t.endsWith("ss")) return t.slice(0, -1);
  return t;
}

type Rankable = { name: string; short_description?: string | null; keywords?: string | null; is_featured?: boolean | null;
  categories?: { name: string } | null; subcategories?: { name: string } | null };

/** Score how well a product matches a search: name matches first, then range/category, then text. */
export function searchScore(item: Rankable, term: string) {
  const stem = searchStem(term);
  if (!stem) return 0;
  const name = item.name.toLowerCase();
  let score = 0;
  if (name === stem || name === term.trim().toLowerCase()) score += 100;
  else if (name.startsWith(stem)) score += 80;
  else if (new RegExp(`\\b${stem.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`).test(name)) score += 60;
  else if (name.includes(stem)) score += 50;
  const range = `${item.subcategories?.name ?? ""} ${item.categories?.name ?? ""}`.toLowerCase();
  if (range.includes(stem)) score += 30;
  if ((item.keywords ?? "").toLowerCase().includes(stem)) score += 15;
  if ((item.short_description ?? "").toLowerCase().includes(stem)) score += 5;
  if (score && item.is_featured) score += 2;
  return score;
}

/** Buyer-intent title (custom/manufacturer/wholesale) that fits 60 chars; admin titles still win via seoTitle. */
export function b2bTitle(name: string, kind: "product" | "range" = "product") {
  const n = name.trim();
  const candidates = kind === "product"
    ? [`Custom ${n} Manufacturer & Wholesale | ${COMPANY_NAME}`, `Custom ${n} Manufacturer | ${COMPANY_NAME}`, `${n} Manufacturer | ${COMPANY_NAME}`, `Custom ${n} Manufacturer & Wholesale Supplier`, `Custom ${n} Manufacturer`]
    : [`Custom ${n} Manufacturer & Wholesale | ${COMPANY_NAME}`, `${n} Manufacturer & Wholesale | ${COMPANY_NAME}`, `${n} Manufacturer | ${COMPANY_NAME}`, `Custom ${n} Manufacturer & Supplier`];
  return candidates.find((c) => c.length <= 60) ?? shorten(`${n} | ${COMPANY_NAME}`, 60);
}

export function b2bDescription(name: string) {
  return shorten(`Custom ${name} manufacturer & wholesale supplier in Sialkot, Pakistan. Your logo, colours and fabric, factory-direct pricing, worldwide export. Get a quote.`, 160);
}

/** Admin-set title when present and valid, otherwise the buyer-intent title. */
export function productTitle(name: string, admin?: string | null, kind: "product" | "range" = "product") {
  const clean = admin ? cleanMetadata(admin) : "";
  return clean.length <= 60 && /manufacturer/i.test(clean) && clean.includes(COMPANY_NAME) ? clean : b2bTitle(name, kind);
}
