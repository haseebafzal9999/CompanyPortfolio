"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { Bot, CheckCircle2, PhoneCall, Workflow } from "lucide-react";
import { WHY_US } from "@/lib/content";
import { useInView, usePageVisible } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/animations";
import SectionHeading from "./ui/SectionHeading";

const FACE = "absolute inset-0 flex items-center justify-center border border-prime-cyan/40 backface-hidden";

/** Auto-spinning CSS 3D cube that also leans toward the cursor. */
function PrimeCube() {
  const wrap = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = wrap.current?.getBoundingClientRect();
    if (!r) return;
    ry.set(((e.clientX - r.left) / r.width - 0.5) * 36);
    rx.set(-((e.clientY - r.top) / r.height - 0.5) * 36);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  const size = 190;
  const half = size / 2;
  const glass = "bg-gradient-to-br from-prime-violet/35 to-prime-cyan/15 backdrop-blur-sm shadow-[inset_0_0_40px_rgba(34,211,238,0.25)]";

  return (
    <div
      ref={wrap}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex aspect-square w-full max-w-[520px] items-center justify-center"
      style={{ perspective: 1100 }}
    >
      {/* ambient */}
      <div className="absolute inset-[10%] rounded-full bg-prime-violet/25 blur-[90px]" />
      <div className="bg-grid absolute inset-0 opacity-70" />

      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative flex h-full w-full items-center justify-center">
        {/* orbit rings */}
        {[
          { s: 1.55, rx: 72, d: 22, c: "border-prime-cyan/40" },
          { s: 1.9, rx: 62, d: 32, c: "border-prime-violet/40", rev: true },
          { s: 2.25, rx: 80, d: 44, c: "border-prime-lime/30" },
        ].map((r, i) => (
          <div key={i} className="absolute preserve-3d" style={{ width: size * r.s, height: size * r.s, transform: `rotateX(${r.rx}deg)` }}>
            <div className={cn("relative h-full w-full rounded-full border", r.c)} style={{ animation: `spin-slow ${r.d}s linear infinite ${r.rev ? "reverse" : ""}` }}>
              <span className="absolute -top-1.5 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-white shadow-[0_0_16px_4px_rgba(34,211,238,0.8)]" />
            </div>
          </div>
        ))}

        {/* cube */}
        <div className="cube preserve-3d relative" style={{ width: size, height: size }}>
          <div className={cn(FACE, glass)} style={{ transform: `translateZ(${half}px)` }}>
            <span className="font-display text-3xl font-bold tracking-tight">PRIME</span>
          </div>
          <div className={cn(FACE, glass)} style={{ transform: `rotateY(180deg) translateZ(${half}px)` }}>
            <span className="font-display text-3xl font-bold tracking-tight">AUTO</span>
          </div>
          <div className={cn(FACE, glass)} style={{ transform: `rotateY(90deg) translateZ(${half}px)` }}>
            <span className="font-display text-3xl font-bold tracking-tight">TECH</span>
          </div>
          <div className={cn(FACE, glass)} style={{ transform: `rotateY(-90deg) translateZ(${half}px)` }}>
            <Bot className="h-14 w-14 text-prime-cyan" />
          </div>
          <div className={cn(FACE, glass)} style={{ transform: `rotateX(90deg) translateZ(${half}px)` }}>
            <Workflow className="h-14 w-14 text-prime-lime" />
          </div>
          <div className={cn(FACE, glass)} style={{ transform: `rotateX(-90deg) translateZ(${half}px)` }}>
            <PhoneCall className="h-14 w-14 text-prime-violet" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function WhyUs() {
  const [lit, setLit] = useState(0);
  const { ref, inView } = useInView<HTMLDivElement>("0px");
  const visible = usePageVisible();
  const [hold, setHold] = useState(false);

  // Highlight rolls through the list automatically.
  useEffect(() => {
    if (!inView || !visible || hold) return;
    const id = setInterval(() => setLit((l) => (l + 1) % WHY_US.length), 2200);
    return () => clearInterval(id);
  }, [inView, visible, hold]);

  return (
    <section id="why-us" className="relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] translate-x-1/3 rounded-full bg-prime-violet/15 blur-[150px]" />
      <div className="container relative mx-auto grid items-center gap-16 px-6 md:px-12 lg:grid-cols-2">
        <div ref={ref}>
          <SectionHeading
            index="05"
            eyebrow="Why Us"
            className="!mb-10 md:!mb-12"
            title={
              <>
                WHY BUSINESSES <br />
                <span className="grad-text">TRUST US</span>
              </>
            }
            sub="We don't just write code; we build scalable engines that drive your business forward. Here is why our clients partner with us for the long term."
          />

          <div className="flex flex-col gap-3" onPointerEnter={() => setHold(true)} onPointerLeave={() => setHold(false)}>
            {WHY_US.map((item, i) => {
              const on = lit === i;
              return (
                <motion.button
                  key={item.title}
                  type="button"
                  onClick={() => setLit(i)}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease: EASE }}
                  className={cn(
                    "relative flex items-start gap-4 overflow-hidden rounded-2xl border p-5 text-left transition-all duration-500",
                    on ? "border-prime-cyan/50 bg-prime-cyan/[0.07] shadow-[0_0_40px_-12px_rgba(34,211,238,0.5)]" : "border-white/10 bg-white/[0.02] hover:border-white/25"
                  )}
                >
                  {on && <motion.span layoutId="why-bar" className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-prime-violet to-prime-cyan" />}
                  <CheckCircle2 className={cn("mt-0.5 h-6 w-6 shrink-0 transition-colors duration-500", on ? "text-prime-lime" : "text-prime-muted/60")} />
                  <div>
                    <h3 className="mb-1 font-display text-lg font-bold tracking-wide">{item.title}</h3>
                    <p className="text-sm text-prime-muted">{item.desc}</p>
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: EASE }}
          className="flex justify-center"
        >
          <PrimeCube />
        </motion.div>
      </div>
    </section>
  );
}
