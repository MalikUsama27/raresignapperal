<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Public SEO uses shared URL and metadata helpers; preserve absolute media URLs to avoid malformed social previews.
- Public legacy slug aliases resolve to existing database records and redirect at the server entry; no record migration is needed.
- Homepage and About statistics share one facts module and counters render their final value during SSR so crawlers never receive zeros.
- Sitemap reads use public credentials, pagination and explicit failures to prevent silently incomplete XML.
- Shared page introductions accept ReactNode descriptions so inline internal links preserve existing paragraph structure and styling.
- Site search terms are logged server-side to public.search_logs (insert-only for visitors, admin-read) from listProducts page 1; why: admin needs popular and zero-result terms, which free-text analytics events cannot carry.
- Product/category/range titles use `productTitle` (buyer-intent "Custom X Manufacturer…" formula); an admin SEO title wins only if it names "Manufacturer" and the brand. Why: B2B buyers search manufacturer/wholesale terms.
