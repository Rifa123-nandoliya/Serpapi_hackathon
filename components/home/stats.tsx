import { SectionHeading } from "@/components/marketing/section-heading";
import { StatCard } from "@/components/marketing/stat-card";

const STATS = [
  { value: "8", label: "search engines per report" },
  { value: "100%", label: "claims linked to a source" },
  { value: "Daily", label: "competitor checks" },
  { value: "95%", label: "confidence intervals on every gap" },
];

export function Stats() {
  return (
    <section aria-labelledby="stats-heading" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="stats-heading"
          size="sm"
          before="Evidence with"
          highlight="NO guesswork"
          subtitle="Every number in a GapScope report comes from real reviews, searches, job posts and news, with the source one click away."
        />
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STATS.map((stat) => (
            <StatCard key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}
