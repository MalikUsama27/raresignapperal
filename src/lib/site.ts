export const SITE_URL = "https://raresignapperal.lovable.app";
export const COMPANY_NAME = "Rare Signs Apparel";
export const COMPANY_TAGLINE = "Premium Sportswear Manufacturing & Global Export";

/** Permanent, project-relative brand assets (shipped from /public). */
export const LOGO_PATH = "/brand/rare-signs-logo.png";
export const OG_IMAGE_PATH = "/brand/og-cover.jpg";
export const LOGO_URL = `${SITE_URL}${LOGO_PATH}`;
export const OG_IMAGE_URL = `${SITE_URL}${OG_IMAGE_PATH}`;

export function canonical(path: string) {
  return `${SITE_URL}${path === "/" ? "" : path}`;
}
