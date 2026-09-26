/**
 * Indian digit grouping without toLocaleString (locale-dependent output can
 * differ between server and client): 2999 → "2,999", 1234567 → "12,34,567".
 */
export function formatIndianNumber(value: number): string {
  const [whole, fraction] = Math.abs(value).toString().split(".");
  const last3 = whole.slice(-3);
  const rest = whole.slice(0, -3);
  const grouped = rest ? `${rest.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${last3}` : last3;
  return `${value < 0 ? "-" : ""}${grouped}${fraction ? `.${fraction}` : ""}`;
}

export function formatInr(value: number): string {
  return `₹${formatIndianNumber(value)}`;
}

/** 1536 → "1.5 KB", 10485760 → "10 MB". */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value >= 10 ? Math.round(value) : Math.round(value * 10) / 10} ${units[unit]}`;
}

/** Compact relative time: "just now", "12m ago", "5h ago", "3d ago". Call only after mount. */
export function formatRelativeShort(iso: string, nowMs: number): string {
  const diff = Math.max(0, nowMs - Date.parse(iso));
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}
