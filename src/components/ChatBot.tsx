"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Send, X } from "lucide-react";
import { SOLUTIONS, TOOLS, PROCESS } from "@/lib/content";
import { PROJECTS } from "@/lib/projects";
import { scrollToId } from "@/lib/hooks";
import { useConsultation } from "./ConsultationProvider";

type Action = { type: "scroll"; id: string; label: string } | { type: "consult"; label: string };
interface Msg {
  id: number;
  from: "bot" | "user";
  text: string;
  actions?: Action[];
}

const QUICK = ["What do you build?", "Show me your work", "Tools you use", "How does it work?", "Book a consultation"];

function answer(q: string): { text: string; actions?: Action[] } {
  switch (q) {
    case "What do you build?":
      return {
        text: "We build: " + SOLUTIONS.map((s) => s.title).join(" · ") + ".",
        actions: [{ type: "scroll", id: "services", label: "See services" }],
      };
    case "Show me your work":
      return {
        text: `We have ${PROJECTS.length} demo projects with walkthrough videos — ${PROJECTS.map((p) => p.title).join(", ")}.`,
        actions: [{ type: "scroll", id: "work", label: "Open our work" }],
      };
    case "Tools you use":
      return {
        text: "Our daily stack: " + TOOLS.map((t) => t.name).join(", ") + ".",
        actions: [{ type: "scroll", id: "tools", label: "See the tool ring" }],
      };
    case "How does it work?":
      return {
        text: "Our process: " + PROCESS.map((p) => `${p.num} ${p.title}`).join(" → ") + ".",
        actions: [{ type: "scroll", id: "process", label: "View the process" }],
      };
    case "Book a consultation":
      return {
        text: "Great — pick a day and time and we'll confirm within 24 hours. The 30-minute consultation is free.",
        actions: [{ type: "consult", label: "Book now" }],
      };
    default:
      return {
        text: "I can answer a few common questions — pick one below, or book a free consultation and a human will take it from there.",
        actions: [{ type: "consult", label: "Book a consultation" }],
      };
  }
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [nudge, setNudge] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([
    { id: 0, from: "bot", text: "Hi, I'm your assistant 👋 Ask me about our services, projects or process." },
  ]);
  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);
  const consult = useConsultation();

  // Proactive nudge once, a few seconds after load
  useEffect(() => {
    const t = setTimeout(() => setNudge(true), 9000);
    const h = setTimeout(() => setNudge(false), 17000);
    return () => {
      clearTimeout(t);
      clearTimeout(h);
    };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [msgs, typing, open]);

  const ask = (q: string) => {
    if (!q.trim() || typing) return;
    const uid = idRef.current++;
    setMsgs((m) => [...m, { id: uid, from: "user", text: q }]);
    setTyping(true);
    const a = answer(q);
    setTimeout(() => {
      setMsgs((m) => [...m, { id: idRef.current++, from: "bot", ...a }]);
      setTyping(false);
    }, 750);
  };

  const run = (a: Action) => {
    if (a.type === "scroll") {
      setOpen(false);
      scrollToId(a.id);
    } else {
      setOpen(false);
      consult.open();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-[55] flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.92, rotateX: 12 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ transformPerspective: 900, transformOrigin: "bottom right" }}
            className="glass-strong flex h-[480px] max-h-[calc(100dvh-110px)] w-[calc(100vw-40px)] max-w-[370px] flex-col overflow-hidden rounded-3xl shadow-[0_30px_100px_-20px_rgba(99,102,241,0.7)]"
            role="dialog"
            aria-label="Portfolio assistant"
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-prime-violet/30 to-prime-cyan/20 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-prime-violet to-prime-cyan">
                  <Bot className="h-5 w-5 text-white" />
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-prime-bg bg-prime-lime" />
                </span>
                <div>
                  <p className="font-display text-sm font-bold">Assistant</p>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-prime-lime">online</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close assistant" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              {msgs.map((m) => (
                <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
                  <div className={m.from === "user" ? "max-w-[85%] rounded-2xl rounded-br-md bg-gradient-to-r from-prime-violet to-prime-indigo px-4 py-2.5 text-sm" : "max-w-[90%] rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-2.5 text-sm text-prime-text/90"}>
                    <p className="leading-relaxed">{m.text}</p>
                    {m.actions && (
                      <div className="mt-2.5 flex flex-wrap gap-2">
                        {m.actions.map((a) => (
                          <button key={a.label} onClick={() => run(a)} className="rounded-lg border border-prime-cyan/40 bg-prime-cyan/10 px-3 py-1.5 font-mono text-[11px] font-semibold text-prime-cyan transition-colors hover:bg-prime-cyan hover:text-prime-bg">
                            {a.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="flex gap-1 rounded-2xl rounded-bl-md border border-white/10 bg-white/[0.05] px-4 py-3">
                    {[0, 1, 2].map((i) => (
                      <motion.span key={i} animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15 }} className="h-1.5 w-1.5 rounded-full bg-prime-cyan" />
                    ))}
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="scrollbar-none mb-3 flex gap-2 overflow-x-auto">
                {QUICK.map((q) => (
                  <button key={q} onClick={() => ask(q)} disabled={typing} className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] text-prime-muted transition-colors hover:border-prime-cyan/50 hover:text-prime-cyan disabled:opacity-50">
                    {q}
                  </button>
                ))}
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  ask(input);
                  setInput("");
                }}
                className="flex items-center gap-2"
              >
                <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask something..." aria-label="Message assistant" className="flex-1 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-sm outline-none transition-colors placeholder:text-prime-muted/60 focus:border-prime-cyan/60" />
                <button type="submit" aria-label="Send" disabled={typing} className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-prime-violet to-prime-cyan disabled:opacity-60">
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative">
        <AnimatePresence>
          {nudge && !open && (
            <motion.div initial={{ opacity: 0, x: 10, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 10 }} className="glass-strong absolute bottom-2 right-16 hidden whitespace-nowrap rounded-xl px-4 py-2.5 text-xs sm:block">
              Need help? Ask our <b className="text-prime-cyan">assistant</b> ✨
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => {
            setOpen((o) => !o);
            setNudge(false);
          }}
          aria-label={open ? "Close assistant" : "Open assistant"}
          className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-prime-violet to-prime-cyan shadow-[0_12px_40px_-8px_rgba(139,92,246,0.9)] transition-transform duration-300 hover:-translate-y-1 hover:scale-105"
        >
          {!open && <span className="absolute inset-0 animate-ping rounded-2xl bg-prime-violet/30" />}
          <span className="relative">{open ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}</span>
        </button>
      </div>
    </div>
  );
}
