"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  before: string;
  highlight: string;
  after?: string;
  subtitle?: string;
  align?: "center" | "left";
  as?: "h1" | "h2";
  /** Heading scale for h2 (the reference varies: stats ~40px, default 48px, features ~60px). */
  size?: "sm" | "md" | "lg";
  /** id for the heading element, for aria-labelledby on the section. */
  id?: string;
  className?: string;
};

export function SectionHeading({
  before,
  highlight,
  after,
  subtitle,
  align = "center",
  as = "h2",
  size = "md",
  id,
  className,
}: SectionHeadingProps) {
  const Heading = as;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={cn(align === "center" ? "mx-auto text-center" : "text-left", className)}
    >
      <Heading
        id={id}
        className={cn(
          "font-bold tracking-tight text-balance text-foreground",
          as === "h1"
            ? "text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
            : size === "lg"
              ? "text-4xl leading-[1.1] sm:text-5xl lg:text-6xl"
              : size === "sm"
                ? "text-3xl leading-tight sm:text-4xl lg:text-[2.5rem]"
                : "text-3xl leading-tight sm:text-4xl lg:text-5xl",
        )}
      >
        {before} <span className="text-gradient-brand">{highlight}</span>
        {after ? (/^[.,!?;:]/.test(after) ? after : ` ${after}`) : null}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg",
            as === "h1" && "lg:text-xl",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
