import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'Goat Funded $1 Instant Account Calculator | Risk Manager & Consistency Tool',
  description: 'Calculate your daily profit consistency, plan your withdrawals, and manage risk for Goat Funded Trader Instant Accounts ($1 Promo, GOAT, Blitz, PRO).',
  keywords: 'goat funded trader, instant funding, consistency calculator, trading calculator, risk management, prop firm tools',
  openGraph: {
    title: 'Goat Funded Consistency Calculator',
    description: 'Master your consistency rules and payout planning.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {children}
      </body>
    </html>
  );
}
