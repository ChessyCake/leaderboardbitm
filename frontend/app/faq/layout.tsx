import Sidebar from "@/components/leaderboard/Sidebar";

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: "var(--lb-bg)" }}>
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 pl-16 md:pl-[220px] w-full min-h-screen transition-all duration-300 min-w-0 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
