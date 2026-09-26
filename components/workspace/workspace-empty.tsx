import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";

export function WorkspaceEmpty() {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed border-border bg-card px-6 py-16 text-center">
      <div aria-hidden="true" className="relative h-32 w-48">
        <div className="absolute top-6 left-2 h-24 w-36 -rotate-6 rounded-2xl border border-border bg-background shadow-soft" />
        <div className="absolute top-2 left-10 flex h-24 w-36 rotate-3 flex-col gap-2 rounded-2xl border border-border bg-background p-4 shadow-float">
          <span className="h-2 w-16 rounded-full bg-muted" />
          <span className="h-2 w-24 rounded-full bg-muted" />
          <span className="mt-auto h-2 w-10 rounded-full bg-brand-light/60" />
        </div>
        <span className="absolute right-0 bottom-0 flex size-10 items-center justify-center rounded-full bg-[linear-gradient(180deg,var(--brand-light),var(--brand))] text-white shadow-[0_8px_20px_-6px_rgb(240_90_40/0.6)]">
          <Plus className="size-5" />
        </span>
      </div>
      <h2 className="mt-8 text-xl font-semibold tracking-tight text-foreground">No startups yet</h2>
      <p className="mt-2 max-w-sm text-[15px] text-muted-foreground">
        Add your first idea or existing startup. GapScope will find competitors, read their reviews and rank the gaps.
      </p>
      <Button asChild variant="gradient" size="xl" className="mt-8">
        <Link href="/workspace/new">
          <Plus aria-hidden="true" />
          Add your first startup
        </Link>
      </Button>
    </div>
  );
}
