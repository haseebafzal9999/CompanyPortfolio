"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { SOLUTIONS, type Solution, type SolutionLabel } from "@/lib/content";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/animations";
import SectionHeading from "./ui/SectionHeading";
import Tilt from "./ui/Tilt";
import { useConsultation } from "./ConsultationProvider";

const LABEL: Record<SolutionLabel, { chip: string; glow: string; icon: string; bar: string }> = {
  AI: {
    chip: "border-prime-violet/40 bg-prime-violet/10 text-violet-300",
    glow: "rgba(139,92,246,0.25)",
    icon: "from-prime-violet to-prime-indigo",
    bar: "from-prime-violet",
  },
  Automation: {
    chip: "border-prime-cyan/40 bg-prime-cyan/10 text-cyan-300",
    glow: "rgba(34,211,238,0.22)",
    icon: "from-prime-cyan to-prime-indigo",
    bar: "from-prime-cyan",
  },
  Integration: {
    chip: "border-prime-lime/40 bg-prime-lime/10 text-lime-300",
    glow: "rgba(163,230,53,0.2)",
    icon: "from-prime-lime to-prime-cyan",
    bar: "from-prime-lime",
  },
};

// Wide/narrow rhythm for the bento grid (lg: 3 columns)
const SPAN = ["lg:col-span-2", "", "", "lg:col-span-2", "lg:col-span-2", ""];

function SolutionCard({ s, index }: { s: Solution; index: number }) {
  const { open } = useConsultation();
  const Icon = s.icon;
  const c = LABEL[s.label];
  const wide = SPAN[index].includes("col-span-2");

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotateX: 14 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.8, delay: (index % 3) * 0.1, ease: EASE }}
      style={{ transformPerspective: 1200 }}
      className={cn("md:col-span-1", SPAN[index])}
    >
      <Tilt glow={c.glow} className="glass overflow-hidden rounded-3xl p-7 md:p-9">
        <div className="pointer-events-none absolute inset-0 bg-dots opacity-[0.12] [mask-image:linear-gradient(to_bottom_right,#000,transparent_65%)]" />
        <div className={cn("absolute left-0 right-0 top-0 h-[2px] origin-left scale-x-0 bg-gradient-to-r to-transparent transition-transform duration-700 group-hover:scale-x-100", c.bar)} />

        <div className="relative flex h-full flex-col" style={{ transformStyle: "preserve-3d" }}>
          <div className="mb-8 flex items-start justify-between" style={{ transform: "translateZ(40px)" }}>
            <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br shadow-lg transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110", c.icon)}>
              <Icon className="h-7 w-7 text-white" />
            </div>
            <div className="flex items-center gap-3">
              <span className={cn("rounded-full border px-3 py-1 font-mono text-[10px] font-semibold uppercase tracking-[0.18em]", c.chip)}>
                {s.label}
              </span>
              <span className="font-mono text-xs text-prime-muted/60">0{index + 1}</span>
            </div>
          </div>

          <h3 className="mb-3 font-display text-xl font-bold leading-tight md:text-2xl" style={{ transform: "translateZ(30px)" }}>
            {s.title}
          </h3>
          <p className={cn("text-sm leading-relaxed text-prime-muted", wide && "md:max-w-xl md:text-[15px]")} style={{ transform: "translateZ(15px)" }}>
            {s.desc}
          </p>

          <button
            onClick={open}
            className="mt-7 inline-flex w-fit items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-prime-muted transition-colors group-hover:text-prime-cyan"
            style={{ transform: "translateZ(25px)" }}
          >
            Discuss this
            <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/15 transition-all duration-300 group-hover:border-prime-cyan group-hover:bg-prime-cyan group-hover:text-prime-bg">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </button>
        </div>
      </Tilt>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative py-24 md:py-36">
      <div className="pointer-events-none absolute left-0 top-1/3 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-prime-violet/15 blur-[140px]" />
      <div className="container relative mx-auto px-6 md:px-12">
        <SectionHeading
          index="01"
          eyebrow="Services"
          title={
            <>
              SOLUTIONS <span className="grad-text">WE BUILD</span>
            </>
          }
          sub="Six capability areas — from AI voice agents to complete business workflow automation — each designed around measurable outcomes."
        />
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {SOLUTIONS.map((s, i) => (
            <SolutionCard key={s.id} s={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
