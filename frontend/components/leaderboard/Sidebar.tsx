"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Trophy,
  Archive,
  Menu,
  X,
  LogOut,
  Edit2,
  Check,
  MessageCircleQuestion,
  Users,
} from "lucide-react";


import { SiCodeforces, SiLeetcode } from "react-icons/si";
import ThemeToggle from "@/components/ThemeToggle";
import { api } from "@/lib/api";
import { FaDiscord } from "react-icons/fa6";

const NAV_ITEMS = [
  { label: "RANKINGS", icon: Trophy, href: "/leaderboard" },
  { label: "ARCHIVE", icon: Archive, href: "/archive" },
  { label: "FAQ", icon: MessageCircleQuestion, href: "/faq" },
  { label: "CREDITS", icon: Users, href: "/credits" },
];

interface UserProfile {
  name: string;
  avatar?: string;
  codeforces_username?: string;
  leetcode_username?: string;
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [cfInput, setCfInput] = useState("");
  const [lcInput, setLcInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  // Fetch user profile on mount
  useEffect(() => {
    api("/auth/me")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setCfInput(data.codeforces_username || "");
        setLcInput(data.leetcode_username || "");
      })
      .catch(() => {});
  }, []);



  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const res = await api("/api/v1/username", {
        method: "POST",
        body: JSON.stringify({
          codeforces: cfInput.trim(),
          leetcode: lcInput.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update");
      setProfile((p) =>
        p
          ? { ...p, codeforces_username: cfInput.trim(), leetcode_username: lcInput.trim() }
          : p
      );
      setEditing(false);
    }  catch (e: unknown) {
  if (e instanceof Error) {
    setSaveError(e.message);
  } else {
    setSaveError("Error saving");
  }
} finally {
      setSaving(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-30 p-2 rounded-md md:hidden shadow-sm"
        style={{
          background: "var(--lb-surface)",
          borderColor: "var(--lb-border)",
          color: "var(--lb-text)",
          borderWidth: "1px",
        }}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 md:w-[220px] flex-col border-r transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{
          background: "var(--lb-sidebar-bg)",
          borderColor: "var(--lb-sidebar-border)",
        }}
      >
        {/* Mobile Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-2 md:hidden"
          style={{ color: "var(--lb-text-muted)" }}
          aria-label="Close menu"
        >
          <X size={20} />
        </button>

        {/* ── Operator Identity ── */}
        <div className="px-5 pt-6 pb-4 flex flex-col items-start border-b" style={{ borderColor: "var(--lb-border)" }}>
          {/* Brand Logo (replacing Avatar) */}
          <div
            className="font-display text-3xl font-black tracking-tight leading-none flex items-center mb-2"
            style={{ color: "var(--lb-text)" }}
          >
            <span>code_</span>
            <span
              className="ml-1 px-1 rounded-sm"
              style={{ background: "var(--lb-accent)", color: "var(--lb-accent-text)" }}
            >
              Stack
            </span>
          </div>

          <div className="mt-3 w-full">
            <h2
              className="font-mono text-sm font-bold tracking-wide truncate"
              style={{ color: "var(--lb-text)" }}
            >
              {profile?.name?.toUpperCase().replace(/\s+/g, "_") ?? "OPERATOR_01"}
            </h2>
            <p
              className="font-mono text-[10px] tracking-wider mt-0.5"
              style={{ color: "var(--lb-accent)" }}
            >
              [STATUS: ACTIVE]
            </p>
          </div>

          {/* Sign Out */}
          <button
            onClick={handleSignOut}
            className="mt-3 flex items-center gap-2 font-mono text-[10px] tracking-wider transition-colors hover:opacity-100 opacity-60 cursor-pointer"
            style={{ color: "var(--lb-text-muted)" }}
          >
            <LogOut size={11} />
            SIGN_OUT
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 mt-3">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
              const isActive = pathname === href;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 rounded-sm px-3 py-2.5 font-mono text-xs tracking-wider transition-colors"
                    style={{
                      background: isActive ? "var(--lb-nav-active-bg)" : "transparent",
                      color: isActive ? "var(--lb-text)" : "var(--lb-text-muted)",
                      borderLeft: isActive ? "2px solid var(--lb-accent)" : "2px solid transparent",
                    }}
                    title={label}
                  >
                    <Icon size={16} className="shrink-0" />
                    <span className="truncate">{label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* ── Platform Usernames ── */}
        <div
          className="px-4 py-3 mx-3 mb-2 rounded-sm border"
          style={{ borderColor: "var(--lb-border)", background: "var(--lb-surface)" }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[9px] tracking-widest uppercase" style={{ color: "var(--lb-text-muted)" }}>
              PLATFORMS
            </span>
            {!editing ? (
              <button
                onClick={() => { setEditing(true); setSaveError(""); }}
                className="flex items-center gap-1 font-mono text-[9px] tracking-wider transition-opacity hover:opacity-100 opacity-60"
                style={{ color: "var(--lb-accent)" }}
              >
                <Edit2 size={9} /> EDIT
              </button>
            ) : (
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 font-mono text-[9px] tracking-wider"
                style={{ color: "var(--lb-accent)" }}
              >
                <Check size={9} /> {saving ? "..." : "SAVE"}
              </button>
            )}
          </div>

          {/* CF */}
          <div className="flex items-center gap-2 mb-1.5">
            <SiCodeforces size={11} style={{ color: "var(--lb-text-muted)", flexShrink: 0 }} />
            {editing ? (
              <input
                value={cfInput}
                onChange={(e) => setCfInput(e.target.value)}
                placeholder="CF handle..."
                className="flex-1 bg-transparent font-mono text-[10px] outline-none border-b"
                style={{ color: "var(--lb-text)", borderColor: "var(--lb-border-accent)" }}
              />
            ) : (
              <span
                className="font-mono text-[10px] truncate"
                style={{ color: profile?.codeforces_username ? "var(--lb-text)" : "var(--lb-text-muted)" }}
              >
                {profile?.codeforces_username || "—"}
              </span>
            )}
          </div>

          {/* LC */}
          <div className="flex items-center gap-2">
            <SiLeetcode size={11} style={{ color: "var(--lb-text-muted)", flexShrink: 0 }} />
            {editing ? (
              <input
                value={lcInput}
                onChange={(e) => setLcInput(e.target.value)}
                placeholder="LC handle..."
                className="flex-1 bg-transparent font-mono text-[10px] outline-none border-b"
                style={{ color: "var(--lb-text)", borderColor: "var(--lb-border-accent)" }}
              />
            ) : (
              <span
                className="font-mono text-[10px] truncate"
                style={{ color: profile?.leetcode_username ? "var(--lb-text)" : "var(--lb-text-muted)" }}
              >
                {profile?.leetcode_username || "—"}
              </span>
            )}
          </div>

          {saveError && (
            <p className="font-mono text-[9px] mt-1.5" style={{ color: "#ff4444" }}>{saveError}</p>
          )}
        </div>

        {/* ── Join Links ── */}
        <div className="px-3 mb-2 flex flex-col gap-1">
          <a
            href="https://discord.gg/jTTckmfwfR"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-sm px-3 py-2 font-mono text-xs tracking-wider transition-colors text-[var(--lb-text-muted)] hover:text-[#5865F2] hover:bg-[var(--lb-nav-active-bg)]"
            title="Join Discord"
          >
            <FaDiscord size={16} className="shrink-0" />
            <span className="truncate">DISCORD</span>
          </a>
        </div>

        {/* ── Theme Toggle ── */}
        <div className="px-4 mb-4 flex justify-start">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
