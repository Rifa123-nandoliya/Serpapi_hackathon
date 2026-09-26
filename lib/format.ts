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
