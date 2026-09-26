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
