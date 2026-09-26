import type { Metadata } from "next";

export const metadata: Metadata = { title: "Startup dashboard" };

export default async function StartupDashboardPage({
  params,
}: {
  params: Promise<{ startupId: string }>;
}) {
  const { startupId } = await params;

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-bold tracking-tight text-foreground">Startup dashboard</h1>
      <p className="mt-2 text-neutral-500">Startup: {startupId}</p>
    </main>
  );
}
