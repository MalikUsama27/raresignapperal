import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/searches")({
  ssr: false,
  head: () => ({ meta: [{ title: "Site searches — Admin" }, { name: "robots", content: "noindex" }] }),
  component: SearchesAdmin,
});

type Row = { term: string; result_count: number; created_at: string };
type Summary = { term: string; count: number; results: number; last: string };

function summarise(rows: Row[], zeroOnly: boolean): Summary[] {
  const map = new Map<string, Summary>();
  for (const r of rows) {
    if (zeroOnly && r.result_count > 0) continue;
    const s = map.get(r.term) ?? { term: r.term, count: 0, results: r.result_count, last: r.created_at };
    s.count += 1;
    if (r.created_at > s.last) { s.last = r.created_at; s.results = r.result_count; }
    map.set(r.term, s);
  }
  return [...map.values()].sort((a, b) => b.count - a.count).slice(0, 50);
}

function SearchesAdmin() {
  const [days, setDays] = useState(30);
  const { data = [], isLoading, error } = useQuery({
    queryKey: ["admin", "search-logs", days],
    queryFn: async () => {
      const since = new Date(Date.now() - days * 86400000).toISOString();
      const { data, error } = await supabase.from("search_logs").select("term, result_count, created_at")
        .gte("created_at", since).order("created_at", { ascending: false }).limit(5000);
      if (error) throw error;
      return data as Row[];
    },
  });
  const popular = useMemo(() => summarise(data, false), [data]);
  const zero = useMemo(() => summarise(data, true), [data]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight">Site searches</h1>
          <p className="mt-1 text-sm text-muted-foreground">What visitors type into the product search, and which searches found nothing.</p>
        </div>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="rounded-md border border-border bg-surface px-3 py-2 text-sm">
          <option value={7}>Last 7 days</option><option value={30}>Last 30 days</option><option value={90}>Last 90 days</option>
        </select>
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Stat label="Total searches" value={data.length} />
        <Stat label="Different terms" value={new Set(data.map((r) => r.term)).size} />
        <Stat label="Searches with no results" value={data.filter((r) => r.result_count === 0).length} />
      </div>
      {error ? <p className="text-sm text-destructive">Couldn't load searches.</p> : null}
      {isLoading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
        <div className="grid gap-5 lg:grid-cols-2">
          <Table title="Popular search terms" rows={popular} empty="No searches yet." />
          <Table title="Searches with no results" rows={zero} empty="Every search found products." highlight />
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-xl border border-border bg-surface p-4"><p className="text-xs text-muted-foreground">{label}</p><p className="mt-1 font-display text-2xl font-semibold">{value.toLocaleString("en-US")}</p></div>;
}

function Table({ title, rows, empty, highlight }: { title: string; rows: Summary[]; empty: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <h2 className="font-display text-lg font-semibold">{title}</h2>
      {rows.length === 0 ? <p className="mt-3 text-sm text-muted-foreground">{empty}</p> : (
        <table className="mt-3 w-full text-sm">
          <thead><tr className="text-left text-xs text-muted-foreground"><th className="py-2">Term</th><th>Searches</th>{highlight ? <th>Last searched</th> : <th>Results</th>}</tr></thead>
          <tbody>{rows.map((r) => (
            <tr key={r.term} className="border-t border-border">
              <td className="py-2 pr-2 font-medium break-all">{r.term}</td><td>{r.count}</td>
              <td className={highlight ? "text-muted-foreground" : r.results === 0 ? "text-destructive" : ""}>{highlight ? new Date(r.last).toLocaleDateString("en-GB") : r.results}</td>
            </tr>))}</tbody>
        </table>
      )}
    </div>
  );
}
