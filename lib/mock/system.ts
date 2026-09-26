import type { SystemStats } from "../types";
import { isoAgo } from "./utils";

export const systemStats: SystemStats = {
  cacheHitRate: 0.78,
  apiCallsSaved: 312,
  avgReportTimeCachedSec: 2.1,
  avgReportTimeColdSec: 48,
  reportsGenerated: 14,
  competitorsMonitored: 10,
  serpCallsThisMonth: 1486,
  lastUpdatedAt: isoAgo(0, 1),
};
