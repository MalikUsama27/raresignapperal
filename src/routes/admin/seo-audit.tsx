import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Copy, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { analyzeSeoAudit } from "@/lib/seo-audit.functions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/admin/seo-audit")({
  ssr: false,
  head: () => ({ meta: [{ title: "SEO Audit Assistant — Admin" }, { name: "robots", content: "noindex" }] }),
  component: SeoAuditAdmin,
});

const PRIORITY_STYLE: Record<string, string> = {
  critical: "bg-destructive text-destructive-foreground",
  high: "bg-primary text-primary-foreground",
  medium: "bg-secondary text-secondary-foreground",
  low: "bg-muted text-muted-foreground",
};

function SeoAuditAdmin() {
  const analyze = useServerFn(analyzeSeoAudit);
  const [report, setReport] = useState("");
  const mutation = useMutation({
    mutationFn: () => analyze({ data: { report } }),
    onSuccess: (res) => res.error && toast.error(res.error),
    onError: (e: Error) => toast.error(e.message),
  });

  const onFile = async (file?: File) => {
    if (file) setReport((await file.text()).slice(0, 60000));
  };
  const result = mutation.data?.result;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight">SEO audit assistant</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste or upload an SEO audit report. AI prioritizes the findings and drafts page-specific fixes.
        </p>
      </div>

      <div className="space-y-3 rounded-xl border border-border bg-surface p-5">
        <Textarea
          value={report}
          onChange={(e) => setReport(e.target.value)}
          placeholder="Paste audit findings (Lighthouse, Search Console, Semrush, Ahrefs export…)"
          className="min-h-56 font-mono text-xs"
        />
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="file"
            accept=".txt,.csv,.json,.md,.html"
            onChange={(e) => onFile(e.target.files?.[0])}
            className="text-xs text-muted-foreground"
          />
          <Button
            className="ml-auto"
            disabled={report.trim().length < 20 || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? <Loader2 className="size-4 animate-spin" /> : <Sparkles className="size-4" />}
            {mutation.isPending ? "Analyzing…" : "Prioritize & draft fixes"}
          </Button>
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="rounded-xl border border-border bg-surface p-5 text-sm">{result.summary}</div>
          {result.findings.map((f, i) => (
            <div key={i} className="space-y-2 rounded-xl border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${PRIORITY_STYLE[f.priority]}`}>
                  {f.priority}
                </span>
                <span className="rounded-full border border-border px-2 py-0.5 font-mono text-xs">{f.page}</span>
                <span className="text-xs text-muted-foreground">{f.effort} effort</span>
              </div>
              <h3 className="font-display text-base font-semibold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.why}</p>
              <div className="relative rounded-lg bg-muted p-3">
                <pre className="whitespace-pre-wrap break-words pr-8 text-xs">{f.fix}</pre>
                <button
                  aria-label="Copy fix"
                  className="absolute right-2 top-2 text-muted-foreground hover:text-foreground"
                  onClick={() => navigator.clipboard.writeText(f.fix).then(() => toast.success("Fix copied"))}
                >
                  <Copy className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
