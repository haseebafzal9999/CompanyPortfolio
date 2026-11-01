"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, CalendarCheck } from "lucide-react";
import { NAV_LINKS } from "@/lib/content";
import { useActiveSection, useScrollLock } from "@/lib/hooks";
import { cn } from "@/lib/cn";
import { useConsultation } from "./ConsultationProvider";
import LogoMark from "./ui/Logo";

const IDS = NAV_LINKS.map((l) => l.href.slice(1));

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const active = useActiveSection(IDS);
  const { open } = useConsultation();

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  useScrollLock(menu);

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-6 sm:pt-5">
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "pointer-events-auto flex w-full max-w-6xl items-center justify-between rounded-2xl px-4 py-2.5 transition-all duration-500 sm:px-5",
            scrolled ? "glass-strong shadow-[0_10px_50px_-12px_rgba(99,102,241,0.45)]" : "border border-transparent bg-transparent"
          )}
        >
          <Link href="#home" className="group flex items-center gap-2.5" aria-label="PrimeAutoTech home">
            <LogoMark className="h-8 w-8 transition-transform duration-500 group-hover:rotate-[60deg]" />
            <span className="font-display text-lg font-bold tracking-tight">
              Prime<span className="grad-text-static">AutoTech</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
            {NAV_LINKS.map((link) => {
              const on = active === link.href.slice(1);
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative rounded-full px-4 py-2 text-[13px] font-medium transition-colors",
                    on ? "text-white" : "text-prime-muted hover:text-white"
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full border border-white/10 bg-white/[0.07]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={open}
              className="group relative hidden items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-prime-violet to-prime-cyan px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white shadow-[0_8px_30px_-8px_rgba(139,92,246,0.9)] transition-transform duration-300 hover:-translate-y-0.5 lg:flex"
            >
              <CalendarCheck className="h-3.5 w-3.5" />
              Book Consultation
            </button>
            <button
              onClick={() => setMenu(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 lg:hidden"
              aria-label="Open Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </motion.div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, clipPath: "circle(0% at 92% 4%)" }}
            animate={{ opacity: 1, clipPath: "circle(150% at 92% 4%)" }}
            exit={{ opacity: 0, clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[60] flex flex-col bg-prime-bg/95 backdrop-blur-xl"
          >
            <div className="bg-grid pointer-events-none absolute inset-0 opacity-60" />
            <div className="relative flex items-center justify-between border-b border-white/10 p-5">
              <span className="flex items-center gap-2.5 font-display text-lg font-bold">
                <LogoMark className="h-8 w-8" /> PrimeAutoTech
              </span>
              <button onClick={() => setMenu(false)} className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5" aria-label="Close Menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="relative flex flex-1 flex-col justify-center gap-2 overflow-y-auto px-6 py-8">
              {NAV_LINKS.map((link, i) => (
                <motion.div key={link.name} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
                  <Link
                    href={link.href}
                    onClick={() => setMenu(false)}
                    className="flex items-baseline gap-4 py-2.5 font-display text-4xl font-bold tracking-tight"
                  >
                    <span className="font-mono text-xs text-prime-violet">0{i + 1}</span>
                    <span className={active === link.href.slice(1) ? "grad-text-static" : "text-prime-text"}>{link.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="relative border-t border-white/10 p-5">
              <button
                onClick={() => {
                  setMenu(false);
                  open();
                }}
                className="w-full rounded-xl bg-gradient-to-r from-prime-violet to-prime-cyan py-4 text-sm font-semibold uppercase tracking-[0.14em]"
              >
                Book a Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
