"use client";

import { useEffect, useState } from "react";

/**
 * Current time in ms, or null during SSR and the first client render.
 * Use it for relative times ("2h ago") so server and client HTML always match.
 */
export function useNow(refreshMs = 60_000): number | null {
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), refreshMs);
    return () => window.clearInterval(id);
  }, [refreshMs]);

  return now;
}
