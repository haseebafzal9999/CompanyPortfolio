export type ServiceType = "twilio" | "zapier" | "ai-agents" | "systeme" | "web-app" | "ai-automation";

export interface Project {
  id: string;
  title: string;
  category: string;
  serviceType: ServiceType;
  status: "DEMO" | "IN DEVELOPMENT" | "LAUNCHED" | "MAINTENANCE";
  shortDescription: string;
  fullDescription?: string;
  technologies: string[];
  features: string[];
  results: string[];
  image?: string;
  video?: string;
  liveUrl?: string;
  caseStudyUrl?: string;
}

export const CATEGORY_LABELS: Record<string, string> = {
  "Twilio Automation": "TWILIO",
  "Zapier Automation": "ZAPIER",
  "AI Agents": "AI AGENTS",
  "Systeme.io Automation": "SYSTEME.IO",
  "Custom Web Applications": "WEB APPS",
  "AI + Business Automation": "AI + AUTOMATION",
};

export const CATEGORY_ORDER = [
  "Twilio Automation",
  "Zapier Automation",
  "AI Agents",
  "Systeme.io Automation",
  "Custom Web Applications",
  "AI + Business Automation",
];

export const PROJECTS: Project[] = [
  // === Twilio Automation ===
  {
    id: "connecthub",
    title: "ConnectHub Communication Platform",
    category: "Twilio Automation",
    serviceType: "twilio",
    status: "DEMO",
    shortDescription:
      "A centralized customer communication platform combining voice calls, SMS conversations, and CRM-style customer management into a single modern interface built with Twilio, ASP.NET Core, React, and PostgreSQL.",
    fullDescription:
      "ConnectHub is a centralized customer communication platform built to demonstrate how modern businesses can manage voice calls, SMS conversations, and customer information from a single unified interface. The platform combines ASP.NET Core Web API, React, PostgreSQL, and Twilio to deliver a CRM-like communication experience where every interaction is tracked, organized, and easily accessible.\n\nInstead of switching between multiple tools, employees can make and receive phone calls, exchange SMS messages, view customer history, monitor recent interactions, and access real-time communication statistics through a modern dashboard. Every interaction is associated with a customer profile, enabling faster support, improved sales engagement, and complete visibility into communication history.\n\nThe project demonstrates incoming call recognition, outgoing calling, SMS conversations, customer management, analytics, reporting, team performance monitoring, and a scalable architecture suitable for business communication systems.",
    technologies: [
      "Twilio Voice API",
      "Twilio SMS API",
      "ASP.NET Core Web API",
      "C#",
      "Entity Framework Core",
      "React",
      "Vite",
      "React Router",
      "CSS3",
      "Recharts",
      "Lucide React",
      "PostgreSQL",
      "Swagger",
      "Postman",
      "Repository Pattern",
      "RESTful APIs",
    ],
    features: [
      "Centralized customer directory with profiles and communication history",
      "Automatic incoming caller identification by phone number",
      "Outgoing call management from customer profiles",
      "Modern SMS conversation center with chat history and delivery status",
      "KPI dashboard with charts and operational metrics",
      "Analytics and downloadable reporting for business insights",
      "Team performance monitoring with agent rankings and response times",
      "System configuration for communication preferences and Twilio integration",
    ],
    results: [],
    image: "/projects/connecthub.webp",
    video: "/videos/connecthub.mp4",
    liveUrl: "",
    caseStudyUrl: "",
  },

  // === Zapier Automation ===
  {
    id: "zapier-sms-membership",
    title: "SMS Automation for Membership Platform",
    category: "Zapier Automation",
    serviceType: "zapier",
    status: "DEMO",
    shortDescription:
      "A workflow automation system that automates the complete member communication lifecycle — from onboarding and SMS engagement to weekly content delivery and cancellation handling using Systeme.io, Zapier, Twilio, and Google Sheets.",
    fullDescription:
      "SMS Automation for Membership Platform is a workflow automation system designed to automate the complete member communication lifecycle — from new membership purchases and customer onboarding to SMS engagement, weekly content delivery, and cancellation handling.\n\nThe project uses Systeme.io as the membership platform, Zapier as the automation engine, Twilio for two-way SMS communication, and Google Sheets as the central data management layer. The system demonstrates how event-driven automation can replace repetitive manual operations by connecting business platforms into a reliable and scalable workflow pipeline.\n\nThe solution enables automated customer onboarding, intelligent SMS response handling, scheduled communication campaigns, and real-time membership status management while reducing operational effort and improving customer experience.",
    technologies: [
      "Systeme.io",
      "Zapier",
      "Twilio SMS API",
      "Google Sheets",
      "Webhooks",
      "Postman",
      "Google Workspace",
      "Git",
      "Visual Studio Code",
    ],
    features: [
      "Automated welcome SMS on new membership purchase via Systeme.io",
      "Zapier-powered two-way SMS reply handler for YES/STOP responses",
      "Scheduled weekly message delivery to active members via Twilio",
      "Automatic membership cancellation handler and database sync",
      "Google Sheets as central data layer for member tracking",
      "Event-driven workflows with conditional logic and webhooks",
      "Real-time membership status management",
      "Scalable multi-workflow pipeline architecture",
    ],
    results: [],
    image: "/projects/zapier.webp",
    video: "/videos/zapier.mp4",
    liveUrl: "",
    caseStudyUrl: "",
  },

  // === AI Agents / AI + Automation ===
  {
    id: "flowbase",
    title: "Flowbase Automation Suite",
    category: "AI + Business Automation",
    serviceType: "ai-automation",
    status: "DEMO",
    shortDescription:
      "An AI-powered workflow automation platform using n8n as the core engine to orchestrate lead scoring, support ticket triage, payment follow-ups, account health monitoring, and error alerting — all connected to OpenAI, Google Sheets, and Slack.",
    fullDescription:
      "Flowbase Automation Suite is an AI-powered workflow automation platform built to demonstrate how n8n can serve as the core automation engine for modern business processes. Instead of relying on a traditional backend, n8n orchestrates the entire workflow lifecycle — from receiving events via webhooks, processing data with AI, integrating third-party services, storing information, and exposing APIs consumed by the frontend dashboard.\n\nThe project shows how repetitive business operations can be transformed into intelligent, automated workflows by combining n8n, OpenAI API, Google Sheets, Slack, and a modern React dashboard. It also showcases event-driven automation, AI-powered decision-making, real-time notifications, and centralized monitoring across multiple business domains including sales, customer support, finance, customer success, and system operations.",
    technologies: [
      "n8n",
      "OpenAI API",
      "GPT Models",
      "React",
      "Vite",
      "Tailwind CSS",
      "Google Sheets",
      "Slack Incoming Webhooks",
      "Docker",
      "PostgreSQL",
      "Git",
      "Vercel",
      "Postman",
    ],
    features: [
      "AI Lead Scoring — analyzes new leads, assigns Hot/Warm/Cold score, notifies sales via Slack",
      "AI Support Ticket Triage — classifies tickets by category and priority, generates draft replies",
      "AI Failed Payment Follow-up — analyzes failure reason and generates personalized recovery messages",
      "Weekly Account Health Summary — evaluates platform usage, support and payment metrics with AI insights",
      "AI Automation Error Monitoring — detects workflow failures, assigns severity, alerts ops team",
      "n8n webhook-driven event processing pipeline",
      "Google Sheets as persistent data storage layer",
      "React dashboard for centralized workflow monitoring",
    ],
    results: [],
    image: "/projects/flowbase.webp",
    video: "/videos/flowbase.mp4",
    liveUrl: "",
    caseStudyUrl: "",
  },

  // === Custom Web Applications ===
  {
    id: "school-management-system",
    title: "Institute Management System",
    category: "Custom Web Applications",
    serviceType: "web-app",
    status: "DEMO",
    shortDescription:
      "A comprehensive educational administration platform digitizing school operations — from student admissions, attendance, timetables, and examinations to fee management, payroll, and role-based access — built with ASP.NET Core, React, and PostgreSQL.",
    fullDescription:
      "The Institute Management System is a comprehensive educational administration platform designed to streamline the day-to-day operations of schools through a centralized and modern digital environment. Built using ASP.NET Core Web API, React, and PostgreSQL, the platform enables administrators, principals, teachers, and staff to efficiently manage academic operations, student records, staff information, attendance, examinations, fees, payroll, and institutional settings from a single integrated application.\n\nThe system replaces fragmented manual processes with a unified solution where every academic and administrative activity is digitally managed and interconnected. From student admissions and class enrollment to timetable scheduling, examination management, fee collection, payroll processing, attendance tracking, and reporting, each module works together to provide complete visibility into school operations.\n\nDesigned with scalability and maintainability in mind, the platform supports multiple institutes, academic years, grades, sections, classrooms, subjects, teachers, and students while maintaining accurate historical records for academic progression and institutional reporting.",
    technologies: [
      "ASP.NET Core Web API",
      "C#",
      "Entity Framework Core",
      "RESTful APIs",
      "React",
      "Vite",
      "React Router",
      "CSS3",
      "Recharts",
      "Lucide React",
      "PostgreSQL",
      "JWT Authentication",
      "Role-Based Authorization",
      "Refresh Token Authentication",
      "Swagger",
      "Postman",
      "Repository Pattern",
      "Service Layer Architecture",
    ],
    features: [
      "Multi-institute management with centralized administration panel",
      "Academic year creation, activation, and historical record management",
      "Complete student profiles with guardian details and enrollment history",
      "Flexible grade, section, classroom, and subject structure configuration",
      "Teacher and staff profile management with subject assignments",
      "Digital attendance recording for students and staff with history and reporting",
      "Conflict-free timetable management with teacher and classroom scheduling",
      "Examination planning, result entry, finalization, and academic performance reports",
      "Fee structure configuration, payment management, and outstanding balance tracking",
      "Payroll generation, salary records, and payment processing for staff",
      "Leave request submission, review, and approval workflow",
      "Operational dashboards covering attendance, exams, fees, and enrollment",
      "JWT-secured role-based access control for admins, principals, teachers, and staff",
      "Scalable multi-institute, multi-academic-year database design",
    ],
    results: [],
    image: "/projects/ims.webp",
    video: "/videos/ims.mp4",
    liveUrl: "",
    caseStudyUrl: "",
  },

  // === SentriX AI ===
  {
    id: "sentrix-ai",
    title: "SentriX AI",
    category: "AI + Business Automation",
    serviceType: "ai-automation",
    status: "DEMO",
    shortDescription: "SentriX AI is a smart security and surveillance platform designed to modernize physical security operations through AI-powered video monitoring, intelligent incident management, security-zone monitoring, attendance integration, notifications, analytics, and an AI security copilot.",
    fullDescription: "SentriX AI is an AI-powered security and surveillance management platform designed to help organizations monitor, analyze, and manage physical security operations from a centralized interface.\n\nThe platform combines intelligent video surveillance with security management workflows, enabling organizations to monitor cameras, manage security zones, handle incidents, receive notifications, analyze security activity, and integrate AI-powered capabilities into their existing security infrastructure.\n\nSentriX AI is designed around a modular architecture so that existing systems such as employee management and attendance infrastructure can work alongside the security platform through API-based integrations.\n\nThe platform includes live monitoring, AI-assisted security workflows, face-recognition attendance integration, security-zone integration, incident management, notifications, reports and analytics, role-based access control, audit logging, system configuration, and an AI Security Copilot.",
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "FastAPI",
      "PostgreSQL",
      "SQLAlchemy",
      "WebSockets",
      "REST APIs",
      "HLS / WebRTC",
      "Pydantic",
      "AI / Computer Vision",
    ],
    features: [
      "AI-powered video surveillance",
      "Centralized live camera monitoring",
      "Camera and camera-group management",
      "Face recognition attendance integration",
      "Security zone monitoring",
      "Incident management",
      "Security notifications",
      "Security reports and analytics",
      "AI Security Copilot",
      "Role-based access control",
      "Audit logs",
      "System settings and configuration",
      "API-based integration with existing EMS infrastructure",
      "Responsive enterprise security dashboard",
    ],
    results: [],
    image: "/projects/sentrix-ai.webp",
    video: "/videos/sentrix-ai-demo.mp4",
    liveUrl: "",
    caseStudyUrl: "",
  },

  // === CarePulse ===
  {
    id: "carepulse",
    title: "CarePulse Remote Patient Monitoring Platform",
    category: "Custom Web Applications",
    serviceType: "web-app",
    status: "DEMO",
    shortDescription:
      "An end-to-end remote patient monitoring and healthcare workflow automation platform that manages the complete patient monitoring lifecycle — from enrollment and automated onboarding to scheduled readings, reminders, abnormal-reading alerts, care reviews, and weekly/monthly compliance reporting.",
    fullDescription:
      "CarePulse is an end-to-end remote patient monitoring (RPM) and healthcare workflow automation platform designed to help practices monitor patients remotely, automate patient engagement, identify abnormal readings, coordinate clinical follow-ups, and generate monitoring and compliance reports.\n\nThe platform manages the complete patient monitoring lifecycle — from patient enrollment and automated onboarding to scheduled health-data collection, automated reminders, abnormal-reading detection, care reviews, clinical follow-up, and weekly and monthly reporting.\n\nIt combines a role-based healthcare dashboard with automated workflows to reduce repetitive administrative work while giving nurses and doctors a clear view of patient monitoring activity, and giving patients a simple mobile experience for receiving reminders and submitting readings.\n\nThe system is built on an automation-first architecture where scheduled and event-driven workflows evaluate patient schedules, determine missing readings, send automated communications, process submitted health data, generate alerts, create care reviews, and maintain reporting data automatically.\n\nAutomation is handled through n8n scheduled and event-driven workflows — covering patient enrollment and onboarding, daily monitoring evaluation, automated reminders, health reading submission, abnormal-reading alerts, care coordination and clinical review, automated patient communication, weekly monitoring summaries, monthly monitoring and compliance reports, and full monitoring and activity tracking.",
    technologies: [
      "React",
      "ASP.NET Core Web API",
      "C#",
      ".NET",
      "REST APIs",
      "Role-Based Authorization",
      "PostgreSQL",
      "Relational Database",
      "n8n",
      "Scheduled Workflows",
      "Event-Driven Workflows",
      "Webhooks",
      "API Integration",
      "Automated Notifications",
      "Data Processing",
      "Remote Blood Pressure Monitoring",
      "Compliance Tracking",
      "Git",
      "Visual Studio Code",
    ],
    features: [
      "Patient enrollment with automated onboarding and welcome communication",
      "Automated daily monitoring evaluation against individual schedules (Not Due, Pending, Received, Missed)",
      "Idempotent automated reminders that prevent duplicate messages for the same monitoring event",
      "Patient health reading submission with immediate visibility for care roles",
      "Intelligent abnormal-reading detection with high/critical alerts and automatic care review creation",
      "Care coordination queues with clinical review, recommendations, and follow-up actions",
      "Realistic two-way automated patient communication with message history and read/unread status",
      "Weekly monitoring summaries covering readings, compliance, alerts, and reviews",
      "Monthly monitoring and compliance reports with patient-level summaries and export",
      "Complete monitoring and activity tracking across the patient lifecycle",
      "Role-based platform for Admin, Nurse/Care Coordinator, Doctor, and Patient",
      "Remote blood pressure monitoring with systolic, diastolic, and pulse readings",
      "Interactive monitoring visualizations and responsive dashboards",
      "API integration testing and workflow testing",
    ],
    results: [],
    image: "/projects/careplus.webp",
    video: "/videos/careplus.mp4",
    liveUrl: "",
    caseStudyUrl: "",
  },
];

export function getProjectCategories(): string[] {
  const cats = new Set(PROJECTS.map((p) => p.category));
  return CATEGORY_ORDER.filter((c) => cats.has(c));
}
