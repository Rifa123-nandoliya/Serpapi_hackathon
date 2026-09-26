/**
 * Core GapScope types (CLAUDE.md §5). Names from the spec are kept as-is;
 * extra fields and types extend them for the UI.
 */

// ---------------------------------------------------------------------------
// Shared
// ---------------------------------------------------------------------------

export type SectionMeta = {
  cached: boolean;
  fetchedAt: string;
  latencyMs: number;
  serpCalls: number;
};

export type Severity = "low" | "medium" | "high";

export type SeriesPoint = { date: string; value: number };

// ---------------------------------------------------------------------------
// Startups
// ---------------------------------------------------------------------------

export type StartupMode = "idea" | "existing";
export type StartupStatus = "analysing" | "ready" | "monitoring";

export type Startup = {
  id: string;
  name: string;
  idea: string;
  category: string;
  location: string;
  targetCustomer: string;
  mode: StartupMode;
  createdAt: string;
  status: StartupStatus;
  nearestNeighbourMode: boolean;
};

/** Per-startup numbers shown on workspace and dashboard cards. */
export type StartupSummary = {
  startupId: string;
  healthScore: number; // 0–100
  openAlerts: number;
  highestRisk: Severity;
  competitorsMonitored: number;
  lastUpdatedAt: string;
  /** Average competitor rating per week, for the dashboard sparkline. */
  ratingSparkline: SeriesPoint[];
};

export type StartupOverview = { startup: Startup; summary: StartupSummary };

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

export type NeighbourType = "same_problem" | "same_customer" | "same_model";

export type Competitor = {
  id: string;
  name: string;
  rating: number;
  reviewCount: number;
  priceBand: string;
  openRoles: number;
  latestNews?: string;
  similarity?: number;
  neighbourType?: NeighbourType;
  features: Record<string, boolean>;
  /** 0–100 scores on the report's radar axes (keys = Report.radarAxes). */
  radarScores: Record<string, number>;
  sourceUrl: string;
};

export type ClusterSample = {
  text: string;
  rating: number;
  sourceUrl: string;
  competitorId: string;
};

export type ClusterPoint = { x: number; y: number; reviewId: string };

export type ClusterInsight = {
  id: string;
  label: string;
  count: number;
  total: number;
  avgRating: number;
  /** Change in share vs last snapshot, e.g. +0.012. */
  trendDelta: number | null;
  byCompetitor: { competitorId: string; share: number }[];
  samples: ClusterSample[];
  points: ClusterPoint[];
}; // share, CI, impact and lowConfidence (count < 30) are COMPUTED in lib/stats.ts, not stored

export type Gap = {
  id: string;
  title: string;
  clusterId: string;
  opportunityScore: number;
  complaintShare: number;
  demandScore: number;
  competitorCoverage: number;
  evidenceUrls: string[];
  summary: string;
};

export type PlanPhase = "0-30" | "31-60" | "61-90";

export type PlanItem = { phase: PlanPhase; title: string; detail: string; gapId?: string };

export type ReportSection = "overview" | "competitors" | "customerVoice" | "gaps" | "plan";

export type Report = {
  startupId: string;
  competitors: Competitor[];
  clusters: ClusterInsight[];
  clusterQuality: { k: number; silhouette: number };
  gaps: Gap[];
  plan: PlanItem[];
  positioning: string;
  pricingSuggestion: string;
  mvpFeatures: string[];
  /** Feature names used in the competitor feature matrix (keys of Competitor.features). */
  featureList: string[];
  /** Axis names used in the competitor radar chart (keys of Competitor.radarScores). */
  radarAxes: string[];
  totalReviews: number;
  meta: Record<ReportSection, SectionMeta>;
};

// ---------------------------------------------------------------------------
// Monitoring
// ---------------------------------------------------------------------------

export type MonitoringEventType =
  | "rating_change"
  | "price_change"
  | "hiring"
  | "news"
  | "complaint_spike"
  | "new_competitor";

export type MonitoringEvent = {
  id: string;
  startupId: string;
  competitorId: string;
  type: MonitoringEventType;
  title: string;
  detail: string;
  severity: Severity;
  at: string;
  sourceUrl?: string;
};

export type WatchedCompetitor = {
  competitorId: string;
  name: string;
  frequency: "daily" | "weekly";
  lastCheckedAt: string;
};

export type CompetitorSeries = { competitorId: string; name: string; points: SeriesPoint[] };

export type ClusterShareSeries = { clusterId: string; label: string; points: SeriesPoint[] };

export type MonitoringData = {
  startupId: string;
  watched: WatchedCompetitor[];
  /** Newest first. */
  events: MonitoringEvent[];
  ratingSeries: CompetitorSeries[];
  reviewVolumeSeries: CompetitorSeries[];
  complaintShareSeries: ClusterShareSeries[];
  /** Price in ₹ of a reference item/plan; changes are step-wise. */
  priceSeries: CompetitorSeries[];
  meta: SectionMeta;
};

// ---------------------------------------------------------------------------
// Risks
// ---------------------------------------------------------------------------

export type RiskCategory = "market" | "competition" | "copy" | "regulatory";

export type Risk = {
  id: string;
  category: RiskCategory;
  level: Severity;
  title: string;
  evidence: string[];
  killCriterion: string;
  /** Source links for the evidence lines (same order where available). */
  evidenceUrls: string[];
};

export type RiskReport = { startupId: string; risks: Risk[]; meta: SectionMeta };

// ---------------------------------------------------------------------------
// System
// ---------------------------------------------------------------------------

export type SystemStats = {
  cacheHitRate: number; // 0–1
  apiCallsSaved: number;
  avgReportTimeCachedSec: number;
  avgReportTimeColdSec: number;
  reportsGenerated: number;
  competitorsMonitored: number;
  serpCallsThisMonth: number;
  lastUpdatedAt: string;
};

// ---------------------------------------------------------------------------
// Inputs
// ---------------------------------------------------------------------------

export type NewStartupInput = {
  name: string;
  idea: string;
  category: string;
  location: string;
  targetCustomer: string;
  mode: StartupMode;
};
