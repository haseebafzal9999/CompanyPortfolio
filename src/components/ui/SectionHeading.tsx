"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/animations";

interface Props {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeading({ index, eyebrow, title, sub, align = "left", className }: Props) {
  const center = align === "center";
  return (
    <div className={cn("mb-14 md:mb-20", center && "text-center", className)}>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.6, ease: EASE }}
        className={cn("mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-prime-cyan", center && "justify-center")}
      >
        <span className="text-prime-violet">{index}</span>
        <span className="h-px w-10 bg-gradient-to-r from-prime-violet to-prime-cyan" />
        <span>{eyebrow}</span>
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 34 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.05 }}
        className="text-balance text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl"
      >
        {title}
      </motion.h2>
      {sub && (
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
          className={cn("mt-6 max-w-2xl text-base leading-relaxed text-prime-muted md:text-lg", center && "mx-auto")}
        >
          {sub}
        </motion.p>
      )}
    </div>
  );
}
