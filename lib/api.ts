/**
 * The only file that talks to data. With USE_MOCK = true every call resolves typed
 * mock data after 300–600 ms; set it to false to call the FastAPI backend instead.
 */
import {
  bundleForLocalStartup,
  getMockBundle,
  MOCK_BUNDLES,
  overviewOf,
  systemStats,
  type MockBundle,
} from "./mock";
import type {
  MonitoringData,
  Report,
  ReportSection,
  RiskReport,
  SectionMeta,
  Startup,
  StartupOverview,
  SystemStats,
} from "./types";

export const USE_MOCK = true;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type FetchOptions = {
  /** Bypass the cache and fetch live data (the "Refresh" button). */
  refresh?: boolean;
  /** A startup added in this browser (Zustand store) that the mock data doesn't know. */
  local?: Startup;
};

// ---------------------------------------------------------------------------
// Transport
// ---------------------------------------------------------------------------

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
  return Math.round(min + Math.random() * (max - min));
}

/** Simulated network latency; live refreshes take longer than cache hits. */
async function simulateLatency(refresh = false): Promise<number> {
  const ms = refresh ? randomBetween(900, 1400) : randomBetween(300, 600);
  await wait(ms);
  return ms;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/** GET JSON from the backend. Resolves null on 404 so callers can show "not found". */
async function getJson<T>(path: string): Promise<T | null> {
  const res = await fetch(`${API_BASE_URL}${path}`, { headers: { Accept: "application/json" } });
  if (res.status === 404) return null;
  if (!res.ok) throw new ApiError(`Request to ${path} failed (${res.status})`, res.status);
  return (await res.json()) as T;
}

function query(options: FetchOptions): string {
  return options.refresh ? "?refresh=1" : "";
}

// ---------------------------------------------------------------------------
// Mock helpers
// ---------------------------------------------------------------------------

function findBundle(id: string, local?: Startup): MockBundle | undefined {
  const bundle = getMockBundle(id);
  if (bundle) return bundle;
  if (local && local.id === id) return bundleForLocalStartup(local);
  return undefined;
}

/** Deep copy so callers can never mutate the shared mock objects. */
function copy<T>(value: T): T {
  return structuredClone(value);
}

function liveMeta(latencyMs: number, serpCalls: number): SectionMeta {
  return { cached: false, fetchedAt: new Date().toISOString(), latencyMs, serpCalls };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export async function listStartups(local: Startup[] = []): Promise<StartupOverview[]> {
  if (!USE_MOCK) return (await getJson<StartupOverview[]>("/startups")) ?? [];

  await simulateLatency();
  const localBundles = local
    .filter((s) => !getMockBundle(s.id))
    .map((s) => bundleForLocalStartup(s));
  return copy([...MOCK_BUNDLES, ...localBundles].map(overviewOf));
}

export async function getStartup(id: string, local?: Startup): Promise<StartupOverview | null> {
  if (!USE_MOCK) return getJson<StartupOverview>(`/startups/${encodeURIComponent(id)}`);

  await simulateLatency();
  const bundle = findBundle(id, local);
  return bundle ? copy(overviewOf(bundle)) : null;
}

export async function getReport(id: string, options: FetchOptions = {}): Promise<Report | null> {
  if (!USE_MOCK) {
    return getJson<Report>(`/startups/${encodeURIComponent(id)}/report${query(options)}`);
  }

  const latency = await simulateLatency(options.refresh);
  const bundle = findBundle(id, options.local);
  if (!bundle) return null;

  const report = copy(bundle.report);
  if (options.refresh) {
    const sections = Object.keys(report.meta) as ReportSection[];
    for (const section of sections) {
      report.meta[section] = liveMeta(latency, section === "overview" ? 0 : randomBetween(3, 9));
    }
  }
  return report;
}

export async function getMonitoring(
  id: string,
  options: FetchOptions = {},
): Promise<MonitoringData | null> {
  if (!USE_MOCK) {
    return getJson<MonitoringData>(`/startups/${encodeURIComponent(id)}/monitoring${query(options)}`);
  }

  const latency = await simulateLatency(options.refresh);
  const bundle = findBundle(id, options.local);
  if (!bundle) return null;

  const monitoring = copy(bundle.monitoring);
  if (options.refresh) monitoring.meta = liveMeta(latency, monitoring.watched.length);
  return monitoring;
}

export async function getRisks(id: string, options: FetchOptions = {}): Promise<RiskReport | null> {
  if (!USE_MOCK) {
    return getJson<RiskReport>(`/startups/${encodeURIComponent(id)}/risks${query(options)}`);
  }

  const latency = await simulateLatency(options.refresh);
  const bundle = findBundle(id, options.local);
  if (!bundle) return null;

  const risks = copy(bundle.risks);
  if (options.refresh) risks.meta = liveMeta(latency, randomBetween(4, 8));
  return risks;
}

export async function getSystemStats(): Promise<SystemStats> {
  if (!USE_MOCK) {
    const stats = await getJson<SystemStats>("/system/stats");
    if (!stats) throw new ApiError("System stats not found", 404);
    return stats;
  }

  await simulateLatency();
  return copy(systemStats);
}
