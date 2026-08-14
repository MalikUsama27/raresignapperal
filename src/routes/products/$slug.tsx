import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ArrowRight, Check, MessageCircle, Package, Palette, Ruler } from "lucide-react";
import { productQuery } from "@/lib/queries";
import { productWhatsappMessage, whatsappLink } from "@/lib/whatsapp";
import { InquiryDialog } from "@/components/site/InquiryDialog";
import { ProductCard } from "@/components/site/ProductCard";
import { Breadcrumbs } from "@/components/site/PageShell";
import { Reveal, SectionHeading } from "@/components/site/Reveal";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const data = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!data) throw notFound();
    return { name: data.product.name, seo: data.product.seo_description, seoTitle: data.product.seo_title };
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: loaderData?.seoTitle ?? "Product | Rare Signs Apparel" },
      { name: "description", content: loaderData?.seo ?? "Custom manufactured sportswear from Rare Signs Apparel." },
      { property: "og:title", content: loaderData?.seoTitle ?? "Product | Rare Signs Apparel" },
      { property: "og:description", content: loaderData?.seo ?? "Custom manufactured sportswear." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  if (!data) return null;
  const { product, related } = data;
  const specs = (product.specifications ?? {}) as Record<string, string>;

  return (
    <>
      <section className="bg-hero pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="container-page">
          <Breadcrumbs
            items={[
              { label: "Products", to: "/products" },
              ...(product.categories
                ? [
                    {
                      label: product.categories.name,
                      to: "/category/$slug",
                      params: { slug: product.categories.slug },
                    },
                  ]
                : []),
              { label: product.name },
            ]}
          />

          <div className="grid gap-12 lg:grid-cols-2">
            <Reveal>
              <div className="overflow-hidden rounded-2xl border border-border bg-surface">
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.name}
                    width={1200}
                    height={900}
                    className="aspect-4/3 w-full object-cover"
                  />
                ) : null}
              </div>
              <div className="mt-4 grid grid-cols-3 gap-3">
                {[product.image_url, product.image_url, product.image_url].filter(Boolean).map((src, index) => (
                  <div key={index} className="overflow-hidden rounded-lg border border-border bg-surface">
                    <img
                      src={src as string}
                      alt={`${product.name} view ${index + 1}`}
                      loading="lazy"
                      className="aspect-square w-full object-cover opacity-70 transition-opacity hover:opacity-100"
                    />
                  </div>
                ))}
              </div>
            </Reveal>

            <div>
              {product.subcategories ? (
                <p className="eyebrow">{product.subcategories.name}</p>
              ) : null}
              <h1 className="display-lg mt-3 text-balance">{product.name}</h1>
              <p className="mt-5 text-base leading-relaxed text-muted-foreground">{product.short_description}</p>

              <dl className="mt-7 grid gap-4 sm:grid-cols-2">
                <Detail icon={Package} label="Product code" value={product.sku ?? "—"} />
                <Detail icon={Ruler} label="Minimum order" value={product.moq ?? "50 pieces"} />
                <Detail icon={Palette} label="Material" value={product.material ?? "—"} />
                <Detail
                  icon={Check}
                  label="Category"
                  value={`${product.categories?.name ?? ""}${product.subcategories ? ` · ${product.subcategories.name}` : ""}`}
                />
              </dl>

              <div className="mt-8 space-y-4">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Available sizes
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <span key={size} className="rounded-md border border-border px-3 py-1.5 text-xs font-medium">
                        {size}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Stock colourways
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <span
                        key={color}
                        className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground"
                      >
                        {color}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <p className="mt-8 rounded-xl border border-border bg-surface p-5 text-sm leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Pricing:</span> quoted per order based on quantity,
                fabric and decoration. Send an inquiry for a costed spec sheet.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <InquiryDialog
                  productName={product.name}
                  productId={product.id}
                  trigger={
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
                    >
                      Request a quote <ArrowRight className="size-4" />
                    </button>
                  }
                />
                <a
                  href={whatsappLink(productWhatsappMessage(product.name))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-primary/40 px-6 py-3.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                >
                  <MessageCircle className="size-4" /> WhatsApp inquiry
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-border py-16 md:py-20">
        <div className="container-page grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <h2 className="font-display text-xl font-semibold">Product description</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.description}</p>

            <h2 className="mt-10 font-display text-xl font-semibold">Customisation options</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{product.customization}</p>
          </div>

          <div className="rounded-2xl border border-border bg-surface p-6">
            <h2 className="font-display text-lg font-semibold">Specifications</h2>
            <dl className="mt-5 divide-y divide-border">
              {Object.entries(specs).map(([key, value]) => (
                <div key={key} className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-sm">
                  <dt className="text-muted-foreground">{key}</dt>
                  <dd>{String(value)}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {related.length ? (
        <section className="border-t border-border bg-surface py-16 md:py-24">
          <div className="container-page">
            <SectionHeading eyebrow="Related styles" title="Others in this category">
              <Link
                to="/products"
                className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary hover:underline"
              >
                View catalogue <ArrowRight className="size-4" />
              </Link>
            </SectionHeading>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Package;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <dt className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Icon className="size-3.5 text-primary" /> {label}
      </dt>
      <dd className="mt-1.5 text-sm">{value}</dd>
    </div>
  );
}
