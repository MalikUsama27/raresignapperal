# Deployment verification

- [x] Inspect local repository and build configuration. No GitHub remote is visible locally; Git sync status requires Project Settings → Git.
- [x] Confirm the external production build convention: `bun run build`, `.output`, server `.output/server/index.mjs`, assets `.output/public`, generated config `.output/server/wrangler.json`.
- [x] Test the current official domain: homepage statistics, canonical URLs, 228-URL sitemap, robots sitemap, representative products/categories/subcategories/blogs/images, and authenticated admin dashboard.
- [x] Compare the official domain and latest local preview visually and functionally; checked content matches, but no deployment/build identifier is publicly available for a byte-for-byte release comparison.
- [ ] Identify the Cloudflare project and repository connection — blocked: Cloudflare authorization was declined and Git sync status is only available in Project Settings → Git.
- [ ] Deploy through the existing authorized external hosting path — blocked by the unavailable Cloudflare/GitHub connection. No deployment was performed.
- [ ] Configure and verify the permanent www → non-www 301 redirect — blocked by Cloudflare authorization. Current www homepage returns 200. Do not touch MX records.
