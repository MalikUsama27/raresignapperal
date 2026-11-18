# Next step: Country export pages (USA, UK, Europe, Australia)

## Maqsad
Har bade market ka apna page, taake "custom sportswear manufacturer for USA" ya "team uniforms supplier UK" jaisi searches par us mulk ke buyers seedha aapki site par aayein.

## Kya hoga
1. 4 naye pages: `/export-markets/usa`, `/uk`, `/europe`, `/australia`.
2. Har page par us mulk ke hisaab se content:
   - Wahan kaunse sports popular hain (USA: basketball, American football; UK: football, rugby; Europe: football, handball; Australia: AFL, cricket, rugby).
   - Shipping ka tareeqa aur andaza time (air / sea, DDP/FOB), sizing (US vs EU sizes).
   - Us market ke liye mashhoor products ke links.
   - 3-4 buyer sawal-jawab aur WhatsApp / inquiry button.
3. Har page ka apna SEO title, description aur Google ke liye structured data.
4. Mojooda Export Markets page se in 4 pages ke links.
5. Sitemap mein 4 naye pages shamil.

## Technical details
- Content in a typed module `src/lib/country-markets.ts` (no database change).
- Route `src/routes/export-markets.$country.tsx`; unknown country → notFound. Existing `/export-markets` stays.
- Uses `seoTitle`, `breadcrumbSchema`, `COMPANY_FACTS`; small test that each country has title, products and FAQs.

## Note
Shipping times aur Incoterms general values hongi — aapko apne asal numbers confirm karne honge.
