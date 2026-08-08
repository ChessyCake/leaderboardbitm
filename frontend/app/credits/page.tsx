"use client";

import { User, Mail } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import LeaderboardFooter from "@/components/leaderboard/LeaderboardFooter";

const DEVELOPERS = [
  {
    sysCode: "DEV.01",
    name: "Harsh Raj Minj",
    role: "Backend",
    description: "Architecting and implementing the core backend systems, APIs, and database structures.",
    github: "#",
    linkedin: "#",
    email: "#",
  },
  {
    sysCode: "DEV.02",
    name: "Prahlad Kumar",
    role: "Backend Writer",
    description: "Building robust backend services, ensuring performance, and managing system integrations.",
    github: "#",
    linkedin: "#",
    email: "#",
  },
  {
    sysCode: "DEV.03",
    name: "Rahul Gurjar",
    role: "UI/UX and Frontend",
    description: "Crafting the visual identity, user experience, and developing the frontend applications.",
    github: "#",
    linkedin: "#",
    email: "#",
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
        <header className="mb-6 sm:mb-8">
          <h1
            className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-none"
            style={{ color: "var(--lb-text)" }}
          >
            CREDITS
          </h1>

          <p
            className="mt-4 font-mono text-sm sm:text-base tracking-wider max-w-xl font-semibold"
            style={{ color: "var(--lb-accent)" }}
          >
            Honoring the architects and engineers who built this platform.
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
            // DEVELOPERS
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
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--lb-border)";
                e.currentTarget.style.background = "var(--lb-card-bg)";
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
                     className="font-mono text-sm sm:text-base uppercase tracking-widest mb-4"
                     style={{ color: "var(--lb-text-secondary)" }}
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
                    href={dev.email}
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
                    <Mail size={20} />
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
