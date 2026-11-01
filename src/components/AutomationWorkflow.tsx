"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Pause, Play, RotateCcw, Zap } from "lucide-react";
import { WORKFLOW_STEPS } from "@/lib/content";
import { useInView, usePageVisible } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import SectionHeading from "./ui/SectionHeading";

const STEP_MS = 1500;
const HOLD_MS = 1800;

interface LogLine {
  id: number;
  t: string;
  text: string;
  run: number;
}

export default function AutomationWorkflow() {
  const n = WORKFLOW_STEPS.length;
  const [step, setStep] = useState(0);
  const [auto, setAuto] = useState(true);
  const [runs, setRuns] = useState(0);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const { ref, inView } = useInView<HTMLElement>("-10% 0px");
  const visible = usePageVisible();
  const idRef = useRef(0);
  const running = auto && inView && visible;

  const pushLog = useCallback((s: number, run: number) => {
    const t = new Date().toLocaleTimeString("en-GB");
    idRef.current += 1;
    setLogs((prev) => [...prev.slice(-6), { id: idRef.current, t, text: WORKFLOW_STEPS[s].log, run }]);
  }, []);

  // Log whenever the active step changes
  useEffect(() => {
    if (inView) pushLog(step, runs + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, inView]);

  // Auto-run loop
  useEffect(() => {
    if (!running) return;
    const last = step === n - 1;
    const id = setTimeout(
      () => {
        if (last) {
          setRuns((r) => r + 1);
          setStep(0);
        } else {
          setStep((s) => s + 1);
        }
      },
      last ? HOLD_MS : STEP_MS
    );
    return () => clearTimeout(id);
  }, [running, step, n]);

  const jump = (i: number) => {
    setAuto(false);
    setStep(i);
  };

  const progressPct = (step / (n - 1)) * 100;

  return (
    <section id="automation" ref={ref} className="relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute right-0 top-1/4 h-[500px] w-[500px] translate-x-1/2 rounded-full bg-prime-cyan/10 blur-[140px]" />
      <div className="container relative mx-auto px-6 md:px-12">
        <SectionHeading
          index="03"
          eyebrow="Automation Pipeline"
          align="center"
          title={
            <>
              From Trigger <span className="grad-text">to Result.</span>
            </>
          }
          sub="Watch a lead travel through a live automation — qualified by AI, synced to the CRM, nurtured by SMS and closed. Click any step to inspect it."
        />

        {/* controls */}
        <div className="mb-10 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setAuto((a) => !a)}
            className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:border-prime-cyan/50"
          >
            {auto ? <Pause className="h-3.5 w-3.5 text-prime-cyan" /> : <Play className="h-3.5 w-3.5 text-prime-lime" />}
            {auto ? "Pause" : "Auto-run"}
          </button>
          <button
            onClick={() => {
              setStep(0);
              setAuto(true);
            }}
            className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:border-prime-violet/50"
          >
            <RotateCcw className="h-3.5 w-3.5 text-prime-violet" /> Restart
          </button>
          <span className="glass flex items-center gap-2 rounded-full px-5 py-2.5 font-mono text-xs text-prime-muted">
            <Zap className="h-3.5 w-3.5 text-prime-lime" /> Runs completed: <b className="text-prime-text">{runs}</b>
          </span>
        </div>

        {/* board */}
        <div style={{ perspective: 1600 }}>
          <motion.div
            initial={{ opacity: 0, rotateX: 18, y: 40 }}
            whileInView={{ opacity: 1, rotateX: 0, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            {/* desktop rail */}
            <div
              className="pointer-events-none absolute top-[29px] hidden h-[2px] bg-white/10 md:block"
              style={{ left: "calc((100% - 80px) / 12)", right: "calc((100% - 80px) / 12)" }}
            >
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-prime-violet via-prime-cyan to-prime-lime"
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
              <motion.div
                className="absolute top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_24px_6px_rgba(34,211,238,0.9)]"
                animate={{ left: `${progressPct}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
            {/* mobile rail */}
            <div className="pointer-events-none absolute bottom-6 left-[27px] top-6 w-[2px] bg-white/10 md:hidden">
              <motion.div
                className="absolute inset-x-0 top-0 bg-gradient-to-b from-prime-violet to-prime-cyan"
                animate={{ height: `${progressPct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            <div className="relative grid grid-cols-1 gap-4 md:grid-cols-6 md:gap-4">
              {WORKFLOW_STEPS.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const on = i === step;
                return (
                  <button
                    key={s.id}
                    onClick={() => jump(i)}
                    aria-label={`Step ${s.id}: ${s.label}`}
                    aria-current={on ? "step" : undefined}
                    className="group relative flex items-start gap-4 text-left md:flex-col md:items-center md:text-center"
                  >
                    {/* node */}
                    <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center md:h-[60px] md:w-[60px]">
                      {on && <span className="absolute inset-0 animate-ping rounded-2xl bg-prime-cyan/30" />}
                      <div
                        className={cn(
                          "relative flex h-full w-full items-center justify-center rounded-2xl border transition-all duration-500",
                          on && "scale-110 border-prime-cyan bg-prime-cyan/15 shadow-[0_0_40px_rgba(34,211,238,0.55)]",
                          done && "border-prime-lime/60 bg-prime-lime/10",
                          !on && !done && "border-white/10 bg-prime-card"
                        )}
                      >
                        {done ? <Check className="h-6 w-6 text-prime-lime" /> : <Icon className={cn("h-6 w-6", on ? "text-prime-cyan" : "text-prime-muted")} />}
                      </div>
                    </div>

                    <div
                      className={cn(
                        "glass w-full flex-1 rounded-2xl p-4 transition-all duration-500 md:mt-4 md:flex-none",
                        on ? "-translate-y-1 border-prime-cyan/50 shadow-[0_20px_60px_-20px_rgba(34,211,238,0.5)]" : "opacity-70 group-hover:opacity-100"
                      )}
                    >
                      <div className="mb-2 flex items-center justify-between md:justify-center md:gap-2">
                        <span className="font-mono text-[10px] text-prime-muted/70">STEP 0{s.id}</span>
                        <span className={cn("flex items-center gap-1.5 font-mono text-[9px] font-semibold uppercase tracking-[0.14em]", on ? "text-prime-cyan" : done ? "text-prime-lime" : "text-prime-muted")}>
                          <span className={cn("h-1.5 w-1.5 rounded-full", on ? "animate-pulse bg-prime-cyan" : done ? "bg-prime-lime" : "bg-prime-muted/50")} />
                          {s.badge}
                        </span>
                      </div>
                      <h3 className="mb-1 font-display text-base font-bold leading-tight">{s.label}</h3>
                      <p className="text-[11px] leading-relaxed text-prime-muted">{s.sub}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        </div>

        {/* live log */}
        <div className="glass-strong mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-prime-muted">Execution log</span>
            <span className={cn("flex items-center gap-2 font-mono text-[11px]", running ? "text-prime-lime" : "text-prime-muted")}>
              <span className={cn("h-1.5 w-1.5 rounded-full", running ? "animate-pulse bg-prime-lime" : "bg-prime-muted")} />
              {running ? "RUNNING" : "PAUSED"}
            </span>
          </div>
          <div className="min-h-[190px] space-y-1.5 px-5 py-4 font-mono text-[12px]">
            <AnimatePresence initial={false}>
              {logs.map((l) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, x: -10, height: 0 }}
                  animate={{ opacity: 1, x: 0, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-3 overflow-hidden whitespace-pre text-prime-text/90"
                >
                  <span className="text-prime-muted/60">[{l.t}]</span>
                  <span className="text-prime-violet">run#{l.run}</span>
                  <span className="truncate">
                    <span className="text-prime-lime">✓</span> {l.text}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
