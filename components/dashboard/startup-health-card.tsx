"use client";

import Link from "next/link";
import { ArrowUpRight, BellRing, Orbit } from "lucide-react";
import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts";

import { SeverityBadge } from "@/components/monitoring/event-meta";
import type { StartupOverview } from "@/lib/types";
import { cn } from "@/lib/utils";

import { shortDate, TOOLTIP_STYLE } from "./chart-parts";
import { healthTier } from "./health";

function Sparkline({ points }: { points: StartupOverview["summary"]["ratingSparkline"] }) {
  if (points.length < 2) return <p className="text-xs text-muted-foreground">Not enough data yet.</p>;
  const first = points[0].value;
  const last = points[points.length - 1].value;
  const delta = last - first;

  return (
    <div>
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-xs text-muted-foreground">Avg competitor rating, 12 weeks</p>
        <p className="text-sm font-semibold text-foreground tabular-nums">
          {last.toFixed(2)}★{" "}
          <span className="text-xs font-normal text-muted-foreground">
            ({delta >= 0 ? "+" : ""}
            {delta.toFixed(2)})
          </span>
        </p>
      </div>
      <div className="mt-2 h-14 w-full" role="img" aria-label={`Average competitor rating went from ${first.toFixed(2)} to ${last.toFixed(2)} stars over 12 weeks.`}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={points} margin={{ top: 4, right: 6, bottom: 4, left: 6 }}>
            <YAxis hide domain={["dataMin - 0.03", "dataMax + 0.03"]} />
            <Tooltip
              {...TOOLTIP_STYLE}
              cursor={{ stroke: "var(--border)" }}
              labelFormatter={(_, payload) => {
                const date = payload?.[0]?.payload?.date;
                return typeof date === "string" ? `Week of ${shortDate(date)}` : "";
              }}
              formatter={(v) => [typeof v === "number" ? `${v.toFixed(2)}★` : String(v), "Avg rating"]}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="var(--muted-foreground)"
              strokeWidth={2}
              isAnimationActive={false}
              dot={(props: { cx?: number; cy?: number; index?: number }) =>
                props.index === points.length - 1 && props.cx !== undefined && props.cy !== undefined ? (
                  <circle key="last" cx={props.cx} cy={props.cy} r={4} fill="var(--brand)" stroke="var(--card)" strokeWidth={2} />
                ) : (
                  <g key={`d-${props.index}`} />
                )
              }
              activeDot={{ r: 4, fill: "var(--brand)", stroke: "var(--card)", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function StartupHealthCard({ overview }: { overview: StartupOverview }) {
  const { startup, summary } = overview;
  const tier = healthTier(summary.healthScore);

  return (
    <article className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 shadow-soft transition-[box-shadow,transform] hover:-translate-y-0.5 hover:shadow-float motion-reduce:hover:translate-y-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold tracking-tight text-foreground">
            <Link
              href={`/dashboard/${startup.id}`}
              className="rounded focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              {startup.name}
            </Link>
          </h3>
          <p className="mt-0.5 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
            {startup.nearestNeighbourMode && <Orbit aria-hidden="true" className="size-3.5 text-brand" />}
            {startup.category} · {startup.location}
          </p>
        </div>
        <ArrowUpRight aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
      </div>

      <div className="mt-5 space-y-4">
        <div>
          <div className="flex items-baseline justify-between gap-2">
            <p className="text-xs text-muted-foreground">Health score</p>
            <p className={cn("text-xs font-medium", tier.text)}>{tier.label}</p>
          </div>
          <p className="mt-1 text-3xl font-bold tracking-tight text-foreground tabular-nums">
            {summary.healthScore}
            <span className="text-sm font-medium text-muted-foreground">/100</span>
          </p>
          <div
            className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted"
            role="meter"
            aria-label="Health score"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={summary.healthScore}
          >
            <div className={cn("h-full rounded-full", tier.bar)} style={{ width: `${summary.healthScore}%` }} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <BellRing aria-hidden="true" className="size-3.5" /> Open alerts
            </p>
            <p className={cn("mt-1 text-3xl font-bold tracking-tight tabular-nums", summary.openAlerts > 0 ? "text-brand" : "text-foreground")}>
              {summary.openAlerts}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Highest risk</p>
            <div className="mt-2.5">
              <SeverityBadge level={summary.highestRisk} suffix="risk" className="px-2 py-1 text-xs" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex-1 border-t border-border pt-4">
        <Sparkline points={summary.ratingSparkline} />
      </div>

      <Link
        href={`/dashboard/${startup.id}`}
        className="mt-4 inline-flex items-center gap-1 self-start rounded text-sm font-medium text-brand hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        aria-label={`Open dashboard for ${startup.name}`}
      >
        Open dashboard
        <ArrowUpRight aria-hidden="true" className="size-4" />
      </Link>
    </article>
  );
}
