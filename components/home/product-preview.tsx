import { BellRing, LayoutGrid, ChartColumn, TriangleAlert } from "lucide-react";

import { LogoMark } from "@/components/marketing/logo";

import { WindowDots } from "./window-dots";

const KPIS = [
  { value: "1,240", label: "reviews analysed" },
  { value: "5", label: "competitors watched" },
  { value: "7", label: "clusters · silhouette 0.61" },
  { value: "3", label: "high-severity alerts" },
];

const GAPS = [
  { title: "Stay open until 1 am", share: "3.3%", score: 86 },
  { title: "Seating for 3-hour sessions", share: "11.2%", score: 79 },
  { title: "Business-grade Wi-Fi", share: "4.7%", score: 72 },
  { title: "Order-ahead and buzzers", share: "15.0%", score: 61 },
];

/** Mini dashboard mock that peeks out of the hero gradient (not an image). */
export function ProductPreview() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-5xl rounded-t-3xl border border-b-0 border-white/70 bg-white/50 p-2 pb-0 shadow-[0_-8px_40px_-12px_rgb(240_90_40/0.35)] backdrop-blur-sm sm:p-3 sm:pb-0 dark:border-white/10 dark:bg-white/5"
    >
      <div className="h-[300px] overflow-hidden rounded-t-2xl border border-b-0 border-border bg-background sm:h-[380px]">
        {/* Window chrome */}
        <div className="flex items-center gap-3 border-b border-border px-4 py-3">
          <WindowDots />
          <div className="mx-auto hidden rounded-full bg-muted px-4 py-1 text-xs text-muted-foreground sm:block">
            gapscope.app/workspace/brew-and-stay
          </div>
        </div>

        <div className="flex h-full">
          {/* Sidebar */}
          <div className="hidden w-48 shrink-0 border-r border-border p-3 text-left md:block">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <LogoMark className="size-5" />
              <span className="text-sm font-medium text-foreground">GapScope</span>
            </div>
            <div className="mt-3 space-y-1 text-xs">
              <div className="flex items-center gap-2 rounded-lg bg-muted px-2 py-1.5 text-foreground">
                <LayoutGrid className="size-3.5 text-brand" /> Workspace
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 text-muted-foreground">
                <ChartColumn className="size-3.5" /> Dashboard
              </div>
            </div>
            <p className="mt-4 px-2 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
              Your startups
            </p>
            <div className="mt-1.5 space-y-1 text-xs">
              {["Brew & Stay", "StudySprint"].map((name, i) => (
                <div
                  key={name}
                  className={
                    i === 0
                      ? "flex items-center gap-2 rounded-lg bg-muted px-2 py-1.5 text-foreground"
                      : "flex items-center gap-2 px-2 py-1.5 text-muted-foreground"
                  }
                >
                  <span className="flex size-4 items-center justify-center rounded bg-brand-soft text-[9px] font-semibold text-brand">
                    {name.charAt(0)}
                  </span>
                  {name}
                </div>
              ))}
            </div>
          </div>

          {/* Main */}
          <div className="min-w-0 flex-1 p-4 text-left sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold tracking-tight text-foreground sm:text-lg">Brew &amp; Stay</h3>
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                Café · Andheri West
              </span>
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
                Monitoring
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
              {KPIS.map((kpi) => (
                <div key={kpi.label} className="rounded-xl border border-border bg-card p-2.5 sm:p-3">
                  <p className="text-lg font-bold tracking-tight text-foreground sm:text-xl">{kpi.value}</p>
                  <p className="truncate text-[10px] text-muted-foreground sm:text-[11px]">{kpi.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
              <div className="rounded-xl border border-border bg-card p-3 sm:p-4">
                <p className="text-xs font-medium text-foreground">Top gaps by Opportunity Score</p>
                <div className="mt-3 space-y-2.5">
                  {GAPS.map((gap, i) => (
                    <div key={gap.title} className="flex items-center gap-3 text-[11px]">
                      <span className="w-32 shrink-0 truncate text-foreground/80 sm:w-40">{gap.title}</span>
                      <div className="h-2 flex-1 rounded-full bg-muted">
                        <div
                          className={
                            i === 0
                              ? "h-2 rounded-full bg-[linear-gradient(90deg,var(--brand),var(--brand-light))]"
                              : "h-2 rounded-full bg-neutral-300 dark:bg-neutral-600"
                          }
                          style={{ width: `${gap.score}%` }}
                        />
                      </div>
                      <span className="w-6 text-right font-semibold text-foreground">{gap.score}</span>
                      <span className="hidden w-10 text-right text-muted-foreground sm:inline">{gap.share}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hidden rounded-xl border border-border bg-card p-3 sm:p-4 lg:block">
                <p className="flex items-center gap-1.5 text-xs font-medium text-foreground">
                  <BellRing className="size-3.5 text-brand" /> Latest alert
                </p>
                <div className="mt-3 rounded-lg border border-border bg-background p-3">
                  <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-1.5 py-0.5 text-[10px] font-medium text-red-600 dark:bg-red-500/10 dark:text-red-400">
                    <TriangleAlert className="size-3" /> High
                  </span>
                  <p className="mt-2 text-xs font-medium text-foreground">Bean Theory is hiring night-shift baristas</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">3 roles with shifts ending at 1 am</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
