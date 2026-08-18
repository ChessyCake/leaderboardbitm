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
      className="min-h-screen px-3 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 w-full overflow-hidden flex flex-col relative"
      style={{ background: "var(--lb-bg)" }}
    >
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[var(--lb-accent)] opacity-[0.05] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-[var(--lb-text)] opacity-[0.02] blur-[100px] rounded-full pointer-events-none" />

      <div className="flex-1 w-full max-w-4xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-12 sm:mb-16 relative">
          <h1
            className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none"
            style={{ 
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.1)",
              backgroundImage: "linear-gradient(to right, var(--lb-text), var(--lb-text-muted))",
              WebkitBackgroundClip: "text",
              textShadow: "0 0 40px rgba(255,255,255,0.05)"
            }}
          >
            CREDITS
          </h1>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
             <div className="h-[2px] w-16" style={{ background: "var(--lb-accent)" }} />
             <p
               className="font-mono text-sm sm:text-base tracking-widest font-medium uppercase"
               style={{ color: "var(--lb-accent)" }}
             >
               {"// Honoring the architects and engineers who built this platform."}
             </p>
          </div>
        </header>

        {/* Section Label */}
        <div className="mb-8 flex items-center justify-between">
          <span
            className="inline-flex items-center gap-3 border px-5 py-2.5 font-mono text-sm sm:text-base tracking-widest uppercase shadow-sm"
            style={{
              borderColor: "var(--lb-border-accent)",
              color: "var(--lb-text)",
              background: "rgba(var(--lb-surface-rgb, 20, 20, 20), 0.5)",
              backdropFilter: "blur(8px)"
            }}
          >
            <User size={16} style={{ color: "var(--lb-accent)" }} />
            {"// DEVELOPERS"}
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--lb-accent)" }} />
            <span
              className="font-mono text-xs sm:text-sm tracking-widest hidden sm:inline-block"
              style={{ color: "var(--lb-text-muted)" }}
            >
              [{DEVELOPERS.length} ENTITIES]
            </span>
          </div>
        </div>

        {/* Developers List */}
        <div className="flex flex-col gap-6">
          {DEVELOPERS.map((dev, index) => (
            <div
              key={dev.sysCode}
              className="group relative border transition-all duration-500 overflow-hidden"
              style={{
                borderColor: "var(--lb-border)",
                background: "linear-gradient(135deg, rgba(var(--lb-surface-rgb, 20, 20, 20), 0.6), rgba(var(--lb-surface-rgb, 20, 20, 20), 0.2))",
                backdropFilter: "blur(12px)",
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--lb-accent)] to-transparent opacity-0 group-hover:opacity-[0.05] -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out pointer-events-none" />
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--lb-accent)] scale-y-0 group-hover:scale-y-100 transition-transform duration-300 origin-top" />

              <div className="relative p-6 sm:p-8 flex flex-col md:flex-row gap-8 justify-between items-start md:items-center">
                <div className="flex flex-col z-10 flex-1">
                   <div className="flex items-center gap-3 mb-3">
                     <span
                       className="font-mono text-xs sm:text-sm tracking-widest px-2 py-1 border"
                       style={{ 
                         color: "var(--lb-accent)",
                         borderColor: "rgba(var(--lb-accent-rgb, 100, 255, 150), 0.2)",
                         background: "rgba(var(--lb-accent-rgb, 100, 255, 150), 0.05)"
                       }}
                     >
                       [{dev.sysCode}]
                     </span>
                     <h2 
                       className="font-display text-2xl sm:text-3xl font-bold tracking-tight group-hover:text-[var(--lb-accent)] transition-colors duration-300"
                       style={{ color: "var(--lb-text)" }}
                     >
                       {dev.name}
                     </h2>
                   </div>
                   <h3 
                     className="font-mono text-sm sm:text-base uppercase tracking-widest mb-4 font-bold flex items-center gap-2"
                     style={{ color: "var(--lb-text-muted)" }}
                   >
                     <span style={{ color: "var(--lb-accent)" }}>{'>'}</span> {dev.role}
                   </h3>
                   <p 
                     className="font-mono text-sm sm:text-base leading-relaxed max-w-2xl border-l-2 pl-4 py-1"
                     style={{ 
                       color: "var(--lb-text-secondary)",
                       borderColor: "rgba(var(--lb-border-rgb, 255, 255, 255), 0.1)"
                     }}
                   >
                     {dev.description}
                   </p>
                </div>
                
                <div className="flex gap-4 mt-2 md:mt-0 z-10 shrink-0">
                  <a
                    href={dev.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border transition-all duration-300 hover:-translate-y-1"
                    style={{ 
                      borderColor: "var(--lb-border)",
                      color: "var(--lb-text-muted)",
                      background: "rgba(var(--lb-surface-rgb, 20, 20, 20), 0.5)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-accent)";
                      e.currentTarget.style.color = "var(--lb-accent)";
                      e.currentTarget.style.boxShadow = "0 5px 15px rgba(var(--lb-accent-rgb, 100, 255, 150), 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-border)";
                      e.currentTarget.style.color = "var(--lb-text-muted)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <FaGithub size={22} />
                  </a>
                  <a
                    href={dev.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border transition-all duration-300 hover:-translate-y-1"
                    style={{ 
                      borderColor: "var(--lb-border)",
                      color: "var(--lb-text-muted)",
                      background: "rgba(var(--lb-surface-rgb, 20, 20, 20), 0.5)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-accent)";
                      e.currentTarget.style.color = "var(--lb-accent)";
                      e.currentTarget.style.boxShadow = "0 5px 15px rgba(var(--lb-accent-rgb, 100, 255, 150), 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-border)";
                      e.currentTarget.style.color = "var(--lb-text-muted)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <FaLinkedin size={22} />
                  </a>
                  <a
                    href={dev.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 border transition-all duration-300 hover:-translate-y-1"
                    style={{ 
                      borderColor: "var(--lb-border)",
                      color: "var(--lb-text-muted)",
                      background: "rgba(var(--lb-surface-rgb, 20, 20, 20), 0.5)"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-accent)";
                      e.currentTarget.style.color = "var(--lb-accent)";
                      e.currentTarget.style.boxShadow = "0 5px 15px rgba(var(--lb-accent-rgb, 100, 255, 150), 0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "var(--lb-border)";
                      e.currentTarget.style.color = "var(--lb-text-muted)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <FaInstagram size={22} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
      
      {/* Footer */}
      <div className="mt-auto relative z-10">
        <LeaderboardFooter />
      </div>
    </div>
  );
}
