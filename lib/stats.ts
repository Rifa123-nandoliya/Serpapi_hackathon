import type { ClusterInsight } from "./types";

export type ConfidenceInterval = { low: number; high: number };

/** Clusters with fewer reviews than this are flagged "Low confidence". */
export const LOW_CONFIDENCE_THRESHOLD = 30;

/**
 * Wilson score interval for a proportion count/total.
 * Returns { low: 0, high: 0 } when total is 0.
 */
export function wilsonCI(count: number, total: number, z = 1.96): ConfidenceInterval {
  if (total <= 0) return { low: 0, high: 0 };

  const n = total;
  const p = Math.min(Math.max(count / n, 0), 1);
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const centre = (p + z2 / (2 * n)) / denom;
  const margin = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;

  return { low: Math.max(0, centre - margin), high: Math.min(1, centre + margin) };
}

/** Share of complaints weighted by how unhappy those reviewers are. */
export function impactScore(share: number, avgRating: number): number {
  return share * 100 * (5 - avgRating);
}

/** 0.0331 → "3.3%" */
export function formatPct(x: number, digits = 1): string {
  if (!Number.isFinite(x)) return "–";
  return `${(x * 100).toFixed(digits)}%`;
}

/** Signed percentage-point change: 0.012 → "+1.2 pts". */
export function formatPts(delta: number, digits = 1): string {
  const value = (delta * 100).toFixed(digits);
  return `${delta > 0 ? "+" : ""}${value} pts`;
}

export type ClusterStats = {
  share: number;
  ci: ConfidenceInterval;
  impact: number;
  lowConfidence: boolean;
};

export function clusterStats(cluster: Pick<ClusterInsight, "count" | "total" | "avgRating">): ClusterStats {
  const share = cluster.total > 0 ? cluster.count / cluster.total : 0;
  return {
    share,
    ci: wilsonCI(cluster.count, cluster.total),
    impact: impactScore(share, cluster.avgRating),
    lowConfidence: cluster.count < LOW_CONFIDENCE_THRESHOLD,
  };
}
