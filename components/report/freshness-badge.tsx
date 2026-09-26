"use client";

import { Database, Radio, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatRelativeShort } from "@/lib/format";
import type { SectionMeta } from "@/lib/types";
import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

type FreshnessBadgeProps = {
  meta: SectionMeta;
  section: string;
  onRefresh: () => void;
  refreshing: boolean;
  className?: string;
};

/** "Cached 2h ago" / "Live fetch 3.1s" with a Refresh button (CLAUDE.md §6). */
export function FreshnessBadge({ meta, section, onRefresh, refreshing, className }: FreshnessBadgeProps) {
  const now = useNow(30_000);
  const age = now ? formatRelativeShort(meta.fetchedAt, now) : null;
  const seconds = (meta.latencyMs / 1000).toFixed(1);

  return (
    <div className={cn("flex items-center gap-1.5", className)}>
      <Tooltip>
        <TooltipTrigger asChild>
          <span
            tabIndex={0}
            className={cn(
              "inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring",
              meta.cached
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                : "bg-brand-soft text-brand",
            )}
          >
            {meta.cached ? (
              <Database aria-hidden="true" className="size-3.5" />
            ) : (
              <Radio aria-hidden="true" className="size-3.5" />
            )}
            {meta.cached ? (
              <>Cached{age ? ` ${age}` : ""}</>
            ) : (
              <>Live fetch {seconds}s</>
            )}
          </span>
        </TooltipTrigger>
        <TooltipContent>
          {meta.serpCalls} SerpApi {meta.serpCalls === 1 ? "call" : "calls"} · {meta.latencyMs} ms
          {age ? ` · fetched ${age}` : ""}
        </TooltipContent>
      </Tooltip>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={onRefresh}
        disabled={refreshing}
        aria-label={refreshing ? `Refreshing ${section}` : `Refresh ${section}`}
        className="rounded-full"
      >
        <RotateCw aria-hidden="true" className={cn(refreshing && "animate-spin")} />
      </Button>
    </div>
  );
}
