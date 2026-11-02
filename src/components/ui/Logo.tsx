import { cn } from "@/lib/cn";

/** Portfolio mark: a hexagon core with an orbiting node. */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={cn("h-8 w-8", className)} aria-hidden="true">
      <defs>
        <linearGradient id="pat-g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="55%" stopColor="#22D3EE" />
          <stop offset="100%" stopColor="#A3E635" />
        </linearGradient>
      </defs>
      <polygon points="20,2 36,11 36,29 20,38 4,29 4,11" fill="rgba(139,92,246,0.14)" stroke="url(#pat-g)" strokeWidth="1.8" />
      <path d="M14 27V13h7.2a4.6 4.6 0 0 1 0 9.2H14" fill="none" stroke="url(#pat-g)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="30" cy="12" r="2.4" fill="#A3E635">
        <animate attributeName="opacity" values="1;0.35;1" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}
