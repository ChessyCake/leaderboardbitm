"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

import { GiLaurelsTrophy } from "react-icons/gi";
import { FaCode } from "react-icons/fa6";

export default function Onboarding() {
  const router = useRouter();

  const [leetcode, setLeetcode] = useState("");
  const [codeforces, setCodeforces] = useState("");

  const [loading, setLoading] = useState(false);

  const submit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api("/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leetcode,
          codeforces,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      router.replace("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background bg-dots flex items-center justify-center p-6 md:p-10 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[320px_480px] gap-8 lg:gap-12 items-stretch max-w-5xl w-full">
        
        {/* LEFT PANEL */}
        <div className="relative w-full h-full flex flex-col">
          {/* Offset Shadow */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-foreground hidden md:block" />
          
          {/* Main Card */}
          <div className="relative h-full flex flex-col border-2 border-foreground bg-background p-8">
            
            <div className="inline-flex items-center mb-6 text-xs font-mono font-bold text-[#ccff00] bg-foreground/10 w-fit px-2 py-1 border border-foreground/20">
              [SYS: INIT]
            </div>

            <h1 className="text-4xl lg:text-5xl font-black leading-[0.95] tracking-tighter text-foreground uppercase break-words">
              OPERATOR<br />
              REGISTRATION
            </h1>

            <p className="mt-6 text-sm leading-relaxed text-foreground/70 font-medium max-w-[280px]">
              Connect your codeforces and leetcode data streams. One of the field is optional
            </p>

            
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative w-full h-full flex flex-col">
          {/* Offset Shadow */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-foreground hidden md:block" />
          
          {/* Main Form */}
          <form
            onSubmit={submit}
            className="relative h-full flex flex-col border-2 border-foreground bg-background"
          >
            {/* Header */}
            <div className="h-12 border-b-2 border-foreground bg-background flex items-center justify-between px-6 shrink-0">
              <span className="font-mono text-xs font-bold text-foreground flex items-center gap-2">
                &lt;/&gt; INPUT_STREAM
              </span>
              <span className="font-mono text-[10px] font-bold bg-foreground text-background px-2 py-1">
                [STEP_01]
              </span>
            </div>

            <div className="flex-1 p-6 md:p-8 flex flex-col gap-8 justify-between">
              
              <div className="flex flex-col gap-8">
                {/* LeetCode Input */}
                <div className="space-y-3">
                  <label className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                    LEETCODE USERNAME
                  </label>
                  <div className="border-2 border-foreground h-12 flex items-center group focus-within:ring-2 focus-within:ring-[#ccff00] transition-all bg-background">
                    <div className="h-full aspect-square bg-foreground text-background flex items-center justify-center border-r-2 border-foreground">
                      <GiLaurelsTrophy className="w-5 h-5" />
                    </div>
                    <input
                      value={leetcode}
                      onChange={(e) => setLeetcode(e.target.value)}
                      placeholder="Enter handle..."
                      className="flex-1 h-full px-4 bg-transparent outline-none text-foreground placeholder:text-foreground/40 font-mono text-sm"
                      required
                    />
                  </div>
                </div>

                {/* Codeforces Input */}
                <div className="space-y-3">
                  <label className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                    CODEFORCES USERNAME
                  </label>
                  <div className="border-2 border-foreground h-12 flex items-center group focus-within:ring-2 focus-within:ring-[#ccff00] transition-all bg-background">
                    <div className="h-full aspect-square bg-foreground text-background flex items-center justify-center border-r-2 border-foreground">
                      <FaCode className="w-5 h-5" />
                    </div>
                    <input
                      value={codeforces}
                      onChange={(e) => setCodeforces(e.target.value)}
                      placeholder="Enter handle..."
                      className="flex-1 h-full px-4 bg-transparent outline-none text-foreground placeholder:text-foreground/40 font-mono text-sm"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="mt-8">
                <button
                  disabled={loading}
                  className="w-full h-14 bg-[#ccff00] border-2 border-foreground font-mono font-bold text-black text-sm tracking-wider transition-all hover:bg-[#b3e600] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-70 disabled:active:translate-x-0 disabled:active:translate-y-0 flex items-center justify-center gap-2"
                >
                  {loading ? "INITIALIZING..." : "COMPLETE_ENROLLMENT →"}
                </button>
              </div>

            </div>
          </form>
        </div>
      </div>
    </main>
  );
}