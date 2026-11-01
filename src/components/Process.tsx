"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring } from "framer-motion";
import { PROCESS } from "@/lib/content";
import { cn } from "@/lib/cn";
import SectionHeading from "./ui/SectionHeading";

export default function Process() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 65%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 110, damping: 26 });

  return (
    <section id="process" className="relative overflow-hidden border-y border-white/[0.06] bg-prime-surface/50 py-24 md:py-36">
      <div className="container relative mx-auto px-6 md:px-12">
        <SectionHeading
          index="06"
          eyebrow="Process"
          align="center"
          title={
            <>
              FROM IDEA <br />
              <span className="grad-text">TO AUTOMATION.</span>
            </>
          }
        />

        <div ref={ref} className="relative mx-auto max-w-5xl">
          {/* line */}
          <div className="absolute bottom-0 left-[19px] top-0 w-[2px] bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div style={{ scaleY: fill }} className="h-full origin-top bg-gradient-to-b from-prime-violet via-prime-cyan to-prime-lime shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
          </div>

          <div className="flex flex-col gap-10 md:gap-16">
            {PROCESS.map((step, i) => {
              const right = i % 2 === 1;
              return (
                <div key={step.num} className="relative grid items-center md:grid-cols-2" style={{ perspective: 1400 }}>
                  {/* node */}
                  <motion.span
                    initial={{ scale: 0.5, backgroundColor: "#0A0C16" }}
                    whileInView={{ scale: 1, backgroundColor: "#22D3EE" }}
                    viewport={{ margin: "0px 0px -45% 0px", once: true }}
                    transition={{ duration: 0.5 }}
                    style={{ x: "-50%", y: "-50%" }}
                    className="absolute left-[19px] top-1/2 z-10 h-5 w-5 rounded-full border-[3px] border-prime-cyan shadow-[0_0_24px_rgba(34,211,238,0.9)] md:left-1/2"
                  />

                  <motion.div
                    initial={{ opacity: 0, rotateY: right ? 32 : -32, x: right ? 70 : -70 }}
                    whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                    className={cn("group glass relative ml-12 overflow-hidden rounded-3xl p-7 md:ml-0 md:p-9", right ? "md:col-start-2 md:ml-12" : "md:col-start-1 md:mr-12")}
                  >
                    <span className="pointer-events-none absolute -right-2 -top-6 select-none font-display text-[120px] font-bold leading-none text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.1)] transition-all duration-500 group-hover:[-webkit-text-stroke:1px_rgba(34,211,238,0.5)]">
                      {step.num}
                    </span>
                    <span className="mb-3 block font-mono text-xs tracking-[0.3em] text-prime-cyan">STEP {step.num}</span>
                    <h3 className="mb-2 font-display text-2xl font-bold tracking-wide md:text-3xl">{step.title}</h3>
                    <p className="max-w-sm text-sm leading-relaxed text-prime-muted md:text-base">{step.desc}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
