/**
 * Sanity checks for lib/stats.ts and the mock data.
 * Run: npx tsx scripts/check-stats.ts
 */
import { getMockBundle, MOCK_BUNDLES } from "../lib/mock";
import { clusterPoints } from "../lib/mock/utils";
import { clusterStats, formatPct, impactScore, wilsonCI } from "../lib/stats";

let failures = 0;

function check(label: string, ok: boolean, detail: string): void {
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${detail}`);
  if (!ok) failures += 1;
}

const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

// 1. The spec's sanity check: wilsonCI(41, 1240) ≈ { low: 0.0245, high: 0.0446 }.
const ci = wilsonCI(41, 1240);
console.log(`wilsonCI(41, 1240) = { low: ${ci.low.toFixed(5)}, high: ${ci.high.toFixed(5)} }`);
console.log(`                   = ${(ci.low * 100).toFixed(3)}% – ${(ci.high * 100).toFixed(3)}%  (spec: ≈ 2.45%–4.46%)\n`);
check("wilsonCI(41, 1240)", near(ci.low, 0.0245, 0.0001) && near(ci.high, 0.0446, 0.0001), "within ±0.01 pts of 2.45%–4.46%");

// 2. Edge cases and helpers.
const zero = wilsonCI(0, 0);
check("wilsonCI(0, 0)", zero.low === 0 && zero.high === 0, JSON.stringify(zero));
const none = wilsonCI(0, 100);
check("wilsonCI(0, 100) stays in [0, 1]", none.low === 0 && none.high > 0 && none.high < 0.05, `${formatPct(none.low, 2)} – ${formatPct(none.high, 2)}`);
check("formatPct(41 / 1240)", formatPct(41 / 1240) === "3.3%", formatPct(41 / 1240));
check("impactScore(0.033, 2.6)", near(impactScore(0.033, 2.6), 7.92, 1e-9), impactScore(0.033, 2.6).toFixed(2));

// 3. Mock data matches the spec.
const brew = getMockBundle("brew-and-stay");
const study = getMockBundle("studysprint");
check("Brew & Stay: 1,240 reviews, 5 competitors", brew?.report.totalReviews === 1240 && brew.report.competitors.length === 5, `${brew?.report.totalReviews} reviews`);
check("Brew & Stay reviewCounts sum to total", brew?.report.competitors.reduce((s, c) => s + c.reviewCount, 0) === 1240, "");
check("StudySprint: 603 reviews, nearest-neighbour mode", study?.report.totalReviews === 603 && study.startup.nearestNeighbourMode === true, "");
check(
  "StudySprint neighbours have similarity 62–81 and a type",
  study?.report.competitors.every((c) => c.similarity !== undefined && c.similarity >= 62 && c.similarity <= 81 && c.neighbourType !== undefined) ?? false,
  study?.report.competitors.map((c) => `${c.name} ${c.similarity}%`).join(", ") ?? "",
);
check("StudySprint reviewCounts sum to total", study?.report.competitors.reduce((s, c) => s + c.reviewCount, 0) === 603, "");

for (const bundle of MOCK_BUNDLES) {
  const { report } = bundle;
  const clusterIds = new Set(report.clusters.map((c) => c.id));
  check(`${bundle.startup.name}: 7 clusters`, report.clusters.length === 7, "");
  check(`${bundle.startup.name}: every gap points to a cluster`, report.gaps.every((g) => clusterIds.has(g.clusterId)), "");
  check(
    `${bundle.startup.name}: at least one low-confidence cluster (n < 30)`,
    report.clusters.some((c) => clusterStats(c).lowConfidence),
    report.clusters.filter((c) => clusterStats(c).lowConfidence).map((c) => `${c.label} (${c.count})`).join(", "),
  );
  check(`${bundle.startup.name}: gaps sorted by Opportunity Score`, report.gaps.every((g, i, a) => i === 0 || a[i - 1].opportunityScore >= g.opportunityScore), "");
}

const late = brew?.report.clusters.find((c) => c.id === "late-closing");
check("\"Late closing hours\" = 41 reviews, 3.3%", late?.count === 41 && formatPct(clusterStats(late).share) === "3.3%", "");

// Numbers quoted inside mock text must agree with lib/stats.ts.
const rigid = study?.report.clusters.find((c) => c.id === "rigid-schedules");
const rigidCi = rigid ? clusterStats(rigid).ci : { low: 0, high: 0 };
check("Rigid schedules CI quoted as 16.6–22.9%", formatPct(rigidCi.low) === "16.6%" && formatPct(rigidCi.high) === "22.9%", `${formatPct(rigidCi.low)} – ${formatPct(rigidCi.high)}`);
check("Late closing CI quoted as 2.4–4.5%", formatPct(ci.low) === "2.4%" && formatPct(ci.high) === "4.5%", `${formatPct(ci.low)} – ${formatPct(ci.high)}`);

// 4. Seeded cluster points are deterministic (same on server and client).
const a = clusterPoints(1000, "late-closing", 41, { x: 7, y: 6 }, 1.3);
const b = clusterPoints(1000, "late-closing", 41, { x: 7, y: 6 }, 1.3);
check("Seeded cluster points are identical across runs", JSON.stringify(a) === JSON.stringify(b), `${a.length} points, first = (${a[0].x}, ${a[0].y})`);
check("Mock cluster points match a fresh generation", JSON.stringify(late?.points) === JSON.stringify(a), "");

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
