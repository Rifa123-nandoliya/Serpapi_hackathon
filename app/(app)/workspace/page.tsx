import type { Metadata } from "next";

export const metadata: Metadata = { title: "Workspace" };

export default function WorkspacePage() {
  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Workspace</h1>
    </section>
  );
}
