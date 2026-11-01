"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { Layers, Link2, MessageCircle, Zap } from "lucide-react";
import { useInView, usePageVisible } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/animations";
import SectionHeading from "./ui/SectionHeading";

const ShapesScene = dynamic(() => import("./three/ShapesScene"), { ssr: false });

const GOALS = [
  { icon: Zap, text: "Reduce manual work." },
  { icon: MessageCircle, text: "Improve customer engagement." },
  { icon: Link2, text: "Connect disconnected systems." },
  { icon: Layers, text: "Build scalable workflows." },
];

export default function About() {
  const { ref, inView } = useInView<HTMLElement>("150px 0px");
  const visible = usePageVisible();
  const [lit, setLit] = useState(0);
  const [mountScene, setMountScene] = useState(false);

  useEffect(() => {
    if (inView) setMountScene(true);
  }, [inView]);

  useEffect(() => {
    if (!inView || !visible) return;
    const id = setInterval(() => setLit((l) => (l + 1) % GOALS.length), 1800);
    return () => clearInterval(id);
  }, [inView, visible]);

  return (
    <section id="about" ref={ref} className="relative overflow-hidden py-24 md:py-40">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-prime-violet/[0.07] to-transparent" />

      {/* 3D background */}
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">{mountScene && <ShapesScene active={inView && visible} />}</div>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-prime-bg via-prime-bg/70 to-transparent lg:via-prime-bg/40" />

      <div className="container relative mx-auto px-6 md:px-12">
        <div className="max-w-3xl">
          <SectionHeading
            index="07"
            eyebrow="About Us"
            className="!mb-10"
            title={
              <span className="text-[1.05em]">
                BUILD LESS BUSYWORK. <br />
                <span className="grad-text">BUILD BETTER SYSTEMS.</span>
              </span>
            }
          />

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-10 max-w-xl text-lg leading-relaxed text-prime-muted"
          >
            PrimeAutoTech focuses on building efficient, scalable digital systems that connect web applications, APIs, communication platforms, automation tools, and AI.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="border-l-2 border-prime-cyan pl-6"
          >
            <p className="mb-5 font-display text-lg font-semibold tracking-wide">The goal is simple:</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {GOALS.map((g, i) => {
                const Icon = g.icon;
                const on = lit === i;
                return (
                  <li
                    key={g.text}
                    className={cn(
                      "flex items-center gap-3 rounded-xl border px-4 py-3.5 text-sm backdrop-blur-md transition-all duration-500",
                      on ? "border-prime-cyan/50 bg-prime-cyan/10 text-white shadow-[0_0_30px_-8px_rgba(34,211,238,0.6)]" : "border-white/10 bg-prime-bg/70 text-prime-muted"
                    )}
                  >
                    <span className={cn("flex h-8 w-8 items-center justify-center rounded-lg transition-colors duration-500", on ? "bg-prime-cyan text-prime-bg" : "bg-white/5")}>
                      <Icon className="h-4 w-4" />
                    </span>
                    {g.text}
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
