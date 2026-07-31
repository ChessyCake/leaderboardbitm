"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaDiscord, FaWhatsapp } from "react-icons/fa";
import { api } from "@/lib/api";

interface User {
  name: string;
}

export default function Navbar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const getUser = async () => {
      try {
        const res = await api("/auth/me");

        if (!res.ok) {
          localStorage.removeItem("token");
          return;
        }

        const data = await res.json();
        setUser(data);
      } catch {
        localStorage.removeItem("token");
      }
    };

    getUser();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/40 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Logo */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 transition-opacity hover:opacity-90"
        >
          <div className="relative h-14 w-14">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain"
            />
          </div>

          <span className="text-lg font-bold hidden md:inline-block tracking-tight text-on-surface">
            ProjectX
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-5">
          <a
            href="https://discord.gg/jTTckmfwfR"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant transition hover:text-primary"
          >
            <FaDiscord size={20} />
          </a>

          <a
            href="https://chat.whatsapp.com/IK8RxFETYjDAKbtoNS3uXy?s=cl&p=a&ilr=1"
            target="_blank"
            rel="noopener noreferrer"
            className="text-on-surface-variant transition hover:text-primary"
          >
            <FaWhatsapp size={20} />
          </a>

          {user && (
            <>
              <div className="h-4 w-px bg-outline-variant/60" />

              <div className="flex items-center gap-3 bg-surface-container border rounded-lg border-outline-variant">
                <div className="flex h-9 w-10 items-center justify-center  font-semibold text-primary">
                  {user.name
                    .split(" ")
                    .map((x) => x[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <button
                  onClick={logout}
                  className="rounded-lg border border-outline-variant px-3 py-2 text-sm font-medium text-on-surface transition hover:border-primary hover:text-primary cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}