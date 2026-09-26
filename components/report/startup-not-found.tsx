import Link from "next/link";
import { Plus, SearchX } from "lucide-react";

import { Button } from "@/components/ui/button";

export function StartupNotFound({ startupId }: { startupId: string }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-20 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
        <SearchX aria-hidden="true" className="size-7" />
      </span>
      <h1 className="mt-6 text-2xl font-bold tracking-tight text-foreground">
        Startup <span className="text-gradient-brand">not found</span>
      </h1>
      <p className="mt-2 max-w-md text-[15px] text-muted-foreground">
        There is no startup with the id <code className="rounded bg-muted px-1.5 py-0.5 text-sm">{startupId}</code>{" "}
        in your workspace. It may have been added in another browser.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild variant="gradient" size="xl">
          <Link href="/workspace">Back to workspace</Link>
        </Button>
        <Button asChild variant="subtle" size="xl">
          <Link href="/workspace/new">
            <Plus aria-hidden="true" />
            Add a startup
          </Link>
        </Button>
      </div>
    </div>
  );
}
