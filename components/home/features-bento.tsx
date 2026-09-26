import { BentoCard, BentoGrid } from "@/components/marketing/bento-grid";
import { SectionHeading } from "@/components/marketing/section-heading";

import { GapBarChart, LiveAlerts, NeighbourOrbit } from "./bento-illustrations";
import { DottedMap } from "./dotted-map";

export function FeaturesBento() {
  return (
    <section id="features" aria-labelledby="features-heading" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="features-heading"
          before="Features so good you'll"
          highlight="ship faster"
          subtitle="Four of the things GapScope does for you, from watching competitors around the world to finding neighbours when you have no competitors at all."
        />
        <BentoGrid className="mt-14 md:grid-cols-1 lg:grid-cols-3">
          <BentoCard
            className="lg:col-span-2"
            illustrationClassName="aspect-[2/1] min-h-0 sm:aspect-auto sm:min-h-80"
            illustration={<DottedMap />}
            title="Monitor competitors everywhere"
            description="Ratings, prices, job posts and news for every competitor you care about, checked daily across 8 search engines."
          />
          <BentoCard
            illustrationClassName="min-h-72 sm:min-h-80"
            illustration={<GapBarChart />}
            title="Gaps as real numbers"
            description="Every gap is a share of real reviews with a 95% confidence interval, never a vague sentence."
          />
          <BentoCard
            illustrationClassName="min-h-80 sm:min-h-96"
            illustration={<NeighbourOrbit />}
            title="Nearest-neighbour mode"
            description="No direct competitors? GapScope analyses the closest products by problem, customer or business model."
          />
          <BentoCard
            className="lg:col-span-2"
            illustrationClassName="min-h-80 sm:min-h-96"
            illustration={<LiveAlerts />}
            title="Live alerts"
            description="Get a Telegram or email alert the moment a competitor changes prices, starts hiring or a complaint starts spiking."
          />
        </BentoGrid>
      </div>
    </section>
  );
}
