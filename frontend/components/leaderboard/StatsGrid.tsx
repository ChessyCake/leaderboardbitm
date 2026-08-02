import { Users, Sigma, Zap, LayoutGrid } from "lucide-react";
import type { StatsOverview } from "@/lib/types";

interface StatsGridProps {
  stats: StatsOverview;
}

const CARD_CONFIG = [
  {
    sysCode: "SYS.01",
    label: "STUDENTS ONLINE",
    key: "studentsOnline" as const,
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
    label: "ACTIVE STREAKS",
    key: "activeStreaks" as const,
    icon: Zap,
    highlight: false,
  },
  {
    sysCode: "SYS.04",
    label: "TOTAL REG",
    key: "totalRegistered" as const,
    icon: LayoutGrid,
    highlight: false,
  },
];

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px" style={{ background: "var(--lb-border)" }}>
      {CARD_CONFIG.map(({ sysCode, label, key, icon: Icon, highlight }) => (
        <div
          key={sysCode}
          className="relative overflow-hidden p-5"
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
          <div className="flex items-center justify-between mb-3">
            <span
              className="font-mono text-[10px] tracking-wider"
              style={{ color: "var(--lb-text-muted)" }}
            >
              [{sysCode}]
            </span>
            <Icon
              size={16}
              style={{
                color: highlight
                  ? "var(--lb-accent)"
                  : "var(--lb-text-muted)",
              }}
            />
          </div>

          {/* Value */}
          <p
            className="font-display text-3xl lg:text-4xl font-bold tracking-tight"
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
            className="font-mono text-[10px] tracking-widest mt-2 uppercase"
            style={{ color: "var(--lb-text-muted)" }}
          >
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
