import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { StructuredData } from "@/components/StructuredData";
import { ThemeProvider } from "@/components/ThemeProvider";

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
  authors: [{ name: "Soham Shah", url: "https://linkedin.com/in/shahsoham2003" }],
  creator: "Soham Shah — Cybersecurity enthusiast & SIEM engineer",
  metadataBase: new URL("https://phishguardapi.vercel.app"),
  alternates: { canonical: "https://phishguardapi.vercel.app" },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon.svg",
  },
  openGraph: {
    title: "PhishGuard — Phishing URL Analyzer API",
    description: "Detect phishing URLs in one API call. Risk score 0–100 + MALICIOUS/CLEAN verdict. Free tier.",
    type: "website",
    url: "https://phishguardapi.vercel.app",
    siteName: "PhishGuard",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "PhishGuard API" }],
  },
  robots: {
    index: true, follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <StructuredData />
        {/* Inter + JetBrains Mono from Google Fonts — loaded via <link> so Next.js doesn't strip it */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,300;0,14..32,400;0,14..32,500;0,14..32,600;0,14..32,700;0,14..32,800;0,14..32,900;1,14..32,400;1,14..32,500;1,14..32,600;1,14..32,700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {/* Inline theme script — prevents flash of wrong theme */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var t = localStorage.getItem('theme') || 'dark';
                document.documentElement.setAttribute('data-theme', t);
              } catch(e) {}
            `,
          }}
        />
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
