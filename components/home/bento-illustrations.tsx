import {
  BookOpen,
  Brain,
  CalendarClock,
  GraduationCap,
  Smartphone,
  Star,
  Timer,
  TriangleAlert,
  Users,
} from "lucide-react";

import { CursorTag } from "@/components/marketing/cursor-tag";
import { LogoMark } from "@/components/marketing/logo";
import { OrbitRings, type OrbitChip } from "@/components/marketing/orbit-rings";
import { cn } from "@/lib/utils";

import { WindowDots } from "./window-dots";

// ---------------------------------------------------------------------------
// "Gaps as real numbers": grey bars with one orange bar (04-bento-grid.png)
// ---------------------------------------------------------------------------

const BARS = [
  { label: "Pricing", score: 34 },
  { label: "Wait times", score: 61 },
  { label: "Staff", score: 28 },
  { label: "Wi-Fi", score: 72 },
  { label: "Seating", score: 50 },
  { label: "Late closing", score: 100, highlight: true },
];

export function GapBarChart() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-end justify-center px-6 pt-8 sm:px-10">
      <div className="relative w-full max-w-sm">
        <div className="relative h-56 rounded-t-3xl border border-b-0 border-border bg-background px-5 pt-4 shadow-soft sm:h-60">
          <WindowDots />
          <div className="absolute inset-x-5 bottom-0 flex h-40 items-end justify-between gap-2 sm:h-44">
            {BARS.map((bar) => (
              <div
                key={bar.label}
                className={cn(
                  "w-full rounded-t-full",
                  bar.highlight
                    ? "bg-[linear-gradient(180deg,var(--brand-light),color-mix(in_oklab,var(--brand-light)_20%,transparent))]"
                    : "bg-[linear-gradient(180deg,#d4d4d4,color-mix(in_oklab,#d4d4d4_15%,transparent))] dark:bg-[linear-gradient(180deg,#525252,transparent)]",
                )}
                style={{ height: `${bar.score}%` }}
              />
            ))}
          </div>
          <CursorTag label="Late closing 3.3%" pointer="right" className="absolute top-7 right-12" />
        </div>
        <div className="relative -mt-6 flex items-center justify-between rounded-full border border-border bg-background py-1.5 pr-1.5 pl-5 shadow-float">
          <span className="truncate text-xs text-muted-foreground sm:text-sm">Opportunity by gap</span>
          <span className="rounded-full bg-[linear-gradient(180deg,#5a5a5a,#1f1f1f)] px-4 py-2 text-sm font-medium whitespace-nowrap text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
            View sources
          </span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// "Nearest-neighbour mode": your startup in the centre, neighbours on the rings
// ---------------------------------------------------------------------------

const NEIGHBOUR_CHIPS: OrbitChip[] = [
  { icon: CalendarClock, label: "PrepPath (81% similar)", ring: 1, angle: -35 },
  { icon: GraduationCap, label: "ExamPilot (74% similar)", ring: 1, angle: 200 },
  { icon: Brain, label: "Notewise (70% similar)", ring: 0, angle: -60 },
  { icon: Timer, label: "FocusForge (68% similar)", ring: 0, angle: -150 },
  { icon: BookOpen, label: "StudyGrid (62% similar)", ring: 0, angle: -100 },
  { icon: Smartphone, label: "Play Store reviews", ring: 0, angle: 190 },
  { icon: Star, label: "App Store ratings", ring: 0, angle: 10 },
];

export function NeighbourOrbit() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-start justify-center px-6 pt-6">
      <div className="relative w-full max-w-[20rem]">
        <OrbitRings
          chips={NEIGHBOUR_CHIPS}
          center={
            <span className="flex flex-col items-center gap-1.5">
              <LogoMark className="size-10" />
              <span className="rounded-full bg-background px-2 py-0.5 text-[11px] font-medium text-foreground shadow-soft">
                StudySprint
              </span>
            </span>
          }
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// "Live alerts": Telegram-style notification window (05-bento-grid-2.png)
// ---------------------------------------------------------------------------

const ALERTS = [
  { level: "High", title: "Bean Theory is hiring night-shift baristas", meta: "3 roles ending at 1 am · Google Jobs", channel: "Telegram", time: "2h ago" },
  { level: "High", title: "\"Late closing hours\" complaints up +0.9 pts", meta: "Now 3.3% of 1,240 reviews · Google Maps", channel: "Email", time: "1d ago" },
  { level: "Medium", title: "New café: Roast Republic, Lokhandwala", meta: "1.4 km away, open till 11:30 pm · Google Maps", channel: "Telegram", time: "2d ago" },
];

export function LiveAlerts() {
  return (
    <div aria-hidden="true" className="absolute inset-0 flex items-end justify-center px-4 pt-8 sm:px-10">
      <div className="w-full max-w-2xl rounded-t-3xl border border-b-0 border-border bg-background shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <WindowDots />
          <span className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Watching 5 competitors
          </span>
        </div>
        <div className="grid gap-3 p-4 sm:grid-cols-[12rem_1fr] sm:p-5">
          <div className="hidden rounded-2xl bg-card p-4 sm:block">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft">
                <LogoMark className="size-6" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">GapScope</p>
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400">online</p>
              </div>
            </div>
            <p className="mt-4 text-[11px] tracking-wide text-muted-foreground uppercase">Brew &amp; Stay</p>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-foreground/80">
              <Users className="size-3.5" /> 5 competitors
            </p>
          </div>
          <ul className="space-y-2.5">
            {ALERTS.map((alert, i) => (
              <li
                key={alert.title}
                className={cn(
                  "rounded-2xl rounded-tl-md border border-border bg-card px-4 py-3",
                  i === ALERTS.length - 1 && "hidden sm:block",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-semibold",
                      alert.level === "High"
                        ? "bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
                        : "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400",
                    )}
                  >
                    <TriangleAlert className="size-3" /> {alert.level}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {alert.channel} · {alert.time}
                  </span>
                </div>
                <p className="mt-1.5 text-sm font-medium text-foreground">{alert.title}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{alert.meta}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
