"use client";

import Link from "next/link";
import { CircleAlert, Plus, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { WorkspaceEmpty } from "@/components/workspace/workspace-empty";
import { useStartups } from "@/lib/queries";

import { StartupHealthCard } from "./startup-health-card";
import { SystemStatsCard } from "./system-stats-card";

export function DashboardView() {
  const { data, isPending, isError, refetch, isRefetching } = useStartups();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            <span className="text-gradient-brand">Dashboard</span>
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Health, alerts and risk across all your startups, plus how GapScope&apos;s cache is performing.
          </p>
        </div>
        <Button asChild variant="subtle" size="lg" className="self-start rounded-lg sm:self-auto">
          <Link href="/workspace/new">
            <Plus aria-hidden="true" />
            Add startup
          </Link>
        </Button>
      </header>

      <SystemStatsCard />

      <section aria-labelledby="startups-heading" className="space-y-4">
        <h2 id="startups-heading" className="text-lg font-semibold tracking-tight text-foreground">
          Your startups
        </h2>
        {isPending ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading startups">
            {Array.from({ length: 3 }, (_, i) => (
              <Skeleton key={i} className="h-80 rounded-3xl" />
            ))}
          </div>
        ) : isError ? (
          <div role="alert" className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-14 text-center">
            <CircleAlert aria-hidden="true" className="size-8 text-destructive" />
            <p className="mt-4 font-semibold text-foreground">Couldn&apos;t load your startups</p>
            <Button variant="subtle" size="lg" className="mt-6" onClick={() => refetch()} disabled={isRefetching}>
              <RotateCw aria-hidden="true" className={isRefetching ? "animate-spin" : undefined} />
              Try again
            </Button>
          </div>
        ) : data.length === 0 ? (
          <WorkspaceEmpty />
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {data.map((overview) => (
              <li key={overview.startup.id} className="h-full">
                <StartupHealthCard overview={overview} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
