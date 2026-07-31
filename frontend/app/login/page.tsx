"use client";

import { FcGoogle } from "react-icons/fc";
import { FaRankingStar } from "react-icons/fa6";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/api";

import { useSearchParams } from "next/navigation";
import { IoIosWarning } from "react-icons/io";
export default function LoginPage() {

  const router = useRouter()

  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  useEffect(() => {
  if (!error) return;

  const timer = setTimeout(() => {
    router.replace("/login");
  }, 6000);

  return () => clearTimeout(timer);
}, [error, router]);

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");

      if (!token) return;

      try {
        const res = await api("/auth/me");

        if (!res.ok) {
          localStorage.removeItem("token");
          return;
        }

        const user = await res.json();

        if (user.onboarded) {
          router.replace("/dashboard");
        } else {
          router.replace("/onboarding");
        }
      } catch {
        localStorage.removeItem("token");
      }
    };

    check();
  }, [router]);

  const login = () => {
    window.location.href = "http://localhost:4000/auth/google";
  };

  return (
    <main className="relative flex min-h-screen items-start justify-center overflow-hidden bg-background px-5 pt-20 pb-10 sm:items-center sm:px-6 sm:pt-0 flex-col">



      <div className="absolute inset-0 overflow-hidden">
   
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />

     
        <div className="absolute left-1/2 top-1/2 h-[750px] w-[750px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/10 blur-[180px]" />

     
        <div className="hidden md:block absolute -left-40 top-20 h-[450px] w-[450px] rounded-full bg-primary/8 blur-[160px]" />

        <div className="hidden md:block absolute right-0 bottom-0 h-[500px] w-[500px] rounded-full bg-orange-500/5 blur-[180px]" />

      
        
      </div>

      <div className="relative z-10 flex w-full flex-col max-w-md gap-4 mt-4 mb-4">

    {error === "bit-email" && (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 backdrop-blur-xl">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 text-red-400 text-lg">
             <IoIosWarning size={28} />
          </div>

          <div>
            <h3 className="font-semibold text-red-300">
              Access Denied
            </h3>

            <p className="mt-1 text-sm leading-6 text-red-200/80">
              Only{" "}
              <span className="font-semibold">
                @bitmesra.ac.in
              </span>{" "}
              Google accounts are allowed.
            </p>
          </div>
        </div>
      </div>
    )}
    </div>

      <div className="relative z-10 w-full max-w-md rounded-2xl sm:rounded-3xl border border-outline-variant/70 bg-surface-container/80 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,.55)] p-6 sm:p-10">

        <div className="mx-auto mb-6 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
          <span className="text-2xl sm:text-3xl font-bold text-primary">
            <FaRankingStar />
          </span>
        </div>

  
        <h1 className="text-center text-3xl sm:text-4xl font-bold leading-tight text-on-surface">
          Welcome to{" "}
          <span className="text-primary">
            ProjectX
          </span>
        </h1>


        <p className="mt-3 text-center text-sm leading-6 sm:leading-7 text-on-surface-variant">
          Continue using your{" "}
          <span className="font-semibold text-primary">
            @bitmesra.ac.in
          </span>{" "}
          Google account.
        </p>

        <button
          onClick={login}
          className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm sm:text-base font-medium cursor-pointer text-black transition-all duration-300 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0"
        >
          <FcGoogle size={22} />
          Continue with Google
        </button>

    
        <div className="my-7 h-px bg-outline-variant/40" />

        <p className="text-center text-xs leading-5 text-on-surface-variant">
          Access is restricted to{" "}
          <span className="font-medium text-primary">
            verified @bitmesra.ac.in
          </span>{" "}
          accounts.
        </p>
      </div>
    </main>
  );
}