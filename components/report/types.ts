import type { Report, ReportSection, Startup } from "@/lib/types";

export type TabProps = {
  report: Report;
  startup: Startup;
  /** Renders the FreshnessBadge (with Refresh) for a section. */
  freshness: (section: ReportSection) => React.ReactNode;
};
