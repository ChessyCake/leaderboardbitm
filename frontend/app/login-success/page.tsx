"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";

function LoginSuccessContent() {
  const router = useRouter();
  const params = useSearchParams();

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

        if (user.onboarded) {
          router.replace("/leaderboard");
        } else {
          router.replace("/onboarding");
        }
      } catch {
        localStorage.removeItem("token");
        router.replace("/login");
      }
    };

    finishLogin();
  }, [params, router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      Logging you in...
    </div>
  );
}

export default function LoginSuccess() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    }>
      <LoginSuccessContent />
    </Suspense>
  );
}