"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { api } from "@/lib/api";

import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

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
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative bg-dots p-6">
      <div className="relative w-full max-w-[500px] h-[500px]">
        
     
        <div className="absolute inset-0 translate-x-3 translate-y-3 bg-foreground hidden md:block z-0" />


        <div className="absolute inset-0 bg-background border-2 border-foreground z-10 flex flex-col">
          
      
          <div className="h-12 bg-foreground text-background flex items-center px-4 font-mono font-bold text-sm tracking-wider shrink-0">
            AUTH_GATEWAY
          </div>

  
          <div className="flex-1 p-8 flex flex-col">
            <div className="max-w-[360px] space-y-6">
              
    
              <p 
                className={`w-fit px-3 py-1 text-xs font-mono font-bold text-black uppercase tracking-widest ${
                  error ? "bg-red-500" : "bg-[#ccff00]"
                }`}
              >
                {error ? "AUTHENTICATION_FAILED" : "AWAITING CREDENTIALS"}
              </p>

              <div className="space-y-4">
                <h1 className="text-6xl font-black leading-[0.9] text-foreground tracking-tighter uppercase">
                  SYSTEM_<br />
                  ACCESS
                </h1>

                <p className="text-sm text-foreground/70 font-medium">
                  Get access using your @bitmesra.ac.in account.
                </p>

            
                {error === "bit-email" && (
                  <div className="border-l-4 border-red-500 bg-red-500/10 p-3 mt-4">
                    <p className="text-red-500 font-mono text-xs font-bold uppercase">
                      &gt; ACCESS DENIED: Only @bitmesra.ac.in emails are permitted in this sector.
                    </p>
                  </div>
                )}
                {error && error !== "bit-email" && (
                  <div className="border-l-4 border-red-500 bg-red-500/10 p-3 mt-4">
                    <p className="text-red-500 font-mono text-xs font-bold uppercase">
                      &gt; ERR: An unknown authentication error occurred.
                    </p>
                  </div>
                )}
              </div>

           
              <div className="relative h-14 w-full sm:w-fit mt-8">
                <div className="absolute inset-0 translate-x-2 translate-y-2 bg-foreground hidden sm:block" />

                <button
                  onClick={login}
                  className="relative z-10 w-full h-14 px-6 flex items-center justify-center gap-3 bg-[#ccff00] border-2 border-foreground font-mono font-bold text-black text-sm tracking-wider cursor-pointer hover:bg-[#b3e600] active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  <FcGoogle className="w-5 h-5 bg-white rounded-full" />
                  INITIATE SESSION
                </button>
              </div>
            </div>

            <div className="mt-auto text-[10px] font-mono text-foreground/50 uppercase tracking-widest">
              BUILD V1.0.2 • SECURE_GATEWAY
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}