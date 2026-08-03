"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  Trophy,
  Terminal,
  Archive,
  ChevronRight,
  Shield,
} from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

const NAV_ITEMS = [
  { label: "LIVE_STATS", icon: Activity, href: "/dashboard" },
  { label: "RANKINGS", icon: Trophy, href: "/leaderboard" },
  { label: "TERMINAL", icon: Terminal, href: "#" },
  { label: "ARCHIVE", icon: Archive, href: "/archive" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="fixed left-0 top-0 z-40 flex h-screen w-[220px] flex-col border-r"
      style={{
        background: "var(--lb-sidebar-bg)",
        borderColor: "var(--lb-sidebar-border)",
      }}
    >
      {/* ── Operator Identity ── */}
      <div className="px-5 pt-6 pb-5">
        {/* Logo */}
        <div
          className="flex h-12 w-12 items-center justify-center rounded-sm border"
          style={{
            borderColor: "var(--lb-border-accent)",
            background: "var(--lb-surface)",
          }}
        >
          <Shield size={22} style={{ color: "var(--lb-accent)" }} />
        </div>

        <div className="mt-4">
          <h2
            className="font-mono text-sm font-bold tracking-wide"
            style={{ color: "var(--lb-text)" }}
          >
            OPERATOR_01
          </h2>
          <p
            className="font-mono text-[10px] tracking-wider mt-1"
            style={{ color: "var(--lb-accent)" }}
          >
            [STATUS: ACTIVE]
          </p>
        </div>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 px-3 mt-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
            const isActive = pathname === href;
            return (
              <li key={label}>
                <Link
                  href={href}
                  className="flex items-center gap-3 rounded-sm px-3 py-2.5 font-mono text-xs tracking-wider transition-colors"
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
                >
                  <Icon size={16} />
                  <span>{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Theme Toggle ── */}
      <div className="px-4 mb-3">
        <ThemeToggle />
      </div>

      {/* ── CTA ── */}
      <div className="px-4 pb-6">
        <button
          className="flex w-full items-center justify-center gap-2 rounded-sm border px-4 py-3 font-mono text-xs font-bold tracking-wider transition-all cursor-pointer"
          style={{
            borderColor: "var(--lb-accent)",
            color: "var(--lb-accent)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "var(--lb-accent)";
            e.currentTarget.style.color = "var(--lb-accent-text)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "var(--lb-accent)";
          }}
        >
          JOIN_NEXT_MATCH
          <ChevronRight size={14} />
        </button>
      </div>
    </aside>
  );
}
