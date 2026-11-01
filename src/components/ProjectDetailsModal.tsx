"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, CheckCircle2, ExternalLink, FileText, Play, X } from "lucide-react";
import { CATEGORY_LABELS, type Project } from "@/lib/projects";
import { useScrollLock } from "@/lib/hooks";

interface Props {
  project: Project | null;
  onClose: () => void;
  onWatchDemo: (p: Project) => void;
  onConsult: () => void;
}

export default function ProjectDetailsModal({ project, onClose, onWatchDemo, onConsult }: Props) {
  const [mounted, setMounted] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);
  useScrollLock(!!project);

  useEffect(() => {
    if (!project) return;
    const prev = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && overlayRef.current) {
        const f = overlayRef.current.querySelectorAll<HTMLElement>('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeRef.current?.focus());
    return () => {
      document.removeEventListener("keydown", onKey);
      if (prev instanceof HTMLElement) prev.focus();
    };
  }, [project, onClose]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/75 p-3 backdrop-blur-md sm:p-6"
          onClick={(e) => e.target === overlayRef.current && onClose()}
          role="dialog"
          aria-modal="true"
          aria-label={`Project details: ${project.title}`}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, rotateX: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1400, maxHeight: "min(92vh, calc(100dvh - 24px))" }}
            className="glass-strong relative flex w-full max-w-3xl flex-col overflow-hidden rounded-3xl shadow-[0_40px_140px_-20px_rgba(99,102,241,0.55)]"
          >
            <button
              ref={closeRef}
              onClick={onClose}
              aria-label="Close details"
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-black/60 backdrop-blur transition-colors hover:bg-white hover:text-prime-bg"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="overflow-y-auto overscroll-contain">
              {project.image && (
                <div className="relative aspect-video w-full overflow-hidden bg-prime-card">
                  <Image src={project.image} alt={project.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-prime-surface via-prime-surface/20 to-transparent" />
                  {project.video && (
                    <button
                      onClick={() => {
                        onWatchDemo(project);
                      }}
                      aria-label="Watch demo"
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 shadow-[0_0_40px_rgba(139,92,246,0.7)] backdrop-blur-md transition-transform hover:scale-110 hover:bg-prime-violet">
                        <Play className="ml-1 h-6 w-6 fill-current" />
                      </span>
                    </button>
                  )}
                </div>
              )}

              <div className="p-6 md:p-10">
                <div className="mb-3 flex flex-wrap items-center gap-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em]">
                  <span className="text-prime-cyan">{CATEGORY_LABELS[project.category] || project.category}</span>
                  <span className="text-prime-muted/60">{project.status}</span>
                </div>

                <h2 className="mb-5 font-display text-3xl font-bold leading-tight md:text-4xl">{project.title}</h2>
                <p className="mb-8 text-base leading-relaxed text-prime-muted md:text-lg">{project.shortDescription}</p>

                {project.fullDescription && (
                  <div className="mb-8">
                    <h3 className="mb-3 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-prime-violet">About</h3>
                    <div className="space-y-3 text-sm leading-relaxed text-prime-muted">
                      {project.fullDescription.split(/\n\n+/).map((para, i) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>
                )}

                {project.features.length > 0 && (
                  <div className="mb-8">
                    <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-prime-violet">Key Features</h3>
                    <ul className="grid gap-3 sm:grid-cols-2">
                      {project.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-prime-muted">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-prime-lime" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {project.technologies.length > 0 && (
                  <div className="mb-8">
                    <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-prime-violet">Technologies</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((t) => (
                        <span key={t} className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-prime-muted">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {project.results.length > 0 && (
                  <div className="mb-8">
                    <h3 className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.22em] text-prime-violet">Results</h3>
                    <ul className="flex flex-col gap-2">
                      {project.results.map((r, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-prime-muted">
                          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-prime-cyan" />
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 border-t border-white/10 pt-6">
                  {project.video && (
                    <button
                      onClick={() => onWatchDemo(project)}
                      className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-prime-bg transition-transform hover:-translate-y-0.5"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" /> Watch Demo
                    </button>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider transition-colors hover:border-prime-cyan hover:text-prime-cyan">
                      <ExternalLink className="h-3.5 w-3.5" /> Live Demo
                    </a>
                  )}
                  {project.caseStudyUrl && (
                    <a href={project.caseStudyUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider transition-colors hover:border-prime-cyan hover:text-prime-cyan">
                      <FileText className="h-3.5 w-3.5" /> Case Study
                    </a>
                  )}
                  <button
                    onClick={onConsult}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-prime-violet to-prime-cyan px-5 py-3 font-mono text-xs font-semibold uppercase tracking-wider text-white transition-transform hover:-translate-y-0.5"
                  >
                    <CalendarCheck className="h-3.5 w-3.5" /> Discuss a similar project
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
