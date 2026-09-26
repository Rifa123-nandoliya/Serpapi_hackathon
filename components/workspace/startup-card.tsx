"use client";

import Link from "next/link";
import { formatDistance, parseISO } from "date-fns";
import { ArrowUpRight, BellRing, ChartColumn, Clock, Loader2, Orbit, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatRelativeShort } from "@/lib/format";
import type { StartupOverview } from "@/lib/types";
import { cn } from "@/lib/utils";

type StartupCardProps = { overview: StartupOverview; now: number | null };

export function StartupCard({ overview, now }: StartupCardProps) {
  const { startup, summary } = overview;
  const updated = now ? formatRelativeShort(summary.lastUpdatedAt, now) : null;
  const updatedTitle = now ? formatDistance(parseISO(summary.lastUpdatedAt), now, { addSuffix: true }) : undefined;

  return (
    <article className="group flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-soft transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-float motion-reduce:hover:translate-y-0">
      <div className="flex items-start gap-3">
        <span
          aria-hidden="true"
          className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-lg font-semibold text-brand"
        >
          {startup.name.charAt(0).toUpperCase()}
        </span>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold tracking-tight text-foreground">
            <Link
              href={`/workspace/${startup.id}`}
              className="rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {startup.name}
            </Link>
          </h2>
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            <Badge variant="secondary" className="border-border">
              {startup.mode === "idea" ? "Idea" : "Existing startup"}
            </Badge>
            {startup.nearestNeighbourMode && (
              <Badge className="bg-brand-soft text-brand">
                <Orbit aria-hidden="true" />
                Nearest-neighbour
              </Badge>
            )}
            {startup.status === "analysing" && (
              <Badge variant="outline">
                <Loader2 aria-hidden="true" className="animate-spin" />
                Analysing
              </Badge>
            )}
          </div>
        </div>
      </div>

      <p className="mt-4 mb-5 line-clamp-2 text-[15px] leading-relaxed text-muted-foreground">{startup.idea}</p>

      <dl className="mt-auto grid grid-cols-3 gap-2 border-t border-border pt-4 text-sm">
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Users aria-hidden="true" className="size-3.5 shrink-0" /> Competitors
          </dt>
          <dd className="mt-1 text-base font-semibold text-foreground">{summary.competitorsMonitored}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <BellRing aria-hidden="true" className="size-3.5 shrink-0" /> Alerts
          </dt>
          <dd className={cn("mt-1 text-base font-semibold", summary.openAlerts > 0 ? "text-brand" : "text-foreground")}>
            {summary.openAlerts}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock aria-hidden="true" className="size-3.5 shrink-0" /> Updated
          </dt>
          <dd className="mt-1 truncate text-base font-semibold text-foreground" title={updatedTitle}>
            {updated ?? <span className="inline-block h-4 w-16 animate-pulse rounded bg-muted align-middle" />}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex gap-2">
        <Button asChild variant="gradient" size="lg" className="flex-1 rounded-lg">
          <Link href={`/workspace/${startup.id}`} aria-label={`Open report for ${startup.name}`}>
            Report
            <ArrowUpRight aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variant="subtle" size="lg" className="flex-1 rounded-lg">
          <Link href={`/dashboard/${startup.id}`} aria-label={`Open dashboard for ${startup.name}`}>
            <ChartColumn aria-hidden="true" />
            Dashboard
          </Link>
        </Button>
      </div>
    </article>
  );
}
