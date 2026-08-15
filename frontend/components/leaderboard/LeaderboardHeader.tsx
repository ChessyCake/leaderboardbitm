export default function LeaderboardHeader() {
  return (
    <header className="mb-6 sm:mb-8">
      {/* Title */}
      <h1
        className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none"
        style={{ color: "var(--lb-text)" }}
      >
        SYS.RANK
      </h1>

      {/* Green accent bar */}
      <div className="mt-2 inline-block">
        <div
          className="px-3 sm:px-4 py-1.5 sm:py-2 -skew-x-3"
          style={{ background: "var(--lb-accent)" }}
        >
          <span
            className="block skew-x-3 font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight"
            style={{ color: "var(--lb-accent-text)" }}
          >
            {"// RANKINGS"}
          </span>
        </div>
      </div>
    </header>
  );
}
