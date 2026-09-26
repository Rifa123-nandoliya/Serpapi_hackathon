import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  title: string;
  description?: string;
  /** Right-hand side: usually a FreshnessBadge. */
  aside?: React.ReactNode;
  className?: string;
};

export function SectionHeader({ title, description, aside, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", className)}>
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        {description && <p className="mt-1 text-[15px] text-muted-foreground">{description}</p>}
      </div>
      {aside}
    </div>
  );
}

export function Panel({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-3xl border border-border bg-card p-5 sm:p-6", className)}>{children}</div>;
}
