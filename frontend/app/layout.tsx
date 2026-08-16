import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import { Toaster } from "sonner";

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
          <Toaster 
            position="bottom-right"
            toastOptions={{
              style: {
                background: "var(--lb-surface-elevated)",
                color: "var(--lb-text)",
                border: "2px solid var(--lb-border)",
                borderRadius: "0",
                fontFamily: "var(--font-mono)",
                textTransform: "uppercase",
                boxShadow: "4px 4px 0 var(--lb-border)"
              },
              classNames: {
                error: "border-red-500 shadow-[4px_4px_0_theme('colors.red.500')]",
                success: "border-[var(--lb-accent)] shadow-[4px_4px_0_var(--lb-accent)] text-[var(--lb-accent)]"
              }
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}