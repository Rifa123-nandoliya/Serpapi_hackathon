import { MousePointer2 } from "lucide-react";

import { cn } from "@/lib/utils";

type CursorTagProps = {
  label: string;
  /** Which top corner the pointer arrow sits on. */
  pointer?: "left" | "right" | "none";
  className?: string;
};

/** Small dark label with a pointer arrow, like the "Manu"/"Kishore" tags in 04-bento-grid.png. */
export function CursorTag({ label, pointer = "left", className }: CursorTagProps) {
  return (
    <span className={cn("relative inline-flex", className)}>
      {pointer !== "none" && (
        <MousePointer2
          aria-hidden="true"
          className={cn(
            "absolute -top-4 size-5 fill-neutral-900 text-neutral-900 dark:fill-neutral-100 dark:text-neutral-100",
            pointer === "left" ? "-left-3" : "-right-3 -scale-x-100",
          )}
        />
      )}
      <span className="rounded-lg bg-[linear-gradient(180deg,#3f3f3f,#171717)] px-3 py-1.5 text-sm font-medium whitespace-nowrap text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.15),0_6px_14px_-4px_rgb(0_0_0/0.35)]">
        {label}
      </span>
    </span>
  );
}
