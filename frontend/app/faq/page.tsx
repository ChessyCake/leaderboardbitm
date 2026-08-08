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
      className="min-h-screen px-3 sm:px-6 md:px-10 py-6 sm:py-8 md:py-12 w-full overflow-hidden flex flex-col"
      style={{ background: "var(--lb-bg)" }}
    >
      <div className="flex-1 w-full max-w-5xl mx-auto">
        {/* Header Section */}
        <header className="mb-8 sm:mb-12">
          <h1
            className="font-display text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-none"
            style={{ color: "var(--lb-text)" }}
          >
            SYSTEM_HELP
          </h1>

          <div className="mt-2 inline-block">
            <div
              className="px-3 sm:px-4 py-1.5 sm:py-2 -skew-x-3"
              style={{ background: "var(--lb-accent)" }}
            >
              <span
                className="block skew-x-3 font-display text-2xl sm:text-4xl md:text-5xl font-black tracking-tight"
                style={{ color: "var(--lb-accent-text)" }}
              >
                // F.A.Q
              </span>
            </div>
          </div>

          <p
            className="mt-4 font-mono text-sm sm:text-base tracking-wider max-w-xl"
            style={{ color: "var(--lb-text-muted)" }}
          >
            Frequently asked questions about the Comp_League platform, leaderboard mechanics, and data privacy. Click on a question to reveal its answer.
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
            <MessageCircleQuestion size={14} style={{ color: "var(--lb-accent)" }} />
            // KNOWLEDGE_BASE
          </span>
          <span
            className="font-mono text-xs sm:text-sm tracking-wider hidden sm:inline-block"
            style={{ color: "var(--lb-text-muted)" }}
          >
            [{FAQ_DATA.length} QUERIES]
          </span>
        </div>

        {/* Accordion Container */}
        <div
          className="border overflow-hidden w-full flex flex-col"
          style={{ borderColor: "var(--lb-border)" }}
        >
          {FAQ_DATA.map((item, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={item.sysCode}
                className="group border-b last:border-b-0 transition-colors duration-200"
                style={{
                  background: isOpen ? "var(--lb-card-highlight-bg)" : "var(--lb-card-bg)",
                  borderColor: "var(--lb-border)",
                }}
              >
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between p-4 sm:p-6 text-left cursor-pointer transition-colors"
                  style={{ 
                    borderLeft: isOpen ? "3px solid var(--lb-accent)" : "3px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isOpen) {
                      e.currentTarget.style.background = "var(--lb-entry-hover)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isOpen) {
                      e.currentTarget.style.background = "transparent";
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className="font-mono text-xs sm:text-sm tracking-widest hidden sm:inline-block"
                      style={{ color: isOpen ? "var(--lb-accent)" : "var(--lb-text-dim)" }}
                    >
                      [{item.sysCode}]
                    </span>
                    <h3
                      className="font-mono text-sm sm:text-base md:text-lg font-bold tracking-wider"
                      style={{ color: isOpen ? "var(--lb-accent)" : "var(--lb-text)" }}
                    >
                      {item.question}
                    </h3>
                  </div>
                  
                  <div 
                    className="flex-shrink-0 ml-4 transition-transform duration-300"
                    style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  >
                    {isOpen ? (
                      <Minus size={18} style={{ color: "var(--lb-accent)" }} />
                    ) : (
                      <Plus size={18} style={{ color: "var(--lb-text-muted)" }} />
                    )}
                  </div>
                </button>
                
                {/* Answer / Expandable Area */}
                <div 
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <div 
                    className="p-4 sm:p-6 pt-0 border-t"
                    style={{ 
                      borderColor: "rgba(255,255,255,0.05)",
                      borderLeft: "3px solid var(--lb-accent)"
                    }}
                  >
                    <p 
                      className="font-mono text-sm sm:text-base tracking-wide leading-relaxed pl-0 sm:pl-12"
                      style={{ color: "var(--lb-text-secondary)" }}
                    >
                      <span 
                        className="inline-block mr-2 font-bold" 
                        style={{ color: "var(--lb-text-muted)" }}
                      >
                        {'>'} RESPONSE:
                      </span>
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Support CTA */}
        <div
          className="mt-10 border overflow-hidden w-full"
          style={{ borderColor: "var(--lb-border)" }}
        >
          <div
            className="flex items-center gap-2 px-4 py-2.5 border-b"
            style={{
              background: "var(--lb-surface)",
              borderColor: "var(--lb-border)",
            }}
          >
            <span
              className="font-mono text-xs sm:text-sm tracking-widest uppercase flex items-center gap-2"
              style={{ color: "var(--lb-text-muted)" }}
            >
              <span className="w-2 h-2 rounded-full inline-block animate-pulse" style={{ background: "var(--lb-accent)" }} />
              STILL_HAVE_QUESTIONS?
            </span>
          </div>

          <div
            className="px-6 py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
            style={{ background: "var(--lb-card-bg)" }}
          >
            <div className="max-w-lg">
              <h3
                className="font-display text-xl md:text-2xl font-bold tracking-tight mb-2"
                style={{ color: "var(--lb-text)" }}
              >
                ASK THE COMMUNITY
              </h3>
              <p
                className="font-mono text-sm sm:text-base tracking-wider leading-relaxed"
                style={{ color: "var(--lb-text-muted)" }}
              >
                If your question wasn&apos;t answered here, join our Discord server. Our moderators and community members are active and ready to help you with any issues or queries.
              </p>
            </div>

            <a
              href={DISCORD_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 border px-5 py-3 font-mono text-sm sm:text-base font-bold tracking-wider transition-all flex-shrink-0 cursor-pointer"
              style={{
                borderColor: "var(--lb-accent)",
                color: "var(--lb-accent)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--lb-accent)";
                e.currentTarget.style.color = "var(--lb-accent-text)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--lb-accent)";
              }}
            >
              CONNECT_NOW
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

      </div>
      
      {/* Footer */}
      <div className="mt-12">
        <LeaderboardFooter />
      </div>
    </div>
  );
}
