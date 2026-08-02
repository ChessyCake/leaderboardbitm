import { Zap } from "lucide-react";
import type { LeaderboardUser } from "@/lib/types";

interface ManifestEntryProps {
  user: LeaderboardUser;
  rank: number;
}

function getTier(rank: number): string {
  if (rank === 1) return "TIER_S";
  if (rank <= 3) return "TIER_A";
  if (rank <= 10) return "TIER_B";
  return "TIER_C";
}

function getRole(rank: number): string | null {
  if (rank === 1) return "SYS_ADMIN";
  return null;
}

export default function ManifestEntry({ user, rank }: ManifestEntryProps) {
  const isFirst = rank === 1;
  const tier = user.tier || getTier(rank);
  const role = user.role || getRole(rank);
  const displayName =
    user.codeforcesUsername?.toUpperCase().replace(/\s/g, "_") ||
    user.name?.toUpperCase().replace(/\s/g, "_") ||
    "UNKNOWN";
  const userId = user.id ?? Math.floor(1000 + Math.random() * 9000);
  const rankStr = String(rank).padStart(2, "0");

  return (
    <div
      className="group relative flex items-stretch overflow-hidden border-b transition-colors"
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
      <div className="relative flex w-[100px] flex-shrink-0 items-center justify-center overflow-hidden">
        {/* Green accent block for #1 */}
        {isFirst && (
          <div
            className="absolute inset-0"
            style={{ background: "var(--lb-accent)" }}
          />
        )}
        <span
          className="relative font-display font-black text-6xl select-none"
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
      <div className="flex flex-1 flex-col justify-center py-5 px-6 min-w-0">
        {/* Top row: name + ID */}
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* Username */}
            <h3
              className="font-display text-2xl md:text-3xl font-bold tracking-tight"
              style={{ color: "var(--lb-text)" }}
            >
              {displayName}
            </h3>

            {/* Tags */}
            <div className="flex items-center gap-2 mt-2">
              <span
                className="inline-block border px-2 py-0.5 font-mono text-[10px] tracking-wider"
                style={{
                  borderColor: "var(--lb-tag-border)",
                  color: "var(--lb-tag-text)",
                }}
              >
                {tier}
              </span>
              {role && (
                <span
                  className="inline-block border px-2 py-0.5 font-mono text-[10px] tracking-wider"
                  style={{
                    borderColor: "var(--lb-tag-border)",
                    color: "var(--lb-tag-text)",
                  }}
                >
                  {role}
                </span>
              )}
            </div>
          </div>

          {/* ID label */}
          <span
            className="font-mono text-[10px] tracking-wider flex-shrink-0 mt-1"
            style={{ color: "var(--lb-text-muted)" }}
          >
            [ID: {userId}]
          </span>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-3 mt-5">
          <StatField label="SOLVED (TODAY)" value={user.todaySolved} />
          <StatField
            label="SOLVED (TOT)"
            value={user.totalSolved.toLocaleString()}
          />
          <StatField
            label="CF RATING"
            value={user.cfRating ?? "—"}
          />
          <StatField
            label="LC RATING"
            value={user.lcRating ?? "—"}
          />
        </div>
      </div>

      {/* ── Streak Column ── */}
      <div
        className="relative flex w-[120px] flex-shrink-0 flex-col items-center justify-center checkerboard-pattern"
      >
        {/* Lightning icon */}
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full border"
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
          <Zap size={18} />
        </div>

        {/* Days count */}
        <span
          className="mt-2 font-mono text-[11px] font-bold tracking-wider"
          style={{
            color: isFirst
              ? "var(--lb-accent)"
              : "var(--lb-text-secondary)",
          }}
        >
          {user.streak} DAYS
        </span>
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
        className="font-mono text-[9px] tracking-widest uppercase"
        style={{ color: "var(--lb-text-muted)" }}
      >
        {label}
      </p>
      <p
        className="font-display text-xl font-bold mt-1"
        style={{ color: "var(--lb-text)" }}
      >
        {value}
      </p>
    </div>
  );
}
