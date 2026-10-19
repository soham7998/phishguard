"use client";
import { useState } from "react";
import {
  Shield, AlertTriangle, CheckCircle2, XCircle, Eye,
  Loader2, Globe, Lock, Database, Zap, Copy, Check,
  ChevronDown, ChevronRight, ExternalLink
} from "lucide-react";

// ── Mock analysis results for demo URLs ────────────────────────────────────
const DEMO_RESULTS: Record<string, any> = {
  "https://paypal-secure-login.tk/verify/account": {
    url: "https://paypal-secure-login.tk/verify/account",
    domain: "paypal-secure-login.tk",
    risk_score: 94,
    verdict: "MALICIOUS",
    elapsed_sec: 1.84,
    analysis_id: "a3f9c12b",
    risk_reasons: [
      "VirusTotal: 31 engines flagged as malicious",
      "URLhaus: listed as phishing",
      "Suspicious keywords: paypal, login, secure, verify, account",
      "Suspicious TLD: .tk",
      "Domain registered 3 days ago (newly registered)",
      "WHOIS privacy guard active",
    ],
    url_features: {
      uses_https: true, has_ip_host: false, subdomain_count: 0,
      url_length: 47, keyword_hits: ["paypal", "login", "secure", "verify", "account"],
      suspicious_tld: true, is_punycode: false,
    },
    dns: { dns_resolves: true, dns_a_records: ["185.220.101.47"], dns_ip: "185.220.101.47" },
    virustotal: {
      vt_available: true, vt_malicious: 31, vt_suspicious: 4,
      vt_harmless: 5, vt_total_engines: 89,
      vt_flagged_by: ["Google Safebrowsing", "Phishtank", "OpenPhish", "Netcraft", "ESET"],
      vt_categories: ["phishing", "malware"],
      vt_url: "https://www.virustotal.com/gui/url/a3f9c12b",
    },
    urlhaus: {
      urlhaus_listed: true, urlhaus_threat: "phishing",
      urlhaus_url_status: "online", urlhaus_date_added: "2024-10-18",
      urlhaus_tags: ["paypal", "phishing"],
    },
    greynoise: {
      gn_seen: true, gn_classification: "malicious",
      gn_noise: true, gn_riot: false, gn_name: "Mirai C2",
    },
    whois: {
      whois_available: true, whois_registrar: "Freenom",
      whois_age_days: 3, whois_newly_registered: true,
      whois_privacy_guard: true, whois_country: "TK",
    },
    ssl: {
      ssl_valid: true, ssl_issuer: "Let's Encrypt",
      ssl_cn: "paypal-secure-login.tk", ssl_days_remaining: 89,
      ssl_free_cert: true,
    },
  },
  "https://github.com": {
    url: "https://github.com",
    domain: "github.com",
    risk_score: 2,
    verdict: "CLEAN",
    elapsed_sec: 1.21,
    analysis_id: "b7e2a45c",
    risk_reasons: [],
    url_features: {
      uses_https: true, has_ip_host: false, subdomain_count: 0,
      url_length: 18, keyword_hits: [], suspicious_tld: false, is_punycode: false,
    },
    dns: { dns_resolves: true, dns_a_records: ["140.82.113.4"], dns_ip: "140.82.113.4" },
    virustotal: {
      vt_available: true, vt_malicious: 0, vt_suspicious: 0,
      vt_harmless: 80, vt_total_engines: 87, vt_flagged_by: [],
      vt_categories: ["code repository", "developer tools"],
    },
    urlhaus: { urlhaus_listed: false },
    greynoise: { gn_seen: true, gn_classification: "benign", gn_noise: false, gn_riot: true, gn_name: "GitHub" },
    whois: {
      whois_available: true, whois_registrar: "MarkMonitor",
      whois_age_days: 6205, whois_newly_registered: false,
      whois_privacy_guard: false, whois_country: "US",
    },
    ssl: {
      ssl_valid: true, ssl_issuer: "DigiCert",
      ssl_cn: "github.com", ssl_days_remaining: 312,
      ssl_free_cert: false,
    },
  },
  "https://amazon-prize-winner.online/claim": {
    url: "https://amazon-prize-winner.online/claim",
    domain: "amazon-prize-winner.online",
    risk_score: 78,
    verdict: "MALICIOUS",
    elapsed_sec: 2.03,
    analysis_id: "c9d3b67e",
    risk_reasons: [
      "VirusTotal: 18 engines flagged as malicious",
      "Suspicious keywords: amazon, prize, winner, free, claim",
      "Suspicious TLD: .online",
      "Domain registered 7 days ago (newly registered)",
    ],
    url_features: {
      uses_https: true, has_ip_host: false, subdomain_count: 0,
      url_length: 41, keyword_hits: ["amazon", "prize", "winner", "free"],
      suspicious_tld: true, is_punycode: false,
    },
    dns: { dns_resolves: true, dns_a_records: ["91.108.4.12"], dns_ip: "91.108.4.12" },
    virustotal: {
      vt_available: true, vt_malicious: 18, vt_suspicious: 6,
      vt_harmless: 12, vt_total_engines: 87,
      vt_flagged_by: ["Google Safebrowsing", "Netcraft", "OpenPhish"],
      vt_categories: ["scam", "phishing"],
    },
    urlhaus: { urlhaus_listed: false, urlhaus_host_listed: true, urlhaus_host_url_count: 4 },
    greynoise: { gn_seen: false },
    whois: {
      whois_available: true, whois_registrar: "Namecheap",
      whois_age_days: 7, whois_newly_registered: true,
      whois_privacy_guard: true, whois_country: "US",
    },
    ssl: {
      ssl_valid: true, ssl_issuer: "Let's Encrypt",
      ssl_cn: "amazon-prize-winner.online", ssl_days_remaining: 89,
      ssl_free_cert: true,
    },
  },
};

const DEMO_URLS = Object.keys(DEMO_RESULTS);

// ── Verdict config ──────────────────────────────────────────────────────────
const VERDICT_CONFIG = {
  MALICIOUS:  { color: "text-red-400",    bg: "bg-red-500/10 border-red-500/30",     icon: <XCircle className="w-5 h-5" />,      ring: "#ef4444" },
  SUSPICIOUS: { color: "text-yellow-400", bg: "bg-yellow-500/10 border-yellow-500/30", icon: <AlertTriangle className="w-5 h-5" />, ring: "#f59e0b" },
  LOW_RISK:   { color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/30", icon: <Eye className="w-5 h-5" />,           ring: "#6366f1" },
  CLEAN:      { color: "text-emerald-400",bg: "bg-emerald-500/10 border-emerald-500/30", icon: <CheckCircle2 className="w-5 h-5" />, ring: "#10b981" },
} as const;

// ── Score ring SVG ──────────────────────────────────────────────────────────
function ScoreRing({ score, verdict }: { score: number; verdict: string }) {
  const cfg = VERDICT_CONFIG[verdict as keyof typeof VERDICT_CONFIG] ?? VERDICT_CONFIG.CLEAN;
  const r = 44, circ = 2 * Math.PI * r;
  const fill = circ - (score / 100) * circ;
  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="110" height="110" viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} fill="none" stroke="#1e2433" strokeWidth="8" />
        <circle
          cx="55" cy="55" r={r} fill="none"
          stroke={cfg.ring} strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={fill}
          transform="rotate(-90 55 55)"
          className="score-ring transition-all duration-1000"
        />
        <text x="55" y="52" textAnchor="middle" fill="white" fontSize="22" fontWeight="bold" fontFamily="Inter">{score}</text>
        <text x="55" y="68" textAnchor="middle" fill="#64748b" fontSize="9" fontFamily="Inter">/ 100</text>
      </svg>
      <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.bg} ${cfg.color}`}>
        {cfg.icon} {verdict.replace("_", " ")}
      </span>
    </div>
  );
}

// ── Source badge ────────────────────────────────────────────────────────────
function SourceBadge({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className={`flex items-center justify-between px-3 py-2 rounded-lg border text-xs ${ok ? "border-emerald-500/20 bg-emerald-500/5" : "border-red-500/20 bg-red-500/5"}`}>
      <span className="text-slate-400">{label}</span>
      <span className={`font-semibold ${ok ? "text-emerald-400" : "text-red-400"}`}>{value}</span>
    </div>
  );
}

// ── Collapsible section ─────────────────────────────────────────────────────
function Section({ title, icon, children, defaultOpen = false }: {
  title: string; icon: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-[#1e2433] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <span className="text-slate-400">{icon}</span> {title}
        </div>
        {open ? <ChevronDown className="w-4 h-4 text-slate-500" /> : <ChevronRight className="w-4 h-4 text-slate-500" />}
      </button>
      {open && <div className="px-5 pb-5 pt-0 space-y-2">{children}</div>}
    </div>
  );
}

// ── JSON viewer ─────────────────────────────────────────────────────────────
function JsonBlock({ data }: { data: any }) {
  const [copied, setCopied] = useState(false);
  const text = JSON.stringify(data, null, 2);
  const copy = () => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="relative rounded-xl border border-[#1e2433] bg-[#050810] overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e2433] bg-[#0a0e18]">
        <span className="text-xs text-slate-500 terminal">JSON response</span>
        <button onClick={copy} className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-white transition-colors">
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="terminal text-xs text-slate-300 p-4 overflow-auto max-h-[500px] leading-relaxed">
        {text}
      </pre>
    </div>
  );
}

// ── Main Playground ─────────────────────────────────────────────────────────
export default function PlaygroundPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [tab, setTab] = useState<"visual" | "json">("visual");
  const [apiKey] = useState("pg_demo_••••••••••••••••••••");

  const analyze = async (targetUrl?: string) => {
    const u = (targetUrl ?? url).trim();
    if (!u) return;
    setLoading(true);
    setResult(null);

    // Simulate API call with mock data
    await new Promise((r) => setTimeout(r, 1400));

    const normalized = u.startsWith("http") ? u : "https://" + u;
    const demo = DEMO_RESULTS[normalized] ?? {
      url: normalized,
      domain: normalized.replace(/https?:\/\//, "").split("/")[0],
      risk_score: Math.floor(Math.random() * 30),
      verdict: "LOW_RISK",
      elapsed_sec: (Math.random() * 2 + 0.8).toFixed(2),
      analysis_id: Math.random().toString(36).slice(2, 10),
      risk_reasons: ["No significant threat signals detected"],
      url_features: { uses_https: normalized.startsWith("https"), has_ip_host: false, subdomain_count: 0, url_length: normalized.length, keyword_hits: [], suspicious_tld: false },
      dns: { dns_resolves: true, dns_a_records: ["93.184.216.34"] },
      virustotal: { vt_available: true, vt_malicious: 0, vt_suspicious: 0, vt_harmless: 70, vt_total_engines: 87, vt_flagged_by: [] },
      urlhaus: { urlhaus_listed: false },
      greynoise: { gn_seen: false },
      whois: { whois_available: true, whois_registrar: "Unknown", whois_age_days: 1200, whois_newly_registered: false, whois_privacy_guard: false },
      ssl: { ssl_valid: true, ssl_issuer: "DigiCert", ssl_days_remaining: 180 },
    };

    setResult(demo);
    setLoading(false);
  };

  const cfg = result ? VERDICT_CONFIG[result.verdict as keyof typeof VERDICT_CONFIG] ?? VERDICT_CONFIG.CLEAN : null;

  return (
    <div className="min-h-screen pt-20 px-4 pb-20">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-4">
            <Zap className="w-3 h-3" /> Live demo — no API key needed
          </div>
          <h1 className="text-4xl font-black text-white mb-3">
            API <span className="gradient-text">Playground</span>
          </h1>
          <p className="text-slate-400 text-lg">
            Paste any URL and see a full analysis result. This is exactly what the API returns.
          </p>
        </div>

        {/* Input */}
        <div className="relative mb-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && analyze()}
                placeholder="https://suspicious-login-verify.tk/account"
                className="w-full pl-11 pr-4 py-4 bg-[#0d1117] border border-[#1e2433] hover:border-indigo-500/40 focus:border-indigo-500 rounded-xl text-white placeholder-slate-600 outline-none transition-colors terminal text-sm"
              />
            </div>
            <button
              onClick={() => analyze()}
              disabled={loading || !url}
              className="px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all flex items-center gap-2 min-w-[130px] justify-center"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Shield className="w-4 h-4" />}
              {loading ? "Analyzing…" : "Analyze"}
            </button>
          </div>
        </div>

        {/* Demo URL chips */}
        <div className="flex flex-wrap gap-2 mb-10">
          <span className="text-xs text-slate-500 py-1">Try:</span>
          {DEMO_URLS.map((u) => {
            const short = u.replace("https://", "").slice(0, 40) + (u.length > 47 ? "…" : "");
            const v = DEMO_RESULTS[u].verdict;
            const c = v === "MALICIOUS" ? "text-red-400 border-red-500/20 bg-red-500/5 hover:border-red-500/40"
                    : v === "SUSPICIOUS" ? "text-yellow-400 border-yellow-500/20 bg-yellow-500/5 hover:border-yellow-500/40"
                    : "text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40";
            return (
              <button
                key={u}
                onClick={() => { setUrl(u); analyze(u); }}
                className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${c}`}
              >
                {short}
              </button>
            );
          })}
        </div>

        {/* Loading skeleton */}
        {loading && (
          <div className="space-y-4">
            <div className="h-32 rounded-xl shimmer" />
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-20 rounded-xl shimmer" />)}
            </div>
            <div className="h-40 rounded-xl shimmer" />
          </div>
        )}

        {/* Results */}
        {result && !loading && (
          <div className="space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Top verdict card */}
            <div className={`p-6 rounded-xl border ${cfg?.bg} flex flex-col sm:flex-row items-start sm:items-center gap-6`}>
              <ScoreRing score={result.risk_score} verdict={result.verdict} />

              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Analyzed URL</p>
                    <p className="font-mono text-sm text-white break-all">{result.url}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-500">ID</p>
                    <p className="font-mono text-xs text-slate-400">{result.analysis_id}</p>
                  </div>
                </div>

                {result.risk_reasons.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-slate-500 mb-2">Risk signals:</p>
                    <ul className="space-y-1">
                      {result.risk_reasons.map((r: string, i: number) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300">
                          <span className="text-red-400 mt-0.5 shrink-0">▸</span> {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-4 flex items-center gap-4 text-xs text-slate-500">
                  <span>⏱ {result.elapsed_sec}s</span>
                  <span>🌐 {result.domain}</span>
                </div>
              </div>
            </div>

            {/* Tab switcher */}
            <div className="flex gap-2 border-b border-[#1e2433] pb-3">
              {(["visual", "json"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`px-4 py-2 text-sm rounded-lg font-medium transition-colors ${tab === t ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"}`}
                >
                  {t === "visual" ? "📊 Visual breakdown" : "{ } Raw JSON"}
                </button>
              ))}
            </div>

            {tab === "json" && <JsonBlock data={result} />}

            {tab === "visual" && (
              <div className="space-y-3">
                {/* Source summary cards */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <SourceBadge
                    label="VirusTotal"
                    value={result.virustotal.vt_malicious > 0 ? `${result.virustotal.vt_malicious} engines flagged` : `${result.virustotal.vt_harmless} engines clean`}
                    ok={result.virustotal.vt_malicious === 0}
                  />
                  <SourceBadge
                    label="URLhaus"
                    value={result.urlhaus.urlhaus_listed ? `Listed: ${result.urlhaus.urlhaus_threat}` : result.urlhaus.urlhaus_host_listed ? `Host: ${result.urlhaus.urlhaus_host_url_count} URLs` : "Not listed"}
                    ok={!result.urlhaus.urlhaus_listed && !result.urlhaus.urlhaus_host_listed}
                  />
                  <SourceBadge
                    label="GreyNoise"
                    value={result.greynoise.gn_seen ? `${result.greynoise.gn_classification}${result.greynoise.gn_name ? ` (${result.greynoise.gn_name})` : ""}` : "Not observed"}
                    ok={result.greynoise.gn_classification !== "malicious"}
                  />
                  <SourceBadge
                    label="WHOIS / Domain Age"
                    value={result.whois.whois_newly_registered ? `⚠ ${result.whois.whois_age_days} days old` : `${result.whois.whois_age_days} days old`}
                    ok={!result.whois.whois_newly_registered}
                  />
                  <SourceBadge
                    label="SSL Certificate"
                    value={result.ssl.ssl_valid ? `Valid · ${result.ssl.ssl_issuer} · ${result.ssl.ssl_days_remaining}d` : "Invalid / error"}
                    ok={result.ssl.ssl_valid}
                  />
                  <SourceBadge
                    label="DNS Resolution"
                    value={result.dns.dns_resolves ? result.dns.dns_a_records?.[0] ?? "Resolved" : "Does not resolve"}
                    ok={result.dns.dns_resolves}
                  />
                </div>

                {/* Detailed sections */}
                <Section title="VirusTotal Details" icon={<Shield className="w-4 h-4" />} defaultOpen={result.virustotal.vt_malicious > 0}>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    {[
                      { label: "Malicious", val: result.virustotal.vt_malicious, color: "text-red-400" },
                      { label: "Suspicious", val: result.virustotal.vt_suspicious, color: "text-yellow-400" },
                      { label: "Harmless", val: result.virustotal.vt_harmless, color: "text-emerald-400" },
                      { label: "Total engines", val: result.virustotal.vt_total_engines, color: "text-slate-400" },
                    ].map((s) => (
                      <div key={s.label} className="p-3 rounded-lg bg-[#050810] border border-[#1e2433] text-center">
                        <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{s.label}</div>
                      </div>
                    ))}
                  </div>
                  {result.virustotal.vt_flagged_by?.length > 0 && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1.5">Flagged by:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.virustotal.vt_flagged_by.map((v: string) => (
                          <span key={v} className="px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 text-xs">{v}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {result.virustotal.vt_url && (
                    <a href={result.virustotal.vt_url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 mt-2">
                      View on VirusTotal <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </Section>

                <Section title="URL Feature Analysis" icon={<Globe className="w-4 h-4" />}>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { k: "HTTPS", v: result.url_features.uses_https ? "Yes ✓" : "No ✗", ok: result.url_features.uses_https },
                      { k: "IP as hostname", v: result.url_features.has_ip_host ? "Yes ✗" : "No ✓", ok: !result.url_features.has_ip_host },
                      { k: "URL length", v: `${result.url_features.url_length} chars`, ok: result.url_features.url_length < 100 },
                      { k: "Punycode/IDN", v: result.url_features.is_punycode ? "Yes ✗" : "No ✓", ok: !result.url_features.is_punycode },
                      { k: "Suspicious TLD", v: result.url_features.suspicious_tld ? "Yes ✗" : "No ✓", ok: !result.url_features.suspicious_tld },
                      { k: "Subdomain levels", v: String(result.url_features.subdomain_count), ok: result.url_features.subdomain_count <= 1 },
                    ].map((r) => (
                      <div key={r.k} className="flex items-center justify-between p-2 rounded bg-[#050810] border border-[#1e2433]">
                        <span className="text-slate-500">{r.k}</span>
                        <span className={r.ok ? "text-emerald-400" : "text-red-400"}>{r.v}</span>
                      </div>
                    ))}
                  </div>
                  {result.url_features.keyword_hits?.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-500 mb-1.5">Suspicious keyword hits:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {result.url_features.keyword_hits.map((k: string) => (
                          <span key={k} className="px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs">{k}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </Section>

                <Section title="WHOIS & Domain Registration" icon={<Database className="w-4 h-4" />}>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { k: "Registrar", v: result.whois.whois_registrar },
                      { k: "Domain age", v: result.whois.whois_age_days ? `${result.whois.whois_age_days} days` : "Unknown" },
                      { k: "Newly registered", v: result.whois.whois_newly_registered ? "Yes ⚠" : "No ✓" },
                      { k: "Privacy guard", v: result.whois.whois_privacy_guard ? "Active ⚠" : "None ✓" },
                      { k: "Country", v: result.whois.whois_country ?? "Unknown" },
                    ].map((r) => (
                      <div key={r.k} className="flex items-center justify-between p-2 rounded bg-[#050810] border border-[#1e2433]">
                        <span className="text-slate-500">{r.k}</span>
                        <span className="text-slate-300 font-medium">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </Section>

                <Section title="SSL Certificate" icon={<Lock className="w-4 h-4" />}>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { k: "Valid", v: result.ssl.ssl_valid ? "Yes ✓" : "No ✗" },
                      { k: "Issuer", v: result.ssl.ssl_issuer ?? "Unknown" },
                      { k: "Common Name", v: result.ssl.ssl_cn ?? "N/A" },
                      { k: "Days remaining", v: result.ssl.ssl_days_remaining ? `${result.ssl.ssl_days_remaining} days` : "N/A" },
                      { k: "Free cert", v: result.ssl.ssl_free_cert ? "Yes (Let's Encrypt / ZeroSSL)" : "No" },
                    ].map((r) => (
                      <div key={r.k} className="flex items-center justify-between p-2 rounded bg-[#050810] border border-[#1e2433]">
                        <span className="text-slate-500">{r.k}</span>
                        <span className="text-slate-300 font-medium">{r.v}</span>
                      </div>
                    ))}
                  </div>
                </Section>
              </div>
            )}

            {/* Get API key CTA */}
            <div className="p-5 rounded-xl border border-indigo-500/20 bg-indigo-500/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white mb-0.5">Want to use this in your app?</p>
                <p className="text-xs text-slate-400">Get a free API key — 50 analyses/day, no credit card.</p>
              </div>
              <a
                href="/pricing"
                className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-lg transition-all"
              >
                Get free API key <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!result && !loading && (
          <div className="text-center py-16 text-slate-600">
            <Shield className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-sm">Enter a URL above or click one of the example URLs to see a live result.</p>
          </div>
        )}
      </div>
    </div>
  );
}
