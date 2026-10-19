# 🛡️ PhishGuard — Phishing URL Analyzer API

[![MIT License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/python-3.12-blue?style=flat-square&logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![Docker](https://img.shields.io/badge/docker-compose-2496ED?style=flat-square&logo=docker)](docker-compose.yml)
[![Deploy on Railway](https://img.shields.io/badge/deploy-Railway-7B2BFF?style=flat-square&logo=railway)](https://railway.app)

> **Detect phishing URLs with one API call.**
> VirusTotal · URLhaus · GreyNoise · WHOIS · SSL · DNS — fused into one risk score.

```bash
curl -X POST https://api.phishguard.dev/v1/analyze \
  -H "X-API-Key: pg_your_key" \
  -d '{"url":"https://paypal-secure-login.tk/verify"}'

# → { "risk_score": 94, "verdict": "MALICIOUS", "risk_reasons": [...] }
```

**[Live demo](https://phishguardapi.vercel.app/playground)** · **[API docs](https://phishguardapi.vercel.app/docs)** · **[Free API key](https://phishguardapi.vercel.app/pricing)**

---

## What it does

PhishGuard runs **7 enrichment checks in parallel** and returns a single JSON with:

| Check | Source | What you get |
|---|---|---|
| URL features | Built-in | Homograph detection, suspicious TLDs, punycode, keyword hits |
| Virus scan | VirusTotal (87+ engines) | Malicious/suspicious engine count, flagged vendors |
| Malware feed | URLhaus (Abuse.ch) | Listed status, threat type, URL status |
| IP intelligence | GreyNoise | Malicious/benign/unknown classification |
| Domain age | WHOIS | Registration date, registrar, privacy guard |
| Certificate | SSL check | Validity, issuer, expiry, self-signed detection |
| DNS | dnspython | A/MX/NS records, resolved IP |

**Output:** `risk_score` (0–100) + `verdict` (CLEAN / LOW_RISK / SUSPICIOUS / MALICIOUS) + `risk_reasons` (human-readable list)

---

## Quickstart (self-hosted)

### Prerequisites
- Docker + Docker Compose
- Free API keys: [VirusTotal](https://virustotal.com), [GreyNoise](https://greynoise.io) *(optional but recommended)*

```bash
# 1. Clone
git clone https://github.com/soham7998/phishguard
cd phishguard

# 2. Configure
cp backend/.env.sample backend/.env
# Edit backend/.env — add your API keys

# 3. Run
docker-compose up --build

# Backend:  http://localhost:8000
# Frontend: http://localhost:3000
# API docs: http://localhost:8000/docs
```

### First request

```bash
# Get an API key (admin endpoint)
curl -X POST http://localhost:8000/v1/keys \
  -H "Content-Type: application/json" \
  -d '{"email":"you@example.com","plan":"free","admin_secret":"your_admin_secret"}'

# Analyze a URL
curl -X POST http://localhost:8000/v1/analyze \
  -H "X-API-Key: pg_your_generated_key" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://suspicious-site.example"}'
```

---

## API reference

### `POST /v1/analyze`
Analyze a single URL.

```json
// Request
{ "url": "https://target.example", "include_screenshot": false }

// Response
{
  "analysis_id":  "a3f9c12b",
  "url":          "https://target.example",
  "domain":       "target.example",
  "risk_score":   87,
  "verdict":      "MALICIOUS",
  "risk_reasons": ["VirusTotal: 24 engines flagged", "Domain age: 5 days"],
  "elapsed_sec":  1.72,
  "virustotal":   { "vt_malicious": 24, "vt_total_engines": 87, ... },
  "urlhaus":      { "urlhaus_listed": false, ... },
  "greynoise":    { "gn_classification": "malicious", ... },
  "whois":        { "whois_age_days": 5, "whois_newly_registered": true, ... },
  "ssl":          { "ssl_valid": true, "ssl_issuer": "Let's Encrypt", ... },
  "dns":          { "dns_resolves": true, "dns_a_records": ["185.x.x.x"], ... }
}
```

### `POST /v1/analyze/bulk` *(Pro+)*
Analyze up to 10 URLs in one request.

### `GET /v1/result/{id}`
Retrieve a cached result (7–90 days depending on plan).

### `GET /v1/usage`
Check daily quota and usage history.

Full reference: [phishguard.dev/docs](https://phishguardapi.vercel.app/docs) · Swagger UI: `/docs`

---

## Rate limits

| Plan | Daily limit | Price |
|---|---|---|
| Free | 50 / day | $0 forever |
| Pro | 5,000 / day | $19/mo |
| Business | 50,000 / day | $79/mo |
| Enterprise | Unlimited | Custom |

---

## Architecture

```
┌──────────────────────────────────────────────────┐
│           Next.js Frontend (Vercel)              │
│   /  · /playground · /docs · /pricing           │
└──────────────────┬───────────────────────────────┘
                   │ REST API (X-API-Key)
┌──────────────────▼───────────────────────────────┐
│           FastAPI Backend (Railway)              │
│                                                  │
│  URL Parser → DNS → SSL → WHOIS                  │
│  VirusTotal → URLhaus → GreyNoise                │
│  Risk scoring engine → verdict                   │
└──────────────────┬───────────────────────────────┘
                   │
┌──────────────────▼───────────────────────────────┐
│       MongoDB Atlas (results + API keys)         │
└──────────────────────────────────────────────────┘
```

---

## Project structure

```
phishguard/
├── backend/
│   ├── main.py              # FastAPI app — all endpoints
│   ├── auth.py              # API key auth + rate limiting
│   ├── services/
│   │   └── analyzer.py      # 7-source enrichment pipeline
│   ├── requirements.txt
│   ├── Dockerfile
│   └── railway.json
├── frontend/
│   ├── app/
│   │   ├── page.tsx         # Landing page
│   │   ├── playground/      # Interactive demo
│   │   ├── docs/            # API reference
│   │   └── pricing/         # Pricing page
│   ├── components/
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   └── vercel.json
├── docker-compose.yml
└── README.md
```

---

## Deploy to production (5 minutes)

### Backend → Railway
1. Push repo to GitHub
2. New project in [railway.app](https://railway.app) → Deploy from GitHub → select `backend/`
3. Add environment variables from `backend/.env.sample`
4. Railway auto-deploys on every push

### Frontend → Vercel
1. Import repo at [vercel.com](https://vercel.com) → select `frontend/`
2. Set `NEXT_PUBLIC_API_URL` to your Railway backend URL
3. Deploy — done

### Database → MongoDB Atlas
1. Free cluster at [cloud.mongodb.com](https://cloud.mongodb.com)
2. Copy connection string → set as `MONGO_URI` in Railway env vars

**Total monthly cost: ~$5 (Railway hobby plan)**

---

## Environment variables

| Variable | Service | Required | Description |
|---|---|---|---|
| `MONGO_URI` | Backend | ✅ | MongoDB connection string |
| `JWT_SECRET` | Backend | ✅ | Random secret for signing |
| `ADMIN_SECRET` | Backend | ✅ | Protects `/v1/keys` endpoint |
| `VIRUSTOTAL_API_KEY` | Backend | Recommended | Free at virustotal.com |
| `GREYNOISE_API_KEY` | Backend | Optional | Free at greynoise.io |
| `SCREENSHOT_API_KEY` | Backend | Optional | screenshotone.com |
| `NEXT_PUBLIC_API_URL` | Frontend | ✅ | Backend URL |

---

## Contributing

PRs welcome. See [CONTRIBUTING.md](CONTRIBUTING.md).

**Good first issues:**
- Add more suspicious keyword patterns
- Add IPQS (IPQualityScore) as an additional source
- Python SDK
- Node.js SDK

---

## License

MIT — free for personal and commercial use. See [LICENSE](LICENSE).

---

## Built by

**Soham Shah** · Cybersecurity enthusiast & SIEM engineer · [LinkedIn](https://linkedin.com/in/shahsoham2003) · [SentinelTI](https://sentinelti-product.vercel.app)

> *"Phishing is the most common cyberattack vector. Detection should be a one-line API call."*
