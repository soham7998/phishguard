"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Shield, Zap, Globe, Lock, Eye, BarChart3, Code2,
  ArrowRight, CheckCircle2, AlertTriangle, XCircle,
  ChevronRight, Star, Terminal, Database, Cpu
} from "lucide-react";

// ── Animated hero terminal ─────────────────────────────────────────────────
const DEMO_LINES = [
  { text: '$ curl -X POST https://api.phishguard.dev/v1/analyze \\', color: "text-slate-400" },
  { text: '  -H "X-API-Key: pg_••••••••••••••••" \\', color: "text-indigo-400" },
  { text: '  -d \'{"url":"http://paypαl-secure-login.tk/verify"}\'', color: "text-slate-400" },
  { text: "", color: "" },
  { text: "{", color: "text-slate-300" },
  { text: '  "analysis_id": "a3f9c12b",', color: "text-slate-400" },
  { text: '  "url":         "http://paypαl-secure-login.tk/verify",', color: "text-slate-400" },
  { text: '  "risk_score":  94,', color: "text-red-400 font-semibold" },
  { text: '  "verdict":     "MALICIOUS",', color: "text-red-400 font-bold" },
  { text: '  "risk_reasons": [', color: "text-slate-400" },
  { text: '    "VirusTotal: 31 engines flagged as malicious",', color: "text-orange-400" },
  { text: '    "URLhaus: listed as malware_download",', color: "text-orange-400" },
  { text: '    "Punycode/IDN domain (possible homograph)",', color: "text-orange-400" },
  { text: '    "Domain registered 3 days ago (newly registered)",', color: "text-orange-400" },
  { text: '    "Suspicious TLD: .tk"', color: "text-orange-400" },
  { text: "  ],", color: "text-slate-400" },
  { text: '  "elapsed_sec": 1.84', color: "text-slate-500" },
  { text: "}", color: "text-slate-300" },
];

function HeroTerminal() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= DEMO_LINES.length) return;
    const delay = visibleLines < 3 ? 80 : 40;
    const t = setTimeout(() => setVisibleLines((v) => v + 1), delay);
    return () => clearTimeout(t);
  }, [visibleLines]);

  useEffect(() => {
    // Loop animation
    if (visibleLines >= DEMO_LINES.length) {
      const t = setTimeout(() => setVisibleLines(0), 4000);
      return () => clearTimeout(t);
    }
  }, [visibleLines]);

  return (
    <div className="relative rounded-xl border border-[#1e2433] bg-[#0d1117] overflow-hidden glow-purple">
      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e2433] bg-[#0a0e18]">
        <div className="w-3 h-3 rounded-full bg-red-500/70" />
        <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
        <div className="w-3 h-3 rounded-full bg-green-500/70" />
        <span className="ml-3 text-xs text-slate-500 terminal">phishguard — analyze</span>
        <div className="ml-auto flex items-center gap-1.5">
          <div className="pulse-dot" />
          <span className="text-xs text-slate-500">live</span>
        </div>
      </div>

      {/* Terminal content */}
      <div className="p-5 terminal min-h-[340px]">
        {DEMO_LINES.slice(0, visibleLines).map((line, i) => (
          <div key={i} className={`${line.color} leading-6`}>
            {line.text || <span>&nbsp;</span>}
          </div>
        ))}
        {visibleLines < DEMO_LINES.length && (
          <span className="inline-block w-2 h-4 bg-indigo-400 cursor ml-0.5 align-middle" />
        )}
      </div>

      {/* Scan line overlay */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="scan-line absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
      </div>
    </div>
  );
}

// ── Features ──────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: <Shield className="w-5 h-5" />,
    title: "VirusTotal Scan",
    desc: "Cross-reference against 87+ AV engines and URL scanning services simultaneously.",
    color: "text-indigo-400",
    bg: "bg-indigo-500/10 border-indigo-500/20",
  },
  {
    icon: <Database className="w-5 h-5" />,
    title: "URLhaus Feed",
    desc: "Real-time check against Abuse.ch's URLhaus — the largest malware URL database.",
    color: "text-purple-400",
    bg: "bg-purple-500/10 border-purple-500/20",
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: "GreyNoise Intel",
    desc: "IP classification: malicious scanner, benign crawler, or unknown — instantly.",
    color: "text-cyan-400",
    bg: "bg-cyan-500/10 border-cyan-500/20",
  },
  {
    icon: <Globe className="w-5 h-5" />,
    title: "WHOIS & Domain Age",
    desc: "Detect newly registered domains and privacy-guarded registrations — classic phishing signals.",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: <Lock className="w-5 h-5" />,
    title: "SSL Certificate Check",
    desc: "Validate certificate issuer, expiry, and SAN. Detect self-signed and expired certs.",
    color: "text-yellow-400",
    bg: "bg-yellow-500/10 border-yellow-500/20",
  },
  {
    icon: <Cpu className="w-5 h-5" />,
    title: "URL Feature Analysis",
    desc: "Homograph detection, suspicious TLDs, punycode, excessive encoding, @ tricks.",
    color: "text-orange-400",
    bg: "bg-orange-500/10 border-orange-500/20",
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: "Risk Score 0–100",
    desc: "Every signal weighted and fused into one score. CLEAN / LOW_RISK / SUSPICIOUS / MALICIOUS.",
    color: "text-red-400",
    bg: "bg-red-500/10 border-red-500/20",
  },
  {
    icon: <Code2 className="w-5 h-5" />,
    title: "REST API + SDKs",
    desc: "Single POST request. JSON response. Python, Node, PHP SDKs. OpenAPI spec included.",
    color: "text-slate-400",
    bg: "bg-slate-500/10 border-slate-500/20",
  },
];

// ── How it works steps ────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "Submit URL",
    desc: "POST to /v1/analyze with any URL. Normalization and scheme detection happen automatically.",
    code: `POST /v1/analyze
X-API-Key: pg_your_key

{
  "url": "https://suspicious-site.tk"
}`,
  },
  {
    num: "02",
    title: "7-source enrichment",
    desc: "VirusTotal, URLhaus, GreyNoise, DNS, WHOIS, SSL, and URL feature analysis run in parallel.",
    code: `Enrichment pipeline:
✓ URL features     12ms
✓ DNS resolution   45ms
✓ SSL check        89ms
✓ WHOIS lookup    312ms
✓ URLhaus check   178ms
✓ GreyNoise       201ms
✓ VirusTotal      844ms
─────────────────────
Total:           ~1.8s`,
  },
  {
    num: "03",
    title: "Risk score + verdict",
    desc: "All signals are weighted and fused into a 0–100 score with a human-readable verdict and reasons.",
    code: `{
  "risk_score":  94,
  "verdict":     "MALICIOUS",
  "risk_reasons": [
    "31 VT engines flagged",
    "URLhaus: malware_download",
    "Domain age: 3 days",
    "Suspicious TLD: .tk"
  ]
}`,
  },
];

// ── Social proof ──────────────────────────────────────────────────────────
const TESTIMONIALS = [
  {
    quote: "We integrated PhishGuard into our email gateway in 20 minutes. Blocked 340 phishing URLs in the first week.",
    name: "Alex M.",
    role: "Security Engineer · FinTech startup",
    initials: "AM",
  },
  {
    quote: "The WHOIS domain age check alone caught a wave of newly registered lookalike domains targeting our brand.",
    name: "Priya R.",
    role: "SOC Analyst · E-commerce",
    initials: "PR",
  },
  {
    quote: "One API call replaces manually checking VirusTotal + URLhaus + WHOIS separately. Hours saved every week.",
    name: "James T.",
    role: "Backend Developer · SaaS",
    initials: "JT",
  },
];

// ── Comparison table ──────────────────────────────────────────────────────
const COMPARE_ROWS = [
  ["Risk score 0–100",         true,  false, false, false],
  ["VirusTotal",               true,  true,  false, false],
  ["URLhaus (Abuse.ch)",       true,  false, false, false],
  ["GreyNoise IP intel",       true,  false, false, false],
  ["WHOIS + domain age",       true,  false, false, true ],
  ["SSL cert validation",      true,  false, false, false],
  ["URL feature analysis",     true,  false, false, false],
  ["Unified verdict + reasons",true,  false, false, false],
  ["REST API",                 true,  true,  true,  true ],
  ["Free tier",                true,  true,  true,  false],
];

function Check({ v }: { v: boolean }) {
  return v
    ? <CheckCircle2 className="w-4 h-4 text-emerald-400 mx-auto" />
    : <span className="block w-4 h-px bg-slate-700 mx-auto" />;
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <div className="grid-bg">
      {/* ── HERO ── */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: headline */}
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-6">
              <Zap className="w-3 h-3" />
              Free API · No credit card · 50 req/day
            </div>

            <h1 className="text-5xl lg:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6">
              Detect phishing<br />
              <span className="gradient-text">in one API call.</span>
            </h1>

            <p className="text-lg text-slate-400 leading-relaxed mb-8 max-w-lg">
              Submit any URL. PhishGuard queries VirusTotal, URLhaus, GreyNoise, WHOIS, SSL,
              and DNS — then returns a <strong className="text-white">0–100 risk score</strong> and
              a <strong className="text-white">MALICIOUS / SUSPICIOUS / CLEAN</strong> verdict in under 2 seconds.
            </p>

            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/playground"
                className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all duration-200 hover:shadow-xl hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                Try it free <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/docs"
                className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold rounded-xl transition-all duration-200"
              >
                <Terminal className="w-4 h-4" />
                View docs
              </Link>
            </div>

            {/* Social proof numbers */}
            <div className="flex flex-wrap gap-8">
              {[
                { num: "7+", label: "Intel sources" },
                { num: "<2s", label: "Analysis time" },
                { num: "Free", label: "To start" },
              ].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-black text-white">{s.num}</div>
                  <div className="text-xs text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: terminal */}
          <div className="float">
            <HeroTerminal />
          </div>
        </div>
      </section>

      {/* ── VERDICT BADGES BANNER ── */}
      <section className="py-6 border-y border-[#1e2433] bg-[#0d1117]/50">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-4 text-sm">
          <span className="text-slate-500">Verdict types:</span>
          {[
            { v: "CLEAN",      icon: <CheckCircle2 className="w-3.5 h-3.5" />, score: "0–14" },
            { v: "LOW_RISK",   icon: <Eye className="w-3.5 h-3.5" />,         score: "15–39" },
            { v: "SUSPICIOUS", icon: <AlertTriangle className="w-3.5 h-3.5" />, score: "40–69" },
            { v: "MALICIOUS",  icon: <XCircle className="w-3.5 h-3.5" />,     score: "70–100" },
          ].map((b) => (
            <span
              key={b.v}
              className={`verdict-${b.v} flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold`}
            >
              {b.icon} {b.v} <span className="opacity-60">({b.score})</span>
            </span>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Everything in <span className="gradient-text">one response</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Stop toggling between 7 different tabs. PhishGuard runs all checks in parallel
              and returns everything structured in a single JSON.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="group p-5 rounded-xl border border-[#1e2433] bg-[#0d1117] hover:border-indigo-500/40 hover:bg-[#0d1117]/80 transition-all duration-300 cursor-default"
              >
                <div className={`w-10 h-10 rounded-lg border flex items-center justify-center mb-4 ${f.bg} ${f.color} group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 bg-[#0d1117]/50 border-y border-[#1e2433]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              How it <span className="gradient-text">works</span>
            </h2>
            <p className="text-slate-400 text-lg">Submit → Enrich → Score. Under 2 seconds.</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {STEPS.map((step) => (
              <div key={step.num} className="relative">
                {/* Connector line */}
                <div className="hidden lg:block absolute top-8 left-full w-full h-px bg-gradient-to-r from-indigo-500/30 to-transparent z-10 last:hidden" />

                <div className="p-6 rounded-xl border border-[#1e2433] bg-[#0d1117] h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl font-black text-indigo-500/30">{step.num}</span>
                    <h3 className="text-lg font-bold text-white">{step.title}</h3>
                  </div>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">{step.desc}</p>
                  <pre className="terminal text-xs text-slate-400 bg-[#050810] rounded-lg p-4 overflow-x-auto leading-relaxed">
                    {step.code}
                  </pre>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Why not just use <span className="gradient-text-danger">VirusTotal?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              VirusTotal is one source. PhishGuard fuses 7+ sources, adds WHOIS domain age,
              SSL checks, and URL feature analysis — and returns a single actionable verdict.
            </p>
          </div>

          <div className="rounded-xl border border-[#1e2433] overflow-hidden">
            <div className="grid grid-cols-5 bg-[#0a0e18] border-b border-[#1e2433]">
              <div className="col-span-2 p-4 text-sm font-medium text-slate-400">Feature</div>
              {["PhishGuard", "VirusTotal", "URLhaus", "urlscan.io"].map((h) => (
                <div key={h} className={`p-4 text-center text-xs font-bold ${h === "PhishGuard" ? "text-indigo-400" : "text-slate-500"}`}>
                  {h}
                </div>
              ))}
            </div>
            {COMPARE_ROWS.map(([label, ...vals], i) => (
              <div
                key={String(label)}
                className={`grid grid-cols-5 border-b border-[#1e2433] last:border-0 ${i % 2 === 0 ? "" : "bg-white/[0.01]"}`}
              >
                <div className="col-span-2 p-4 text-sm text-slate-400">{label}</div>
                {vals.map((v, j) => (
                  <div key={j} className="p-4 flex items-center justify-center">
                    <Check v={v as boolean} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-4 bg-[#0d1117]/50 border-y border-[#1e2433]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-white mb-4">
              Trusted by <span className="gradient-text">security teams</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="p-6 rounded-xl border border-[#1e2433] bg-[#0d1117]">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">
                    {t.initials}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative p-10 rounded-2xl border border-indigo-500/20 bg-gradient-to-b from-indigo-500/5 to-transparent overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 via-transparent to-purple-600/5 pointer-events-none" />
            <Shield className="w-12 h-12 text-indigo-400 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-white mb-4">
              Start detecting phishing<br />in 5 minutes.
            </h2>
            <p className="text-slate-400 mb-8 text-lg">
              Free tier. No credit card. 50 analyses/day forever.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/playground"
                className="flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-lg transition-all duration-200 hover:shadow-2xl hover:shadow-indigo-500/30 hover:-translate-y-1"
              >
                Get your free API key <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/docs"
                className="flex items-center gap-2 px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold rounded-xl text-lg transition-all"
              >
                Read the docs <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
