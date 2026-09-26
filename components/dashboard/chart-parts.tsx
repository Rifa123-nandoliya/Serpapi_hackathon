"use client";

import { format, parseISO } from "date-fns";

import type { ChartRow } from "@/lib/series";
import { cn } from "@/lib/utils";

/** "2026-09-26" → "26 Sep" (date-only strings format identically on server and client). */
export function shortDate(date: string): string {
  return format(parseISO(date), "d MMM");
}

export const TOOLTIP_STYLE = {
  contentStyle: {
    background: "var(--popover)",
    border: "1px solid var(--border)",
    borderRadius: 12,
    fontSize: 12,
    color: "var(--popover-foreground)",
    boxShadow: "0 8px 24px -12px rgb(0 0 0 / 0.25)",
  },
  labelStyle: { color: "var(--muted-foreground)", marginBottom: 4 },
  itemStyle: { color: "var(--popover-foreground)", padding: 0 },
} as const;

export const AXIS_TICK = { fill: "var(--muted-foreground)", fontSize: 11 } as const;

type ChartPanelProps = {
  title: string;
  subtitle: string;
  className?: string;
  children: React.ReactNode;
  table: { columns: { key: string; label: string }[]; rows: ChartRow[]; format: (value: number) => string };
};

/** A chart card with an accessible "View as table" disclosure holding the same numbers. */
export function ChartPanel({ title, subtitle, className, children, table }: ChartPanelProps) {
  return (
    <section className={cn("min-w-0 rounded-3xl border border-border bg-card p-5 sm:p-6", className)}>
      <h3 className="text-base font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      <div className="mt-4 h-64 w-full sm:h-72" role="img" aria-label={`${title}. The same data is available as a table below.`}>
        {children}
      </div>
      <details className="mt-2 text-sm">
        <summary className="cursor-pointer rounded text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none">
          View as table
        </summary>
        <div className="relative mt-3 max-h-72 overflow-auto">
          <table className="w-full min-w-[480px] text-sm">
            <caption className="sr-only">{title}</caption>
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th scope="col" className="py-2 pr-3 text-left font-medium">Week of</th>
                {table.columns.map((c) => (
                  <th key={c.key} scope="col" className="px-2 py-2 text-right align-bottom font-medium leading-tight">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => (
                <tr key={row.date} className="border-b border-border last:border-0">
                  <th scope="row" className="py-2 pr-3 text-left font-normal whitespace-nowrap text-foreground">
                    {shortDate(row.date)}
                  </th>
                  {table.columns.map((c) => {
                    const v = row[c.key];
                    return (
                      <td key={c.key} className="px-2 py-2 text-right text-foreground tabular-nums">
                        {typeof v === "number" ? table.format(v) : "–"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  );
}

type LegendItem = { key: string; label: string; color: string };

/** Clickable legend shared by several charts; hidden series are removed from every chart. */
export function SeriesLegend({
  items,
  hidden,
  onToggle,
  label,
}: {
  items: LegendItem[];
  hidden: Set<string>;
  onToggle: (key: string) => void;
  label: string;
}) {
  return (
    <ul className="flex flex-wrap gap-2" aria-label={label}>
      {items.map((item) => {
        const off = hidden.has(item.key);
        return (
          <li key={item.key}>
            <button
              type="button"
              aria-pressed={!off}
              onClick={() => onToggle(item.key)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-foreground transition-opacity focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                off && "opacity-50",
              )}
            >
              <span aria-hidden="true" className="h-0.5 w-4 rounded-full" style={{ background: item.color }} />
              {item.label}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
