import { Users, Sigma, Zap, LayoutGrid } from "lucide-react";
import type { StatsOverview } from "@/lib/types";

interface StatsGridProps {
  stats: StatsOverview;
}

const CARD_CONFIG = [
  {
    sysCode: "SYS.01",
    label: "ACTIVE TODAY",
    key: "activeToday" as const,
    icon: Users,
    highlight: false,
  },
  {
    sysCode: "SYS.02",
    label: "SOLVED TODAY",
    key: "solvedToday" as const,
    icon: Sigma,
    highlight: true,
  },
  {
    sysCode: "SYS.03",
    label: "CF SOLVED",
    key: "cfSolvedToday" as const,
    icon: Zap,
    highlight: false,
  },
  {
    sysCode: "SYS.04",
    label: "LC SOLVED",
    key: "lcSolvedToday" as const,
    icon: LayoutGrid,
    highlight: false,
  },
];

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px w-full" style={{ background: "var(--lb-border)" }}>
      {CARD_CONFIG.map(({ sysCode, label, key, icon: Icon, highlight }) => (
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
              color: highlight
                ? "var(--lb-accent)"
                : "var(--lb-text)",
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
      ))}
    </div>
  );
}
