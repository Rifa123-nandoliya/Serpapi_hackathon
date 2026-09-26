# GapScope — Project Spec (read this before every task)

GapScope is a SaaS web app built for the SerpApi hackathon. It helps founders analyse competitors before building a startup:
1. Finds competitors, or "nearest neighbours" (similar products) when an idea has no direct competitors.
2. Clusters real customer reviews and reports every gap as a statistic, never as vague text.
3. Ranks gaps with an Opportunity Score and generates an execution plan, with every claim linked to its source.
4. Monitors competitors live (ratings, prices, hiring, news, new competitors) and raises alerts.
5. Shows a Risk Radar (market, competition, copy, regulatory) with evidence and kill criteria.

This repo is the FRONTEND ONLY. There is no backend yet: all data comes from typed mock data behind `lib/api.ts`.

---

## 1. Tech stack (use exactly these; do not add other UI libraries)

- Next.js 15 (App Router, `src/` directory NOT used), React 19, TypeScript (strict)
- Tailwind CSS v4 (config lives in `app/globals.css` via `@theme`; there is no `tailwind.config.js`)
- shadcn/ui (components in `components/ui/`)
- `motion` package for animation, imported as `import { motion } from "motion/react"`
- `recharts@^3` for charts
- `lucide-react` for icons
- `@tanstack/react-query@^5` for data fetching
- `zustand@^5` (with `persist`) for workspace state
- `zod` for form validation
- `date-fns` for date formatting
- Font: Inter via `next/font/google`

Build Aceternity-style effects (bento grid, floating navbar, rings, cursor tags, dotted map) yourself with Tailwind + motion. Do NOT install packages from external component registries.

---

## 2. Design system (match the screenshots in `design-reference/`)

Ignore the "Preview / Code / All Access" toolbar and the blue chat bubble in the screenshots; they belong to the template preview site, not the design.

**Overall feel:** light, minimal, lots of white space, soft shadows, rounded cards, subtle micro-interactions. Light mode is the primary design. Add a dark mode toggle, but light mode must look exactly like the reference.

**Colours**
- Page background: white `#FFFFFF`
- Card background: `#FAFAFA` with a 1px border `#EDEDED` (neutral-200) and rounded-2xl/3xl corners
- Headings: near-black `#171717`; body text: neutral-500/600
- Brand accent: orange. Headline highlight words use a gradient text from `#F05A28` to `#F4845F` (sample the exact tone from `01-hero.png`)
- Primary button: dark gradient (`#3F3F3F` → `#0A0A0A`), white text, rounded-lg, subtle inner top highlight and soft shadow (see "Get Started" in `01-hero.png`)
- Secondary button: white, 1px neutral border, dark text (see "Login")
- Semantic colours for data: orange = opportunity/highlight, amber = medium risk, red = high risk, neutral grey = inactive
- Check-list bullets: small filled orange circle with white check (see `07-pricing.png`)

**Typography**
- Inter. Headlines: bold/semibold, tight tracking (`tracking-tight`), very large on hero (text-5xl → text-7xl responsive)
- Section headings follow the pattern "Normal words + orange gradient words", e.g. "Features so good you'll **Love us**"
- Subtext: text-base/lg, neutral-500, max-w-2xl, centered in marketing sections

**Key components (build once, reuse everywhere)**
- `Navbar`: at the top of the page it is full width (logo left, links centre, buttons right — `11-navbar-top-state.png`). After scrolling ~80px it animates into a floating, centred, white, rounded-full pill with shadow and the right-side buttons hidden (`03-features-heading.png`). Mobile: hamburger menu with a slide-down sheet.
- `Logo`: orange rounded diamond mark + "GapScope" wordmark.
- `HeroBackground`: soft peach/orange radial gradient at the bottom of the hero with thin, faint concentric arc lines (`01-hero.png`).
- `SectionHeading`: props `{ before: string; highlight: string; after?: string; subtitle?: string }`.
- `BentoGrid` / `BentoCard`: card with an illustration area on top and title + description below (`04-bento-grid.png`).
- `CursorTag`: small dark label with a pointer arrow, like the "Manu"/"Kishore" tags in `04-bento-grid.png`.
- `OrbitRings`: concentric orange gradient rings with small icon chips on them and a centre dot (`05-bento-grid-2.png`).
- `StatCard`: large number + small grey label, bordered card (`02-logos-and-stats.png`).
- `PricingCard`: grey outer frame + white inner card; the middle "popular" card has an orange frame and is taller (`07-pricing.png`).
- `FloatingIconCircle`: white circle with soft shadow containing a dark glossy icon, gently floating (`09-cta.png`).
- `Footer`: light grey background, logo + tagline on the left, link columns on the right (`10-footer.png`).

**Motion rules:** subtle only. Fade/slide-in on first view for section headings, gentle floating for CTA icons, hover lift on cards. Respect `prefers-reduced-motion`.

**App pages (workspace, dashboard)** have no reference screenshots. Use the same design language: white background, `#FAFAFA` bordered cards, orange accents, dark primary buttons, Inter, rounded-2xl, generous spacing. App shell = left sidebar (white, right border) + top bar; content max-w-7xl.

---

## 3. Routes

Marketing (shared `Navbar` + `Footer`), route group `app/(marketing)/`:
- `/` — Home
- `/about` — About us
- `/pricing` — Pricing

App (shared app shell with sidebar), route group `app/(app)/`:
- `/workspace` — grid of the user's startups + "Add startup" button + empty state
- `/workspace/new` — add a startup (two modes, see §6)
- `/workspace/[startupId]` — analysis report + live monitoring feed (tabs, see §6)
- `/dashboard` — overview of ALL startups + system stats card
- `/dashboard/[startupId]` — live monitoring charts + Risk Radar

Also: `app/not-found.tsx` styled in the same design.

Navbar links: Home, About, Pricing, Workspace, Dashboard. Right side: theme toggle + primary button "Try the demo" (links to `/workspace/new`). There is NO login/signup (no auth in this project).

Sidebar (app shell): Workspace, Dashboard, divider, "Your startups" list (each links to `/workspace/[id]`), "Add startup" button at the bottom, link back to Home.

---

## 4. Data layer

- `lib/types.ts` — all types (see §5). No `any`.
- `lib/mock/` — realistic mock data:
  - Startup 1: "Brew & Stay" — café in Andheri, Mumbai. 5 direct competitors. 1,240 reviews. Clusters include "Late closing hours" (41 reviews), "Seating comfort" (139), "Wait times", "Pricing", "Wi-Fi", "Coffee quality", "Staff behaviour".
  - Startup 2: "StudySprint" — AI study planner for Indian engineering students. 0 direct competitors → Nearest-Neighbour Mode with 5 neighbours, each with `similarity` (62–81) and `neighbourType` ("same_problem" | "same_customer" | "same_model"). 603 reviews.
  - Cluster-map points must be generated with a SEEDED deterministic random function (e.g. mulberry32) so server and client render identically. Never call `Math.random()` or `Date.now()` during render.
  - All timestamps are fixed ISO strings.
- `lib/stats.ts`:
  - `wilsonCI(count: number, total: number, z = 1.96): { low: number; high: number }` using
    `p = count/total; denom = 1 + z²/n; centre = (p + z²/(2n)) / denom; margin = z * sqrt(p(1-p)/n + z²/(4n²)) / denom; return { low: centre - margin, high: centre + margin }`. Handle `total === 0`.
  - `impactScore(share: number, avgRating: number) = share * 100 * (5 - avgRating)`
  - `formatPct(x: number, digits = 1)` → "3.3%"
  - Sanity check: `wilsonCI(41, 1240)` ≈ { low: 0.0245, high: 0.0446 }.
- `lib/api.ts` — async functions with a `USE_MOCK = true` flag and a simulated latency of 300–600 ms. Later only this file changes to call the FastAPI backend.
- `lib/queries.ts` — TanStack Query hooks: `useStartups`, `useStartup(id)`, `useReport(id)`, `useMonitoring(id)`, `useRisks(id)`, `useSystemStats()`.
- `lib/store.ts` — Zustand store (persisted to localStorage) for user-added startups and monitoring events added by "Simulate next week". Guard against hydration mismatch (render store-dependent UI only after mount).

---

## 5. Core types (extend as needed, keep names)

```ts
type SectionMeta = { cached: boolean; fetchedAt: string; latencyMs: number; serpCalls: number };

type Startup = {
  id: string; name: string; idea: string; category: string; location: string;
  targetCustomer: string; mode: "idea" | "existing"; createdAt: string;
  status: "analysing" | "ready" | "monitoring";
  nearestNeighbourMode: boolean;
};

type Competitor = {
  id: string; name: string; rating: number; reviewCount: number; priceBand: string;
  openRoles: number; latestNews?: string; similarity?: number;
  neighbourType?: "same_problem" | "same_customer" | "same_model";
  features: Record<string, boolean>;
};

type ClusterInsight = {
  id: string; label: string; count: number; total: number; avgRating: number;
  trendDelta: number | null;               // change in share vs last snapshot, e.g. +0.012
  byCompetitor: { competitorId: string; share: number }[];
  samples: { text: string; rating: number; sourceUrl: string; competitorId: string }[];
  points: { x: number; y: number; reviewId: string }[];
};  // share, CI, impact and lowConfidence (count < 30) are COMPUTED in lib/stats.ts, not stored

type Gap = { id: string; title: string; clusterId: string; opportunityScore: number;
  complaintShare: number; demandScore: number; competitorCoverage: number; evidenceUrls: string[] };

type PlanItem = { phase: "0-30" | "31-60" | "61-90"; title: string; detail: string; gapId?: string };

type MonitoringEvent = { id: string; startupId: string; competitorId: string;
  type: "rating_change" | "price_change" | "hiring" | "news" | "complaint_spike" | "new_competitor";
  title: string; detail: string; severity: "low" | "medium" | "high"; at: string; sourceUrl?: string };

type Risk = { id: string; category: "market" | "competition" | "copy" | "regulatory";
  level: "low" | "medium" | "high"; title: string; evidence: string[]; killCriterion: string };

type Report = { startupId: string; competitors: Competitor[]; clusters: ClusterInsight[];
  clusterQuality: { k: number; silhouette: number }; gaps: Gap[]; plan: PlanItem[];
  positioning: string; pricingSuggestion: string; meta: Record<string, SectionMeta> };
```

---

## 6. Page requirements

**Home `/`** (sections in this order, each mirroring a reference screenshot):
1. Hero (`01-hero.png`): headline "See the gaps your **competitors can't**." (orange gradient on the last words), subtitle "GapScope reads thousands of real reviews, searches, job posts and news stories about your competitors, then turns them into ranked opportunities and a plan you can act on.", buttons "Analyse my idea" (primary → `/workspace/new`) and "See a sample report" (secondary → `/workspace/brew-and-stay`). Below: a product preview card (a mini dashboard mock built in JSX, not an image) peeking out of the gradient.
2. **ChatGPT vs GapScope** (directly below the hero): heading "Same question. **Different answer.**". Two tabs: "Café in Andheri" and "Idea with no competitors". Shows the prompt, then two columns: ChatGPT (muted, ✗ icons, vague lines) vs GapScope (highlighted card with orange border, ✓ icons, statistical lines). Label: "Sample output with illustrative numbers."
3. Data sources strip (like the logo row in `02-logos-and-stats.png`): "Powered by live data from" + text/icon chips: Google Search, Google Maps, Play Store, App Store, Google Trends, Google Jobs, Google News, Google Shopping (use lucide icons + text; no brand logo images).
4. Stats (`02-logos-and-stats.png`): "Evidence with **NO guesswork**" + 4 StatCards: "8 — search engines per report", "100% — claims linked to a source", "Daily — competitor checks", "95% — confidence intervals on every gap".
5. Features bento (`03`, `04`, `05`): heading "Features so good you'll **ship faster**". Cards:
   - "Monitor competitors everywhere" — dotted world map with CursorTags showing competitor names.
   - "Gaps as real numbers" — grey bar chart with one orange bar and a CursorTag "Late closing 3.3%".
   - "Nearest-neighbour mode" — OrbitRings with your startup in the centre and neighbour icons on the rings.
   - "Live alerts" — a chat/notification-style card listing 2–3 alerts.
6. Feature cards row (`06-feature-cards-row.png`), 3 cards: "Execution plan" (mini 30-60-90 card), "Smart caching" (card showing "312 API calls saved" and a cache-hit badge), "Risk Radar" (task-style card with orange "High" badge).
7. How it works: 4 steps — Discover, Cluster, Score, Monitor.
8. Pricing preview (`07-pricing.png` style, 3 cards: Starter, Pro (popular, middle), Incubator) + link "See all plans" → `/pricing`.
9. "Built for founders" section (`08-testimonials.png` layout): left side heading "**Founders** love evidence" + 3 orange check bullets + button; right side floating circular avatars using coloured INITIALS (no photos).
10. CTA (`09-cta.png`): "Know your market **before you build**" with FloatingIconCircles around it using lucide icons for the 8 data sources (Search, MapPin, Smartphone, Star, TrendingUp, Briefcase, Newspaper, ShoppingCart), button "Analyse my idea".
11. Footer (`10-footer.png`): logo, tagline "Competitor intelligence you can prove.", columns Pages (Home, About, Pricing, Workspace, Dashboard), Resources (Sample report, How it works), Legal (Privacy, Terms — link to `#`). Bottom line: "Built for the SerpApi Hackathon".

**About `/about`:** hero with SectionHeading, mission, the problem (founders build without evidence), how GapScope works (4 steps), team section with 4 placeholder members (initial avatars, "Name", "Role"), CTA.

**Pricing `/pricing`:** monthly/yearly toggle (yearly = 2 months free). Four tiers in PricingCard style: Free ₹0 (1 report/month, no monitoring), Starter ₹999/mo (5 reports, 3 competitors watched weekly), Pro ₹2,999/mo — popular, orange frame (unlimited reports, 10 competitors daily, Telegram + email alerts, PDF export), Incubator ₹9,999/mo (20+ startup workspaces, white-label reports). Yearly price = monthly × 10. Then a comparison table and an FAQ accordion (6 questions).

**Workspace `/workspace`:** heading, "Add startup" button, grid of StartupCards (name, one-line idea, mode badge, "Nearest-neighbour" badge if applicable, competitors monitored, open alerts, last updated, links to report and dashboard). Empty state with illustration and CTA.

**Add startup `/workspace/new`:** two tabs:
- "Describe my idea": name, idea (textarea, min 20 chars), category (select), location, target customer, known competitors (tag input, optional).
- "Test an existing startup": startup name, website URL (optional), upload report (drag-and-drop, accepts .pdf/.docx, max 10 MB, show file name and size, remove button), what to compare against (textarea).
- Validate with zod; show inline errors. On submit: add to the Zustand store, show the Pipeline Progress screen (steps: Discover competitors → Collect reviews → Cluster reviews → Score gaps → Build plan → Assess risks → Start monitoring; each shows "Cache hit 0.2s" or "Live fetch 3.1s" as it completes, ~6 s total), then `router.push('/workspace/[newId]')`. New startups reuse the café mock report with their own name.
- A secondary button "Add another startup" resets the form.

**Startup report `/workspace/[startupId]`:** header (name, idea, badges, "Open dashboard" button). Tabs:
- Overview: top 3 gaps, key numbers, Nearest-Neighbour banner when applicable ("No direct competitors found. Analysed 5 nearest neighbours.").
- Competitors: feature matrix (✓/✗), radar chart comparing competitors, table (rating, reviews, price band, open roles, latest news). Neighbours show similarity % and type badge.
- Customer Voice: cluster map (Recharts ScatterChart, one colour per cluster, click a cluster to filter) + cluster quality badge ("7 clusters · silhouette 0.61") + ClusterInsight cards showing: label, share %, "n of N", 95% CI, avg rating, trend (↑/↓ points), impact score, "Low confidence" badge if count < 30, "View sources" (dialog with sample reviews and links). Cross-competitor comparison bars.
- Gaps: leaderboard sorted by Opportunity Score with bars and evidence links.
- Plan: positioning, pricing suggestion, MVP features, 30-60-90 vertical timeline.
- Live monitoring: watched competitors list, change feed (newest first, severity colour, relative time), alert settings (Telegram/email toggles, thresholds — UI only), and a "Simulate next week" button that adds 2–3 new MonitoringEvents to the store with a toast and a highlight animation.
Every section shows a FreshnessBadge from `SectionMeta` ("Cached 2h ago" / "Live fetch") with a Refresh button that refetches.

**Dashboard `/dashboard`:** SystemStats card (cache hit rate 78%, API calls saved 312, avg report time 2.1 s cached vs 48 s cold), and one card per startup (health score 0–100, open alerts, highest risk level, sparkline of average competitor rating), linking to `/dashboard/[id]`.

**Startup dashboard `/dashboard/[startupId]`:** charts — competitor rating over time (line), review volume (bar), complaint share per top cluster over time (line), price changes (step line) — plus Risk Radar: risk cards (category, level badge, evidence list with links, kill criterion), and the latest 5 monitoring events with a link to the full feed.

---

## 7. Coding rules (follow strictly — these prevent common errors)

1. Next.js 15: in `page.tsx` for dynamic routes, `params` is a Promise. Pattern: server `page.tsx` does `const { startupId } = await params;` and renders a client component `<StartupReport startupId={startupId} />`. Never read `params` synchronously.
2. Add `"use client"` to every component that uses hooks, motion, Recharts, Zustand, TanStack Query, event handlers or browser APIs. Keep `layout.tsx` and `page.tsx` as server components where possible.
3. The `QueryClientProvider` and `ThemeProvider` live in a single client `app/providers.tsx`, used in the root layout.
4. No hydration mismatches: no `Math.random()`, `Date.now()`, `new Date()` or `toLocaleString()` during render; format dates with `date-fns` from fixed ISO strings; relative times are computed after mount.
5. No external images or remote URLs in `next/image`. Illustrations are JSX/SVG; avatars are initials.
6. Every `Link` must point to a route that exists. Unknown startup ids show a styled "Startup not found" state, not a crash.
7. TypeScript strict, no `any`, no `@ts-ignore`, no unused imports.
8. Every data view has loading (skeleton), empty and error states.
9. Accessibility: real `<button>` and `<a>`, labels on inputs, visible focus rings, `aria-label` on icon-only buttons.
10. Responsive at 375px, 768px and 1280px+. No horizontal scrolling on the page body.
11. Write complete files. Never leave `// TODO`, `...`, or "rest of the code" placeholders.
12. At the end of EVERY task run, in order: `npx tsc --noEmit`, `npm run lint`, `npm run build`. Fix every error and warning before saying the task is done. Then summarise the files created/changed.
13. Do not rewrite or delete files from earlier steps unless the task requires it; if you must, say why.
