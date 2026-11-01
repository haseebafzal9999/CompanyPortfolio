"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { TOOLS, type Tool } from "@/lib/content";
import { useInView, useMediaQuery, usePageVisible } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import SectionHeading from "./ui/SectionHeading";

const AUTO_SPEED = 9; // degrees per second

function ToolCard({ tool, w }: { tool: Tool; w: number }) {
  return (
    <div
      style={{ width: w }}
      className="glass flex h-[216px] flex-col items-center gap-3 rounded-2xl p-5 text-center shadow-[0_20px_60px_-20px_rgba(99,102,241,0.55)]"
    >
      <div className="flex w-full items-center gap-1.5">
        <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-prime-cyan" />
        <span className="truncate font-mono text-[9px] font-semibold uppercase tracking-[0.18em] text-prime-cyan/90">{tool.tag}</span>
      </div>
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-prime-violet/25 to-prime-cyan/10">
        <Image
          src={tool.logo}
          alt={`${tool.name} logo`}
          width={32}
          height={32}
          draggable={false}
          className={cn("h-8 w-8 object-contain", tool.invert && "[filter:brightness(0)_invert(1)] opacity-90")}
        />
      </div>
      <h3 className="font-display text-base font-bold leading-tight">{tool.name}</h3>
      <p className="text-[11px] leading-relaxed text-prime-muted">{tool.desc}</p>
    </div>
  );
}

/** Draggable, auto-rotating 3D carousel (pure CSS 3D + rAF, no WebGL). */
function ToolRing() {
  const n = TOOLS.length;
  const mobile = useMediaQuery("(max-width: 767px)");
  const cardW = mobile ? 150 : 184;
  const gap = mobile ? 40 : 70;
  const radius = Math.round((cardW + gap) / 2 / Math.tan(Math.PI / n));
  const step = 360 / n;

  const ringRef = useRef<HTMLDivElement>(null);
  const cards = useRef<(HTMLDivElement | null)[]>([]);
  const angle = useRef(0);
  const inertia = useRef(0);
  const dragging = useRef(false);
  const hovering = useRef(false);
  const lastX = useRef(0);
  const { ref: wrapRef, inView } = useInView<HTMLDivElement>("200px 0px");
  const visible = usePageVisible();

  useEffect(() => {
    const apply = () => {
      const ring = ringRef.current;
      if (!ring) return;
      ring.style.transform = `translateZ(${-radius}px) rotateY(${angle.current}deg)`;
      for (let i = 0; i < n; i++) {
        const el = cards.current[i];
        if (!el) continue;
        const theta = ((i * step + angle.current) * Math.PI) / 180;
        const facing = (Math.cos(theta) + 1) / 2; // 1 = front, 0 = back
        el.style.opacity = String(0.18 + 0.82 * Math.pow(facing, 1.4));
      }
    };
    apply();
    if (!inView || !visible) return;

    let raf = 0;
    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      if (!dragging.current) {
        angle.current += inertia.current;
        inertia.current *= 0.94;
        if (Math.abs(inertia.current) < 0.01) inertia.current = 0;
        if (!hovering.current) angle.current += AUTO_SPEED * dt;
      }
      apply();
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [inView, visible, n, radius, step]);

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = true;
    lastX.current = e.clientX;
    inertia.current = 0;
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastX.current;
    lastX.current = e.clientX;
    angle.current += dx * 0.32;
    inertia.current = dx * 0.32;
  };
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragging.current = false;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
  };

  return (
    <div
      ref={wrapRef}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerEnter={(e) => {
        if (e.pointerType === "mouse") hovering.current = true;
      }}
      onPointerLeave={() => {
        hovering.current = false;
      }}
      className="relative mx-auto h-[330px] w-full cursor-grab select-none active:cursor-grabbing md:h-[360px]"
      style={{ perspective: 1500, perspectiveOrigin: "50% 35%", touchAction: "pan-y" }}
    >
      <div ref={ringRef} className="absolute left-1/2 top-1/2 h-0 w-0 preserve-3d will-change-transform">
        {TOOLS.map((tool, i) => (
          <div
            key={tool.name}
            ref={(el) => {
              cards.current[i] = el;
            }}
            className="backface-hidden absolute"
            style={{
              left: -cardW / 2,
              top: -108,
              transform: `rotateY(${i * step}deg) translateZ(${radius}px)`,
            }}
          >
            <ToolCard tool={tool} w={cardW} />
          </div>
        ))}
      </div>
      {/* floor reflection */}
      <div className="pointer-events-none absolute bottom-2 left-1/2 h-24 w-[70%] -translate-x-1/2 rounded-[100%] bg-[radial-gradient(ellipse,rgba(139,92,246,0.35),transparent_70%)] blur-xl" />
    </div>
  );
}

export default function Tools() {
  return (
    <section id="tools" className="relative overflow-hidden border-y border-white/[0.06] bg-prime-surface/60 py-24 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[800px] -translate-x-1/2 rounded-full bg-prime-violet/15 blur-[140px]" />
      <div className="container relative mx-auto px-6 md:px-12">
        <SectionHeading
          index="02"
          eyebrow="Tech Stack"
          align="center"
          title={
            <>
              Tools &amp; <span className="grad-text">Technologies</span> We Use
            </>
          }
          sub="Powered by the tools behind modern automation — from communication APIs and AI models to workflow automation platforms, we use the right technology for every business problem."
        />

        <ToolRing />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-4 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-prime-muted/70"
        >
          Drag to rotate · hover to pause
        </motion.p>
        <p className="mt-6 text-center text-xs text-white/35">
          Tools and platforms we work with daily — not an official partnership list.
        </p>
      </div>
    </section>
  );
}
