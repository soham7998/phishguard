"use client";
import { useState } from "react";
import { Copy, Check, ChevronDown, ChevronRight, Terminal, Zap, Shield } from "lucide-react";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="relative rounded-xl border border-[#1e2433] bg-[#050810] overflow-hidden my-4">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e2433] bg-[#0a0e18]">
        <span className="text-xs text-slate-500 terminal">{lang}</span>
        <button onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
          className="flex items-center gap-1 text-xs text-slate-500 hover:text-white transition-colors">
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="terminal text-xs text-slate-300 p-4 overflow-x-auto leading-relaxed">{code}</pre>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="text-2xl font-black text-white mb-6 pb-3 border-b border-[#1e2433]">{title}</h2>
      {children}
    </section>
  );
}

function Endpoint({ method, path, desc }: { method: string; path: string; desc: string }) {
  const colors: Record<string, string> = {
    POST: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    GET:  "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    DELETE: "bg-red-500/20 text-red-300 border-red-500/30",
  };
  return (
    <div className="flex items-start gap-3 p-4 rounded-lg border border-[#1e2433] bg-[#0d1117] mb-3">
      <span className={`px-2 py-0.5 rounded text-xs font-bold border terminal shrink-0 ${colors[method] ?? ""}`}>{method}</span>
      <div>
        <code className="text-sm text-white terminal">{path}</code>
        <p className="text-xs text-slate-500 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

const NAV = [
  { id: "quickstart", label: "Quickstart" },
  { id: "authentication", label: "Authentication" },
  { id: "analyze", label: "POST /v1/analyze" },
  { id: "bulk", label: "POST /v1/analyze/bulk" },
  { id: "result", label: "GET /v1/result/{id}" },
  { id: "usage", label: "GET /v1/usage" },
  { id: "response", label: "Response schema" },
  { id: "verdicts", label: "Verdicts & scoring" },
  { id: "errors", label: "Error codes" },
  { id: "sdks", label: "SDKs & examples" },
  { id: "rate-limits", label: "Rate limits" },
];

export default function DocsPage() {
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 flex gap-10">

        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-24 h-fit py-6">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">API Reference</p>
          <nav className="space-y-0.5">
            {NAV.map((n) => (
              <a key={n.id} href={`#${n.id}`}
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                {n.label}
              </a>
            ))}
          </nav>
          <div className="mt-6 p-3 rounded-lg border border-indigo-500/20 bg-indigo-500/5">
            <p className="text-xs text-indigo-300 font-medium mb-1">Interactive</p>
            <a href="/playground" className="text-xs text-slate-400 hover:text-white transition-colors">
              Try in Playground →
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 py-8 pb-20">
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-4">
              <Terminal className="w-3 h-3" /> API v1.0
            </div>
            <h1 className="text-4xl font-black text-white mb-3">API Reference</h1>
            <p className="text-slate-400 text-lg">
              Base URL: <code className="terminal text-indigo-300 text-sm bg-indigo-500/10 px-2 py-0.5 rounded">https://api.phishguard.dev</code>
            </p>
          </div>

          {/* Quickstart */}
          <Section id="quickstart" title="⚡ Quickstart">
            <p className="text-slate-400 mb-4">Analyze your first URL in under 2 minutes.</p>
            <div className="grid md:grid-cols-3 gap-3 mb-6">
              {["1. Get your free API key at /pricing", "2. Copy the key (shown once)", "3. Make your first request"].map((s, i) => (
                <div key={i} className="p-4 rounded-xl border border-[#1e2433] bg-[#0d1117] text-sm text-slate-400">
                  {s}
                </div>
              ))}
            </div>
            <CodeBlock lang="bash" code={`curl -X POST https://api.phishguard.dev/v1/analyze \\
  -H "X-API-Key: pg_your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://suspicious-site.tk/login"}'`} />
            <CodeBlock lang="json" code={`{
  "analysis_id": "a3f9c12b",
  "url":         "https://suspicious-site.tk/login",
  "domain":      "suspicious-site.tk",
  "risk_score":  87,
  "verdict":     "MALICIOUS",
  "risk_reasons": [
    "VirusTotal: 24 engines flagged as malicious",
    "Suspicious TLD: .tk",
    "Domain registered 5 days ago (newly registered)"
  ],
  "elapsed_sec": 1.72,
  "analyzed_at": "2026-10-19T11:23:43Z"
}`} />
          </Section>

          {/* Authentication */}
          <Section id="authentication" title="🔑 Authentication">
            <p className="text-slate-400 mb-4">
              All requests must include your API key in the <code className="terminal text-indigo-300 text-sm bg-indigo-500/10 px-1.5 py-0.5 rounded">X-API-Key</code> header.
              Never put your API key in a URL query parameter.
            </p>
            <CodeBlock lang="bash" code={`# Correct ✓
curl -H "X-API-Key: pg_your_key" https://api.phishguard.dev/v1/analyze

# Wrong ✗ — key visible in logs, browser history, etc.
curl https://api.phishguard.dev/v1/analyze?api_key=pg_your_key`} />
            <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 text-sm text-yellow-300">
              ⚠ API keys start with <code className="terminal">pg_</code> and are 47 characters long. They are stored as SHA-256 hashes — if you lose yours, you must generate a new one.
            </div>
          </Section>

          {/* Analyze */}
          <Section id="analyze" title="POST /v1/analyze">
            <Endpoint method="POST" path="/v1/analyze" desc="Analyze a single URL. Returns risk score, verdict, and full source data." />
            <h3 className="text-sm font-semibold text-slate-300 mb-2 mt-5">Request body</h3>
            <div className="rounded-xl border border-[#1e2433] overflow-hidden mb-4">
              <table className="w-full text-sm terminal">
                <thead><tr className="border-b border-[#1e2433] bg-[#0a0e18]">
                  <th className="px-4 py-2.5 text-left text-xs text-slate-400">Parameter</th>
                  <th className="px-4 py-2.5 text-left text-xs text-slate-400">Type</th>
                  <th className="px-4 py-2.5 text-left text-xs text-slate-400">Required</th>
                  <th className="px-4 py-2.5 text-left text-xs text-slate-400">Description</th>
                </tr></thead>
                <tbody>
                  {[
                    ["url", "string", "✓ Yes", "URL to analyze. Scheme (https://) added automatically if missing."],
                    ["include_screenshot", "boolean", "No", "Capture a screenshot (default: false). Requires Pro+."],
                  ].map(([p, t, r, d]) => (
                    <tr key={String(p)} className="border-b border-[#1e2433] last:border-0">
                      <td className="px-4 py-3 text-indigo-300">{p}</td>
                      <td className="px-4 py-3 text-slate-500">{t}</td>
                      <td className="px-4 py-3 text-slate-500">{r}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{d}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CodeBlock lang="python" code={`import requests

response = requests.post(
    "https://api.phishguard.dev/v1/analyze",
    headers={"X-API-Key": "pg_your_key"},
    json={"url": "https://paypal-secure-update.tk/verify"}
)
data = response.json()
print(f"Score: {data['risk_score']} | Verdict: {data['verdict']}")`} />
            <CodeBlock lang="javascript" code={`const res = await fetch("https://api.phishguard.dev/v1/analyze", {
  method: "POST",
  headers: {
    "X-API-Key": "pg_your_key",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ url: "https://paypal-secure-update.tk/verify" })
});
const data = await res.json();
console.log(data.verdict); // "MALICIOUS"`} />
          </Section>

          {/* Bulk */}
          <Section id="bulk" title="POST /v1/analyze/bulk">
            <Endpoint method="POST" path="/v1/analyze/bulk" desc="Analyze up to 10 URLs in one request. Pro+ only." />
            <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5 text-sm text-indigo-300 mb-4">
              💡 Pro plan required. Each URL counts as one request toward your daily limit.
            </div>
            <CodeBlock lang="json" code={`// Request
{
  "urls": [
    "https://suspicious-login.tk/verify",
    "https://amazon-prize-winner.online/claim",
    "https://github.com"
  ]
}

// Response
{
  "count": 3,
  "results": [
    { "url": "...", "risk_score": 94, "verdict": "MALICIOUS", ... },
    { "url": "...", "risk_score": 78, "verdict": "MALICIOUS", ... },
    { "url": "...", "risk_score": 2,  "verdict": "CLEAN",     ... }
  ]
}`} />
          </Section>

          {/* Result */}
          <Section id="result" title="GET /v1/result/{id}">
            <Endpoint method="GET" path="/v1/result/{analysis_id}" desc="Retrieve a cached result by analysis ID." />
            <CodeBlock lang="bash" code={`curl https://api.phishguard.dev/v1/result/a3f9c12b \\
  -H "X-API-Key: pg_your_key"

# Returns the full analysis result (cached 7–90 days depending on plan)`} />
          </Section>

          {/* Usage */}
          <Section id="usage" title="GET /v1/usage">
            <Endpoint method="GET" path="/v1/usage" desc="Check your API key's usage stats and remaining quota." />
            <CodeBlock lang="json" code={`{
  "plan":            "pro",
  "daily_limit":     5000,
  "today_used":      142,
  "today_remaining": 4858,
  "total_30d":       3241,
  "resets_at":       "midnight UTC"
}`} />
          </Section>

          {/* Response schema */}
          <Section id="response" title="📦 Full response schema">
            <CodeBlock lang="json" code={`{
  "analysis_id":   "string   — unique ID, cacheable for 7–90 days",
  "url":           "string   — normalized URL analyzed",
  "domain":        "string   — extracted domain",
  "risk_score":    "integer  — 0 to 100",
  "verdict":       "string   — CLEAN | LOW_RISK | SUSPICIOUS | MALICIOUS",
  "risk_reasons":  "string[] — human-readable signals that drove the score",
  "analyzed_at":   "string   — ISO 8601 UTC timestamp",
  "elapsed_sec":   "float    — total analysis time in seconds",

  "url_features": {
    "uses_https":       "boolean",
    "has_ip_host":      "boolean",
    "subdomain_count":  "integer",
    "url_length":       "integer",
    "keyword_hits":     "string[]",
    "suspicious_tld":   "boolean",
    "is_punycode":      "boolean",
    "has_at_sign":      "boolean"
  },

  "dns": {
    "dns_resolves":   "boolean",
    "dns_a_records":  "string[]",
    "dns_mx_records": "string[]",
    "dns_ns_records": "string[]",
    "dns_ip":         "string"
  },

  "virustotal": {
    "vt_available":      "boolean",
    "vt_malicious":      "integer",
    "vt_suspicious":     "integer",
    "vt_harmless":       "integer",
    "vt_total_engines":  "integer",
    "vt_flagged_by":     "string[]",
    "vt_categories":     "string[]",
    "vt_reputation":     "integer",
    "vt_url":            "string"
  },

  "urlhaus": {
    "urlhaus_listed":       "boolean",
    "urlhaus_threat":       "string",
    "urlhaus_url_status":   "string",
    "urlhaus_date_added":   "string",
    "urlhaus_tags":         "string[]"
  },

  "greynoise": {
    "gn_seen":           "boolean",
    "gn_classification": "string — malicious | benign | unknown",
    "gn_noise":          "boolean",
    "gn_riot":           "boolean",
    "gn_name":           "string | null"
  },

  "whois": {
    "whois_available":        "boolean",
    "whois_registrar":        "string",
    "whois_creation_date":    "string",
    "whois_age_days":         "integer",
    "whois_newly_registered": "boolean",
    "whois_privacy_guard":    "boolean",
    "whois_country":          "string"
  },

  "ssl": {
    "ssl_valid":          "boolean",
    "ssl_issuer":         "string",
    "ssl_cn":             "string",
    "ssl_days_remaining": "integer",
    "ssl_expiring_soon":  "boolean",
    "ssl_free_cert":      "boolean"
  },

  "screenshot_url": "string | null"
}`} />
          </Section>

          {/* Verdicts */}
          <Section id="verdicts" title="🎯 Verdicts & scoring">
            <div className="grid sm:grid-cols-2 gap-3 mb-6">
              {[
                { v: "CLEAN",      range: "0–14",   color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/5", desc: "No significant threat signals. Safe to proceed." },
                { v: "LOW_RISK",   range: "15–39",  color: "text-indigo-400 border-indigo-500/30 bg-indigo-500/5",   desc: "Minor signals (e.g. free TLD, short domain age). Worth monitoring." },
                { v: "SUSPICIOUS", range: "40–69",  color: "text-yellow-400 border-yellow-500/30 bg-yellow-500/5",  desc: "Multiple signals align. Investigate before allowing." },
                { v: "MALICIOUS",  range: "70–100", color: "text-red-400 border-red-500/30 bg-red-500/5",           desc: "Strong multi-source confirmation. Block immediately." },
              ].map((b) => (
                <div key={b.v} className={`p-4 rounded-xl border ${b.color}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-sm terminal">{b.v}</span>
                    <span className="text-xs opacity-70">Score {b.range}</span>
                  </div>
                  <p className="text-xs opacity-80">{b.desc}</p>
                </div>
              ))}
            </div>
            <h3 className="text-sm font-semibold text-white mb-3">Score contribution by source (max points)</h3>
            <div className="space-y-2">
              {[
                { src: "VirusTotal", pts: 40, color: "bg-indigo-500" },
                { src: "URLhaus",    pts: 30, color: "bg-purple-500" },
                { src: "GreyNoise",  pts: 20, color: "bg-cyan-500" },
                { src: "URL features (homograph, TLD, keywords…)", pts: 25, color: "bg-orange-500" },
                { src: "WHOIS (domain age, privacy guard)", pts: 15, color: "bg-yellow-500" },
                { src: "SSL (invalid cert, expiry)", pts: 15, color: "bg-red-500" },
              ].map((s) => (
                <div key={s.src} className="flex items-center gap-3">
                  <div className="w-48 text-xs text-slate-400 shrink-0">{s.src}</div>
                  <div className="flex-1 bg-[#1e2433] rounded-full h-2">
                    <div className={`${s.color} h-2 rounded-full`} style={{ width: `${(s.pts / 40) * 100}%` }} />
                  </div>
                  <div className="text-xs text-slate-500 w-12 text-right">max {s.pts}pts</div>
                </div>
              ))}
            </div>
          </Section>

          {/* Errors */}
          <Section id="errors" title="⚠ Error codes">
            <div className="rounded-xl border border-[#1e2433] overflow-hidden">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#1e2433] bg-[#0a0e18]">
                  <th className="px-4 py-3 text-left text-xs text-slate-400">HTTP</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400">error code</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400">Meaning</th>
                </tr></thead>
                <tbody>
                  {[
                    ["401", "missing_api_key",       "No X-API-Key header provided"],
                    ["401", "invalid_api_key",       "Key not found or revoked"],
                    ["403", "plan_restriction",      "Feature requires a higher plan"],
                    ["422", "validation_error",      "Invalid request body (bad URL, etc.)"],
                    ["429", "rate_limit_exceeded",   "Daily limit reached. Resets midnight UTC."],
                    ["500", "internal_error",        "Server error — retry with backoff"],
                  ].map(([code, err, msg]) => (
                    <tr key={String(err)} className="border-b border-[#1e2433] last:border-0">
                      <td className="px-4 py-3 terminal text-yellow-400">{code}</td>
                      <td className="px-4 py-3 terminal text-red-400 text-xs">{err}</td>
                      <td className="px-4 py-3 text-slate-400 text-xs">{msg}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* SDKs */}
          <Section id="sdks" title="📦 SDKs & examples">
            <div className="grid sm:grid-cols-3 gap-3 mb-6">
              {[
                { lang: "Python", pip: "pip install phishguard" },
                { lang: "Node.js", pip: "npm install phishguard" },
                { lang: "PHP", pip: "composer require phishguard/client" },
              ].map((s) => (
                <div key={s.lang} className="p-4 rounded-xl border border-[#1e2433] bg-[#0d1117]">
                  <div className="font-semibold text-white text-sm mb-2">{s.lang}</div>
                  <code className="text-xs text-indigo-300 terminal">{s.pip}</code>
                  <div className="text-xs text-slate-500 mt-1">Coming soon</div>
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-400">Until SDKs are released, use the REST API directly. All examples on this page are copy-paste ready.</p>
          </Section>

          {/* Rate limits */}
          <Section id="rate-limits" title="🚦 Rate limits">
            <div className="rounded-xl border border-[#1e2433] overflow-hidden mb-4">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-[#1e2433] bg-[#0a0e18]">
                  <th className="px-4 py-3 text-left text-xs text-slate-400">Plan</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400">Daily limit</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400">Burst limit</th>
                  <th className="px-4 py-3 text-left text-xs text-slate-400">Bulk endpoint</th>
                </tr></thead>
                <tbody>
                  {[
                    ["Free",       "50 / day",      "30 / min",  "✗"],
                    ["Pro",        "5,000 / day",   "60 / min",  "✓"],
                    ["Business",   "50,000 / day",  "120 / min", "✓"],
                    ["Enterprise", "Unlimited",     "Custom",    "✓"],
                  ].map(([plan, daily, burst, bulk]) => (
                    <tr key={String(plan)} className="border-b border-[#1e2433] last:border-0">
                      <td className="px-4 py-3 text-white font-medium">{plan}</td>
                      <td className="px-4 py-3 text-slate-400 terminal text-xs">{daily}</td>
                      <td className="px-4 py-3 text-slate-400 terminal text-xs">{burst}</td>
                      <td className="px-4 py-3 text-slate-400">{bulk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-sm text-slate-400">Daily limits reset at <strong className="text-white">midnight UTC</strong>. When exceeded, the API returns HTTP 429 with a <code className="terminal text-xs text-indigo-300">retry_after</code> hint.</p>
          </Section>
        </main>
      </div>
    </div>
  );
}
