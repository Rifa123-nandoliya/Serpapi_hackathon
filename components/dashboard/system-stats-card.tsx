"use client";

import { CircleAlert, Database, RotateCw, Timer, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatIndianNumber } from "@/lib/format";
import { useSystemStats } from "@/lib/queries";
import { formatPct } from "@/lib/stats";

export function SystemStatsCard() {
  const { data, isPending, isError, refetch } = useSystemStats();

  if (isPending) return <Skeleton aria-label="Loading system stats" className="h-56 rounded-3xl" />;
  if (isError) {
    return (
      <div role="alert" className="flex items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6">
        <p className="flex items-center gap-2 text-sm text-foreground">
          <CircleAlert aria-hidden="true" className="size-4 text-destructive" /> Couldn&apos;t load system stats.
        </p>
        <Button variant="subtle" size="sm" onClick={() => refetch()}>
          <RotateCw aria-hidden="true" /> Retry
        </Button>
      </div>
    );
  }

  const speedup = Math.round(data.avgReportTimeColdSec / data.avgReportTimeCachedSec);
  const cachedWidth = (data.avgReportTimeCachedSec / data.avgReportTimeColdSec) * 100;

  return (
    <section aria-labelledby="system-heading" className="rounded-3xl border border-border bg-card p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="system-heading" className="text-base font-semibold text-foreground">
          System stats
        </h2>
        <p className="text-xs text-muted-foreground">
          {data.reportsGenerated} reports · {data.competitorsMonitored} competitors watched ·{" "}
          {formatIndianNumber(data.serpCallsThisMonth)} SerpApi calls this month
        </p>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Database aria-hidden="true" className="size-4" /> Cache hit rate
          </p>
          <p className="mt-2 text-5xl font-bold tracking-tight text-foreground">{formatPct(data.cacheHitRate, 0)}</p>
          <div
            className="mt-3 h-2 overflow-hidden rounded-full bg-brand-soft"
            role="meter"
            aria-label="Cache hit rate"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(data.cacheHitRate * 100)}
          >
            <div className="h-full rounded-full bg-brand" style={{ width: `${data.cacheHitRate * 100}%` }} />
          </div>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Zap aria-hidden="true" className="size-4" /> API calls saved
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">{formatIndianNumber(data.apiCallsSaved)}</p>
          <p className="mt-2 text-sm text-muted-foreground">Served from cache instead of a new SerpApi search.</p>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Timer aria-hidden="true" className="size-4" /> Avg report time
          </p>
          <p className="mt-2 text-4xl font-bold tracking-tight text-foreground">
            {data.avgReportTimeCachedSec}s <span className="text-base font-medium text-muted-foreground">cached</span>
          </p>
          <div className="mt-3 space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-12 text-muted-foreground">Cached</span>
              <span className="h-2 flex-1 rounded-full bg-muted">
                <span className="block h-full rounded-full bg-brand" style={{ width: `${Math.max(cachedWidth, 2)}%` }} />
              </span>
              <span className="w-9 text-right font-medium text-foreground tabular-nums">{data.avgReportTimeCachedSec}s</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-12 text-muted-foreground">Cold</span>
              <span className="h-2 flex-1 rounded-full bg-muted">
                <span className="block h-full w-full rounded-full bg-inactive" />
              </span>
              <span className="w-9 text-right font-medium text-foreground tabular-nums">{data.avgReportTimeColdSec}s</span>
            </div>
            <p className="pt-1 text-muted-foreground">{speedup}× faster when cached</p>
          </div>
        </div>
      </div>
    </section>
  );
}
