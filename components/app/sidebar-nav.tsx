"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, ChartColumn, LayoutGrid, Plus } from "lucide-react";

import { Logo } from "@/components/marketing/logo";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

import type { SidebarStartup } from "./sidebar-startups";

const PRIMARY_LINKS = [
  { label: "Workspace", href: "/workspace", icon: LayoutGrid },
  { label: "Dashboard", href: "/dashboard", icon: ChartColumn },
];

type SidebarNavProps = {
  startups: SidebarStartup[];
  /** Called after a link is clicked (used to close the mobile sheet). */
  onNavigate?: () => void;
};

function isPrimaryActive(pathname: string, href: string): boolean {
  if (href === "/workspace") {
    return pathname === "/workspace" || pathname === "/workspace/new";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

const itemClasses =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none";

export function SidebarNav({ startups, onNavigate }: SidebarNavProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center px-5">
        <Logo />
      </div>

      <nav aria-label="App" className="flex min-h-0 flex-1 flex-col px-3 pt-2">
        <ul className="space-y-1">
          {PRIMARY_LINKS.map(({ label, href, icon: Icon }) => {
            const active = isPrimaryActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    itemClasses,
                    active
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <Icon aria-hidden="true" className={cn("size-4", active && "text-brand")} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        <Separator className="my-4" />

        <p className="px-3 pb-2 text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Your startups
        </p>
        <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto">
          {startups.length === 0 ? (
            <li className="px-3 py-2 text-sm text-muted-foreground">No startups yet.</li>
          ) : (
            startups.map((startup) => {
              const href = `/workspace/${startup.id}`;
              const active = pathname === href;
              return (
                <li key={startup.id}>
                  <Link
                    href={href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      itemClasses,
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-soft text-xs font-semibold text-brand"
                    >
                      {startup.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="truncate">{startup.name}</span>
                  </Link>
                </li>
              );
            })
          )}
        </ul>
      </nav>

      <div className="space-y-2 border-t border-sidebar-border p-3">
        <Button asChild variant="gradient" size="lg" className="w-full rounded-lg">
          <Link href="/workspace/new" onClick={onNavigate}>
            <Plus aria-hidden="true" />
            Add startup
          </Link>
        </Button>
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            itemClasses,
            "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          )}
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to home
        </Link>
      </div>
    </div>
  );
}
