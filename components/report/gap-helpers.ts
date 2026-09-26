import { clusterStats } from "@/lib/stats";
import type { ClusterInsight, Gap, Report } from "@/lib/types";

export function sortedGaps(report: Report): Gap[] {
  return [...report.gaps].sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export function clusterFor(report: Report, gap: Gap): ClusterInsight | undefined {
  return report.clusters.find((c) => c.id === gap.clusterId);
}

/** Complaint share and 95% CI for a gap, computed from its cluster. */
export function gapEvidence(report: Report, gap: Gap) {
  const cluster = clusterFor(report, gap);
  if (!cluster) return null;
  return { cluster, ...clusterStats(cluster) };
}
