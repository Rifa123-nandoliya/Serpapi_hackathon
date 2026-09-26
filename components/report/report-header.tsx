import Link from "next/link";
import { ChartColumn, Globe, Loader2, MapPin, Orbit } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Startup } from "@/lib/types";

export function ReportHeader({ startup }: { startup: Startup }) {
  return (
    <header className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-brand-soft text-xl font-semibold text-brand"
          >
            {startup.name.charAt(0).toUpperCase()}
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{startup.name}</h1>
        </div>
        <p className="mt-3 max-w-3xl text-[15px] leading-relaxed text-muted-foreground">{startup.idea}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Badge variant="secondary" className="border-border">
            {startup.mode === "idea" ? "Idea" : "Existing startup"}
          </Badge>
          <Badge variant="outline">{startup.category}</Badge>
          <Badge variant="outline">
            {startup.website ? <Globe aria-hidden="true" /> : <MapPin aria-hidden="true" />}
            {startup.location}
          </Badge>
          {startup.nearestNeighbourMode && (
            <Badge className="bg-brand-soft text-brand">
              <Orbit aria-hidden="true" />
              Nearest-neighbour mode
            </Badge>
          )}
          {startup.status === "analysing" && (
            <Badge variant="outline">
              <Loader2 aria-hidden="true" className="animate-spin" />
              Analysing
            </Badge>
          )}
          {startup.status === "monitoring" && (
            <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400">
              Monitoring
            </Badge>
          )}
        </div>
      </div>
      <Button asChild variant="gradient" size="lg" className="shrink-0 self-start">
        <Link href={`/dashboard/${startup.id}`}>
          <ChartColumn aria-hidden="true" />
          Open dashboard
        </Link>
      </Button>
    </header>
  );
}
