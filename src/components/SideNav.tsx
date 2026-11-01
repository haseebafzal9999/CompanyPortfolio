"use client";

import { HUD_SECTIONS } from "@/lib/content";
import { scrollToId, useActiveSection } from "@/lib/hooks";
import { cn } from "@/lib/cn";

const IDS = HUD_SECTIONS.map((s) => s.id);

/** Right-edge section dots (desktop). */
export default function SideNav() {
  const active = useActiveSection(IDS);
  return (
    <nav aria-label="Section navigation" className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 xl:block">
      <ul className="flex flex-col items-end gap-3.5">
        {HUD_SECTIONS.map((s) => {
          const on = active === s.id;
          return (
            <li key={s.id}>
              <button
                onClick={() => scrollToId(s.id)}
                aria-label={`Go to ${s.label}`}
                aria-current={on ? "true" : undefined}
                className="group flex items-center gap-3"
              >
                <span
                  className={cn(
                    "translate-x-2 font-mono text-[10px] uppercase tracking-[0.2em] opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100",
                    on ? "text-prime-cyan" : "text-prime-muted"
                  )}
                >
                  {s.label}
                </span>
                <span
                  className={cn(
                    "block rounded-full transition-all duration-300",
                    on
                      ? "h-6 w-1.5 bg-gradient-to-b from-prime-violet to-prime-cyan shadow-[0_0_12px_rgba(34,211,238,0.8)]"
                      : "h-1.5 w-1.5 bg-white/25 group-hover:bg-white/60"
                  )}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
