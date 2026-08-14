export const SITE_URL = "https://global-sportswear-hub.lovable.app";
export const COMPANY_NAME = "Rare Signs Apparel";
export const COMPANY_TAGLINE = "Premium Sportswear Manufacturing & Global Export";

export function canonical(path: string) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}
