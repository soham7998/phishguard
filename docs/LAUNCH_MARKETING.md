# PhishGuard — Launch Marketing Copy

---

## 🚀 Product Hunt Launch

**Tagline (60 chars):**
> Detect phishing URLs in one API call — free tier, no card

**Description (260 chars):**
> PhishGuard fuses VirusTotal, URLhaus, GreyNoise, WHOIS, SSL & DNS into one REST API call. Submit any URL → get a 0–100 risk score + MALICIOUS/SUSPICIOUS/CLEAN verdict + human-readable reasons. Open-source core. Free tier: 50 analyses/day forever.

**First comment (post immediately after launch):**
> Hey PH! 👋 I'm Soham, a cybersecurity enthusiast and SIEM engineer who built this after spending hours each week manually checking URLs across 5+ different tools during threat intel work.
>
> The problem: VirusTotal is great, but you still need to check URLhaus, WHOIS domain age, GreyNoise, SSL validity… separately. Context-switching kills you.
>
> PhishGuard does all of this in one POST request and gives you a single risk score + plain-English reasons. Built on the same enrichment pipeline I use in SentinelTI (my thesis project).
>
> **Free tier is genuinely free** — 50 analyses/day, no expiry, no card.
>
> Would love your feedback on:
> - What other sources should I add? (IPQS? Safe Browsing?)
> - What SDKs do you need first — Python or Node?
> - What's missing from the API response?
>
> Happy to answer anything! 🙏

**Gallery images needed:**
1. Hero: terminal showing MALICIOUS verdict
2. Playground screenshot (side by side: input URL → full result)
3. Architecture diagram
4. Pricing comparison table

---

## 🟠 Hacker News — Show HN

**Title:**
> Show HN: PhishGuard – Phishing URL analyzer API (VirusTotal + URLhaus + WHOIS + SSL in one call)

**Body:**
> I built PhishGuard after noticing that detecting phishing URLs reliably requires checking 5-7 different sources. VirusTotal catches known malware but misses brand-new domains. URLhaus has different coverage. WHOIS domain age (newly registered = red flag) isn't in either. SSL and URL feature analysis (homograph/punycode domains, suspicious TLDs) add more signal still.
>
> PhishGuard runs all of these in parallel and returns:
> - A 0–100 risk score
> - A CLEAN / LOW_RISK / SUSPICIOUS / MALICIOUS verdict
> - Human-readable reasons ("Domain registered 3 days ago", "31 VT engines flagged")
>
> **Tech stack:** FastAPI (Python) + MongoDB + Next.js. Deployed on Railway + Vercel.
>
> **Sources fused:**
> - VirusTotal (87+ AV engines)
> - URLhaus (Abuse.ch malware URL feed)
> - GreyNoise (IP classification)
> - WHOIS (domain age, registrar, privacy guard)
> - SSL cert check (validity, issuer, expiry)
> - DNS (A/MX/NS records)
> - URL feature analysis (punycode, suspicious TLDs, keyword hits)
>
> The core engine is MIT-licensed. Self-host with `docker-compose up`. Free hosted tier: 50 req/day.
>
> Demo: https://phishguard.dev/playground
> GitHub: https://github.com/yourusername/phishguard
>
> Would love feedback on what sources to add next — IPQS, Google Safe Browsing, or something else?

---

## 💼 LinkedIn Post

**Hook line:**
> I spent 3 hours a week manually checking URLs across 5 different security tools. So I built an API that does it in 1.8 seconds.

**Full post:**
> 🛡️ Launching PhishGuard today — a phishing URL analyzer API I built as a cybersecurity enthusiast and SIEM engineer.
>
> **The problem I was solving:**
> When you want to know if a URL is phishing, you have to check:
> → VirusTotal (87+ engines)
> → URLhaus (Abuse.ch malware feed)
> → WHOIS (is this domain 2 days old?)
> → GreyNoise (is the IP a known scanner?)
> → SSL (self-signed? expired?)
> → URL itself (punycode? suspicious TLD? login keywords?)
>
> That's 6 tabs, 6 API calls, 6 results to mentally fuse into one verdict.
>
> **What PhishGuard does:**
> One POST request → all 6 checks run in parallel → one risk score (0–100) + verdict + reasons.
>
> ```
> POST /v1/analyze
> {"url": "https://paypal-secure-login.tk/verify"}
>
> → risk_score: 94
> → verdict: "MALICIOUS"
> → reasons: ["31 VT engines flagged", "Domain: 3 days old", "Suspicious TLD: .tk"]
> ```
>
> **Free tier:** 50 analyses/day, no credit card, forever.
>
> Open-source core on GitHub. Hosted API at phishguard.dev.
>
> If you work in security, build security tools, or are just tired of manually checking URLs — give it a try. Feedback welcome 🙏
>
> 🔗 https://phishguard.dev
>
> #cybersecurity #api #phishing #threatintelligence #buildinpublic #opensource

---

## 🟥 Reddit — r/netsec

**Title:**
> PhishGuard: open-source phishing URL analyzer API — fuses VirusTotal + URLhaus + GreyNoise + WHOIS + SSL into one risk score

**Body:**
> Hey r/netsec,
>
> I built PhishGuard to solve a workflow problem: to reliably classify a suspicious URL as phishing or clean, you need to check multiple sources that have non-overlapping coverage. VirusTotal misses newly registered domains. URLhaus has different feeds. WHOIS domain age is a strong signal that none of the above expose cleanly. SSL validity and URL feature analysis (punycode homographs, suspicious TLDs, keyword density) add further signal.
>
> **What it does:**
> - Runs 7 checks in parallel: VirusTotal, URLhaus, GreyNoise, WHOIS, SSL, DNS, URL features
> - Returns a 0–100 risk score + CLEAN/LOW_RISK/SUSPICIOUS/MALICIOUS verdict
> - Returns human-readable reasons for the score
> - Full source data (all VT results, WHOIS fields, SSL cert details, etc.)
>
> **Why it might be useful:**
> - Security teams doing phishing triage (replace 6 browser tabs with 1 API call)
> - Email gateways / link scanners
> - Browser extensions
> - SOC automation workflows
>
> **Stack:** FastAPI + MongoDB + Next.js. MIT licensed. Self-hostable with Docker Compose in one command.
>
> Free hosted tier: 50 req/day, no card.
>
> Playground (no key needed): https://phishguard.dev/playground
> GitHub: https://github.com/yourusername/phishguard
>
> Curious what additional sources the community would want — IPQS, OpenPhish, Google Safe Browsing?

---

## 🐦 Twitter/X Thread

**Tweet 1 (hook):**
> 🛡️ Launched PhishGuard today — a phishing URL analyzer API
>
> Submit any URL → get a risk score + MALICIOUS/SUSPICIOUS/CLEAN verdict in <2s
>
> One call. 7 sources. Free tier.
>
> 🧵 How it works:

**Tweet 2:**
> The problem: checking if a URL is phishing requires 6+ different tools
>
> → VirusTotal ✓
> → URLhaus ✓
> → WHOIS (domain age) ✓
> → GreyNoise ✓
> → SSL validity ✓
> → URL feature analysis ✓
>
> PhishGuard does all of this in one POST request

**Tweet 3:**
> ```
> curl -X POST api.phishguard.dev/v1/analyze \
>   -H "X-API-Key: pg_your_key" \
>   -d '{"url":"https://paypal-secure-login.tk"}'
>
> → risk_score: 94
> → verdict: "MALICIOUS"
> → "31 VT engines flagged"
> → "Domain: 3 days old"
> → "Suspicious TLD: .tk"
> ```

**Tweet 4:**
> Free tier: 50 analyses/day forever. No credit card.
>
> Pro ($19/mo): 5,000/day + bulk endpoint
>
> Open-source core on GitHub (MIT license) — self-host with docker-compose up
>
> 👉 phishguard.dev

---

## 📧 Cold email template (for security tool directories / newsletters)

**Subject:** New open-source phishing URL API — free tier, one-command self-host

**Body:**
> Hi [Name],
>
> I launched PhishGuard this week — a phishing URL analyzer API that fuses VirusTotal, URLhaus, GreyNoise, WHOIS domain age, SSL validation, and URL feature analysis into one REST call.
>
> Submit a URL → get a 0–100 risk score + MALICIOUS/SUSPICIOUS/CLEAN verdict + reasons. Under 2 seconds.
>
> Free tier: 50 analyses/day, no card. Open-source core on GitHub (MIT).
>
> Live demo: https://phishguard.dev/playground
>
> Would this be worth a mention in [newsletter/directory]? Happy to provide more details or a write-up.
>
> Best,
> Soham
