"use client";

import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { MOCK_STARTUP_IDS, simulateWeekEvents } from "./mock";
import type { MonitoringEvent, NewStartupInput, Startup } from "./types";

type WorkspaceData = {
  /** Startups added through /workspace/new in this browser. */
  userStartups: Startup[];
  /** Events added by "Simulate next week", for any startup. */
  simulatedEvents: MonitoringEvent[];
  /** How many weeks have been simulated per startup id. */
  simulatedWeeks: Record<string, number>;
};

type WorkspaceActions = {
  addStartup: (input: NewStartupInput) => Startup;
  updateStartup: (id: string, patch: Partial<Omit<Startup, "id">>) => void;
  removeStartup: (id: string) => void;
  simulateNextWeek: (startupId: string) => MonitoringEvent[];
  resetSimulation: (startupId?: string) => void;
};

export type WorkspaceState = WorkspaceData & WorkspaceActions;

/** Route segments under /workspace that a startup id must never collide with. */
const RESERVED_IDS = ["new"];

function slugify(value: string): string {
  const slug = value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
  return slug || "startup";
}

function uniqueId(name: string, taken: string[]): string {
  const base = slugify(name);
  const used = new Set([...taken, ...MOCK_STARTUP_IDS, ...RESERVED_IDS]);
  if (!used.has(base)) return base;
  let n = 2;
  while (used.has(`${base}-${n}`)) n += 1;
  return `${base}-${n}`;
}

const initialData: WorkspaceData = {
  userStartups: [],
  simulatedEvents: [],
  simulatedWeeks: {},
};

export const useWorkspaceStore = create<WorkspaceState>()(
  persist(
    (set, get) => ({
      ...initialData,

      addStartup: (input) => {
        const startup: Startup = {
          id: uniqueId(input.name, get().userStartups.map((s) => s.id)),
          name: input.name.trim(),
          idea: input.idea.trim(),
          category: input.category,
          location: input.location.trim(),
          targetCustomer: input.targetCustomer.trim(),
          mode: input.mode,
          createdAt: new Date().toISOString(),
          status: input.status ?? "ready",
          nearestNeighbourMode: false,
          ...(input.website ? { website: input.website } : {}),
          ...(input.knownCompetitors?.length ? { knownCompetitors: input.knownCompetitors } : {}),
          ...(input.compareAgainst ? { compareAgainst: input.compareAgainst } : {}),
          ...(input.reportFile ? { reportFile: input.reportFile } : {}),
        };
        set((state) => ({ userStartups: [...state.userStartups, startup] }));
        return startup;
      },

      updateStartup: (id, patch) =>
        set((state) => ({
          userStartups: state.userStartups.map((s) => (s.id === id ? { ...s, ...patch } : s)),
        })),

      removeStartup: (id) =>
        set((state) => {
          const { [id]: _removed, ...simulatedWeeks } = state.simulatedWeeks;
          void _removed;
          return {
            userStartups: state.userStartups.filter((s) => s.id !== id),
            simulatedEvents: state.simulatedEvents.filter((e) => e.startupId !== id),
            simulatedWeeks,
          };
        }),

      simulateNextWeek: (startupId) => {
        const week = (get().simulatedWeeks[startupId] ?? 0) + 1;
        const events = simulateWeekEvents(startupId, week, new Date().toISOString());
        set((state) => ({
          simulatedEvents: [...events, ...state.simulatedEvents],
          simulatedWeeks: { ...state.simulatedWeeks, [startupId]: week },
        }));
        return events;
      },

      resetSimulation: (startupId) =>
        set((state) => {
          if (!startupId) return { simulatedEvents: [], simulatedWeeks: {} };
          const { [startupId]: _removed, ...simulatedWeeks } = state.simulatedWeeks;
          void _removed;
          return {
            simulatedEvents: state.simulatedEvents.filter((e) => e.startupId !== startupId),
            simulatedWeeks,
          };
        }),
    }),
    {
      name: "gapscope-workspace",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state): WorkspaceData => ({
        userStartups: state.userStartups,
        simulatedEvents: state.simulatedEvents,
        simulatedWeeks: state.simulatedWeeks,
      }),
    },
  ),
);

// ---------------------------------------------------------------------------
// Hydration guard
// ---------------------------------------------------------------------------

// On the server there is no localStorage, so the persist API may be missing.
const persistApi = () =>
  (useWorkspaceStore as Partial<Pick<typeof useWorkspaceStore, "persist">>).persist;

function subscribeHydration(onChange: () => void): () => void {
  return persistApi()?.onFinishHydration(onChange) ?? (() => {});
}

/**
 * False during SSR and the first client render, true once the store has been
 * rehydrated from localStorage. Render store-dependent UI only when this is true.
 */
export function useHasHydrated(): boolean {
  return useSyncExternalStore(
    subscribeHydration,
    () => persistApi()?.hasHydrated() ?? false,
    () => false,
  );
}

/** Store selector that returns `fallback` until hydration has finished. */
export function useHydratedStore<T>(selector: (state: WorkspaceState) => T, fallback: T): T {
  const hydrated = useHasHydrated();
  const value = useWorkspaceStore(selector);
  return hydrated ? value : fallback;
}
