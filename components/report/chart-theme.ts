/**
 * Categorical series colours (CSS variables with light/dark steps in globals.css).
 * Assigned by entity index in fixed order, never by rank, so filtering never repaints.
 */
export const SERIES = [
  "var(--series-1)",
  "var(--series-2)",
  "var(--series-3)",
  "var(--series-4)",
  "var(--series-5)",
  "var(--series-6)",
  "var(--series-7)",
] as const;

export function seriesColor(index: number): string {
  return SERIES[index % SERIES.length];
}

/** Secondary encoding for the cluster map: one marker shape per cluster. */
export const MARKER_SHAPES = ["circle", "diamond", "square", "triangle", "star", "cross", "wye"] as const;
export type MarkerShape = (typeof MARKER_SHAPES)[number];

export function markerShape(index: number): MarkerShape {
  return MARKER_SHAPES[index % MARKER_SHAPES.length];
}
