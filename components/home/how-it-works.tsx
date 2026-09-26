import { Layers, Radar, Search, Target, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";

const STEPS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Discover",
    description: "Finds your direct competitors across 8 search engines, or the 5 nearest neighbours when there are none.",
    icon: Search,
  },
  {
    title: "Cluster",
    description: "Groups thousands of real reviews into themes and measures each one with a 95% confidence interval.",
    icon: Layers,
  },
  {
    title: "Score",
    description: "Ranks every gap by Opportunity Score, combining complaint share, search demand and competitor coverage.",
    icon: Target,
  },
  {
    title: "Monitor",
    description: "Checks competitors daily for rating, price, hiring and news changes, and alerts you when it matters.",
    icon: Radar,
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="scroll-mt-24 px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="how-heading"
          before="From idea to evidence in"
          highlight="four steps"
          subtitle="Describe your idea once. GapScope does the searching, reading and counting."
        />
        <ol className="relative mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <span
            aria-hidden="true"
            className="absolute top-12 right-[12.5%] left-[12.5%] hidden h-px bg-[linear-gradient(90deg,transparent,var(--border)_15%,var(--border)_85%,transparent)] lg:block"
          />
          {STEPS.map(({ title, description, icon: Icon }, i) => (
            <li
              key={title}
              className="relative rounded-3xl border border-border bg-card p-6 transition-shadow hover:shadow-float sm:p-7"
            >
              <div className="flex items-center justify-between">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-[linear-gradient(160deg,#4a4a4a,#0a0a0a)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_8px_16px_-6px_rgb(0_0_0/0.4)]">
                  <Icon aria-hidden="true" className="size-5" />
                </span>
                <span className="text-sm font-semibold text-brand">Step {i + 1}</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
