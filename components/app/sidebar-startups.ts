export type SidebarStartup = { id: string; name: string };

/**
 * Seed list for the sidebar until the data layer (lib/api.ts + Zustand store) exists.
 * Both ids match the demo startups described in CLAUDE.md §4.
 */
export const DEFAULT_SIDEBAR_STARTUPS: SidebarStartup[] = [
  { id: "brew-and-stay", name: "Brew & Stay" },
  { id: "studysprint", name: "StudySprint" },
];
