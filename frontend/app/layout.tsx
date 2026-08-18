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
  title: "Codango // Rankings",
  description:
    "Competitive programming leaderboard — track streaks, ratings, and daily progress.",
  keywords: [
    "competitive programming",
    "leaderboard",
    "codeforces",
    "leetcode",
    "tracker",
  ],
  authors: [{ name: "Codango" }],
  openGraph: {
    title: "Codango // Rankings",
    description: "Competitive programming leaderboard — track streaks, ratings, and daily progress.",
    url: "https://yourdomain.com",
    siteName: "Codango",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Codango // Rankings",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Codango // Rankings",
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