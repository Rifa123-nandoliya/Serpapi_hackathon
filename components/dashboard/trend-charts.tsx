"use client";

import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { seriesColor } from "@/components/report/chart-theme";
import { formatInr } from "@/lib/format";
import { pivotSeries } from "@/lib/series";
import { formatPct } from "@/lib/stats";
import type { MonitoringData } from "@/lib/types";

import { AXIS_TICK, ChartPanel, SeriesLegend, shortDate, TOOLTIP_STYLE } from "./chart-parts";

const MARGIN = { top: 8, right: 8, bottom: 0, left: 0 };
const GRID = <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="0" />;

export function TrendCharts({ data }: { data: MonitoringData }) {
  const competitors = data.ratingSeries.map((s, i) => ({ key: s.competitorId, label: s.name, color: seriesColor(i) }));
  const [hidden, setHidden] = useState<Set<string>>(new Set());
  const toggle = (key: string) =>
    setHidden((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else if (next.size < competitors.length - 1) next.add(key);
      return next;
    });
  const shown = competitors.filter((c) => !hidden.has(c.key));

  const ratingRows = pivotSeries(data.ratingSeries, (s) => s.competitorId);
  const volumeRows = pivotSeries(data.reviewVolumeSeries, (s) => s.competitorId);
  const priceRows = pivotSeries(data.priceSeries, (s) => s.competitorId);
  const clusters = data.complaintShareSeries.map((s, i) => ({ key: s.clusterId, label: s.label, color: seriesColor(i) }));
  const shareRows = pivotSeries(data.complaintShareSeries, (s) => s.clusterId);

  const ratings = data.ratingSeries.flatMap((s) => s.points.map((p) => p.value));
  const ratingDomain: [number, number] = [
    Math.max(1, Math.floor((Math.min(...ratings) - 0.1) * 10) / 10),
    Math.min(5, Math.ceil((Math.max(...ratings) + 0.1) * 10) / 10),
  ];
  const tooltipDate = (label: unknown) => (typeof label === "string" ? `Week of ${shortDate(label)}` : "");

  return (
    <div className="space-y-4">
      <SeriesLegend items={competitors} hidden={hidden} onToggle={toggle} label="Competitors shown in the rating, volume and price charts" />

      <div className="grid gap-6 xl:grid-cols-2">
        <ChartPanel
          title="Competitor rating over time"
          subtitle="Average star rating, weekly."
          table={{ columns: competitors, rows: ratingRows, format: (v) => `${v.toFixed(2)}★` }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ratingRows} margin={MARGIN}>
              {GRID}
              <XAxis dataKey="date" tickFormatter={shortDate} tick={AXIS_TICK} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis domain={ratingDomain} tick={AXIS_TICK} tickLine={false} axisLine={false} width={36} tickFormatter={(v: number) => v.toFixed(1)} />
              <Tooltip {...TOOLTIP_STYLE} labelFormatter={tooltipDate} formatter={(v) => (typeof v === "number" ? `${v.toFixed(2)}★` : String(v))} cursor={{ stroke: "var(--border)" }} />
              {shown.map((c) => (
                <Line key={c.key} type="monotone" dataKey={c.key} name={c.label} stroke={c.color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }} isAnimationActive={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          title="Review volume"
          subtitle="New reviews per week, stacked by competitor."
          table={{ columns: competitors, rows: volumeRows, format: (v) => String(v) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volumeRows} margin={MARGIN} barCategoryGap="22%">
              {GRID}
              <XAxis dataKey="date" tickFormatter={shortDate} tick={AXIS_TICK} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={36} allowDecimals={false} />
              <Tooltip {...TOOLTIP_STYLE} labelFormatter={tooltipDate} cursor={{ fill: "var(--muted)", opacity: 0.6 }} />
              {shown.map((c, i) => (
                <Bar
                  key={c.key}
                  dataKey={c.key}
                  name={c.label}
                  stackId="volume"
                  fill={c.color}
                  stroke="var(--card)"
                  strokeWidth={1}
                  radius={i === shown.length - 1 ? [4, 4, 0, 0] : 0}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartPanel>

        <ChartPanel
          title="Complaint share per top cluster"
          subtitle="Share of all reviews in each of the three biggest complaint themes."
          table={{ columns: clusters, rows: shareRows, format: (v) => formatPct(v) }}
        >
          <div className="flex h-full flex-col">
            <ul className="mb-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-foreground" aria-label="Clusters">
              {clusters.map((c) => (
                <li key={c.key} className="inline-flex items-center gap-1.5">
                  <span aria-hidden="true" className="h-0.5 w-4 rounded-full" style={{ background: c.color }} />
                  {c.label}
                </li>
              ))}
            </ul>
            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={shareRows} margin={MARGIN}>
                  {GRID}
                  <XAxis dataKey="date" tickFormatter={shortDate} tick={AXIS_TICK} tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={44} tickFormatter={(v: number) => formatPct(v, 0)} />
                  <Tooltip {...TOOLTIP_STYLE} labelFormatter={tooltipDate} formatter={(v) => (typeof v === "number" ? formatPct(v) : String(v))} cursor={{ stroke: "var(--border)" }} />
                  {clusters.map((c) => (
                    <Line key={c.key} type="monotone" dataKey={c.key} name={c.label} stroke={c.color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }} isAnimationActive={false} />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </ChartPanel>

        <ChartPanel
          title="Price changes"
          subtitle="Reference price per competitor; each step is a price change."
          table={{ columns: competitors, rows: priceRows, format: (v) => formatInr(v) }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceRows} margin={MARGIN}>
              {GRID}
              <XAxis dataKey="date" tickFormatter={shortDate} tick={AXIS_TICK} tickLine={false} axisLine={false} minTickGap={24} />
              <YAxis tick={AXIS_TICK} tickLine={false} axisLine={false} width={48} domain={["dataMin - 20", "dataMax + 20"]} tickFormatter={(v: number) => formatInr(v)} />
              <Tooltip {...TOOLTIP_STYLE} labelFormatter={tooltipDate} formatter={(v) => (typeof v === "number" ? formatInr(v) : String(v))} cursor={{ stroke: "var(--border)" }} />
              {shown.map((c) => (
                <Line key={c.key} type="stepAfter" dataKey={c.key} name={c.label} stroke={c.color} strokeWidth={2} dot={false} activeDot={{ r: 4, strokeWidth: 2, stroke: "var(--card)" }} isAnimationActive={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
      </div>
    </div>
  );
}
