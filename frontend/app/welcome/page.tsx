"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FiArrowRight, FiClock, FiMessageSquare, FiActivity } from "react-icons/fi";

export default function WelcomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="text-foreground min-h-screen flex items-center justify-center bg-background relative bg-dots p-4 sm:p-6 overflow-hidden">
      <div className="relative w-full max-w-[650px]">
        {/* Hard Shadow */}
        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-foreground hidden md:block z-0" />

        {/* Main Box */}
        <div className="relative bg-background border-2 border-foreground z-10 flex flex-col">
          {/* Header Bar */}
          <div className="h-12 bg-foreground text-background flex items-center px-4 font-mono font-bold text-sm tracking-wider shrink-0 border-b-2 border-foreground">
            SYSTEM_ORIENTATION
          </div>

          <div className="flex-1 p-5 sm:p-8 flex flex-col">
            <div className="space-y-6">
              <p className="w-fit px-3 py-1 text-xs font-mono font-bold text-black uppercase tracking-widest bg-[#ccff00]">
                BRIEFING_DOC
              </p>

              <div className="space-y-2">
                <h1 className="text-4xl sm:text-5xl font-black leading-tight text-foreground uppercase tracking-tighter">
                  Welcome to the <br />
                  <span className="text-[#ccff00] drop-shadow-[2px_2px_0px_#000]">CodeStack</span>
                </h1>
                <p className="text-sm sm:text-base text-foreground/80 font-medium max-w-[90%]">
                  Before you initialize your profile, here&apos;s what you need to know about the system.
                </p>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex gap-4 p-4 border-2 border-foreground bg-foreground/5 text-foreground">
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-[#ccff00] border-2 border-foreground text-black">
                    <FiActivity size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-sm mb-1 text-foreground">Track Your Progress</h3>
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      We monitor your Codeforces and LeetCode activity to rank you among peers. Compete, grow, and show off your stats on the global leaderboard.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border-2 border-foreground bg-foreground/5 text-foreground">
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-[#ccff00] border-2 border-foreground text-black">
                    <FiClock size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-sm mb-1 text-foreground">24-Hour Streak System</h3>
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      Streaks are the core of consistency. You have a strict 24-hour window to solve a problem and keep your flame alive. Miss a day, and the streak resets.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 border-2 border-foreground bg-foreground/5 text-foreground">
                  <div className="shrink-0 flex items-center justify-center w-10 h-10 bg-[#ccff00] border-2 border-foreground text-black">
                    <FiMessageSquare size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold uppercase tracking-wider text-sm mb-1 text-foreground">Discord Integration</h3>
                    <p className="text-xs text-foreground/70 leading-relaxed">
                      Our live bot automatically broadcasts daily updates, top performers, and real-time stats directly to the Discord server. You will be seen.
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-14 w-full sm:w-fit mt-8 pt-4">
                <div className="absolute inset-0 translate-x-2 translate-y-2 bg-foreground hidden sm:block" />
                <button
                  onClick={() => router.push("/onboarding")}
                  className="relative z-10 w-full h-14 px-8 flex items-center justify-center gap-3 bg-[#ccff00] border-2 border-foreground font-mono font-bold text-black text-sm tracking-wider cursor-pointer hover:bg-[#b3e600] active:translate-x-[2px] active:translate-y-[2px] transition-all uppercase"
                >
                  Proceed to Onboarding <FiArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
