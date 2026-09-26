import { Target } from "lucide-react";

import { CheckList } from "@/components/marketing/check-list";
import type { PlanPhase } from "@/lib/types";

import { Panel, SectionHeader } from "./section-header";
import type { TabProps } from "./types";

const PHASES: { phase: PlanPhase; label: string }[] = [
  { phase: "0-30", label: "Days 0–30" },
  { phase: "31-60", label: "Days 31–60" },
  { phase: "61-90", label: "Days 61–90" },
];

export function PlanTab({ report, freshness, onOpenGaps }: TabProps & { onOpenGaps: () => void }) {
  const gapTitle = (id?: string) => report.gaps.find((g) => g.id === id)?.title;

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Plan"
        description="Positioning, pricing, the MVP and a 90-day plan, each step tied to a gap."
        aside={freshness("plan")}
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <p className="text-sm font-medium text-muted-foreground">Positioning</p>
          <p className="mt-2 text-lg font-medium tracking-tight text-foreground">&ldquo;{report.positioning}&rdquo;</p>
        </Panel>
        <Panel>
          <p className="text-sm font-medium text-muted-foreground">Pricing suggestion</p>
          <p className="mt-2 text-[15px] leading-relaxed text-foreground">{report.pricingSuggestion}</p>
        </Panel>
      </div>

      <Panel>
        <h3 className="text-base font-semibold text-foreground">MVP features</h3>
        <CheckList items={report.mvpFeatures} className="mt-4" />
      </Panel>

      <Panel>
        <h3 className="text-base font-semibold text-foreground">30-60-90 day plan</h3>
        <ol className="mt-6 space-y-8">
          {PHASES.map(({ phase, label }, pi) => {
            const items = report.plan.filter((p) => p.phase === phase);
            return (
              <li key={phase} className="relative pl-8">
                {pi < PHASES.length - 1 && (
                  <span aria-hidden="true" className="absolute top-6 bottom-[-2rem] left-[11px] w-px bg-border" />
                )}
                <span
                  aria-hidden="true"
                  className="absolute top-0.5 left-0 flex size-6 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--brand-light),var(--brand))] text-[11px] font-bold text-white"
                >
                  {pi + 1}
                </span>
                <h4 className="text-sm font-semibold tracking-wide text-brand uppercase">{label}</h4>
                <ul className="mt-3 grid gap-3 md:grid-cols-3">
                  {items.map((item) => (
                    <li key={item.title} className="min-w-0 rounded-2xl border border-border bg-background p-4">
                      <p className="font-medium text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{item.detail}</p>
                      {item.gapId && gapTitle(item.gapId) && (
                        <button
                          type="button"
                          onClick={onOpenGaps}
                          className="mt-3 inline-flex max-w-full items-center gap-1.5 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                        >
                          <Target aria-hidden="true" className="size-3 shrink-0" />
                          <span className="truncate">Gap: {gapTitle(item.gapId)}</span>
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ol>
      </Panel>
    </div>
  );
}
