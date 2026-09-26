"use client";

import { ExternalLink, MessageSquare, User, XCircle } from "lucide-react";

import { CheckBullet } from "@/components/marketing/check-list";
import { LogoMark } from "@/components/marketing/logo";
import { SectionHeading } from "@/components/marketing/section-heading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { sources } from "@/lib/mock/utils";

type Scenario = {
  id: string;
  tab: string;
  prompt: string;
  chatgpt: string[];
  gapscope: { text: string; source: string; sourceLabel: string }[];
};

const SCENARIOS: Scenario[] = [
  {
    id: "cafe",
    tab: "Café in Andheri",
    prompt: "I want to open a café in Andheri West, Mumbai. What is missing in the market?",
    chatgpt: [
      "Focus on great coffee and a cosy ambience.",
      "Customers usually value fast, friendly service.",
      "Free Wi-Fi could attract students and freelancers.",
      "Research your competitors' pricing before you launch.",
    ],
    gapscope: [
      {
        text: "Late closing hours: 3.3% of 1,240 reviews (95% CI 2.4–4.5%). 0 of 5 competitors are open after 11 pm.",
        source: sources.maps("cafe open late Andheri West"),
        sourceLabel: "Google Maps",
      },
      {
        text: "Seating comfort: 11.2% of reviews, avg 2.9★. Only 1 of 5 competitors has work-friendly seating.",
        source: sources.maps("Brewhaus Versova Mumbai"),
        sourceLabel: "Google Maps",
      },
      {
        text: "Wi-Fi complaints are rising fastest: +1.1 pts in 12 weeks, the lowest avg rating at 2.4★.",
        source: sources.trends("cafe with wifi mumbai"),
        sourceLabel: "Google Trends",
      },
      {
        text: "Risk: Bean Theory is hiring 3 night-shift baristas and may close the late-hours gap first.",
        source: sources.jobs("Bean Theory barista night shift Andheri"),
        sourceLabel: "Google Jobs",
      },
    ],
  },
  {
    id: "no-competitors",
    tab: "Idea with no competitors",
    prompt: "I'm building an AI study planner for Indian engineering students. Who are my competitors?",
    chatgpt: [
      "There are many study apps on the market today.",
      "You could stand out with AI-powered features.",
      "Students in India tend to be price-sensitive.",
      "Consider a freemium model to grow quickly.",
    ],
    gapscope: [
      {
        text: "No direct competitors found. Analysed 5 nearest neighbours (62–81% similar) and 603 of their reviews.",
        source: sources.playStore("study planner engineering students"),
        sourceLabel: "Play Store",
      },
      {
        text: "Rigid schedules: 19.6% of reviews (95% CI 16.6–22.9%), rising +1.4 pts in 12 weeks.",
        source: sources.playStore("PrepPath study planner"),
        sourceLabel: "Play Store",
      },
      {
        text: "Syllabus mismatch: 16.1% of reviews, avg 2.3★. Only 1 of 5 neighbours maps university syllabi.",
        source: sources.trends("AKTU syllabus"),
        sourceLabel: "Google Trends",
      },
      {
        text: "Risk: PrepPath is hiring an ML engineer for \"adaptive rescheduling\".",
        source: sources.jobs("PrepPath ML engineer adaptive rescheduling"),
        sourceLabel: "Google Jobs",
      },
    ],
  },
];

function ChatGptCard({ lines }: { lines: string[] }) {
  return (
    <div className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 sm:p-8">
      <div className="flex items-center gap-3">
        <span className="flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <MessageSquare aria-hidden="true" className="size-4" />
        </span>
        <div>
          <p className="font-semibold text-foreground">ChatGPT</p>
          <p className="text-xs text-muted-foreground">General advice, no sources</p>
        </div>
      </div>
      <ul className="mt-6 space-y-4">
        {lines.map((line) => (
          <li key={line} className="flex items-start gap-3 text-[15px] text-muted-foreground">
            <XCircle aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-neutral-400" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function GapScopeCard({ lines }: { lines: Scenario["gapscope"] }) {
  return (
    <div className="relative flex h-full flex-col rounded-3xl border-2 border-brand/70 bg-background p-6 shadow-[0_24px_60px_-24px_rgb(240_90_40/0.45)] sm:p-8">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-full bg-brand-soft">
            <LogoMark className="size-6" />
          </span>
          <div>
            <p className="font-semibold text-foreground">GapScope</p>
            <p className="text-xs text-muted-foreground">Statistics with a source for every line</p>
          </div>
        </div>
        <span className="hidden rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand sm:inline">
          Evidence-backed
        </span>
      </div>
      <ul className="mt-6 space-y-4">
        {lines.map((line) => (
          <li key={line.text} className="flex items-start gap-3 text-[15px] text-foreground/90">
            <CheckBullet className="mt-0.5" />
            <span>
              {line.text}{" "}
              <a
                href={line.source}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded text-xs font-medium whitespace-nowrap text-brand hover:underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                {line.sourceLabel}
                <ExternalLink aria-hidden="true" className="size-3" />
                <span className="sr-only">(opens in a new tab)</span>
              </a>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Comparison() {
  return (
    <section aria-labelledby="comparison-heading" className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
            id="comparison-heading"
            before="Same question."
            highlight="Different answer."
            subtitle="Ask a chatbot and you get advice. Ask GapScope and you get numbers, confidence intervals and a link to every source."
        />

        <Tabs defaultValue={SCENARIOS[0].id} className="mt-10 items-center">
          <TabsList className="h-11! max-w-full rounded-full p-1">
            {SCENARIOS.map((s) => (
              <TabsTrigger key={s.id} value={s.id} className="rounded-full px-3 text-[13px] sm:px-5 sm:text-sm">
                {s.tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {SCENARIOS.map((s) => (
            <TabsContent key={s.id} value={s.id} className="mt-8 w-full">
              <div className="mx-auto flex max-w-2xl items-start gap-3 rounded-2xl border border-border bg-card px-4 py-3 sm:px-5 sm:py-4">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(180deg,#3f3f3f,#0a0a0a)] text-white">
                  <User aria-hidden="true" className="size-4" />
                </span>
                <p className="pt-1 text-[15px] text-foreground">
                  <span className="sr-only">Prompt: </span>
                  {s.prompt}
                </p>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <ChatGptCard lines={s.chatgpt} />
                <GapScopeCard lines={s.gapscope} />
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <p className="mt-6 text-center text-xs text-muted-foreground">Sample output with illustrative numbers.</p>
      </div>
    </section>
  );
}
