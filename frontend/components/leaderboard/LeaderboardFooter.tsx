import Link from "next/link";
import { MessageCircleQuestion, Users } from "lucide-react";

export default function LeaderboardFooter() {
  return (
    <footer
      className="flex flex-col sm:flex-row items-center justify-between gap-6 sm:gap-3 border-t py-6 mt-8 sm:mt-12 w-full transition-all"
      style={{
        borderColor: "var(--lb-border-accent)",
        background: "linear-gradient(to top, rgba(var(--lb-accent-rgb, 100, 255, 150), 0.05), transparent)",
        boxShadow: "0 -10px 40px -20px rgba(var(--lb-accent-rgb, 100, 255, 150), 0.1)"
      }}
    >
      <div className="flex flex-col items-center sm:items-start gap-2">
        <span
          className="font-mono text-[10px] sm:text-[11px] tracking-wider shrink-0"
          style={{ color: "var(--lb-text-muted)" }}
        >
          [SYSTEM_MANIFEST_V2.0.4]
        </span>
      </div>

      <div className="flex items-center gap-6">
        <Link 
          href="/faq" 
          className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase transition-all hover:scale-105"
          style={{ color: "var(--lb-accent)", textShadow: "0 0 10px rgba(var(--lb-accent-rgb, 100, 255, 150), 0.3)" }}
        >
          <MessageCircleQuestion size={18} />
          FAQ
        </Link>
        <Link 
          href="/credits" 
          className="flex items-center gap-2 font-mono text-xs sm:text-sm font-bold tracking-widest uppercase transition-all hover:scale-105"
          style={{ color: "var(--lb-accent)", textShadow: "0 0 10px rgba(var(--lb-accent-rgb, 100, 255, 150), 0.3)" }}
        >
          <Users size={18} />
          CREDITS
        </Link>
      </div>
    </footer>
  );
}
