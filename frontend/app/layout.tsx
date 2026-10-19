import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StructuredData } from "@/components/StructuredData";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PhishGuard — Phishing URL Analyzer API",
    template: "%s | PhishGuard",
  },
  description:
    "Detect phishing URLs with one API call. VirusTotal, URLhaus, GreyNoise, WHOIS, SSL, DNS — fused into a 0–100 risk score. Free tier: 50 analyses/day, no credit card.",
  keywords: [
    "phishing detection api", "url scanner api", "phishing url checker",
    "virustotal api", "urlhaus", "greynoise", "threat intelligence api",
    "malicious url detection", "phishing check", "url safety check",
  ],
  authors: [{ name: "Soham Shah", url: "https://linkedin.com/in/sohamshah" }],
  creator: "Soham Shah — Cybersecurity enthusiast & SIEM engineer",
  metadataBase: new URL("https://phishguard.vercel.app"),
  alternates: { canonical: "https://phishguard.vercel.app" },
  icons: {
    icon: [
      { url: "/favicon.svg",  type: "image/svg+xml" },
      { url: "/favicon.ico",  sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "PhishGuard — Phishing URL Analyzer API",
    description: "Detect phishing URLs in one API call. Risk score 0–100 + MALICIOUS/CLEAN verdict. Free tier.",
    type: "website",
    url: "https://phishguard.vercel.app",
    siteName: "PhishGuard",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PhishGuard API" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PhishGuard — Phishing URL Analyzer API",
    description: "7 sources, one API call, one verdict. Free tier: 50/day.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <head>
        <StructuredData />
      </head>
      <body className="min-h-screen bg-[#050810] text-slate-200 antialiased font-[family-name:var(--font-geist)]">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
