"use client";

import { User } from "lucide-react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";
import LeaderboardFooter from "@/components/leaderboard/LeaderboardFooter";

const DEVELOPERS = [
  {
    sysCode: "DEV.01",
    name: "Harsh Raj Minj",
    role: "Tech Lead • Architecture • UI/UX & Backend",
    description: "Masterminding the complete system architecture, spearheading major UI designs, and engineering the core backend infrastructure.",
    github: "https://github.com/chessyCake",
    linkedin: "https://www.linkedin.com/in/harsh-raj-minj-630351380",
    instagram: "https://www.instagram.com/harshraj.hrm?igsh=MXJ1bGViNmY2ZTVhNA%3D%3D",
  },
  {
    sysCode: "DEV.02",
    name: "Prahlad Kumar",
    role: "Backend",
    description: "Building robust backend services, ensuring performance, and managing system integrations.",
    github: "https://github.com/kumarprahlad0037-Pixel",
    linkedin: "https://www.linkedin.com/in/prahlad-kumar-235b3837a/",
    instagram: "https://www.instagram.com/_kumarprahlad_/",
  },
  {
    sysCode: "DEV.03",
    name: "Rahul Gurjar",
    role: "UI/UX and Frontend",
    description: "Crafting the visual identity, user experience, and developing the frontend applications.",
    github: "https://github.com/Rahul3307",
    linkedin: "https://www.linkedin.com/in/rahul-gurjar-40943b377/",
    instagram: "https://www.instagram.com/rahul_gurjar.3/",
  }
];

export default function CreditsPage() {
  return (
    <div 
      className="min-h-screen px-3 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 w-full overflow-hidden flex flex-col"
      style={{ background: "var(--lb-bg)" }}
    >
      <div className="flex-1 w-full max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="mb-10 sm:mb-14 relative text-center sm:text-left">
          <div className="absolute top-1/2 left-0 sm:left-1/4 -translate-y-1/2 w-32 h-32 bg-[var(--lb-accent)] opacity-20 blur-[80px] rounded-full pointer-events-none" />
          <h1
            className="font-display text-5xl sm:text-6xl md:text-7xl font-black tracking-tighter leading-none relative z-10"
            style={{ 
              color: "transparent",
              WebkitTextStroke: "2px var(--lb-text)",
              backgroundImage: "linear-gradient(to right, var(--lb-text), var(--lb-accent))",
              WebkitBackgroundClip: "text"
            }}
          >
            CREDITS
          </h1>

          <p
            className="mt-4 font-mono text-sm sm:text-base tracking-widest max-w-xl font-medium relative z-10 uppercase mx-auto sm:mx-0"
            style={{ color: "var(--lb-accent)" }}
          >
            {"// Honoring the architects and engineers who built this platform."}
          </p>
        </header>

        {/* Section Label */}
        <div className="mb-6 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-2 border px-4 py-2 font-mono text-sm sm:text-base tracking-widest uppercase"
            style={{
              borderColor: "var(--lb-border-accent)",
              color: "var(--lb-text-secondary)",
              background: "var(--lb-surface)",
            }}
          >
            <User size={14} style={{ color: "var(--lb-accent)" }} />
            {"// DEVELOPERS"}
          </span>
          <span
            className="font-mono text-xs sm:text-sm tracking-wider hidden sm:inline-block"
            style={{ color: "var(--lb-text-muted)" }}
          >
            [{DEVELOPERS.length} ENTITIES]
          </span>
        </div>

        {/* Developers List */}
        <div className="flex flex-col gap-6">
          {DEVELOPERS.map((dev) => (
            <div
              key={dev.sysCode}
              className="border p-4 sm:p-6 transition-all duration-300 group"
              style={{
                borderColor: "var(--lb-border)",
                background: "var(--lb-card-bg)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "var(--lb-accent)";
                e.currentTarget.style.background = "var(--lb-card-highlight-bg)";
                e.currentTarget.style.boxShadow = "0 0 20px rgba(var(--lb-accent-rgb, 100, 255, 150), 0.15)";
                e.currentTarget.style.transform = "translateY(-4px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--lb-border)";
                e.currentTarget.style.background = "var(--lb-card-bg)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                <div className="flex flex-col">
                   <div className="flex items-center gap-3 mb-2">
                     <span
                       className="font-mono text-xs sm:text-sm tracking-widest"
                       style={{ color: "var(--lb-accent)" }}
                     >
                       [{dev.sysCode}]
                     </span>
                     <h2 
                       className="font-display text-xl sm:text-2xl font-bold tracking-tight"
                       style={{ color: "var(--lb-text)" }}
                     >
                       {dev.name}
                     </h2>
                   </div>
                   <h3 
                     className="font-mono text-sm sm:text-base uppercase tracking-widest mb-4 font-bold"
                     style={{ color: "var(--lb-accent)" }}
                   >
                     {'>'} {dev.role}
                   </h3>
                   <p 
                     className="font-mono text-sm sm:text-base leading-relaxed max-w-2xl"
                     style={{ color: "var(--lb-text-muted)" }}
                   >
                     {dev.description}
                   </p>
                </div>
                
                <div className="flex gap-4 mt-4 md:mt-0">
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border transition-colors"
                    style={{ 
                      borderColor: "var(--lb-border)",
                      color: "var(--lb-text-muted)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-accent)";
                      e.currentTarget.style.color = "var(--lb-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-border)";
                      e.currentTarget.style.color = "var(--lb-text-muted)";
                    }}
                  >
                    <FaGithub size={20} />
                  </a>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border transition-colors"
                    style={{ 
                      borderColor: "var(--lb-border)",
                      color: "var(--lb-text-muted)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-accent)";
                      e.currentTarget.style.color = "var(--lb-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-border)";
                      e.currentTarget.style.color = "var(--lb-text-muted)";
                    }}
                  >
                    <FaLinkedin size={20} />
                  </a>
                  <a
                    href={dev.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 border transition-colors"
                    style={{ 
                      borderColor: "var(--lb-border)",
                      color: "var(--lb-text-muted)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-accent)";
                      e.currentTarget.style.color = "var(--lb-accent)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-border)";
                      e.currentTarget.style.color = "var(--lb-text-muted)";
                    }}
                  >
                    <FaInstagram size={20} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      
      {/* Footer */}
      <div className="mt-12">
        <LeaderboardFooter />
      </div>
    </div>
  );
}
