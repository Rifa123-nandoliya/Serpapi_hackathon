import type { ClusterPoint, SeriesPoint } from "../types";

// ---------------------------------------------------------------------------
// Deterministic randomness. Mock data is generated once at module load from
// fixed seeds, so the server and the client always produce identical values.
// ---------------------------------------------------------------------------

export type Rng = () => number;

/** mulberry32 PRNG: returns floats in [0, 1). */
export function mulberry32(seed: number): Rng {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Stable 32-bit hash of a string, for deriving seeds from ids. */
export function hashSeed(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Standard normal sample (Box–Muller). */
export function gaussian(rng: Rng): number {
  const u = Math.max(rng(), 1e-9);
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

export function round(value: number, decimals = 2): number {
  const f = 10 ** decimals;
  return Math.round(value * f) / f;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

// ---------------------------------------------------------------------------
// Fixed time. All timestamps are ISO strings derived from one anchor.
// ---------------------------------------------------------------------------

/** The moment the mock snapshot was taken. */
export const MOCK_NOW = "2026-09-26T09:00:00.000Z";

const DAY_MS = 24 * 60 * 60 * 1000;
const HOUR_MS = 60 * 60 * 1000;
const ANCHOR_MS = Date.parse(MOCK_NOW);

/** ISO timestamp `days` days and `hours` hours before MOCK_NOW (negative = after). */
export function isoAgo(days: number, hours = 0): string {
  return new Date(ANCHOR_MS - days * DAY_MS - hours * HOUR_MS).toISOString();
}

/** ISO timestamp `weeks` weeks after MOCK_NOW. */
export function isoWeeksAfter(weeks: number, hours = 0): string {
  return new Date(ANCHOR_MS + weeks * 7 * DAY_MS + hours * HOUR_MS).toISOString();
}

/** `count` weekly dates (yyyy-MM-dd) ending on the week of MOCK_NOW, oldest first. */
export function weeklyDates(count: number): string[] {
  return Array.from({ length: count }, (_, i) =>
    new Date(ANCHOR_MS - (count - 1 - i) * 7 * DAY_MS).toISOString().slice(0, 10),
  );
}

// ---------------------------------------------------------------------------
// Series generators
// ---------------------------------------------------------------------------

/** Values drifting from `start` to `end` with seeded noise. */
export function trendSeries(
  rng: Rng,
  dates: string[],
  start: number,
  end: number,
  noise: number,
  decimals = 2,
  min = Number.NEGATIVE_INFINITY,
  max = Number.POSITIVE_INFINITY,
): SeriesPoint[] {
  const last = dates.length - 1;
  return dates.map((date, i) => {
    const base = last === 0 ? end : start + ((end - start) * i) / last;
    const jitter = i === last ? 0 : gaussian(rng) * noise;
    return { date, value: round(clamp(base + jitter, min, max), decimals) };
  });
}

/** Step-wise values: `initial` until each change's week index, then the new value. */
export function stepSeries(
  dates: string[],
  initial: number,
  changes: { week: number; value: number }[],
): SeriesPoint[] {
  return dates.map((date, i) => {
    let value = initial;
    for (const change of changes) {
      if (i >= change.week) value = change.value;
    }
    return { date, value };
  });
}

/** Seeded 2-D blob of review embeddings around a centre, for the cluster map. */
export function clusterPoints(
  seed: number,
  clusterId: string,
  count: number,
  centre: { x: number; y: number },
  spread: number,
): ClusterPoint[] {
  const rng = mulberry32(seed);
  const n = clamp(Math.round(count / 3), 12, 70);
  return Array.from({ length: n }, (_, i) => ({
    x: round(centre.x + gaussian(rng) * spread),
    y: round(centre.y + gaussian(rng) * spread),
    reviewId: `${clusterId}-r${i + 1}`,
  }));
}

// ---------------------------------------------------------------------------
// Source links. Every claim in the UI links to where it came from.
// ---------------------------------------------------------------------------

const q = (value: string) => encodeURIComponent(value);

export const sources = {
  maps: (query: string) => `https://www.google.com/maps/search/?api=1&query=${q(query)}`,
  search: (query: string) => `https://www.google.com/search?q=${q(query)}`,
  news: (query: string) => `https://news.google.com/search?q=${q(query)}`,
  jobs: (query: string) => `https://www.google.com/search?q=${q(`${query} jobs`)}&ibp=htl;jobs`,
  trends: (query: string) => `https://trends.google.com/trends/explore?geo=IN&q=${q(query)}`,
  playStore: (query: string) => `https://play.google.com/store/search?q=${q(query)}&c=apps`,
  appStore: (query: string) => `https://www.google.com/search?q=${q(`${query} site:apps.apple.com`)}`,
  shopping: (query: string) => `https://www.google.com/search?q=${q(query)}&tbm=shop`,
};
