"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { FiCheckCircle } from "react-icons/fi";

function LoginSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();
  const [status, setStatus] = useState("Authenticating...");

  useEffect(() => {
    const finishLogin = async () => {
      const token = params.get("token");

      if (!token) {
        router.replace("/login");
        return;
      }

      localStorage.setItem("token", token);

      try {
        const res = await api("/auth/me");

        if (!res.ok) {
          localStorage.removeItem("token");
          router.replace("/login");
          return;
        }

        const user = await res.json();

        setStatus("Redirecting...");

        // Brief 4-second pause so the user sees the success state
        await new Promise((resolve) => setTimeout(resolve, 4000));

        if (user.onboarded) {
          router.replace("/leaderboard");
        } else {
          router.replace("/welcome");
        }
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    finishLogin();
  }, [params, router]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative bg-dots p-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <FiCheckCircle size={56} className="text-[#ccff00]" />
        <p className="text-lg font-mono font-bold text-foreground tracking-wider uppercase">
          {status}
        </p>
      </div>
    </main>
  );
}

export default function LoginSuccess() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen flex items-center justify-center bg-background relative bg-dots p-4">
          <p className="font-mono text-foreground/70">Loading...</p>
        </main>
      }
    >
      <LoginSuccessContent />
    </Suspense>
  );
}