import { Link } from "@tanstack/react-router";
import { Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { GENERAL_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/whatsapp";
import { BrandLogo } from "./BrandLogo";
import type { NavCategory } from "@/lib/catalog.functions";

const QUICK_LINKS = [
  { label: "About us", to: "/about" },
  { label: "Manufacturing", to: "/manufacturing" },
  { label: "Customization", to: "/customization" },
  { label: "Export markets", to: "/export-markets" },
  { label: "Insights", to: "/blog" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
] as const;

export function Footer({
  settings,
  categories,
}: {
  settings: Record<string, string>;
  categories: NavCategory[];
}) {

  return (
    <footer className="border-t border-border bg-surface">
      <div className="container-page grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <BrandLogo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">{settings?.["footer_note"]}</p>
          <a
            href={whatsappLink(GENERAL_WHATSAPP_MESSAGE)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
          >
            <MessageCircle className="size-4" /> WhatsApp our export team
          </a>
          <SocialLinks settings={settings} className="mt-6" />
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em]">Categories</h2>
          <ul className="mt-4 space-y-2.5">
            {categories.slice(0, 7).map((category) => (
              <li key={category.id}>
                <Link
                  to="/category/$slug"
                  params={{ slug: category.slug }}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {category.name}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/products" className="text-sm font-medium text-primary">
                All products
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em]">Company</h2>
          <ul className="mt-4 space-y-2.5">
            {QUICK_LINKS.map((link) => (
              <li key={link.to}>
                <Link to={link.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="font-display text-sm font-semibold uppercase tracking-[0.16em]">Contact</h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2.5">
              <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
              <span>{settings?.["address"]}</span>
            </li>
            <li className="flex gap-2.5">
              <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
              <a href={`tel:${settings?.["phone"]?.replace(/\s/g, "")}`} className="hover:text-foreground">
                {settings?.["phone"]}
              </a>
            </li>
            <li className="flex gap-2.5">
              <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
              <a href={`mailto:${settings?.["email"]}`} className="hover:text-foreground">
                {settings?.["email"]}
              </a>
            </li>
            <li className="flex gap-2.5">
              <MessageCircle className="mt-0.5 size-4 shrink-0 text-primary" />
              <a
                href={whatsappLink(GENERAL_WHATSAPP_MESSAGE)}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground"
              >
                {settings?.["whatsapp_display"]}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container-page flex flex-col gap-3 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings?.["company_legal_name"] ?? "Rare Signs Apparel"}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:text-foreground">
              Privacy policy
            </Link>
            <Link to="/terms" className="hover:text-foreground">
              Terms &amp; conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
