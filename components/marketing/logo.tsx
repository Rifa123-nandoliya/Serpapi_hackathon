import Link from "next/link";

import { cn } from "@/lib/utils";

type LogoProps = {
  href?: string | null;
  showWordmark?: boolean;
  className?: string;
};

export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex size-7 shrink-0 items-center justify-center", className)}
    >
      <span className="size-[70%] rotate-45 rounded-[28%] bg-[linear-gradient(135deg,#F7865C_0%,#F05A28_55%,#E0421A_100%)] shadow-[inset_0_1px_1px_rgb(255_255_255/0.45),0_2px_6px_-1px_rgb(240_90_40/0.5)]" />
    </span>
  );
}

export function Logo({ href = "/", showWordmark = true, className }: LogoProps) {
  const content = (
    <>
      <LogoMark />
      {showWordmark && (
        <span className="text-xl font-medium tracking-tight text-foreground">GapScope</span>
      )}
    </>
  );

  const classes = cn(
    "inline-flex items-center gap-2 rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
    className,
  );

  if (href === null) {
    return <span className={classes}>{content}</span>;
  }

  return (
    <Link href={href} className={classes} aria-label="GapScope home">
      {content}
    </Link>
  );
}
