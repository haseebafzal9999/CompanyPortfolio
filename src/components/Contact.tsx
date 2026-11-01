"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Clock, MessageSquareText, Rocket, Send } from "lucide-react";
import { cn } from "@/lib/cn";
import { EASE } from "@/lib/animations";
import ContactForm from "./forms/ContactForm";
import ConsultationForm from "./forms/ConsultationForm";

const NEXT = [
  { icon: Send, title: "You send a request", text: "Share your idea or pick a time that suits you." },
  { icon: Clock, title: "We reply within 24 hours", text: "A real person confirms and asks any follow-ups." },
  { icon: Rocket, title: "Free 30-minute consultation", text: "We map the bottleneck and outline a practical plan." },
];

export default function Contact() {
  const [tab, setTab] = useState<"consult" | "message">("consult");

  return (
    <section id="contact" className="relative overflow-hidden py-24 md:py-36">
      <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-prime-cyan/12 blur-[150px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[520px] w-[520px] rounded-full bg-prime-violet/20 blur-[150px]" />

      <div className="container relative mx-auto grid gap-14 px-6 md:px-12 lg:grid-cols-5 lg:gap-16">
        <div className="lg:col-span-2">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-prime-cyan">
            <span className="text-prime-violet">10</span>
            <span className="h-px w-10 bg-gradient-to-r from-prime-violet to-prime-cyan" />
            Contact Us
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
            className="mb-7 text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl"
          >
            READY TO AUTOMATE <br />
            <span className="grad-text">AND SCALE?</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="mb-10 max-w-md text-lg leading-relaxed text-prime-muted"
          >
            Let&apos;s discuss your project. Whether you need a custom web application, Twilio integration, AI agents, or a complete automation system, let&apos;s build something practical and scalable.
          </motion.p>

          <ol className="space-y-4">
            {NEXT.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.li
                  key={s.title}
                  initial={{ opacity: 0, x: -24 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.15 + i * 0.1, ease: EASE }}
                  className="flex gap-4"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-prime-cyan">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold">
                      <span className="mr-2 font-mono text-xs text-prime-violet">0{i + 1}</span>
                      {s.title}
                    </p>
                    <p className="text-sm text-prime-muted">{s.text}</p>
                  </div>
                </motion.li>
              );
            })}
          </ol>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: EASE }}
          style={{ transformPerspective: 1400 }}
          className="neon-border glass-strong relative rounded-3xl p-6 md:p-9 lg:col-span-3"
        >
          <div role="tablist" aria-label="Contact options" className="mb-8 grid grid-cols-2 gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-1">
            {(
              [
                ["consult", "Free Consultation"],
                ["message", "Send a Message"],
              ] as const
            ).map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={cn("relative rounded-xl px-3 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors", tab === key ? "text-white" : "text-prime-muted hover:text-white")}
              >
                {tab === key && <motion.span layoutId="contact-tab" className="absolute inset-0 rounded-xl bg-gradient-to-r from-prime-violet/80 to-prime-indigo/80 shadow-[0_8px_26px_-8px_rgba(139,92,246,0.9)]" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                <span className="relative flex items-center justify-center gap-2">
                  {key === "message" && <MessageSquareText className="h-3.5 w-3.5" />}
                  {label}
                </span>
              </button>
            ))}
          </div>

          {tab === "consult" ? <ConsultationForm /> : <ContactForm />}
        </motion.div>
      </div>
    </section>
  );
}
