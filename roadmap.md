# Deployment verification

## Organic growth opportunities
- [x] Deliver a prioritized report using current Search Console evidence and six-country demand research.
- [x] Apply only safe metadata and existing-page internal links; preserve published article text and records.
- [x] Verify changed metadata and link destinations, and document 30/60/90-day checkpoints.
- [ ] Publish today's metadata/link changes to the official domain — requires the existing external deployment pipeline.

## Technical SEO audit
- [x] Correct server-rendered statistics, About history and shared metadata/image URL helpers without redesigning.
- [x] Validate all public metadata, sitemap pagination/error handling, SSR, images and legacy URL handling: 228 pages return 200, 171 distinct sharing images return 200, nine regression tests pass.
- [x] Read current Search Console data and representative index reports.
- [x] Verify product gallery, quote dialog, blog search, mobile statistics and authenticated admin dashboard without modifying records.
- [ ] Submit corrected sitemap and verify Google receipt after deployment — live sitemap still lists the two uncorrected legacy slugs.
- [x] Provide before/after findings and realistic 30/60/90-day growth priorities in the delivered SEO report.
- [ ] Verify these new fixes on the official domain — requires deployment through the existing external pipeline; Lovable cannot deploy to Cloudflare.
- [ ] Migrate media only after approved destination access and actual files are verified — destination backend is not connected here; preserve current storage.

- [x] Inspect local repository and build configuration. No GitHub remote is visible locally; Git sync status requires Project Settings → Git.
- [x] Confirm the external production build convention: `bun run build`, `.output`, server `.output/server/index.mjs`, assets `.output/public`, generated config `.output/server/wrangler.json`.
- [x] Test the current official domain: homepage statistics, canonical URLs, 228-URL sitemap, robots sitemap, representative products/categories/subcategories/blogs/images, and authenticated admin dashboard.
- [x] Compare the official domain and latest local preview visually and functionally; checked content matches, but no deployment/build identifier is publicly available for a byte-for-byte release comparison.
- [ ] Identify the Cloudflare project and repository connection — blocked: Cloudflare authorization was declined and Git sync status is only available in Project Settings → Git.
- [ ] Deploy through the existing authorized external hosting path — blocked by the unavailable Cloudflare/GitHub connection. No deployment was performed.
- [x] Verify the permanent www → non-www 301 redirect: live /blog?source=check preserves path and query on 14 November 2026; no DNS changes made.
