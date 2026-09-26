import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add a startup" };

export default function NewStartupPage() {
  return (
    <section>
      <h1 className="text-3xl font-bold tracking-tight text-foreground">Add a startup</h1>
    </section>
  );
}
