import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Search } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { productsQuery } from "@/lib/queries";

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [term, setTerm] = useState("");
  const [debounced, setDebounced] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(term.trim()), 300);
    return () => clearTimeout(timeout);
  }, [term]);

  const params = useMemo(() => ({ search: debounced, perPage: 6 }), [debounced]);
  const { data, isFetching } = useQuery({ ...productsQuery(params), enabled: open && debounced.length >= 2 });

  const results = data?.items ?? [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 overflow-hidden border-border bg-popover p-0">
        <DialogHeader className="sr-only">
          <DialogTitle>Search products</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            if (!debounced) return;
            onOpenChange(false);
            navigate({ to: "/products", search: { search: debounced, page: 1 } });
          }}
          className="flex items-center gap-3 border-b border-border px-5 py-4"
        >
          <Search className="size-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={term}
            onChange={(event) => setTerm(event.target.value)}
            maxLength={120}
            placeholder="Search jerseys, hoodies, compression wear…"
            aria-label="Search products"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
          {isFetching ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : null}
        </form>

        <div className="max-h-[55vh] overflow-y-auto p-2">
          {debounced.length < 2 ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              Type at least two characters to search our catalogue.
            </p>
          ) : results.length === 0 && !isFetching ? (
            <p className="px-4 py-8 text-center text-sm text-muted-foreground">
              No products match “{debounced}”. Try a broader term such as “jersey” or “hoodie”.
            </p>
          ) : (
            <ul>
              {results.map((product) => (
                <li key={product.id}>
                  <Link
                    to="/products/$slug"
                    params={{ slug: product.slug }}
                    onClick={() => onOpenChange(false)}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-elevated"
                  >
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        loading="lazy"
                        className="size-11 rounded-md object-cover"
                      />
                    ) : null}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{product.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {product.categories?.name}
                        {product.subcategories ? ` · ${product.subcategories.name}` : ""}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {debounced.length >= 2 ? (
          <button
            type="button"
            onClick={() => {
              onOpenChange(false);
              navigate({ to: "/products", search: { search: debounced, page: 1 } });
            }}
            className="border-t border-border px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.16em] text-primary"
          >
            View all results
          </button>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
