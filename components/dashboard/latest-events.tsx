"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { EVENT_TYPE, RelativeTime, SEVERITY, SeverityBadge, simulatedWeek } from "@/components/monitoring/event-meta";
import type { MonitoringEvent } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

export function LatestEvents({ events, startupId }: { events: MonitoringEvent[]; startupId: string }) {
  const now = useNow(30_000);
  const latest = events.slice(0, 5);

  return (
    <section className="rounded-3xl border border-border bg-card p-5 sm:p-6" aria-labelledby="latest-events-heading">
      <div className="flex items-center justify-between gap-3">
        <h2 id="latest-events-heading" className="text-base font-semibold text-foreground">
          Latest changes
        </h2>
        <Link
          href={`/workspace/${startupId}?tab=monitoring`}
          className="inline-flex items-center gap-1 rounded text-sm font-medium text-brand hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Full feed <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
      {latest.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">No changes yet.</p>
      ) : (
        <ol className="mt-4 space-y-2" aria-label="Five most recent monitoring events">
          {latest.map((event) => {
            const Icon = EVENT_TYPE[event.type].icon;
            const week = simulatedWeek(event);
            return (
              <li key={event.id} className="relative overflow-hidden rounded-2xl border border-border bg-background py-3 pr-3 pl-4">
                <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1", SEVERITY[event.severity].stripe)} />
                <div className="flex items-center gap-2">
                  <SeverityBadge level={event.severity} />
                  <Icon aria-hidden="true" className="size-3.5 text-muted-foreground" />
                  {week !== null && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-brand">
                      <Sparkles aria-hidden="true" className="size-3" /> Week {week}
                    </span>
                  )}
                  <span className="ml-auto text-xs whitespace-nowrap text-muted-foreground">
                    <RelativeTime iso={event.at} now={now} />
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-foreground">{event.title}</p>
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
