import Sidebar from "@/components/leaderboard/Sidebar";

export default function ArchiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen" style={{ background: "var(--lb-bg)" }}>
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-[220px] min-h-screen">
        {children}
      </main>
    </div>
  );
}
