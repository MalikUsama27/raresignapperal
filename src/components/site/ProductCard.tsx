import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { FadeInImage } from "./Motion";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  short_description: string | null;
  image_url: string | null;
  categories?: { name: string; slug: string } | null;
  subcategories?: { name: string; slug: string } | null;
};

export function ProductCard({ product, priority = false }: { product: ProductCardData; priority?: boolean }) {
  return (
    <Link
      to="/products/$slug"
      params={{ slug: product.slug }}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-500 hover:-translate-y-1 hover:border-primary/40 hover:shadow-[var(--shadow-elevate)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-elevated">
        {product.image_url ? (
          <FadeInImage
            src={product.image_url}
            alt={product.name}
            width={1200}
            height={900}
            loading={priority ? "eager" : "lazy"}
            className="size-full object-cover opacity-90 transition-[transform,opacity,filter] duration-700 ease-out group-hover:scale-[1.06] group-hover:opacity-100"
          />
        ) : null}
        <div className="absolute inset-0 bg-fade-bottom" />
        {product.categories ? (
          <span className="absolute left-4 top-4 rounded-full border border-border bg-background/70 px-3 py-1 text-[11px] font-medium tracking-wide text-muted-foreground backdrop-blur-sm">
            {product.categories.name}
          </span>
        ) : null}
        <span className="absolute bottom-4 right-4 flex translate-y-2 items-center gap-1.5 rounded-full bg-primary px-3.5 py-1.5 text-xs font-semibold text-primary-foreground opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          View product <ArrowUpRight className="size-3.5" />
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-5">
        {product.subcategories ? (
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
            {product.subcategories.name}
          </p>
        ) : null}
        <h3 className="font-display text-lg font-semibold leading-snug">{product.name}</h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{product.short_description}</p>
      </div>
    </Link>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface">
      <div className="aspect-4/3 animate-pulse bg-elevated" />
      <div className="space-y-3 p-5">
        <div className="h-3 w-24 animate-pulse rounded bg-elevated" />
        <div className="h-4 w-3/4 animate-pulse rounded bg-elevated" />
        <div className="h-3 w-full animate-pulse rounded bg-elevated" />
      </div>
    </div>
  );
}
