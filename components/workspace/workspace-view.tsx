"use client";

import Link from "next/link";
import { CircleAlert, Plus, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useStartups } from "@/lib/queries";
import { useNow } from "@/lib/use-now";

import { StartupCard } from "./startup-card";
import { WorkspaceEmpty } from "./workspace-empty";

function CardSkeleton() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="flex gap-3">
        <Skeleton className="size-11 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-20" />
        </div>
      </div>
      <Skeleton className="mt-5 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-6 h-12 w-full" />
      <div className="mt-6 flex gap-2">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
    </div>
  );
}

export function WorkspaceView() {
  const { data, isPending, isError, refetch, isRefetching } = useStartups();
  const now = useNow();

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Your <span className="text-gradient-brand">startups</span>
          </h1>
          <p className="mt-2 text-[15px] text-muted-foreground">
            Every startup gets a report, live competitor monitoring and a Risk Radar.
          </p>
        </div>
        <Button asChild variant="gradient" size="xl" className="self-start sm:self-auto">
          <Link href="/workspace/new">
            <Plus aria-hidden="true" />
            Add startup
          </Link>
        </Button>
      </header>

      {isPending ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-label="Loading startups">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : isError ? (
        <div role="alert" className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-14 text-center">
          <CircleAlert aria-hidden="true" className="size-8 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold text-foreground">Couldn&apos;t load your startups</h2>
          <p className="mt-1 text-[15px] text-muted-foreground">Check your connection and try again.</p>
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
              <StartupCard overview={overview} now={now} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
