import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/space-grotesk";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import VisibilityGovernor from "@/components/VisibilityGovernor";
import ConsultationProvider from "@/components/ConsultationProvider";
import ScrollProgress from "@/components/ScrollProgress";
import CursorGlow from "@/components/CursorGlow";
import SideNav from "@/components/SideNav";
import ChatBot from "@/components/ChatBot";
import { SITE_URL, SITE_NAME, SITE_TITLE, SITE_DESCRIPTION } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "AI Automation & Software Development",
  keywords: [
    "AI Automation",
    "Business Automation",
    "Workflow Automation",
    "AI Agents",
    "Custom Software Development",
    "Business Process Automation",
    "CRM Automation",
    "Twilio",
    "n8n",
    "OpenAI",
    "ElevenLabs",
    "Automation Agency",
    "Software Company",

  ],
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    type: "website",
    locale: "en_US",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Portfolio — AI Automation & Custom Software Development" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#05060B",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/og-image.png`,
  description: SITE_DESCRIPTION,
  sameAs: [],
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: SITE_DESCRIPTION,
  inLanguage: "en",
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: SITE_NAME,
  url: SITE_URL,
  image: `${SITE_URL}/og-image.png`,
  description: SITE_DESCRIPTION,
  priceRange: "$$",
  areaServed: "Worldwide",
  sameAs: [],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      </head>
      <body className="relative overflow-x-hidden bg-prime-bg font-sans text-prime-text antialiased">
        <ConsultationProvider>
          <VisibilityGovernor />
          <ScrollProgress />
          <CursorGlow />
          <Navbar />
          <SideNav />
          <main className="relative z-[2] w-full max-w-full overflow-x-clip">{children}</main>
          <Footer />
          <ChatBot />
        </ConsultationProvider>
      </body>
    </html>
  );
}
