"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type {
  CfContestUser,
  CfContestInfo,
  CfContestProblem,
  CfContestApiResponse,
} from "@/lib/types";

import LeaderboardFooter from "@/components/leaderboard/LeaderboardFooter";
import {
  Trophy,
  ExternalLink,
  RotateCw,
  Search,
  Award,
  Clock,
  Sparkles,
  Layers,
  Crosshair,
  SlidersHorizontal,
} from "lucide-react";
import { SiCodeforces } from "react-icons/si";

export default function CfContestPage() {
  const router = useRouter();

  const [contest, setContest] = useState<CfContestInfo | null>(null);
  const [problems, setProblems] = useState<CfContestProblem[]>([]);
  const [leaders, setLeaders] = useState<CfContestUser[]>([]);
  const [totalParticipants, setTotalParticipants] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"rank" | "points">("rank");

  // Optional authentication check
  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
  }, [router]);

  const fetchContestLeaderboard = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api("/cfcontest");
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: Failed to fetch contest data`);
      }

      const json: CfContestApiResponse = await res.json();

      if (json.error && (!json.leaderboard && !json.data && !json.darn)) {
        throw new Error(json.error);
      }

      const rawList = json.leaderboard || json.data || json.darn || [];
      const mapped: CfContestUser[] = rawList.map((u, idx) => ({
        rank: u.rank,
        localRank: u.localRank ?? idx + 1,
        name: u.name || "BITM Competitor",
        username: u.username,
        avatar: u.avatar || "",
        points: u.points ?? 0,
        penalty: u.penalty ?? 0,
        problemsSolved:
          u.problemsSolved ??
          (Array.isArray(u.problemResults)
            ? u.problemResults.filter((p) => p && p.points > 0).length
            : 0),
        problemResults: u.problemResults || [],
      }));

      // Sort according to local rank / CF rank initially
      mapped.sort((a, b) => a.rank - b.rank);

      setLeaders(mapped);
      setContest(json.contest || null);
      setProblems(json.problems || []);
      setTotalParticipants(json.totalParticipants || 0);
    } catch (err: unknown) {
      console.error("Error fetching CF contest leaderboard:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to connect to Codeforces stream. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContestLeaderboard();
  }, [fetchContestLeaderboard]);

  // Filtered & sorted users
  const filteredLeaders = useMemo(() => {
    let list = [...leaders];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q)
      );
    }
    if (sortBy === "points") {
      list.sort((a, b) => b.points - a.points || a.rank - b.rank);
    } else {
      list.sort((a, b) => a.rank - b.rank);
    }
    return list;
  }, [leaders, searchQuery, sortBy]);

  // Top metrics computation
  const metrics = useMemo(() => {
    if (leaders.length === 0) {
      return {
        topPerformer: "N/A",
        topPerformerHandle: "—",
        bestGlobalRank: "—",
        topScore: 0,
        totalSolvedSum: 0,
      };
    }
    const topOne = leaders[0];
    const maxScore = Math.max(...leaders.map((u) => u.points));
    const totalSolved = leaders.reduce((acc, u) => acc + (u.problemsSolved || 0), 0);

    return {
      topPerformer: topOne.name,
      topPerformerHandle: topOne.username,
      bestGlobalRank: `#${topOne.rank.toLocaleString()}`,
      topScore: maxScore,
      totalSolvedSum: totalSolved,
    };
  }, [leaders]);

  // Top 3 for the podium
  const podiumTop3 = useMemo(() => {
    return leaders.slice(0, 3);
  }, [leaders]);

  /* ── SKELETON LOADING STATE ── */
  if (loading) {
    return (
      <div
        className="min-h-screen px-3 sm:px-6 md:px-10 pt-16 pb-6 sm:py-8 md:py-12 w-full overflow-hidden"
        style={{ background: "var(--lb-bg)" }}
      >
        {/* Header Skeleton */}
        <div className="mb-6 sm:mb-8">
          <div
            className="h-12 w-64 rounded-sm animate-pulse mb-3"
            style={{ background: "var(--lb-border)" }}
          />
          <div
            className="h-10 w-80 rounded-sm animate-pulse mb-3 -skew-x-3"
            style={{ background: "var(--lb-border-accent)" }}
          />
          <div
            className="h-4 w-96 rounded-sm animate-pulse"
            style={{ background: "var(--lb-border)" }}
          />
        </div>

        {/* Hero Card Skeleton */}
        <div
          className="p-6 mb-8 border"
          style={{
            borderColor: "var(--lb-border)",
            background: "var(--lb-card-bg)",
          }}
        >
          <div
            className="h-6 w-72 rounded-sm animate-pulse mb-4"
            style={{ background: "var(--lb-border)" }}
          />
          <div className="flex gap-4">
            <div
              className="h-8 w-28 rounded-sm animate-pulse"
              style={{ background: "var(--lb-border-accent)" }}
            />
            <div
              className="h-8 w-32 rounded-sm animate-pulse"
              style={{ background: "var(--lb-border-accent)" }}
            />
          </div>
        </div>

        {/* Metric Cards Skeleton */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-8"
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

        {/* Entries Skeleton */}
        <div
          className="border overflow-hidden"
          style={{ borderColor: "var(--lb-border)" }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="flex items-stretch border-b p-5"
              style={{
                background: "var(--lb-card-bg)",
                borderColor: "var(--lb-border)",
              }}
            >
              <div
                className="h-12 w-12 rounded-sm animate-pulse mr-4"
                style={{ background: "var(--lb-border)" }}
              />
              <div className="flex-1 space-y-2">
                <div
                  className="h-6 w-48 rounded-sm animate-pulse"
                  style={{ background: "var(--lb-border)" }}
                />
                <div
                  className="h-4 w-32 rounded-sm animate-pulse"
                  style={{ background: "var(--lb-border-accent)" }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* ── CYBERPUNK ERROR STATE ── */
  if (error) {
    return (
      <div
        className="min-h-screen px-3 sm:px-6 md:px-10 pt-16 pb-6 sm:py-8 md:py-12 flex flex-col justify-center items-center w-full"
        style={{ background: "var(--lb-bg)" }}
      >
        <div
          className="border-2 p-6 md:p-8 max-w-lg w-full text-center relative overflow-hidden"
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
              [ERROR: CF_TELEMETRY_FAILED]
            </span>
          </div>

          <h2
            className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4"
            style={{ color: "var(--lb-text)" }}
          >
            CONTEST STANDINGS OFFLINE
          </h2>

          <p
            className="font-mono text-xs tracking-wider mb-6 leading-relaxed"
            style={{ color: "var(--lb-text-secondary)" }}
          >
            {error}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => fetchContestLeaderboard()}
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
      </div>
    );
  }

  return (
    <div className="min-h-screen px-3 sm:px-6 md:px-10 pt-16 pb-6 sm:py-8 md:py-12 w-full overflow-hidden">
      {/* ── HEADER ── */}
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1
              className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none"
              style={{ color: "var(--lb-text)" }}
            >
              CF.ARENA
            </h1>

            <div className="mt-2 inline-block">
              <div
                className="px-3 sm:px-4 py-1.5 sm:py-2 -skew-x-3 flex items-center gap-2"
                style={{ background: "var(--lb-accent)" }}
              >
                <SiCodeforces className="text-black w-5 h-5 sm:w-6 sm:h-6" />
                <span
                  className="block skew-x-3 font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight uppercase"
                  style={{ color: "var(--lb-accent-text)" }}
                >
                  // CONTEST STANDINGS
                </span>
              </div>
            </div>

            <p
              className="mt-4 font-mono text-[11px] tracking-wider max-w-xl"
              style={{ color: "var(--lb-text-muted)" }}
            >
              Direct telemetry from the most recent Codeforces round. Track
              standings, global world ranks, and problem breakthroughs for BITM
              competitors.
            </p>
          </div>

          {/* Quick Actions & Refresh */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => fetchContestLeaderboard()}
              className="flex items-center gap-2 border px-4 py-2 font-mono text-xs tracking-wider transition-all cursor-pointer"
              style={{
                borderColor: "var(--lb-border-accent)",
                color: "var(--lb-text-secondary)",
                background: "var(--lb-surface)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--lb-accent)";
                e.currentTarget.style.color = "var(--lb-accent)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--lb-border-accent)";
                e.currentTarget.style.color = "var(--lb-text-secondary)";
              }}
              title="Refresh standings from Codeforces"
            >
              <RotateCw size={14} className={loading ? "animate-spin" : ""} />
              <span>SYNC_FEED</span>
            </button>

            {contest && (
              <a
                href={`https://codeforces.com/contest/${contest.id}/standings`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 border px-4 py-2 font-mono text-xs font-bold tracking-wider transition-all cursor-pointer"
                style={{
                  borderColor: "var(--lb-accent)",
                  background: "rgba(204, 255, 0, 0.08)",
                  color: "var(--lb-accent)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--lb-accent)";
                  e.currentTarget.style.color = "var(--lb-accent-text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(204, 255, 0, 0.08)";
                  e.currentTarget.style.color = "var(--lb-accent)";
                }}
              >
                <span>CF_STANDINGS</span>
                <ExternalLink size={13} />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* ── CONTEST HERO BANNER ── */}
      <section
        className="border relative overflow-hidden mb-8"
        style={{
          borderColor: "var(--lb-border)",
          background: "var(--lb-card-bg)",
        }}
      >
        {/* Top scanline header bar */}
        <div
          className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2.5 border-b"
          style={{
            background: "var(--lb-surface)",
            borderColor: "var(--lb-border)",
          }}
        >
          <div className="flex items-center gap-2">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: "var(--lb-accent)" }}
            />
            <span
              className="font-mono text-[10px] tracking-widest uppercase font-bold"
              style={{ color: "var(--lb-accent)" }}
            >
              {contest?.phase === "FINISHED" ? "[PREVIOUS_ROUND_FINALIZED]" : "[ROUND_LIVE]"}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] tracking-wider">
            <span style={{ color: "var(--lb-text-muted)" }}>CONTEST ID:</span>
            <span
              className="px-2 py-0.5 border font-bold"
              style={{
                borderColor: "var(--lb-border-accent)",
                color: "var(--lb-accent)",
                background: "var(--lb-bg)",
              }}
            >
              #{contest?.id || "—"}
            </span>
            {contest?.durationSeconds && (
              <span
                className="hidden sm:inline-flex items-center gap-1 ml-2"
                style={{ color: "var(--lb-text-muted)" }}
              >
                <Clock size={11} />
                {Math.round(contest.durationSeconds / 60)} MINS
              </span>
            )}
          </div>
        </div>

        {/* Banner Details */}
        <div className="p-4 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="font-mono text-[9px] tracking-widest uppercase font-bold px-2 py-0.5 border"
                style={{
                  borderColor: "var(--lb-border-accent)",
                  background: "var(--lb-surface)",
                  color: "var(--lb-accent)",
                }}
              >
                PREVIOUS CONTEST
              </span>
            </div>

            <h2
              className="font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight"
              style={{ color: "var(--lb-text)" }}
            >
              {contest?.name || "Codeforces Contest Standings"}
            </h2>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-3 font-mono text-[10px] sm:text-xs">
              <span
                className="px-2.5 py-1 border uppercase font-bold"
                style={{
                  borderColor: "var(--lb-border-accent)",
                  background: "var(--lb-surface)",
                  color: "var(--lb-text-secondary)",
                }}
              >
                TYPE: {contest?.type || "CF"}
              </span>

              {totalParticipants > 0 && (
                <span
                  className="px-2.5 py-1 border uppercase font-bold"
                  style={{
                    borderColor: "var(--lb-border-accent)",
                    background: "var(--lb-surface)",
                    color: "var(--lb-text-muted)",
                  }}
                >
                  GLOBAL FIELD: {totalParticipants.toLocaleString()} COMPETITORS
                </span>
              )}

              <span
                className="px-2.5 py-1 border uppercase font-bold"
                style={{
                  borderColor: "var(--lb-accent)",
                  background: "rgba(204, 255, 0, 0.06)",
                  color: "var(--lb-accent)",
                }}
              >
                BITM SQUAD: {leaders.length} RANKED
              </span>
            </div>
          </div>

          {/* Previous Contest Telemetry Card */}
          {contest && (
            <div
              className="flex flex-col gap-2 p-3 sm:p-4 border rounded-sm lg:w-[280px] shrink-0"
              style={{
                borderColor: "var(--lb-border-accent)",
                background: "var(--lb-surface)",
              }}
            >
              <div className="flex items-center justify-between">
                <span
                  className="font-mono text-[9px] tracking-widest uppercase font-bold"
                  style={{ color: "var(--lb-text-muted)" }}
                >
                  STATUS TELEMETRY
                </span>
                <span
                  className="font-mono text-[9px] font-bold"
                  style={{ color: "var(--lb-accent)" }}
                >
                  [{contest.phase}]
                </span>
              </div>

              {contest.startTimeSeconds && (
                <div className="flex items-center justify-between text-xs font-mono pt-1">
                  <span style={{ color: "var(--lb-text-muted)" }}>CONTEST DATE:</span>
                  <span style={{ color: "var(--lb-text)" }} className="font-bold">
                    {new Date(contest.startTimeSeconds * 1000).toLocaleDateString(undefined, {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              )}

              <a
                href={`https://codeforces.com/contest/${contest.id}/standings`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-1.5 px-3 py-1.5 border font-mono text-xs font-bold tracking-wider transition-all"
                style={{
                  background: "var(--lb-accent)",
                  color: "var(--lb-accent-text)",
                  borderColor: "var(--lb-accent)",
                }}
              >
                <span>OFFICIAL STANDINGS</span>
                <ExternalLink size={12} />
              </a>
            </div>
          )}
        </div>

        {/* Problems Strip (if available) */}
        {problems.length > 0 && (
          <div
            className="border-t px-4 sm:px-6 py-3 flex flex-wrap items-center gap-2"
            style={{
              borderColor: "var(--lb-border)",
              background: "var(--lb-surface)",
            }}
          >
            <span
              className="font-mono text-[9px] tracking-widest uppercase mr-2"
              style={{ color: "var(--lb-text-dim)" }}
            >
              PROBLEMS:
            </span>
            {problems.map((prob) => (
              <a
                key={prob.index}
                href={`https://codeforces.com/contest/${contest?.id || ""}/problem/${prob.index}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-2.5 py-1 border font-mono text-[10px] tracking-wider transition-all hover:scale-105"
                style={{
                  borderColor: "var(--lb-border-accent)",
                  background: "var(--lb-card-bg)",
                  color: "var(--lb-text)",
                }}
                title={`${prob.index}. ${prob.name} ${prob.rating ? `[${prob.rating}]` : ""}`}
              >
                <span className="font-bold text-[var(--lb-accent)]">
                  {prob.index}
                </span>
                <span className="max-w-[90px] truncate hidden sm:inline text-[var(--lb-text-secondary)]">
                  {prob.name}
                </span>
                {prob.rating && (
                  <span
                    className="text-[9px] px-1 py-0.2 rounded-xs"
                    style={{
                      background: "rgba(255,255,255,0.06)",
                      color: "var(--lb-text-muted)",
                    }}
                  >
                    {prob.rating}
                  </span>
                )}
              </a>
            ))}
          </div>
        )}
      </section>

      {/* ── METRIC CARDS GRID ── */}
      <section
        className="grid grid-cols-2 lg:grid-cols-4 gap-px mb-10 w-full"
        style={{ background: "var(--lb-border)" }}
      >
        {/* Card 1: Top Performer */}
        <div
          className="relative overflow-hidden p-3 sm:p-5"
          style={{
            background: "var(--lb-card-highlight-bg)",
            borderLeft: "3px solid var(--lb-accent)",
          }}
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span
              className="font-mono text-[9px] sm:text-[10px] tracking-wider truncate"
              style={{ color: "var(--lb-text-muted)" }}
            >
              [CF.01] TOP PERFORMER
            </span>
            <Trophy
              size={14}
              className="sm:w-4 sm:h-4 shrink-0"
              style={{ color: "var(--lb-accent)" }}
            />
          </div>
          <p
            className="font-display text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight truncate uppercase"
            style={{ color: "var(--lb-accent)" }}
          >
            {metrics.topPerformer}
          </p>
          <p
            className="font-mono text-[8px] sm:text-[10px] tracking-widest mt-1 sm:mt-2 uppercase truncate"
            style={{ color: "var(--lb-text-muted)" }}
          >
            @{metrics.topPerformerHandle}
          </p>
        </div>

        {/* Card 2: Best Global Rank */}
        <div
          className="relative overflow-hidden p-3 sm:p-5"
          style={{ background: "var(--lb-card-bg)" }}
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span
              className="font-mono text-[9px] sm:text-[10px] tracking-wider truncate"
              style={{ color: "var(--lb-text-muted)" }}
            >
              [CF.02] BEST WORLD RANK
            </span>
            <Crosshair
              size={14}
              className="sm:w-4 sm:h-4 shrink-0"
              style={{ color: "var(--lb-text-muted)" }}
            />
          </div>
          <p
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight truncate"
            style={{ color: "var(--lb-text)" }}
          >
            {metrics.bestGlobalRank}
          </p>
          <p
            className="font-mono text-[8px] sm:text-[10px] tracking-widest mt-1 sm:mt-2 uppercase truncate"
            style={{ color: "var(--lb-text-muted)" }}
          >
            GLOBAL STANDING
          </p>
        </div>

        {/* Card 3: BITM Participants */}
        <div
          className="relative overflow-hidden p-3 sm:p-5"
          style={{ background: "var(--lb-card-bg)" }}
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span
              className="font-mono text-[9px] sm:text-[10px] tracking-wider truncate"
              style={{ color: "var(--lb-text-muted)" }}
            >
              [CF.03] BITM ENTRANTS
            </span>
            <Layers
              size={14}
              className="sm:w-4 sm:h-4 shrink-0"
              style={{ color: "var(--lb-text-muted)" }}
            />
          </div>
          <p
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight truncate"
            style={{ color: "var(--lb-text)" }}
          >
            {leaders.length}
          </p>
          <p
            className="font-mono text-[8px] sm:text-[10px] tracking-widest mt-1 sm:mt-2 uppercase truncate"
            style={{ color: "var(--lb-text-muted)" }}
          >
            ACTIVE MEMBERS
          </p>
        </div>

        {/* Card 4: Top Score */}
        <div
          className="relative overflow-hidden p-3 sm:p-5"
          style={{ background: "var(--lb-card-bg)" }}
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span
              className="font-mono text-[9px] sm:text-[10px] tracking-wider truncate"
              style={{ color: "var(--lb-text-muted)" }}
            >
              [CF.04] TOP SCORE
            </span>
            <Sparkles
              size={14}
              className="sm:w-4 sm:h-4 shrink-0"
              style={{ color: "var(--lb-text-muted)" }}
            />
          </div>
          <p
            className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight truncate"
            style={{ color: "var(--lb-text)" }}
          >
            {metrics.topScore.toLocaleString()}
          </p>
          <p
            className="font-mono text-[8px] sm:text-[10px] tracking-widest mt-1 sm:mt-2 uppercase truncate"
            style={{ color: "var(--lb-text-muted)" }}
          >
            POINTS SECURED
          </p>
        </div>
      </section>

      {/* ── TOP 3 PODIUM SHOWCASE (If >= 2 participants) ── */}
      {podiumTop3.length >= 2 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <span
              className="inline-block border px-3 py-1 font-mono text-[11px] tracking-widest"
              style={{
                borderColor: "var(--lb-border-accent)",
                color: "var(--lb-text-secondary)",
                background: "var(--lb-surface)",
              }}
            >
              {"// TOP_OF_THE_TABLE // PODIUM"}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {podiumTop3.map((user, idx) => {
              const isGold = idx === 0;
              const isSilver = idx === 1;
              const isBronze = idx === 2;

              const borderHighlight = isGold
                ? "var(--lb-accent)"
                : isSilver
                ? "#c0c0c0"
                : "#cd7f32";

              const badgeText = isGold ? "CHAMPION" : isSilver ? "RUNNER_UP" : "3RD_PLACE";

              return (
                <div
                  key={user.username}
                  className="relative border p-5 flex flex-col justify-between overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    borderColor: borderHighlight,
                    background: isGold
                      ? "linear-gradient(180deg, rgba(204, 255, 0, 0.08) 0%, var(--lb-card-bg) 100%)"
                      : "var(--lb-card-bg)",
                    boxShadow: isGold
                      ? "0 0 25px rgba(204, 255, 0, 0.12)"
                      : "none",
                  }}
                >
                  {/* Top Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="font-mono text-[9px] font-bold px-2 py-0.5 border tracking-widest"
                      style={{
                        borderColor: borderHighlight,
                        color: borderHighlight,
                        background: "rgba(0,0,0,0.4)",
                      }}
                    >
                      {badgeText}
                    </span>

                    <span
                      className="font-mono text-[10px] tracking-wider"
                      style={{ color: "var(--lb-text-muted)" }}
                    >
                      LOCAL #{idx + 1}
                    </span>
                  </div>

                  {/* User Profile */}
                  <div className="mb-4 flex items-center gap-3">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-11 h-11 rounded-sm border shrink-0 object-cover"
                        style={{ borderColor: borderHighlight }}
                      />
                    ) : (
                      <div
                        className="w-11 h-11 rounded-sm border flex items-center justify-center font-display font-black text-sm shrink-0"
                        style={{
                          borderColor: borderHighlight,
                          background: "var(--lb-surface)",
                          color: borderHighlight,
                        }}
                      >
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0">
                      <h3
                        className="font-display text-xl sm:text-2xl font-bold tracking-tight truncate uppercase"
                        style={{ color: isGold ? "var(--lb-accent)" : "var(--lb-text)" }}
                      >
                        {user.name}
                      </h3>
                      <a
                        href={`https://codeforces.com/profile/${user.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-mono text-xs mt-0.5 hover:underline text-[var(--lb-text-secondary)]"
                      >
                        <SiCodeforces size={12} />
                        <span>{user.username}</span>
                      </a>
                    </div>
                  </div>

                  {/* Score & Global rank pills */}
                  <div
                    className="grid grid-cols-2 gap-2 pt-3 border-t mt-auto"
                    style={{ borderColor: "var(--lb-border)" }}
                  >
                    <div>
                      <p
                        className="font-mono text-[8px] uppercase tracking-wider"
                        style={{ color: "var(--lb-text-muted)" }}
                      >
                        SCORE
                      </p>
                      <p
                        className="font-display text-xl font-bold"
                        style={{ color: "var(--lb-text)" }}
                      >
                        {user.points.toLocaleString()}
                      </p>
                    </div>

                    <div>
                      <p
                        className="font-mono text-[8px] uppercase tracking-wider"
                        style={{ color: "var(--lb-text-muted)" }}
                      >
                        WORLD RANK
                      </p>
                      <p
                        className="font-display text-xl font-bold"
                        style={{ color: borderHighlight }}
                      >
                        #{user.rank.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ── SEARCH & FILTER CONTROLS ── */}
      <section className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Section label */}
          <div className="flex items-center gap-3">
            <span
              className="inline-block border px-4 py-2 font-mono text-xs tracking-widest font-bold"
              style={{
                borderColor: "var(--lb-border-accent)",
                color: "var(--lb-text-secondary)",
                background: "var(--lb-surface)",
              }}
            >
              {"// CONTEST_MANIFEST"}
            </span>

            <span
              className="font-mono text-[10px] tracking-wider"
              style={{ color: "var(--lb-text-muted)" }}
            >
              [{filteredLeaders.length} MATCHED]
            </span>
          </div>

          {/* Search bar & Sort selector */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div
              className="flex items-center gap-2 border px-3 py-1.5"
              style={{
                borderColor: "var(--lb-border-accent)",
                background: "var(--lb-surface)",
              }}
            >
              <Search size={13} style={{ color: "var(--lb-text-muted)" }} />
              <input
                type="text"
                placeholder="Search user / handle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent font-mono text-xs outline-none w-36 sm:w-48"
                style={{ color: "var(--lb-text)" }}
              />
            </div>

            {/* Sort Toggle */}
            <div
              className="flex items-center border font-mono text-xs"
              style={{
                borderColor: "var(--lb-border-accent)",
                background: "var(--lb-surface)",
              }}
            >
              <span
                className="px-2.5 py-1.5 flex items-center gap-1 text-[10px]"
                style={{ color: "var(--lb-text-dim)" }}
              >
                <SlidersHorizontal size={11} />
                SORT:
              </span>
              <button
                onClick={() => setSortBy("rank")}
                className="px-2.5 py-1.5 text-[10px] cursor-pointer transition-colors"
                style={{
                  background:
                    sortBy === "rank" ? "var(--lb-accent)" : "transparent",
                  color:
                    sortBy === "rank" ? "var(--lb-accent-text)" : "var(--lb-text-muted)",
                  fontWeight: sortBy === "rank" ? "bold" : "normal",
                }}
              >
                RANK
              </button>
              <button
                onClick={() => setSortBy("points")}
                className="px-2.5 py-1.5 text-[10px] cursor-pointer transition-colors"
                style={{
                  background:
                    sortBy === "points" ? "var(--lb-accent)" : "transparent",
                  color:
                    sortBy === "points"
                      ? "var(--lb-accent-text)"
                      : "var(--lb-text-muted)",
                  fontWeight: sortBy === "points" ? "bold" : "normal",
                }}
              >
                POINTS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FULL LEADERBOARD TABLE / MANIFEST ── */}
      <section
        className="border overflow-hidden w-full mb-12"
        style={{ borderColor: "var(--lb-border)" }}
      >
        {filteredLeaders.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-20 text-center px-4"
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
              <Crosshair size={28} />
            </div>

            <h2
              className="font-display text-xl sm:text-2xl font-bold tracking-tight mb-2 uppercase"
              style={{ color: "var(--lb-text)" }}
            >
              No competitors found
            </h2>

            <p
              className="font-mono text-[11px] tracking-wider uppercase max-w-md leading-relaxed"
              style={{ color: "var(--lb-text-muted)" }}
            >
              {searchQuery
                ? `No results matched your query "${searchQuery}". Try a different name or handle.`
                : "No registered BITM users participated in this contest, or standings are currently updating on Codeforces."}
            </p>
          </div>
        ) : (
          filteredLeaders.map((user, idx) => {
            const isFirst = (user.localRank || idx + 1) === 1;
            const rankStr = String(user.localRank || idx + 1).padStart(2, "0");

            return (
              <div
                key={user.username}
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

                {/* ── Main Content Column ── */}
                <div className="flex flex-1 flex-col justify-center py-3 px-3 sm:py-5 sm:px-6 min-w-0">
                  {/* Top row: Name + Handle + Global Rank */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-1 sm:gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      {user.avatar ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm border shrink-0 object-cover"
                          style={{
                            borderColor: isFirst
                              ? "var(--lb-accent)"
                              : "var(--lb-border-accent)",
                          }}
                        />
                      ) : (
                        <div
                          className="w-9 h-9 sm:w-10 sm:h-10 rounded-sm border flex items-center justify-center font-display font-bold text-xs shrink-0"
                          style={{
                            borderColor: isFirst
                              ? "var(--lb-accent)"
                              : "var(--lb-border-accent)",
                            background: "var(--lb-surface)",
                            color: isFirst
                              ? "var(--lb-accent)"
                              : "var(--lb-text-muted)",
                          }}
                        >
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3
                            className="font-display text-lg sm:text-2xl font-bold tracking-tight truncate uppercase"
                            style={{ color: "var(--lb-text)" }}
                          >
                            {user.name}
                          </h3>

                          {isFirst && (
                            <span
                              className="font-mono text-[9px] px-2 py-0.5 border font-bold"
                              style={{
                                borderColor: "var(--lb-accent)",
                                color: "var(--lb-accent)",
                                background: "rgba(204, 255, 0, 0.1)",
                              }}
                            >
                              #1 BITM
                            </span>
                          )}
                        </div>

                        {/* Codeforces Profile Link */}
                        <div className="flex items-center gap-2 mt-0.5 font-mono text-[11px]">
                          <a
                            href={`https://codeforces.com/profile/${user.username}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 hover:text-white transition-colors"
                            style={{ color: "var(--lb-text-secondary)" }}
                          >
                            <SiCodeforces size={13} />
                            <span className="font-bold underline decoration-dotted">
                              {user.username}
                            </span>
                            <ExternalLink size={10} className="opacity-60" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Global Rank Tag */}
                    <div className="flex items-center gap-2 shrink-0 mt-1 sm:mt-0">
                      <span
                        className="font-mono text-[10px] sm:text-xs px-2.5 py-1 border font-bold"
                        style={{
                          borderColor: "var(--lb-border-accent)",
                          background: "var(--lb-surface)",
                          color: isFirst ? "var(--lb-accent)" : "var(--lb-text)",
                        }}
                      >
                        WORLD: #{user.rank.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Stat Fields + Problem Outcomes */}
                  <div className="flex flex-wrap items-end justify-between gap-4 mt-3 sm:mt-5 pt-3 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
                    <div className="flex flex-wrap gap-x-6 sm:gap-x-10 gap-y-2">
                      {/* Score */}
                      <div>
                        <p
                          className="font-mono text-[7px] sm:text-[9px] tracking-widest uppercase"
                          style={{ color: "var(--lb-text-muted)" }}
                        >
                          TOTAL SCORE
                        </p>
                        <p
                          className="font-display text-base sm:text-xl font-bold mt-0.5"
                          style={{ color: "var(--lb-text)" }}
                        >
                          {user.points.toLocaleString()}
                        </p>
                      </div>

                      {/* Problems Solved */}
                      <div>
                        <p
                          className="font-mono text-[7px] sm:text-[9px] tracking-widest uppercase"
                          style={{ color: "var(--lb-text-muted)" }}
                        >
                          SOLVED
                        </p>
                        <p
                          className="font-display text-base sm:text-xl font-bold mt-0.5 flex items-center gap-1"
                          style={{ color: "var(--lb-accent)" }}
                        >
                          <span>{user.problemsSolved ?? 0}</span>
                          {problems.length > 0 && (
                            <span
                              className="text-xs font-normal"
                              style={{ color: "var(--lb-text-muted)" }}
                            >
                              / {problems.length}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Penalty (if nonzero) */}
                      {typeof user.penalty === "number" && user.penalty > 0 && (
                        <div>
                          <p
                            className="font-mono text-[7px] sm:text-[9px] tracking-widest uppercase"
                            style={{ color: "var(--lb-text-muted)" }}
                          >
                            PENALTY
                          </p>
                          <p
                            className="font-display text-base sm:text-xl font-bold mt-0.5"
                            style={{ color: "var(--lb-text-secondary)" }}
                          >
                            {user.penalty}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Problem breakdown pills */}
                    {Array.isArray(user.problemResults) &&
                      user.problemResults.length > 0 &&
                      problems.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1">
                          {user.problemResults.map((pr, pIdx) => {
                            const probIndex =
                              problems[pIdx]?.index || String.fromCharCode(65 + pIdx);
                            const isSolved = pr && pr.points > 0;
                            const hasAttempt =
                              pr &&
                              (pr.rejectedAttemptCount ?? 0) > 0 &&
                              !isSolved;

                            return (
                              <span
                                key={pIdx}
                                className="font-mono text-[9px] px-1.5 py-0.5 border rounded-xs font-bold"
                                style={{
                                  borderColor: isSolved
                                    ? "var(--lb-accent)"
                                    : hasAttempt
                                    ? "rgba(239, 68, 68, 0.4)"
                                    : "var(--lb-border)",
                                  background: isSolved
                                    ? "rgba(204, 255, 0, 0.12)"
                                    : hasAttempt
                                    ? "rgba(239, 68, 68, 0.1)"
                                    : "transparent",
                                  color: isSolved
                                    ? "var(--lb-accent)"
                                    : hasAttempt
                                    ? "#ff5555"
                                    : "var(--lb-text-dim)",
                                }}
                                title={`${probIndex}: ${
                                  isSolved
                                    ? `Solved (${pr.points} pts)`
                                    : hasAttempt
                                    ? `Failed (${pr.rejectedAttemptCount} attempts)`
                                    : "Unattempted"
                                }`}
                              >
                                {probIndex}
                              </span>
                            );
                          })}
                        </div>
                      )}
                  </div>
                </div>

                {/* ── Trailing Accent / Lightning Column ── */}
                <div
                  className="relative flex w-12 sm:w-[100px] flex-shrink-0 flex-col items-center justify-center checkerboard-pattern border-l sm:border-l-0"
                  style={{ borderColor: "var(--lb-border)" }}
                >
                  <div
                    className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full border transition-colors"
                    style={{
                      borderColor: isFirst
                        ? "var(--lb-accent)"
                        : "var(--lb-border-accent)",
                      background: isFirst
                        ? "var(--lb-accent)"
                        : "var(--lb-surface)",
                      color: isFirst
                        ? "var(--lb-accent-text)"
                        : "var(--lb-text-muted)",
                    }}
                  >
                    {isFirst ? <Trophy size={16} /> : <Award size={16} />}
                  </div>

                  <span
                    className="font-mono text-[9px] tracking-widest mt-2 hidden sm:inline uppercase"
                    style={{
                      color: isFirst
                        ? "var(--lb-accent)"
                        : "var(--lb-text-muted)",
                      fontWeight: isFirst ? "bold" : "normal",
                    }}
                  >
                    {isFirst ? "LEADER" : `#${user.localRank || idx + 1}`}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </section>

      {/* ── FOOTER ── */}
      <LeaderboardFooter />
    </div>
  );
}
