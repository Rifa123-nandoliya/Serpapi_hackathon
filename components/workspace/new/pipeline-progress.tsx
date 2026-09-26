"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { Check, Circle, Database, Loader2, Radio } from "lucide-react";

import { cn } from "@/lib/utils";

type Step = {
  label: string;
  source: "cache" | "live";
  /** Time shown on the badge. */
  shownSeconds: number;
  /** How long the step animates, in ms (all steps ≈ 6 s). */
  ms: number;
};

export const PIPELINE_STEPS: Step[] = [
  { label: "Discover competitors", source: "live", shownSeconds: 3.1, ms: 1200 },
  { label: "Collect reviews", source: "cache", shownSeconds: 0.2, ms: 500 },
  { label: "Cluster reviews", source: "live", shownSeconds: 2.4, ms: 1100 },
  { label: "Score gaps", source: "cache", shownSeconds: 0.2, ms: 450 },
  { label: "Build plan", source: "cache", shownSeconds: 0.3, ms: 550 },
  { label: "Assess risks", source: "live", shownSeconds: 1.8, ms: 1000 },
  { label: "Start monitoring", source: "cache", shownSeconds: 0.1, ms: 700 },
];

const FINAL_PAUSE_MS = 500;

type PipelineProgressProps = {
  startupName: string;
  onComplete: () => void;
};

export function PipelineProgress({ startupName, onComplete }: PipelineProgressProps) {
  const [done, setDone] = useState(0);
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    const timers: number[] = [];
    let elapsed = 0;
    PIPELINE_STEPS.forEach((step, i) => {
      elapsed += step.ms;
      timers.push(window.setTimeout(() => setDone(i + 1), elapsed));
    });
    timers.push(window.setTimeout(() => completeRef.current(), elapsed + FINAL_PAUSE_MS));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  const progress = done / PIPELINE_STEPS.length;
  const finished = done === PIPELINE_STEPS.length;
  const cacheHits = PIPELINE_STEPS.slice(0, done).filter((s) => s.source === "cache").length;

  return (
    <div className="mx-auto w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-10">
      <p className="text-sm font-medium text-brand">{finished ? "Report ready" : "Analysing"}</p>
      <h2 className="mt-1 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{startupName}</h2>
      <p className="mt-2 text-[15px] text-muted-foreground">
        {finished
          ? "Opening your report…"
          : "GapScope is searching, reading and counting. This takes a few seconds."}
      </p>

      <div
        className="mt-6 h-2 overflow-hidden rounded-full bg-muted"
        role="progressbar"
        aria-label="Analysis progress"
        aria-valuemin={0}
        aria-valuemax={PIPELINE_STEPS.length}
        aria-valuenow={done}
        aria-valuetext={`${done} of ${PIPELINE_STEPS.length} steps complete`}
      >
        <motion.div
          className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand),var(--brand-light))]"
          initial={{ width: 0 }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      </div>

      <ol className="mt-8 space-y-2" aria-live="polite">
        {PIPELINE_STEPS.map((step, i) => {
          const state = i < done ? "done" : i === done ? "running" : "pending";
          return (
            <motion.li
              key={step.label}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors",
                state === "running" ? "border-brand/40 bg-background shadow-soft" : "border-transparent",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full",
                  state === "done" && "bg-[linear-gradient(180deg,var(--brand-light),var(--brand))] text-white",
                  state === "running" && "bg-brand-soft text-brand",
                  state === "pending" && "text-neutral-300 dark:text-neutral-600",
                )}
              >
                {state === "done" && <Check aria-hidden="true" className="size-4" strokeWidth={3} />}
                {state === "running" && <Loader2 aria-hidden="true" className="size-4 animate-spin" />}
                {state === "pending" && <Circle aria-hidden="true" className="size-4" />}
              </span>
              <span
                className={cn(
                  "flex-1 text-[15px]",
                  state === "pending" ? "text-muted-foreground" : "font-medium text-foreground",
                )}
              >
                {step.label}
                <span className="sr-only">
                  {state === "done" ? " (done)" : state === "running" ? " (in progress)" : " (waiting)"}
                </span>
              </span>
              {state === "done" && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium whitespace-nowrap",
                    step.source === "cache"
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "bg-brand-soft text-brand",
                  )}
                >
                  {step.source === "cache" ? (
                    <Database aria-hidden="true" className="size-3" />
                  ) : (
                    <Radio aria-hidden="true" className="size-3" />
                  )}
                  {step.source === "cache" ? "Cache hit" : "Live fetch"} {step.shownSeconds}s
                </motion.span>
              )}
            </motion.li>
          );
        })}
      </ol>

      <p className="mt-6 text-center text-xs text-muted-foreground">
        {cacheHits} of {done || 0} completed steps served from cache
      </p>
    </div>
  );
}
