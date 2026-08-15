import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CodeStack // Rankings",
  description:
    "Competitive programming leaderboard — track streaks, ratings, and daily progress for Codeforces and LeetCode.",
  keywords: [
    "competitive programming",
    "leaderboard",
    "Codeforces",
    "LeetCode",
    "coding streak",
    "algorithm rankings",
  ],
  authors: [{ name: "CodeStack" }],
  openGraph: {
    title: "CodeStack // Rankings",
    description: "Competitive programming leaderboard — track streaks, ratings, and daily progress.",
    type: "website",
    locale: "en_US",
    siteName: "CodeStack",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeStack // Rankings",
    description: "Competitive programming leaderboard — track streaks, ratings, and daily progress.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="dark"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}