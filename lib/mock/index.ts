import type { Severity, Startup, StartupOverview, StartupSummary } from "../types";
import { brewAndStay } from "./brew-and-stay";
import type { MockBundle } from "./bundle";
import { studySprint } from "./studysprint";
import { round } from "./utils";

export type { MockBundle } from "./bundle";
export { simulateWeekEvents } from "./simulate";
export { systemStats } from "./system";
export { MOCK_NOW, mulberry32 } from "./utils";

export const MOCK_BUNDLES: MockBundle[] = [brewAndStay, studySprint];

export const MOCK_STARTUP_IDS = MOCK_BUNDLES.map((b) => b.startup.id);

export function getMockBundle(id: string): MockBundle | undefined {
  return MOCK_BUNDLES.find((b) => b.startup.id === id);
}

/**
 * User-added startups reuse the café report under their own id and name
 * (CLAUDE.md §6, "Add startup").
 */
export function bundleForLocalStartup(startup: Startup): MockBundle {
  const base = brewAndStay;
  return {
    startup,
    report: { ...base.report, startupId: startup.id },
    monitoring: {
      ...base.monitoring,
      startupId: startup.id,
      events: base.monitoring.events.map((e) => ({
        ...e,
        id: `${startup.id}-${e.id}`,
        startupId: startup.id,
      })),
    },
    risks: { ...base.risks, startupId: startup.id },
    healthScore: base.healthScore,
  };
}

const SEVERITY_RANK: Record<Severity, number> = { low: 0, medium: 1, high: 2 };

export function highestSeverity(levels: Severity[]): Severity {
  return levels.reduce<Severity>(
    (max, level) => (SEVERITY_RANK[level] > SEVERITY_RANK[max] ? level : max),
    "low",
  );
}

export function summarise(bundle: MockBundle): StartupSummary {
  const { monitoring, risks } = bundle;
  const weeks = monitoring.ratingSeries[0]?.points.length ?? 0;

  const ratingSparkline = Array.from({ length: weeks }, (_, i) => {
    const values = monitoring.ratingSeries.map((s) => s.points[i].value);
    const avg = values.reduce((sum, v) => sum + v, 0) / Math.max(values.length, 1);
    return { date: monitoring.ratingSeries[0].points[i].date, value: round(avg, 2) };
  });

  const timestamps = [monitoring.meta.fetchedAt, ...monitoring.events.map((e) => e.at)];

  return {
    startupId: bundle.startup.id,
    healthScore: bundle.healthScore,
    openAlerts: monitoring.events.filter((e) => e.severity !== "low").length,
    highestRisk: highestSeverity(risks.risks.map((r) => r.level)),
    competitorsMonitored: monitoring.watched.length,
    lastUpdatedAt: timestamps.reduce((latest, t) => (t > latest ? t : latest)),
    ratingSparkline,
  };
}

export function overviewOf(bundle: MockBundle): StartupOverview {
  return { startup: bundle.startup, summary: summarise(bundle) };
}
