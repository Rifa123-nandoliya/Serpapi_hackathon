import type { Metadata } from "next";

export const metadata: Metadata = { title: { absolute: "GapScope — Competitor intelligence you can prove" } };

export default function HomePage() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pt-32 pb-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">Home</h1>
    </section>
  );
}
