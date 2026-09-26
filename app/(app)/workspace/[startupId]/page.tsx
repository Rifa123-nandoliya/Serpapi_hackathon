import type { Metadata } from "next";

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
  return <StartupReport startupId={startupId} />;
}
