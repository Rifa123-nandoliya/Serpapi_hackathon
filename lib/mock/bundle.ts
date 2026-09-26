import type { MonitoringData, Report, RiskReport, Startup } from "../types";

/** Everything the mock API knows about one startup. */
export type MockBundle = {
  startup: Startup;
  report: Report;
  monitoring: MonitoringData;
  risks: RiskReport;
  healthScore: number;
};
