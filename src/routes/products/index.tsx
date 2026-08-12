import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Search, SlidersHorizontal } from "lucide-react";
import { navigationQuery, productsQuery } from "@/lib/queries";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { CtaSection } from "@/components/site/PageShell";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  search: z.string().trim().max(120).optional(),
  category: z.string().trim().max(120).optional(),
  subcategory: z.string().trim().max(120).optional(),
  sort: z.enum(["featured", "name", "newest"]).catch("featured"),
  page: z.number().int().min(1).catch(1),
});

export const Route = createFileRoute("/products/")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "All Products | Custom Sportswear & Apparel Catalogue | Axiom" },
      {
        name: "description",
        content:
          "Browse 150+ custom sportswear, teamwear, fitness and casual styles. Filter by category, search the catalogue and request a quote with your own branding.",
      },
      { property: "og:title", content: "Custom Sportswear & Apparel Catalogue | Axiom Sportswear" },
      {
        property: "og:description",
        content: "Filter our full export catalogue by category and subcategory, then request a quote.",
      },
    ],
  }),
  component: ProductsPage,
});

const PER_PAGE = 12;

function ProductsPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const { data: categories = [] } = useQuery(navigationQuery());
  const [term, setTerm] = useState(search.search ?? "");

  useEffect(() => setTerm(search.search ?? ""), [search.search]);

  const params = {
    ...(search.search ? { search: search.search } : {}),
    ...(search.category ? { category: search.category } : {}),
    ...(search.subcategory ? { subcategory: search.subcategory } : {}),
    sort: search.sort,
    page: search.page,
    perPage: PER_PAGE,
  };

  const { data, isPending } = useQuery(productsQuery(params));
  const total = data?.total ?? 0;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
  const activeCategory = categories.find((category) => category.slug === search.category);

  function update(next: Partial<z.infer<typeof searchSchema>>) {
    navigate({ search: (prev) => ({ ...prev, page: 1, ...next }) as never });
  }

  return (
    <>
      <section className="bg-hero pt-28 pb-12 md:pt-36 md:pb-16">
        <div className="container-page">
          <p className="eyebrow">Catalogue</p>
          <h1 className="display-lg mt-4 max-w-3xl text-balance">Custom sportswear, made to your specification</h1>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Every style below is manufactured to order. Filter the catalogue, open a product for full specifications,
            then request a quote or message us on WhatsApp.
          </p>
        </div>
      </section>

      <section className="border-t border-border py-12 md:py-16">
        <div className="container-page grid gap-10 lg:grid-cols-[16rem_1fr]">
          {/* Filters */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <form
              onSubmit={(event) => {
                event.preventDefault();
                update({ search: term.trim() || undefined });
              }}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5"
            >
              <Search className="size-4 shrink-0 text-muted-foreground" />
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                maxLength={120}
                placeholder="Search catalogue"
                aria-label="Search catalogue"
                className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </form>

            <div className="mt-6">
              <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                <SlidersHorizontal className="size-3.5" /> Categories
              </p>
              <div className="mt-3 space-y-1">
                <button
                  type="button"
                  onClick={() => update({ category: undefined, subcategory: undefined })}
                  className={cn(
                    "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                    !search.category ? "bg-elevated text-foreground" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  All categories
                </button>
                {categories.map((category) => (
                  <div key={category.id}>
                    <button
                      type="button"
                      onClick={() => update({ category: category.slug, subcategory: undefined })}
                      className={cn(
                        "block w-full rounded-md px-3 py-2 text-left text-sm transition-colors",
                        search.category === category.slug
                          ? "bg-elevated text-foreground"
                          : "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {category.name}
                    </button>
                    {search.category === category.slug ? (
                      <div className="mb-2 ml-3 mt-1 space-y-0.5 border-l border-border pl-3">
                        {category.subcategories.map((sub) => (
                          <button
                            key={sub.id}
                            type="button"
                            onClick={() => update({ subcategory: sub.slug })}
                            className={cn(
                              "block w-full rounded px-2 py-1.5 text-left text-[13px] transition-colors",
                              search.subcategory === sub.slug
                                ? "text-primary"
                                : "text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {sub.name}
                          </button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
              <p className="text-sm text-muted-foreground">
                {isPending ? "Loading catalogue…" : `${total} product${total === 1 ? "" : "s"}`}
                {activeCategory ? ` in ${activeCategory.name}` : ""}
                {search.search ? ` matching “${search.search}”` : ""}
              </p>
              <label className="flex items-center gap-2 text-sm text-muted-foreground">
                Sort
                <select
                  value={search.sort}
                  onChange={(event) => update({ sort: event.target.value as "featured" | "name" | "newest" })}
                  className="rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name A–Z</option>
                  <option value="newest">Newest</option>
                </select>
              </label>
            </div>

            {isPending ? (
              <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            ) : total === 0 ? (
              <div className="mt-16 rounded-2xl border border-border bg-surface p-12 text-center">
                <h2 className="font-display text-lg font-semibold">No products found</h2>
                <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
                  Try a broader search term or clear the filters. We also manufacture styles that are not listed —
                  send us a reference and we will quote it.
                </p>
                <button
                  type="button"
                  onClick={() => update({ search: undefined, category: undefined, subcategory: undefined })}
                  className="mt-6 rounded-md border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary/40 hover:text-primary"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <>
                <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                  {(data?.items ?? []).map((product, index) => (
                    <ProductCard key={product.id} product={product} priority={index < 3} />
                  ))}
                </div>

                {pages > 1 ? (
                  <nav className="mt-12 flex flex-wrap items-center justify-center gap-2" aria-label="Pagination">
                    {Array.from({ length: pages }, (_, index) => index + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === pages ||
                          Math.abs(page - search.page) <= 1,
                      )
                      .map((page, index, list) => (
                        <span key={page} className="flex items-center gap-2">
                          {index > 0 && page - (list[index - 1] ?? 0) > 1 ? (
                            <span className="text-xs text-muted-foreground">…</span>
                          ) : null}
                          <Link
                            to="/products"
                            search={(prev) => ({ ...prev, page }) as never}
                            className={cn(
                              "grid size-10 place-items-center rounded-md border text-sm transition-colors",
                              page === search.page
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-border text-muted-foreground hover:text-foreground",
                            )}
                          >
                            {page}
                          </Link>
                        </span>
                      ))}
                  </nav>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
