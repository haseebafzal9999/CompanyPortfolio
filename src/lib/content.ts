import type { LucideIcon } from "lucide-react";
import {
  PhoneCall,
  MessageSquare,
  Bot,
  HeartPulse,
  Users,
  Workflow,
  UserPlus,
  Database,
  Repeat,
  TrendingUp,
} from "lucide-react";

export const NAV_LINKS = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Tools", href: "#tools" },
  { name: "Work", href: "#work" },
  { name: "About Us", href: "#about" },
  { name: "Contact Us", href: "#contact" },
];

/** Sections shown in the right-hand HUD dots */
export const HUD_SECTIONS = [
  { id: "home", label: "Home" },
  { id: "services", label: "Services" },
  { id: "tools", label: "Tools" },
  { id: "automation", label: "Pipeline" },
  { id: "work", label: "Work" },
  { id: "why-us", label: "Why Us" },
  { id: "process", label: "Process" },
  { id: "about", label: "About" },
  { id: "roi", label: "ROI" },
  { id: "reviews", label: "Reviews" },
  { id: "contact", label: "Contact" },
];

export interface Tool {
  name: string;
  logo: string;
  desc: string;
  tag: string;
  invert?: boolean;
}

export const TOOLS: Tool[] = [
  { name: "Twilio", logo: "/logos/twilio.svg", desc: "Voice, SMS & WhatsApp communication APIs", tag: "Communication", invert: true },
  { name: "n8n", logo: "/logos/n8n.svg", desc: "Visual workflow automation engine", tag: "Automation", invert: true },
  { name: "Systeme.io", logo: "/logos/systeme-io.svg", desc: "Funnels, email & membership platform", tag: "Marketing" },
  { name: "ElevenLabs", logo: "/logos/elevenlabs.svg", desc: "AI voice generation & voice agents", tag: "AI Voice", invert: true },
  { name: "OpenAI", logo: "/logos/openai.svg", desc: "GPT models & intelligent AI capabilities", tag: "AI", invert: true },
  { name: "Gemini", logo: "/logos/googlegemini.svg", desc: "Google's multimodal AI models", tag: "AI", invert: true },
  { name: "Claude", logo: "/logos/claude.svg", desc: "Anthropic's assistant & reasoning AI", tag: "AI", invert: true },
  { name: "Zapier", logo: "/logos/zapier.svg", desc: "No-code automation across 7,000+ apps", tag: "Automation", invert: true },
  { name: "Make", logo: "/logos/make.svg", desc: "Visual scenario-based integrations", tag: "Automation", invert: true },
  { name: "Stripe", logo: "/logos/stripe.svg", desc: "Payments, billing & financial APIs", tag: "Payments", invert: true },
  { name: "Next.js", logo: "/logos/nextdotjs.svg", desc: "Production-grade React framework", tag: "Frontend", invert: true },
  { name: "FastAPI", logo: "/logos/fastapi.svg", desc: "High-performance Python APIs", tag: "Backend", invert: true },
  { name: "PostgreSQL", logo: "/logos/postgresql.svg", desc: "Reliable relational databases", tag: "Database", invert: true },
];

export type SolutionLabel = "AI" | "Automation" | "Integration";

export interface Solution {
  id: string;
  icon: LucideIcon;
  title: string;
  desc: string;
  label: SolutionLabel;
}

export const SOLUTIONS: Solution[] = [
  {
    id: "ai-voice",
    icon: PhoneCall,
    title: "AI Voice & Call Automation",
    desc: "Automated outbound and inbound calls with AI voice agents, lead qualification, appointment booking, follow-ups, and call handling with minimal human intervention.",
    label: "AI",
  },
  {
    id: "communication",
    icon: MessageSquare,
    title: "Automated Communication Systems",
    desc: "SMS, WhatsApp, and voice notifications with customer communication workflows, reminders, alerts, and automated follow-ups across every channel.",
    label: "Automation",
  },
  {
    id: "ai-support",
    icon: Bot,
    title: "AI Customer Support Agents",
    desc: "AI-powered agents that handle customer questions, qualify leads, route conversations, and automate repetitive support workflows around the clock.",
    label: "AI",
  },
  {
    id: "healthcare",
    icon: HeartPulse,
    title: "Healthcare Automation",
    desc: "Automated patient communication, appointment workflows, reminders, follow-ups, and intake processes — software automation for healthcare businesses.",
    label: "Automation",
  },
  {
    id: "crm-leads",
    icon: Users,
    title: "CRM & Lead Automation",
    desc: "Lead capture, qualification, routing, CRM updates, follow-up sequences, and automated sales workflows that keep every deal moving.",
    label: "AI",
  },
  {
    id: "workflow",
    icon: Workflow,
    title: "Business Workflow Automation",
    desc: "Connect business systems and automate repetitive processes using n8n, Zapier, APIs, and custom applications.",
    label: "Integration",
  },
];

export const WORKFLOW_STEPS = [
  { id: 1, icon: UserPlus, label: "New Lead", sub: "Inbound lead detected & verified", badge: "Trigger", log: "webhook.received  → lead verified" },
  { id: 2, icon: Bot, label: "AI Qualification", sub: "AI-powered needs analysis", badge: "Active", log: "ai.qualify        → score: HOT" },
  { id: 3, icon: Database, label: "CRM Update", sub: "Customer record created & tagged", badge: "Syncing", log: "crm.upsert        → record created" },
  { id: 4, icon: MessageSquare, label: "Twilio SMS", sub: "Targeted SMS campaign delivered", badge: "Sent", log: "twilio.sms.send   → delivered" },
  { id: 5, icon: Repeat, label: "Follow-Up", sub: "Smart follow-up sequence triggered", badge: "Active", log: "sequence.start    → follow-up queued" },
  { id: 6, icon: TrendingUp, label: "Sales Result", sub: "Revenue captured & analytics updated", badge: "Closed", log: "analytics.update  → deal closed" },
];

export const WHY_US = [
  { title: "RESULTS-DRIVEN SOLUTIONS", desc: "Every system is designed around measurable business outcomes." },
  { title: "MODERN TECHNOLOGY", desc: "Modern APIs, AI, automation, and full-stack development." },
  { title: "END-TO-END SUPPORT", desc: "From planning to deployment and ongoing improvements." },
  { title: "TIME & COST EFFICIENCY", desc: "Automation reduces repetitive work and operational overhead." },
  { title: "CLEAR COMMUNICATION", desc: "Transparent development and clear project progress." },
];

export const PROCESS = [
  { num: "01", title: "DISCOVER", desc: "Understand the business bottleneck." },
  { num: "02", title: "DESIGN", desc: "Plan the user experience and technical architecture." },
  { num: "03", title: "BUILD", desc: "Develop the web application." },
  { num: "04", title: "AUTOMATE", desc: "Connect APIs, AI, and business tools." },
  { num: "05", title: "LAUNCH & OPTIMIZE", desc: "Deploy, monitor, and continuously improve." },
];

export const REVIEWS = [
  {
    initials: "DR",
    name: "Daniel Reeves",
    role: "COO",
    company: "Summit Logistics Group",
    text: "Our team rebuilt our dispatch workflow and automated the follow-ups we used to handle by hand. What once took most of the morning now runs on its own, with a weekly report showing exactly what went out and what came back. Communication was fast and clear from start to finish.",
    rating: 5,
  },
  {
    initials: "MG",
    name: "Melissa Grant",
    role: "Founder",
    company: "BrightPath Dental",
    text: "Our front desk was losing hours every week to appointment reminders and insurance follow-ups. The team automated the whole process with SMS and AI voice calls, and no-shows dropped noticeably within the first month. They explained every step along the way and delivered ahead of schedule.",
    rating: 5,
  },
  {
    initials: "TM",
    name: "Tyler Morgan",
    role: "VP of Sales",
    company: "Clearview Realty",
    text: "We wanted AI agents that could qualify inbound leads after hours. The team built exactly that, and the handoff is seamless — the system books meetings and updates our CRM before we even look at it. Reliable, well documented, and they still check in to make sure everything runs smoothly.",
    rating: 5,
  },
  {
    initials: "PN",
    name: "Priya Natarajan",
    role: "Operations Director",
    company: "Northline E-Commerce",
    text: "Order fulfillment and support tickets used to live in two separate worlds. The automation the team built connects our store, warehouse, and support inbox, so nothing falls through the cracks anymore. The quality of the work was impressive, and they were patient getting our staff up to speed.",
    rating: 5,
  },
  {
    initials: "CB",
    name: "Chris Baldwin",
    role: "Managing Partner",
    company: "Harborview Financial",
    text: "We hired the team to build a client portal with automated document collection, and the final product was far more polished than we expected. It sends reminders, flags missing documents, and syncs everything to our CRM. Professional from kickoff to launch.",
    rating: 5,
  },
];

export const CONSULT_SERVICES = [
  "AI Voice & Call Automation",
  "Automated Communication Systems",
  "AI Customer Support Agents",
  "Healthcare Automation",
  "CRM & Lead Automation",
  "Business Workflow Automation",
  "Custom Web Application",
  "Not sure yet",
];

export const CONSULT_TIMES = ["9:00 AM", "11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM", "7:00 PM"];
