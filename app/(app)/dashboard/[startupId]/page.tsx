import type { Metadata } from "next";

import { StartupDashboard } from "@/components/dashboard/startup-dashboard";
import { getMockBundle } from "@/lib/mock";

type Props = { params: Promise<{ startupId: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { startupId } = await params;
  const name = getMockBundle(startupId)?.startup.name;
  return { title: name ? `${name} dashboard` : "Startup dashboard" };
}

export default async function StartupDashboardPage({ params }: Props) {
  const { startupId } = await params;
  return <StartupDashboard startupId={startupId} />;
}
