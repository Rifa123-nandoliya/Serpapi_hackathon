"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { CircleAlert, RotateCw } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRefreshReport, useReport, useStartup } from "@/lib/queries";
import type { ReportSection } from "@/lib/types";

import { CompetitorsTab } from "./competitors-tab";
import { CustomerVoiceTab } from "./customer-voice-tab";
import { FreshnessBadge } from "./freshness-badge";
import { GapsTab } from "./gaps-tab";
import { MonitoringTab } from "./monitoring-tab";
import { OverviewTab } from "./overview-tab";
import { PlanTab } from "./plan-tab";
import { ReportHeader } from "./report-header";
import { ReportSkeleton } from "./report-skeleton";
import { StartupNotFound } from "./startup-not-found";

const SECTION_LABEL: Record<ReportSection, string> = {
  overview: "Overview",
  competitors: "Competitors",
  customerVoice: "Customer voice",
  gaps: "Gaps",
  plan: "Plan",
};

const TABS = ["overview", "competitors", "customer-voice", "gaps", "plan", "monitoring"] as const;
type TabValue = (typeof TABS)[number];

function isTab(value: string | null): value is TabValue {
  return value !== null && (TABS as readonly string[]).includes(value);
}

export function StartupReport({ startupId }: { startupId: string }) {
  const startupQuery = useStartup(startupId);
  const reportQuery = useReport(startupId);
  const refresh = useRefreshReport(startupId);
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [tab, setTabState] = useState<TabValue>(isTab(initialTab) ? initialTab : "overview");

  /** Keep ?tab= in the URL so a refresh or shared link opens the same tab. */
  const setTab = (next: TabValue) => {
    setTabState(next);
    const url = new URL(window.location.href);
    if (next === "overview") url.searchParams.delete("tab");
    else url.searchParams.set("tab", next);
    window.history.replaceState(window.history.state, "", url);
  };

  if (startupQuery.isPending || reportQuery.isPending) return <ReportSkeleton />;

  if (startupQuery.isError || reportQuery.isError) {
    return (
      <div role="alert" className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-16 text-center">
        <CircleAlert aria-hidden="true" className="size-8 text-destructive" />
        <h1 className="mt-4 text-lg font-semibold text-foreground">Couldn&apos;t load this report</h1>
        <p className="mt-1 text-[15px] text-muted-foreground">Check your connection and try again.</p>
        <Button
          variant="subtle"
          size="lg"
          className="mt-6"
          onClick={() => {
            void startupQuery.refetch();
            void reportQuery.refetch();
          }}
        >
          <RotateCw aria-hidden="true" />
          Try again
        </Button>
      </div>
    );
  }

  const startup = startupQuery.data?.startup;
  const report = reportQuery.data;
  if (!startup || !report) return <StartupNotFound startupId={startupId} />;

  const refreshingSection = refresh.isPending ? refresh.variables : null;
  const freshness = (section: ReportSection) => (
    <FreshnessBadge
      meta={report.meta[section]}
      section={SECTION_LABEL[section]}
      refreshing={refreshingSection === section}
      onRefresh={() =>
        refresh.mutate(section, {
          onSuccess: (data) => {
            const meta = data?.meta[section];
            toast.success(`${SECTION_LABEL[section]} refreshed`, {
              description: meta ? `Live fetch in ${(meta.latencyMs / 1000).toFixed(1)}s · ${meta.serpCalls} SerpApi calls` : undefined,
            });
          },
          onError: () => toast.error(`Couldn't refresh ${SECTION_LABEL[section].toLowerCase()}`),
        })
      }
    />
  );

  const props = { report, startup, freshness };
  const openGaps = () => setTab("gaps");

  return (
    <div className="space-y-8">
      <ReportHeader startup={startup} />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)} className="gap-6">
        <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
          <TabsList className="h-11! w-max rounded-full p-1">
            <TabsTrigger value="overview" className="rounded-full px-4">Overview</TabsTrigger>
            <TabsTrigger value="competitors" className="rounded-full px-4">
              {startup.nearestNeighbourMode ? "Neighbours" : "Competitors"}
            </TabsTrigger>
            <TabsTrigger value="customer-voice" className="rounded-full px-4">Customer Voice</TabsTrigger>
            <TabsTrigger value="gaps" className="rounded-full px-4">Gaps</TabsTrigger>
            <TabsTrigger value="plan" className="rounded-full px-4">Plan</TabsTrigger>
            <TabsTrigger value="monitoring" className="rounded-full px-4">
              <span className="relative flex size-2" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              Live monitoring
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="overview">
          <OverviewTab {...props} onOpenGaps={openGaps} />
        </TabsContent>
        <TabsContent value="competitors">
          <CompetitorsTab {...props} />
        </TabsContent>
        <TabsContent value="customer-voice">
          <CustomerVoiceTab {...props} />
        </TabsContent>
        <TabsContent value="gaps">
          <GapsTab {...props} />
        </TabsContent>
        <TabsContent value="plan">
          <PlanTab {...props} onOpenGaps={openGaps} />
        </TabsContent>
        <TabsContent value="monitoring">
          <MonitoringTab startupId={startupId} competitors={report.competitors} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
