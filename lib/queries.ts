"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as api from "./api";
import { useHasHydrated, useWorkspaceStore } from "./store";
import type {
  MonitoringData,
  MonitoringEvent,
  Report,
  RiskReport,
  Startup,
  StartupOverview,
} from "./types";

// ---------------------------------------------------------------------------
// Keys
// ---------------------------------------------------------------------------

export const queryKeys = {
  startups: (localIds: string[]) => ["startups", localIds.join(",")] as const,
  startup: (id: string) => ["startup", id] as const,
  report: (id: string) => ["report", id] as const,
  monitoring: (id: string) => ["monitoring", id] as const,
  risks: (id: string) => ["risks", id] as const,
  systemStats: () => ["system-stats"] as const,
};

// ---------------------------------------------------------------------------
// Store helpers (selectors return stable references to avoid re-render loops)
// ---------------------------------------------------------------------------

const EMPTY_EVENTS: MonitoringEvent[] = [];

function useLocalStartup(id: string): Startup | undefined {
  return useWorkspaceStore((state) => state.userStartups.find((s) => s.id === id));
}

function useSimulatedEvents(): MonitoringEvent[] {
  const hydrated = useHasHydrated();
  const events = useWorkspaceStore((state) => state.simulatedEvents);
  return hydrated ? events : EMPTY_EVENTS;
}

function newestFirst(a: MonitoringEvent, b: MonitoringEvent): number {
  return a.at < b.at ? 1 : a.at > b.at ? -1 : 0;
}

function withSimulatedAlerts(overview: StartupOverview, simulated: MonitoringEvent[]): StartupOverview {
  const extra = simulated.filter(
    (e) => e.startupId === overview.startup.id && e.severity !== "low",
  ).length;
  if (extra === 0) return overview;
  const latest = simulated.find((e) => e.startupId === overview.startup.id)?.at;
  return {
    ...overview,
    summary: {
      ...overview.summary,
      openAlerts: overview.summary.openAlerts + extra,
      lastUpdatedAt:
        latest && latest > overview.summary.lastUpdatedAt ? latest : overview.summary.lastUpdatedAt,
    },
  };
}

// ---------------------------------------------------------------------------
// Queries. Every hook waits for the store to hydrate so user-added startups and
// simulated events are known before the first fetch (no hydration mismatch).
// ---------------------------------------------------------------------------

/** All startups (demo + added in this browser) with their summary numbers. */
export function useStartups() {
  const hydrated = useHasHydrated();
  const local = useWorkspaceStore((state) => state.userStartups);
  const simulated = useSimulatedEvents();

  const select = useCallback(
    (list: StartupOverview[]) => list.map((o) => withSimulatedAlerts(o, simulated)),
    [simulated],
  );

  return useQuery({
    queryKey: queryKeys.startups(local.map((s) => s.id)),
    queryFn: () => api.listStartups(local),
    enabled: hydrated,
    select,
  });
}

/** One startup, or `null` when the id is unknown (show "Startup not found"). */
export function useStartup(id: string) {
  const hydrated = useHasHydrated();
  const local = useLocalStartup(id);
  const simulated = useSimulatedEvents();

  const select = useCallback(
    (overview: StartupOverview | null) => (overview ? withSimulatedAlerts(overview, simulated) : null),
    [simulated],
  );

  return useQuery({
    queryKey: [...queryKeys.startup(id), local?.id ?? null],
    queryFn: () => api.getStartup(id, local),
    enabled: hydrated,
    select,
  });
}

export function useReport(id: string) {
  const hydrated = useHasHydrated();
  const local = useLocalStartup(id);

  return useQuery({
    queryKey: [...queryKeys.report(id), local?.id ?? null],
    queryFn: () => api.getReport(id, { local }),
    enabled: hydrated,
  });
}

/** Monitoring data with "Simulate next week" events merged in, newest first. */
export function useMonitoring(id: string) {
  const hydrated = useHasHydrated();
  const local = useLocalStartup(id);
  const simulated = useSimulatedEvents();

  const select = useCallback(
    (data: MonitoringData | null): MonitoringData | null => {
      if (!data) return null;
      const extra = simulated.filter((e) => e.startupId === id);
      return { ...data, events: [...extra, ...data.events].sort(newestFirst) };
    },
    [simulated, id],
  );

  return useQuery({
    queryKey: [...queryKeys.monitoring(id), local?.id ?? null],
    queryFn: () => api.getMonitoring(id, { local }),
    enabled: hydrated,
    select,
  });
}

export function useRisks(id: string) {
  const hydrated = useHasHydrated();
  const local = useLocalStartup(id);

  return useQuery({
    queryKey: [...queryKeys.risks(id), local?.id ?? null],
    queryFn: () => api.getRisks(id, { local }),
    enabled: hydrated,
  });
}

export function useSystemStats() {
  return useQuery({
    queryKey: queryKeys.systemStats(),
    queryFn: () => api.getSystemStats(),
  });
}

// ---------------------------------------------------------------------------
// Refresh (FreshnessBadge "Refresh" button): fetch live data and replace the cache.
// ---------------------------------------------------------------------------

export function useRefreshReport(id: string) {
  const client = useQueryClient();
  const local = useLocalStartup(id);
  return useMutation({
    mutationFn: () => api.getReport(id, { local, refresh: true }),
    onSuccess: (data: Report | null) =>
      client.setQueryData([...queryKeys.report(id), local?.id ?? null], data),
  });
}

export function useRefreshMonitoring(id: string) {
  const client = useQueryClient();
  const local = useLocalStartup(id);
  return useMutation({
    mutationFn: () => api.getMonitoring(id, { local, refresh: true }),
    onSuccess: (data: MonitoringData | null) =>
      client.setQueryData([...queryKeys.monitoring(id), local?.id ?? null], data),
  });
}

export function useRefreshRisks(id: string) {
  const client = useQueryClient();
  const local = useLocalStartup(id);
  return useMutation({
    mutationFn: () => api.getRisks(id, { local, refresh: true }),
    onSuccess: (data: RiskReport | null) =>
      client.setQueryData([...queryKeys.risks(id), local?.id ?? null], data),
  });
}
