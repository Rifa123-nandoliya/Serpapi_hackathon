import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PricingCard } from "@/components/marketing/pricing-card";
import { SectionHeading } from "@/components/marketing/section-heading";
import { formatInr } from "@/lib/format";
import { PRICING_TIERS } from "@/lib/pricing";

const PREVIEW_IDS = ["starter", "pro", "incubator"];

export function PricingPreview() {
  const tiers = PRICING_TIERS.filter((t) => PREVIEW_IDS.includes(t.id));

  return (
    <section aria-labelledby="pricing-heading" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="pricing-heading"
          before="Pricing that"
          highlight="pays for itself"
          subtitle="One avoided wrong turn is worth more than a year of GapScope. Start free, upgrade when you start monitoring."
        />
        <div className="mx-auto mt-16 grid max-w-md items-end gap-8 lg:mt-24 lg:max-w-none lg:grid-cols-3">
          {tiers.map((tier) => (
            <PricingCard
              key={tier.id}
              name={tier.name}
              price={formatInr(tier.monthly)}
              description={tier.description}
              features={tier.features}
              popular={tier.popular}
              cta={{ label: "Get started", href: "/workspace/new" }}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 rounded-lg text-[15px] font-medium text-foreground underline-offset-4 hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            See all plans <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
