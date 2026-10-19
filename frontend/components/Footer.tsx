import Link from "next/link";
import { Github } from "lucide-react";

const cols = [
  {
    title: "Product",
    links: [
      { href: "/#features",     label: "Features" },
      { href: "/pricing",       label: "Pricing" },
      { href: "/playground",    label: "Playground" },
      { href: "/#how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs",              label: "API Reference" },
      { href: "/docs#quickstart",   label: "Quickstart" },
      { href: "/docs#sdks",         label: "SDKs" },
      { href: "/docs#errors",       label: "Error codes" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy",         label: "Privacy Policy" },
      { href: "/terms",           label: "Terms of Service" },
      { href: "/acceptable-use",  label: "Acceptable Use" },
    ],
  },
];

export default function Footer() {
  return (
    <footer style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <span className="text-[17px] font-bold tracking-[-0.03em]" style={{ color: "var(--text)", fontFamily: "Inter, sans-serif" }}>
                phish<span style={{ color: "var(--accent)" }}>guard</span>
              </span>
            </Link>
            <p className="text-[13px] leading-relaxed mb-5" style={{ color: "var(--text-muted)" }}>
              Phishing URL analysis API. VirusTotal, URLhaus, GreyNoise, WHOIS, SSL, DNS — one call.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              <a href="https://github.com/soham7998/phishguard" target="_blank" rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60" style={{ color: "var(--text-muted)" }}>
                <Github className="w-[18px] h-[18px]" />
              </a>
              <a href="https://linkedin.com/in/shahsoham2003" target="_blank" rel="noopener noreferrer"
                className="transition-opacity hover:opacity-60" style={{ color: "var(--text-muted)" }}>
                <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect width="4" height="12" x="2" y="9"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold uppercase tracking-wider mb-3"
                style={{ color: "var(--text-muted)", letterSpacing: "0.1em" }}>
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href}
                      className="text-[13px] transition-colors hover:opacity-100"
                      style={{ color: "var(--text-dim)", opacity: 0.75 }}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6"
          style={{ borderTop: "1px solid var(--border)" }}>
          <p className="text-[12px]" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} PhishGuard. Built by{" "}
            <a href="https://linkedin.com/in/shahsoham2003"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "var(--accent)" }}>
              Soham Shah
            </a>
            {" "}— Cybersecurity enthusiast &amp; SIEM engineer.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="pulse-dot" />
            <span className="text-[12px]" style={{ color: "var(--text-muted)" }}>All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
