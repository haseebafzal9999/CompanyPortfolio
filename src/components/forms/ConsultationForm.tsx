"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarDays, Clock, Globe } from "lucide-react";
import { CONSULT_SERVICES, CONSULT_TIMES } from "@/lib/content";
import { EMAIL_RE, sendForm } from "@/lib/emailjs";
import { Chip, ErrorBanner, Field, FormStatus, SubmitButton, SuccessPanel, TextArea, TextInput } from "./fields";

const EMPTY = { name: "", email: "", phone: "", message: "", website: "" };

function nextDays(count: number) {
  const out: { label: string; value: string; weekday: string; day: string }[] = [];
  const d = new Date();
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    out.push({
      label: d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      value: d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      weekday: d.toLocaleDateString("en-US", { weekday: "short" }),
      day: d.toLocaleDateString("en-US", { day: "numeric" }),
    });
  }
  return out;
}

export default function ConsultationForm({ onDone }: { onDone?: () => void }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [via, setVia] = useState<"emailjs" | "mailto">("emailjs");
  const [data, setData] = useState(EMPTY);
  const [service, setService] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [days, setDays] = useState<ReturnType<typeof nextDays>>([]);
  const [tz, setTz] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setDays(nextDays(8));
    try {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      setTz("");
    }
  }, []);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Name is required";
    if (!data.email.trim()) e.email = "Email is required";
    else if (!EMAIL_RE.test(data.email.trim())) e.email = "Invalid email format";
    if (!date) e.date = "Pick a day";
    if (!time) e.time = "Pick a time";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const reset = () => {
    setData(EMPTY);
    setService("");
    setDate("");
    setTime("");
    setStatus("idle");
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (data.website) {
      setStatus("success");
      return;
    }
    setStatus("loading");
    try {
      const res = await sendForm("consultation", {
        name: data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        service,
        date,
        time: tz ? `${time} (${tz})` : time,
        message: data.message.trim() || "(no additional details provided)",
      });
      setVia(res.via);
      setStatus("success");
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };

  // Prevent hydration mismatch by not rendering date/time selectors until client-side
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Render placeholder skeleton on server to prevent hydration mismatch
    return (
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-white/5" />
          </div>
          <div className="flex flex-col gap-1.5 sm:gap-2">
            <div className="h-3 w-20 animate-pulse rounded bg-white/5" />
            <div className="h-11 w-full animate-pulse rounded-xl bg-white/5" />
          </div>
        </div>
        <div className="h-32 w-full animate-pulse rounded-xl bg-white/5" />
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {status === "success" ? (
        <SuccessPanel
          key="ok"
          title="Consultation Requested"
          message={
            via === "mailto"
              ? "Your email app opened with the booking details ready — press Send to confirm your slot."
              : "Thank you! We received your request and will confirm your free 30-minute consultation within 24 hours."
          }
          buttonLabel={onDone ? "Close" : "Book another slot"}
          onReset={() => {
            reset();
            onDone?.();
          }}
        />
      ) : (
        <motion.form key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={onSubmit} noValidate className="flex flex-col gap-4 sm:gap-5">
          {status === "error" && <ErrorBanner message="Something went wrong. Please try again later." />}

          <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
            <Field id="k-name" label="Name *" error={errors.name}>
              <TextInput id="k-name" name="name" value={data.name} onChange={onChange} disabled={status === "loading"} invalid={!!errors.name} placeholder="Your full name" autoComplete="name" />
            </Field>
            <Field id="k-email" label="Email *" error={errors.email}>
              <TextInput id="k-email" name="email" type="email" value={data.email} onChange={onChange} disabled={status === "loading"} invalid={!!errors.email} placeholder="you@company.com" autoComplete="email" />
            </Field>
          </div>

          <Field id="k-phone" label="Phone / WhatsApp (Optional)">
            <TextInput id="k-phone" name="phone" type="tel" value={data.phone} onChange={onChange} disabled={status === "loading"} placeholder="+1 555 000 0000" autoComplete="tel" />
          </Field>

          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-prime-muted">What do you need? (Optional)</span>
            <div className="flex flex-wrap gap-2">
              {CONSULT_SERVICES.map((s) => (
                <Chip key={s} active={service === s} disabled={status === "loading"} onClick={() => setService(service === s ? "" : s)}>
                  {s}
                </Chip>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-prime-muted">
              <CalendarDays className="h-3.5 w-3.5 text-prime-violet" /> Preferred day *
            </span>
            <div className="grid grid-cols-4 gap-1.5 sm:grid-cols-8 sm:gap-2">
              {days.map((d) => (
                <button
                  key={d.value}
                  type="button"
                  disabled={status === "loading"}
                  onClick={() => {
                    setDate(d.value);
                    setErrors((p) => ({ ...p, date: "" }));
                  }}
                  aria-pressed={date === d.value}
                  className={`flex flex-col items-center rounded-lg border px-1 py-2 text-center transition-all duration-300 sm:rounded-xl sm:px-2 sm:py-2.5 ${
                    date === d.value
                      ? "border-prime-violet/70 bg-prime-violet/15 text-white shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                      : "border-white/10 bg-white/[0.03] text-prime-muted hover:border-white/25 hover:text-prime-text"
                  }`}
                >
                  <span className="font-mono text-[8px] uppercase tracking-widest sm:text-[9px]">{d.weekday}</span>
                  <span className="font-display text-base font-bold leading-tight sm:text-lg">{d.day}</span>
                </button>
              ))}
            </div>
            {errors.date && <span role="alert" className="text-xs font-medium text-red-400">{errors.date}</span>}
          </div>

          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-prime-muted">
              <Clock className="h-3.5 w-3.5 text-prime-violet" /> Preferred time *
            </span>
            <div className="flex flex-wrap gap-2">
              {CONSULT_TIMES.map((t) => (
                <Chip
                  key={t}
                  active={time === t}
                  disabled={status === "loading"}
                  onClick={() => {
                    setTime(t);
                    setErrors((p) => ({ ...p, time: "" }));
                  }}
                >
                  {t}
                </Chip>
              ))}
            </div>
            {tz && (
              <span className="flex items-center gap-1.5 text-[11px] text-prime-muted/70">
                <Globe className="h-3 w-3" /> Times shown in your timezone ({tz})
              </span>
            )}
            {errors.time && <span role="alert" className="text-xs font-medium text-red-400">{errors.time}</span>}
          </div>

          <Field id="k-msg" label="Project details (Optional)">
            <TextArea id="k-msg" name="message" rows={3} value={data.message} onChange={onChange} disabled={status === "loading"} placeholder="A few lines about what you want to automate..." />
          </Field>

          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={onChange} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true" />

          <SubmitButton loading={status === "loading"}>
            <span className="hidden lg:inline">SCHEDULE A FREE 30-MINUTE CONSULTATION</span>
            <span className="lg:hidden">SCHEDULE A MEETING</span>
          </SubmitButton>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
