import type { Metadata } from "next";

import { Comparison } from "@/components/home/comparison";
import { Cta } from "@/components/home/cta";
import { DataSources } from "@/components/home/data-sources";
import { FeatureCardsRow } from "@/components/home/feature-cards-row";
import { FeaturesBento } from "@/components/home/features-bento";
import { Founders } from "@/components/home/founders";
import { Hero } from "@/components/home/hero";
import { HowItWorks } from "@/components/home/how-it-works";
import { PricingPreview } from "@/components/home/pricing-preview";
import { Stats } from "@/components/home/stats";

export const metadata: Metadata = {
  title: { absolute: "GapScope — Competitor intelligence you can prove" },
};

// Section order follows CLAUDE.md §6 "Home". The Footer (section 11) comes from the layout.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Comparison />
      <DataSources />
      <Stats />
      <FeaturesBento />
      <FeatureCardsRow />
      <HowItWorks />
      <PricingPreview />
      <Founders />
      <Cta />
    </>
  );
}
