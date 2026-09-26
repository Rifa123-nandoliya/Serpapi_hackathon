import type { Metadata } from "next";

export const metadata: Metadata = { title: "About us" };

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">About us</h1>
    </main>
  );
}
