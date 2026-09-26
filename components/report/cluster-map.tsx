"use client";

import { ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis } from "recharts";

import type { ClusterInsight } from "@/lib/types";

import { markerShape, seriesColor } from "./chart-theme";

type MapPoint = { x: number; y: number; reviewId: string; label: string };

type ClusterMapProps = {
  clusters: ClusterInsight[];
  /** Index of each cluster in the report (drives colour and shape, never re-assigned on filter). */
  indexOf: (id: string) => number;
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export function ClusterMap({ clusters, indexOf, selectedId, onSelect }: ClusterMapProps) {
  return (
    <div className="h-[340px] w-full sm:h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 12, right: 12, bottom: 12, left: 12 }}>
          <XAxis type="number" dataKey="x" hide domain={["dataMin - 1", "dataMax + 1"]} />
          <YAxis type="number" dataKey="y" hide domain={["dataMin - 1", "dataMax + 1"]} />
          <ZAxis range={[72, 72]} />
          <Tooltip
            cursor={false}
            isAnimationActive={false}
            content={({ active, payload }) => {
              const point = active ? (payload?.[0]?.payload as MapPoint | undefined) : undefined;
              if (!point) return null;
              return (
                <div className="rounded-xl border border-border bg-popover px-3 py-2 text-xs shadow-float">
                  <p className="font-semibold text-popover-foreground">{point.label}</p>
                  <p className="text-muted-foreground">Review {point.reviewId.split("-r").pop()} · click to filter</p>
                </div>
              );
            }}
          />
          {clusters.map((cluster) => {
            const i = indexOf(cluster.id);
            const dimmed = selectedId !== null && selectedId !== cluster.id;
            const data: MapPoint[] = cluster.points.map((p) => ({ ...p, label: cluster.label }));
            return (
              <Scatter
                key={cluster.id}
                name={cluster.label}
                data={data}
                shape={markerShape(i)}
                fill={dimmed ? "var(--inactive)" : seriesColor(i)}
                fillOpacity={dimmed ? 0.3 : 0.85}
                stroke="var(--card)"
                strokeWidth={1}
                cursor="pointer"
                isAnimationActive={false}
                onClick={() => onSelect(cluster.id)}
              />
            );
          })}
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

/** Legend swatch that repeats the marker shape (secondary encoding). */
export function ShapeSwatch({ index, dimmed }: { index: number; dimmed?: boolean }) {
  const shape = markerShape(index);
  const fill = dimmed ? "var(--inactive)" : seriesColor(index);
  const paths: Record<string, React.ReactNode> = {
    circle: <circle cx="6" cy="6" r="5" />,
    diamond: <path d="M6 0.5 11.5 6 6 11.5 0.5 6Z" />,
    square: <rect x="1" y="1" width="10" height="10" rx="1.5" />,
    triangle: <path d="M6 0.8 11.4 11H0.6Z" />,
    star: <path d="m6 .6 1.6 3.5 3.8.4-2.9 2.6.8 3.8L6 9 2.7 10.9l.8-3.8L.6 4.5l3.8-.4Z" />,
    cross: <path d="M4 0.5h4V4h3.5v4H8v3.5H4V8H0.5V4H4Z" />,
    wye: <path d="M4.3.8h3.4v4l3.4 2-1.7 3-3.4-2-3.4 2-1.7-3 3.4-2Z" />,
  };
  return (
    <svg aria-hidden="true" viewBox="0 0 12 12" className="size-3 shrink-0" style={{ fill }}>
      {paths[shape]}
    </svg>
  );
}
