import type { Metadata } from "next";

import { AddStartupFlow } from "@/components/workspace/new/add-startup-flow";

export const metadata: Metadata = { title: "Add a startup" };

export default function NewStartupPage() {
  return (
    <div className="space-y-8">
      <header className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Add a <span className="text-gradient-brand">startup</span>
        </h1>
        <p className="mt-2 text-[15px] text-muted-foreground">
          Describe a new idea or test a startup that already exists. GapScope finds the competitors, reads their
          reviews and builds your report.
        </p>
      </header>
      <AddStartupFlow />
    </div>
  );
}
