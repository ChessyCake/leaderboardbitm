"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/api";
import type {
  LeaderboardUser,
  StatsOverview,
  LeaderboardApiResponse,
} from "@/lib/types";

import LeaderboardHeader from "@/components/leaderboard/LeaderboardHeader";
import StatsGrid from "@/components/leaderboard/StatsGrid";
import ManifestEntry from "@/components/leaderboard/ManifestEntry";
import LeaderboardFooter from "@/components/leaderboard/LeaderboardFooter";

/* ── Fallback mock data (used when backend is unreachable) ── */
const MOCK_USERS: LeaderboardUser[] = [
  {
    rank: 1,
    name: "Ghost Proto",
    avatar: "",
    codeforcesUsername: "GHOST_PROTO",
    streak: 42,
    todaySolved: 14,
    totalSolved: 1402,
    cfRating: 2450,
    tier: "TIER_S",
    role: "SYS_ADMIN",
    id: 8842,
  },
  {
    rank: 2,
    name: "Null Ptr",
    avatar: "",
    codeforcesUsername: "NULL_PTR",
    streak: 21,
    todaySolved: 8,
    totalSolved: 1120,
    cfRating: 2100,
    tier: "TIER_A",
    id: 7109,
  },
  {
    rank: 3,
    name: "Cyber Knight",
    avatar: "",
    codeforcesUsername: "CYBER_KNIGHT",
    streak: 15,
    todaySolved: 12,
    totalSolved: 980,
    cfRating: 1950,
    tier: "TIER_A",
    id: 9021,
  },
  {
    rank: 4,
    name: "Byte Storm",
    avatar: "",
    codeforcesUsername: "BYTE_STORM",
    streak: 9,
    todaySolved: 6,
    totalSolved: 870,
    cfRating: 1800,
    tier: "TIER_B",
    id: 4412,
  },
  {
    rank: 5,
    name: "Hex Venom",
    avatar: "",
    codeforcesUsername: "HEX_VENOM",
    streak: 7,
    todaySolved: 5,
    totalSolved: 650,
    cfRating: 1700,
    tier: "TIER_B",
    id: 3301,
  },
];

const MOCK_STATS: StatsOverview = {
  studentsOnline: 142,
  solvedToday: 1204,
  activeStreaks: 89,
  totalRegistered: 2450,
};

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [stats, setStats] = useState<StatsOverview>(MOCK_STATS);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [isMock, setIsMock] = useState(false);

  const fetchLeaderboard = useCallback(async (pageNum: number) => {
    setLoading(true);
    try {
      const res = await api(`/api/leaderboard?page=${pageNum}`);

      if (!res.ok) throw new Error("Failed to fetch leaderboard");

      const json: LeaderboardApiResponse = await res.json();

      /*
       * Map the backend response directly.
       * The controller returns:
       *   rank, name, avatar, codeforcesUsername, leetcodeUsername,
       *   streak, todaySolved, totalSolved, cfRating, cfMaxRating, cfRank
       */
      const mapped: LeaderboardUser[] = (json.leaderboard || []).map(
        (u) => ({
          rank: u.rank,
          name: u.name,
          avatar: u.avatar || "",
          codeforcesUsername: u.codeforcesUsername || u.name,
          leetcodeUsername: u.leetcodeUsername,
          streak: u.streak ?? 0,
          todaySolved: u.todaySolved ?? 0,
          totalSolved: u.totalSolved ?? 0,
          cfRating: u.cfRating,
          cfMaxRating: u.cfMaxRating,
          cfRank: u.cfRank,
        })
      );

      setUsers(mapped);
      setPage(json.page);
      setTotalPages(json.totalPages);
      setTotalUsers(json.totalUsers);
      setIsMock(false);

      /* Use the aggregate stats from the API */
      if (json.stats) {
        setStats(json.stats);
      }
    } catch {
      /* Fallback to mock data when backend is unreachable */
      console.warn("Backend unavailable — using mock data");
      setUsers(MOCK_USERS);
      setStats(MOCK_STATS);
      setTotalPages(1);
      setTotalUsers(MOCK_USERS.length);
      setIsMock(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(page);
  }, [page, fetchLeaderboard]);

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
        className="min-h-screen px-6 md:px-10 py-8 md:py-12"
        style={{ background: "var(--lb-bg)" }}
      >
        <LeaderboardHeader />

        {/* Stats skeleton */}
        <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "var(--lb-border)" }}>
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
              // LOADING_MANIFEST...
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
                {/* Rank skeleton */}
                <div className="flex w-[100px] flex-shrink-0 items-center justify-center">
                  <div
                    className="h-12 w-12 rounded-sm animate-pulse"
                    style={{ background: "var(--lb-border)" }}
                  />
                </div>
                {/* Content skeleton */}
                <div className="flex-1 py-5 px-6">
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
                {/* Streak skeleton */}
                <div className="flex w-[120px] flex-shrink-0 flex-col items-center justify-center">
                  <div
                    className="h-10 w-10 rounded-full animate-pulse"
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
    <div className="min-h-screen px-6 md:px-10 py-8 md:py-12">
      {/* Header */}
      <LeaderboardHeader />

      {/* Stats Grid */}
      <div className="mt-8">
        <StatsGrid stats={stats} />
      </div>

      {/* Data source indicator */}
      {isMock && (
        <div
          className="mt-4 flex items-center gap-2 border px-4 py-2"
          style={{
            borderColor: "rgba(255, 180, 0, 0.3)",
            background: "rgba(255, 180, 0, 0.05)",
          }}
        >
          <span
            className="inline-block h-2 w-2 rounded-full animate-pulse"
            style={{ background: "#ffb400" }}
          />
          <span
            className="font-mono text-[11px] tracking-wider"
            style={{ color: "#ffb400" }}
          >
            [WARN] BACKEND_OFFLINE — DISPLAYING CACHED MOCK DATA
          </span>
        </div>
      )}

      {/* Active Manifest Section */}
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
            // ACTIVE_MANIFEST
          </span>

          {/* Result count */}
          <span
            className="font-mono text-[10px] tracking-wider"
            style={{ color: "var(--lb-text-muted)" }}
          >
            [{totalUsers} REGISTERED]
          </span>
        </div>

        {/* Entries */}
        <div
          className="border overflow-hidden"
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
                [NO_DATA_FOUND]
              </p>
              <p
                className="font-mono text-[10px] tracking-wider mt-2"
                style={{ color: "var(--lb-text-dim)" }}
              >
                Manifest is empty. Register to appear on the leaderboard.
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

      {/* Footer */}
      <LeaderboardFooter />
    </div>
  );
}