"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, CheckCircle2, XCircle, AlertTriangle, Eye,
  Globe, Lock, Database, Cpu, BarChart3, Code2, Zap, Star
} from "lucide-react";

/* ── Animated terminal ── */
const DEMO = [
  { t: '$ curl -X POST https://api.phishguardapi.vercel.app/v1/analyze \\', c: "#71717a" },
  { t: '  -H "X-API-Key: pg_••••••••••••••••" \\',                          c: "#6366f1" },
  { t: '  -d \'{"url":"http://paypαl-secure-login.tk/verify"}\'',            c: "#71717a" },
  { t: "",                                                                   c: "" },
  { t: '{',                                                                  c: "inherit" },
  { t: '  "risk_score":  94,',                                               c: "#ef4444" },
  { t: '  "verdict":     "MALICIOUS",',                                      c: "#ef4444" },
  { t: '  "risk_reasons": [',                                                c: "inherit" },
  { t: '    "VirusTotal: 31 engines flagged",',                              c: "#f97316" },
  { t: '    "URLhaus: listed as phishing",',                                 c: "#f97316" },
  { t: '    "Domain registered 3 days ago",',                                c: "#f97316" },
  { t: '    "Suspicious TLD: .tk"',                                          c: "#f97316" },
  { t: '  ],',                                                               c: "inherit" },
  { t: '  "elapsed_sec": 1.84',                                              c: "#71717a" },
  { t: '}',                                                                  c: "inherit" },
];

function Terminal() {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= DEMO.length) { const t = setTimeout(() => setN(0), 3500); return () => clearTimeout(t); }
    const t = setTimeout(() => setN(v => v + 1), n < 3 ? 90 : 50);
    return () => clearTimeout(t);
  }, [n]);
  return (
    <div className="rounded-xl overflow-hidden border" style={{ background: "var(--surface)", borderColor: "var(--border)" }}>
      {/* chrome */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ background: "var(--surface2)", borderColor: "var(--border)" }}>
        <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
        <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        <span className="ml-3 text-[11px] terminal" style={{ color: "var(--text-muted)" }}>phishguard — analyze</span>
        <div className="ml-auto flex items-center gap-1.5"><div className="pulse-dot" /><span className="text-[11px]" style={{ color: "var(--text-muted)" }}>live</span></div>
      </div>
      {/* content */}
      <div className="p-5 terminal min-h-[300px]">
        {DEMO.slice(0, n).map((l, i) => (
          <div key={i} style={{ color: l.c || "var(--text-dim)", lineHeight: "1.7" }}>
            {l.t || "\u00A0"}
          </div>
        ))}
        {n < DEMO.length && <span className="inline-block w-1.5 h-4 ml-0.5 align-middle" style={{ background: "var(--accent)" }} />}
      </div>
    </div>
  );
}

/* ── Features ── */
const FEATURES = [
  { icon: <Zap className="w-4 h-4" />, title: "VirusTotal", desc: "87+ AV engines cross-referenced in parallel.", color: "#6366f1" },
  { icon: <Database className="w-4 h-4" />, title: "URLhaus", desc: "Abuse.ch malware URL database, real-time.", color: "#8b5cf6" },
  { icon: <Eye className="w-4 h-4" />, title: "GreyNoise", desc: "IP classification: malicious, benign, or unknown.", color: "#06b6d4" },
  { icon: <Globe className="w-4 h-4" />, title: "WHOIS & Domain Age", desc: "Newly registered domains = phishing signal.", color: "#10b981" },
  { icon: <Lock className="w-4 h-4" />, title: "SSL Validation", desc: "Cert issuer, expiry, self-signed detection.", color: "#f59e0b" },
  { icon: <Cpu className="w-4 h-4" />, title: "URL Analysis", desc: "Homograph, punycode, suspicious TLDs, keywords.", color: "#f97316" },
  { icon: <BarChart3 className="w-4 h-4" />, title: "Risk Score 0–100", desc: "All signals weighted into one actionable score.", color: "#ef4444" },
  { icon: <Code2 className="w-4 h-4" />, title: "REST API", desc: "Single POST. JSON response. OpenAPI spec.", color: "#71717a" },
];

/* ── Comparison ── */
const CMP = [
  ["Risk score 0–100",        true, false, false, false],
  ["VirusTotal",              true, true,  false, false],
  ["URLhaus (Abuse.ch)",      true, false, false, false],
  ["GreyNoise",               true, false, false, false],
  ["WHOIS + domain age",      true, false, false, true ],
  ["SSL cert validation",     true, false, false, false],
  ["URL feature analysis",    true, false, false, false],
  ["Unified verdict",         true, false, false, false],
  ["Free tier",               true, true,  true,  false],
];

function Chk({ v }: { v: boolean }) {
  return v
    ? <CheckCircle2 className="w-4 h-4 mx-auto" style={{ color: "#22c55e" }} />
    : <span className="block w-3 h-px mx-auto" style={{ background: "var(--border2)" }} />;
}

const TESTIMONIALS = [
  { q: "Replaced 4 manual lookups with one call. ~6 hours/week saved.", n: "Alex M.", r: "Security Engineer · FinTech" },
  { q: "The WHOIS domain age check alone caught a wave of lookalike domains targeting our brand.", n: "Priya R.", r: "SOC Analyst · E-commerce" },
  { q: "One API call replaces checking VirusTotal + URLhaus + WHOIS separately. Huge time saver.", n: "James T.", r: "Backend Developer · SaaS" },
];

export default function HomePage() {
  return (
    <div>
      {/* ── HERO ── */}
      <section className="pt-32 pb-24 px-5 relative overflow-hidden">
        {/* subtle grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          opacity: 0.4,
        }} />
        {/* glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, rgba(99,102,241,0.08) 0%, transparent 70%)" }} />

        <div className="max-w-6xl mx-auto relative">
          {/* Eyebrow — bloo.io style */}
          <p className="section-label mb-5">Phishing Detection API</p>

          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              {/* Headline — large, editorial, italic emphasis like bloo.io */}
              <h1 className="text-[52px] sm:text-[60px] font-bold leading-[1.05] tracking-[-0.03em] mb-6"
                style={{ fontFamily: "Inter, sans-serif", color: "var(--text)" }}>
                Detect phishing<br />
                in <em style={{ fontStyle: "italic" }}>one API call.</em>
              </h1>

              <p className="text-[17px] leading-relaxed mb-8 max-w-[480px]" style={{ color: "var(--text-dim)" }}>
                Submit any URL. PhishGuard queries VirusTotal, URLhaus, GreyNoise,
                WHOIS, SSL, and DNS — returns a <strong style={{ color: "var(--text)" }}>0–100 risk score</strong> and
                a <strong style={{ color: "var(--text)" }}>MALICIOUS / CLEAN verdict</strong> in under 2 seconds.
              </p>

              <div className="flex flex-wrap gap-3 mb-12">
                <Link href="/playground" className="btn-primary">
                  Try free <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/docs" className="btn-secondary">
                  Read the docs
                </Link>
              </div>

              {/* Verdict types — bloo.io pill style */}
              <div className="flex flex-wrap gap-2">
                {[
                  { v: "CLEAN",      c: "#22c55e" },
                  { v: "LOW_RISK",   c: "#6366f1" },
                  { v: "SUSPICIOUS", c: "#f59e0b" },
                  { v: "MALICIOUS",  c: "#ef4444" },
                ].map(b => (
                  <span key={b.v} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border"
                    style={{ color: b.c, background: `${b.c}12`, borderColor: `${b.c}30` }}>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: b.c }} />
                    {b.v.replace("_", " ")}
                  </span>
                ))}
              </div>
            </div>

            {/* Terminal */}
            <div className="float">
              <Terminal />
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="max-w-6xl mx-auto px-5"><hr className="divider" /></div>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-4">Platform capabilities</p>
          <h2 className="text-[36px] sm:text-[42px] font-bold tracking-[-0.03em] mb-4"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--text)" }}>
            Everything in <em>one response.</em>
          </h2>
          <p className="text-[16px] mb-12 max-w-[520px]" style={{ color: "var(--text-dim)" }}>
            Stop toggling between 7 different tabs. All checks run in parallel, results returned in a single JSON.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {FEATURES.map(f => (
              <div key={f.title} className="card p-5 group cursor-default">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: `${f.color}18`, color: f.color }}>
                  {f.icon}
                </div>
                <h3 className="text-[14px] font-semibold mb-1.5" style={{ color: "var(--text)" }}>{f.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: "var(--text-muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5"><hr className="divider" /></div>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-4">Workflow</p>
          <h2 className="text-[36px] sm:text-[42px] font-bold tracking-[-0.03em] mb-12"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--text)" }}>
            Submit → Enrich → Score. <em>Under 2 seconds.</em>
          </h2>

          <div className="grid lg:grid-cols-3 gap-5">
            {[
              {
                n: "01", title: "Submit any URL",
                desc: "POST to /v1/analyze. Scheme detection and normalization happen automatically.",
                code: `POST /v1/analyze\nX-API-Key: pg_your_key\n\n{\n  "url": "https://target.example"\n}`,
              },
              {
                n: "02", title: "7-source enrichment",
                desc: "VirusTotal, URLhaus, GreyNoise, DNS, WHOIS, SSL, and URL features run in parallel.",
                code: `✓ URL features     12ms\n✓ DNS resolution   45ms\n✓ SSL check        89ms\n✓ WHOIS           312ms\n✓ URLhaus         178ms\n✓ GreyNoise       201ms\n✓ VirusTotal      844ms`,
              },
              {
                n: "03", title: "Risk score + verdict",
                desc: "All signals weighted into a 0–100 score with a human-readable verdict.",
                code: `{\n  "risk_score":  94,\n  "verdict":     "MALICIOUS",\n  "risk_reasons": [\n    "31 VT engines flagged",\n    "Domain: 3 days old"\n  ]\n}`,
              },
            ].map(s => (
              <div key={s.n} className="card p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-[32px] font-black" style={{ color: "var(--border2)" }}>{s.n}</span>
                  <h3 className="text-[16px] font-bold" style={{ color: "var(--text)" }}>{s.title}</h3>
                </div>
                <p className="text-[13px] mb-4 leading-relaxed" style={{ color: "var(--text-dim)" }}>{s.desc}</p>
                <pre className="terminal text-[12px] p-4 rounded-lg overflow-x-auto leading-relaxed"
                  style={{ background: "var(--surface2)", color: "var(--text-dim)" }}>
                  {s.code}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5"><hr className="divider" /></div>

      {/* ── COMPARISON ── */}
      <section className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <p className="section-label mb-4">Comparison</p>
          <h2 className="text-[36px] sm:text-[42px] font-bold tracking-[-0.03em] mb-4"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--text)" }}>
            Why not just use <em>VirusTotal?</em>
          </h2>
          <p className="text-[16px] mb-10 max-w-[500px]" style={{ color: "var(--text-dim)" }}>
            VirusTotal is one source. PhishGuard fuses 7+ sources and returns a single actionable verdict.
          </p>

          <div className="rounded-xl overflow-hidden border" style={{ borderColor: "var(--border)" }}>
            <div className="grid grid-cols-5 border-b" style={{ background: "var(--surface2)", borderColor: "var(--border)" }}>
              <div className="col-span-2 px-4 py-3 text-[12px] font-medium" style={{ color: "var(--text-muted)" }}>Feature</div>
              {["PhishGuard", "VirusTotal", "URLhaus", "urlscan.io"].map((h, i) => (
                <div key={h} className="px-4 py-3 text-center text-[11px] font-bold"
                  style={{ color: i === 0 ? "var(--accent)" : "var(--text-muted)" }}>
                  {h}
                </div>
              ))}
            </div>
            {CMP.map(([label, ...vals], i) => (
              <div key={String(label)} className="grid grid-cols-5 border-b last:border-0"
                style={{ borderColor: "var(--border)", background: i % 2 === 1 ? "var(--surface2)" : "transparent" }}>
                <div className="col-span-2 px-4 py-3 text-[13px]" style={{ color: "var(--text-dim)" }}>{label}</div>
                {vals.map((v, j) => <div key={j} className="px-4 py-3 flex items-center justify-center"><Chk v={v as boolean} /></div>)}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5"><hr className="divider" /></div>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <p className="section-label mb-4">What analysts say</p>
          <h2 className="text-[36px] sm:text-[42px] font-bold tracking-[-0.03em] mb-10"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--text)" }}>
            Trusted by <em>security teams.</em>
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {TESTIMONIALS.map(t => (
              <div key={t.n} className="card p-6">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-[14px] leading-relaxed mb-5" style={{ color: "var(--text-dim)" }}>"{t.q}"</p>
                <div>
                  <div className="text-[13px] font-semibold" style={{ color: "var(--text)" }}>{t.n}</div>
                  <div className="text-[12px]" style={{ color: "var(--text-muted)" }}>{t.r}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-5"><hr className="divider" /></div>

      {/* ── CTA ── */}
      <section className="py-24 px-5">
        <div className="max-w-2xl mx-auto text-center">
          <p className="section-label mb-5">Get started today</p>
          <h2 className="text-[40px] sm:text-[48px] font-bold tracking-[-0.03em] mb-5"
            style={{ fontFamily: "Inter, sans-serif", color: "var(--text)" }}>
            Stop checking URLs<br /><em>manually.</em>
          </h2>
          <p className="text-[16px] mb-8" style={{ color: "var(--text-dim)" }}>
            Free tier. 50 analyses/day. No credit card. Set up in 2 minutes.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/playground" className="btn-primary text-[15px] px-6 py-3">
              Get free API key <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/docs" className="btn-secondary text-[15px] px-6 py-3">
              Read the docs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
