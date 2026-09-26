import { cn } from "@/lib/utils";

type StatCardProps = {
  value: string;
  label: string;
  className?: string;
};

/** Large number + small grey label on a bordered card with a faint grid (02-logos-and-stats.png). */
export function StatCard({ value, label, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border border-border bg-background p-6 sm:p-8",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(to_bottom,black,transparent)] bg-[linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] bg-[size:24px_24px] opacity-60"
      />
      <p className="relative text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        {value}
      </p>
      <p className="relative mt-2 text-base text-muted-foreground sm:text-lg">{label}</p>
    </div>
  );
}
