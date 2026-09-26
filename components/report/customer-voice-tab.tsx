"use client";

import { useMemo, useState } from "react";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { formatIndianNumber } from "@/lib/format";
import { clusterStats, formatPct } from "@/lib/stats";
import { cn } from "@/lib/utils";

import { ClusterCard } from "./cluster-card";
import { ClusterMap, ShapeSwatch } from "./cluster-map";
import { Panel, SectionHeader } from "./section-header";
import type { TabProps } from "./types";

export function CustomerVoiceTab({ report, freshness }: TabProps) {
  const { clusters, competitors, clusterQuality } = report;
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const indexOf = useMemo(() => {
    const map = new Map(clusters.map((c, i) => [c.id, i]));
    return (id: string) => map.get(id) ?? 0;
  }, [clusters]);

  const byImpact = useMemo(
    () => [...clusters].sort((a, b) => clusterStats(b).impact - clusterStats(a).impact),
    [clusters],
  );

  const toggle = (id: string) => setSelectedId((cur) => (cur === id ? null : id));
  const visible = selectedId ? byImpact.filter((c) => c.id === selectedId) : byImpact;
  const focus = clusters.find((c) => c.id === selectedId) ?? byImpact[0];
  const maxShare = focus ? Math.max(...focus.byCompetitor.map((b) => b.share), 0.0001) : 1;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Customer voice"
        description={`${formatIndianNumber(report.totalReviews)} reviews grouped into themes by meaning. Shares and 95% confidence intervals are computed from the counts.`}
        aside={freshness("customerVoice")}
      />

      <Panel>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">Cluster map</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Each mark is a review, placed by meaning. Click a cluster or its name to filter.
            </p>
          </div>
          <Badge variant="outline" className="h-7 px-3 text-xs">
            {clusterQuality.k} clusters · silhouette {clusterQuality.silhouette.toFixed(2)}
          </Badge>
        </div>

        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Filter by cluster">
          {clusters.map((c) => {
            const i = indexOf(c.id);
            const active = selectedId === c.id;
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(c.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium text-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    active ? "border-brand/50 bg-brand-soft" : "border-border bg-background hover:bg-muted",
                    selectedId && !active && "text-muted-foreground",
                  )}
                >
                  <ShapeSwatch index={i} dimmed={Boolean(selectedId) && !active} />
                  {c.label}
                </button>
              </li>
            );
          })}
          {selectedId && (
            <li>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-brand hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <X aria-hidden="true" className="size-3.5" /> Show all
              </button>
            </li>
          )}
        </ul>

        <div className="mt-2" role="img" aria-label="Scatter plot of reviews coloured by cluster. The cluster cards below list the same data.">
          <ClusterMap clusters={clusters} indexOf={indexOf} selectedId={selectedId} onSelect={toggle} />
        </div>
      </Panel>

      <div>
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {selectedId ? "Selected cluster" : "All clusters, by impact"}
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Impact = share × 100 × (5 − average rating). Clusters with fewer than 30 reviews are marked low confidence.
        </p>
        <ul className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visible.map((c) => (
            <li key={c.id}>
              <ClusterCard
                cluster={c}
                index={indexOf(c.id)}
                competitors={competitors}
                selected={selectedId === c.id}
                onSelect={() => toggle(c.id)}
              />
            </li>
          ))}
        </ul>
      </div>

      {focus && (
        <Panel>
          <h3 className="text-base font-semibold text-foreground">
            &ldquo;{focus.label}&rdquo; across {competitors.length} {competitors.length === 1 ? "competitor" : "competitors"}
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Share of each {report.competitors[0]?.similarity !== undefined ? "neighbour" : "competitor"}&apos;s reviews
            in this cluster.{!selectedId && " Select a cluster above to compare another theme."}
          </p>
          <ul className="mt-5 space-y-3">
            {focus.byCompetitor.map((row) => {
              const name = competitors.find((c) => c.id === row.competitorId)?.name ?? row.competitorId;
              return (
                <li key={row.competitorId} className="grid grid-cols-[minmax(0,9rem)_1fr_3.5rem] items-center gap-3 text-sm sm:grid-cols-[12rem_1fr_4rem]">
                  <span className="truncate text-foreground" title={name}>
                    {name}
                  </span>
                  <span className="h-2.5 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                    <span
                      className="block h-full rounded-full bg-[linear-gradient(90deg,var(--brand),var(--brand-light))]"
                      style={{ width: `${(row.share / maxShare) * 100}%` }}
                    />
                  </span>
                  <span className="text-right font-semibold text-foreground tabular-nums">{formatPct(row.share)}</span>
                </li>
              );
            })}
          </ul>
        </Panel>
      )}
    </div>
  );
}
