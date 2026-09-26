import { cn } from "@/lib/utils";

/**
 * Soft peach/orange glow rising from the bottom of the hero with faint concentric arcs
 * (design-reference/01-hero.png). Purely decorative; place inside a `relative isolate` section so `-z-10` stays behind its content.
 */
export function HeroBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden", className)}
    >
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,var(--background)_0%,var(--background)_15%,color-mix(in_oklab,var(--hero-glow)_30%,var(--background))_60%,var(--hero-glow)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(ellipse_70%_60%_at_50%_100%,color-mix(in_oklab,var(--brand-light)_40%,transparent)_0%,transparent_70%)]" />
      <svg
        className="absolute bottom-0 left-1/2 w-[180%] max-w-none -translate-x-1/2 translate-y-[42%] sm:w-[140%] lg:w-[110%]"
        viewBox="0 0 1000 1000"
        fill="none"
      >
        <circle cx="500" cy="500" r="498" stroke="white" strokeOpacity="0.9" vectorEffect="non-scaling-stroke" />
        <circle cx="500" cy="500" r="420" stroke="white" strokeOpacity="0.55" vectorEffect="non-scaling-stroke" />
        <circle cx="500" cy="500" r="340" stroke="white" strokeOpacity="0.35" vectorEffect="non-scaling-stroke" />
        <circle cx="500" cy="500" r="498" stroke="var(--brand)" strokeOpacity="0.08" vectorEffect="non-scaling-stroke" />
      </svg>
    </div>
  );
}
