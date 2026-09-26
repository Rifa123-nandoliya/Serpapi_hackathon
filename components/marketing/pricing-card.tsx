import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { CheckList } from "./check-list";

export type PricingCardProps = {
  name: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  cta: { label: string; href: string };
  popular?: boolean;
  className?: string;
};

/**
 * Grey outer frame + white inner card. The popular tier gets an orange frame
 * and extra top space so it stands taller (07-pricing.png).
 */
export function PricingCard({
  name,
  price,
  period = "/month",
  description,
  features,
  cta,
  popular = false,
  className,
}: PricingCardProps) {
  return (
    <div
      className={cn(
        "rounded-[2rem] p-2.5 sm:p-3",
        popular
          ? "bg-[linear-gradient(180deg,#F6A36F_0%,var(--brand-light)_40%,var(--brand)_100%)] shadow-[0_24px_48px_-20px_rgb(240_90_40/0.45)] md:-mt-10"
          : "bg-[linear-gradient(180deg,#E0E0E0_0%,#EDEDED_50%,#F5F5F5_100%)] dark:bg-[linear-gradient(180deg,#2a2a2a,#1a1a1a)]",
        className,
      )}
    >
      <div
        className={cn(
          "flex h-full flex-col rounded-[1.5rem] bg-background p-6 shadow-[0_1px_2px_rgb(0_0_0/0.06)] sm:p-7",
          popular && "md:pt-10",
        )}
      >
        <div className="flex items-center gap-2">
          <span className="inline-flex rounded-full border border-border bg-background px-4 py-1.5 text-base font-medium text-foreground shadow-xs">
            {name}
          </span>
          {popular && (
            <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand">
              Most popular
            </span>
          )}
        </div>

        <p className="mt-6 flex items-baseline gap-1.5">
          <span className="text-5xl font-bold tracking-tight text-foreground">{price}</span>
          {period && <span className="text-lg text-muted-foreground">{period}</span>}
        </p>
        {description && <p className="mt-3 text-[15px] text-muted-foreground">{description}</p>}

        <Button asChild variant="gradient" size="xl" className="mt-6 w-full">
          <Link href={cta.href}>{cta.label}</Link>
        </Button>

        <CheckList items={features} className="mt-7" />
      </div>
    </div>
  );
}
