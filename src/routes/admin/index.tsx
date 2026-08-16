import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Boxes, FileText, Inbox, Loader2, Package } from "lucide-react";
import { getAdminOverview } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/")({
  ssr: false,
  component: AdminDashboard,
});

function AdminDashboard() {
  const overview = useServerFn(getAdminOverview);
  const { data, isLoading } = useQuery({
    queryKey: ["admin", "overview"],
    queryFn: () => overview({ data: undefined }),
  });

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-muted-foreground">
        <Loader2 className="size-6 animate-spin" />
      </div>
    );
  }

  const cards = [
    { label: "Products", value: data.totals.products, to: "/admin/products", icon: Package },
    { label: "Categories", value: data.totals.categories, to: "/admin/categories", icon: Boxes },
    { label: "Blog posts", value: data.totals.posts, to: "/admin/blog", icon: FileText },
    { label: "Inquiries", value: data.totals.inquiries, to: "/admin/inquiries", icon: Inbox },
  ];

  return (
    <div className="space-y-7">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Everything on the public website is managed from here — content updates appear immediately.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to as never}
            className="rounded-xl border border-border bg-surface p-5 transition-colors hover:border-primary/40"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{card.label}</p>
              <card.icon className="size-4 text-primary" />
            </div>
            <p className="mt-3 font-display text-3xl font-bold tracking-tight">{card.value}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Recent inquiries</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.recentInquiries.length === 0 ? (
              <li className="text-muted-foreground">No inquiries yet.</li>
            ) : (
              data.recentInquiries.map((inquiry) => (
                <li key={String(inquiry["id"])} className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium">{String(inquiry["full_name"])}</p>
                    <p className="text-xs text-muted-foreground">
                      {String(inquiry["company"] || inquiry["country"] || "—")} {inquiry["product_name"] ? `· ${String(inquiry["product_name"])}` : ""}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(String(inquiry["created_at"])).toLocaleDateString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <h2 className="font-display text-lg font-semibold">Recent products</h2>
          <ul className="mt-4 space-y-3 text-sm">
            {data.recentProducts.map((product) => (
              <li key={String(product["id"])} className="flex items-center justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
                <span className="truncate">{String(product["name"])}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{product["is_published"] ? "Live" : "Draft"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
