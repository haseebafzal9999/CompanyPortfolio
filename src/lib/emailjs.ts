import emailjs from "@emailjs/browser";

/* ============================================================================
 *  EmailJS configuration  (free plan works)  —  https://www.emailjs.com
 *
 *  Put your keys in  .env.local  (recommended)  OR paste them below instead of
 *  the "YOUR_..." placeholders. See README.md for the 5-minute setup.
 * ========================================================================== */

/** Every consultation request and contact-form message is delivered here. */
export const CONTACT_EMAIL = "haseebafzl99999@gmail.com";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || "YOUR_SERVICE_ID";
const CONTACT_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || "YOUR_TEMPLATE_ID";
// Optional: a second template just for consultations. Falls back to the main one.
const CONSULTATION_TEMPLATE_ID =
  process.env.NEXT_PUBLIC_EMAILJS_CONSULTATION_TEMPLATE_ID || CONTACT_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || "YOUR_PUBLIC_KEY";

const isSet = (v: string) => Boolean(v) && !v.startsWith("YOUR_");

export function isEmailJsConfigured() {
  return isSet(SERVICE_ID) && isSet(CONTACT_TEMPLATE_ID) && isSet(PUBLIC_KEY);
}

export type FormKind = "contact" | "consultation";

export interface MailFields {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  service?: string;
  date?: string;
  time?: string;
  message: string;
}

export interface SendResult {
  /** "emailjs" = delivered through EmailJS. "mailto" = EmailJS not configured yet, opened the visitor's mail app. */
  via: "emailjs" | "mailto";
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildParams(kind: FormKind, f: MailFields) {
  const label = kind === "consultation" ? "Consultation Booking" : "Contact Form";
  return {
    to_email: CONTACT_EMAIL,
    to_name: "Portfolio Team",
    form_type: label,
    subject: `[Portfolio] ${label} — ${f.name}`,
    from_name: f.name,
    from_email: f.email,
    reply_to: f.email,
    company: f.company || "(not provided)",
    phone: f.phone || "(not provided)",
    service: f.service || "(not specified)",
    preferred_date: f.date || "(not specified)",
    preferred_time: f.time || "(not specified)",
    message: f.message,
    sent_at: new Date().toLocaleString(),
    page_url: typeof window !== "undefined" ? window.location.href : "",
  };
}

function buildMailto(kind: FormKind, f: MailFields) {
  const p = buildParams(kind, f);
  const body = [
    `Type: ${p.form_type}`,
    `Name: ${p.from_name}`,
    `Email: ${p.from_email}`,
    `Company: ${p.company}`,
    `Phone: ${p.phone}`,
    `Service: ${p.service}`,
    `Preferred date: ${p.preferred_date}`,
    `Preferred time: ${p.preferred_time}`,
    "",
    "Message:",
    p.message,
  ].join("\n");
  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(p.subject)}&body=${encodeURIComponent(body)}`;
}

export async function sendForm(kind: FormKind, fields: MailFields): Promise<SendResult> {
  if (!isEmailJsConfigured()) {
    // Keeps the form usable before EmailJS keys are added.
    window.location.href = buildMailto(kind, fields);
    return { via: "mailto" };
  }

  await emailjs.send(
    SERVICE_ID,
    kind === "consultation" ? CONSULTATION_TEMPLATE_ID : CONTACT_TEMPLATE_ID,
    buildParams(kind, fields),
    { publicKey: PUBLIC_KEY }
  );
  return { via: "emailjs" };
}
