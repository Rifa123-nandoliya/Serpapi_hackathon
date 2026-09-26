import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export type OrbitChip = {
  icon: LucideIcon;
  label: string;
  /** 0 = outer ring, 1 = inner ring */
  ring: 0 | 1;
  /** Position on the ring in degrees, 0 = right, -90 = top. */
  angle: number;
};

type OrbitRingsProps = {
  chips: OrbitChip[];
  center?: React.ReactNode;
  className?: string;
};

// Band centre radius of each ring as a % of the container (see ring sizes below).
const RING_RADIUS: Record<OrbitChip["ring"], number> = { 0: 45, 1: 23.5 };

function Ring({ size, hole }: { size: number; hole: number }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[linear-gradient(180deg,var(--brand-light)_0%,color-mix(in_oklab,var(--brand-light)_70%,transparent)_45%,transparent_92%)]"
      style={{ width: `${size}%`, height: `${size}%` }}
    >
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-card"
        style={{ width: `${hole}%`, height: `${hole}%` }}
      />
    </div>
  );
}

/** Concentric orange gradient rings with icon chips and a centre mark (05-bento-grid-2.png). */
export function OrbitRings({ chips, center, className }: OrbitRingsProps) {
  return (
    <div className={cn("relative aspect-square w-full max-w-md", className)}>
      <Ring size={100} hole={80} />
      <Ring size={55} hole={70} />

      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        {center ?? (
          <span
            aria-hidden="true"
            className="block size-10 rotate-45 rounded-xl bg-[linear-gradient(135deg,#F9A98A,#F4845F)] shadow-[0_4px_16px_-4px_rgb(240_90_40/0.5)]"
          />
        )}
      </div>

      {chips.map((chip, index) => {
        const radius = RING_RADIUS[chip.ring];
        const rad = (chip.angle * Math.PI) / 180;
        const left = Math.round((50 + radius * Math.cos(rad)) * 100) / 100;
        const top = Math.round((50 + radius * Math.sin(rad)) * 100) / 100;
        const Icon = chip.icon;
        return (
          <span
            key={`${chip.label}-${index}`}
            title={chip.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${left}%`, top: `${top}%` }}
          >
            <span
              className="flex size-10 animate-float items-center justify-center rounded-full bg-[linear-gradient(180deg,#4a4a4a,#171717)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2),0_6px_14px_-4px_rgb(0_0_0/0.4)] ring-4 ring-white/40"
              style={{ animationDelay: `${index * -0.8}s` }}
            >
              <Icon aria-hidden="true" className="size-4" />
              <span className="sr-only">{chip.label}</span>
            </span>
          </span>
        );
      })}
    </div>
  );
}
