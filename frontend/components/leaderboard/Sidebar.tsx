"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Trophy,
  Terminal,
  Archive,
  ChevronRight,
  Shield,
} from "lucide-react";

import { FaDiscord, FaWhatsapp } from "react-icons/fa";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { label: "RANKINGS", icon: Trophy, href: "/leaderboard" },
  { label: "ARCHIVE", icon: Archive, href: "/archive" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-16 md:w-[220px] flex-col border-r transition-all duration-300"
      style={{
        background: "var(--lb-sidebar-bg)",
        borderColor: "var(--lb-sidebar-border)",
      }}
    >
      {/* ── Operator Identity ── */}
      <div className="px-2 md:px-5 pt-6 pb-5 flex flex-col items-center md:items-start">
        {/* Logo */}
        <div
          className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-sm border shrink-0 transition-all duration-300"
          style={{
            borderColor: "var(--lb-border-accent)",
            background: "var(--lb-surface)",
          }}
        >
          <Shield className="w-5 h-5 md:w-[22px] md:h-[22px]" style={{ color: "var(--lb-accent)" }} />
        </div>

        <div className="mt-4 hidden md:block">
          <h2
            className="font-mono text-sm font-bold tracking-wide truncate"
            style={{ color: "var(--lb-text)" }}
          >
            OPERATOR_01
          </h2>
          <p
            className="font-mono text-[10px] tracking-wider mt-1 truncate"
            style={{ color: "var(--lb-accent)" }}
          >
            [STATUS: ACTIVE]
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-2 md:px-3 mt-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <li key={label}>
                <Link
                  href={href}
                  className="flex items-center justify-center md:justify-start gap-3 rounded-sm px-0 md:px-3 py-2.5 font-mono text-xs tracking-wider transition-colors"
                  style={{
                    background: isActive
                      ? "var(--lb-nav-active-bg)"
                      : "transparent",
                    color: isActive
                      ? "var(--lb-text)"
                      : "var(--lb-text-muted)",
                    borderLeft: isActive
                      ? "2px solid var(--lb-accent)"
                      : "2px solid transparent",
                  }}
                  title={label}
                >
                  <Icon size={16} className="shrink-0" />
                  <span className="hidden md:inline truncate">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Join Links ── */}
      <div className="px-2 md:px-3 mb-2 flex flex-col gap-1">
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center md:justify-start gap-3 rounded-sm px-0 md:px-3 py-2 font-mono text-xs tracking-wider transition-colors text-[var(--lb-text-muted)] hover:text-[#5865F2] hover:bg-[var(--lb-nav-active-bg)]"
          title="Join Discord"
        >
          <FaDiscord size={16} className="shrink-0" />
          <span className="hidden md:inline truncate">DISCORD</span>
        </a>
        <a
          href="#"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center md:justify-start gap-3 rounded-sm px-0 md:px-3 py-2 font-mono text-xs tracking-wider transition-colors text-[var(--lb-text-muted)] hover:text-[#25D366] hover:bg-[var(--lb-nav-active-bg)]"
          title="Join WhatsApp"
        >
          <FaWhatsapp size={16} className="shrink-0" />
          <span className="hidden md:inline truncate">WHATSAPP</span>
        </a>
      </div>

      {/* ── Theme Toggle ── */}
      <div className="px-2 md:px-4 mb-3 flex justify-center md:justify-start">
        <ThemeToggle />
      </div>

    </aside>
  );
}
