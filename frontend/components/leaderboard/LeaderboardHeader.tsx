export default function LeaderboardHeader() {
  return (
    <header className="mb-8">
      {/* Title */}
      <h1
        className="font-display text-5xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none"
        style={{ color: "var(--lb-text)" }}
      >
        COMP_LEAGUE
      </h1>

      {/* Green accent bar */}
      <div className="mt-2 inline-block">
        <div
          className="px-4 py-2 -skew-x-3"
          style={{ background: "var(--lb-accent)" }}
        >
          <span
            className="block skew-x-3 font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight"
            style={{ color: "var(--lb-accent-text)" }}
          >
            // RANKINGS
          </span>
        </div>
      </div>
    </header>
  );
}
