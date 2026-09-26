import type {
  ClusterInsight,
  Competitor,
  Gap,
  MonitoringData,
  MonitoringEvent,
  PlanItem,
  Report,
  Risk,
  RiskReport,
  Startup,
} from "../types";
import type { MockBundle } from "./bundle";
import {
  clusterPoints,
  isoAgo,
  mulberry32,
  sources,
  stepSeries,
  trendSeries,
  weeklyDates,
} from "./utils";

const ID = "studysprint";
const TOTAL_REVIEWS = 603;
const WEEKS = weeklyDates(12);

export const studySprintStartup: Startup = {
  id: ID,
  name: "StudySprint",
  idea: "An AI study planner for Indian engineering students that builds a day-by-day plan from their exact university syllabus and reschedules automatically when they fall behind.",
  category: "EdTech",
  location: "India (online)",
  targetCustomer: "B.Tech students at state universities (AKTU, VTU, Mumbai University) preparing for semester exams",
  mode: "idea",
  createdAt: isoAgo(12, 6),
  status: "monitoring",
  nearestNeighbourMode: true,
};

// ---------------------------------------------------------------------------
// Nearest neighbours (no direct competitors were found)
// ---------------------------------------------------------------------------

const FEATURES = [
  "University-specific syllabus",
  "Adaptive rescheduling",
  "Offline mode",
  "Spaced repetition",
  "Group study rooms",
  "Exam countdown",
  "Hindi / regional language",
  "Free tier",
];

const RADAR_AXES = ["Personalisation", "Syllabus fit", "Reliability", "Value", "Engagement", "Offline use"];

function features(on: string[]): Record<string, boolean> {
  return Object.fromEntries(FEATURES.map((f) => [f, on.includes(f)]));
}

const competitors: Competitor[] = [
  {
    id: "preppath",
    name: "PrepPath",
    rating: 4.1,
    reviewCount: 158,
    priceBand: "Free · ₹199/mo Pro",
    openRoles: 4,
    latestNews: "Job post mentions building \"adaptive rescheduling\" for Q1",
    similarity: 81,
    neighbourType: "same_problem",
    features: features(["Exam countdown", "Spaced repetition", "Free tier"]),
    radarScores: { Personalisation: 62, "Syllabus fit": 35, Reliability: 71, Value: 66, Engagement: 58, "Offline use": 20 },
    sourceUrl: sources.playStore("PrepPath study planner"),
  },
  {
    id: "exampilot",
    name: "ExamPilot",
    rating: 3.9,
    reviewCount: 119,
    priceBand: "₹2,499/year",
    openRoles: 2,
    latestNews: "Launched a GATE 2027 test series",
    similarity: 74,
    neighbourType: "same_customer",
    features: features(["University-specific syllabus", "Exam countdown", "Hindi / regional language"]),
    radarScores: { Personalisation: 40, "Syllabus fit": 78, Reliability: 55, Value: 48, Engagement: 52, "Offline use": 45 },
    sourceUrl: sources.playStore("ExamPilot engineering exam prep"),
  },
  {
    id: "notewise",
    name: "Notewise",
    rating: 3.8,
    reviewCount: 91,
    priceBand: "Free · ₹299/mo Plus",
    openRoles: 1,
    similarity: 70,
    neighbourType: "same_problem",
    features: features(["Spaced repetition", "Free tier", "Adaptive rescheduling"]),
    radarScores: { Personalisation: 70, "Syllabus fit": 30, Reliability: 44, Value: 52, Engagement: 61, "Offline use": 25 },
    sourceUrl: sources.playStore("Notewise AI notes planner"),
  },
  {
    id: "focusforge",
    name: "FocusForge",
    rating: 4.4,
    reviewCount: 131,
    priceBand: "Free · ₹99/mo",
    openRoles: 0,
    latestNews: "Crossed 1 million downloads on the Play Store",
    similarity: 68,
    neighbourType: "same_customer",
    features: features(["Offline mode", "Group study rooms", "Free tier"]),
    radarScores: { Personalisation: 38, "Syllabus fit": 15, Reliability: 84, Value: 80, Engagement: 82, "Offline use": 88 },
    sourceUrl: sources.playStore("FocusForge study timer"),
  },
  {
    id: "studygrid",
    name: "StudyGrid",
    rating: 4.2,
    reviewCount: 104,
    priceBand: "Free · ₹149/mo Premium",
    openRoles: 3,
    similarity: 62,
    neighbourType: "same_model",
    features: features(["Free tier", "Group study rooms", "Exam countdown", "Offline mode"]),
    radarScores: { Personalisation: 48, "Syllabus fit": 22, Reliability: 76, Value: 72, Engagement: 64, "Offline use": 70 },
    sourceUrl: sources.playStore("StudyGrid planner"),
  },
];

// ---------------------------------------------------------------------------
// Customer voice
// ---------------------------------------------------------------------------

type ClusterSeed = Omit<ClusterInsight, "points" | "total"> & {
  centre: { x: number; y: number };
  spread: number;
};

const clusterSeeds: ClusterSeed[] = [
  {
    id: "rigid-schedules",
    label: "Rigid schedules",
    count: 118,
    avgRating: 2.6,
    trendDelta: 0.014,
    centre: { x: -6, y: 6 },
    spread: 1.8,
    byCompetitor: [
      { competitorId: "preppath", share: 0.247 },
      { competitorId: "exampilot", share: 0.218 },
      { competitorId: "notewise", share: 0.121 },
      { competitorId: "focusforge", share: 0.107 },
      { competitorId: "studygrid", share: 0.231 },
    ],
    samples: [
      { text: "Miss one day and the whole plan is useless. I have to rebuild it manually every week.", rating: 2, competitorId: "preppath", sourceUrl: sources.playStore("PrepPath study planner") },
      { text: "Schedule doesn't care that I have lab submissions. Just keeps piling topics on.", rating: 2, competitorId: "studygrid", sourceUrl: sources.playStore("StudyGrid planner") },
      { text: "Good plan on day one, completely out of sync by day five.", rating: 3, competitorId: "exampilot", sourceUrl: sources.playStore("ExamPilot engineering exam prep") },
    ],
  },
  {
    id: "syllabus-mismatch",
    label: "Syllabus mismatch",
    count: 97,
    avgRating: 2.3,
    trendDelta: 0.008,
    centre: { x: 6, y: 6 },
    spread: 1.6,
    byCompetitor: [
      { competitorId: "preppath", share: 0.209 },
      { competitorId: "exampilot", share: 0.084 },
      { competitorId: "notewise", share: 0.198 },
      { competitorId: "focusforge", share: 0.061 },
      { competitorId: "studygrid", share: 0.212 },
    ],
    samples: [
      { text: "Content is for JEE, not for my AKTU semester exams. Half the topics aren't even in our syllabus.", rating: 2, competitorId: "preppath", sourceUrl: sources.playStore("PrepPath study planner") },
      { text: "No VTU scheme at all. I had to type every unit in myself.", rating: 2, competitorId: "studygrid", sourceUrl: sources.playStore("StudyGrid planner") },
      { text: "AI summaries are generic and skip the units our professor actually tests.", rating: 3, competitorId: "notewise", sourceUrl: sources.playStore("Notewise AI notes planner") },
    ],
  },
  {
    id: "motivation",
    label: "Motivation drops after week 2",
    count: 83,
    avgRating: 3.2,
    trendDelta: 0.003,
    centre: { x: 0, y: -1 },
    spread: 2,
    byCompetitor: [
      { competitorId: "preppath", share: 0.139 },
      { competitorId: "exampilot", share: 0.151 },
      { competitorId: "notewise", share: 0.132 },
      { competitorId: "focusforge", share: 0.092 },
      { competitorId: "studygrid", share: 0.163 },
    ],
    samples: [
      { text: "Used it daily for 10 days, then stopped opening it. Nothing pulls you back.", rating: 3, competitorId: "studygrid", sourceUrl: sources.playStore("StudyGrid planner") },
      { text: "Streaks are the only motivation and they reset too easily.", rating: 3, competitorId: "exampilot", sourceUrl: sources.playStore("ExamPilot engineering exam prep") },
      { text: "Studying with friends in rooms keeps me going. Wish it had real plans too.", rating: 4, competitorId: "focusforge", sourceUrl: sources.playStore("FocusForge study timer") },
    ],
  },
  {
    id: "subscription-pricing",
    label: "Subscription pricing",
    count: 71,
    avgRating: 2.9,
    trendDelta: -0.002,
    centre: { x: 7, y: -5 },
    spread: 1.5,
    byCompetitor: [
      { competitorId: "preppath", share: 0.114 },
      { competitorId: "exampilot", share: 0.193 },
      { competitorId: "notewise", share: 0.176 },
      { competitorId: "focusforge", share: 0.038 },
      { competitorId: "studygrid", share: 0.087 },
    ],
    samples: [
      { text: "₹2,499 a year upfront is too much for a student. Give a monthly option.", rating: 2, competitorId: "exampilot", sourceUrl: sources.playStore("ExamPilot engineering exam prep") },
      { text: "Everything useful is behind the paywall.", rating: 2, competitorId: "notewise", sourceUrl: sources.playStore("Notewise AI notes planner") },
      { text: "Pro is fine but should be cheaper during exam season, not pricier.", rating: 3, competitorId: "preppath", sourceUrl: sources.playStore("PrepPath study planner") },
    ],
  },
  {
    id: "offline",
    label: "No offline mode",
    count: 64,
    avgRating: 2.5,
    trendDelta: 0.006,
    centre: { x: -7, y: -5 },
    spread: 1.4,
    byCompetitor: [
      { competitorId: "preppath", share: 0.152 },
      { competitorId: "exampilot", share: 0.067 },
      { competitorId: "notewise", share: 0.187 },
      { competitorId: "focusforge", share: 0.015 },
      { competitorId: "studygrid", share: 0.058 },
    ],
    samples: [
      { text: "Hostel Wi-Fi is terrible and the app won't even open without internet.", rating: 2, competitorId: "preppath", sourceUrl: sources.playStore("PrepPath study planner") },
      { text: "Can't see today's plan on the train. Needs offline access.", rating: 3, competitorId: "notewise", sourceUrl: sources.playStore("Notewise AI notes planner") },
      { text: "Spinner forever on 2G. Useless back home in my village.", rating: 2, competitorId: "exampilot", sourceUrl: sources.playStore("ExamPilot engineering exam prep") },
    ],
  },
  {
    id: "sync-bugs",
    label: "Sync & login bugs",
    count: 46,
    avgRating: 1.9,
    trendDelta: -0.004,
    centre: { x: 1, y: 8.5 },
    spread: 1.2,
    byCompetitor: [
      { competitorId: "preppath", share: 0.063 },
      { competitorId: "exampilot", share: 0.101 },
      { competitorId: "notewise", share: 0.132 },
      { competitorId: "focusforge", share: 0.023 },
      { competitorId: "studygrid", share: 0.058 },
    ],
    samples: [
      { text: "Logged out after the update and lost two weeks of progress.", rating: 1, competitorId: "notewise", sourceUrl: sources.playStore("Notewise AI notes planner") },
      { text: "Tasks ticked on my laptop don't show up on my phone.", rating: 2, competitorId: "exampilot", sourceUrl: sources.playStore("ExamPilot engineering exam prep") },
      { text: "OTP never arrives, can't log in on a new phone.", rating: 1, competitorId: "preppath", sourceUrl: sources.playStore("PrepPath study planner") },
    ],
  },
  {
    id: "notifications",
    label: "Notification overload",
    count: 22,
    avgRating: 2.8,
    trendDelta: null,
    centre: { x: -9.5, y: 0.5 },
    spread: 1,
    byCompetitor: [
      { competitorId: "preppath", share: 0.044 },
      { competitorId: "exampilot", share: 0.034 },
      { competitorId: "notewise", share: 0.044 },
      { competitorId: "focusforge", share: 0.023 },
      { competitorId: "studygrid", share: 0.038 },
    ],
    samples: [
      { text: "Eight reminders a day. I muted it and then forgot it existed.", rating: 2, competitorId: "studygrid", sourceUrl: sources.playStore("StudyGrid planner") },
      { text: "Promo notifications mixed with study reminders, super annoying.", rating: 3, competitorId: "notewise", sourceUrl: sources.playStore("Notewise AI notes planner") },
      { text: "Let me choose when to get reminded, not at 7 am on Sundays.", rating: 3, competitorId: "preppath", sourceUrl: sources.playStore("PrepPath study planner") },
    ],
  },
];

const clusters: ClusterInsight[] = clusterSeeds.map(({ centre, spread, ...cluster }, index) => ({
  ...cluster,
  total: TOTAL_REVIEWS,
  points: clusterPoints(2000 + index, cluster.id, cluster.count, centre, spread),
}));

// ---------------------------------------------------------------------------
// Gaps & plan
// ---------------------------------------------------------------------------

const gaps: Gap[] = [
  {
    id: "gap-syllabus",
    title: "Plans built from the exact university syllabus",
    clusterId: "syllabus-mismatch",
    opportunityScore: 88,
    complaintShare: 97 / TOTAL_REVIEWS,
    demandScore: 74,
    competitorCoverage: 0.2,
    summary: "Syllabus mismatch has the second-lowest rating (2.3★) and only ExamPilot maps university schemes, without adaptive plans.",
    evidenceUrls: [sources.playStore("PrepPath study planner"), sources.trends("AKTU syllabus"), sources.trends("VTU syllabus")],
  },
  {
    id: "gap-rescheduling",
    title: "Automatic rescheduling when you fall behind",
    clusterId: "rigid-schedules",
    opportunityScore: 82,
    complaintShare: 118 / TOTAL_REVIEWS,
    demandScore: 66,
    competitorCoverage: 0.2,
    summary: "The largest cluster (19.6%) and rising fastest (+1.4 pts). Only Notewise reschedules, and it has no syllabus data.",
    evidenceUrls: [sources.playStore("StudyGrid planner"), sources.playStore("PrepPath study planner")],
  },
  {
    id: "gap-offline",
    title: "Full offline mode for hostel and commute use",
    clusterId: "offline",
    opportunityScore: 69,
    complaintShare: 64 / TOTAL_REVIEWS,
    demandScore: 52,
    competitorCoverage: 0.4,
    summary: "10.6% of reviews; FocusForge proves offline use drives its 4.4★ rating.",
    evidenceUrls: [sources.playStore("FocusForge study timer"), sources.playStore("Notewise AI notes planner")],
  },
  {
    id: "gap-motivation",
    title: "Study-group accountability after week 2",
    clusterId: "motivation",
    opportunityScore: 58,
    complaintShare: 83 / TOTAL_REVIEWS,
    demandScore: 48,
    competitorCoverage: 0.4,
    summary: "13.8% of reviews describe drop-off after two weeks; group rooms help FocusForge retain users.",
    evidenceUrls: [sources.playStore("FocusForge study timer"), sources.playStore("StudyGrid planner")],
  },
  {
    id: "gap-pricing",
    title: "Semester pass instead of annual plans",
    clusterId: "subscription-pricing",
    opportunityScore: 47,
    complaintShare: 71 / TOTAL_REVIEWS,
    demandScore: 41,
    competitorCoverage: 0.8,
    summary: "Price complaints focus on ExamPilot's ₹2,499 annual plan; most neighbours already have a free tier.",
    evidenceUrls: [sources.playStore("ExamPilot engineering exam prep")],
  },
];

const plan: PlanItem[] = [
  { phase: "0-30", title: "Digitise 3 syllabi", detail: "Structure the CSE semester schemes for AKTU, VTU and Mumbai University into units, topics and weightage.", gapId: "gap-syllabus" },
  { phase: "0-30", title: "Recruit 40 pilot students", detail: "Partner with 2 college coding clubs; target students 6 weeks before semester exams." },
  { phase: "0-30", title: "Prototype the rescheduler", detail: "Rule-based rescheduling that redistributes missed topics by weightage and days left.", gapId: "gap-rescheduling" },
  { phase: "31-60", title: "Ship an offline-first Android app", detail: "Cache the full plan and notes locally; sync when a connection returns.", gapId: "gap-offline" },
  { phase: "31-60", title: "Add study-group check-ins", detail: "Groups of 4 with a daily check-in and a shared progress bar.", gapId: "gap-motivation" },
  { phase: "31-60", title: "Measure week-3 retention", detail: "Target 45% of pilot users still active in week 3 (neighbours report heavy drop-off after week 2)." },
  { phase: "61-90", title: "Launch a ₹299 semester pass", detail: "One payment per semester with UPI; free tier covers one subject.", gapId: "gap-pricing" },
  { phase: "61-90", title: "Add 5 more universities", detail: "Prioritise by search interest and pilot waitlist size." },
  { phase: "61-90", title: "Watch PrepPath's roadmap", detail: "Alert when PrepPath ships adaptive rescheduling or adds university syllabi." },
];

const report: Report = {
  startupId: ID,
  competitors,
  clusters,
  clusterQuality: { k: 7, silhouette: 0.58 },
  gaps,
  plan,
  positioning: "The study planner that knows your exact university syllabus and fixes your plan when life gets in the way.",
  pricingSuggestion: "Free for one subject; ₹299 per semester for all subjects, paid by UPI. Avoid annual plans; they drive most pricing complaints.",
  mvpFeatures: [
    "Syllabus import for AKTU, VTU and Mumbai University (CSE)",
    "Day-by-day plan weighted by past exam marks",
    "One-tap \"I fell behind\" rescheduling",
    "Offline-first Android app",
    "Study groups of 4 with daily check-ins",
  ],
  featureList: FEATURES,
  radarAxes: RADAR_AXES,
  totalReviews: TOTAL_REVIEWS,
  meta: {
    overview: { cached: true, fetchedAt: isoAgo(0, 4), latencyMs: 190, serpCalls: 0 },
    competitors: { cached: false, fetchedAt: isoAgo(0, 0.5), latencyMs: 4200, serpCalls: 9 },
    customerVoice: { cached: true, fetchedAt: isoAgo(0, 6), latencyMs: 360, serpCalls: 0 },
    gaps: { cached: true, fetchedAt: isoAgo(0, 4), latencyMs: 220, serpCalls: 0 },
    plan: { cached: true, fetchedAt: isoAgo(0, 4), latencyMs: 150, serpCalls: 0 },
  },
};

// ---------------------------------------------------------------------------
// Monitoring
// ---------------------------------------------------------------------------

const rng = mulberry32(4096);

const ratingTargets: Record<string, [number, number]> = {
  preppath: [4.2, 4.1],
  exampilot: [4.1, 3.9],
  notewise: [3.7, 3.8],
  focusforge: [4.3, 4.4],
  studygrid: [4.2, 4.2],
};

const volumeTargets: Record<string, [number, number]> = {
  preppath: [10, 16],
  exampilot: [8, 12],
  notewise: [6, 9],
  focusforge: [9, 13],
  studygrid: [7, 10],
};

// Monthly price of the cheapest paid plan in ₹ (ExamPilot's annual plan shown per month).
const priceSteps: Record<string, { initial: number; changes: { week: number; value: number }[] }> = {
  preppath: { initial: 179, changes: [{ week: 7, value: 199 }] },
  exampilot: { initial: 208, changes: [] },
  notewise: { initial: 249, changes: [{ week: 4, value: 299 }] },
  focusforge: { initial: 99, changes: [] },
  studygrid: { initial: 149, changes: [{ week: 10, value: 129 }] },
};

const events: MonitoringEvent[] = [
  {
    id: "ss-ev-1",
    startupId: ID,
    competitorId: "preppath",
    type: "hiring",
    title: "PrepPath is hiring for \"adaptive rescheduling\"",
    detail: "A senior ML engineer role mentions automatic rescheduling for missed study sessions, the second-ranked gap you are targeting.",
    severity: "high",
    at: isoAgo(0, 20),
    sourceUrl: sources.jobs("PrepPath ML engineer adaptive rescheduling"),
  },
  {
    id: "ss-ev-2",
    startupId: ID,
    competitorId: "exampilot",
    type: "rating_change",
    title: "ExamPilot fell to 3.9★",
    detail: "Down from 4.1 over 12 weeks; 10.1% of its reviews mention sync and login bugs.",
    severity: "medium",
    at: isoAgo(2, 3),
    sourceUrl: sources.playStore("ExamPilot engineering exam prep"),
  },
  {
    id: "ss-ev-3",
    startupId: ID,
    competitorId: "studygrid",
    type: "price_change",
    title: "StudyGrid cut Premium to ₹129/month",
    detail: "Down from ₹149 (−13.4%) ahead of the semester exam season.",
    severity: "low",
    at: isoAgo(7, 5),
    sourceUrl: sources.playStore("StudyGrid planner"),
  },
  {
    id: "ss-ev-4",
    startupId: ID,
    competitorId: "unitwise",
    type: "new_competitor",
    title: "New app: Unitwise (VTU notes + planner)",
    detail: "Launched on the Play Store with 1,200 downloads in 3 weeks. Covers VTU only; no rescheduling yet.",
    severity: "high",
    at: isoAgo(9, 2),
    sourceUrl: sources.playStore("Unitwise VTU notes planner"),
  },
  {
    id: "ss-ev-5",
    startupId: ID,
    competitorId: "preppath",
    type: "complaint_spike",
    title: "\"Rigid schedules\" complaints up +1.4 pts",
    detail: "Now 19.6% of all neighbour reviews (95% CI 16.6–22.9%); PrepPath has the highest share at 24.7%.",
    severity: "high",
    at: isoAgo(11, 1),
    sourceUrl: sources.playStore("PrepPath study planner"),
  },
  {
    id: "ss-ev-6",
    startupId: ID,
    competitorId: "preppath",
    type: "price_change",
    title: "PrepPath raised Pro to ₹199/month",
    detail: "Up from ₹179 (+11.2%).",
    severity: "low",
    at: isoAgo(28, 4),
    sourceUrl: sources.playStore("PrepPath study planner"),
  },
  {
    id: "ss-ev-7",
    startupId: ID,
    competitorId: "focusforge",
    type: "news",
    title: "FocusForge crosses 1 million downloads",
    detail: "Growth credited to group study rooms and offline mode.",
    severity: "medium",
    at: isoAgo(33, 7),
    sourceUrl: sources.news("FocusForge 1 million downloads study app"),
  },
  {
    id: "ss-ev-8",
    startupId: ID,
    competitorId: "notewise",
    type: "price_change",
    title: "Notewise raised Plus to ₹299/month",
    detail: "Up from ₹249 (+20.1%). Pricing is now 17.6% of its reviews.",
    severity: "medium",
    at: isoAgo(49, 6),
    sourceUrl: sources.playStore("Notewise AI notes planner"),
  },
];

const monitoring: MonitoringData = {
  startupId: ID,
  watched: competitors.map((c, i) => ({
    competitorId: c.id,
    name: c.name,
    frequency: i < 2 ? "daily" : "weekly",
    lastCheckedAt: isoAgo(0, 2 + i),
  })),
  events,
  ratingSeries: competitors.map((c) => ({
    competitorId: c.id,
    name: c.name,
    points: trendSeries(rng, WEEKS, ratingTargets[c.id][0], ratingTargets[c.id][1], 0.04, 2, 1, 5),
  })),
  reviewVolumeSeries: competitors.map((c) => ({
    competitorId: c.id,
    name: c.name,
    points: trendSeries(rng, WEEKS, volumeTargets[c.id][0], volumeTargets[c.id][1], 2, 0, 0),
  })),
  complaintShareSeries: [
    { clusterId: "rigid-schedules", label: "Rigid schedules", points: trendSeries(rng, WEEKS, 0.182, 118 / TOTAL_REVIEWS, 0.005, 4, 0) },
    { clusterId: "syllabus-mismatch", label: "Syllabus mismatch", points: trendSeries(rng, WEEKS, 0.153, 97 / TOTAL_REVIEWS, 0.004, 4, 0) },
    { clusterId: "motivation", label: "Motivation drops after week 2", points: trendSeries(rng, WEEKS, 0.135, 83 / TOTAL_REVIEWS, 0.004, 4, 0) },
  ],
  priceSeries: competitors.map((c) => ({
    competitorId: c.id,
    name: c.name,
    points: stepSeries(WEEKS, priceSteps[c.id].initial, priceSteps[c.id].changes),
  })),
  meta: { cached: false, fetchedAt: isoAgo(0, 0.5), latencyMs: 3800, serpCalls: 7 },
};

// ---------------------------------------------------------------------------
// Risks
// ---------------------------------------------------------------------------

const risks: Risk[] = [
  {
    id: "ss-risk-1",
    category: "market",
    level: "high",
    title: "Students may not pay for a planner",
    evidence: [
      "4 of 5 neighbours have a free tier",
      "11.8% of neighbour reviews complain about subscription pricing",
    ],
    evidenceUrls: [sources.playStore("ExamPilot engineering exam prep"), sources.playStore("Notewise AI notes planner")],
    killCriterion: "If fewer than 8% of pilot users buy the ₹299 semester pass within 2 weeks of exams, switch to a college-licensing model.",
  },
  {
    id: "ss-risk-2",
    category: "competition",
    level: "high",
    title: "PrepPath is building adaptive rescheduling",
    evidence: [
      "Open ML engineer role mentions automatic rescheduling",
      "PrepPath is the closest neighbour (81% similarity) with 4 open roles",
    ],
    evidenceUrls: [sources.jobs("PrepPath ML engineer adaptive rescheduling")],
    killCriterion: "If PrepPath ships rescheduling with university syllabi before your pilot ends, niche down to one university and win it outright.",
  },
  {
    id: "ss-risk-3",
    category: "copy",
    level: "medium",
    title: "Syllabus data is public and easy to copy",
    evidence: [
      "University schemes are published as PDFs",
      "Unitwise launched a VTU-only planner in 3 weeks",
    ],
    evidenceUrls: [sources.playStore("Unitwise VTU notes planner"), sources.search("VTU CSE scheme syllabus pdf")],
    killCriterion: "If a competitor matches your syllabus coverage within 60 days of launch, invest in the rescheduler and study groups as the moat instead.",
  },
  {
    id: "ss-risk-4",
    category: "regulatory",
    level: "medium",
    title: "Student data needs consent under the DPDP Act 2023",
    evidence: [
      "Some first-year students are under 18, which requires verifiable parental consent",
      "Study-habit data is personal data under the Act",
    ],
    evidenceUrls: [sources.search("Digital Personal Data Protection Act 2023 children verifiable parental consent")],
    killCriterion: "If parental consent cannot be verified cheaply, restrict sign-ups to students aged 18+ for launch.",
  },
];

const riskReport: RiskReport = {
  startupId: ID,
  risks,
  meta: { cached: true, fetchedAt: isoAgo(0, 5), latencyMs: 270, serpCalls: 0 },
};

export const studySprint: MockBundle = {
  startup: studySprintStartup,
  report,
  monitoring,
  risks: riskReport,
  healthScore: 61,
};
