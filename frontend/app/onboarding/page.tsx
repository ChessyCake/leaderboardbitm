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

  const submit = async (e: React.FormEvent) => {
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
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">

      {/* Background */}

      <div className="absolute inset-0">

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
          `,
            backgroundSize: "48px 48px",
          }}
        />

        <div className="absolute left-1/2 top-1/2 h-[850px] w-[850px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[180px]" />
      </div>

      {/* Card */}

      <form
        onSubmit={submit}
        className="relative z-10 w-full max-w-xl rounded-3xl border border-outline-variant/60 bg-surface-container/80 p-8 shadow-[0_30px_80px_rgba(0,0,0,.55)] backdrop-blur-2xl md:p-10"
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
          <GiLaurelsTrophy className="text-primary" size={30} />
        </div>

        <h1 className="text-center text-4xl font-bold text-on-surface">
          Complete your profile
        </h1>

        <p className="mt-3 text-center text-sm leading-7 text-on-surface-variant">
          Add your competitive programming usernames.
          <br />
          <span className="text-primary">
            You can leave one of them empty.
          </span>
        </p>

        <div className="mt-10 space-y-6">

          {/* Codeforces */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-on-surface">
              <FaCode size={16} className="text-primary" />
              Codeforces Username
            </label>

            <input
              value={codeforces}
              onChange={(e) => setCodeforces(e.target.value)}
              placeholder="tourist"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Leetcode */}

          <div>
            <label className="mb-2 flex items-center gap-2 text-sm font-medium text-on-surface">
              <FaCode size={16} className="text-primary" />
              LeetCode Username
            </label>

            <input
              value={leetcode}
              onChange={(e) => setLeetcode(e.target.value)}
              placeholder="delvety"
              className="w-full rounded-xl border border-outline-variant bg-surface px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-10 w-full rounded-xl cursor-pointer bg-primary py-3 text-base font-semibold text-on-primary transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Saving..." : "Continue"}
        </button>

        <p className="mt-6 text-center text-xs leading-6 text-on-surface-variant">
          Your usernames are used to fetch submissions and generate your
          leaderboard statistics.
        </p>
      </form>
    </main>
  );
}