"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CATEGORY_LABELS, PROJECTS, getProjectCategories, type Project } from "@/lib/projects";
import { cn } from "@/lib/cn";
import SectionHeading from "./ui/SectionHeading";
import ProjectCard from "./ProjectCard";
import ProjectDetailsModal from "./ProjectDetailsModal";
import ProjectVideoModal from "./ProjectVideoModal";
import { useConsultation } from "./ConsultationProvider";

export default function Projects() {
  const [category, setCategory] = useState("All");
  const [selected, setSelected] = useState<Project | null>(null);
  const [video, setVideo] = useState<Project | null>(null);
  const { open } = useConsultation();

  const categories = useMemo(() => ["All", ...getProjectCategories()], []);
  const filtered = useMemo(() => (category === "All" ? PROJECTS : PROJECTS.filter((p) => p.category === category)), [category]);

  return (
    <section id="work" className="relative overflow-hidden border-t border-white/[0.06] bg-prime-surface/40 py-24 md:py-36">
      <div className="pointer-events-none absolute -left-40 top-20 h-[460px] w-[460px] rounded-full bg-prime-cyan/10 blur-[140px]" />
      <div className="pointer-events-none absolute -right-40 bottom-20 h-[460px] w-[460px] rounded-full bg-prime-violet/15 blur-[140px]" />

      <div className="container relative mx-auto px-6 md:px-12">
        <SectionHeading
          index="04"
          eyebrow="Our Work"
          title={
            <>
              FEATURED <span className="grad-text">PROJECTS</span>
            </>
          }
          sub="Explore our portfolio of automation solutions, web applications, and intelligent systems built for modern businesses."
        />

        {/* filters */}
        <div className="scrollbar-none -mx-6 -my-4 mb-6 overflow-x-auto px-6 py-4 md:mx-0 md:mb-8 md:px-0">
          <div className="flex min-w-max gap-2">
            {categories.map((cat) => {
              const on = category === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  aria-pressed={on}
                  className={cn(
                    "relative whitespace-nowrap rounded-full border px-5 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors duration-300",
                    on ? "border-transparent text-white" : "border-white/10 text-prime-muted hover:border-white/30 hover:text-white"
                  )}
                >
                  {on && (
                    <motion.span
                      layoutId="filter-pill"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-prime-violet to-prime-cyan shadow-[0_8px_30px_-8px_rgba(139,92,246,0.9)]"
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    />
                  )}
                  <span className="relative">{cat === "All" ? "ALL" : CATEGORY_LABELS[cat] || cat}</span>
                </button>
              );
            })}
          </div>
        </div>

        <motion.div layout className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.length > 0 ? (
              filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  layout
                  initial={{ opacity: 0, y: 40, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-60px" }}
                  exit={{ opacity: 0, y: -20, scale: 0.96 }}
                  transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full"
                >
                  <ProjectCard project={project} onViewDetails={setSelected} onWatchDemo={setVideo} />
                </motion.div>
              ))
            ) : (
              <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="col-span-full py-16 text-center text-sm text-prime-muted">
                No projects found in this category.
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <ProjectDetailsModal
        project={selected}
        onClose={() => setSelected(null)}
        onWatchDemo={(p) => {
          setSelected(null);
          setVideo(p);
        }}
        onConsult={() => {
          setSelected(null);
          open();
        }}
      />
      <ProjectVideoModal project={video} onClose={() => setVideo(null)} onNavigate={setVideo} />
    </section>
  );
}
