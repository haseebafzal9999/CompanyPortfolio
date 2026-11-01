"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Play, X } from "lucide-react";
import { CATEGORY_LABELS, PROJECTS, type Project } from "@/lib/projects";
import { useScrollLock } from "@/lib/hooks";

interface Props {
  project: Project | null;
  onClose: () => void;
  onNavigate: (p: Project) => void;
}

const WITH_VIDEO = PROJECTS.filter((p) => p.video);

export default function ProjectVideoModal({ project, onClose, onNavigate }: Props) {
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => setMounted(true), []);
  useScrollLock(!!project);

  const idx = project ? WITH_VIDEO.findIndex((p) => p.id === project.id) : -1;
  const go = useCallback(
    (dir: number) => {
      if (idx < 0) return;
      onNavigate(WITH_VIDEO[(idx + dir + WITH_VIDEO.length) % WITH_VIDEO.length]);
    },
    [idx, onNavigate]
  );

  useEffect(() => {
    if (!project) return;
    setError(false);
    const prev = document.activeElement;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    requestAnimationFrame(() => closeRef.current?.focus());
    const video = videoRef.current;
    return () => {
      document.removeEventListener("keydown", onKey);
      if (prev instanceof HTMLElement) prev.focus();
      if (video) {
        video.pause();
      }
    };
  }, [project, onClose, go]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {project && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/85 p-3 backdrop-blur-md sm:p-6"
          onClick={(e) => e.target === e.currentTarget && onClose()}
          role="dialog"
          aria-modal="true"
          aria-label={`Demo video: ${project.title}`}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, rotateX: 10 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 1400 }}
            className="relative flex max-h-full w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-black shadow-[0_40px_140px_-20px_rgba(139,92,246,0.6)]"
          >
            <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-prime-surface px-4 py-3">
              <div className="min-w-0">
                <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-prime-cyan">
                  {CATEGORY_LABELS[project.category] || project.category} · Demo {idx + 1}/{WITH_VIDEO.length}
                </p>
                <p className="truncate font-display text-base font-bold">{project.title}</p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <button onClick={() => go(-1)} aria-label="Previous demo" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/15">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => go(1)} aria-label="Next demo" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white/15">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button ref={closeRef} onClick={onClose} aria-label="Close video" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-colors hover:bg-white hover:text-prime-bg">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {error || !project.video ? (
              <div className="flex aspect-video w-full flex-col items-center justify-center gap-4 bg-prime-surface p-8 text-prime-muted">
                <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/15">
                  <Play className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium tracking-wide">Demo video coming soon</p>
              </div>
            ) : (
              <video
                key={project.id}
                ref={videoRef}
                controls
                autoPlay
                playsInline
                preload="metadata"
                poster={project.image}
                className="aspect-video max-h-[75vh] w-full bg-black object-contain"
                onError={() => setError(true)}
              >
                <source src={project.video} type="video/mp4" />
              </video>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
