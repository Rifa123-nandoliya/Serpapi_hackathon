import { Check } from "lucide-react";

import { cn } from "@/lib/utils";

/** Small filled orange circle with a white check (07-pricing.png). */
export function CheckBullet({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--brand-light),var(--brand))] text-white",
        className,
      )}
    >
      <Check className="size-3" strokeWidth={3.5} />
    </span>
  );
}

export function CheckList({ items, className }: { items: string[]; className?: string }) {
  return (
    <ul className={cn("space-y-3.5", className)}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-3 text-[15px] text-foreground/80">
          <CheckBullet className="mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
