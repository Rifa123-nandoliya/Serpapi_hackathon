"use client";

import { motion } from "motion/react";

import { cn } from "@/lib/utils";

export function BentoGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-6 md:grid-cols-3", className)}>{children}</div>
  );
}

type BentoCardProps = {
  title: string;
  description: string;
  illustration: React.ReactNode;
  className?: string;
  illustrationClassName?: string;
};

export function BentoCard({
  title,
  description,
  illustration,
  className,
  illustrationClassName,
}: BentoCardProps) {
  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300, damping: 24 }}
      className={cn(
        "group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-shadow hover:shadow-float",
        className,
      )}
    >
      <div
        className={cn(
          "relative min-h-64 flex-1 overflow-hidden sm:min-h-72",
          illustrationClassName,
        )}
      >
        {illustration}
      </div>
      <div className="p-6 sm:p-8 sm:pt-6">
        <h3 className="text-xl font-medium tracking-tight text-foreground sm:text-2xl">{title}</h3>
        <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </motion.article>
  );
}
