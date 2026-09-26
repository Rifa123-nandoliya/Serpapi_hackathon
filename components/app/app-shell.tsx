import { AppSidebar } from "./app-sidebar";
import { AppTopbar } from "./app-topbar";
import { DEFAULT_SIDEBAR_STARTUPS, type SidebarStartup } from "./sidebar-startups";

type AppShellProps = {
  children: React.ReactNode;
  startups?: SidebarStartup[];
};

/** Left sidebar + top bar wrapper for every (app) route. Content is capped at max-w-7xl. */
export function AppShell({ children, startups = DEFAULT_SIDEBAR_STARTUPS }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar startups={startups} />
      <div className="flex min-w-0 flex-1 flex-col">
        <AppTopbar startups={startups} />
        <main id="main" className="flex-1">
          <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
