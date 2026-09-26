import {
  Briefcase,
  MapPin,
  Newspaper,
  Search,
  Smartphone,
  TrendingUp,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { CheckList } from "@/components/marketing/check-list";
import { FloatingIconCircle } from "@/components/marketing/floating-icon-circle";
import { cn } from "@/lib/utils";

// Scattered like the avatars in 08-testimonials.png.
const CIRCLES: { icon: LucideIcon; label: string; position: string; size: "md" | "lg"; faded?: boolean }[] = [
  { icon: MapPin, label: "Google Maps reviews", position: "left-[10%] top-[20%]", size: "lg" },
  { icon: Search, label: "Google Search", position: "left-[48%] top-[0%]", size: "md", faded: true },
  { icon: Smartphone, label: "App store reviews", position: "right-[4%] top-[8%]", size: "lg", faded: true },
  { icon: TrendingUp, label: "Google Trends", position: "left-[2%] top-[62%]", size: "md" },
  { icon: Briefcase, label: "Google Jobs", position: "left-[34%] bottom-[0%]", size: "lg" },
  { icon: Newspaper, label: "Google News", position: "right-[6%] bottom-[6%]", size: "md", faded: true },
];

export function Mission() {
  return (
    <section aria-labelledby="mission-heading" className="overflow-hidden px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        <div>
          <h2 id="mission-heading" className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            <span className="text-gradient-brand">Our mission</span> is evidence
          </h2>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            We want every founder to make their biggest decisions from what real customers say, not from
            hunches or generic advice. GapScope turns scattered reviews, searches, job posts and news into
            numbers you can check and a plan you can act on.
          </p>
          <CheckList
            className="mt-8"
            items={[
              "Every claim links to its source",
              "Numbers, never vague adjectives",
              "Honest about uncertainty, with a confidence interval on every gap",
            ]}
          />
        </div>

        <div aria-hidden="true" className="relative mx-auto h-[360px] w-full max-w-xl sm:h-[440px]">
          {CIRCLES.map((c, i) => (
            <div key={c.label} className={cn("absolute", c.position, c.faded && "opacity-60")}>
              <FloatingIconCircle icon={c.icon} label={c.label} size={c.size} delay={i * -0.9} />
            </div>
          ))}
          <span
            className="absolute top-[44%] left-[56%] flex size-20 animate-float items-center justify-center rounded-2xl border border-border bg-background shadow-[0_16px_40px_-12px_rgb(0_0_0/0.2)] sm:size-24"
            style={{ animationDelay: "-1.5s" }}
          >
            <Zap className="size-9 fill-brand-light text-brand" />
          </span>
        </div>
      </div>
    </section>
  );
}
