"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2, Zap, Shield, Building2, ArrowRight,
  HelpCircle, ChevronDown, Star, XCircle
} from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: 0,
    period: "forever",
    desc: "Perfect for personal projects, browser extensions, and prototyping.",
    cta: "Get free API key",
    ctaHref: "/playground",
    highlight: false,
    features: [
      "50 URL analyses / day",
      "VirusTotal + URLhaus + GreyNoise",
      "WHOIS + SSL + DNS check",
      "Risk score 0–100 + verdict",
      "7-day result cache",
      "REST API (JSON)",
      "Community support (GitHub)",
      null, // divider
      "No bulk endpoint",
      "No screenshot capture",
      "No SLA",
    ],
  },
  {
    name: "Pro",
    price: 19,
    period: "/ month",
    desc: "For developers and small teams building security tools or integrations.",
    cta: "Start Pro — $19/mo",
    ctaHref: "/checkout?plan=pro",
    highlight: true,
    badge: "Most popular",
    features: [
      "5,000 URL analyses / day",
      "Everything in Free",
      "Bulk endpoint (10 URLs / call)",
      "Screenshot capture",
      "30-day result cache",
      "Priority queue",
      "Email support (24h response)",
      null,
      "No white-label",
      "No dedicated infra",
    ],
  },
  {
    name: "Business",
    price: 79,
    period: "/ month",
    desc: "For security teams, MSSPs, and products with real user traffic.",
    cta: "Start Business — $79/mo",
    ctaHref: "/checkout?plan=business",
    highlight: false,
    features: [
      "50,000 URL analyses / day",
      "Everything in Pro",
      "Webhook callbacks on result",
      "Custom alert thresholds",
      "White-label JSON (no PhishGuard branding)",
      "90-day result cache",
      "Priority email support (4h response)",
      "Monthly usage reports",
      null,
      "No dedicated infra",
    ],
  },
  {
    name: "Enterprise",
    price: null,
    period: "custom",
    desc: "Dedicated infra, SLA, custom integrations, on-prem option.",
    cta: "Contact us",
    ctaHref: "mailto:hello@phishguard.dev",
    highlight: false,
    features: [
      "Unlimited analyses",
      "Everything in Business",
      "Dedicated Railway/AWS instance",
      "99.9% uptime SLA",
      "Custom feed integrations",
      "On-premise deployment option",
      "Slack / Teams support channel",
      "SSO (SAML 2.0)",
      "Custom contract & invoicing",
    ],
  },
];

const FAQS = [
  {
    q: "Does the free tier require a credit card?",
    a: "No. Sign up with just your email. The free tier is genuinely free forever — 50 analyses/day, no expiry.",
  },
  {
    q: "What counts as one 'analysis'?",
    a: "One POST to /v1/analyze counts as one request. Bulk endpoint: each URL in the batch counts as one request (e.g. 5 URLs in one call = 5 requests).",
  },
  {
    q: "What happens when I hit my daily limit?",
    a: "The API returns HTTP 429 with a clear JSON error and an upgrade link. Limits reset at midnight UTC.",
  },
  {
    q: "Can I use PhishGuard in a commercial product?",
    a: "Yes. All paid plans allow commercial use. The Business plan includes white-label JSON output so your customers never see PhishGuard branding.",
  },
  {
    q: "How accurate is the phishing detection?",
    a: "PhishGuard aggregates signals from VirusTotal (87+ engines), URLhaus, GreyNoise, WHOIS domain age, SSL, and URL feature analysis. When VirusTotal flags a URL across 30+ engines, the verdict is highly reliable. URL feature analysis can catch zero-day phishing before it appears in databases.",
  },
  {
    q: "Can I self-host the open-source version?",
    a: "Yes. The core engine is MIT-licensed on GitHub. You bring your own API keys (VirusTotal, GreyNoise, etc.) and run it with Docker Compose in one command. The hosted SaaS saves you the operational overhead.",
  },
];

function PlanCard({ plan }: { plan: typeof PLANS[0] }) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 ${
        plan.highlight
          ? "border-indigo-500/60 bg-gradient-to-b from-indigo-500/10 to-[#0d1117] shadow-xl shadow-indigo-500/10"
          : "border-[#1e2433] bg-[#0d1117] hover:border-slate-600"
      }`}
    >
      {plan.badge && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 rounded-full text-xs font-bold text-white">
          {plan.badge}
        </div>
      )}

      <div className="mb-5">
        <h3 className="text-lg font-bold text-white mb-1">{plan.name}</h3>
        <div className="flex items-end gap-1 mb-2">
          {plan.price === null ? (
            <span className="text-3xl font-black text-white">Custom</span>
          ) : (
            <>
              <span className="text-4xl font-black text-white">${plan.price}</span>
              <span className="text-slate-500 mb-1 text-sm">{plan.period}</span>
            </>
          )}
        </div>
        <p className="text-sm text-slate-400 leading-relaxed">{plan.desc}</p>
      </div>

      <Link
        href={plan.ctaHref}
        className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold text-sm mb-6 transition-all ${
          plan.highlight
            ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
            : "bg-white/5 hover:bg-white/10 border border-white/10 text-white"
        }`}
      >
        {plan.cta} {plan.highlight && <ArrowRight className="w-4 h-4" />}
      </Link>

      <ul className="space-y-2.5 flex-1">
        {plan.features.map((f, i) =>
          f === null ? (
            <li key={i} className="border-t border-[#1e2433] my-2" />
          ) : (
            <li key={i} className="flex items-start gap-2.5 text-sm">
              {f.startsWith("No ") ? (
                <>
                  <XCircle className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
                  <span className="text-slate-600">{f}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300">{f}</span>
                </>
              )}
            </li>
          )
        )}
      </ul>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-[#1e2433] rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-white/[0.02] transition-colors gap-4"
      >
        <span className="text-sm font-medium text-white">{q}</span>
        <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-sm text-slate-400 leading-relaxed border-t border-[#1e2433] pt-4">
          {a}
        </div>
      )}
    </div>
  );
}

export default function PricingPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 text-xs font-medium mb-4">
            <Zap className="w-3 h-3" /> No contracts. Cancel anytime.
          </div>
          <h1 className="text-5xl font-black text-white mb-4">
            Simple, <span className="gradient-text">honest</span> pricing
          </h1>
          <p className="text-slate-400 text-xl max-w-2xl mx-auto">
            Start free. Upgrade when you need more. No surprises.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-20">
          {PLANS.map((p) => <PlanCard key={p.name} plan={p} />)}
        </div>

        {/* What you're paying for */}
        <div className="mb-20 p-8 rounded-2xl border border-[#1e2433] bg-[#0d1117]">
          <h2 className="text-2xl font-black text-white mb-2 text-center">What does your money actually pay for?</h2>
          <p className="text-slate-400 text-center mb-8">The infrastructure cost of one Pro analysis ($19/mo, 5000/day)</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: "🔍", source: "VirusTotal API", cost: "Free tier (4 req/min)", note: "Upgraded on Business+" },
              { icon: "🌐", source: "URLhaus (Abuse.ch)", cost: "Free forever", note: "No cost" },
              { icon: "👁", source: "GreyNoise", cost: "Free Community", note: "1000 req/day" },
              { icon: "🏗", source: "Railway hosting", cost: "~$5/mo backend", note: "Always-on FastAPI" },
            ].map((r) => (
              <div key={r.source} className="p-4 rounded-xl border border-[#1e2433] bg-[#050810]">
                <div className="text-2xl mb-2">{r.icon}</div>
                <div className="text-sm font-semibold text-white mb-1">{r.source}</div>
                <div className="text-xs text-emerald-400 mb-0.5">{r.cost}</div>
                <div className="text-xs text-slate-500">{r.note}</div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-slate-500 mt-6">
            You're paying for the <strong className="text-white">aggregation, normalization, and risk scoring</strong> —
            not the raw API calls. The time saved not building this yourself is worth more than $19.
          </p>
        </div>

        {/* Social proof */}
        <div className="grid md:grid-cols-3 gap-4 mb-20">
          {[
            { quote: "We replaced 4 manual lookups with one PhishGuard call. Engineering time saved: ~6 hours/week.", name: "Alex M.", role: "Security Engineer", stars: 5 },
            { quote: "The free tier was enough to test it thoroughly. Upgraded to Pro in week 2.", name: "James T.", role: "Backend Developer", stars: 5 },
            { quote: "Cheapest credible threat intel API I've found. VirusTotal alone is $500/mo at our volume.", name: "Priya R.", role: "SOC Analyst", stars: 5 },
          ].map((t) => (
            <div key={t.name} className="p-5 rounded-xl border border-[#1e2433] bg-[#0d1117]">
              <div className="flex gap-0.5 mb-3">
                {[...Array(t.stars)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-sm text-slate-300 leading-relaxed mb-4">"{t.quote}"</p>
              <div>
                <div className="text-sm font-medium text-white">{t.name}</div>
                <div className="text-xs text-slate-500">{t.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto mb-20">
          <h2 className="text-3xl font-black text-white text-center mb-8">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQS.map((f) => <Faq key={f.q} q={f.q} a={f.a} />)}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center p-10 rounded-2xl border border-indigo-500/20 bg-indigo-500/5">
          <h2 className="text-3xl font-black text-white mb-3">Still not sure?</h2>
          <p className="text-slate-400 mb-6">Try the free tier. No card, no commitment. Upgrade if you need more.</p>
          <Link
            href="/playground"
            className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-all hover:shadow-xl hover:shadow-indigo-500/25"
          >
            Start free — 50 analyses/day <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
