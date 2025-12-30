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
  metadataBase: new URL('https://goatfunded-calculator.vercel.app'), // Replace with actual domain
  title: {
    default: 'Goat Funded Instant Account Calculator | Consistency & Risk Tool',
    template: '%s | Goat Funded Calculator'
  },
  description: 'The unofficial Goat Funded Trader Calculator. Calculate 15% consistency rules, plan withdrawals, and manage risk for $1K Instant Accounts, PRO, and Blitz programs.',
  keywords: [
    'Goat Funded Trader',
    'Instant Funding Calculator',
    'Prop Firm Consistency Calculator',
    'Goat Funded Consistency Rule',
    'Trading Risk Manager',
    '1K Instant Account',
    'Prop Firm Payout Calculator',
    'Forex Risk Calculator',
    'Trader Payouts',
    'Goat Funded Review'
  ],
  authors: [{ name: 'Goat Funded Community' }],
  category: 'Finance',
  openGraph: {
    title: 'Goat Funded Instant Account Calculator',
    description: 'Master your consistency rules. Calculate payouts, valid trading days, and profit targets for Goat Funded Trader instant accounts.',
    url: 'https://goatfunded-calculator.vercel.app',
    siteName: 'Goat Funded Calculator',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: '/og-image.png', // User should add this image
        width: 1200,
        height: 630,
        alt: 'Goat Funded Calculator Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Goat Funded Consistency & Payout Calculator',
    description: 'Optimize your prop firm trading strategy. Calculate 15% rules and plan your payouts efficiently.',
    images: ['/og-image.png'], // User should add this image
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
