"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiAlertOctagon, FiRefreshCw } from "react-icons/fi";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative bg-dots p-4 sm:p-6 overflow-hidden">
      <div className="relative w-full max-w-[500px] h-auto min-h-[400px]">
        {/* Hard Shadow */}
        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-foreground hidden md:block z-0" />

        {/* Main Box */}
        <div className="absolute inset-0 bg-background border-2 border-foreground z-10 flex flex-col">
          {/* Header Bar */}
          <div className="h-12 bg-red-600 text-white flex items-center px-4 font-mono font-bold text-sm tracking-wider shrink-0 border-b-2 border-foreground">
            SYSTEM_FAILURE
          </div>

          <div className="flex-1 p-5 sm:p-8 flex flex-col items-center justify-center text-center">
            <FiAlertOctagon size={64} className="text-red-600 mb-6 animate-pulse" />
            
            <h1 className="text-4xl sm:text-5xl font-black leading-tight text-foreground uppercase tracking-tighter mb-2">
              CRITICAL <span className="text-red-600">ERROR</span>
            </h1>
            
            <p className="text-sm text-foreground/70 font-mono max-w-[80%] mb-8">
              &gt; A fatal exception occurred in the application matrix.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
              <div className="relative h-14 w-full sm:w-auto">
                <div className="absolute inset-0 translate-x-2 translate-y-2 bg-foreground hidden sm:block" />
                <button
                  onClick={() => reset()}
                  className="relative z-10 w-full sm:w-auto h-14 px-8 flex items-center justify-center gap-3 bg-red-500 border-2 border-foreground font-mono font-bold text-black text-sm tracking-wider cursor-pointer hover:bg-red-400 active:translate-x-[2px] active:translate-y-[2px] transition-all uppercase"
                >
                  <FiRefreshCw size={18} />
                  Reboot
                </button>
              </div>
              
              <div className="relative h-14 w-full sm:w-auto">
                <div className="absolute inset-0 translate-x-2 translate-y-2 bg-foreground hidden sm:block" />
                <Link
                  href="/leaderboard"
                  className="relative z-10 w-full sm:w-auto h-14 px-8 flex items-center justify-center gap-3 bg-[#ccff00] border-2 border-foreground font-mono font-bold text-black text-sm tracking-wider cursor-pointer hover:bg-[#b3e600] active:translate-x-[2px] active:translate-y-[2px] transition-all uppercase"
                >
                  Go Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
