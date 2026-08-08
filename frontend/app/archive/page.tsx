"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { api } from "@/lib/api";
import type {
  LeaderboardUser,
  StatsOverview,
  WeeklyStats,
  ArchiveApiResponse,
} from "@/lib/types";

import ManifestEntry from "@/components/leaderboard/ManifestEntry";
import LeaderboardFooter from "@/components/leaderboard/LeaderboardFooter";

import {
  Archive,
  Calendar,
  Code2,
  Braces,
  Users,
  Database,
  ExternalLink,
  ChevronRight,
  Trophy,
} from "lucide-react";

/* ── Helpers ── */
function formatDateKey(d: Date): string {
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}

function formatDateLabel(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getPast7Days(): { key: string; label: string; date: Date }[] {
  const days: { key: string; label: string; date: Date }[] = [];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({ key: formatDateKey(d), label: formatDateLabel(d), date: d });
  }
  return days;
}



const DISCORD_LINK = "https://discord.gg/jTTckmfwfR";

/* ── Day Stats Card Config ── */
const DAY_CARD_CONFIG = [
  {
    sysCode: "ARC.D1",
    label: "CF SOLVED (DAY)",
    key: "cfSolvedToday" as const,
    icon: Code2,
    highlight: true,
  },
  {
    sysCode: "ARC.D2",
    label: "LC SOLVED (DAY)",
    key: "lcSolvedToday" as const,
    icon: Braces,
    highlight: false,
  },
  {
    sysCode: "ARC.D3",
    label: "ACTIVE USERS (DAY)",
    key: "activeToday" as const,
    icon: Users,
    highlight: false,
  },
  {
    sysCode: "ARC.D4",
    label: "TOTAL SOLVED (DAY)",
    key: "solvedToday" as const,
    icon: Trophy,
    highlight: false,
  },
];

export default function ArchivePage() {
  const days = useMemo(() => getPast7Days(), []);
  const [selectedDate, setSelectedDate] = useState(days[0].key);
  
  const [archivesData, setArchivesData] = useState<any[]>([]);
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [stats, setStats] = useState<StatsOverview>({ activeToday: 0, solvedToday: 0, cfSolvedToday: 0, lcSolvedToday: 0 });
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats>({ totalCfSolved: 0, totalLcSolved: 0, onlineUsers: 0, daysArchived: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  /* ── Fetch all archives (last 7 days) ── */
  const fetchAllArchives = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api("/api/v1/archive");
      if (!res.ok) throw new Error("Failed to fetch archive");
      const json = await res.json();
      
      if (json.success && json.data) {
        setArchivesData(json.data);
        
        let totalCf = 0;
        let totalLc = 0;
        let online = 0;
        json.data.forEach((day: any) => {
          totalCf += day.total_CFsolved || 0;
          totalLc += day.total_LCsolved || 0;
          online += day.total_online || 0;
        });
        setWeeklyStats({
          totalCfSolved: totalCf,
          totalLcSolved: totalLc,
          onlineUsers: online,
          daysArchived: json.data.length,
        });
      } else {
        throw new Error(json.message || "Failed to fetch archive data");
      }
    } catch (err: any) {
      console.error("Error fetching archive:", err);
      setError(err.message || "Archive API offline");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllArchives();
  }, [fetchAllArchives]);

  useEffect(() => {
    // The archive date field may be a timestamp (ms) or ISO string — handle both
    const dayArchive = archivesData.find((d: any) => {
      const raw = d.date;
      let dateStr: string;
      if (typeof raw === "number") {
        // It's a UTC midnight timestamp — convert to local date string
        dateStr = new Date(raw).toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
      } else {
        dateStr = new Date(raw).toLocaleDateString("en-CA");
      }
      return dateStr === selectedDate;
    });

    if (dayArchive) {
      const mapped: LeaderboardUser[] = (dayArchive.top_users || []).map(
        (u: any, idx: number) => ({
          rank: idx + 1,
          name: u.name,
          avatar: "",
          streak: 0,
          todaySolved: u.totalSolvedToday || (u.cfSolved + u.lcSolved),
          totalSolved: 0,
          cfSolvedToday: u.cfSolved,
          lcSolvedToday: u.lcSolved,
          cfSolved: 0,
          lcSolved: 0,
          cfStreak: 0,
          lcStreak: 0,
          cfRating: 0,
        })
      );
      setUsers(mapped);
      setTotalUsers(dayArchive.total_online || 0);
      setStats({
        activeToday: dayArchive.total_online || 0,
        solvedToday: dayArchive.total_solved || 0,
        cfSolvedToday: dayArchive.total_CFsolved || 0,
        lcSolvedToday: dayArchive.total_LCsolved || 0,
      });
    } else {
      setUsers([]);
      setTotalUsers(0);
      setStats({ activeToday: 0, solvedToday: 0, cfSolvedToday: 0, lcSolvedToday: 0 });
    }
    setPage(1);
    setTotalPages(1);
  }, [selectedDate, archivesData]);

  const handleDateSelect = (dateKey: string) => {
    setSelectedDate(dateKey);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div
        className="min-h-screen px-3 sm:px-6 md:px-10 pt-16 pb-6 sm:py-8 md:py-12 w-full overflow-hidden"
        style={{ background: "var(--lb-bg)" }}
      >
        {/* Header skeleton */}
        <ArchiveHeader />

        {/* Date filter skeleton */}
        <DateFilter
          days={days}
          selectedDate={selectedDate}
          onSelect={handleDateSelect}
        />

        {/* Stats skeleton */}
        <div
          className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px"
          style={{ background: "var(--lb-border)" }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5"
              style={{ background: "var(--lb-card-bg)" }}
            >
              <div
                className="h-3 w-16 rounded-sm animate-pulse mb-3"
                style={{ background: "var(--lb-border-accent)" }}
              />
              <div
                className="h-10 w-24 rounded-sm animate-pulse mb-2"
                style={{ background: "var(--lb-border)" }}
              />
              <div
                className="h-3 w-20 rounded-sm animate-pulse"
                style={{ background: "var(--lb-border-accent)" }}
              />
            </div>
          ))}
        </div>

        {/* Entry skeletons */}
        <div className="mt-10">
          <div className="mb-6">
            <span
              className="inline-block border px-4 py-2 font-mono text-xs tracking-widest"
              style={{
                borderColor: "var(--lb-border-accent)",
                color: "var(--lb-text-secondary)",
                background: "var(--lb-surface)",
              }}
            >
              // LOADING_ARCHIVE...
            </span>
          </div>

          <div
            className="border overflow-hidden"
            style={{ borderColor: "var(--lb-border)" }}
          >
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex items-stretch border-b"
                style={{
                  background: "var(--lb-card-bg)",
                  borderColor: "var(--lb-border)",
                }}
              >
                <div className="flex w-12 sm:w-[100px] flex-shrink-0 items-center justify-center">
                  <div
                    className="h-8 w-8 sm:h-12 sm:w-12 rounded-sm animate-pulse"
                    style={{ background: "var(--lb-border)" }}
                  />
                </div>
                <div className="flex-1 py-3 px-2 sm:py-5 sm:px-6 overflow-hidden">
                  <div
                    className="h-7 w-48 rounded-sm animate-pulse mb-3"
                    style={{ background: "var(--lb-border)" }}
                  />
                  <div className="flex gap-2 mb-4">
                    <div
                      className="h-4 w-16 rounded-sm animate-pulse"
                      style={{ background: "var(--lb-border-accent)" }}
                    />
                    <div
                      className="h-4 w-20 rounded-sm animate-pulse"
                      style={{ background: "var(--lb-border-accent)" }}
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-x-8">
                    {[1, 2, 3, 4].map((j) => (
                      <div key={j}>
                        <div
                          className="h-2 w-14 rounded-sm animate-pulse mb-2"
                          style={{ background: "var(--lb-border-accent)" }}
                        />
                        <div
                          className="h-6 w-10 rounded-sm animate-pulse"
                          style={{ background: "var(--lb-border)" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex w-12 sm:w-[120px] flex-shrink-0 flex-col items-center justify-center border-l sm:border-l-0" style={{ borderColor: "var(--lb-border)" }}>
                  <div
                    className="h-8 w-8 sm:h-10 sm:w-10 rounded-full animate-pulse"
                    style={{ background: "var(--lb-border)" }}
                  />
                  <div
                    className="h-3 w-14 mt-2 rounded-sm animate-pulse"
                    style={{ background: "var(--lb-border-accent)" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 sm:px-6 md:px-10 pt-16 pb-6 sm:py-8 md:py-12 w-full overflow-hidden">
      {/* Header */}
      <ArchiveHeader />

      {/* Date Filter */}
      <DateFilter
        days={days}
        selectedDate={selectedDate}
        onSelect={handleDateSelect}
      />

      {/* Per-day Stats Grid — updates on date selection */}
      <div className="mt-8">
        <DayStatsGrid stats={stats} selectedDate={selectedDate} />
      </div>

      {/* Weekly summary strip */}
      <div
        className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-1 px-4 py-2 border"
        style={{ borderColor: "var(--lb-border)", background: "var(--lb-surface)" }}
      >
        <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "var(--lb-text-dim)" }}>
          7-DAY TOTALS:
        </span>
        <span className="font-mono text-[10px] tracking-wider" style={{ color: "var(--lb-text-muted)" }}>
          CF <span style={{ color: "var(--lb-accent)" }}>{weeklyStats.totalCfSolved}</span>
        </span>
        <span className="font-mono text-[10px] tracking-wider" style={{ color: "var(--lb-text-muted)" }}>
          LC <span style={{ color: "var(--lb-text)" }}>{weeklyStats.totalLcSolved}</span>
        </span>
        <span className="font-mono text-[10px] tracking-wider" style={{ color: "var(--lb-text-muted)" }}>
          DAYS <span style={{ color: "var(--lb-text)" }}>{weeklyStats.daysArchived}</span>
        </span>
      </div>

      {/* Data source indicator */}
      {error && (
        <div
          className="mt-4 flex flex-wrap items-center gap-2 border px-4 py-2 w-full"
          style={{
            borderColor: "rgba(255, 0, 0, 0.3)",
            background: "rgba(255, 0, 0, 0.05)",
          }}
        >
          <span
            className="inline-block h-2 w-2 rounded-full animate-pulse"
            style={{ background: "#ff0000" }}
          />
          <span
            className="font-mono text-[11px] tracking-wider"
            style={{ color: "#ff0000" }}
          >
            [ERROR] {error.toUpperCase()} — NO DATA AVAILABLE
          </span>
        </div>
      )}

      {/* Archive Manifest Section */}
      <div className="mt-10">
        {/* Section label */}
        <div className="mb-6 flex items-center justify-between">
          <span
            className="inline-block border px-4 py-2 font-mono text-xs tracking-widest"
            style={{
              borderColor: "var(--lb-border-accent)",
              color: "var(--lb-text-secondary)",
              background: "var(--lb-surface)",
            }}
          >
            // ARCHIVE_MANIFEST — {selectedDate}
          </span>

          <span
            className="font-mono text-[10px] tracking-wider"
            style={{ color: "var(--lb-text-muted)" }}
          >
            [{totalUsers} ENTRIES]
          </span>
        </div>

        {/* Entries */}
        <div
          className="border overflow-hidden w-full"
          style={{ borderColor: "var(--lb-border)" }}
        >
          {users.length === 0 ? (
            <div
              className="py-16 text-center"
              style={{ background: "var(--lb-card-bg)" }}
            >
              <p
                className="font-mono text-sm tracking-wider"
                style={{ color: "var(--lb-text-muted)" }}
              >
                [NO_ARCHIVE_DATA]
              </p>
              <p
                className="font-mono text-[10px] tracking-wider mt-2"
                style={{ color: "var(--lb-text-dim)" }}
              >
                No snapshot recorded for {selectedDate}. Data is captured daily
                at end of day.
              </p>
            </div>
          ) : (
            users.map((user, i) => (
              <ManifestEntry
                key={user.id ?? user.rank ?? i}
                user={user}
                rank={user.rank ?? i + 1}
              />
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between border border-t-0 px-5 py-3"
            style={{
              borderColor: "var(--lb-border)",
              background: "var(--lb-card-bg)",
            }}
          >
            <button
              onClick={handlePrevPage}
              disabled={page <= 1}
              className="font-mono text-[11px] tracking-wider px-4 py-2 border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: "var(--lb-border-accent)",
                color: "var(--lb-text-secondary)",
                background: "var(--lb-surface)",
              }}
              onMouseEnter={(e) => {
                if (page > 1) {
                  e.currentTarget.style.borderColor = "var(--lb-accent)";
                  e.currentTarget.style.color = "var(--lb-accent)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--lb-border-accent)";
                e.currentTarget.style.color = "var(--lb-text-secondary)";
              }}
            >
              ← PREV_PAGE
            </button>

            <span
              className="font-mono text-[10px] tracking-wider"
              style={{ color: "var(--lb-text-muted)" }}
            >
              [PAGE {page} / {totalPages}]
            </span>

            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="font-mono text-[11px] tracking-wider px-4 py-2 border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
              style={{
                borderColor: "var(--lb-border-accent)",
                color: "var(--lb-text-secondary)",
                background: "var(--lb-surface)",
              }}
              onMouseEnter={(e) => {
                if (page < totalPages) {
                  e.currentTarget.style.borderColor = "var(--lb-accent)";
                  e.currentTarget.style.color = "var(--lb-accent)";
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--lb-border-accent)";
                e.currentTarget.style.color = "var(--lb-text-secondary)";
              }}
            >
              NEXT_PAGE →
            </button>
          </div>
        )}
      </div>

      {/* Discord CTA Section */}
      <DiscordCTA />

      {/* Footer */}
      <LeaderboardFooter />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Sub-components
   ═══════════════════════════════════════════════════════════ */

/* ── Archive Header ── */
function ArchiveHeader() {
  return (
    <header className="mb-6 sm:mb-8">
      <h1
        className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none"
        style={{ color: "var(--lb-text)" }}
      >
        COMP_LEAGUE
      </h1>

      <div className="mt-2 inline-block">
        <div
          className="px-3 sm:px-4 py-1.5 sm:py-2 -skew-x-3"
          style={{ background: "var(--lb-accent)" }}
        >
          <span
            className="block skew-x-3 font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight"
            style={{ color: "var(--lb-accent-text)" }}
          >
            // ARCHIVE
          </span>
        </div>
      </div>

      <p
        className="mt-4 font-mono text-[11px] tracking-wider max-w-xl"
        style={{ color: "var(--lb-text-muted)" }}
      >
        Browse past leaderboard snapshots from the previous 7 days. Select a
        date below to view that day&apos;s rankings.
      </p>
    </header>
  );
}

/* ── Date Filter ── */
function DateFilter({
  days,
  selectedDate,
  onSelect,
}: {
  days: { key: string; label: string; date: Date }[];
  selectedDate: string;
  onSelect: (key: string) => void;
}) {
  return (
    <div
      className="border overflow-hidden w-full"
      style={{ borderColor: "var(--lb-border)" }}
    >
      {/* Filter header */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{
          background: "var(--lb-surface)",
          borderColor: "var(--lb-border)",
        }}
      >
        <Calendar
          size={14}
          style={{ color: "var(--lb-accent)" }}
        />
        <span
          className="font-mono text-[10px] tracking-widest uppercase"
          style={{ color: "var(--lb-text-muted)" }}
        >
          SELECT DATE
        </span>
        <span
          className="font-mono text-[10px] tracking-wider ml-auto"
          style={{ color: "var(--lb-text-dim)" }}
        >
          [LAST 7 DAYS]
        </span>
      </div>

      {/* Date buttons */}
      <div
        className="flex overflow-x-auto"
        style={{ background: "var(--lb-card-bg)" }}
      >
        {days.map(({ key, label }, idx) => {
          const isSelected = key === selectedDate;
          return (
            <button
              key={key}
              onClick={() => onSelect(key)}
              className="relative flex-1 min-w-[120px] px-4 py-4 font-mono text-center transition-all cursor-pointer"
              style={{
                background: isSelected
                  ? "var(--lb-card-highlight-bg)"
                  : "transparent",
                borderRight:
                  idx < days.length - 1
                    ? "1px solid var(--lb-border)"
                    : "none",
                borderBottom: isSelected
                  ? "2px solid var(--lb-accent)"
                  : "2px solid transparent",
              }}
              onMouseEnter={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = "var(--lb-entry-hover)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isSelected) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              {/* Day index */}
              <span
                className="block text-[9px] tracking-widest mb-1"
                style={{
                  color: isSelected
                    ? "var(--lb-accent)"
                    : "var(--lb-text-dim)",
                }}
              >
                DAY-{String(idx + 1).padStart(2, "0")}
              </span>

              {/* Date label */}
              <span
                className="block text-[11px] tracking-wider font-bold"
                style={{
                  color: isSelected
                    ? "var(--lb-accent)"
                    : "var(--lb-text-secondary)",
                }}
              >
                {label.toUpperCase()}
              </span>

              {/* Date key */}
              <span
                className="block text-[9px] tracking-wider mt-1"
                style={{
                  color: isSelected
                    ? "var(--lb-accent)"
                    : "var(--lb-text-dim)",
                  opacity: isSelected ? 0.7 : 1,
                }}
              >
                {key}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ── Day Stats Grid ── */
function DayStatsGrid({ stats, selectedDate }: { stats: StatsOverview; selectedDate: string }) {
  return (
    <div
      className="grid grid-cols-2 lg:grid-cols-4 gap-px w-full"
      style={{ background: "var(--lb-border)" }}
    >
      {DAY_CARD_CONFIG.map(
        ({ sysCode, label, key, icon: Icon, highlight }) => (
          <div
            key={sysCode}
            className="relative overflow-hidden p-3 sm:p-5"
            style={{
              background: highlight
                ? "var(--lb-card-highlight-bg)"
                : "var(--lb-card-bg)",
              borderLeft: highlight
                ? "3px solid var(--lb-accent)"
                : "3px solid transparent",
            }}
          >
            {/* System Code + Icon */}
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span
                className="font-mono text-[9px] sm:text-[10px] tracking-wider truncate"
                style={{ color: "var(--lb-text-muted)" }}
              >
                [{sysCode}]
              </span>
              <Icon
                size={14}
                className="sm:w-4 sm:h-4 shrink-0"
                style={{
                  color: highlight
                    ? "var(--lb-accent)"
                    : "var(--lb-text-muted)",
                }}
              />
            </div>

            {/* Value */}
            <p
              className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight truncate"
              style={{
                color: highlight ? "var(--lb-accent)" : "var(--lb-text)",
              }}
            >
              {stats[key].toLocaleString()}
            </p>

            {/* Label */}
            <p
              className="font-mono text-[8px] sm:text-[10px] tracking-widest mt-1 sm:mt-2 uppercase truncate"
              style={{ color: "var(--lb-text-muted)" }}
            >
              {label}
            </p>
          </div>
        )
      )}
    </div>
  );
}

/* ── Discord CTA Section ── */
function DiscordCTA() {
  return (
    <div
      className="mt-10 border overflow-hidden w-full"
      style={{ borderColor: "var(--lb-border)" }}
    >
      {/* Section label */}
      <div
        className="flex items-center gap-2 px-4 py-2.5 border-b"
        style={{
          background: "var(--lb-surface)",
          borderColor: "var(--lb-border)",
        }}
      >
        <Archive size={14} style={{ color: "var(--lb-accent)" }} />
        <span
          className="font-mono text-[10px] tracking-widest uppercase"
          style={{ color: "var(--lb-text-muted)" }}
        >
          EXTENDED ARCHIVE
        </span>
      </div>

      {/* Content */}
      <div
        className="px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
        style={{ background: "var(--lb-card-bg)" }}
      >
        <div className="max-w-lg">
          <h3
            className="font-display text-xl md:text-2xl font-bold tracking-tight mb-2"
            style={{ color: "var(--lb-text)" }}
          >
            NEED OLDER DATA?
          </h3>
          <p
            className="font-mono text-[11px] tracking-wider leading-relaxed"
            style={{ color: "var(--lb-text-muted)" }}
          >
            This archive only shows the past 7 days. For leaderboard data older
            than one week, join our Discord server where we maintain a
            comprehensive historical record with weekly and monthly snapshots.
          </p>
        </div>

        <a
          href={DISCORD_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 border px-5 py-3 font-mono text-xs font-bold tracking-wider transition-all flex-shrink-0"
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
          JOIN_DISCORD
          <ExternalLink size={14} />
        </a>
      </div>

      {/* Footer detail */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 px-4 py-3 sm:py-2 border-t w-full"
        style={{
          background: "var(--lb-surface)",
          borderColor: "var(--lb-border)",
        }}
      >
        <span
          className="font-mono text-[9px] tracking-wider"
          style={{ color: "var(--lb-text-dim)" }}
        >
          [DISCORD_ARCHIVE] Monthly snapshots available • Weekly recaps posted
          every Sunday
        </span>
        <ChevronRight
          size={12}
          style={{ color: "var(--lb-text-dim)" }}
          className="ml-auto"
        />
      </div>
    </div>
  );
}
