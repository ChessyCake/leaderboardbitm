"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

type UserStatus = {
  onboarding: boolean;
};

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<UserStatus | null>(null);

const date = 
    new Date().toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
  })


  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const res = await api("/auth/onboarding");

        if (!res.ok) {
          throw new Error("Failed to fetch onboarding status");
        }

        const data: UserStatus = await res.json();

        if (!data.onboarding) {
          router.replace("/onboarding");
          return;
        }

        setUser(data);
      } catch (err) {
        console.error(err);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkOnboarding();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Checking account...
      </div>
    );
  }

  if (!user) return null;

  return (
    <main className="min-h-screen bg-background text-on-background p-8">

      <section className=""> 
          <h1 className=" font-bold text-5xl">{date}</h1>
          <div className="flex gap-2">
          <p className=""> Data since last synced: </p>
          </div>
      </section>

    </main>
  );
}