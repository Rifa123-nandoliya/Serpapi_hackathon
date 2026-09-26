"use client";

import { useState } from "react";
import { Check, ExternalLink, Minus, Star } from "lucide-react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

import { Badge } from "@/components/ui/badge";
import type { Competitor, NeighbourType } from "@/lib/types";
import { cn } from "@/lib/utils";

import { seriesColor } from "./chart-theme";
import { Panel, SectionHeader } from "./section-header";
import type { TabProps } from "./types";

export const NEIGHBOUR_LABEL: Record<NeighbourType, string> = {
  same_problem: "Same problem",
  same_customer: "Same customer",
  same_model: "Same business model",
};

export function NeighbourBadges({ competitor }: { competitor: Competitor }) {
  if (competitor.similarity === undefined) return null;
  return (
    <span className="flex flex-wrap gap-1.5">
      <Badge className="bg-brand-soft text-brand">{competitor.similarity}% similar</Badge>
      {competitor.neighbourType && (
        <Badge variant="outline">{NEIGHBOUR_LABEL[competitor.neighbourType]}</Badge>
      )}
    </span>
  );
}

function CompetitorRadar({ report }: Pick<TabProps, "report">) {
  const { competitors, radarAxes } = report;
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const data = radarAxes.map((axis) => ({
    axis,
    ...Object.fromEntries(competitors.map((c) => [c.id, c.radarScores[axis] ?? 0])),
  }));

  function toggle(id: string) {
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < competitors.length - 1) next.add(id);
      return next;
    });
  }

  return (
    <Panel>
      <h3 className="text-base font-semibold text-foreground">How they compare</h3>
      <p className="mt-1 text-sm text-muted-foreground">Scores 0–100 on each axis. Click a name to hide or show it.</p>
      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Competitors in chart">
        {competitors.map((c, i) => {
          const off = hidden.has(c.id);
          return (
            <li key={c.id}>
              <button
                type="button"
                aria-pressed={!off}
                onClick={() => toggle(c.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                  off && "opacity-50",
                )}
              >
                <span aria-hidden="true" className="h-0.5 w-4 rounded-full" style={{ background: seriesColor(i) }} />
                {c.name}
              </button>
            </li>
          );
        })}
      </ul>
      <div className="mt-2 h-[340px] w-full sm:h-[380px]" role="img" aria-label="Radar chart comparing competitors; the same scores are available as a table below the chart.">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="66%" margin={{ top: 8, right: 36, bottom: 8, left: 36 }}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--muted-foreground)", fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            {competitors.map((c, i) =>
              hidden.has(c.id) ? null : (
                <Radar
                  key={c.id}
                  name={c.name}
                  dataKey={c.id}
                  stroke={seriesColor(i)}
                  strokeWidth={2}
                  fill={seriesColor(i)}
                  fillOpacity={0.06}
                  dot={{ r: 3, fill: seriesColor(i), strokeWidth: 0 }}
                  isAnimationActive={false}
                />
              ),
            )}
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--border)",
                borderRadius: 12,
                fontSize: 12,
                color: "var(--popover-foreground)",
              }}
              itemStyle={{ color: "var(--popover-foreground)", padding: 0 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <details className="group mt-2 text-sm">
        <summary className="cursor-pointer rounded text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          View scores as a table
        </summary>
        <div className="relative mt-3 overflow-x-auto">
          <table className="w-full min-w-[480px] text-sm">
            <caption className="sr-only">Radar scores by competitor</caption>
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-3 text-left font-medium">Axis</th>
                {competitors.map((c) => (
                  <th key={c.id} scope="col" className="px-2 py-2 text-right align-bottom font-medium leading-tight">
                    {c.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {radarAxes.map((axis) => (
                <tr key={axis} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-normal text-foreground">{axis}</th>
                  {competitors.map((c) => (
                    <td key={c.id} className="px-2 py-2 text-right text-foreground tabular-nums">
                      {c.radarScores[axis] ?? "–"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </Panel>
  );
}

export function CompetitorsTab({ report, startup, freshness }: TabProps) {
  const nn = startup.nearestNeighbourMode;
  const { competitors, featureList } = report;

  return (
    <div className="space-y-6">
      <SectionHeader
        title={nn ? "Nearest neighbours" : "Competitors"}
        description={
          nn
            ? "No direct competitors exist, so these are the closest products by problem, customer or business model."
            : "Direct competitors near you, with the features customers care about."
        }
        aside={freshness("competitors")}
      />

      <Panel className="p-0 sm:p-0">
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <caption className="sr-only">{nn ? "Nearest neighbours" : "Competitors"} with rating, reviews, price, hiring and news</caption>
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th scope="col" className="px-5 py-3 font-medium sm:px-6">Name</th>
                <th scope="col" className="px-3 py-3 font-medium">Rating</th>
                <th scope="col" className="px-3 py-3 font-medium">Reviews</th>
                <th scope="col" className="px-3 py-3 font-medium">Price band</th>
                <th scope="col" className="px-3 py-3 font-medium">Open roles</th>
                <th scope="col" className="px-3 py-3 pr-6 font-medium">Latest news</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((c) => (
                <tr key={c.id} className="border-b border-border last:border-0">
                  <th scope="row" className="px-5 py-4 align-top font-medium sm:px-6">
                    <a
                      href={c.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded text-foreground hover:text-brand focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {c.name}
                      <ExternalLink aria-hidden="true" className="size-3 text-muted-foreground" />
                      <span className="sr-only">(opens in a new tab)</span>
                    </a>
                    <div className="mt-1.5">
                      <NeighbourBadges competitor={c} />
                    </div>
                  </th>
                  <td className="px-3 py-4 align-top whitespace-nowrap text-foreground">
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Star aria-hidden="true" className="size-3.5 fill-amber-400 text-amber-400" />
                      {c.rating.toFixed(1)}
                    </span>
                  </td>
                  <td className="px-3 py-4 align-top text-foreground">{c.reviewCount}</td>
                  <td className="px-3 py-4 align-top whitespace-nowrap text-foreground">{c.priceBand}</td>
                  <td className="px-3 py-4 align-top text-foreground">{c.openRoles}</td>
                  <td className="px-3 py-4 pr-6 align-top text-muted-foreground">{c.latestNews ?? "–"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-6 2xl:grid-cols-2 [&>*]:min-w-0">
        <Panel className="p-0 sm:p-0">
          <div className="px-5 pt-5 sm:px-6 sm:pt-6">
            <h3 className="text-base font-semibold text-foreground">Feature matrix</h3>
            <p className="mt-1 text-sm text-muted-foreground">Which {nn ? "neighbours" : "competitors"} offer what.</p>
          </div>
          <div className="relative mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <caption className="sr-only">Feature matrix</caption>
              <thead>
                <tr className="border-y border-border text-xs text-muted-foreground">
                  <th scope="col" className="px-5 py-3 text-left font-medium sm:px-6">Feature</th>
                  {competitors.map((c) => (
                    <th key={c.id} scope="col" className="px-2 py-3 text-center align-bottom font-medium">
                      <span className="mx-auto block max-w-24 leading-tight">{c.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureList.map((feature) => {
                  const nobody = competitors.every((c) => !c.features[feature]);
                  return (
                    <tr key={feature} className="border-b border-border last:border-0">
                      <th scope="row" className="px-5 py-3 text-left font-normal text-foreground sm:px-6">
                        {feature}
                        {nobody && (
                          <span className="ml-2 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand">
                            Gap
                          </span>
                        )}
                      </th>
                      {competitors.map((c) => (
                        <td key={c.id} className="px-2 py-3 text-center">
                          {c.features[feature] ? (
                            <>
                              <Check aria-hidden="true" className="mx-auto size-4 text-emerald-600 dark:text-emerald-400" strokeWidth={2.5} />
                              <span className="sr-only">Yes</span>
                            </>
                          ) : (
                            <>
                              <Minus aria-hidden="true" className="mx-auto size-4 text-neutral-300 dark:text-neutral-600" />
                              <span className="sr-only">No</span>
                            </>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Panel>

        <CompetitorRadar report={report} />
      </div>
    </div>
  );
}
