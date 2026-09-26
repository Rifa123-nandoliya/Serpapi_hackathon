"use client";

import {
  Briefcase,
  IndianRupee,
  Newspaper,
  ShieldAlert,
  ShieldCheck,
  Star,
  Store,
  TrendingUp,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { formatRelativeShort } from "@/lib/format";
import type { MonitoringEvent, MonitoringEventType, Severity } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Semantic colours from CLAUDE.md §2: red = high, amber = medium, grey = low. Always paired with a label. */
export const SEVERITY: Record<Severity, { label: string; badge: string; stripe: string; rank: number }> = {
  high: {
    label: "High",
    badge: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400",
    stripe: "bg-risk-high",
    rank: 2,
  },
  medium: {
    label: "Medium",
    badge: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
    stripe: "bg-risk-medium",
    rank: 1,
  },
  low: {
    label: "Low",
    badge: "bg-muted text-muted-foreground",
    stripe: "bg-inactive",
    rank: 0,
  },
};

export const EVENT_TYPE: Record<MonitoringEventType, { label: string; icon: LucideIcon }> = {
  rating_change: { label: "Rating", icon: Star },
  price_change: { label: "Price", icon: IndianRupee },
  hiring: { label: "Hiring", icon: Briefcase },
  news: { label: "News", icon: Newspaper },
  complaint_spike: { label: "Complaint spike", icon: TrendingUp },
  new_competitor: { label: "New competitor", icon: Store },
};

export function SeverityBadge({ level, suffix = "severity", className }: { level: Severity; suffix?: string; className?: string }) {
  const s = SEVERITY[level];
  const Icon = level === "low" ? ShieldCheck : level === "medium" ? ShieldAlert : TriangleAlert;
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[11px] font-semibold", s.badge, className)}>
      <Icon aria-hidden="true" className="size-3" />
      {s.label}
      <span className="sr-only"> {suffix}</span>
    </span>
  );
}

/** Relative time, rendered only after mount (placeholder before) so server and client HTML match. */
export function RelativeTime({ iso, now }: { iso: string; now: number | null }) {
  if (now === null) return <span className="inline-block h-3 w-12 animate-pulse rounded bg-muted align-middle" />;
  return <time dateTime={iso}>{formatRelativeShort(iso, now)}</time>;
}

export function simulatedWeek(event: MonitoringEvent): number | null {
  const match = /-sim-w(\d+)-/.exec(event.id);
  return match ? Number(match[1]) : null;
}
