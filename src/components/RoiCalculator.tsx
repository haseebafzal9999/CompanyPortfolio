"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { CalendarCheck, Clock, TrendingUp, Wallet } from "lucide-react";
import SectionHeading from "./ui/SectionHeading";
import { useConsultation } from "./ConsultationProvider";

function AnimatedNumber({ value, format }: { value: number; format: (n: number) => string }) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 90, damping: 20 });
  const text = useTransform(spring, (v) => format(v));
  useEffect(() => {
    mv.set(value);
  }, [value, mv]);
  return <motion.span>{text}</motion.span>;
}

function Slider({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (n: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-end justify-between gap-4">
        <label className="text-sm text-prime-muted">{label}</label>
        <span className="font-display text-2xl font-bold text-white">{unit === "$" ? `$${value}` : `${value}${unit}`}</span>
      </div>
      <input
        type="range"
        className="prime-range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ ["--p" as string]: `${pct}%` }}
        aria-label={label}
      />
    </div>
  );
}

export default function RoiCalculator() {
  const { open } = useConsultation();
  const [hours, setHours] = useState(40);
  const [cost, setCost] = useState(25);
  const [share, setShare] = useState(60);

  const hoursSavedMonth = (hours * 52 * (share / 100)) / 12;
  const yearlySavings = hours * 52 * (share / 100) * cost;
  const workWeeks = (hours * 52 * (share / 100)) / 40;

  const R = 62;
  const C = 2 * Math.PI * R;

  return (
    <section id="roi" className="relative overflow-hidden border-t border-white/[0.06] py-24 md:py-36">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-prime-indigo/15 blur-[150px]" />
      <div className="container relative mx-auto px-6 md:px-12">
        <SectionHeading
          index="08"
          eyebrow="Automation ROI"
          align="center"
          title={
            <>
              Estimate Your <span className="grad-text">Savings</span>
            </>
          }
          sub="Move the sliders to see what automating repetitive work could give back to your team."
        />

        <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-5">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="glass flex flex-col justify-center gap-9 rounded-3xl p-7 md:p-10 lg:col-span-3"
          >
            <Slider label="Hours of repetitive work per week" value={hours} min={5} max={200} unit="h" onChange={setHours} />
            <Slider label="Average hourly cost of that work" value={cost} min={5} max={150} unit="$" onChange={setCost} />
            <Slider label="Share that can be automated" value={share} min={20} max={90} step={5} unit="%" onChange={setShare} />
            <p className="font-mono text-[11px] leading-relaxed text-prime-muted/70">
              Illustrative estimate based only on the numbers you enter — not a quote or a guarantee.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="neon-border glass-strong relative flex flex-col items-center gap-6 rounded-3xl p-7 text-center md:p-9 lg:col-span-2"
          >
            <div className="relative flex h-40 w-40 items-center justify-center">
              <svg viewBox="0 0 140 140" className="absolute inset-0 -rotate-90">
                <defs>
                  <linearGradient id="roi-g" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" />
                    <stop offset="100%" stopColor="#22D3EE" />
                  </linearGradient>
                </defs>
                <circle cx="70" cy="70" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
                <motion.circle
                  cx="70"
                  cy="70"
                  r={R}
                  fill="none"
                  stroke="url(#roi-g)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={C}
                  animate={{ strokeDashoffset: C * (1 - share / 100) }}
                  transition={{ type: "spring", stiffness: 70, damping: 18 }}
                />
              </svg>
              <div>
                <div className="font-display text-4xl font-bold">{share}%</div>
                <div className="font-mono text-[9px] uppercase tracking-[0.2em] text-prime-muted">automated</div>
              </div>
            </div>

            <div className="w-full space-y-4 text-left">
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Clock className="h-6 w-6 shrink-0 text-prime-cyan" />
                <div>
                  <div className="font-display text-2xl font-bold">
                    <AnimatedNumber value={hoursSavedMonth} format={(n) => Math.round(n).toLocaleString()} /> h
                  </div>
                  <div className="text-xs text-prime-muted">hours saved every month</div>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <Wallet className="h-6 w-6 shrink-0 text-prime-lime" />
                <div>
                  <div className="font-display text-2xl font-bold">
                    $<AnimatedNumber value={yearlySavings} format={(n) => Math.round(n).toLocaleString()} />
                  </div>
                  <div className="text-xs text-prime-muted">potential yearly savings</div>
                </div>
              </div>
              <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <TrendingUp className="h-6 w-6 shrink-0 text-prime-violet" />
                <div>
                  <div className="font-display text-2xl font-bold">
                    <AnimatedNumber value={workWeeks} format={(n) => n.toFixed(1)} />
                  </div>
                  <div className="text-xs text-prime-muted">40-hour work-weeks returned per year</div>
                </div>
              </div>
            </div>

            <button
              onClick={open}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-prime-violet to-prime-cyan px-6 py-3.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition-transform hover:-translate-y-0.5"
            >
              <CalendarCheck className="h-4 w-4" /> Get a free consultation
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
