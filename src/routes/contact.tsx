import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import { siteSettingsQuery } from "@/lib/queries";
import { PageHero } from "@/components/site/PageShell";
import { InquiryForm } from "@/components/site/InquiryDialog";
import { GENERAL_WHATSAPP_MESSAGE, whatsappLink } from "@/lib/whatsapp";
import { Reveal } from "@/components/site/Reveal";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/contact")({
  head: () => ({
    links: [{ rel: "canonical", href: canonical("/contact") }],
    meta: [
      { property: "og:url", content: canonical("/contact") },
      { title: "Contact & Request a Quote | Rare Signs Apparel" },
      {
        name: "description",
        content:
          "Contact the Rare Signs Apparel export team by WhatsApp, email or inquiry form. Quotes with pricing and lead time returned within one business day.",
      },
      { property: "og:title", content: "Contact Rare Signs Apparel" },
      { property: "og:description", content: "Send your tech pack or reference and get a costed quote in 24 hours." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { data: settings } = useSuspenseQuery(siteSettingsQuery());

  const details = [
    { icon: Phone, label: "Phone", value: String(settings["phone"] ?? ""), href: `tel:${settings["phone"]}` },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: String(settings["whatsapp"] ?? ""),
      href: whatsappLink(GENERAL_WHATSAPP_MESSAGE),
    },
    { icon: Mail, label: "Email", value: String(settings["email"] ?? ""), href: `mailto:${settings["email"]}` },
    { icon: MapPin, label: "Factory", value: String(settings["address"] ?? "") },
    { icon: Clock, label: "Hours", value: String(settings["working_hours"] ?? "") },
  ];

  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the export desk directly"
        description="Send your product list, quantities and artwork. You will get a spec sheet with lead time and indicative pricing within one business day."
      />

      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <h2 className="font-display text-xl font-semibold">Contact details</h2>
            <dl className="mt-7 space-y-5">
              {details.map((item) => (
                <div key={item.label} className="flex gap-4">
                  <item.icon className="mt-0.5 size-4 shrink-0 text-primary" />
                  <div>
                    <dt className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">{item.label}</dt>
                    <dd className="mt-1 text-sm">
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className="hover:text-primary"
                        >
                          {item.value}
                        </a>
                      ) : (
                        item.value
                      )}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>

            <a
              href={whatsappLink(GENERAL_WHATSAPP_MESSAGE)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-9 inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground"
            >
              <MessageCircle className="size-4" /> Chat on WhatsApp
            </a>

            <div className="mt-9">
              <h3 className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Follow us</h3>
              <SocialLinks settings={settings as Record<string, string>} className="mt-3" />
            </div>
          </div>

          <Reveal>
            <div className="rounded-2xl border border-border bg-surface p-7 md:p-9">
              <h2 className="font-display text-xl font-semibold">Request a quote</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                All fields marked required. We reply from a real person on our export team.
              </p>
              <div className="mt-7">
                <InquiryForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
