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
  className?: string;
};

export function SectionHeading({
  before,
  highlight,
  after,
  subtitle,
  align = "center",
  as = "h2",
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
        className={cn(
          "font-bold tracking-tight text-balance text-foreground",
          as === "h1"
            ? "text-5xl leading-[1.05] sm:text-6xl lg:text-7xl"
            : "text-3xl leading-tight sm:text-4xl lg:text-5xl",
        )}
      >
        {before} <span className="text-gradient-brand">{highlight}</span>
        {after ? ` ${after}` : null}
      </Heading>
      {subtitle && (
        <p
          className={cn(
            "mt-4 max-w-2xl text-base text-pretty text-muted-foreground sm:text-lg",
            align === "center" && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
