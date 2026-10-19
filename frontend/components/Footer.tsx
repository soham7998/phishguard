import Link from "next/link";
import { Shield, Github } from "lucide-react";

const cols = [
  {
    title: "Product",
    links: [
      { href: "/#features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/playground", label: "Playground" },
      { href: "/#how-it-works", label: "How it works" },
    ],
  },
  {
    title: "Developers",
    links: [
      { href: "/docs", label: "API Reference" },
      { href: "/docs#quickstart", label: "Quickstart" },
      { href: "/docs#sdks", label: "SDKs" },
      { href: "/docs#errors", label: "Error codes" },
    ],
  },
  {
    title: "Compare",
    links: [
      { href: "/compare/virustotal", label: "vs VirusTotal" },
      { href: "/compare/urlscan", label: "vs urlscan.io" },
      { href: "/compare/safebrowsing", label: "vs Safe Browsing" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" },
      { href: "/acceptable-use", label: "Acceptable Use" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-[#1e2433] bg-[#050810]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white text-lg">
                Phish<span className="text-indigo-400">Guard</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed mb-4">
              Phishing URL analysis API. VirusTotal, URLhaus, GreyNoise, WHOIS, SSL, DNS — one call.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://github.com/soham7998/phishguard"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/shahsoham2003"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-500 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                {col.title}
              </h4>
              <ul className="space-y-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-slate-500 hover:text-white transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-[#1e2433] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-600">
            © {new Date().getFullYear()} PhishGuard. Built by{" "}
            <a href="https://linkedin.com/in/shahsoham2003" className="text-indigo-400 hover:text-indigo-300">
              Soham Shah
            </a>
            {" "}— Cybersecurity enthusiast & SIEM engineer.
          </p>
          <div className="flex items-center gap-1.5">
            <div className="pulse-dot" />
            <span className="text-xs text-slate-500">All systems operational</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
