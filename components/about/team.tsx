import { SectionHeading } from "@/components/marketing/section-heading";
import { cn } from "@/lib/utils";

type Member = { name: string; role: string; initials: string; tone: string };

// Placeholder members (CLAUDE.md §6): replace name, role and initials with the real team.
const TEAM: Member[] = [
  { name: "Name", role: "Role", initials: "N", tone: "bg-orange-100 text-orange-700" },
  { name: "Name", role: "Role", initials: "N", tone: "bg-sky-100 text-sky-700" },
  { name: "Name", role: "Role", initials: "N", tone: "bg-emerald-100 text-emerald-700" },
  { name: "Name", role: "Role", initials: "N", tone: "bg-violet-100 text-violet-700" },
];

export function Team() {
  return (
    <section aria-labelledby="team-heading" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <SectionHeading
          id="team-heading"
          before="Meet the"
          highlight="team"
          subtitle="A small team of builders who got tired of guessing, built for the SerpApi Hackathon."
        />
        <ul className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TEAM.map((member, i) => (
            <li
              key={i}
              className="flex flex-col items-center rounded-3xl border border-border bg-card px-6 py-10 text-center transition-shadow hover:shadow-float"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-24 items-center justify-center rounded-full text-3xl font-semibold shadow-[0_16px_40px_-12px_rgb(0_0_0/0.25)] ring-4 ring-background",
                  member.tone,
                )}
              >
                {member.initials}
              </span>
              <p className="mt-6 text-lg font-semibold text-foreground">{member.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">{member.role}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
