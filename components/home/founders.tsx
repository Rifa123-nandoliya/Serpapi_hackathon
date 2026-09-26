import Link from "next/link";
import { Zap } from "lucide-react";

import { CheckList } from "@/components/marketing/check-list";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Bubble = {
  initials: string;
  tone: string;
  size: string;
  position: string;
  delay: number;
  faded?: boolean;
};

// Positions mirror the scattered avatars in 08-testimonials.png.
const BUBBLES: Bubble[] = [
  { initials: "AK", tone: "bg-orange-100 text-orange-700", size: "size-24 sm:size-32 text-2xl", position: "left-[8%] top-[22%]", delay: 0 },
  { initials: "PS", tone: "bg-neutral-100 text-neutral-500", size: "size-20 sm:size-28 text-xl", position: "left-[46%] top-[2%]", delay: -1.2, faded: true },
  { initials: "RM", tone: "bg-neutral-100 text-neutral-500", size: "size-20 sm:size-28 text-xl", position: "right-[2%] top-[8%]", delay: -2.4, faded: true },
  { initials: "NJ", tone: "bg-sky-200 text-sky-800", size: "size-24 sm:size-32 text-2xl", position: "left-[2%] top-[58%]", delay: -0.6 },
  { initials: "VD", tone: "bg-emerald-100 text-emerald-700", size: "size-20 sm:size-28 text-xl", position: "left-[30%] bottom-[0%]", delay: -1.8 },
  { initials: "SK", tone: "bg-sky-100 text-sky-700", size: "size-24 sm:size-32 text-2xl", position: "right-[6%] bottom-[2%]", delay: -3 },
  { initials: "MT", tone: "bg-neutral-100 text-neutral-400", size: "size-16 sm:size-24 text-lg", position: "right-[0%] top-[52%]", delay: -2, faded: true },
];

export function Founders() {
  return (
    <section aria-labelledby="founders-heading" className="overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <h2
            id="founders-heading"
            className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl"
          >
            <span className="text-gradient-brand">Founders</span> love evidence
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Built for founders who would rather know than guess. Take numbers you can defend into every
            conversation with co-founders, mentors and investors.
          </p>
          <CheckList
            className="mt-8"
            items={[
              "Prove your point to co-founders and investors",
              "Validate a hypothesis before you build",
              "Find the gaps worth building first",
            ]}
          />
          <Button asChild variant="gradient" size="xl" className="mt-10 rounded-full px-8">
            <Link href="/workspace/new">Analyse my idea</Link>
          </Button>
        </div>

        <div aria-hidden="true" className="relative mx-auto h-[380px] w-full max-w-xl sm:h-[480px]">
          {BUBBLES.map((b) => (
            <span
              key={b.initials}
              className={cn(
                "absolute flex animate-float items-center justify-center rounded-full font-semibold shadow-[0_16px_40px_-12px_rgb(0_0_0/0.25)] ring-4 ring-background",
                b.tone,
                b.size,
                b.position,
                b.faded && "opacity-60",
              )}
              style={{ animationDelay: `${b.delay}s` }}
            >
              {b.initials}
            </span>
          ))}
          <span
            className="absolute top-[42%] left-[55%] flex size-20 animate-float items-center justify-center rounded-2xl border border-border bg-background shadow-[0_16px_40px_-12px_rgb(0_0_0/0.2)] sm:size-24"
            style={{ animationDelay: "-1s" }}
          >
            <Zap className="size-9 fill-brand-light text-brand" />
          </span>
        </div>
      </div>
    </section>
  );
}
