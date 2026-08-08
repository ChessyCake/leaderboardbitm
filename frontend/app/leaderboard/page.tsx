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
import { useRouter } from "next/navigation";
import { Trophy } from "lucide-react";



const INITIAL_STATS: StatsOverview = {
  activeToday: 0,
  solvedToday: 0,
  cfSolvedToday: 0,
  lcSolvedToday: 0,
};

export default function LeaderboardPage() {
  const router = useRouter();
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [stats, setStats] = useState<StatsOverview>(INITIAL_STATS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);


  useEffect(() => {
  const check = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.replace("/login");
      return;
    }

    const res = await api("/auth/me");

    if (!res.ok) {
      localStorage.removeItem("token");
      router.replace("/login");
    }
  };

  check();
}, [router]);

  const fetchLeaderboard = useCallback(async (pageNum: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api(`/api/v1/leaderboard?page=${pageNum}`);

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
          codeforcesUsername: u.codeforcesUsername,
          leetcodeUsername: u.leetcodeUsername,
          streak: u.streak ?? 0,
          todaySolved: u.todaySolved ?? 0,
          totalSolved: u.totalSolved ?? 0,
          cfSolvedToday: u.cfSolvedToday ?? 0,
          cfSolved: u.cfSolved ?? 0,
          cfStreak: u.cfStreak ?? 0,
          lcSolvedToday: u.lcSolvedToday ?? 0,
          lcSolved: u.lcSolved ?? 0,
          lcStreak: u.lcStreak ?? 0,
          cfRating: u.cfRating,
          cfMaxRating: u.cfMaxRating,
          cfRank: u.cfRank,
        })
      );

      setUsers(mapped);
      setPage(json.page);
      setTotalPages(json.totalPages);
      setTotalUsers(json.totalUsers);

      /* Use the aggregate stats from the API */
      if (json.stats) {
        setStats(json.stats);
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to fetch data");
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
        className="min-h-screen px-3 sm:px-6 md:px-10 pt-16 pb-6 sm:py-8 md:py-12 w-full overflow-hidden"
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
                <div className="flex w-12 sm:w-[100px] flex-shrink-0 items-center justify-center">
                  <div
                    className="h-8 w-8 sm:h-12 sm:w-12 rounded-sm animate-pulse"
                    style={{ background: "var(--lb-border)" }}
                  />
                </div>
                {/* Content skeleton */}
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
                {/* Streak skeleton */}
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

  /* ── Cyberpunk Error screen ── */
  if (error) {
    return (
      <div
        className="min-h-screen px-3 sm:px-6 md:px-10 pt-16 pb-6 sm:py-8 md:py-12 flex flex-col justify-center items-center w-full"
        style={{ background: "var(--lb-bg)" }}
      >
        <div
          className="border-2 p-5 md:p-8 max-w-md w-full mx-4 text-center relative overflow-hidden"
          style={{
            borderColor: "rgba(239, 68, 68, 0.4)",
            background: "rgba(239, 68, 68, 0.05)",
          }}
        >
          <div className="flex justify-center mb-6">
            <span
              className="inline-block border-2 px-4 py-2 font-mono text-sm tracking-widest animate-pulse"
              style={{
                borderColor: "rgb(239, 68, 68)",
                color: "rgb(239, 68, 68)",
                background: "rgba(239, 68, 68, 0.1)",
              }}
            >
              [ERROR: SYSTEM_FAILURE]
            </span>
          </div>

          <h2
            className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4"
            style={{ color: "var(--lb-text)" }}
          >
            UNABLE TO FETCH DATA
          </h2>

          <p
            className="font-mono text-xs tracking-wider mb-8 leading-relaxed"
            style={{ color: "var(--lb-text-secondary)" }}
          >
            We fell into some errors while connecting to the core server streams. Please verify your connection or try again.
          </p>

          <button
            onClick={() => fetchLeaderboard(page)}
            className="font-mono text-xs tracking-widest px-6 py-3 border-2 transition-all cursor-pointer bg-transparent"
            style={{
              borderColor: "rgb(239, 68, 68)",
              color: "rgb(239, 68, 68)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgb(239, 68, 68)";
              e.currentTarget.style.color = "black";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgb(239, 68, 68)";
            }}
          >
            RETRY_STREAM_CONNECTION
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 sm:px-6 md:px-10 pt-16 pb-6 sm:py-8 md:py-12 w-full overflow-hidden">
      {/* Header */}
      <LeaderboardHeader />

      {/* Stats Grid */}
      <div className="mt-8">
        <StatsGrid stats={stats} />
      </div>

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
          className="border overflow-hidden w-full"
          style={{ borderColor: "var(--lb-border)" }}
        >
          {users.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-24 text-center"
              style={{ background: "var(--lb-card-bg)" }}
            >
              <div
                className="mb-6 flex h-16 w-16 items-center justify-center rounded-sm border"
                style={{
                  borderColor: "var(--lb-border-accent)",
                  background: "var(--lb-surface)",
                  color: "var(--lb-accent)",
                }}
              >
                <Trophy size={28} />
              </div>

              <h2
                className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-2 uppercase"
                style={{ color: "var(--lb-text)" }}
              >
                No users have solved yet today
              </h2>

              <p
                className="font-mono text-[11px] tracking-wider uppercase max-w-sm"
                style={{ color: "var(--lb-text-muted)" }}
              >
                Be the first one to solve a problem and claim the top spot
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