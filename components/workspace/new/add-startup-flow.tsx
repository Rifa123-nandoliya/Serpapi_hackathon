"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Building2, Lightbulb } from "lucide-react";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceStore } from "@/lib/store";
import type { NewStartupInput, Startup } from "@/lib/types";

import { ExistingForm } from "./existing-form";
import { IdeaForm } from "./idea-form";
import { PipelineProgress } from "./pipeline-progress";

export function AddStartupFlow() {
  const router = useRouter();
  const addStartup = useWorkspaceStore((s) => s.addStartup);
  const updateStartup = useWorkspaceStore((s) => s.updateStartup);
  const [running, setRunning] = useState<Startup | null>(null);

  function start(input: NewStartupInput) {
    const startup = addStartup({ ...input, status: "analysing" });
    setRunning(startup);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (running) {
    return (
      <PipelineProgress
        key={running.id}
        startupName={running.name}
        onComplete={() => {
          updateStartup(running.id, { status: "ready" });
          toast.success(`${running.name} is ready`, { description: "Your report and monitoring are set up." });
          router.push(`/workspace/${running.id}`);
        }}
      />
    );
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Tabs defaultValue="idea" className="gap-6">
        <TabsList className="h-11! w-full rounded-full p-1 sm:w-fit">
          <TabsTrigger value="idea" className="rounded-full px-2 text-xs sm:px-4 sm:text-sm">
            <Lightbulb aria-hidden="true" className="hidden sm:block" />
            Describe my idea
          </TabsTrigger>
          <TabsTrigger value="existing" className="rounded-full px-2 text-xs sm:px-4 sm:text-sm">
            <Building2 aria-hidden="true" className="hidden sm:block" />
            Test an existing startup
          </TabsTrigger>
        </TabsList>

        <div className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-8">
          <TabsContent value="idea">
            <IdeaForm onSubmit={start} />
          </TabsContent>
          <TabsContent value="existing">
            <ExistingForm onSubmit={start} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
