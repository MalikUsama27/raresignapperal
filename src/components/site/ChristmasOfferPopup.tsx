import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { ArrowRight, Gift, MessageCircle, Snowflake } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { whatsappLink } from "@/lib/whatsapp";

const STORAGE_KEY = "rsa-christmas-offer-dismissed";
const CHRISTMAS_MESSAGE =
  "Hello, I would like to claim the 15% Christmas offer on a custom sportswear order. Please share the offer details and a quotation.";

export function ChristmasOfferPopup() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const [open, setOpen] = useState(false);
  const isAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) {
      setOpen(false);
      return;
    }

    try {
      if (sessionStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      // Storage can be unavailable in privacy-restricted browsers.
    }

    const timer = window.setTimeout(() => setOpen(true), 800);
    return () => window.clearTimeout(timer);
  }, [isAdmin]);

  const dismiss = () => {
    setOpen(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // The popup still closes when storage is unavailable.
    }
  };

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => (nextOpen ? setOpen(true) : dismiss())}>
      <DialogContent className="w-[calc(100%-1.5rem)] max-w-lg overflow-hidden rounded-3xl border-primary/25 bg-popover p-0 shadow-glow">
        <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-primary/15 blur-3xl" />
        <Snowflake className="pointer-events-none absolute -right-5 top-16 size-32 rotate-12 text-primary/5" />

        <div className="relative px-6 pb-6 pt-8 sm:px-9 sm:pb-8 sm:pt-10">
          <p className="eyebrow flex items-center gap-2 pr-8">
            <Gift className="size-4" /> Christmas special
          </p>

          <DialogTitle className="font-display mt-5 text-5xl font-bold tracking-tight sm:text-6xl">
            <span className="text-gradient">15% OFF</span>
          </DialogTitle>
          <p className="font-display mt-3 text-xl font-semibold leading-snug sm:text-2xl">
            A little extra for your team this Christmas.
          </p>

          <DialogDescription className="mt-4 text-sm leading-relaxed sm:text-base">
            Celebrate the season with 15% off your custom sportswear order. Tell us what your team,
            club or brand needs and request your Christmas quote today.
          </DialogDescription>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a
              href={whatsappLink(CHRISTMAS_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={dismiss}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground transition-transform duration-300 hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <MessageCircle className="size-4" /> Claim 15% on WhatsApp
            </a>
            <DialogClose asChild>
              <Link
                to="/products"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md border border-border px-5 py-3.5 text-sm font-semibold transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Browse products <ArrowRight className="size-4" />
              </Link>
            </DialogClose>
          </div>

          <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
            Contact our sales team to confirm offer details and eligibility for your order.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
