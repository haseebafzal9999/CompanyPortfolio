"use client";

import { motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Loader2, Send } from "lucide-react";
import { cn } from "@/lib/cn";

export type FormStatus = "idle" | "loading" | "success" | "error";

const base =
  "w-full rounded-xl border bg-white/[0.03] px-4 py-3 text-sm text-prime-text placeholder:text-prime-muted/60 outline-none transition-all duration-300 focus:border-prime-cyan/70 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgba(34,211,238,0.12)] disabled:opacity-60";

export function Field({
  id,
  label,
  error,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5 sm:gap-2", className)}>
      <label htmlFor={id} className="font-mono text-[11px] uppercase tracking-[0.2em] text-prime-muted">
        {label}
      </label>
      {children}
      {error && (
        <span id={`${id}-error`} role="alert" className="text-xs font-medium text-red-400">
          {error}
        </span>
      )}
    </div>
  );
}

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { invalid?: boolean }
) {
  const { invalid, className, ...rest } = props;
  return (
    <input
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(base, invalid ? "border-red-400/60" : "border-white/10", className)}
    />
  );
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { invalid?: boolean }
) {
  const { invalid, className, ...rest } = props;
  return (
    <textarea
      {...rest}
      aria-invalid={invalid || undefined}
      className={cn(base, "min-h-[110px] resize-y", invalid ? "border-red-400/60" : "border-white/10", className)}
    />
  );
}

export function Chip({
  active,
  children,
  onClick,
  disabled,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "rounded-lg border px-3 py-2 text-xs font-medium transition-all duration-300 disabled:opacity-60",
        active
          ? "border-prime-cyan/70 bg-prime-cyan/10 text-prime-cyan shadow-[0_0_18px_rgba(34,211,238,0.18)]"
          : "border-white/10 bg-white/[0.03] text-prime-muted hover:border-white/25 hover:text-prime-text"
      )}
    >
      {children}
    </button>
  );
}

export function SubmitButton({
  loading,
  children,
}: {
  loading: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className="group relative mt-2 flex w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-gradient-to-r from-prime-violet via-prime-indigo to-prime-cyan px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-white shadow-[0_10px_40px_-10px_rgba(99,102,241,0.8)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_50px_-10px_rgba(34,211,238,0.6)] disabled:cursor-not-allowed disabled:opacity-70 sm:text-[13px]"
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" /> SENDING...
        </>
      ) : (
        <>
          {children}
          <Send className="h-4 w-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
        </>
      )}
    </button>
  );
}

export function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-300" role="alert">
      <AlertCircle className="h-5 w-5 shrink-0" />
      {message}
    </div>
  );
}

export function SuccessPanel({
  title,
  message,
  buttonLabel,
  onReset,
}: {
  title: string;
  message: string;
  buttonLabel: string;
  onReset: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex min-h-[320px] flex-col items-center justify-center text-center sm:min-h-[380px]"
    >
      <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-prime-lime/20" />
        <span className="absolute inset-0 rounded-full border border-prime-lime/40 bg-prime-lime/10" />
        <CheckCircle2 className="relative h-9 w-9 text-prime-lime" />
      </div>
      <h3 className="mb-2 font-display text-2xl font-bold">{title}</h3>
      <p className="mb-8 max-w-sm text-sm leading-relaxed text-prime-muted">{message}</p>
      <button
        onClick={onReset}
        className="rounded-xl border border-white/15 px-6 py-2.5 text-sm text-prime-text transition-colors hover:border-prime-cyan/60 hover:bg-prime-cyan/5"
      >
        {buttonLabel}
      </button>
    </motion.div>
  );
}
