import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StructuredData } from "@/components/StructuredData";

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
  metadataBase: new URL("https://phishguard.dev"),
  alternates: { canonical: "https://phishguard.dev" },
  openGraph: {
    title: "PhishGuard — Phishing URL Analyzer API",
    description: "Detect phishing URLs in one API call. Risk score 0–100 + MALICIOUS/CLEAN verdict. Free tier.",
    type: "website",
    url: "https://phishguard.dev",
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <StructuredData />
      </head>
      <body className="min-h-screen bg-[#050810] text-slate-200 antialiased">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
