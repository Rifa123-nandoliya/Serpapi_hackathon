"use client";

import Link from "next/link";
import { BellRing, CircleAlert, FileText, RotateCw, Users } from "lucide-react";
import { toast } from "sonner";

import { SeverityBadge } from "@/components/monitoring/event-meta";
import { FreshnessBadge } from "@/components/report/freshness-badge";
import { SectionHeader } from "@/components/report/section-header";
import { StartupNotFound } from "@/components/report/startup-not-found";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMonitoring, useRefreshMonitoring, useRefreshRisks, useRisks, useStartup } from "@/lib/queries";
import { cn } from "@/lib/utils";

import { healthTier } from "./health";
import { LatestEvents } from "./latest-events";
import { RiskRadar } from "./risk-radar";
import { TrendCharts } from "./trend-charts";

function DashboardSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading dashboard" className="space-y-8">
      <Skeleton className="h-10 w-72" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-28 rounded-3xl" />
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-80 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}

export function StartupDashboard({ startupId }: { startupId: string }) {
  const startupQuery = useStartup(startupId);
  const monitoringQuery = useMonitoring(startupId);
  const risksQuery = useRisks(startupId);
  const refreshMonitoring = useRefreshMonitoring(startupId);
  const refreshRisks = useRefreshRisks(startupId);

  if (startupQuery.isPending || monitoringQuery.isPending || risksQuery.isPending) return <DashboardSkeleton />;

  if (startupQuery.isError || monitoringQuery.isError || risksQuery.isError) {
    return (
      <div role="alert" className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-16 text-center">
        <CircleAlert aria-hidden="true" className="size-8 text-destructive" />
        <h1 className="mt-4 text-lg font-semibold text-foreground">Couldn&apos;t load this dashboard</h1>
        <Button
          variant="subtle"
          size="lg"
          className="mt-6"
          onClick={() => {
            void startupQuery.refetch();
            void monitoringQuery.refetch();
            void risksQuery.refetch();
          }}
        >
          <RotateCw aria-hidden="true" />
          Try again
        </Button>
      </div>
    );
  }

  const overview = startupQuery.data;
  const monitoring = monitoringQuery.data;
  const risks = risksQuery.data;
  if (!overview || !monitoring || !risks) return <StartupNotFound startupId={startupId} />;

  const { startup, summary } = overview;
  const tier = healthTier(summary.healthScore);

  const tiles = [
    {
      label: "Health score",
      value: (
        <>
          {summary.healthScore}
          <span className="text-sm font-medium text-muted-foreground">/100</span>
        </>
      ),
      note: <span className={cn("font-medium", tier.text)}>{tier.label}</span>,
    },
    {
      label: "Open alerts",
      icon: BellRing,
      value: <span className={summary.openAlerts > 0 ? "text-brand" : undefined}>{summary.openAlerts}</span>,
      note: "Medium and high severity",
    },
    {
      label: "Highest risk",
      value: <SeverityBadge level={summary.highestRisk} suffix="risk" className="px-2.5 py-1 text-sm" />,
      note: `${risks.risks.length} risks tracked`,
    },
    {
      label: startup.nearestNeighbourMode ? "Neighbours watched" : "Competitors watched",
      icon: Users,
      value: summary.competitorsMonitored,
      note: `${monitoring.watched.filter((w) => w.frequency === "daily").length} checked daily`,
    },
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-sm font-medium text-brand">Startup dashboard</p>
          <h1 className="mt-1 text-3xl font-bold tracking-tight text-foreground">{startup.name}</h1>
          <p className="mt-1 text-[15px] text-muted-foreground">
            {startup.category} · {startup.location}
          </p>
        </div>
        <Button asChild variant="subtle" size="lg" className="self-start rounded-lg sm:self-auto">
          <Link href={`/workspace/${startup.id}`}>
            <FileText aria-hidden="true" />
            Open report
          </Link>
        </Button>
      </header>

      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-3xl border border-border bg-card p-5">
            <dt className="text-sm text-muted-foreground">{t.label}</dt>
            <dd className="mt-2 flex min-h-10 items-center text-3xl font-bold tracking-tight text-foreground tabular-nums">{t.value}</dd>
            <dd className="mt-1 text-xs text-muted-foreground">{t.note}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="trends-heading" className="space-y-4">
        <div id="trends-heading">
          <SectionHeader
            title="Live monitoring"
            description={`Twelve weeks of ratings, review volume, complaints and prices for the ${startup.nearestNeighbourMode ? "neighbours" : "competitors"} you watch.`}
            aside={
              <FreshnessBadge
                meta={monitoring.meta}
                section="Live monitoring"
                refreshing={refreshMonitoring.isPending}
                onRefresh={() =>
                  refreshMonitoring.mutate(undefined, {
                    onSuccess: () => toast.success("Monitoring refreshed"),
                    onError: () => toast.error("Couldn't refresh monitoring"),
                  })
                }
              />
            }
          />
        </div>
        <TrendCharts data={monitoring} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <section aria-labelledby="risk-heading" className="min-w-0 space-y-4">
          <div id="risk-heading">
            <SectionHeader
              title="Risk Radar"
              description="Market, competition, copy and regulatory risks, each with its evidence and the result that should make you stop."
              aside={
                <FreshnessBadge
                  meta={risks.meta}
                  section="Risk Radar"
                  refreshing={refreshRisks.isPending}
                  onRefresh={() =>
                    refreshRisks.mutate(undefined, {
                      onSuccess: () => toast.success("Risk Radar refreshed"),
                      onError: () => toast.error("Couldn't refresh the Risk Radar"),
                    })
                  }
                />
              }
            />
          </div>
          <RiskRadar risks={risks.risks} />
        </section>
        <div className="min-w-0">
          <LatestEvents events={monitoring.events} startupId={startup.id} />
        </div>
      </div>
    </div>
  );
}
