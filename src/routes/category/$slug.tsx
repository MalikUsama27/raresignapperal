import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { categoryQuery, productsQuery } from "@/lib/queries";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { Breadcrumbs, CtaSection } from "@/components/site/PageShell";
import { Reveal, SectionHeading } from "@/components/site/Reveal";

export const Route = createFileRoute("/category/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(categoryQuery(params.slug));
    if (!data) throw notFound();
    return { name: data.category.name, seo: data.category.description, count: data.productCount };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Category"} Manufacturer & Exporter | Axiom Sportswear` },
      {
        name: "description",
        content:
          loaderData?.seo ??
          "Custom manufactured sportswear category from Axiom Sportswear, exported worldwide with low minimums.",
      },
      { property: "og:title", content: `${loaderData?.name ?? "Category"} | Axiom Sportswear` },
      { property: "og:description", content: loaderData?.seo ?? "Custom manufactured sportswear." },
    ],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(categoryQuery(slug));
  const { data: products, isPending } = useQuery(productsQuery({ category: slug, perPage: 12, sort: "featured" }));
  if (!data) return null;
  const { category, subcategories, productCount } = data;

  return (
    <>
      <section className="relative overflow-hidden bg-hero pt-28 pb-16 md:pt-36 md:pb-20">
        {category.image_url ? (
          <img
            src={category.image_url}
            alt={category.name}
            className="pointer-events-none absolute inset-0 size-full object-cover opacity-25"
          />
        ) : null}
        <div className="pointer-events-none absolute inset-0 bg-fade-bottom" />
        <div className="container-page relative">
          <Breadcrumbs items={[{ label: "Products", to: "/products" }, { label: category.name }]} />
          <p className="eyebrow">{category.tagline}</p>
          <h1 className="display-xl mt-4 max-w-3xl text-balance">{category.name}</h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            {category.description}
          </p>
          <p className="mt-5 text-sm text-muted-foreground">
            {productCount} styles · {subcategories.length} sub-ranges · MOQ from 50 pieces
          </p>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <div className="container-page">
          <SectionHeading eyebrow="Sub-ranges" title={`Explore ${category.name.toLowerCase()} sub-ranges`} />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {subcategories.map((sub, index) => (
              <Reveal key={sub.id} delay={index * 0.03} className="h-full">
                <Link
                  to="/category/$category/$subcategory"
                  params={{ category: category.slug, subcategory: sub.slug }}
                  className="group flex h-full flex-col rounded-xl border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40"
                >
                  <p className="font-display text-base font-semibold">{sub.name}</p>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{sub.description}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-primary">
                    View styles <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-surface py-16 md:py-24">
        <div className="container-page">
          <SectionHeading eyebrow="Catalogue" title={`Popular ${category.name.toLowerCase()} styles`}>
            <Link
              to="/products"
              search={{ category: category.slug, sort: "featured", page: 1 }}
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              All {productCount} styles <ArrowRight className="size-4" />
            </Link>
          </SectionHeading>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {isPending
              ? Array.from({ length: 8 }, (_, index) => <ProductCardSkeleton key={index} />)
              : (products?.items ?? []).map((product) => <ProductCard key={product.id} product={product} />)}
          </div>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
