import { useEffect, useState } from "react";
import { Mail, MessageCircle, Wrench, X } from "lucide-react";
import { GENERAL_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/whatsapp";
import { cn } from "@/lib/utils";

/** Launch date — the alert hides itself automatically once this passes. */
const LAUNCH_DATE = new Date("2026-09-15T00:00:00+05:00");
const STORAGE_KEY = "rsa-launch-alert-dismissed";

function remaining(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export function MaintenanceAlert({ email }: { email?: string | undefined }) {
  const [open, setOpen] = useState(false);
  const [left, setLeft] = useState<ReturnType<typeof remaining>>(null);

  useEffect(() => {
    if (remaining(LAUNCH_DATE) === null) return;
    if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    setLeft(remaining(LAUNCH_DATE));
    const timer = window.setTimeout(() => setOpen(true), 900);
    const tick = window.setInterval(() => {
      const next = remaining(LAUNCH_DATE);
      setLeft(next);
      if (next === null) setOpen(false);
    }, 1000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(tick);
    };
  }, []);

  if (!open || !left) return null;

  const close = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const units = [
    { label: "Days", value: left.days },
    { label: "Hours", value: left.hours },
    { label: "Mins", value: left.minutes },
    { label: "Secs", value: left.seconds },
  ];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Website launch announcement"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-background/80 p-3 backdrop-blur-sm sm:items-center sm:p-6 animate-in fade-in duration-300"
    >
      <div
        className={cn(
          "glass-panel relative w-full max-w-xl overflow-hidden rounded-3xl border border-border px-6 py-8 sm:px-9 sm:py-10",
          "animate-in slide-in-from-bottom-6 duration-500 ease-out",
        )}
      >
        <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-primary/15 blur-3xl" />
        <button
          type="button"
          onClick={close}
          aria-label="Close announcement"
          className="absolute right-4 top-4 inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <X className="size-4" />
        </button>

        <p className="eyebrow flex items-center gap-2">
          <Wrench className="size-3.5 text-primary" /> Website maintenance
        </p>
        <h2 className="font-display mt-3 text-2xl font-bold tracking-tight sm:text-3xl">
          Website launching <span className="text-primary">15 September</span>
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Our website is currently under maintenance and improvements. Online ordering will be fully available
          from 15 September.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold text-foreground">Our orders and factory operations are running as
          normal.</span>{" "}
          For orders, quotations or inquiries, contact us directly on WhatsApp or by email.
        </p>

        <div className="mt-7 grid grid-cols-4 gap-2 sm:gap-3">
          {units.map((unit) => (
            <div
              key={unit.label}
              className="rounded-xl border border-border bg-surface px-2 py-3 text-center sm:py-4"
            >
              <div className="font-display text-xl font-bold tabular-nums text-primary sm:text-2xl">
                {String(unit.value).padStart(2, "0")}
              </div>
              <div className="mt-1 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {unit.label}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-col gap-2.5 sm:flex-row">
          <a
            href={whatsappLink(GENERAL_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
          >
            <MessageCircle className="size-4" /> WhatsApp +92 333 7408106
          </a>
          <a
            href={`mailto:${email ?? "export@raresignsapparel.com"}`}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border px-5 py-3.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
          >
            <Mail className="size-4" /> Email us
          </a>
        </div>
      </div>
    </div>
  );
}
