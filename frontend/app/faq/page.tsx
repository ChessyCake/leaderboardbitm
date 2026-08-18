"use client";

import { useState } from "react";
import { Plus, Minus, ExternalLink, MessageCircleQuestion } from "lucide-react";
import LeaderboardFooter from "@/components/leaderboard/LeaderboardFooter";

const FAQ_DATA = [
  {
    sysCode: "FAQ.01",
    question: "Why should I use this website?",
    answer: "This platform helps you track your competitive programming progress, compare daily problem-solving stats with peers, and stay motivated through a competitive and supportive community environment."
  },
  {
    sysCode: "FAQ.02",
    question: "What is the criteria to be ranked on the leaderboard?",
    answer: "The leaderboard ranks users based on daily activity, primarily calculating total problems solved on Codeforces and LeetCode, along with active streaks and current platform ratings."
  },
  {
    sysCode: "FAQ.03",
    question: "Is the data secured from the developers's side?",
    answer: "Yes, we prioritize your data privacy. We only fetch public statistics from integrated platforms (Codeforces, LeetCode) and secure any personal identifiers with industry-standard encryption practices."
  },
  {
    sysCode: "FAQ.04",
    question: "How to join the discord community?",
    answer: "You can easily join our Discord community by clicking the Discord icon in the navigation bar at the bottom or by using the JOIN_DISCORD buttons located throughout the site."
  },
  {
    sysCode: "FAQ.05",
    question: "What is the benefit of joining the discord community?",
    answer: "Our Discord server is the core of our community. Members get access to exclusive historical data, real-time help for coding problems, announcements, and a network of like-minded developers."
  }
];

const DISCORD_LINK = "https://discord.gg/jTTckmfwfR";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div 
      className="min-h-screen px-3 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 w-full overflow-hidden flex flex-col relative"
      style={{ background: "var(--lb-bg)" }}
    >
      {/* Background glow effect */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--lb-accent)] opacity-[0.03] blur-[100px] rounded-full pointer-events-none" />

      <div className="flex-1 w-full max-w-5xl mx-auto relative z-10">
        {/* Header Section */}
        <header className="mb-12 sm:mb-16">
          <h1
            className="font-display text-5xl sm:text-7xl md:text-8xl font-black tracking-tighter leading-none"
            style={{ 
              color: "transparent",
              WebkitTextStroke: "1px rgba(255,255,255,0.1)",
              backgroundImage: "linear-gradient(to bottom right, var(--lb-text), var(--lb-text-muted))",
              WebkitBackgroundClip: "text",
            }}
          >
            SYSTEM_HELP
          </h1>

          <div className="mt-6 inline-block animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
            <div
              className="px-6 py-2 border-l-4"
              style={{ 
                borderColor: "var(--lb-accent)",
                background: "linear-gradient(90deg, rgba(var(--lb-accent-rgb, 100, 255, 150), 0.1), transparent)"
              }}
            >
              <span
                className="block font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-widest"
                style={{ 
                  color: "var(--lb-accent)",
                  textShadow: "0 0 20px rgba(var(--lb-accent-rgb, 100, 255, 150), 0.3)"
                }}
              >
                {"// F.A.Q"}
              </span>
            </div>
          </div>

          <p
            className="mt-6 font-mono text-sm sm:text-base tracking-wider max-w-2xl leading-relaxed"
            style={{ color: "var(--lb-text-muted)" }}
          >
            Frequently asked questions about the CodeStack platform, leaderboard mechanics, and data privacy. Click on a question to reveal its decrypted response.
          </p>
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
            <MessageCircleQuestion size={16} style={{ color: "var(--lb-accent)" }} />
            {"// KNOWLEDGE_BASE"}
          </span>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "var(--lb-accent)" }} />
            <span
              className="font-mono text-xs sm:text-sm tracking-widest hidden sm:inline-block"
              style={{ color: "var(--lb-text-muted)" }}
            >
              [{FAQ_DATA.length} QUERIES]
            </span>
          </div>
        </div>

        {/* Accordion Container */}
        <div className="flex flex-col gap-4 w-full">
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.sysCode}
                className="group border transition-all duration-300 ease-out"
                style={{
                  background: isOpen ? "rgba(var(--lb-surface-rgb, 20, 20, 20), 0.8)" : "rgba(var(--lb-surface-rgb, 20, 20, 20), 0.3)",
                  borderColor: isOpen ? "var(--lb-accent)" : "var(--lb-border)",
                  boxShadow: isOpen ? "0 0 30px rgba(var(--lb-accent-rgb, 100, 255, 150), 0.1)" : "none",
                  transform: isOpen ? "scale([1.01])" : "scale(1)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-5 sm:p-7 text-left cursor-pointer transition-colors outline-none"
                  onMouseEnter={(e) => {
                    if (!isOpen) {
                      e.currentTarget.style.background = "rgba(var(--lb-surface-rgb, 20, 20, 20), 0.6)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isOpen) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <div className="flex items-start sm:items-center gap-5">
                    <span
                      className="font-mono text-xs sm:text-sm tracking-widest mt-1 sm:mt-0"
                      style={{ color: isOpen ? "var(--lb-accent)" : "var(--lb-text-muted)" }}
                    >
                      [{item.sysCode}]
                    </span>
                    <h3
                      className="font-mono text-base sm:text-lg md:text-xl font-bold tracking-wider"
                      style={{ color: isOpen ? "var(--lb-text)" : "var(--lb-text-secondary)" }}
                    >
                      {item.question}
                    </h3>
                  </div>
                  
                  <div 
                    className="flex-shrink-0 ml-4 transition-transform duration-500 ease-[cubic-bezier(0.87,_0,_0.13,_1)]"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    {isOpen ? (
                      <Minus size={20} style={{ color: "var(--lb-accent)", filter: "drop-shadow(0 0 8px var(--lb-accent))" }} />
                    ) : (
                      <Plus size={20} style={{ color: "var(--lb-text-muted)" }} />
                    )}
                  </div>
                </button>
                
                {/* Answer / Expandable Area */}
                <div 
                  className={`overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.87,_0,_0.13,_1)] ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div 
                    className="p-5 sm:p-7 pt-0"
                  >
                    <div 
                      className="p-4 sm:p-6 border-l-2 bg-black/20"
                      style={{ borderColor: "var(--lb-accent)" }}
                    >
                      <p 
                        className="font-mono text-sm sm:text-base tracking-wide leading-relaxed"
                        style={{ color: "var(--lb-text-muted)" }}
                      >
                        <span 
                          className="inline-block mr-3 font-bold uppercase tracking-widest" 
                          style={{ color: "var(--lb-text)" }}
                        >
                          {'>'} DECRYPTED_RESPONSE:
                        </span>
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support CTA */}
        <div
          className="mt-16 border relative overflow-hidden group transition-all duration-500 hover:border-[var(--lb-accent)]"
          style={{ 
            borderColor: "var(--lb-border)",
            background: "linear-gradient(180deg, rgba(var(--lb-surface-rgb, 20, 20, 20), 0.8), transparent)",
          }}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--lb-accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div
            className="flex items-center gap-2 px-5 py-3 border-b"
            style={{
              background: "rgba(0,0,0,0.2)",
              borderColor: "var(--lb-border)",
            }}
          >
            <span
              className="font-mono text-xs sm:text-sm tracking-widest uppercase flex items-center gap-3"
              style={{ color: "var(--lb-text-muted)" }}
            >
              <span className="w-2 h-2 rounded-none inline-block animate-pulse" style={{ background: "var(--lb-accent)" }} />
              SYSTEM_SUPPORT_REQUIRED?
            </span>
          </div>

          <div
            className="px-6 py-10 sm:px-10 sm:py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
          >
            <div className="max-w-xl relative z-10">
              <h3
                className="font-display text-2xl md:text-3xl font-bold tracking-tight mb-4"
                style={{ color: "var(--lb-text)" }}
              >
                INITIATE COMMUNITY LINK
              </h3>
              <p
                className="font-mono text-sm sm:text-base tracking-wider leading-relaxed"
                style={{ color: "var(--lb-text-muted)" }}
              >
                If your query remains unresolved, establish a connection with our Discord mainframe. Active moderators and operators are on standby to assist you.
              </p>
            </div>

            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-3 border px-8 py-4 font-mono text-sm sm:text-base font-bold tracking-widest transition-all flex-shrink-0 cursor-pointer overflow-hidden group/btn"
              style={{
                borderColor: "var(--lb-accent)",
                color: "var(--lb-accent)",
                background: "transparent",
              }}
            >
              <div className="absolute inset-0 bg-[var(--lb-accent)] -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 group-hover/btn:text-[var(--lb-accent-text)] transition-colors duration-300">ESTABLISH_CONNECTION</span>
              <ExternalLink size={16} className="relative z-10 group-hover/btn:text-[var(--lb-accent-text)] transition-colors duration-300" />
            </a>
          </div>
        </div>

      </div>
      
      {/* Footer */}
      <div className="mt-auto relative z-10">
        <LeaderboardFooter />
      </div>
    </div>
  );
}
