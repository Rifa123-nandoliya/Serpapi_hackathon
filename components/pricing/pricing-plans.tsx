"use client";

import { useId, useState } from "react";

import { PricingCard } from "@/components/marketing/pricing-card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { formatInr } from "@/lib/format";
import { PRICING_TIERS, priceFor, YEARLY_MULTIPLIER } from "@/lib/pricing";
import { cn } from "@/lib/utils";

type Billing = "monthly" | "yearly";

export function PricingPlans() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const switchId = useId();
  const yearly = billing === "yearly";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Label
          htmlFor={switchId}
          className={cn("cursor-pointer text-[15px]", yearly ? "text-muted-foreground" : "text-foreground")}
        >
          Monthly
        </Label>
        <Switch
          id={switchId}
          checked={yearly}
          onCheckedChange={(checked) => setBilling(checked ? "yearly" : "monthly")}
          aria-label="Bill yearly"
          className="data-[state=checked]:bg-brand"
        />
        <Label
          htmlFor={switchId}
          className={cn("cursor-pointer text-[15px]", yearly ? "text-foreground" : "text-muted-foreground")}
        >
          Yearly
        </Label>
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">
          2 months free
        </span>
      </div>

      <p aria-live="polite" className="sr-only">
        {yearly ? "Showing yearly prices" : "Showing monthly prices"}
      </p>

      <div className="mx-auto mt-16 grid max-w-md gap-8 md:max-w-none md:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-5">
        {PRICING_TIERS.map((tier) => {
          const price = priceFor(tier, billing);
          const isFree = tier.monthly === 0;
          const perMonth = Math.round((tier.monthly * YEARLY_MULTIPLIER) / 12);
          return (
            <PricingCard
              key={tier.id}
              name={tier.name}
              price={formatInr(price)}
              period={isFree ? "forever" : yearly ? "/year" : "/month"}
              priceNote={
                yearly && !isFree
                  ? `${formatInr(perMonth)}/month billed yearly, save ${formatInr(tier.monthly * 2)}`
                  : undefined
              }
              description={tier.description}
              features={tier.features}
              popular={tier.popular}
              compact
              cta={{ label: isFree ? "Start free" : "Get started", href: "/workspace/new" }}
            />
          );
        })}
      </div>
    </div>
  );
}
