import { ExternalLink } from "lucide-react";

import { formatPct } from "@/lib/stats";
import { sourceLabel } from "@/lib/sources";
import { cn } from "@/lib/utils";

import { gapEvidence, sortedGaps } from "./gap-helpers";
import { SectionHeader } from "./section-header";
import type { TabProps } from "./types";

export function GapsTab({ report, freshness }: TabProps) {
  const gaps = sortedGaps(report);
  const n = report.competitors.length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Gap leaderboard"
        description="Ranked by Opportunity Score, which combines complaint share, search demand and how few competitors already solve it."
        aside={freshness("gaps")}
      />
      <ol className="space-y-4">
        {gaps.map((gap, i) => {
          const ev = gapEvidence(report, gap);
          const covered = Math.round(gap.competitorCoverage * n);
          return (
            <li key={gap.id} className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <div className="flex gap-4">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold",
                    i === 0
                      ? "bg-[linear-gradient(180deg,var(--brand-light),var(--brand))] text-white"
                      : "bg-background text-foreground ring-1 ring-border",
                  )}
                >
                  {i + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                    <h3 className="text-lg font-semibold tracking-tight text-foreground">{gap.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Opportunity Score{" "}
                      <span className="text-2xl font-bold tracking-tight text-foreground">{gap.opportunityScore}</span>
                      <span className="text-muted-foreground">/100</span>
                    </p>
                  </div>
                  <div
                    className="mt-3 h-2.5 overflow-hidden rounded-full bg-muted"
                    role="img"
                    aria-label={`Opportunity Score ${gap.opportunityScore} out of 100`}
                  >
                    <div
                      className={cn(
                        "h-full rounded-full",
                        i === 0 ? "bg-[linear-gradient(90deg,var(--brand),var(--brand-light))]" : "bg-neutral-400 dark:bg-neutral-500",
                      )}
                      style={{ width: `${gap.opportunityScore}%` }}
                    />
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{gap.summary}</p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                    <div>
                      <dt className="text-xs text-muted-foreground">Complaint share</dt>
                      <dd className="mt-0.5 font-semibold text-foreground">
                        {formatPct(ev?.share ?? gap.complaintShare)}
                        {ev && (
                          <span className="block text-xs font-normal text-muted-foreground">
                            95% CI {formatPct(ev.ci.low)}–{formatPct(ev.ci.high)}
                          </span>
                        )}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Search demand</dt>
                      <dd className="mt-0.5 font-semibold text-foreground">{gap.demandScore}/100</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Competitors covering it</dt>
                      <dd className="mt-0.5 font-semibold text-foreground">
                        {covered} of {n}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-muted-foreground">Cluster</dt>
                      <dd className="mt-0.5 truncate font-semibold text-foreground">{ev?.cluster.label ?? "–"}</dd>
                    </div>
                  </dl>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">Evidence:</span>
                    {gap.evidenceUrls.map((url, j) => (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-background px-2.5 py-1 text-xs font-medium text-foreground ring-1 ring-border hover:text-brand hover:ring-brand/40 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      >
                        [{j + 1}] {sourceLabel(url)}
                        <ExternalLink aria-hidden="true" className="size-3" />
                        <span className="sr-only">(opens in a new tab)</span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
