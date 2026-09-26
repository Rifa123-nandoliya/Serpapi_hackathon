"use client";

import { useMemo } from "react";

import { useHydratedStore } from "@/lib/store";
import type { Startup } from "@/lib/types";

import type { SidebarStartup } from "./sidebar-startups";

const NO_STARTUPS: Startup[] = [];

/**
 * Demo startups plus the ones added in this browser. Store data is only used
 * after hydration, so the server HTML and the first client render match.
 */
export function useSidebarStartups(base: SidebarStartup[]): SidebarStartup[] {
  const added = useHydratedStore((state) => state.userStartups, NO_STARTUPS);

  return useMemo(() => {
    const ids = new Set(base.map((s) => s.id));
    return [...base, ...added.filter((s) => !ids.has(s.id)).map((s) => ({ id: s.id, name: s.name }))];
  }, [base, added]);
}
