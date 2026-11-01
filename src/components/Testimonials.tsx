"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { REVIEWS } from "@/lib/content";
import { useInView, useMediaQuery, usePageVisible } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import SectionHeading from "./ui/SectionHeading";

const AUTOPLAY_MS = 4500;

function ReviewCard({ r }: { r: (typeof REVIEWS)[number] }) {
  return (
    <div className="flex h-full flex-col gap-5 rounded-3xl border border-white/10 bg-[#0b0e1c] p-7 shadow-[0_30px_80px_-30px_rgba(99,102,241,0.5)] md:p-8">
      <Quote className="h-8 w-8 shrink-0 text-prime-violet/60" />
      <p className="flex-1 text-sm leading-relaxed text-prime-text/85">&ldquo;{r.text}&rdquo;</p>
      <div className="flex gap-1" aria-label={`${r.rating} out of 5 stars`}>
        {Array.from({ length: r.rating }).map((_, j) => (
          <Star key={j} className="h-4 w-4 fill-prime-amber text-prime-amber" />
        ))}
      </div>
      <div className="flex items-center gap-3 border-t border-white/10 pt-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-prime-violet to-prime-cyan text-sm font-bold text-white">
          {r.initials}
        </div>
        <div>
          <p className="text-sm font-semibold">{r.name}</p>
          <p className="text-xs text-prime-muted">
            {r.role}, {r.company}
          </p>
        </div>
      </div>
    </div>
  );
}

/** 3D coverflow carousel with autoplay, swipe, arrows and dots. */
export default function Testimonials() {
  const n = REVIEWS.length;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const mobile = useMediaQuery("(max-width: 767px)");
  const reduce = useReducedMotion();
  const { ref, inView } = useInView<HTMLElement>("0px");
  const visible = usePageVisible();
  const touchX = useRef<number | null>(null);

  const go = useCallback((dir: number) => setIndex((i) => (i + dir + n) % n), [n]);

  useEffect(() => {
    if (paused || reduce || !inView || !visible) return;
    const id = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [paused, reduce, inView, visible, go, index]);

  const half = Math.floor(n / 2);
  const spread = mobile ? 34 : 330;

  return (
    <section id="reviews" ref={ref} className="relative overflow-hidden border-t border-white/[0.06] bg-prime-surface/50 py-24 md:py-36">
      <div className="pointer-events-none absolute left-0 top-0 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/3 rounded-full bg-prime-violet/15 blur-[150px]" />
      <div className="container relative mx-auto px-6 md:px-12">
        <SectionHeading index="09" eyebrow="Client Reviews" align="center" title={<>TRUSTED BY <span className="grad-text">BUSINESSES</span></>} />

        <div
          className="relative mx-auto h-[500px] max-w-6xl select-none sm:h-[430px]"
          style={{ perspective: 1500, touchAction: "pan-y" }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
          onTouchStart={(e) => {
            touchX.current = e.touches[0].clientX;
            setPaused(true);
          }}
          onTouchEnd={(e) => {
            if (touchX.current !== null) {
              const dx = e.changedTouches[0].clientX - touchX.current;
              if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1);
            }
            touchX.current = null;
            setPaused(false);
          }}
        >
          {REVIEWS.map((r, i) => {
            let off = i - index;
            if (off > half) off -= n;
            if (off < -half) off += n;
            const abs = Math.abs(off);
            const hidden = mobile && abs > 1;
            return (
              <motion.div
                key={r.name}
                onClick={() => off !== 0 && setIndex(i)}
                animate={{
                  x: off * spread,
                  z: -abs * 220,
                  rotateY: off * (mobile ? -12 : -26),
                  scale: 1 - abs * 0.08,
                  opacity: hidden ? 0 : 1 - abs * 0.38,
                }}
                transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 20 }}
                style={{ zIndex: 10 - abs, pointerEvents: hidden ? "none" : "auto" }}
                className={cn("absolute inset-x-0 top-0 mx-auto h-full w-[min(88vw,460px)]", off !== 0 && "cursor-pointer")}
                aria-hidden={off !== 0}
              >
                <ReviewCard r={r} />
              </motion.div>
            );
          })}
        </div>

        <div className="mt-8 flex items-center justify-center gap-2">
          <button onClick={() => go(-1)} aria-label="Previous testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-prime-muted transition-colors hover:border-prime-cyan/60 hover:text-prime-cyan">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="mx-2 flex items-center">
            {REVIEWS.map((r, i) => (
              <button key={r.name} onClick={() => setIndex(i)} aria-label={`Go to review ${i + 1}`} aria-current={index === i ? "true" : undefined} className="flex h-11 w-7 items-center justify-center">
                <span className={cn("block h-2 rounded-full transition-all duration-500", index === i ? "w-7 bg-gradient-to-r from-prime-violet to-prime-cyan" : "w-2 bg-white/20")} />
              </button>
            ))}
          </div>
          <button onClick={() => go(1)} aria-label="Next testimonial" className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-prime-muted transition-colors hover:border-prime-cyan/60 hover:text-prime-cyan">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
