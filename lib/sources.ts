/** Human label for a source URL, e.g. "Google Maps" or "Play Store". */
export function sourceLabel(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    if (host === "play.google.com") return "Play Store";
    if (host === "news.google.com") return "Google News";
    if (host === "trends.google.com") return "Google Trends";
    if (u.pathname.startsWith("/maps")) return "Google Maps";
    if (u.searchParams.get("ibp")?.includes("jobs")) return "Google Jobs";
    if (u.searchParams.get("tbm") === "shop") return "Google Shopping";
    if (u.searchParams.get("q")?.includes("site:apps.apple.com")) return "App Store";
    if (host === "google.com") return "Google Search";
    return host;
  } catch {
    return "Source";
  }
}
