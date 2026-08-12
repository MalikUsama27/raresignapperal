import { motion, useReducedMotion } from "motion/react";

export type MapCountry = { id: string; name: string; code: string; region: string | null; lat: number; lng: number };

const ORIGIN = { lat: 32.5, lng: 74.5 };

function project(lat: number, lng: number) {
  return { x: ((lng + 180) / 360) * 100, y: ((90 - lat) / 180) * 100 };
}

export function WorldMap({ countries }: { countries: MapCountry[] }) {
  const reduce = useReducedMotion();
  const origin = project(ORIGIN.lat, ORIGIN.lng);

  return (
    <div className="relative aspect-16/9 w-full overflow-hidden rounded-2xl border border-border bg-panel">
      <svg viewBox="0 0 100 56" className="absolute inset-0 size-full" role="img" aria-label="Axiom Sportswear export destinations">
        <defs>
          <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="arcStroke" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.05" />
            <stop offset="55%" stopColor="var(--color-primary)" stopOpacity="0.7" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.18" />
          </linearGradient>
        </defs>

        <rect width="100" height="56" fill="url(#mapGlow)" />

        {/* graticule */}
        <g stroke="currentColor" className="text-muted-foreground/15" strokeWidth="0.12">
          {Array.from({ length: 11 }, (_, i) => (
            <line key={`v${i}`} x1={i * 10} y1="0" x2={i * 10} y2="56" />
          ))}
          {Array.from({ length: 7 }, (_, i) => (
            <line key={`h${i}`} x1="0" y1={i * 9.33} x2="100" y2={i * 9.33} />
          ))}
        </g>

        {/* dotted latitude bands to suggest continents */}
        <g className="text-muted-foreground/25" fill="currentColor">
          {Array.from({ length: 44 }, (_, row) =>
            Array.from({ length: 78 }, (_, col) => {
              const x = 1.5 + col * 1.26;
              const y = 1.5 + row * 1.24;
              const lat = 90 - (y / 56) * 180;
              const lng = (x / 100) * 360 - 180;
              const land =
                // rough landmass bands, purely decorative
                (lng > -170 && lng < -50 && lat > 8 && lat < 72) ||
                (lng > -82 && lng < -34 && lat > -55 && lat < 12) ||
                (lng > -12 && lng < 42 && lat > 35 && lat < 70) ||
                (lng > -18 && lng < 52 && lat > -35 && lat < 34) ||
                (lng > 42 && lng < 150 && lat > 8 && lat < 72) ||
                (lng > 95 && lng < 142 && lat > -10 && lat < 24) ||
                (lng > 112 && lng < 155 && lat > -40 && lat < -12) ||
                (lng > 166 && lng < 179 && lat > -47 && lat < -34);
              if (!land) return null;
              return <circle key={`${row}-${col}`} cx={x} cy={y * 0.62 + 6} r="0.28" />;
            }),
          )}
        </g>

        {/* arcs */}
        <g fill="none" stroke="url(#arcStroke)" strokeWidth="0.22" strokeLinecap="round">
          {countries.map((country, index) => {
            const target = project(Number(country.lat), Number(country.lng));
            const x1 = origin.x;
            const y1 = origin.y * 0.62 + 6;
            const x2 = target.x;
            const y2 = target.y * 0.62 + 6;
            const cx = (x1 + x2) / 2;
            const cy = Math.min(y1, y2) - Math.abs(x2 - x1) * 0.22 - 2;
            const d = `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
            return reduce ? (
              <path key={country.id} d={d} />
            ) : (
              <motion.path
                key={country.id}
                d={d}
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.6, delay: 0.08 * index, ease: "easeInOut" }}
              />
            );
          })}
        </g>

        {/* markers */}
        <g>
          {countries.map((country, index) => {
            const p = project(Number(country.lat), Number(country.lng));
            const cx = p.x;
            const cy = p.y * 0.62 + 6;
            return (
              <g key={`m-${country.id}`}>
                <circle cx={cx} cy={cy} r="1.5" className="fill-primary/15" />
                <motion.circle
                  cx={cx}
                  cy={cy}
                  r="0.55"
                  className="fill-primary"
                  initial={reduce ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.06, type: "spring", stiffness: 260, damping: 18 }}
                />
                <text
                  x={cx + 2.2}
                  y={cy + 0.6}
                  className="fill-foreground/70 font-sans"
                  style={{ fontSize: "1.5px", letterSpacing: "0.06em" }}
                >
                  {country.code}
                </text>
              </g>
            );
          })}
          <circle cx={origin.x} cy={origin.y * 0.62 + 6} r="0.8" className="fill-foreground" />
          <text
            x={origin.x - 1}
            y={origin.y * 0.62 + 9.2}
            className="fill-foreground/80 font-sans"
            style={{ fontSize: "1.6px", letterSpacing: "0.08em" }}
          >
            SIALKOT · HQ
          </text>
        </g>
      </svg>
    </div>
  );
}
