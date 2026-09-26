import { Orbit } from "lucide-react";

import type { Competitor } from "@/lib/types";

export function NearestNeighbourBanner({ neighbours }: { neighbours: Competitor[] }) {
  const sims = neighbours.map((n) => n.similarity ?? 0);
  return (
    <div
      role="note"
      className="flex items-start gap-4 rounded-3xl border border-brand/30 bg-brand-soft p-5 sm:items-center"
    >
      <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-background text-brand shadow-soft">
        <Orbit aria-hidden="true" className="size-5" />
      </span>
      <div>
        <p className="font-semibold text-foreground">
          No direct competitors found. Analysed {neighbours.length} nearest neighbours.
        </p>
        <p className="mt-0.5 text-sm text-muted-foreground">
          Products that solve the same problem, serve the same customer or use the same business model
          {sims.length > 0 && <> ({Math.min(...sims)}–{Math.max(...sims)}% similar)</>}.
        </p>
      </div>
    </div>
  );
}
