"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { cn } from "@/lib/cn";

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Max rotation in degrees */
  max?: number;
  /** Spotlight colour that follows the cursor */
  glow?: string;
  onClick?: () => void;
}

/** 3D tilt + cursor spotlight wrapper. Content can use `translate-z-*` style lifts. */
export default function Tilt({
  children,
  className,
  max = 9,
  glow = "rgba(139,92,246,0.22)",
  onClick,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 220, damping: 20 });
  const sry = useSpring(ry, { stiffness: 220, damping: 20 });

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    rx.set((0.5 - py) * max * 2);
    ry.set((px - 0.5) * max * 2);
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
  };

  const onLeave = () => {
    rx.set(0);
    ry.set(0);
  };

  return (
    <div style={{ perspective: 1100 }} className="h-full">
      <motion.div
        ref={ref}
        onPointerMove={onMove}
        onPointerLeave={onLeave}
        onClick={onClick}
        style={{ rotateX: srx, rotateY: sry, transformStyle: "preserve-3d" }}
        className={cn("group relative h-full will-change-transform", className)}
      >
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(420px circle at var(--mx, 50%) var(--my, 50%), ${glow}, transparent 45%)`,
          }}
        />
        {children}
      </motion.div>
    </div>
  );
}
