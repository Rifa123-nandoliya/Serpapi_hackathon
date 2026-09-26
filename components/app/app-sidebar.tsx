import { SidebarNav } from "./sidebar-nav";
import type { SidebarStartup } from "./sidebar-startups";

export function AppSidebar({ startups }: { startups: SidebarStartup[] }) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-sidebar-border bg-sidebar lg:block">
      <SidebarNav startups={startups} />
    </aside>
  );
}
