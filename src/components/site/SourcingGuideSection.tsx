import { Link } from "@tanstack/react-router";
import { countryMarket } from "@/lib/country-markets";
import { sourcingGuideFor } from "@/lib/sourcing-guide";

export function SourcingGuideSection({ name, parent }: { name: string; parent?: string | null }) {
  const g = sourcingGuideFor(name, parent);
  return (
    <section className="border-t border-border py-16 md:py-20">
      <div className="container-page grid gap-12 lg:grid-cols-2">
        <div>
          <p className="eyebrow">B2B sourcing guide</p>
          <h2 className="mt-3 font-display text-2xl font-semibold">Custom {name} manufacturer for teams & wholesalers</h2>
          <div className="mt-5 space-y-4 text-sm leading-relaxed text-muted-foreground">
            {g.intro.map((p) => (
              <p key={p.slice(0, 40)}>{p}</p>
            ))}
          </div>
          {g.specs.length ? (
            <dl className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface px-6">
              {g.specs.map(([k, v]) => (
                <div key={k} className="grid grid-cols-[8rem_1fr] gap-4 py-3 text-sm">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </div>
        <div>
          <h2 className="font-display text-xl font-semibold">Buyer questions</h2>
          <div className="mt-5 space-y-3">
            {g.faqs.map((f) => (
              <details key={f.q} className="rounded-xl border border-border p-4">
                <summary className="cursor-pointer text-sm font-semibold">{f.q}</summary>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
              </details>
            ))}
          </div>
          <h3 className="mt-8 font-display text-base font-semibold">Related buyer guides</h3>
          <ul className="mt-3 space-y-2 text-sm">
            {g.guides.map((b) => (
              <li key={b.slug}>
                <Link to="/blog/$slug" params={{ slug: b.slug }} className="text-primary hover:underline">{b.label}</Link>
              </li>
            ))}
          </ul>
          {g.markets?.length ? (
            <p className="mt-6 text-sm text-muted-foreground">
              Exporting to:{" "}
              {g.markets.map((slug, i) => {
                const m = countryMarket(slug);
                return m ? (
                  <span key={slug}>
                    {i ? " · " : ""}
                    <Link to="/export-markets/$country" params={{ country: slug }} className="text-primary hover:underline">{m.name}</Link>
                  </span>
                ) : null;
              })}
            </p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
