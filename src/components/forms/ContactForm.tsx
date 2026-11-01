"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EMAIL_RE, sendForm } from "@/lib/emailjs";
import { ErrorBanner, Field, FormStatus, SubmitButton, SuccessPanel, TextArea, TextInput } from "./fields";

const EMPTY = { name: "", email: "", company: "", description: "", website: "" };

export default function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [via, setVia] = useState<"emailjs" | "mailto">("emailjs");
  const [data, setData] = useState(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!data.name.trim()) e.name = "Name is required";
    if (!data.email.trim()) e.email = "Email is required";
    else if (!EMAIL_RE.test(data.email.trim())) e.email = "Invalid email format";
    if (!data.description.trim()) e.description = "Project description is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    // Honeypot: bots fill the hidden field, humans never see it.
    if (data.website) {
      setStatus("success");
      setData(EMPTY);
      return;
    }
    setStatus("loading");
    try {
      const res = await sendForm("contact", {
        name: data.name.trim(),
        email: data.email.trim(),
        company: data.company.trim(),
        message: data.description.trim(),
      });
      setVia(res.via);
      setStatus("success");
      setData(EMPTY);
    } catch (err) {
      console.error("EmailJS error:", err);
      setStatus("error");
    }
  };
  
  // Prevent hydration mismatch
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
          title="Message Sent"
          message={
            via === "mailto"
              ? "Your email app opened with the message ready — press Send to deliver it."
              : "Thank you for reaching out. We will get back to you within 24 hours to schedule your consultation."
          }
          buttonLabel="Send another message"
          onReset={() => setStatus("idle")}
        />
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          {status === "error" && <ErrorBanner message="Something went wrong. Please try again later." />}

          <div className="grid gap-5 md:grid-cols-2">
            <Field id="c-name" label="Name *" error={errors.name}>
              <TextInput id="c-name" name="name" value={data.name} onChange={onChange} disabled={status === "loading"} invalid={!!errors.name} placeholder="Your full name" autoComplete="name" />
            </Field>
            <Field id="c-email" label="Email *" error={errors.email}>
              <TextInput id="c-email" name="email" type="email" value={data.email} onChange={onChange} disabled={status === "loading"} invalid={!!errors.email} placeholder="you@company.com" autoComplete="email" />
            </Field>
          </div>

          <Field id="c-company" label="Company (Optional)">
            <TextInput id="c-company" name="company" value={data.company} onChange={onChange} disabled={status === "loading"} placeholder="Your company" autoComplete="organization" />
          </Field>

          <Field id="c-desc" label="Project Description *" error={errors.description}>
            <TextArea id="c-desc" name="description" rows={4} value={data.description} onChange={onChange} disabled={status === "loading"} invalid={!!errors.description} placeholder="Tell us what you want to automate or build..." />
          </Field>

          {/* honeypot */}
          <input type="text" name="website" tabIndex={-1} autoComplete="off" value={data.website} onChange={onChange} className="absolute -left-[9999px] h-0 w-0 opacity-0" aria-hidden="true" />

          <SubmitButton loading={status === "loading"}>SEND MESSAGE</SubmitButton>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
