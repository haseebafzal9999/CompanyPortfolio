"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useScrollLock } from "@/lib/hooks";
import ConsultationForm from "./forms/ConsultationForm";

interface Ctx {
  open: () => void;
  close: () => void;
}

const ConsultationContext = createContext<Ctx>({ open: () => {}, close: () => {} });
export const useConsultation = () => useContext(ConsultationContext);

export default function ConsultationProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Prevent hydration issues by only rendering portal on client
  useEffect(() => setMounted(true), []);

  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);
  const value = useMemo(() => ({ open, close }), [open, close]);

  useScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.activeElement;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      if (prev instanceof HTMLElement) prev.focus();
    };
  }, [isOpen]);

  return (
    <ConsultationContext.Provider value={value}>
      {children}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <motion.div
                ref={overlayRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto bg-black/70 px-3 py-4 backdrop-blur-md sm:items-center sm:p-6 md:p-8"
                onClick={(e) => e.target === overlayRef.current && setOpen(false)}
                role="dialog"
                aria-modal="true"
                aria-label="Book a free consultation"
              >
                <motion.div
                  initial={{ opacity: 0, y: 40, rotateX: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.97 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ transformPerspective: 1200 }}
                  className="glass-strong relative my-auto w-full max-w-2xl rounded-2xl p-5 shadow-[0_40px_120px_-20px_rgba(99,102,241,0.55)] sm:rounded-3xl sm:p-7 md:p-9"
                >
                  <button
                    ref={closeRef}
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-prime-muted transition-colors hover:bg-white hover:text-prime-bg sm:right-4 sm:top-4 sm:h-10 sm:w-10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-prime-cyan sm:text-[11px]">Free consultation</p>
                  <h3 className="mb-1 pr-8 font-display text-2xl font-bold sm:text-3xl">
                    Book your <span className="grad-text">30-minute call</span>
                  </h3>
                  <p className="mb-5 text-xs text-prime-muted sm:mb-7 sm:text-sm">Pick a day and time — we&apos;ll confirm by email within 24 hours.</p>
                  <ConsultationForm onDone={() => setOpen(false)} />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </ConsultationContext.Provider>
  );
}
