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
  return title.length <= 60 ? title : shorten(`${name} | ${COMPANY_NAME}`, 60);
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

/** Redirect only the official www host and explicitly enumerated legacy paths. */
export function permanentRedirect(requestUrl: string) {
  const url = new URL(requestUrl);
  const path = publicPath(url.pathname);
  if (url.hostname !== "www.raresignsapparel.com" && path === url.pathname) return null;
  const destination = new URL(path, url.hostname === "www.raresignsapparel.com" ? SITE_URL : url.origin);
  destination.search = url.search;
  return destination.href;
}