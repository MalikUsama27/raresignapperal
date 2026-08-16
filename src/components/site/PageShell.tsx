import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Reveal } from "./Reveal";
import { GENERAL_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/whatsapp";
import { InquiryDialog } from "./InquiryDialog";

export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-hero pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="container-page relative">
        <Reveal>
          <p className="eyebrow">{eyebrow}</p>
          <h1 className="display-xl mt-4 max-w-4xl text-balance">{title}</h1>
          {description ? (
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">{description}</p>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </Reveal>
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { label: string; to?: string; params?: Record<string, string> }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <Link to="/" className="hover:text-foreground">
        Home
      </Link>
      {items.map((item) => (
        <span key={item.label} className="flex items-center gap-2">
          <span aria-hidden>/</span>
          {item.to ? (
            <Link to={item.to} params={item.params as never} className="hover:text-foreground">
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function CtaSection() {
  return (
    <section className="border-t border-border bg-surface">
      <div className="container-page py-20 md:py-28">
        <Reveal className="glass-panel relative overflow-hidden rounded-3xl px-6 py-14 text-center md:px-16">
          <div className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-primary/15 blur-3xl" />
          <p className="eyebrow">Start your order</p>
          <h2 className="display-lg mx-auto mt-4 max-w-2xl text-balance">
            Ready to build your next kit programme?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Send us your tech pack, sketch or reference sample. You will receive a spec sheet and indicative
            pricing within one business day.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <InquiryDialog
              trigger={
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.02]"
                >
                  Request a quote <ArrowRight className="size-4" />
                </button>
              }
            />
            <a
              href={whatsappLink(GENERAL_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary"
            >
              <MessageCircle className="size-4" /> WhatsApp us
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
