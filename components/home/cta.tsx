import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Newspaper,
  Search,
  ShoppingCart,
  Smartphone,
  Star,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { FloatingIconCircle } from "@/components/marketing/floating-icon-circle";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Mobile: 4 on top, 4 at the bottom. md+: 3 top, 2 at the sides, 3 bottom (09-cta.png).
const ICONS: { icon: LucideIcon; label: string; position: string }[] = [
  { icon: Search, label: "Google Search", position: "top-0 left-[3%] md:left-[22%]" },
  { icon: MapPin, label: "Google Maps", position: "top-0 left-[28%] md:left-1/2 md:-translate-x-1/2" },
  { icon: Smartphone, label: "Play Store", position: "top-0 left-[53%] md:left-auto md:right-[22%]" },
  { icon: Star, label: "App Store", position: "top-0 right-[3%] md:top-1/2 md:right-[4%] md:-translate-y-1/2" },
  { icon: TrendingUp, label: "Google Trends", position: "bottom-0 left-[3%] md:bottom-auto md:top-1/2 md:left-[4%] md:-translate-y-1/2" },
  { icon: Briefcase, label: "Google Jobs", position: "bottom-0 left-[28%] md:left-[22%]" },
  { icon: Newspaper, label: "Google News", position: "bottom-0 left-[53%] md:left-1/2 md:-translate-x-1/2" },
  { icon: ShoppingCart, label: "Google Shopping", position: "bottom-0 right-[3%] md:right-[22%]" },
];

export function Cta() {
  return (
    <section aria-labelledby="cta-heading" className="overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="relative mx-auto h-[520px] max-w-6xl sm:h-[600px] md:h-[640px]">
        {ICONS.map(({ icon, label, position }, i) => (
          <div key={label} className={cn("absolute", position)}>
            <FloatingIconCircle icon={icon} label={label} delay={i * -0.75} size="md" className="md:hidden" />
            <FloatingIconCircle icon={icon} label={label} delay={i * -0.75} className="hidden md:flex" />
          </div>
        ))}

        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 md:px-32 lg:px-0">
          <div
            aria-hidden="true"
            className="absolute inset-x-[10%] -inset-y-10 -z-10 bg-[radial-gradient(ellipse_at_center,color-mix(in_oklab,var(--brand-light)_14%,transparent),transparent_70%)]"
          />
          <SectionHeading
            id="cta-heading"
            before="Know your market"
            highlight="before you build"
            subtitle="Free for your first report. No credit card, no sign-up."
            className="max-w-3xl px-2"
          />
          <div className="mt-8 flex justify-center">
            <Button asChild variant="gradient" size="xl">
              <Link href="/workspace/new">Analyse my idea</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
