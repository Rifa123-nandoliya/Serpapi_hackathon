import { cn } from "@/lib/utils";

/** macOS-style traffic lights used on the "app window" illustrations. */
export function WindowDots({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn("flex items-center gap-1.5", className)}>
      <span className="size-3 rounded-full bg-[#FF5F57]" />
      <span className="size-3 rounded-full bg-[#FEBC2E]" />
      <span className="size-3 rounded-full bg-[#28C840]" />
    </div>
  );
}
