import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Archive, Inbox } from "lucide-react";
import { toast } from "sonner";
import { adminListInquiries, adminUpdateInquiryStatus } from "@/lib/admin.functions";

const STATUSES = ["new", "in_progress", "quoted", "won", "closed"] as const;
type Status = (typeof STATUSES)[number];

/** Statuses that keep an inquiry in the active (Processing) queue. */
const PROCESSING_STATUSES: Status[] = ["new", "in_progress", "quoted"];

/** Inquiry types, derived from the submitted data. */
const TYPES = [
  { id: "product", label: "Product inquiries" },
  { id: "bulk", label: "Bulk / wholesale inquiries" },
  { id: "general", label: "General inquiries" },
] as const;
type TypeId = (typeof TYPES)[number]["id"];

function inquiryType(row: Record<string, any>): TypeId {
  const quantity = String(row["quantity"] ?? "").trim();
  const hasProduct = Boolean(row["product_id"]) || String(row["product_name"] ?? "").trim().length > 0;
  if (quantity.length > 0 && !hasProduct) return "bulk";
  if (hasProduct) return "product";
  return "general";
}

export const Route = createFileRoute("/admin/inquiries")({
  ssr: false,
  component: InquiriesAdmin,
});

function InquiriesAdmin() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListInquiries);
  const update = useServerFn(adminUpdateInquiryStatus);
  const [activeType, setActiveType] = useState<TypeId>("product");

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: () => list({ data: undefined }),
  });

  const mutation = useMutation({
    mutationFn: (input: { id: string; status: Status }) => update({ data: input }),
    onSuccess: () => {
      toast.success("Status updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  const grouped = useMemo(() => {
    const empty = () =>
      Object.fromEntries(TYPES.map((type) => [type.id, [] as Record<string, any>[]])) as Record<
        TypeId,
        Record<string, any>[]
      >;
    const processing = empty();
    const closed = empty();
    for (const row of data ?? []) {
      const bucket = PROCESSING_STATUSES.includes(String(row["status"]) as Status) ? processing : closed;
      bucket[inquiryType(row)].push(row);
    }
    return { processing, closed };
  }, [data]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Inquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Quote requests submitted from the website, organised by type. Marking an inquiry as won or closed moves it
          into the Closed section for that type.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1">
        {TYPES.map((type) => {
          const count = grouped.processing[type.id].length;
          const isActive = activeType === type.id;
          return (
            <button
              key={type.id}
              type="button"
              onClick={() => setActiveType(type.id)}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {type.label}
              <span className="ml-2 rounded-full bg-foreground/10 px-1.5 py-0.5 text-[11px] tabular-nums">
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-8">
          <Section
            icon={<Inbox className="size-4" />}
            title="Processing"
            description="Open inquiries awaiting a quotation or follow-up."
            rows={grouped.processing[activeType]}
            emptyLabel="No inquiries in processing for this type."
            onStatusChange={(id, status) => mutation.mutate({ id, status })}
          />
          <Section
            icon={<Archive className="size-4" />}
            title="Closed"
            description="Won and closed inquiries, with all details retained."
            rows={grouped.closed[activeType]}
            emptyLabel="Nothing closed for this type yet."
            onStatusChange={(id, status) => mutation.mutate({ id, status })}
          />
        </div>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  description,
  rows,
  emptyLabel,
  onStatusChange,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  rows: Record<string, any>[];
  emptyLabel: string;
  onStatusChange: (id: string, status: Status) => void;
}) {
  return (
    <section className="space-y-3">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          {icon}
          {title}
          <span className="rounded-full bg-foreground/10 px-2 py-0.5 text-[11px] font-medium tabular-nums text-muted-foreground">
            {rows.length}
          </span>
        </h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-xl border border-border bg-surface p-6 text-sm text-muted-foreground">{emptyLabel}</p>
      ) : (
        <div className="space-y-3">
          {rows.map((row) => (
            <article key={String(row["id"])} className="rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {String(row["full_name"])}
                    {row["company"] ? ` · ${String(row["company"])}` : ""}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {String(row["email"])} {row["phone"] ? `· ${String(row["phone"])}` : ""}{" "}
                    {row["country"] ? `· ${String(row["country"])}` : ""}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">
                    {new Date(String(row["created_at"])).toLocaleString()}
                  </span>
                  <select
                    value={String(row["status"])}
                    onChange={(event) => onStatusChange(String(row["id"]), event.target.value as Status)}
                    className="h-9 rounded-md border border-input bg-background px-2 text-sm"
                  >
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {row["product_name"] ? (
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Product:</span> {String(row["product_name"])}
                  {row["quantity"] ? ` · Qty ${String(row["quantity"])}` : ""}
                </p>
              ) : row["quantity"] ? (
                <p className="mt-3 text-sm">
                  <span className="text-muted-foreground">Quantity:</span> {String(row["quantity"])}
                </p>
              ) : null}
              <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{String(row["message"])}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
