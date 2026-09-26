import { Suspense } from "react";
import type { Metadata } from "next";

import { ReportSkeleton } from "@/components/report/report-skeleton";
import { StartupReport } from "@/components/report/startup-report";
import { getMockBundle } from "@/lib/mock";

type Props = { params: Promise<{ startupId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { startupId } = await params;
  const name = getMockBundle(startupId)?.startup.name;
  return { title: name ? `${name} report` : "Startup report" };
}

export default async function StartupReportPage({ params }: Props) {
  const { startupId } = await params;
  // StartupReport reads ?tab= with useSearchParams, which needs a Suspense boundary.
  return (
    <Suspense fallback={<ReportSkeleton />}>
      <StartupReport startupId={startupId} />
    </Suspense>
  );
}
