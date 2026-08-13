import Link from "next/link";
import { FiAlertTriangle, FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative bg-dots p-4 sm:p-6 overflow-hidden">
      <div className="relative w-full max-w-[500px] h-auto min-h-[400px]">
        {/* Hard Shadow */}
        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-foreground hidden md:block z-0" />

        {/* Main Box */}
        <div className="absolute inset-0 bg-background border-2 border-foreground z-10 flex flex-col">
          {/* Header Bar */}
          <div className="h-12 bg-red-500 text-black flex items-center px-4 font-mono font-bold text-sm tracking-wider shrink-0 border-b-2 border-foreground">
            ERROR_404
          </div>

          <div className="flex-1 p-5 sm:p-8 flex flex-col items-center justify-center text-center">
            <FiAlertTriangle size={64} className="text-red-500 mb-6" />
            
            <h1 className="text-4xl sm:text-5xl font-black leading-tight text-foreground uppercase tracking-tighter mb-2">
              SECTOR NOT <span className="text-red-500">FOUND</span>
            </h1>
            
            <p className="text-sm text-foreground/70 font-mono max-w-[80%] mb-8">
              &gt; The requested endpoint does not exist in the current directory. Return to base.
            </p>

            <div className="relative h-14 w-full sm:w-fit">
              <div className="absolute inset-0 translate-x-2 translate-y-2 bg-foreground hidden sm:block" />
              <Link
                href="/leaderboard"
                className="relative z-10 w-full h-14 px-8 flex items-center justify-center gap-3 bg-[#ccff00] border-2 border-foreground font-mono font-bold text-black text-sm tracking-wider cursor-pointer hover:bg-[#b3e600] active:translate-x-[2px] active:translate-y-[2px] transition-all uppercase"
              >
                <FiHome size={18} />
                Return to Base
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
