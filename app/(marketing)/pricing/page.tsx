import type { Metadata } from "next";

import { HeroBackground } from "@/components/marketing/hero-background";
import { SectionHeading } from "@/components/marketing/section-heading";
import { ComparisonTable } from "@/components/pricing/comparison-table";
import { PricingFaq } from "@/components/pricing/pricing-faq";
import { PricingPlans } from "@/components/pricing/pricing-plans";

export const metadata: Metadata = {
  title: "Pricing",
  description: "GapScope plans for founders and incubators. Start free; pay yearly and get 2 months free.",
};

export default function PricingPage() {
  return (
    <>
      <section aria-labelledby="pricing-heading" className="relative isolate overflow-hidden px-4 pt-32 pb-20 sm:px-6 sm:pt-40 lg:px-8">
        <HeroBackground className="[mask-image:linear-gradient(to_bottom,transparent,black_40%,black_60%,transparent)]" />
        <SectionHeading
          as="h1"
          id="pricing-heading"
          before="Simple pricing,"
          highlight="real evidence"
          subtitle="Start free with one report. Upgrade when you want GapScope to watch your competitors for you."
          className="max-w-4xl"
        />
        <div className="mx-auto mt-10 max-w-7xl">
          <PricingPlans />
        </div>
      </section>
      <ComparisonTable />
      <PricingFaq />
    </>
  );
}
