import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { faqsQuery } from "@/lib/queries";
import { CtaSection, PageHero } from "@/components/site/PageShell";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { canonical } from "@/lib/site";

export const Route = createFileRoute("/faq")({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(faqsQuery());
  },
  head: () => ({
    links: [{ rel: "canonical", href: canonical("/faq") }],
    meta: [
      { property: "og:url", content: canonical("/faq") },
      { title: "FAQ | MOQs, Lead Times & Shipping | Rare Signs Apparel" },
      {
        name: "description",
        content:
          "Answers on minimum order quantities, sampling, lead times, customisation, payment terms and worldwide shipping for custom sportswear orders.",
      },
      { property: "og:title", content: "Frequently Asked Questions | Rare Signs Apparel" },
      { property: "og:description", content: "MOQs, samples, lead times, payment terms and shipping explained." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { data: faqs } = useSuspenseQuery(faqsQuery());

  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="Everything buyers ask before the first order"
        description="If your question is not covered here, message the export team on WhatsApp — replies usually arrive within a few hours during working days."
      />

      <section className="border-t border-border py-20 md:py-28">
        <div className="container-page max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id} className="border-border">
                <AccordionTrigger className="text-left font-display text-base">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <CtaSection />
    </>
  );
}
