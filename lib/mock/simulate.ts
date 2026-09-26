import type { MonitoringEvent } from "../types";
import { sources } from "./utils";

type EventTemplate = Omit<MonitoringEvent, "id" | "startupId" | "at">;

const CAFE_TEMPLATES: EventTemplate[] = [
  {
    competitorId: "bean-theory",
    type: "news",
    title: "Bean Theory announces 12 am closing on weekends",
    detail: "Posted on its Google Business profile. Weekday hours unchanged (10:30 pm).",
    severity: "high",
    sourceUrl: sources.maps("Bean Theory Andheri West Mumbai"),
  },
  {
    competitorId: "brewhaus",
    type: "complaint_spike",
    title: "\"Wi-Fi\" complaints at Brewhaus up +1.3 pts",
    detail: "9 new reviews this week mention dropped connections during evenings.",
    severity: "medium",
    sourceUrl: sources.maps("Brewhaus Versova Mumbai"),
  },
  {
    competitorId: "daily-grind",
    type: "rating_change",
    title: "The Daily Grind rose to 4.3★",
    detail: "Up from 4.2 after 31 new reviews praising the new seating layout.",
    severity: "medium",
    sourceUrl: sources.maps("The Daily Grind Lokhandwala Mumbai"),
  },
  {
    competitorId: "chai-chapter",
    type: "price_change",
    title: "Chai & Chapter launched a ₹349 work-day pass",
    detail: "Includes unlimited chai and a reserved seat until 7 pm.",
    severity: "high",
    sourceUrl: sources.maps("Chai and Chapter Andheri Mumbai"),
  },
  {
    competitorId: "mocha-point",
    type: "hiring",
    title: "Café Mocha Point is hiring 2 baristas",
    detail: "Likely a response to wait-time complaints (23.5% of its reviews).",
    severity: "low",
    sourceUrl: sources.jobs("Cafe Mocha Point barista Andheri"),
  },
  {
    competitorId: "bean-theory",
    type: "price_change",
    title: "Bean Theory added a ₹60 late-evening surcharge",
    detail: "Applies after 9 pm on weekends; 4 reviews already mention it.",
    severity: "medium",
    sourceUrl: sources.maps("Bean Theory Andheri West Mumbai"),
  },
];

const STUDY_TEMPLATES: EventTemplate[] = [
  {
    competitorId: "preppath",
    type: "news",
    title: "PrepPath beta-tests \"Smart Reschedule\"",
    detail: "Rolled out to 5% of users according to its changelog. No university syllabi yet.",
    severity: "high",
    sourceUrl: sources.news("PrepPath smart reschedule"),
  },
  {
    competitorId: "exampilot",
    type: "price_change",
    title: "ExamPilot adds a ₹349 monthly plan",
    detail: "First monthly option after pricing complaints reached 19.3% of its reviews.",
    severity: "medium",
    sourceUrl: sources.playStore("ExamPilot engineering exam prep"),
  },
  {
    competitorId: "notewise",
    type: "complaint_spike",
    title: "\"Sync & login bugs\" at Notewise up +2.1 pts",
    detail: "14 new 1★ reviews after the latest update.",
    severity: "medium",
    sourceUrl: sources.playStore("Notewise AI notes planner"),
  },
  {
    competitorId: "focusforge",
    type: "hiring",
    title: "FocusForge is hiring a curriculum lead",
    detail: "The role mentions \"Indian university syllabi\", a possible move into your gap.",
    severity: "high",
    sourceUrl: sources.jobs("FocusForge curriculum lead"),
  },
  {
    competitorId: "studygrid",
    type: "rating_change",
    title: "StudyGrid rose to 4.3★",
    detail: "Up from 4.2 after its price cut; 18 new reviews mention value.",
    severity: "low",
    sourceUrl: sources.playStore("StudyGrid planner"),
  },
];

/**
 * Deterministic "next week" monitoring events for the Simulate button.
 * `week` starts at 1; `baseTime` is the time of the newest event (the store keeps it
 * later than any earlier simulated week, so weeks never interleave).
 */
export function simulateWeekEvents(
  startupId: string,
  week: number,
  baseTime: string,
): MonitoringEvent[] {
  const templates = startupId === "studysprint" ? STUDY_TEMPLATES : CAFE_TEMPLATES;
  const count = week % 2 === 1 ? 3 : 2;
  const baseMs = Date.parse(baseTime);

  return Array.from({ length: count }, (_, i) => {
    const template = templates[((week - 1) * 3 + i) % templates.length];
    return {
      ...template,
      id: `${startupId}-sim-w${week}-${i + 1}`,
      startupId,
      // One second apart, so each week's events stay together and newest-first.
      at: new Date(baseMs - i * 1000).toISOString(),
    };
  });
}
