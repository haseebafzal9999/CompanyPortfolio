"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarCheck } from "lucide-react";
import { EASE } from "@/lib/animations";
import { TOOLS, WORKFLOW_STEPS } from "@/lib/content";
import { PROJECTS } from "@/lib/projects";
import { scrollToId, useCountUp, useInView, usePageVisible, useTypewriter } from "@/lib/hooks";
import { useConsultation } from "./ConsultationProvider";

const HeroScene = dynamic(() => import("./three/HeroScene"), { ssr: false });

const HEADLINE = [
  ["BUILD", "POWERFUL"],
  ["AUTOMATED", "WEB"],
  ["SOLUTIONS", "THAT"],
  ["DRIVE", "REAL", "RESULTS."],
];

const CAPABILITIES = [
  "Twilio Voice & SMS",
  "Zapier automations",
  "AI agents",
  "Systeme.io funnels",
  "Custom web applications",
];

function Headline() {
  let w = 0;
  return (
    <h1
      aria-label="Build powerful automated web solutions that drive real results."
      className="mb-5 font-display text-[clamp(2.2rem,5.4vw,4.5rem)] font-bold uppercase leading-[1.03] tracking-tight"
    >
      {HEADLINE.map((line, li) => (
        <span key={li} className="block" aria-hidden="true">
          {line.map((word) => {
            const delay = 0.15 + w++ * 0.07;
            const special = word === "AUTOMATED";
            return (
              <span key={word} className="mr-[0.22em] inline-block overflow-hidden align-bottom">
                <motion.span
                  initial={{ y: "115%", rotate: 4 }}
                  animate={{ y: 0, rotate: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay }}
                  className={`inline-block ${special ? "grad-text" : ""}`}
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </span>
      ))}
    </h1>
  );
}

function Stat({ value, suffix = "", label, start }: { value: number; suffix?: string; label: string; start: boolean }) {
  const v = useCountUp(value, start, 1800);
  return (
    <div className="min-w-[110px]">
      <div className="font-display text-3xl font-bold md:text-4xl">
        <span className="grad-text-static">{Math.round(v)}</span>
        <span className="text-prime-lime">{suffix}</span>
      </div>
      <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-prime-muted">{label}</div>
    </div>
  );
}

/** Auto-running mini terminal that "executes" the pipeline forever. */
function LiveTerminal({ active }: { active: boolean }) {
  const [lines, setLines] = useState<{ t: string; text: string; id: number }[]>([]);

  useEffect(() => {
    if (!active) return;
    let i = 0;
    const push = () => {
      const step = WORKFLOW_STEPS[i % WORKFLOW_STEPS.length];
      const t = new Date().toLocaleTimeString("en-GB");
      setLines((prev) => [...prev.slice(-4), { t, text: step.log, id: Date.now() + i }]);
      i += 1;
    };
    push();
    const id = setInterval(push, 1500);
    return () => clearInterval(id);
  }, [active]);

  return (
    <div className="glass-strong w-[340px] overflow-hidden rounded-2xl shadow-[0_30px_80px_-20px_rgba(99,102,241,0.6)]">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300/80" />
          <span className="h-2.5 w-2.5 rounded-full bg-prime-lime/80" />
        </div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-prime-muted">prime-runner</span>
        <span className="flex items-center gap-1.5 font-mono text-[10px] text-prime-lime">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-prime-lime" /> LIVE
        </span>
      </div>
      <div className="min-h-[148px] space-y-1.5 px-4 py-3.5 font-mono text-[11px] leading-relaxed">
        <div className="text-prime-muted">
          <span className="text-prime-cyan">prime@auto</span>:<span className="text-prime-violet">~</span>$ run workflow --lead
        </div>
        {lines.map((l) => (
          <motion.div key={l.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-2 whitespace-pre text-prime-text/90">
            <span className="text-prime-muted/70">[{l.t}]</span>
            <span>
              <span className="text-prime-lime">✓</span> {l.text}
            </span>
          </motion.div>
        ))}
        <div className="caret text-prime-cyan">&nbsp;</div>
      </div>
    </div>
  );
}

export default function Hero() {
  const { open } = useConsultation();
  const [sceneReady, setSceneReady] = useState(false);
  const { ref, inView } = useInView<HTMLElement>("100px 0px");
  const visible = usePageVisible();
  const typed = useTypewriter(CAPABILITIES, inView && visible);

  // Mount the WebGL scene when the browser is idle so first paint stays fast.
  useEffect(() => {
    let cancelled = false;
    const w = window as typeof window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    const mount = () => !cancelled && setSceneReady(true);
    let id: number;
    if (typeof w.requestIdleCallback === "function") id = w.requestIdleCallback(mount, { timeout: 1000 });
    else id = window.setTimeout(mount, 200);
    return () => {
      cancelled = true;
      if (typeof w.cancelIdleCallback === "function") w.cancelIdleCallback(id);
      else window.clearTimeout(id);
    };
  }, []);

  return (
    <section id="home" ref={ref} className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-20 pt-[390px] sm:pt-[430px] lg:pt-28">
      {/* backdrop */}
      <div className="bg-grid pointer-events-none absolute inset-0" />
      <div className="pointer-events-none absolute -left-40 top-10 h-[520px] w-[520px] rounded-full bg-prime-violet/25 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-prime-cyan/15 blur-[140px]" />

      {/* 3D scene */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: sceneReady ? 1 : 0 }} transition={{ duration: 1.4 }} className="absolute inset-0 z-0">
        {sceneReady && <HeroScene active={inView && visible} />}
      </motion.div>
      <div className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-r from-prime-bg via-prime-bg/60 to-transparent max-lg:from-prime-bg/70 max-lg:via-prime-bg/40" />

      <div className="container relative z-10 mx-auto px-6 md:px-12">
        <div className="max-w-[900px]">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="glass mb-7 inline-flex items-center gap-3 rounded-full px-4 py-2"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-prime-lime opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-prime-lime" />
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-prime-text/80 sm:text-xs">
              Systems Online &bull; Automation &bull; Web
            </span>
          </motion.div>

          <Headline />

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.8 }}
            className="mb-5 max-w-xl text-base leading-relaxed text-prime-muted md:text-lg"
          >
            We&apos;re experts in Twilio Voice &amp; SMS, Zapier automations, AI agents, Systeme.io, and custom web applications. We build systems that streamline operations and scale efficiently.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mb-7 flex h-7 items-center font-mono text-sm text-prime-cyan"
            aria-hidden="true"
          >
            <span className="mr-2 text-prime-violet">&gt;</span>
            <span className="caret">{typed}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.05 }}
            className="mb-10 flex flex-col gap-3 sm:flex-row"
          >
            <button
              onClick={() => scrollToId("work")}
              className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-white px-7 py-4 text-[13px] font-semibold tracking-[0.1em] text-prime-bg transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_50px_-12px_rgba(255,255,255,0.45)]"
            >
              VIEW OUR WORK
              <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={open}
              className="group flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.04] px-7 py-4 text-[13px] font-semibold tracking-[0.1em] backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-prime-cyan/70 hover:bg-prime-cyan/10"
            >
              <CalendarCheck className="h-4 w-4 text-prime-cyan" />
              FREE CONSULTATION
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 1.2 }}
            className="flex flex-wrap gap-x-10 gap-y-6 border-t border-white/10 pt-6"
          >
            <Stat value={PROJECTS.length} label="Demo projects" start={inView} />
            <Stat value={TOOLS.length} suffix="+" label="Integrations" start={inView} />
            <Stat value={24} suffix="/7" label="Automation" start={inView} />
            <Stat value={5} label="Step process" start={inView} />
          </motion.div>
        </div>
      </div>

      {/* floating live terminal */}
      <motion.div
        initial={{ opacity: 0, y: 40, rotateY: -14 }}
        animate={{ opacity: 1, y: 0, rotateY: -6 }}
        transition={{ duration: 1, ease: EASE, delay: 1.5 }}
        style={{ transformPerspective: 1200 }}
        className="absolute bottom-28 right-24 z-10 hidden xl:block"
      >
        <div className="animate-float">
          <LiveTerminal active={inView && visible} />
        </div>
      </motion.div>

      {/* scroll cue */}
      <div className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 2xl:flex" aria-hidden="true">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-prime-muted">Scroll</span>
        <span className="flex h-9 w-5 justify-center rounded-full border border-white/25 pt-1.5">
          <motion.span animate={{ y: [0, 12, 0], opacity: [1, 0.2, 1] }} transition={{ duration: 1.8, repeat: Infinity }} className="h-1.5 w-1 rounded-full bg-prime-cyan" />
        </span>
      </div>
    </section>
  );
}
