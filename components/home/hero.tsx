import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { HeroBackground } from "@/components/marketing/hero-background";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";

import { ProductPreview } from "./product-preview";

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden px-4 pt-32 sm:px-6 sm:pt-40 lg:pt-48">
      <HeroBackground />
      <SectionHeading
        as="h1"
        before="See the gaps your"
        highlight="competitors can't"
        after="."
        subtitle="GapScope reads thousands of real reviews, searches, job posts and news stories about your competitors, then turns them into ranked opportunities and a plan you can act on."
        className="max-w-5xl"
      />

      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button asChild variant="gradient" size="xl" className="w-full sm:w-auto">
          <Link href="/workspace/new">
            Analyse my idea
            <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <Button asChild variant="subtle" size="xl" className="w-full sm:w-auto">
          <Link href="/workspace/brew-and-stay">See a sample report</Link>
        </Button>
      </div>

      <div className="mt-16 sm:mt-20">
        <ProductPreview />
      </div>
    </section>
  );
}
