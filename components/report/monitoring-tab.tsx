"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CircleAlert, ExternalLink, RotateCcw, RotateCw, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useMonitoring, useRefreshMonitoring } from "@/lib/queries";
import { sourceLabel } from "@/lib/sources";
import { useHydratedStore, useWorkspaceStore } from "@/lib/store";
import type { Competitor, MonitoringEvent } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

import { EVENT_TYPE, RelativeTime, SEVERITY, SeverityBadge, simulatedWeek } from "@/components/monitoring/event-meta";

import { FreshnessBadge } from "./freshness-badge";
import { Panel, SectionHeader } from "./section-header";

const HIGHLIGHT_MS = 2600;

// ---------------------------------------------------------------------------
// Change feed item
// ---------------------------------------------------------------------------

function FeedItem({
  event,
  competitorName,
  now,
  highlighted,
}: {
  event: MonitoringEvent;
  competitorName: string;
  now: number | null;
  highlighted: boolean;
}) {
  const severity = SEVERITY[event.severity];
  const type = EVENT_TYPE[event.type];
  const Icon = type.icon;
  const week = simulatedWeek(event);

  return (
    <motion.li
      layout="position"
      initial={highlighted ? { opacity: 0, y: -12 } : false}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative"
    >
      <article
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-background py-4 pr-4 pl-5 transition-[background-color,border-color,box-shadow] duration-700",
          highlighted ? "border-brand/50 bg-brand-soft shadow-float" : "border-border",
        )}
      >
        <span aria-hidden="true" className={cn("absolute inset-y-0 left-0 w-1", severity.stripe)} />
        <div className="flex flex-wrap items-center gap-2">
          <SeverityBadge level={event.severity} />
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <Icon aria-hidden="true" className="size-3.5" />
            {type.label}
          </span>
          <span aria-hidden="true" className="text-muted-foreground">·</span>
          <span className="truncate text-xs text-muted-foreground">{competitorName}</span>
          {week !== null && (
            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2 py-0.5 text-[11px] font-medium text-brand">
              <Sparkles aria-hidden="true" className="size-3" />
              Simulated week {week}
            </span>
          )}
          <span className="ml-auto text-xs whitespace-nowrap text-muted-foreground">
            <RelativeTime iso={event.at} now={now} />
          </span>
        </div>
        <h4 className="mt-2 font-medium text-foreground">{event.title}</h4>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{event.detail}</p>
        {event.sourceUrl && (
          <a
            href={event.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 rounded text-xs font-medium text-brand hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {sourceLabel(event.sourceUrl)}
            <ExternalLink aria-hidden="true" className="size-3" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        )}
      </article>
    </motion.li>
  );
}

// ---------------------------------------------------------------------------
// Alert settings (UI only)
// ---------------------------------------------------------------------------

type ThresholdField = { id: string; label: string; options: { value: string; label: string }[]; initial: string };

const THRESHOLDS: ThresholdField[] = [
  {
    id: "rating-drop",
    label: "Rating drops by at least",
    initial: "0.2",
    options: [
      { value: "0.1", label: "0.1★" },
      { value: "0.2", label: "0.2★" },
      { value: "0.3", label: "0.3★" },
      { value: "0.5", label: "0.5★" },
    ],
  },
  {
    id: "price-change",
    label: "Price changes by at least",
    initial: "5",
    options: [
      { value: "5", label: "5%" },
      { value: "10", label: "10%" },
      { value: "20", label: "20%" },
    ],
  },
  {
    id: "complaint-spike",
    label: "Complaint share rises by at least",
    initial: "0.5",
    options: [
      { value: "0.5", label: "+0.5 pts" },
      { value: "1", label: "+1.0 pts" },
      { value: "2", label: "+2.0 pts" },
    ],
  },
  {
    id: "min-severity",
    label: "Only alert me for",
    initial: "medium",
    options: [
      { value: "low", label: "All changes" },
      { value: "medium", label: "Medium and high" },
      { value: "high", label: "High only" },
    ],
  },
];

function AlertSettings() {
  const [telegram, setTelegram] = useState(true);
  const [email, setEmail] = useState(true);
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(THRESHOLDS.map((t) => [t.id, t.initial])),
  );

  return (
    <Panel>
      <h3 className="text-base font-semibold text-foreground">Alert settings</h3>
      <p className="mt-1 text-sm text-muted-foreground">Choose where alerts go and what counts as a change.</p>

      <div className="mt-5 space-y-4">
        {[
          { id: "alert-telegram", label: "Telegram", hint: "Instant messages from the GapScope bot", checked: telegram, set: setTelegram },
          { id: "alert-email", label: "Email", hint: "A digest plus instant high-severity alerts", checked: email, set: setEmail },
        ].map((ch) => (
          <div key={ch.id} className="flex items-center justify-between gap-4">
            <div>
              <Label htmlFor={ch.id} className="text-sm font-medium text-foreground">
                {ch.label}
              </Label>
              <p className="text-xs text-muted-foreground">{ch.hint}</p>
            </div>
            <Switch
              id={ch.id}
              checked={ch.checked}
              onCheckedChange={ch.set}
              className="data-[state=checked]:bg-brand"
            />
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-4 border-t border-border pt-5">
        {THRESHOLDS.map((t) => (
          <div key={t.id} className="grid grid-cols-[1fr_auto] items-center gap-3">
            <Label htmlFor={t.id} className="text-sm font-normal text-foreground">
              {t.label}
            </Label>
            <Select value={values[t.id]} onValueChange={(v) => setValues((cur) => ({ ...cur, [t.id]: v }))}>
              <SelectTrigger id={t.id} size="sm" className="min-w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent align="end">
                {t.options.map((o) => (
                  <SelectItem key={o.value} value={o.value}>
                    {o.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>

      <Button
        type="button"
        variant="subtle"
        size="lg"
        className="mt-6 w-full rounded-lg"
        onClick={() =>
          toast.success("Alert settings saved", {
            description: [telegram && "Telegram", email && "Email"].filter(Boolean).join(" + ") || "All channels off",
          })
        }
      >
        Save settings
      </Button>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">Demo only: settings are not sent anywhere.</p>
    </Panel>
  );
}

// ---------------------------------------------------------------------------
// Tab
// ---------------------------------------------------------------------------

const NO_WEEKS: Record<string, number> = {};

export function MonitoringTab({ startupId, competitors }: { startupId: string; competitors: Competitor[] }) {
  const { data, isPending, isError, refetch } = useMonitoring(startupId);
  const refresh = useRefreshMonitoring(startupId);
  const simulateNextWeek = useWorkspaceStore((s) => s.simulateNextWeek);
  const resetSimulation = useWorkspaceStore((s) => s.resetSimulation);
  const weeks = useHydratedStore((s) => s.simulatedWeeks, NO_WEEKS)[startupId] ?? 0;
  const now = useNow(30_000);

  const [highlight, setHighlight] = useState<Set<string>>(new Set());
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const nameOf = (id: string) => competitors.find((c) => c.id === id)?.name ?? "New competitor";

  function simulate() {
    const events = simulateNextWeek(startupId);
    setHighlight(new Set(events.map((e) => e.id)));
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setHighlight(new Set()), HIGHLIGHT_MS);
    const high = events.filter((e) => e.severity === "high").length;
    toast.success(`Week ${weeks + 1} simulated: ${events.length} new events`, {
      description: high > 0 ? `${high} high-severity: ${events.find((e) => e.severity === "high")?.title}` : events[0]?.title,
    });
  }

  if (isPending) {
    return (
      <div aria-busy="true" aria-label="Loading monitoring" className="space-y-6">
        <Skeleton className="h-8 w-56" />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
          <Skeleton className="h-96 rounded-3xl" />
          <Skeleton className="h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div role="alert" className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-14 text-center">
        <CircleAlert aria-hidden="true" className="size-8 text-destructive" />
        <h2 className="mt-4 text-lg font-semibold text-foreground">Couldn&apos;t load monitoring</h2>
        <Button variant="subtle" size="lg" className="mt-6" onClick={() => refetch()}>
          <RotateCw aria-hidden="true" />
          Try again
        </Button>
      </div>
    );
  }

  const highCount = data.events.filter((e) => e.severity === "high").length;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Live monitoring"
        description="GapScope checks your competitors for rating, price, hiring and news changes, and flags new competitors."
        aside={
          <FreshnessBadge
            meta={data.meta}
            section="Live monitoring"
            refreshing={refresh.isPending}
            onRefresh={() =>
              refresh.mutate(undefined, {
                onSuccess: (fresh) =>
                  toast.success("Monitoring refreshed", {
                    description: fresh ? `Checked ${fresh.watched.length} competitors live` : undefined,
                  }),
                onError: () => toast.error("Couldn't refresh monitoring"),
              })
            }
          />
        }
      />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="space-y-6">
          <Panel>
            <h3 className="text-base font-semibold text-foreground">Watched competitors</h3>
            <ul className="mt-4 divide-y divide-border">
              {data.watched.map((w) => (
                <li key={w.competitorId} className="flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{w.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Checked <RelativeTime iso={w.lastCheckedAt} now={now} />
                    </p>
                  </div>
                  <Badge variant={w.frequency === "daily" ? "default" : "outline"} className={w.frequency === "daily" ? "bg-brand-soft text-brand" : undefined}>
                    {w.frequency === "daily" ? "Daily" : "Weekly"}
                  </Badge>
                </li>
              ))}
            </ul>
          </Panel>
          <AlertSettings />
        </div>

        <Panel className="order-first min-w-0 lg:order-last">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-base font-semibold text-foreground">Change feed</h3>
              <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
                {data.events.length} changes, newest first · {highCount} high severity
                {weeks > 0 && ` · ${weeks} simulated ${weeks === 1 ? "week" : "weeks"}`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {weeks > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  className="rounded-lg"
                  onClick={() => {
                    resetSimulation(startupId);
                    setHighlight(new Set());
                    toast("Simulation reset", { description: "Simulated events were removed." });
                  }}
                >
                  <RotateCcw aria-hidden="true" />
                  Reset
                </Button>
              )}
              <Button type="button" variant="gradient" size="lg" className="rounded-lg" onClick={simulate}>
                <Sparkles aria-hidden="true" />
                Simulate next week
              </Button>
            </div>
          </div>

          {data.events.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-border px-6 py-12 text-center">
              <p className="font-medium text-foreground">No changes yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                GapScope will list rating, price, hiring and news changes here. Try &ldquo;Simulate next week&rdquo;.
              </p>
            </div>
          ) : (
            <ul className="mt-5 space-y-3" aria-label="Monitoring events, newest first">
              <AnimatePresence initial={false}>
                {data.events.map((event) => (
                  <FeedItem
                    key={event.id}
                    event={event}
                    competitorName={nameOf(event.competitorId)}
                    now={now}
                    highlighted={highlight.has(event.id)}
                  />
                ))}
              </AnimatePresence>
            </ul>
          )}
        </Panel>
      </div>
    </div>
  );
}
