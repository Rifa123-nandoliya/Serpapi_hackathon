import { ArrowRight, Layers, MessageSquareText, Target, Users } from "lucide-react";

import { formatIndianNumber } from "@/lib/format";
import { formatPct } from "@/lib/stats";

import { gapEvidence, sortedGaps } from "./gap-helpers";
import { NearestNeighbourBanner } from "./nn-banner";
import { Panel, SectionHeader } from "./section-header";
import type { TabProps } from "./types";

export function OverviewTab({ report, startup, freshness, onOpenGaps }: TabProps & { onOpenGaps: () => void }) {
  const gaps = sortedGaps(report);
  const top = gaps.slice(0, 3);
  const nn = startup.nearestNeighbourMode;

  const numbers = [
    { label: "Reviews analysed", value: formatIndianNumber(report.totalReviews), icon: MessageSquareText },
    { label: nn ? "Nearest neighbours" : "Direct competitors", value: String(report.competitors.length), icon: Users },
    {
      label: `Clusters · silhouette ${report.clusterQuality.silhouette.toFixed(2)}`,
      value: String(report.clusterQuality.k),
      icon: Layers,
    },
    { label: "Top Opportunity Score", value: gaps[0] ? String(gaps[0].opportunityScore) : "–", icon: Target },
  ];

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Overview"
        description="The headline numbers and the three biggest opportunities."
        aside={freshness("overview")}
      />

      {nn && <NearestNeighbourBanner neighbours={report.competitors} />}

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {numbers.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-3xl border border-border bg-card p-5">
            <dt className="flex items-center gap-2 text-sm text-muted-foreground">
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span className="truncate">{label}</span>
            </dt>
            <dd className="mt-3 text-3xl font-bold tracking-tight text-foreground">{value}</dd>
          </div>
        ))}
      </dl>

      <div>
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">Top 3 gaps</h3>
          <button
            type="button"
            onClick={onOpenGaps}
            className="inline-flex items-center gap-1 rounded text-sm font-medium text-brand hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            All gaps <ArrowRight aria-hidden="true" className="size-4" />
          </button>
        </div>
        <ol className="mt-4 grid gap-4 lg:grid-cols-3">
          {top.map((gap, i) => {
            const ev = gapEvidence(report, gap);
            return (
              <li key={gap.id} className="flex flex-col rounded-3xl border border-border bg-card p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-brand">#{i + 1}</span>
                  <span className="rounded-full bg-background px-2.5 py-1 text-xs font-medium text-foreground ring-1 ring-border">
                    Score {gap.opportunityScore}
                  </span>
                </div>
                <h4 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{gap.title}</h4>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{gap.summary}</p>
                {ev && (
                  <p className="mt-4 border-t border-border pt-4 text-sm text-foreground">
                    <span className="font-semibold">{formatPct(ev.share)}</span> of reviews
                    <span className="text-muted-foreground">
                      {" "}
                      · 95% CI {formatPct(ev.ci.low)}–{formatPct(ev.ci.high)}
                    </span>
                  </p>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      <Panel>
        <p className="text-sm font-medium text-muted-foreground">Suggested positioning</p>
        <p className="mt-2 text-lg font-medium tracking-tight text-foreground">&ldquo;{report.positioning}&rdquo;</p>
      </Panel>
    </div>
  );
}
