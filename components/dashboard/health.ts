/** Health score tiers (status colours are always shown with a text label). */
export function healthTier(score: number): { label: string; text: string; bar: string } {
  if (score >= 70) return { label: "Healthy", text: "text-emerald-700 dark:text-emerald-400", bar: "bg-emerald-500" };
  if (score >= 50) return { label: "Watch", text: "text-amber-700 dark:text-amber-400", bar: "bg-risk-medium" };
  return { label: "At risk", text: "text-red-700 dark:text-red-400", bar: "bg-risk-high" };
}
