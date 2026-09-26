import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type FloatingIconCircleProps = {
  icon: LucideIcon;
  label: string;
  /** Animation offset in seconds so neighbouring circles don't bob in sync. */
  delay?: number;
  size?: "md" | "lg";
  className?: string;
};

/** White circle with a soft shadow holding a dark glossy icon, gently floating (09-cta.png). */
export function FloatingIconCircle({
  icon: Icon,
  label,
  delay = 0,
  size = "lg",
  className,
}: FloatingIconCircleProps) {
  return (
    <div
      title={label}
      className={cn(
        "flex animate-float items-center justify-center rounded-full bg-background shadow-[0_2px_4px_rgb(0_0_0/0.04),0_20px_40px_-12px_rgb(0_0_0/0.18),inset_0_-2px_6px_rgb(0_0_0/0.04)] ring-1 ring-border/60",
        size === "lg" ? "size-24 sm:size-28" : "size-16 sm:size-20",
        className,
      )}
      style={{ animationDelay: `${delay}s` }}
    >
      <span
        className={cn(
          "flex items-center justify-center rounded-2xl bg-[linear-gradient(160deg,#4a4a4a_0%,#0a0a0a_70%)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.25),0_6px_12px_-4px_rgb(0_0_0/0.45)]",
          size === "lg" ? "size-12 sm:size-14" : "size-9 sm:size-10",
        )}
      >
        <Icon
          aria-hidden="true"
          className={size === "lg" ? "size-6 sm:size-7" : "size-4 sm:size-5"}
          strokeWidth={2.25}
        />
      </span>
      <span className="sr-only">{label}</span>
    </div>
  );
}
