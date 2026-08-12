import { MessageCircle } from "lucide-react";
import { GENERAL_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/whatsapp";

export function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink(GENERAL_WHATSAPP_MESSAGE)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with our export team on WhatsApp"
      className="group fixed bottom-5 right-5 z-40 flex items-center gap-2.5 rounded-full border border-primary/40 bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-[var(--shadow-glow)] transition-transform duration-300 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:bottom-7 sm:right-7"
    >
      <span className="relative flex size-5 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-primary-foreground/30 animate-pulse-ring" aria-hidden />
        <MessageCircle className="size-5" />
      </span>
      <span className="hidden sm:inline">WhatsApp us</span>
    </a>
  );
}
