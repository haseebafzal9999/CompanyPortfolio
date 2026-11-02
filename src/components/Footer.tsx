"use client";

import Link from "next/link";
import { ArrowUp } from "lucide-react";
import { NAV_LINKS } from "@/lib/content";
import { SITE_TAGLINE } from "@/lib/site";
import { useConsultation } from "./ConsultationProvider";
import LogoMark from "./ui/Logo";

export default function Footer() {
  const { open } = useConsultation();
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-prime-surface pt-20">
      <div className="hairline absolute left-0 top-0 w-full opacity-70" />
      <div className="pointer-events-none absolute -bottom-40 left-1/2 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-prime-violet/20 blur-[140px]" />

      <div className="container relative mx-auto px-6 md:px-12">
        <div className="mb-16 flex flex-col justify-between gap-12 md:flex-row">
          <div className="max-w-sm">
            <Link href="#home" className="mb-4 flex w-fit items-center gap-3">
              <LogoMark className="h-10 w-10" />
              <span className="font-display text-2xl font-bold">Portfolio</span>
            </Link>
            <p className="mb-6 text-sm leading-relaxed text-prime-muted">{SITE_TAGLINE}</p>
            <button
              onClick={open}
              className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition-colors hover:border-prime-cyan/60 hover:bg-prime-cyan/10 hover:text-prime-cyan"
            >
              Book a free consultation
            </button>
          </div>

          <div>
            <p className="mb-4 font-mono text-[11px] uppercase tracking-[0.25em] text-prime-violet">Navigate</p>
            <ul className="grid grid-cols-2 gap-x-12 gap-y-3 text-sm text-prime-muted">
              {NAV_LINKS.map((l) => (
                <li key={l.name}>
                  <Link href={l.href} className="transition-colors hover:text-white">
                    {l.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div aria-hidden="true" className="select-none text-center font-display text-[17vw] font-bold leading-[0.8] tracking-tighter text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.09)] md:text-[13vw]">
          PORTFOLIO
        </div>

        <div className="relative z-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 py-7 text-xs text-prime-muted md:flex-row">
          <p>© 2026 Portfolio. All rights reserved.</p>
          <p className="flex items-center gap-2 font-mono">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-prime-lime opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-prime-lime" />
            </span>
            All systems operational
          </p>
          <div className="flex items-center gap-5">
            <Link href="#" className="transition-colors hover:text-white">Privacy Policy</Link>
            <Link href="#" className="transition-colors hover:text-white">Terms &amp; Conditions</Link>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 transition-colors hover:border-prime-cyan/60 hover:text-prime-cyan"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
