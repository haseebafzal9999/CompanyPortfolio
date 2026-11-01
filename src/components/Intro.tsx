"use client";

import { useRef } from "react";
import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { EASE } from "@/lib/animations";

const WORDS = "TURN COMPLEX BUSINESS PROCESSES INTO SIMPLE, AUTOMATED SYSTEMS.".split(" ");
const HIGHLIGHT_FROM = WORDS.indexOf("SIMPLE,");

function Word({ word, i, total, progress, hot }: { word: string; i: number; total: number; progress: MotionValue<number>; hot: boolean }) {
  const start = i / total;
  const end = start + 1.4 / total;
  const opacity = useTransform(progress, [start, Math.min(end, 1)], [0.14, 1]);
  const y = useTransform(progress, [start, Math.min(end, 1)], [14, 0]);
  return (
    <motion.span style={{ opacity, y }} className={`mr-[0.25em] inline-block ${hot ? "grad-text" : ""}`}>
      {word}
    </motion.span>
  );
}

export default function Intro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });

  return (
    <section className="relative border-y border-white/[0.06] bg-prime-surface/60 py-24 md:py-40">
      <div className="bg-dots pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,#000,transparent_70%)]" />
      <div className="container relative mx-auto max-w-5xl px-6 text-center md:px-12">
        <div ref={ref}>
          <h2 className="mx-auto mb-12 text-balance font-display text-3xl font-bold leading-[1.15] md:text-5xl lg:text-6xl" aria-label={WORDS.join(" ")}>
            {WORDS.map((w, i) => (
              <Word key={i} word={w} i={i} total={WORDS.length} progress={scrollYProgress} hot={i >= HIGHLIGHT_FROM} />
            ))}
          </h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="mx-auto max-w-3xl text-lg leading-relaxed text-prime-muted md:text-xl"
        >
          With years of experience developing robust web applications, we turn complex requirements into seamless, automated systems. From Twilio-powered communication tools to end-to-end Zapier and Systeme.io automations, we deliver solutions that save time and increase revenue.
        </motion.p>
      </div>
    </section>
  );
}
