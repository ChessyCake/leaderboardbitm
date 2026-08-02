export default function LeaderboardFooter() {
  return (
    <footer
      className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-t py-4 mt-12"
      style={{
        borderColor: "var(--lb-border)",
      }}
    >
      <span
        className="font-mono text-[11px] tracking-wider"
        style={{ color: "var(--lb-text-muted)" }}
      >
        [SYSTEM_MANIFEST_V2.0.4]
      </span>

      <div className="flex items-center gap-4">
        {["IP_LOGS", "LATENCY_OPTIMIZATION", "API_ROOT"].map((item) => (
          <span
            key={item}
            className="font-mono text-[10px] tracking-wider cursor-pointer transition-colors"
            style={{ color: "var(--lb-text-muted)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "var(--lb-accent)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--lb-text-muted)";
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </footer>
  );
}
