"use client";

import { Copy, ExternalLink, OctagonX, Scale, Swords, TrendingDown, type LucideIcon } from "lucide-react";

import { SEVERITY, SeverityBadge } from "@/components/monitoring/event-meta";
import { sourceLabel } from "@/lib/sources";
import type { Risk, RiskCategory, Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

export const RISK_CATEGORY: Record<RiskCategory, { label: string; icon: LucideIcon }> = {
  market: { label: "Market", icon: TrendingDown },
  competition: { label: "Competition", icon: Swords },
  copy: { label: "Copy", icon: Copy },
  regulatory: { label: "Regulatory", icon: Scale },
};

const CATEGORIES: RiskCategory[] = ["market", "competition", "copy", "regulatory"];

function highest(risks: Risk[]): Severity | null {
  if (risks.length === 0) return null;
  return risks.reduce<Severity>((max, r) => (SEVERITY[r.level].rank > SEVERITY[max].rank ? r.level : max), "low");
}

export function RiskRadar({ risks }: { risks: Risk[] }) {
  const sorted = [...risks].sort((a, b) => SEVERITY[b.level].rank - SEVERITY[a.level].rank);

  return (
    <div className="space-y-4">
      {/* One tile per category showing its highest level */}
      <ul className="grid grid-cols-2 gap-3 2xl:grid-cols-4" aria-label="Highest risk level per category">
        {CATEGORIES.map((cat) => {
          const inCat = risks.filter((r) => r.category === cat);
          const level = highest(inCat);
          const { label, icon: Icon } = RISK_CATEGORY[cat];
          return (
            <li key={cat} className="relative overflow-hidden rounded-2xl border border-border bg-card p-4">
              <span aria-hidden="true" className={cn("absolute inset-x-0 top-0 h-1", level ? SEVERITY[level].stripe : "bg-muted")} />
              <p className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Icon aria-hidden="true" className="size-4 text-muted-foreground" />
                {label}
              </p>
              <div className="mt-3 flex items-center justify-between gap-2">
                {level ? <SeverityBadge level={level} suffix="risk" /> : <span className="text-xs text-muted-foreground">No risks found</span>}
                <span className="text-xs text-muted-foreground">
                  {inCat.length} {inCat.length === 1 ? "risk" : "risks"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>

      {sorted.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
          No risks identified yet.
        </p>
      ) : (
        <ul className="grid gap-4 lg:grid-cols-2">
          {sorted.map((risk) => {
            const { label, icon: Icon } = RISK_CATEGORY[risk.category];
            return (
              <li key={risk.id} className="relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card p-5 pl-6">
                <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1", SEVERITY[risk.level].stripe)} />
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    <Icon aria-hidden="true" className="size-3.5" />
                    {label}
                  </span>
                  <SeverityBadge level={risk.level} suffix="risk" />
                </div>
                <h4 className="mt-3 font-semibold text-foreground">{risk.title}</h4>
                <p className="mt-3 text-xs font-medium text-muted-foreground">Evidence</p>
                <ul className="mt-1.5 space-y-1.5">
                  {risk.evidence.map((line, i) => {
                    const url = risk.evidenceUrls[i];
                    return (
                      <li key={line} className="flex gap-2 text-sm text-foreground/90">
                        <span aria-hidden="true" className="mt-2 size-1 shrink-0 rounded-full bg-muted-foreground" />
                        <span>
                          {line}
                          {url && (
                            <>
                              {" "}
                              <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-0.5 rounded text-xs font-medium whitespace-nowrap text-brand hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                              >
                                {sourceLabel(url)}
                                <ExternalLink aria-hidden="true" className="size-3" />
                                <span className="sr-only">(opens in a new tab)</span>
                              </a>
                            </>
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 rounded-2xl border border-border bg-background p-3">
                  <p className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <OctagonX aria-hidden="true" className="size-3.5 text-risk-high" />
                    Kill criterion
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{risk.killCriterion}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
