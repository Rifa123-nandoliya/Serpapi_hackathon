"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import { Logo } from "./logo";
import { MARKETING_NAV_LINKS, isActivePath } from "./nav-links";
import { ThemeToggle } from "./theme-toggle";

const SCROLL_THRESHOLD = 80;

export function Navbar() {
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const [floating, setFloating] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => {
    setFloating(y > SCROLL_THRESHOLD);
  });

  // Pick up the correct state when the page loads already scrolled (reload, anchor link).
  useEffect(() => {
    setFloating(scrollY.get() > SCROLL_THRESHOLD);
  }, [scrollY]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4">
      <motion.nav
        aria-label="Main"
        initial={false}
        animate={{
          maxWidth: floating ? 780 : 1280,
          marginTop: floating ? 16 : 0,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 32 }}
        className={cn(
          "pointer-events-auto mx-auto flex items-center gap-4 border transition-[background-color,box-shadow,border-color,border-radius,padding] duration-300",
          floating
            ? "rounded-full border-border/60 bg-background/90 py-3 pr-3 pl-5 shadow-float backdrop-blur-md sm:pl-7"
            : "rounded-none border-transparent bg-transparent px-2 py-5 sm:px-4",
        )}
      >
        <div className="flex flex-1 items-center">
          <Logo />
        </div>

        <ul className="hidden items-center gap-1 lg:flex">
          {MARKETING_NAV_LINKS.map((link) => {
            const active = isActivePath(pathname, link.href);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-base text-foreground/85 transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                    active && "text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <AnimatePresence initial={false}>
          {!floating && (
            <motion.div
              key="nav-actions"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              className="hidden flex-1 items-center justify-end gap-2 lg:flex"
            >
              <ThemeToggle />
              <Button asChild variant="gradient" size="lg" className="rounded-lg">
                <Link href="/workspace/new">Try the demo</Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-1 lg:hidden">
          <ThemeToggle />
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full" aria-label="Open menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="top" className="rounded-b-3xl px-2 pb-6">
              <SheetHeader>
                <SheetTitle asChild>
                  <div>
                    <Logo href={null} />
                  </div>
                </SheetTitle>
                <SheetDescription className="sr-only">Site navigation</SheetDescription>
              </SheetHeader>
              <ul className="flex flex-col gap-1 px-2">
                {MARKETING_NAV_LINKS.map((link) => {
                  const active = isActivePath(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block rounded-xl px-4 py-3 text-base text-foreground/80 transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                          active && "bg-muted text-foreground",
                        )}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <div className="px-4 pt-2">
                <Button asChild variant="gradient" size="xl" className="w-full">
                  <Link href="/workspace/new" onClick={() => setMobileOpen(false)}>
                    Try the demo
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </motion.nav>
    </header>
  );
}
