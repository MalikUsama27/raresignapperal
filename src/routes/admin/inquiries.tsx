import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminListInquiries, adminUpdateInquiryStatus } from "@/lib/admin.functions";

const STATUSES = ["new", "in_progress", "quoted", "won", "closed"] as const;

export const Route = createFileRoute("/admin/inquiries")({
  ssr: false,
  component: InquiriesAdmin,
});

function InquiriesAdmin() {
  const queryClient = useQueryClient();
  const list = useServerFn(adminListInquiries);
  const update = useServerFn(adminUpdateInquiryStatus);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "inquiries"],
    queryFn: () => list({ data: undefined }),
  });

  const mutation = useMutation({
    mutationFn: (input: { id: string; status: (typeof STATUSES)[number] }) => update({ data: input }),
    onSuccess: () => {
      toast.success("Status updated");
      void queryClient.invalidateQueries({ queryKey: ["admin", "inquiries"] });
    },
    onError: (error: Error) => toast.error(error.message),
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">Inquiries</h1>
        <p className="mt-1 text-sm text-muted-foreground">Quote requests submitted from the website.</p>
      </div>

      {isLoading ? (
        <div className="flex min-h-[30vh] items-center justify-center text-muted-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {(data ?? []).length === 0 ? (
            <p className="rounded-xl border border-border bg-surface p-6 text-sm text-muted-foreground">
              No inquiries yet.
            </p>
          ) : (
            (data ?? []).map((row) => (
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
                      onChange={(event) =>
                        mutation.mutate({
                          id: String(row["id"]),
                          status: event.target.value as (typeof STATUSES)[number],
                        })
                      }
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
                ) : null}
                <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">{String(row["message"])}</p>
              </article>
            ))
          )}
        </div>
      )}
    </div>
  );
}
