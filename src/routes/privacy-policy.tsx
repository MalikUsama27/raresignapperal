import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/site/PageShell";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | Axiom Sportswear" },
      {
        name: "description",
        content:
          "How Axiom Sportswear collects, uses and protects the information you submit through inquiry forms, email and WhatsApp.",
      },
      { property: "og:title", content: "Privacy Policy | Axiom Sportswear" },
      { property: "og:description", content: "How we handle inquiry data and business contact information." },
    ],
  }),
  component: PrivacyPage,
});

const SECTIONS = [
  {
    title: "Information we collect",
    body: "We collect the details you voluntarily submit through our inquiry forms, email or WhatsApp: name, company, email address, phone or WhatsApp number, country, product interest, quantities and your message. We do not collect payment card data on this website.",
  },
  {
    title: "How we use your information",
    body: "Your information is used solely to respond to your inquiry, prepare quotations and specification sheets, arrange samples and production, and provide shipping updates. We may contact you about the status of an order you placed or an inquiry you submitted.",
  },
  {
    title: "Sharing with third parties",
    body: "We do not sell or rent your data. Information is shared only where necessary to fulfil your order — for example with freight forwarders and customs brokers handling your shipment.",
  },
  {
    title: "Data retention",
    body: "Inquiry and order records are retained for as long as needed for commercial, accounting and export-compliance purposes. You may request deletion of your contact record at any time.",
  },
  {
    title: "Security",
    body: "Inquiries are transmitted over encrypted connections and stored in access-controlled systems. Only authorised members of our export team can view them.",
  },
  {
    title: "Cookies",
    body: "This website uses only the technical storage necessary to load pages and remember interface preferences. We do not run advertising trackers.",
  },
  {
    title: "Your rights",
    body: "You may request access to, correction of, or deletion of the personal data we hold about you by emailing our export team. We respond to verified requests within 30 days.",
  },
];

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy policy"
        description="This policy explains what information we collect when you contact Axiom Sportswear and how we use it."
      />
      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page max-w-3xl space-y-10">
          {SECTIONS.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-lg font-semibold">{section.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{section.body}</p>
            </div>
          ))}
          <p className="border-t border-border pt-8 text-xs text-muted-foreground">
            Questions about this policy? Email export@axiomsportswear.com.
          </p>
        </div>
      </section>
    </>
  );
}
