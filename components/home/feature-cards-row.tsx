import { Database, FileText, Link2, Plus, Zap } from "lucide-react";

import { cn } from "@/lib/utils";

function FeatureCard({
  title,
  description,
  className,
  children,
}: {
  title: string;
  description: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <article className={cn("flex flex-col", className)}>
      <div
        aria-hidden="true"
        className="relative min-h-80 overflow-hidden rounded-2xl border border-border bg-background p-5 sm:p-6"
      >
        {children}
      </div>
      <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{title}</h3>
      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
    </article>
  );
}

const PLAN = [
  { phase: "0–30", title: "Validate late-night demand", detail: "2-week pop-up, 9 pm – 1 am" },
  { phase: "31–60", title: "Fit out for work sessions", detail: "Outlet + ergonomic chair per seat" },
  { phase: "61–90", title: "Soft launch night passes", detail: "₹499 with two drinks" },
];

function PlanIllustration() {
  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="w-fit rounded-xl border border-border bg-background px-4 py-2.5 text-[15px] text-foreground shadow-soft">
          Your 90-day plan
        </div>
        <span className="rounded-lg bg-[linear-gradient(180deg,var(--brand-light),var(--brand))] px-3 py-1.5 text-xs font-medium text-white shadow-[0_8px_20px_-6px_rgb(240_90_40/0.6)]">
          Linked to 4 gaps
        </span>
      </div>
      <ol className="mt-4 space-y-3">
        {PLAN.map((item, i) => (
          <li key={item.phase} className="relative flex gap-3 pl-1">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  "mt-1 size-2.5 rounded-full",
                  i === 0 ? "bg-brand" : "bg-brand-light/70",
                )}
              />
              {i < PLAN.length - 1 && <span className="mt-1 w-px flex-1 bg-border" />}
            </div>
            <div className="min-w-0 pb-1">
              <p className="text-[11px] font-semibold tracking-wide text-brand uppercase">Days {item.phase}</p>
              <p className="text-sm font-medium text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

function CachingIllustration() {
  return (
    <div className="flex h-[17rem] flex-col items-center">
      <p className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">312</p>
      <p className="mt-1 text-sm text-muted-foreground">API calls saved this month</p>
      <div className="relative mt-6 w-full max-w-72 flex-1">
        <div className="absolute inset-x-4 top-0 h-10 rounded-t-3xl bg-neutral-900 dark:bg-neutral-700" />
        <div className="absolute inset-x-2 top-2 h-10 rounded-t-3xl bg-neutral-700 dark:bg-neutral-600" />
        <div className="absolute inset-x-0 top-5 bottom-0 rounded-3xl bg-[linear-gradient(135deg,var(--brand-light),var(--brand))] p-5 text-white shadow-[0_16px_40px_-12px_rgb(240_90_40/0.55)]">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-brand">
              <Zap className="size-3.5" /> Cache hit · 0.2s
            </span>
            <Database className="size-5 opacity-80" />
          </div>
          <p className="mt-5 font-mono text-lg tracking-[0.2em] sm:text-xl">78% HIT RATE</p>
          <p className="mt-2 text-sm text-white/85">Report 2.1s cached · 48s cold</p>
        </div>
      </div>
    </div>
  );
}

const AVATARS = [
  { initials: "AK", tone: "bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300" },
  { initials: "PS", tone: "bg-sky-100 text-sky-700 dark:bg-sky-500/15 dark:text-sky-300" },
  { initials: "RM", tone: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300" },
  { initials: "NJ", tone: "bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300" },
];

function RiskIllustration() {
  return (
    <>
      <div className="flex items-center justify-between">
        <span className="inline-flex items-center gap-1 text-lg font-medium text-brand">
          <Plus className="size-4" /> Watch
        </span>
        <div className="flex -space-x-1.5">
          {AVATARS.map((a) => (
            <span
              key={a.initials}
              className={cn("flex size-9 items-center justify-center rounded-full text-xs font-semibold ring-2 ring-background", a.tone)}
            >
              {a.initials}
            </span>
          ))}
          <span className="flex size-9 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground ring-2 ring-background">
            +2
          </span>
        </div>
      </div>
      <div className="mt-5 rounded-2xl border border-dashed border-brand/40 bg-background p-5 shadow-soft">
        <span className="inline-flex rounded-md bg-[linear-gradient(180deg,var(--brand-light),var(--brand))] px-2.5 py-1 text-sm font-medium text-white">
          High
        </span>
        <p className="mt-3 font-semibold text-foreground">Competition</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Bean Theory is hiring night-shift baristas and may extend its hours first.
        </p>
        <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Link2 className="size-3.5" /> 2 sources
          </span>
          <span className="inline-flex items-center gap-1.5">
            <FileText className="size-3.5" /> Kill criterion set
          </span>
        </div>
      </div>
    </>
  );
}

export function FeatureCardsRow() {
  return (
    <section aria-label="More features" className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl rounded-[2rem] border border-border bg-card p-4 shadow-soft sm:p-6 lg:p-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          <FeatureCard
            title="Execution plan"
            description="A 30-60-90 day plan where every step is linked to the gap and the evidence behind it."
          >
            <PlanIllustration />
          </FeatureCard>
          <FeatureCard
            title="Smart caching"
            description="Repeat searches come from cache in seconds, so reports stay fast and cheap to refresh."
          >
            <CachingIllustration />
          </FeatureCard>
          <FeatureCard
            className="sm:col-span-2 lg:col-span-1"
            title="Risk Radar"
            description="Market, competition, copy and regulatory risks, each with evidence and a clear kill criterion."
          >
            <RiskIllustration />
          </FeatureCard>
        </div>
      </div>
    </section>
  );
}
