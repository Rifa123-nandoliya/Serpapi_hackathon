import type { Metadata } from "next";

export const metadata: Metadata = { title: "Startup report" };

export default async function StartupReportPage({
  params,
}: {
  params: Promise<{ startupId: string }>;
}) {
  const { startupId } = await params;

  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Startup report</h1>
      <p className="mt-2 text-neutral-500">Startup: {startupId}</p>
    </section>
  );
}
