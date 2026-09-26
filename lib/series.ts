import type { SeriesPoint } from "./types";

export type ChartRow = { date: string } & Record<string, number | string>;

/**
 * Turns per-series points into Recharts rows:
 * [{ competitorId: "a", points: [{date, value}] }] → [{ date, a: value, ... }].
 * Assumes all series share the same dates (true for the mock data).
 */
export function pivotSeries<T extends { points: SeriesPoint[] }>(
  series: T[],
  keyOf: (s: T) => string,
): ChartRow[] {
  const rows = new Map<string, ChartRow>();
  for (const s of series) {
    const key = keyOf(s);
    for (const point of s.points) {
      const row = rows.get(point.date) ?? { date: point.date };
      row[key] = point.value;
      rows.set(point.date, row);
    }
  }
  return [...rows.values()].sort((a, b) => (a.date < b.date ? -1 : 1));
}
