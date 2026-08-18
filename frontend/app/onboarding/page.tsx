"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { toast } from "sonner";

import { GiLaurelsTrophy } from "react-icons/gi";
import { FaCode, FaCheck, FaCopy } from "react-icons/fa6";

export default function Onboarding() {
  const router = useRouter();

  const [leetcode, setLeetcode] = useState("");
  const [codeforces, setCodeforces] = useState("");
  const [platform, setPlatform] = useState<"both" | "leetcode" | "codeforces">("both");

  const [loading, setLoading] = useState(false);
  
  const [step, setStep] = useState<1 | 2>(1);
  const [verificationToken, setVerificationToken] = useState("");
  const [copied, setCopied] = useState(false);

  const problemIds = ["4A", "71A", "158A", "231A", "282A", "50A", "118A", "339A", "281A", "266A"];
  const [randomProblem] = useState(() => problemIds[Math.floor(Math.random() * problemIds.length)]);

  const submitStep1 = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payloadLeetcode = (platform === "both" || platform === "leetcode") ? leetcode : "";
      const payloadCodeforces = (platform === "both" || platform === "codeforces") ? codeforces : "";

      const res = await api("/api/v1/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          leetcode: payloadLeetcode,
          codeforces: payloadCodeforces,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setVerificationToken(data.verificationToken);
      setStep(2);
    } catch (err: unknown) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const submitStep2 = async () => {
    setLoading(true);
    try {
      const res = await api("/api/v1/onboarding/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      router.replace("/leaderboard");
    } catch (err: unknown) {
      console.error(err);
      toast.error((err instanceof Error ? err.message : "") || "Verification failed. Please ensure you completed the steps and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyToken = () => {
    navigator.clipboard.writeText(verificationToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

            <h1 className="text-3xl lg:text-4xl font-black leading-[0.95] tracking-tighter text-foreground uppercase">
              OPERATOR<br />
              REGISTRATION
            </h1>

            <p className="mt-6 text-sm leading-relaxed text-foreground/70 font-medium max-w-[280px]">
              {step === 1 
                ? "Connect your codeforces and leetcode data streams. One of the field is optional"
                : "Verify ownership of your connected data streams to complete enrollment."}
            </p>

            
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative w-full h-full flex flex-col">
          {/* Offset Shadow */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 bg-foreground hidden md:block" />
          
          {step === 1 ? (
            /* STEP 1 FORM */
            <form
              onSubmit={submitStep1}
              className="relative h-full flex flex-col border-2 border-foreground bg-background"
            >
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
                  {/* Platform Selection */}
                  <div className="space-y-3">
                    <label className="font-mono text-xs font-bold text-foreground uppercase tracking-wider">
                      SELECT PLATFORMS YOU USE
                    </label>
                    <div className="flex flex-wrap gap-4">
                      {(["both", "leetcode", "codeforces"] as const).map((opt) => (
                        <label key={opt} className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            name="platform"
                            value={opt}
                            checked={platform === opt}
                            onChange={(e) => setPlatform(e.target.value as "both" | "leetcode" | "codeforces")}
                            className="w-4 h-4 accent-[#ccff00]"
                          />
                          <span className="font-mono text-sm uppercase text-foreground">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* LeetCode Input */}
                  {(platform === "both" || platform === "leetcode") && (
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
                  )}

                  {/* Codeforces Input */}
                  {(platform === "both" || platform === "codeforces") && (
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
                  )}
                </div>

                <div className="mt-8">
                  <button
                    disabled={loading}
                    className="w-full h-14 bg-[#ccff00] border-2 border-foreground font-mono font-bold text-black text-sm tracking-wider transition-all hover:bg-[#b3e600] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-70 disabled:active:translate-x-0 disabled:active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {loading ? "INITIALIZING..." : "CONTINUE →"}
                  </button>
                </div>

              </div>
            </form>
          ) : (
            /* STEP 2 FORM */
            <div className="relative h-full flex flex-col border-2 border-foreground bg-background">
              <div className="h-12 border-b-2 border-foreground bg-background flex items-center justify-between px-6 shrink-0">
                <span className="font-mono text-xs font-bold text-foreground flex items-center gap-2">
                  &lt;/&gt; VERIFY_OWNERSHIP
                </span>
                <span className="font-mono text-[10px] font-bold bg-[#ccff00] text-black px-2 py-1">
                  [STEP_02]
                </span>
              </div>

              <div className="flex-1 p-6 md:p-8 flex flex-col gap-6 overflow-y-auto">
                <div className="space-y-2">
                  <p className="font-mono text-sm text-foreground">Your unique verification token:</p>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 block p-3 bg-black border border-foreground/30 font-mono text-sm break-all text-[#ccff00] font-bold tracking-wider">
                      {verificationToken}
                    </code>
                    <button 
                      onClick={copyToken}
                      className="p-3 bg-foreground text-background border-2 border-foreground hover:opacity-90 active:translate-y-1 transition-all"
                      title="Copy token"
                    >
                      {copied ? <FaCheck /> : <FaCopy />}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 mt-2">
                  {(platform === "both" || platform === "codeforces") && (
                    <div className="p-4 border-2 border-foreground/30 bg-foreground/5 space-y-2">
                      <h3 className="font-mono font-bold text-sm flex items-center gap-2 text-foreground">
                        <FaCode className="text-white" /> Codeforces Verification
                      </h3>
                      <p className="text-xs font-mono text-foreground/80 leading-relaxed">
                        Submit any code that results in a <strong>COMPILATION_ERROR</strong> to{" "}
                        <a href={`https://codeforces.com/problemset/problem/${randomProblem.slice(0, -1)}/${randomProblem.slice(-1)}`} target="_blank" rel="noopener noreferrer" className="text-[#ccff00] underline hover:opacity-80">
                          problem {randomProblem}
                        </a>. 
                        We will check your recent submissions.
                      </p>
                    </div>
                  )}

                  {(platform === "both" || platform === "leetcode") && (
                    <div className="p-4 border-2 border-foreground/30 bg-foreground/5 space-y-2">
                      <h3 className="font-mono font-bold text-sm flex items-center gap-2 text-foreground">
                        <GiLaurelsTrophy className="text-white" /> LeetCode Verification
                      </h3>
                      <p className="text-xs font-mono text-foreground/80 leading-relaxed">
                        Paste the verification token into the <strong>README</strong> section on your{" "}
                        <a href="https://leetcode.com/profile/" target="_blank" rel="noopener noreferrer" className="text-[#ccff00] underline hover:opacity-80">
                          LeetCode profile
                        </a>.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-auto pt-6">
                  <button
                    onClick={submitStep2}
                    disabled={loading}
                    className="w-full h-14 bg-[#ccff00] border-2 border-foreground font-mono font-bold text-black text-sm tracking-wider transition-all hover:bg-[#b3e600] active:translate-x-[2px] active:translate-y-[2px] disabled:opacity-70 disabled:active:translate-x-0 disabled:active:translate-y-0 flex items-center justify-center gap-2"
                  >
                    {loading ? "VERIFYING..." : "VERIFY_OWNERSHIP →"}
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="w-full mt-4 h-10 text-xs font-mono font-bold text-foreground/60 hover:text-foreground transition-colors"
                  >
                    ← BACK_TO_INPUT
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}