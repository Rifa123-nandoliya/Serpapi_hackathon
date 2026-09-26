import { Check, Minus } from "lucide-react";

import { PRICING_COMPARISON, PRICING_TIERS, type TierId } from "@/lib/pricing";
import { cn } from "@/lib/utils";

function Cell({ value }: { value: boolean | string }) {
  if (value === true) {
    return (
      <>
        <Check aria-hidden="true" className="mx-auto size-5 text-brand" strokeWidth={2.5} />
        <span className="sr-only">Included</span>
      </>
    );
  }
  if (value === false) {
    return (
      <>
        <Minus aria-hidden="true" className="mx-auto size-4 text-neutral-300 dark:text-neutral-600" />
        <span className="sr-only">Not included</span>
      </>
    );
  }
  return <span className="text-sm font-medium text-foreground">{value}</span>;
}

const POPULAR: TierId = "pro";

export function ComparisonTable() {
  return (
    <section aria-labelledby="compare-heading" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 id="compare-heading" className="text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Compare <span className="text-gradient-brand">every plan</span>
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-base text-muted-foreground sm:text-lg">
          Every plan includes sources and confidence intervals. Paid plans add monitoring and alerts.
        </p>

        {/* The table scrolls inside its own container on small screens; the page body never does. */}
        <div className="relative mt-12 overflow-x-auto rounded-3xl border border-border bg-background shadow-soft">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <caption className="sr-only">Feature comparison of GapScope plans</caption>
            <thead>
              <tr className="border-b border-border">
                <th scope="col" className="sticky left-0 z-10 bg-background px-5 py-5 text-sm font-medium text-muted-foreground sm:px-6">
                  Features
                </th>
                {PRICING_TIERS.map((tier) => (
                  <th
                    key={tier.id}
                    scope="col"
                    className={cn(
                      "px-4 py-5 text-center text-base font-semibold text-foreground",
                      tier.id === POPULAR && "bg-brand-soft/60",
                    )}
                  >
                    {tier.name}
                    {tier.id === POPULAR && (
                      <span className="mt-1 block text-xs font-medium text-brand">Most popular</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            {PRICING_COMPARISON.map((group) => (
              <tbody key={group.title}>
                <tr className="bg-card">
                  <th
                    scope="colgroup"
                    colSpan={PRICING_TIERS.length + 1}
                    className="sticky left-0 bg-card px-5 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase sm:px-6"
                  >
                    {group.title}
                  </th>
                </tr>
                {group.rows.map((row) => (
                  <tr key={row.feature} className="border-t border-border">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 bg-background px-5 py-4 text-sm font-normal text-foreground/80 sm:px-6"
                    >
                      {row.feature}
                    </th>
                    {PRICING_TIERS.map((tier) => (
                      <td
                        key={tier.id}
                        className={cn("px-4 py-4 text-center", tier.id === POPULAR && "bg-brand-soft/60")}
                      >
                        <Cell value={row.values[tier.id]} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            ))}
          </table>
        </div>
      </div>
    </section>
  );
}
