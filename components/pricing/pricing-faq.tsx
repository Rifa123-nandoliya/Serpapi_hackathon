import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  {
    q: "Where does GapScope get its data?",
    a: "From live searches across Google Search, Google Maps, the Play Store, the App Store, Google Trends, Google Jobs, Google News and Google Shopping. Every number in a report links back to the page it came from.",
  },
  {
    q: "What does the 95% confidence interval mean?",
    a: "It is the range the true share of complaints most likely falls in. For example, 41 of 1,240 reviews (3.3%) has an interval of 2.4–4.5%. Small clusters get wider intervals, and anything under 30 reviews is marked \"Low confidence\".",
  },
  {
    q: "What if my idea has no competitors?",
    a: "GapScope switches to nearest-neighbour mode. It finds the 5 closest products that solve the same problem, serve the same customer or use the same business model, and analyses their reviews instead.",
  },
  {
    q: "How does yearly billing work?",
    a: "You pay for 10 months and get 12, so yearly plans cost the monthly price × 10. The Free plan stays free either way.",
  },
  {
    q: "Can I change or cancel my plan?",
    a: "Yes. You can upgrade, downgrade or cancel at any time, and the change applies from your next billing period.",
  },
  {
    q: "Is my startup idea kept private?",
    a: "Yes. In this demo, the startups you add are stored only in your own browser. They are used to run your reports and are never shared.",
  },
];

export function PricingFaq() {
  return (
    <section aria-labelledby="faq-heading" className="px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
      <div className="mx-auto max-w-3xl">
        <h2 id="faq-heading" className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Frequently asked <span className="text-gradient-brand">questions</span>
        </h2>
        <Accordion type="single" collapsible className="mt-10 rounded-3xl border border-border bg-card px-5 sm:px-8">
          {FAQS.map((faq, i) => (
            <AccordionItem key={faq.q} value={`faq-${i}`}>
              <AccordionTrigger className="py-5 text-base font-medium text-foreground hover:no-underline">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-[15px] leading-relaxed text-muted-foreground">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
