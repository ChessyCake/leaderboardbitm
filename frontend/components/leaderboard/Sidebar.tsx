"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Download,
} from "lucide-react";


import { SiCodeforces, SiLeetcode } from "react-icons/si";
import { api } from "@/lib/api";
import { FaDiscord } from "react-icons/fa6";

const NAV_ITEMS = [
  { label: "RANKINGS", icon: Trophy, href: "/leaderboard" },
  { label: "CF CONTEST", icon: SiCodeforces, href: "/cfcontest" },
  { label: "ARCHIVE", icon: Archive, href: "/archive" },
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
  const [showTrackerModal, setShowTrackerModal] = useState(false);

  const [profile, setProfile] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      const cached = sessionStorage.getItem("lb_profile");
      if (cached) {
        try {
          return JSON.parse(cached);
        } catch (e) {
          return null;
        }
      }
    }
    return null;
  });
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
        sessionStorage.setItem("lb_profile", JSON.stringify(data));
        setCfInput(data.codeforces_username || "");
        setLcInput(data.leetcode_username || "");
      })
      .catch(() => { });
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
      setProfile((p) => {
        const newProfile = p
          ? { ...p, codeforces_username: cfInput.trim(), leetcode_username: lcInput.trim() }
          : p;
        if (newProfile) sessionStorage.setItem("lb_profile", JSON.stringify(newProfile));
        return newProfile;
      });
      setEditing(false);
    } catch (e: unknown) {
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
    sessionStorage.removeItem("lb_profile");
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
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 md:w-[220px] flex-col border-r transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
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
          {/* Brand Logo */}
          <div className="flex items-center gap-3 mb-4">
            <Image 
              src="/codestack_logo.png" 
              alt="Codango Logo Icon" 
              width={36}
              height={36}
              className="object-contain shrink-0"
              priority
            />
            <div className="h-8 w-[2px] opacity-50" style={{ background: "var(--lb-accent)" }} />
            <span
              className="font-display text-2xl font-black tracking-tight leading-none pt-1"
              style={{ color: "var(--lb-text)" }}
            >
              Cod<span style={{ color: "var(--lb-accent)" }}>ango</span>
            </span>
          </div>

          <div className="mt-1 w-full">
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
            className="mt-4 flex items-center gap-2 px-3 py-1.5 rounded-sm font-mono text-[10px] tracking-wider transition-all duration-300 w-full justify-start"
            style={{ 
              color: "var(--lb-text-muted)",
              background: "rgba(255, 68, 68, 0.05)",
              border: "1px solid rgba(255, 68, 68, 0.15)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "#ff4444";
              e.currentTarget.style.background = "rgba(255, 68, 68, 0.15)";
              e.currentTarget.style.borderColor = "rgba(255, 68, 68, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "var(--lb-text-muted)";
              e.currentTarget.style.background = "rgba(255, 68, 68, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 68, 68, 0.15)";
            }}
          >
            <LogOut size={12} />
            SIGN_OUT
          </button>
        </div>

        {/* ── Navigation ── */}
        <nav className="flex-1 px-3 mt-2">
          <ul className="space-y-1">
            {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
              const isActive = pathname === href;
              return (
                <li key={label}>
                  <Link
                    href={href}
                    className="flex items-center justify-start gap-3 rounded-sm px-3 py-2.5 font-mono text-xs tracking-wider transition-colors"
                    style={{
                      background: isActive
                        ? "var(--lb-nav-active-bg)"
                        : "transparent",
                      color: isActive
                        ? "var(--lb-text)"
                        : "var(--lb-text-muted)",
                      borderLeft: isActive
                        ? "2px solid var(--lb-accent)"
                        : "2px solid transparent",
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

        {/* ── Join Links & Tracker ── */}
        <div className="px-3 mb-2 flex flex-col gap-1">
          <button
            onClick={() => setShowTrackerModal(true)}
            className="flex items-center justify-start gap-3 rounded-sm px-3 py-2 font-mono text-xs tracking-wider cursor-pointer transition-all text-[var(--lb-accent)] border border-[var(--lb-accent)]/30 hover:bg-[var(--lb-accent)] hover:text-[var(--lb-accent-text)] hover:border-[var(--lb-accent)]"
            title="Download Tracker"
          >
            <Download size={16} className="shrink-0" />
            <span className="truncate">GET TRACKER</span>
          </button>
          <a
            href="https://discord.gg/jTTckmfwfR"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-start gap-3 rounded-sm px-3 py-2 font-mono text-xs tracking-wider transition-colors text-[var(--lb-text-muted)] hover:text-[#5865F2] hover:bg-[var(--lb-nav-active-bg)]"
            title="Join Discord"
          >
            <FaDiscord size={16} className="shrink-0" />
            <span className="truncate">DISCORD</span>
          </a>
        </div>

        {/* ── Platforms ── */}
        <div className="px-4 py-3 mt-auto border-t" style={{ borderColor: "var(--lb-border)" }}>
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

        {/* ── Theme Toggle Removed ── */}
        <div className="px-4 mb-4 flex justify-start">
        </div>
      </aside>

      {/* Tracker Modal */}
      {showTrackerModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowTrackerModal(false)} />
          <div 
            className="relative w-full max-w-md border p-6 flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200"
            style={{ 
              background: "var(--lb-surface)", 
              borderColor: "var(--lb-border-accent)",
              boxShadow: "0 0 40px rgba(var(--lb-accent-rgb, 100, 255, 150), 0.15)"
            }}
          >
            <button 
              onClick={() => setShowTrackerModal(false)}
              className="absolute top-4 right-4 text-[var(--lb-text-muted)] hover:text-[var(--lb-text)] transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="font-display text-2xl font-bold" style={{ color: "var(--lb-text)" }}>CONTEST TRACKER</h3>
            <div className="px-3 py-1 border font-mono text-xs w-fit uppercase tracking-widest" style={{ borderColor: "var(--lb-accent)", background: "rgba(var(--lb-accent-rgb, 100, 255, 150), 0.1)", color: "var(--lb-accent)" }}>
              Available on Android Only
            </div>
            <p className="font-mono text-sm leading-relaxed mt-2" style={{ color: "var(--lb-text-muted)" }}>
              The Contest Tracker helps you track upcoming competitive programming contests across platforms right from your phone. Set reminders, view leaderboards, and never miss a rated match.
            </p>
            <a
              href="https://expo.dev/accounts/ha-rsh/projects/frontend/builds/47e4246e-8a83-43c6-a777-aa5aa0c5c7a2"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setShowTrackerModal(false)}
              className="mt-4 px-4 py-2 font-mono text-sm font-bold tracking-widest text-center hover:opacity-90 transition-opacity block"
              style={{ background: "var(--lb-accent)", color: "var(--lb-accent-text)" }}
            >
              DOWNLOAD NOW
            </a>
          </div>
        </div>
      )}
    </>
  );
}
