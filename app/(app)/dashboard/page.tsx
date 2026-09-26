import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
    </section>
  );
}
