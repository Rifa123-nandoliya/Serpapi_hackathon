import Link from "next/link";

import { Footer } from "@/components/marketing/footer";
import { HeroBackground } from "@/components/marketing/hero-background";
import { Navbar } from "@/components/marketing/navbar";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <main id="main" className="relative isolate flex flex-1 items-center justify-center px-4 pt-32 pb-40 text-center">
        <HeroBackground />
        <div>
          <p className="text-sm font-medium tracking-wide text-brand">404</p>
          <h1 className="mt-3 text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
            Page <span className="text-gradient-brand">not found</span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-base text-muted-foreground sm:text-lg">
            The page you are looking for does not exist or has moved.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button asChild variant="gradient" size="xl">
              <Link href="/">Back to home</Link>
            </Button>
            <Button asChild variant="subtle" size="xl">
              <Link href="/workspace">Open workspace</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
