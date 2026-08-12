import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { productsQuery, subcategoryQuery } from "@/lib/queries";
import { ProductCard, ProductCardSkeleton } from "@/components/site/ProductCard";
import { Breadcrumbs, CtaSection } from "@/components/site/PageShell";

export const Route = createFileRoute("/category/$category/$subcategory")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(
      subcategoryQuery(params.category, params.subcategory),
    );
    if (!data) throw notFound();
    return {
      name: data.subcategory.name,
      category: data.category.name,
      seo: data.subcategory.description,
    };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Range"} | ${loaderData?.category ?? "Sportswear"} | Axiom Sportswear` },
      {
        name: "description",
        content: loaderData?.seo ?? "Custom manufactured sportswear range, exported worldwide from Sialkot.",
      },
      { property: "og:title", content: `${loaderData?.name ?? "Range"} | Axiom Sportswear` },
      { property: "og:description", content: loaderData?.seo ?? "Custom manufactured sportswear range." },
    ],
  }),
  component: SubcategoryPage,
});

function SubcategoryPage() {
  const params = Route.useParams();
  const { data } = useSuspenseQuery(subcategoryQuery(params.category, params.subcategory));
  const { data: products, isPending } = useQuery(
    productsQuery({ category: params.category, subcategory: params.subcategory, perPage: 24, sort: "featured" }),
  );
  if (!data) return null;
  const { category, subcategory } = data;

  return (
    <>
      <section className="bg-hero pt-28 pb-14 md:pt-36 md:pb-18">
        <div className="container-page">
          <Breadcrumbs
            items={[
              { label: "Products", to: "/products" },
              { label: category.name, to: "/category/$slug", params: { slug: category.slug } },
              { label: subcategory.name },
            ]}
          />
          <p className="eyebrow">{category.name}</p>
          <h1 className="display-lg mt-4 max-w-3xl text-balance">{subcategory.name}</h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">{subcategory.description}</p>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <div className="container-page">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
            <p className="text-sm text-muted-foreground">
              {isPending ? "Loading styles…" : `${products?.total ?? 0} styles in this range`}
            </p>
            <Link
              to="/category/$slug"
              params={{ slug: category.slug }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline"
            >
              Back to {category.name} <ArrowRight className="size-4" />
            </Link>
          </div>
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
