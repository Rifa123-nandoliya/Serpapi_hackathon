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

const ID = "brew-and-stay";
const TOTAL_REVIEWS = 1240;
const WEEKS = weeklyDates(12);

export const brewAndStayStartup: Startup = {
  id: ID,
  name: "Brew & Stay",
  idea: "A work-friendly specialty café in Andheri West that stays open until 1 am, with comfortable seating, reliable Wi-Fi and a power outlet at every table.",
  category: "Food & beverage",
  location: "Andheri West, Mumbai",
  targetCustomer: "Freelancers, students and late-shift professionals aged 20–35",
  mode: "idea",
  createdAt: isoAgo(21, 3),
  status: "monitoring",
  nearestNeighbourMode: false,
};

// ---------------------------------------------------------------------------
// Competitors
// ---------------------------------------------------------------------------

const FEATURES = [
  "Open after 11 pm",
  "Power outlet at every table",
  "Reliable Wi-Fi",
  "Work-friendly seating",
  "Table booking",
  "Specialty coffee",
  "Delivery",
  "Loyalty programme",
];

const RADAR_AXES = ["Coffee quality", "Ambience", "Speed", "Value", "Work-friendliness", "Late hours"];

function features(on: string[]): Record<string, boolean> {
  return Object.fromEntries(FEATURES.map((f) => [f, on.includes(f)]));
}

const competitors: Competitor[] = [
  {
    id: "bean-theory",
    name: "Bean Theory Andheri",
    rating: 4.3,
    reviewCount: 312,
    priceBand: "₹600–800 for two",
    openRoles: 3,
    latestNews: "Hiring night-shift baristas for its Andheri West outlet",
    features: features(["Reliable Wi-Fi", "Specialty coffee", "Delivery", "Loyalty programme", "Table booking"]),
    radarScores: { "Coffee quality": 86, Ambience: 78, Speed: 61, Value: 58, "Work-friendliness": 55, "Late hours": 22 },
    sourceUrl: sources.maps("Bean Theory Andheri West Mumbai"),
  },
  {
    id: "daily-grind",
    name: "The Daily Grind Lokhandwala",
    rating: 4.2,
    reviewCount: 276,
    priceBand: "₹500–700 for two",
    openRoles: 1,
    latestNews: "Raised a seed round to open four more Mumbai outlets",
    features: features(["Reliable Wi-Fi", "Work-friendly seating", "Delivery"]),
    radarScores: { "Coffee quality": 72, Ambience: 70, Speed: 74, Value: 71, "Work-friendliness": 68, "Late hours": 30 },
    sourceUrl: sources.maps("The Daily Grind Lokhandwala Mumbai"),
  },
  {
    id: "brewhaus",
    name: "Brewhaus Versova",
    rating: 4.4,
    reviewCount: 248,
    priceBand: "₹800–1,100 for two",
    openRoles: 5,
    latestNews: "Raised cold brew prices by ₹20 across the menu",
    features: features(["Specialty coffee", "Table booking", "Loyalty programme"]),
    radarScores: { "Coffee quality": 91, Ambience: 88, Speed: 52, Value: 41, "Work-friendliness": 38, "Late hours": 35 },
    sourceUrl: sources.maps("Brewhaus Versova Mumbai"),
  },
  {
    id: "mocha-point",
    name: "Café Mocha Point",
    rating: 3.8,
    reviewCount: 221,
    priceBand: "₹400–600 for two",
    openRoles: 0,
    latestNews: "Rating fell to 3.8 after complaints about slow service",
    features: features(["Delivery", "Reliable Wi-Fi"]),
    radarScores: { "Coffee quality": 58, Ambience: 55, Speed: 44, Value: 76, "Work-friendliness": 50, "Late hours": 40 },
    sourceUrl: sources.maps("Cafe Mocha Point Andheri Mumbai"),
  },
  {
    id: "chai-chapter",
    name: "Chai & Chapter",
    rating: 4.2,
    reviewCount: 183,
    priceBand: "₹300–500 for two",
    openRoles: 2,
    features: features(["Work-friendly seating", "Power outlet at every table", "Loyalty programme"]),
    radarScores: { "Coffee quality": 55, Ambience: 81, Speed: 69, Value: 84, "Work-friendliness": 79, "Late hours": 18 },
    sourceUrl: sources.maps("Chai and Chapter Andheri Mumbai"),
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
    id: "late-closing",
    label: "Late closing hours",
    count: 41,
    avgRating: 2.6,
    trendDelta: 0.009,
    centre: { x: 7, y: 6 },
    spread: 1.3,
    byCompetitor: [
      { competitorId: "bean-theory", share: 0.038 },
      { competitorId: "daily-grind", share: 0.029 },
      { competitorId: "brewhaus", share: 0.048 },
      { competitorId: "mocha-point", share: 0.018 },
      { competitorId: "chai-chapter", share: 0.027 },
    ],
    samples: [
      { text: "Wish they stayed open past 11. Got asked to leave right when I was getting into my work.", rating: 3, competitorId: "bean-theory", sourceUrl: sources.maps("Bean Theory Andheri West Mumbai") },
      { text: "Great coffee but closes at 10:30 on weekdays. Nowhere to go after that in Versova.", rating: 2, competitorId: "brewhaus", sourceUrl: sources.maps("Brewhaus Versova Mumbai") },
      { text: "Night shift people like me have zero options. Kitchen shuts at 10.", rating: 2, competitorId: "daily-grind", sourceUrl: sources.maps("The Daily Grind Lokhandwala Mumbai") },
    ],
  },
  {
    id: "seating",
    label: "Seating comfort",
    count: 139,
    avgRating: 2.9,
    trendDelta: 0.004,
    centre: { x: -6, y: 5 },
    spread: 1.8,
    byCompetitor: [
      { competitorId: "bean-theory", share: 0.121 },
      { competitorId: "daily-grind", share: 0.094 },
      { competitorId: "brewhaus", share: 0.157 },
      { competitorId: "mocha-point", share: 0.113 },
      { competitorId: "chai-chapter", share: 0.066 },
    ],
    samples: [
      { text: "Chairs are pretty but after an hour my back hurts. Not built for working.", rating: 3, competitorId: "brewhaus", sourceUrl: sources.maps("Brewhaus Versova Mumbai") },
      { text: "Tiny tables, can barely fit a laptop and a cup.", rating: 2, competitorId: "bean-theory", sourceUrl: sources.maps("Bean Theory Andheri West Mumbai") },
      { text: "Stools everywhere, only two proper sofas and they're always taken.", rating: 3, competitorId: "mocha-point", sourceUrl: sources.maps("Cafe Mocha Point Andheri Mumbai") },
    ],
  },
  {
    id: "wait-times",
    label: "Wait times",
    count: 186,
    avgRating: 2.7,
    trendDelta: -0.006,
    centre: { x: -5, y: -6 },
    spread: 2,
    byCompetitor: [
      { competitorId: "bean-theory", share: 0.141 },
      { competitorId: "daily-grind", share: 0.098 },
      { competitorId: "brewhaus", share: 0.169 },
      { competitorId: "mocha-point", share: 0.235 },
      { competitorId: "chai-chapter", share: 0.093 },
    ],
    samples: [
      { text: "Waited 25 minutes for a cold coffee on a Saturday. Staff looked overwhelmed.", rating: 2, competitorId: "mocha-point", sourceUrl: sources.maps("Cafe Mocha Point Andheri Mumbai") },
      { text: "Order at the counter, then wait forever. No buzzer, no updates.", rating: 3, competitorId: "brewhaus", sourceUrl: sources.maps("Brewhaus Versova Mumbai") },
      { text: "Lunch rush is brutal, 20 min for a sandwich.", rating: 3, competitorId: "bean-theory", sourceUrl: sources.maps("Bean Theory Andheri West Mumbai") },
    ],
  },
  {
    id: "pricing",
    label: "Pricing",
    count: 97,
    avgRating: 3.1,
    trendDelta: 0.002,
    centre: { x: 6, y: -5 },
    spread: 1.6,
    byCompetitor: [
      { competitorId: "bean-theory", share: 0.083 },
      { competitorId: "daily-grind", share: 0.058 },
      { competitorId: "brewhaus", share: 0.137 },
      { competitorId: "mocha-point", share: 0.045 },
      { competitorId: "chai-chapter", share: 0.049 },
    ],
    samples: [
      { text: "₹280 for a cappuccino is steep when the portion is this small.", rating: 3, competitorId: "brewhaus", sourceUrl: sources.maps("Brewhaus Versova Mumbai") },
      { text: "Prices went up again this month, same quality.", rating: 3, competitorId: "bean-theory", sourceUrl: sources.maps("Bean Theory Andheri West Mumbai") },
      { text: "Good value for students, but add-ons get expensive quickly.", rating: 4, competitorId: "chai-chapter", sourceUrl: sources.maps("Chai and Chapter Andheri Mumbai") },
    ],
  },
  {
    id: "wifi",
    label: "Wi-Fi",
    count: 58,
    avgRating: 2.4,
    trendDelta: 0.011,
    centre: { x: 1, y: 8 },
    spread: 1.4,
    byCompetitor: [
      { competitorId: "bean-theory", share: 0.035 },
      { competitorId: "daily-grind", share: 0.036 },
      { competitorId: "brewhaus", share: 0.069 },
      { competitorId: "mocha-point", share: 0.059 },
      { competitorId: "chai-chapter", share: 0.033 },
    ],
    samples: [
      { text: "Wi-Fi drops every 10 minutes. Had to hotspot from my phone for a client call.", rating: 2, competitorId: "brewhaus", sourceUrl: sources.maps("Brewhaus Versova Mumbai") },
      { text: "Password changes daily and nobody at the counter knows it.", rating: 2, competitorId: "mocha-point", sourceUrl: sources.maps("Cafe Mocha Point Andheri Mumbai") },
      { text: "Speed is fine in the morning, unusable after 6 pm.", rating: 3, competitorId: "daily-grind", sourceUrl: sources.maps("The Daily Grind Lokhandwala Mumbai") },
    ],
  },
  {
    id: "coffee-quality",
    label: "Coffee quality",
    count: 212,
    avgRating: 3.4,
    trendDelta: -0.003,
    centre: { x: 0, y: -1 },
    spread: 2.2,
    byCompetitor: [
      { competitorId: "bean-theory", share: 0.131 },
      { competitorId: "daily-grind", share: 0.163 },
      { competitorId: "brewhaus", share: 0.089 },
      { competitorId: "mocha-point", share: 0.271 },
      { competitorId: "chai-chapter", share: 0.197 },
    ],
    samples: [
      { text: "Espresso tasted burnt twice in a row. Beans seem stale.", rating: 2, competitorId: "mocha-point", sourceUrl: sources.maps("Cafe Mocha Point Andheri Mumbai") },
      { text: "Pour-over is excellent, the rest of the menu is average.", rating: 4, competitorId: "brewhaus", sourceUrl: sources.maps("Brewhaus Versova Mumbai") },
      { text: "Chai is great, coffee is an afterthought here.", rating: 3, competitorId: "chai-chapter", sourceUrl: sources.maps("Chai and Chapter Andheri Mumbai") },
    ],
  },
  {
    id: "staff",
    label: "Staff behaviour",
    count: 24,
    avgRating: 2.2,
    trendDelta: null,
    centre: { x: -9, y: 0 },
    spread: 1.1,
    byCompetitor: [
      { competitorId: "bean-theory", share: 0.016 },
      { competitorId: "daily-grind", share: 0.014 },
      { competitorId: "brewhaus", share: 0.024 },
      { competitorId: "mocha-point", share: 0.032 },
      { competitorId: "chai-chapter", share: 0.011 },
    ],
    samples: [
      { text: "Staff kept hinting we should order more if we wanted to keep the table.", rating: 2, competitorId: "mocha-point", sourceUrl: sources.maps("Cafe Mocha Point Andheri Mumbai") },
      { text: "Manager was rude when I asked for the Wi-Fi password.", rating: 1, competitorId: "brewhaus", sourceUrl: sources.maps("Brewhaus Versova Mumbai") },
      { text: "Friendly team but clearly understaffed on weekends.", rating: 3, competitorId: "bean-theory", sourceUrl: sources.maps("Bean Theory Andheri West Mumbai") },
    ],
  },
];

const clusters: ClusterInsight[] = clusterSeeds.map(({ centre, spread, ...cluster }, index) => ({
  ...cluster,
  total: TOTAL_REVIEWS,
  points: clusterPoints(1000 + index, cluster.id, cluster.count, centre, spread),
}));

// ---------------------------------------------------------------------------
// Gaps & plan
// ---------------------------------------------------------------------------

const gaps: Gap[] = [
  {
    id: "gap-late-hours",
    title: "Stay open until 1 am",
    clusterId: "late-closing",
    opportunityScore: 86,
    complaintShare: 41 / TOTAL_REVIEWS,
    demandScore: 78,
    competitorCoverage: 0,
    summary: "None of the 5 competitors is open after 11 pm, and searches for \"cafe open late Andheri\" rose over the last 12 weeks.",
    evidenceUrls: [sources.trends("cafe open late andheri"), sources.maps("cafe open late Andheri West"), sources.maps("Brewhaus Versova Mumbai")],
  },
  {
    id: "gap-seating",
    title: "Seating designed for 3-hour work sessions",
    clusterId: "seating",
    opportunityScore: 79,
    complaintShare: 139 / TOTAL_REVIEWS,
    demandScore: 64,
    competitorCoverage: 0.2,
    summary: "11.2% of reviews complain about seating; only Chai & Chapter offers work-friendly seating with outlets.",
    evidenceUrls: [sources.maps("Brewhaus Versova Mumbai"), sources.maps("Bean Theory Andheri West Mumbai")],
  },
  {
    id: "gap-wifi",
    title: "Business-grade Wi-Fi with a speed guarantee",
    clusterId: "wifi",
    opportunityScore: 72,
    complaintShare: 58 / TOTAL_REVIEWS,
    demandScore: 70,
    competitorCoverage: 0.4,
    summary: "Wi-Fi complaints have the lowest average rating (2.4★) and are rising fastest (+1.1 pts).",
    evidenceUrls: [sources.maps("Brewhaus Versova Mumbai"), sources.trends("cafe with wifi mumbai")],
  },
  {
    id: "gap-wait",
    title: "Order-ahead and table buzzers",
    clusterId: "wait-times",
    opportunityScore: 61,
    complaintShare: 186 / TOTAL_REVIEWS,
    demandScore: 55,
    competitorCoverage: 0.6,
    summary: "Wait times are the second-largest cluster (15%), but competitors are already improving (−0.6 pts).",
    evidenceUrls: [sources.maps("Cafe Mocha Point Andheri Mumbai"), sources.maps("Brewhaus Versova Mumbai")],
  },
  {
    id: "gap-pricing",
    title: "Transparent work-session pricing",
    clusterId: "pricing",
    opportunityScore: 48,
    complaintShare: 97 / TOTAL_REVIEWS,
    demandScore: 40,
    competitorCoverage: 0.8,
    summary: "Price complaints are concentrated at Brewhaus; most competitors already run loyalty offers.",
    evidenceUrls: [sources.maps("Brewhaus Versova Mumbai"), sources.shopping("cappuccino price mumbai cafe")],
  },
];

const plan: PlanItem[] = [
  { phase: "0-30", title: "Validate late-night demand", detail: "Run a 2-week pop-up from 9 pm to 1 am in a partner space and count walk-ins per hour.", gapId: "gap-late-hours" },
  { phase: "0-30", title: "Lock the location", detail: "Shortlist 3 sites within 800 m of Andheri West metro with late-hours footfall data.", gapId: "gap-late-hours" },
  { phase: "0-30", title: "Check licences for late hours", detail: "Confirm the eating-house licence and shop-timing rules for trading past 11 pm." },
  { phase: "31-60", title: "Fit out for work sessions", detail: "Ergonomic chairs, 70 cm-deep tables and an outlet at every seat.", gapId: "gap-seating" },
  { phase: "31-60", title: "Install business-grade Wi-Fi", detail: "Dual-ISP connection with a posted speed guarantee and a live status board.", gapId: "gap-wifi" },
  { phase: "31-60", title: "Launch order-ahead", detail: "QR ordering at the table with a buzzer when drinks are ready.", gapId: "gap-wait" },
  { phase: "61-90", title: "Soft launch with night passes", detail: "Sell ₹499 \"night desk\" passes that include two drinks and a guaranteed seat.", gapId: "gap-pricing" },
  { phase: "61-90", title: "Seed reviews from the pop-up list", detail: "Invite pop-up regulars to the launch week and ask for reviews that mention late hours." },
  { phase: "61-90", title: "Watch the competition weekly", detail: "Alert if any competitor within 2 km extends hours past 11 pm." },
];

const report: Report = {
  startupId: ID,
  competitors,
  clusters,
  clusterQuality: { k: 7, silhouette: 0.61 },
  gaps,
  plan,
  positioning: "The only café in Andheri West built for 3-hour work sessions that stays open until 1 am.",
  pricingSuggestion: "Keep drinks at ₹180–260 (mid-market) and add a ₹499 night-desk pass after 9 pm with two drinks and a guaranteed seat.",
  mvpFeatures: [
    "Open 8 am – 1 am, seven days a week",
    "Outlet and ergonomic chair at every seat",
    "Dual-ISP Wi-Fi with a posted speed guarantee",
    "QR order-ahead with a ready buzzer",
    "Night-desk pass bookable on WhatsApp",
  ],
  featureList: FEATURES,
  radarAxes: RADAR_AXES,
  totalReviews: TOTAL_REVIEWS,
  meta: {
    overview: { cached: true, fetchedAt: isoAgo(0, 2), latencyMs: 180, serpCalls: 0 },
    competitors: { cached: true, fetchedAt: isoAgo(0, 2), latencyMs: 210, serpCalls: 0 },
    customerVoice: { cached: true, fetchedAt: isoAgo(0, 5), latencyMs: 340, serpCalls: 0 },
    gaps: { cached: false, fetchedAt: isoAgo(0, 1), latencyMs: 3100, serpCalls: 6 },
    plan: { cached: true, fetchedAt: isoAgo(0, 2), latencyMs: 160, serpCalls: 0 },
  },
};

// ---------------------------------------------------------------------------
// Monitoring
// ---------------------------------------------------------------------------

const rng = mulberry32(2024);

const ratingTargets: Record<string, [number, number]> = {
  "bean-theory": [4.4, 4.3],
  "daily-grind": [4.1, 4.2],
  brewhaus: [4.5, 4.4],
  "mocha-point": [4.1, 3.8],
  "chai-chapter": [4.2, 4.2],
};

const volumeTargets: Record<string, [number, number]> = {
  "bean-theory": [24, 30],
  "daily-grind": [21, 25],
  brewhaus: [19, 22],
  "mocha-point": [15, 23],
  "chai-chapter": [13, 16],
};

const priceSteps: Record<string, { initial: number; changes: { week: number; value: number }[] }> = {
  "bean-theory": { initial: 220, changes: [{ week: 9, value: 240 }] },
  "daily-grind": { initial: 180, changes: [] },
  brewhaus: { initial: 260, changes: [{ week: 6, value: 280 }] },
  "mocha-point": { initial: 190, changes: [{ week: 10, value: 170 }] },
  "chai-chapter": { initial: 160, changes: [] },
};

const events: MonitoringEvent[] = [
  {
    id: "bs-ev-1",
    startupId: ID,
    competitorId: "mocha-point",
    type: "rating_change",
    title: "Café Mocha Point dropped to 3.8★",
    detail: "Rating fell from 4.1 to 3.8 over 12 weeks; 23.5% of its reviews now mention wait times.",
    severity: "high",
    at: isoAgo(1, 4),
    sourceUrl: sources.maps("Cafe Mocha Point Andheri Mumbai"),
  },
  {
    id: "bs-ev-2",
    startupId: ID,
    competitorId: "roast-republic",
    type: "new_competitor",
    title: "New café: Roast Republic, Lokhandwala",
    detail: "Opened 1.4 km away with 38 reviews in its first month. Lists hours until 11:30 pm on weekends.",
    severity: "medium",
    at: isoAgo(2, 6),
    sourceUrl: sources.maps("Roast Republic Lokhandwala Mumbai"),
  },
  {
    id: "bs-ev-3",
    startupId: ID,
    competitorId: "brewhaus",
    type: "complaint_spike",
    title: "\"Late closing hours\" complaints up +0.9 pts",
    detail: "Share rose from 2.4% to 3.3% of reviews across all competitors; Brewhaus has the most at 4.8%.",
    severity: "high",
    at: isoAgo(3, 1),
    sourceUrl: sources.maps("Brewhaus Versova Mumbai"),
  },
  {
    id: "bs-ev-4",
    startupId: ID,
    competitorId: "mocha-point",
    type: "price_change",
    title: "Café Mocha Point cut cappuccino to ₹170",
    detail: "Down from ₹190 (−10.5%), likely to win back traffic after the rating drop.",
    severity: "low",
    at: isoAgo(7, 2),
    sourceUrl: sources.maps("Cafe Mocha Point Andheri Mumbai"),
  },
  {
    id: "bs-ev-5",
    startupId: ID,
    competitorId: "bean-theory",
    type: "hiring",
    title: "Bean Theory is hiring night-shift baristas",
    detail: "3 open roles with shifts ending at 1 am. They may be preparing to extend hours: the gap you are targeting.",
    severity: "high",
    at: isoAgo(9, 5),
    sourceUrl: sources.jobs("Bean Theory barista night shift Andheri"),
  },
  {
    id: "bs-ev-6",
    startupId: ID,
    competitorId: "bean-theory",
    type: "price_change",
    title: "Bean Theory raised cappuccino to ₹240",
    detail: "Up from ₹220 (+9.1%). Pricing complaints at Bean Theory are 8.3% of its reviews.",
    severity: "medium",
    at: isoAgo(14, 3),
    sourceUrl: sources.maps("Bean Theory Andheri West Mumbai"),
  },
  {
    id: "bs-ev-7",
    startupId: ID,
    competitorId: "daily-grind",
    type: "news",
    title: "The Daily Grind raises a seed round",
    detail: "Plans four more Mumbai outlets in the next 12 months, starting with Andheri East.",
    severity: "medium",
    at: isoAgo(20, 8),
    sourceUrl: sources.news("The Daily Grind cafe Mumbai seed funding"),
  },
  {
    id: "bs-ev-8",
    startupId: ID,
    competitorId: "brewhaus",
    type: "price_change",
    title: "Brewhaus raised cappuccino to ₹280",
    detail: "Up from ₹260 (+7.7%), part of a menu-wide increase.",
    severity: "low",
    at: isoAgo(35, 4),
    sourceUrl: sources.maps("Brewhaus Versova Mumbai"),
  },
];

const monitoring: MonitoringData = {
  startupId: ID,
  watched: competitors.map((c, i) => ({
    competitorId: c.id,
    name: c.name,
    frequency: i < 3 ? "daily" : "weekly",
    lastCheckedAt: isoAgo(0, 1 + i),
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
    points: trendSeries(rng, WEEKS, volumeTargets[c.id][0], volumeTargets[c.id][1], 3, 0, 0),
  })),
  complaintShareSeries: [
    { clusterId: "late-closing", label: "Late closing hours", points: trendSeries(rng, WEEKS, 0.024, 41 / TOTAL_REVIEWS, 0.0015, 4, 0) },
    { clusterId: "seating", label: "Seating comfort", points: trendSeries(rng, WEEKS, 0.105, 139 / TOTAL_REVIEWS, 0.004, 4, 0) },
    { clusterId: "wait-times", label: "Wait times", points: trendSeries(rng, WEEKS, 0.156, 186 / TOTAL_REVIEWS, 0.005, 4, 0) },
  ],
  priceSeries: competitors.map((c) => ({
    competitorId: c.id,
    name: c.name,
    points: stepSeries(WEEKS, priceSteps[c.id].initial, priceSteps[c.id].changes),
  })),
  meta: { cached: true, fetchedAt: isoAgo(0, 1), latencyMs: 240, serpCalls: 0 },
};

// ---------------------------------------------------------------------------
// Risks
// ---------------------------------------------------------------------------

const risks: Risk[] = [
  {
    id: "bs-risk-1",
    category: "competition",
    level: "high",
    title: "Bean Theory may extend its hours first",
    evidence: [
      "3 open night-shift barista roles with shifts ending at 1 am",
      "Bean Theory is the highest-volume competitor (312 of 1,240 reviews)",
    ],
    evidenceUrls: [sources.jobs("Bean Theory barista night shift Andheri"), sources.maps("Bean Theory Andheri West Mumbai")],
    killCriterion: "If 2 or more competitors within 2 km trade past 11 pm before your launch, drop late hours as the headline and lead with seating + Wi-Fi.",
  },
  {
    id: "bs-risk-2",
    category: "market",
    level: "medium",
    title: "Late-evening demand may be seasonal",
    evidence: [
      "Searches for \"cafe open late Andheri\" dip during the monsoon months",
      "Only 3.3% of reviews (95% CI 2.4–4.5%) mention closing hours",
    ],
    evidenceUrls: [sources.trends("cafe open late andheri")],
    killCriterion: "If the pop-up averages fewer than 12 paying guests per hour after 10 pm over two weeks, do not commit to 1 am hours.",
  },
  {
    id: "bs-risk-3",
    category: "copy",
    level: "medium",
    title: "The concept is easy to copy",
    evidence: [
      "Longer hours, better chairs and faster Wi-Fi need no special IP",
      "The Daily Grind just raised money to open 4 more outlets",
    ],
    evidenceUrls: [sources.news("The Daily Grind cafe Mumbai seed funding")],
    killCriterion: "If a funded chain announces a late-night work café in Andheri before your fit-out starts, re-scope to a membership model.",
  },
  {
    id: "bs-risk-4",
    category: "regulatory",
    level: "medium",
    title: "Late-hours trading needs the right licences",
    evidence: [
      "Trading past 11 pm may need an updated eating-house licence and police permissions",
      "Neighbouring residential buildings can file noise complaints",
    ],
    evidenceUrls: [sources.search("Mumbai eating house licence late night cafe timings")],
    killCriterion: "If the licence for trading past midnight cannot be secured within 45 days, cap hours at 12 am and re-run the numbers.",
  },
  {
    id: "bs-risk-5",
    category: "market",
    level: "low",
    title: "High rents in Andheri West",
    evidence: ["Commercial rents near the metro squeeze margins for long, low-spend sessions"],
    evidenceUrls: [sources.search("Andheri West commercial rent per sq ft cafe")],
    killCriterion: "If rent exceeds 18% of projected revenue at the chosen site, pick the next site on the shortlist.",
  },
];

const riskReport: RiskReport = {
  startupId: ID,
  risks,
  meta: { cached: true, fetchedAt: isoAgo(0, 3), latencyMs: 290, serpCalls: 0 },
};

export const brewAndStay: MockBundle = {
  startup: brewAndStayStartup,
  report,
  monitoring,
  risks: riskReport,
  healthScore: 74,
};
