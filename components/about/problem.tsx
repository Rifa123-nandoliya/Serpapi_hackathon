import { EyeOff, MessageSquareDashed, Shuffle, type LucideIcon } from "lucide-react";

import { SectionHeading } from "@/components/marketing/section-heading";

const PROBLEMS: { title: string; description: string; icon: LucideIcon }[] = [
  {
    title: "Advice without numbers",
    description:
      "Chatbots and blog posts say \"customers value good service\". That can't tell you which problem to solve first, or how many people have it.",
    icon: MessageSquareDashed,
  },
  {
    title: "Evidence buried in reviews",
    description:
      "The real complaints sit in thousands of reviews across maps and app stores. Nobody has the time to read, group and count them by hand.",
    icon: EyeOff,
  },
  {
    title: "Markets that keep moving",
    description:
      "Competitors change prices, hire and launch every week. A one-off research document is out of date within a month.",
    icon: Shuffle,
  },
];

export function Problem() {
  return (
    <section aria-labelledby="problem-heading" className="bg-footer px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="problem-heading"
          before="Founders build"
          highlight="without evidence"
          subtitle="Most founders pick what to build from gut feel, a few conversations and whatever a chatbot suggests. The evidence exists; it's just scattered."
        />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PROBLEMS.map(({ title, description, icon: Icon }) => (
            <article key={title} className="rounded-3xl border border-border bg-background p-7 shadow-soft">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <Icon aria-hidden="true" className="size-5" />
              </span>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-foreground">{title}</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">{description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
