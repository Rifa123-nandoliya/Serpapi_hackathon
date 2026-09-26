import type { Metadata } from "next";

import { Mission } from "@/components/about/mission";
import { Problem } from "@/components/about/problem";
import { Team } from "@/components/about/team";
import { Cta } from "@/components/home/cta";
import { HowItWorks } from "@/components/home/how-it-works";
import { HeroBackground } from "@/components/marketing/hero-background";
import { SectionHeading } from "@/components/marketing/section-heading";

export const metadata: Metadata = {
  title: "About us",
  description: "Why we built GapScope: founders deserve evidence, not guesses.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative isolate overflow-hidden px-4 pt-32 pb-32 sm:px-6 sm:pt-40 sm:pb-40 lg:px-8">
        <HeroBackground />
        <SectionHeading
          as="h1"
          before="We help founders build on"
          highlight="evidence"
          after="."
          subtitle="GapScope started with a simple question: why do founders spend months building before they check what customers are already complaining about?"
          className="max-w-4xl"
        />
      </section>
      <Mission />
      <Problem />
      <HowItWorks />
      <Team />
      <Cta />
    </>
  );
}
