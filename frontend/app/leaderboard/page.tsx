"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { LeaderboardUser, StatsOverview } from "@/lib/types";

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
    lcRating: 2910,
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
    lcRating: 2750,
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
    lcRating: 2600,
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
    lcRating: 2400,
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
    lcRating: 2200,
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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api("/api/leaderboard?page=1");

        if (!res.ok) throw new Error("Failed to fetch leaderboard");

        const json = await res.json();

        /* Map backend response to our interface */
        const mapped: LeaderboardUser[] = (json.leaderboard || []).map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (u: any, i: number) => ({
            rank: u.rank ?? i + 1,
            name: u.name,
            avatar: u.avatar || "",
            codeforcesUsername: u.codeforcesUsername || u.name,
            streak: u.streak ?? 0,
            todaySolved: u.todaySolved ?? 0,
            totalSolved: u.totalSolved ?? 0,
            cfRating: u.cfRating,
            lcRating: u.lcRating,
            tier: u.tier,
            role: u.role,
            id: u.id,
          })
        );

        setUsers(mapped);

        /* If the API returns stats, use them */
        if (json.stats) {
          setStats(json.stats);
        }
      } catch {
        /* Fallback to mock data for development */
        console.warn("Backend unavailable — using mock data");
        setUsers(MOCK_USERS);
        setStats(MOCK_STATS);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--lb-bg)" }}
      >
        <div className="text-center">
          <div
            className="inline-block h-8 w-8 animate-spin rounded-sm border-2"
            style={{
              borderColor: "var(--lb-border)",
              borderTopColor: "var(--lb-accent)",
            }}
          />
          <p
            className="mt-4 font-mono text-xs tracking-widest"
            style={{ color: "var(--lb-text-muted)" }}
          >
            LOADING_MANIFEST...
          </p>
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

      {/* Active Manifest Section */}
      <div className="mt-10">
        {/* Section label */}
        <div className="mb-6">
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
        </div>

        {/* Entries */}
        <div
          className="border overflow-hidden"
          style={{ borderColor: "var(--lb-border)" }}
        >
          {users.map((user, i) => (
            <ManifestEntry
              key={user.id ?? user.rank ?? i}
              user={user}
              rank={i + 1}
            />
          ))}
        </div>
      </div>

      {/* Footer */}
      <LeaderboardFooter />
    </div>
  );
}