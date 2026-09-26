"use client";

import { Fragment, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Menu } from "lucide-react";

import { ThemeToggle } from "@/components/marketing/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SidebarNav } from "./sidebar-nav";
import type { SidebarStartup } from "./sidebar-startups";

type Crumb = { label: string; href?: string };

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function buildCrumbs(pathname: string, startups: SidebarStartup[]): Crumb[] {
  const [section, id] = pathname.split("/").filter(Boolean);
  if (section !== "workspace" && section !== "dashboard") return [];

  const root: Crumb = {
    label: section === "workspace" ? "Workspace" : "Dashboard",
    href: `/${section}`,
  };
  if (!id) return [{ label: root.label }];
  if (section === "workspace" && id === "new") return [root, { label: "Add startup" }];

  const startup = startups.find((s) => s.id === id);
  return [root, { label: startup?.name ?? safeDecode(id) }];
}

export function AppTopbar({ startups }: { startups: SidebarStartup[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const crumbs = buildCrumbs(pathname, startups);

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur-md sm:px-6 lg:px-8">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2 lg:hidden" aria-label="Open sidebar">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 bg-sidebar p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SheetDescription className="sr-only">Workspace navigation</SheetDescription>
          <SidebarNav startups={startups} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>

      <nav aria-label="Breadcrumb" className="min-w-0 flex-1">
        <ol className="flex min-w-0 items-center gap-1.5 text-sm">
          {crumbs.map((crumb, index) => {
            const last = index === crumbs.length - 1;
            return (
              <Fragment key={`${crumb.label}-${index}`}>
                {index > 0 && (
                  <ChevronRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                )}
                <li className="min-w-0">
                  {crumb.href && !last ? (
                    <Link
                      href={crumb.href}
                      className="rounded text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      aria-current={last ? "page" : undefined}
                      className="block truncate font-medium text-foreground"
                    >
                      {crumb.label}
                    </span>
                  )}
                </li>
              </Fragment>
            );
          })}
        </ol>
      </nav>

      <ThemeToggle />
    </header>
  );
}
