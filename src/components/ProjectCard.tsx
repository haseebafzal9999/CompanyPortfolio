"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Eye, ExternalLink, Play } from "lucide-react";
import { CATEGORY_LABELS, type Project } from "@/lib/projects";
import { cn } from "@/lib/cn";
import Tilt from "./ui/Tilt";

interface Props {
  project: Project;
  onViewDetails: (p: Project) => void;
  onWatchDemo: (p: Project) => void;
}

const STATUS: Record<string, string> = {
  DEMO: "border-prime-amber/40 bg-prime-amber/15 text-amber-300",
  "IN DEVELOPMENT": "border-prime-cyan/40 bg-prime-cyan/15 text-cyan-300",
  LAUNCHED: "border-prime-lime/40 bg-prime-lime/15 text-lime-300",
  MAINTENANCE: "border-white/20 bg-white/10 text-prime-muted",
};

/** Muted looping preview that only loads once the card is hovered (desktop). */
function HoverPreview({ src, hover }: { src: string; hover: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (hover) setArmed(true);
  }, [hover]);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (hover) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [hover, armed]);

  if (!armed) return null;
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={cn("absolute inset-0 h-full w-full object-cover transition-opacity duration-500", hover ? "opacity-100" : "opacity-0")}
    />
  );
}

export default function ProjectCard({ project, onViewDetails, onWatchDemo }: Props) {
  const [hover, setHover] = useState(false);

  return (
    <Tilt max={7} glow="rgba(34,211,238,0.18)" className="glass flex flex-col overflow-hidden rounded-3xl">
      {/* media */}
      <div
        className="relative aspect-video w-full overflow-hidden bg-prime-card"
        style={{ transform: "translateZ(0)" }}
        onPointerEnter={(e) => e.pointerType === "mouse" && setHover(true)}
        onPointerLeave={() => setHover(false)}
      >
        {project.image && (
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn("object-cover transition-transform duration-700 ease-out", hover && "scale-105")}
          />
        )}
        {project.video && <HoverPreview src={project.video} hover={hover} />}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-prime-bg/80 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />

        <span className={cn("absolute left-3 top-3 rounded-full border px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.16em] backdrop-blur", STATUS[project.status] || STATUS.DEMO)}>
          {project.status}
        </span>

        {project.video && (
          <button
            onClick={() => onWatchDemo(project)}
            aria-label={`Watch demo for ${project.title}`}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white opacity-90 shadow-[0_0_40px_rgba(139,92,246,0.7)] backdrop-blur-md transition-all duration-500 hover:scale-110 hover:bg-prime-violet md:opacity-0 md:group-hover:opacity-100">
              <Play className="ml-1 h-6 w-6 fill-current" />
            </span>
          </button>
        )}
      </div>

      {/* body */}
      <div className="flex flex-1 flex-col p-6 md:p-7" style={{ transformStyle: "preserve-3d" }}>
        <span className="mb-3 font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-prime-cyan" style={{ transform: "translateZ(18px)" }}>
          {CATEGORY_LABELS[project.category] || project.category}
        </span>
        <h3 className="mb-3 font-display text-xl font-bold leading-tight md:text-[22px]" style={{ transform: "translateZ(30px)" }}>
          {project.title}
        </h3>
        <p className="mb-5 line-clamp-3 text-sm leading-relaxed text-prime-muted" style={{ transform: "translateZ(12px)" }}>
          {project.shortDescription}
        </p>

        <div className="mb-6 flex min-h-[28px] flex-wrap gap-2" style={{ transform: "translateZ(20px)" }}>
          {project.technologies.slice(0, 4).map((t) => (
            <span key={t} className="rounded-md border border-white/10 bg-white/[0.04] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-prime-muted">
              {t}
            </span>
          ))}
          {project.technologies.length > 4 && (
            <span className="px-1.5 py-1 font-mono text-[10px] text-prime-muted/60">+{project.technologies.length - 4}</span>
          )}
        </div>

        <div className="mt-auto flex flex-wrap gap-2" style={{ transform: "translateZ(26px)" }}>
          {project.video ? (
            <button
              onClick={() => onWatchDemo(project)}
              aria-label={`Watch demo for ${project.title}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors hover:border-prime-cyan hover:text-prime-cyan"
            >
              <Play className="h-3.5 w-3.5" /> Watch Demo
            </button>
          ) : (
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/5 px-4 py-2.5 font-mono text-[11px] uppercase tracking-wider text-prime-muted/40">
              <Play className="h-3.5 w-3.5" /> Demo coming soon
            </span>
          )}
          <button
            onClick={() => onViewDetails(project)}
            aria-label={`View details for ${project.title}`}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-prime-violet to-prime-indigo px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider text-white shadow-[0_8px_26px_-8px_rgba(139,92,246,0.9)] transition-transform hover:-translate-y-0.5"
          >
            <Eye className="h-3.5 w-3.5" /> View Details
          </button>
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Live demo for ${project.title}`}
              className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-wider transition-colors hover:border-prime-cyan hover:text-prime-cyan"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Live Demo
            </a>
          )}
        </div>
      </div>
    </Tilt>
  );
}
