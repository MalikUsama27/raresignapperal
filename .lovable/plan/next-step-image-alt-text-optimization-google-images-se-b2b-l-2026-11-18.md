# Next step: Image Alt Text Optimization (Google Images se B2B leads)

## Maqsad
Har product, category aur blog image ka "alt text" buyer-intent wala banana, taake Google Images mein "custom basketball uniforms manufacturer" jaisi searches par aapki photos aayein aur log website par click karein.

## Kya hoga
1. Product images: alt text khud ban jaye ga — "Custom [Product] manufacturer – [Category] – Rare Signs Apparel" (gallery ki har photo ka alag view: front, back, detail).
2. Category aur subcategory cards: "Wholesale [Category] supplier – Rare Signs Apparel".
3. Blog cover images: blog title + "– factory photo, Rare Signs Apparel".
4. About / Manufacturing / Customization pages ki photos: factory process wala descriptive alt text.
5. Admin mein agar kisi image ka apna alt text likha ho to wahi use hoga; khali ho to auto wala.
6. Image file names jo SEO-friendly nahi, unko sitemap mein image tags ke saath list karna (Google Image sitemap).

## Technical details
- `src/lib/seo.ts` mein `imageAlt()` helper (product / category / blog / page types), with test in `seo.test.ts`.
- Product gallery, category cards, blog list/detail, and static page images use the helper.
- Sitemap entries for products and blogs get `<image:image><image:loc>` with absolute URLs (existing `absoluteImageUrl`).
- No database change needed.

## Is ke baad (optional)
- Country pages (USA / UK / Europe / Australia) ke liye export landing pages.
