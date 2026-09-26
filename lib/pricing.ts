export type PricingTier = {
  id: "free" | "starter" | "pro" | "incubator";
  name: string;
  /** Monthly price in ₹. Yearly = monthly × 10 (2 months free). */
  monthly: number;
  description: string;
  features: string[];
  popular?: boolean;
};

export const PRICING_TIERS: PricingTier[] = [
  {
    id: "free",
    name: "Free",
    monthly: 0,
    description: "Try GapScope on one idea.",
    features: ["1 report per month", "Sources on every claim", "No monitoring"],
  },
  {
    id: "starter",
    name: "Starter",
    monthly: 999,
    description: "For founders validating their first idea.",
    features: [
      "5 reports per month",
      "3 competitors watched weekly",
      "Email alerts",
      "Sources on every claim",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    monthly: 2999,
    description: "For founders building and watching their market.",
    popular: true,
    features: [
      "Unlimited reports",
      "10 competitors watched daily",
      "Telegram + email alerts",
      "PDF export",
      "Risk Radar with kill criteria",
    ],
  },
  {
    id: "incubator",
    name: "Incubator",
    monthly: 9999,
    description: "For incubators and accelerators running cohorts.",
    features: [
      "20+ startup workspaces",
      "White-label reports",
      "Everything in Pro",
      "Priority support",
    ],
  },
];

export const YEARLY_MULTIPLIER = 10;

export type TierId = PricingTier["id"];

export type ComparisonRow = {
  feature: string;
  /** true = included, false = not included, string = a specific limit. */
  values: Record<TierId, boolean | string>;
};

export type ComparisonGroup = { title: string; rows: ComparisonRow[] };

export const PRICING_COMPARISON: ComparisonGroup[] = [
  {
    title: "Reports",
    rows: [
      { feature: "Reports per month", values: { free: "1", starter: "5", pro: "Unlimited", incubator: "Unlimited" } },
      { feature: "Startup workspaces", values: { free: "1", starter: "3", pro: "5", incubator: "20+" } },
      { feature: "Sources on every claim", values: { free: true, starter: true, pro: true, incubator: true } },
      { feature: "95% confidence intervals", values: { free: true, starter: true, pro: true, incubator: true } },
      { feature: "Nearest-neighbour mode", values: { free: true, starter: true, pro: true, incubator: true } },
      { feature: "30-60-90 day plan", values: { free: true, starter: true, pro: true, incubator: true } },
    ],
  },
  {
    title: "Monitoring",
    rows: [
      { feature: "Competitors watched", values: { free: false, starter: "3", pro: "10", incubator: "10 per startup" } },
      { feature: "Check frequency", values: { free: false, starter: "Weekly", pro: "Daily", incubator: "Daily" } },
      { feature: "Email alerts", values: { free: false, starter: true, pro: true, incubator: true } },
      { feature: "Telegram alerts", values: { free: false, starter: false, pro: true, incubator: true } },
      { feature: "Risk Radar with kill criteria", values: { free: false, starter: false, pro: true, incubator: true } },
    ],
  },
  {
    title: "Sharing & support",
    rows: [
      { feature: "PDF export", values: { free: false, starter: false, pro: true, incubator: true } },
      { feature: "White-label reports", values: { free: false, starter: false, pro: false, incubator: true } },
      { feature: "Priority support", values: { free: false, starter: false, pro: false, incubator: true } },
    ],
  },
];

/** Price for the chosen billing period (yearly = monthly × 10, i.e. 2 months free). */
export function priceFor(tier: PricingTier, billing: "monthly" | "yearly"): number {
  return billing === "yearly" ? tier.monthly * YEARLY_MULTIPLIER : tier.monthly;
}
