"use client";

import { ArrowDownRight, ArrowUpRight, ExternalLink, Sparkles, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatIndianNumber } from "@/lib/format";
import { sourceLabel } from "@/lib/sources";
import { clusterStats, formatPct, formatPts, LOW_CONFIDENCE_THRESHOLD } from "@/lib/stats";
import type { ClusterInsight, Competitor } from "@/lib/types";
import { cn } from "@/lib/utils";

import { ShapeSwatch } from "./cluster-map";

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          aria-hidden="true"
          className={cn("size-3.5", i < rating ? "fill-amber-400 text-amber-400" : "text-neutral-300 dark:text-neutral-600")}
        />
      ))}
    </span>
  );
}

type ClusterCardProps = {
  cluster: ClusterInsight;
  index: number;
  competitors: Competitor[];
  selected: boolean;
  onSelect: () => void;
};

export function ClusterCard({ cluster, index, competitors, selected, onSelect }: ClusterCardProps) {
  const stats = clusterStats(cluster);
  const nameOf = (id: string) => competitors.find((c) => c.id === id)?.name ?? id;

  return (
    <article
      className={cn(
        "flex flex-col rounded-3xl border bg-card p-5 transition-shadow",
        selected ? "border-brand/50 shadow-float" : "border-border",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={onSelect}
          aria-pressed={selected}
          className="flex min-w-0 items-start gap-2 rounded text-left focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          <span className="mt-1.5 flex"><ShapeSwatch index={index} /></span>
          <h3 className="font-semibold leading-snug text-foreground">{cluster.label}</h3>
        </button>
        {stats.lowConfidence && (
          <Badge variant="outline" className="shrink-0 border-amber-300 text-amber-700 dark:border-amber-500/40 dark:text-amber-400">
            Low confidence
          </Badge>
        )}
      </div>

      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-foreground">{formatPct(stats.share)}</span>
        <span className="text-sm text-muted-foreground">
          {formatIndianNumber(cluster.count)} of {formatIndianNumber(cluster.total)} reviews
        </span>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        95% CI {formatPct(stats.ci.low)}–{formatPct(stats.ci.high)}
        {stats.lowConfidence && <> · fewer than {LOW_CONFIDENCE_THRESHOLD} reviews</>}
      </p>

      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Avg rating</dt>
          <dd className="mt-0.5 flex items-center gap-1 font-semibold text-foreground">
            <Star aria-hidden="true" className="size-3.5 fill-amber-400 text-amber-400" />
            {cluster.avgRating.toFixed(1)}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Trend</dt>
          <dd className="mt-0.5 flex items-center gap-1 font-semibold whitespace-nowrap text-foreground">
            {cluster.trendDelta === null ? (
              <>
                <Sparkles aria-hidden="true" className="size-3.5 text-muted-foreground" /> New
              </>
            ) : (
              <>
                {cluster.trendDelta >= 0 ? (
                  <ArrowUpRight aria-hidden="true" className="size-3.5 text-muted-foreground" />
                ) : (
                  <ArrowDownRight aria-hidden="true" className="size-3.5 text-muted-foreground" />
                )}
                {formatPts(cluster.trendDelta)}
              </>
            )}
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">Impact</dt>
          <dd className="mt-0.5 font-semibold text-foreground">{stats.impact.toFixed(1)}</dd>
        </div>
      </dl>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="subtle" size="sm" className="mt-5 w-full rounded-lg">
            View sources
          </Button>
        </DialogTrigger>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{cluster.label}</DialogTitle>
            <DialogDescription>
              Sample reviews from this cluster ({formatIndianNumber(cluster.count)} in total). Each links to where it was
              posted.
            </DialogDescription>
          </DialogHeader>
          <ul className="space-y-3">
            {cluster.samples.map((sample) => (
              <li key={sample.text} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <Stars rating={sample.rating} />
                  <span className="truncate text-xs text-muted-foreground">{nameOf(sample.competitorId)}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-foreground">&ldquo;{sample.text}&rdquo;</p>
                <a
                  href={sample.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 rounded text-xs font-medium text-brand hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {sourceLabel(sample.sourceUrl)}
                  <ExternalLink aria-hidden="true" className="size-3" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </DialogContent>
      </Dialog>
    </article>
  );
}
