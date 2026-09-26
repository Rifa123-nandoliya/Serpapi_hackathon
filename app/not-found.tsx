import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-brand">404</p>
      <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
        Page <span className="text-gradient-brand">not found</span>
      </h1>
      <p className="mt-4 max-w-md text-neutral-500">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/"
        className="bg-primary-gradient mt-8 inline-flex h-10 items-center rounded-lg px-5 text-sm font-medium text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"
      >
        Back to home
      </Link>
    </main>
  );
}
