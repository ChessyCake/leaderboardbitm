import { Zap, Flame } from "lucide-react";
import type { LeaderboardUser } from "@/lib/types";

import { SiLeetcode, SiCodeforces  } from "react-icons/si";

interface ManifestEntryProps {
  user: LeaderboardUser;
  rank: number;
}





export default function ManifestEntry({ user, rank }: ManifestEntryProps) {
  const isFirst = rank === 1;
  const displayName =
    user.name?.toUpperCase() ||
    user.codeforcesUsername?.toUpperCase().replace(/\s/g, "_") ||
    "UNKNOWN";
  const userId = user.id ? String(user.id).slice(-4) : "XXXX";
  const rankStr = String(rank).padStart(2, "0");
  const isActive = user.todaySolved > 0;

  return (
    <div
      className="group relative flex items-stretch overflow-hidden border-b transition-colors flex-row"
      style={{
        background: "var(--lb-card-bg)",
        borderColor: "var(--lb-border)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--lb-entry-hover)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--lb-card-bg)";
      }}
    >
      {/* ── Rank Column ── */}
      <div className="relative flex w-12 sm:w-[100px] flex-shrink-0 items-center justify-center overflow-hidden">
        {/* Green accent block for #1 */}
        {isFirst && (
          <div
            className="absolute inset-0"
            style={{ background: "var(--lb-accent)" }}
          />
        )}
        <span
          className="relative font-display font-black text-4xl sm:text-6xl select-none"
          style={{
            color: isFirst
              ? "var(--lb-accent-text)"
              : "var(--lb-text-muted)",
            opacity: isFirst ? 1 : 0.7,
          }}
        >
          {rankStr}
        </span>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 flex-col justify-center py-3 px-3 sm:py-5 sm:px-6 min-w-0">
        {/* Top row: name + ID */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
          <div className="min-w-0">
            {/* Real Name */}
            <h3
              className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight truncate"
              style={{ color: "var(--lb-text)" }}
            >
              {displayName}
            </h3>

            {/* Profile Links */}
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 mt-1 font-mono text-[10px] sm:text-[11px] tracking-wide" style={{ color: "var(--lb-text-secondary)" }}>
              {user.codeforcesUsername && (
                <a href={`https://codeforces.com/profile/${user.codeforcesUsername}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex justify-center items-center gap-1 sm:gap-2">
                  <SiCodeforces size={14} className="sm:w-4 sm:h-4" /> <span className="truncate max-w-[80px] sm:max-w-none">{user.codeforcesUsername}</span>
                </a>
              )}
              {user.leetcodeUsername && (
                <a href={`https://leetcode.com/u/${user.leetcodeUsername}/`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex justify-center items-center gap-1">
                  <SiLeetcode size={14} className="sm:w-4 sm:h-4" /> <span className="truncate max-w-[80px] sm:max-w-none">{user.leetcodeUsername}</span>
                </a>
              )}
            </div>
          </div>

          {/* ID label */}
          <span
            className="font-mono text-[9px] sm:text-[10px] tracking-wider flex-shrink-0 mt-1"
            style={{ color: "var(--lb-text-muted)" }}
          >
            [ID: {userId}]
          </span>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-3 mt-3 sm:mt-5">
          <StatField label="SOLVED" value={user.todaySolved} />
          {user.codeforcesUsername && (
            <StatField label="CF SOLVED" value={user.cfSolvedToday} />
          )}
          {user.leetcodeUsername && (
            <StatField label="LC SOLVED" value={user.lcSolvedToday} />
          )}
        </div>
      </div>

      {/* ── Streak Column ── */}
      <div
        className="relative flex w-12 sm:w-[120px] flex-shrink-0 flex-col items-center justify-center checkerboard-pattern border-l sm:border-l-0"
        style={{ borderColor: "var(--lb-border)" }}
      >
        {/* Lightning icon */}
        <div
          className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-colors"
          style={{
            borderColor: isActive
              ? "var(--lb-accent)"
              : "var(--lb-border-accent)",
            background: isActive
              ? "var(--lb-accent)"
              : "var(--lb-surface)",
            color: isActive
              ? "var(--lb-accent-text)"
              : "var(--lb-text-muted)",
          }}
        >
          <Zap size={14} className="sm:w-[18px] sm:h-[18px]" />
        </div>

        {/* Streaks */}
        <div className="mt-2 sm:mt-3 flex flex-col items-center gap-1 sm:gap-1.5">
          {/* CF Streak */}
          {user.codeforcesUsername && (
            <div
              className="flex items-center gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-xs font-bold tracking-wider"
              style={{ color: user.cfStreak > 0 ? "var(--lb-text)" : "var(--lb-text-muted)" }}
            >
              <span className="text-[8px] sm:text-[9px] uppercase hidden sm:inline">CF</span>
              <Flame size={11} className="sm:w-[13px] sm:h-[13px]" style={{ color: user.cfStreak > 0 ? "var(--lb-accent)" : "currentColor" }} />
              <span>{user.cfStreak}</span>
            </div>
          )}
          {/* LC Streak */}
          {user.leetcodeUsername && (
            <div
              className="flex items-center gap-1 sm:gap-1.5 font-mono text-[10px] sm:text-xs font-bold tracking-wider"
              style={{ color: user.lcStreak > 0 ? "var(--lb-text)" : "var(--lb-text-muted)" }}
            >
              <span className="text-[8px] sm:text-[9px] uppercase hidden sm:inline">LC</span>
              <Flame size={11} className="sm:w-[13px] sm:h-[13px]" style={{ color: user.lcStreak > 0 ? "var(--lb-accent)" : "currentColor" }} />
              <span>{user.lcStreak}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Stat Field sub-component ── */
function StatField({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div>
      <p
        className="font-mono text-[7px] sm:text-[9px] tracking-widest uppercase truncate"
        style={{ color: "var(--lb-text-muted)" }}
      >
        {label}
      </p>
      <p
        className="font-display text-base sm:text-xl font-bold mt-0.5 sm:mt-1"
        style={{ color: "var(--lb-text)" }}
      >
        {value}
      </p>
    </div>
  );
}
