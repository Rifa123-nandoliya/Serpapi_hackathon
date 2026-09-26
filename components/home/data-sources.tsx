import {
  Briefcase,
  MapPin,
  Newspaper,
  Play,
  Search,
  ShoppingCart,
  Store,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export const DATA_SOURCES: { label: string; icon: LucideIcon }[] = [
  { label: "Google Search", icon: Search },
  { label: "Google Maps", icon: MapPin },
  { label: "Play Store", icon: Play },
  { label: "App Store", icon: Store },
  { label: "Google Trends", icon: TrendingUp },
  { label: "Google Jobs", icon: Briefcase },
  { label: "Google News", icon: Newspaper },
  { label: "Google Shopping", icon: ShoppingCart },
];

export function DataSources() {
  return (
    <section aria-labelledby="sources-heading" className="px-4 pt-8 pb-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl text-center">
        <h2 id="sources-heading" className="text-xl font-semibold tracking-tight text-foreground/80 sm:text-2xl">
          Powered by live data from
        </h2>
        <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-5 sm:gap-x-12">
          {DATA_SOURCES.map(({ label, icon: Icon }) => (
            <li key={label} className="flex items-center gap-2.5 text-foreground">
              <span className="flex size-9 items-center justify-center rounded-xl bg-[linear-gradient(160deg,#4a4a4a,#0a0a0a)] text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.2)]">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <span className="text-base font-bold tracking-tight sm:text-lg">{label}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
