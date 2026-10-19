"""
PhishGuard – URL Analysis Pipeline
Chains multiple enrichment sources into one verdict.

Sources:
  1. URL parsing & feature extraction (no API key needed)
  2. VirusTotal URL scan
  3. URLhaus (Abuse.ch)
  4. GreyNoise (IP of the domain)
  5. DNS resolution + A/MX/NS records
  6. WHOIS (registrar, creation date, age)
  7. SSL certificate check (validity, issuer, expiry)
  8. Screenshot capture (optional)

Output: AnalysisResult dict with 0-100 risk score + verdict
"""

import os
import re
import ssl
import json
import socket
import hashlib
import logging
import datetime
from urllib.parse import urlparse, urlencode

import requests
import tldextract
import dns.resolver
import whois as python_whois

logger = logging.getLogger("analyzer")

VT_KEY          = os.getenv("VIRUSTOTAL_API_KEY", "")
GREYNOISE_KEY   = os.getenv("GREYNOISE_API_KEY", "")
SCREENSHOT_KEY  = os.getenv("SCREENSHOT_API_KEY", "")
SCREENSHOT_URL  = os.getenv("SCREENSHOT_API_URL", "https://api.screenshotone.com/take")

TIMEOUT = 10  # seconds per external call


# ─────────────────────────────────────────────────────────────────────────────
# 1. URL Feature Extraction (no API, instant)
# ─────────────────────────────────────────────────────────────────────────────

SUSPICIOUS_KEYWORDS = [
    "login", "signin", "verify", "secure", "update", "account", "banking",
    "paypal", "amazon", "google", "microsoft", "apple", "netflix", "confirm",
    "password", "credential", "wallet", "crypto", "free", "winner", "prize",
    "click", "urgent", "suspended", "unusual", "activity",
]

SUSPICIOUS_TLDS = {
    ".tk", ".ml", ".ga", ".cf", ".gq",  # Freenom freebies
    ".xyz", ".top", ".club", ".online", ".site", ".live",
    ".buzz", ".icu", ".cam", ".vip",
}


def extract_url_features(url: str) -> dict:
    """
    Pure URL analysis — no external calls.
    Returns features + partial risk signals.
    """
    parsed   = urlparse(url)
    ext      = tldextract.extract(url)
    domain   = f"{ext.domain}.{ext.suffix}" if ext.suffix else ext.domain
    hostname = parsed.hostname or ""
    path     = parsed.path or ""
    query    = parsed.query or ""

    # Feature flags
    uses_https    = parsed.scheme == "https"
    has_ip        = bool(re.match(r"^\d{1,3}(\.\d{1,3}){3}$", hostname))
    subdomain_cnt = len(ext.subdomain.split(".")) if ext.subdomain else 0
    url_length    = len(url)
    path_depth    = len([p for p in path.split("/") if p])
    param_count   = len(query.split("&")) if query else 0

    keyword_hits  = [kw for kw in SUSPICIOUS_KEYWORDS if kw in url.lower()]
    tld           = f".{ext.suffix}" if ext.suffix else ""
    suspicious_tld = tld.lower() in SUSPICIOUS_TLDS

    # Encoded characters in URL (common in phishing obfuscation)
    encoded_chars = url.count("%") > 3

    # Punycode / homograph domain (xn--)
    is_punycode = "xn--" in hostname.lower()

    # @ in URL (browser trick: user:pass@evil.com)
    has_at_sign = "@" in url

    # Double slashes in path (not counting ://)
    double_slash = "//" in path

    signals = []
    if has_ip:           signals.append("IP address as hostname")
    if not uses_https:   signals.append("No HTTPS")
    if subdomain_cnt > 2: signals.append(f"{subdomain_cnt} subdomain levels")
    if url_length > 100: signals.append(f"Long URL ({url_length} chars)")
    if keyword_hits:     signals.append(f"Suspicious keywords: {', '.join(keyword_hits[:3])}")
    if suspicious_tld:   signals.append(f"Suspicious TLD: {tld}")
    if encoded_chars:    signals.append("Excessive URL encoding")
    if is_punycode:      signals.append("Punycode/IDN domain (possible homograph)")
    if has_at_sign:      signals.append("@ sign in URL")
    if double_slash:     signals.append("Double-slash in path")

    return {
        "domain":           domain,
        "hostname":         hostname,
        "scheme":           parsed.scheme,
        "path":             path,
        "tld":              tld,
        "uses_https":       uses_https,
        "has_ip_host":      has_ip,
        "subdomain_count":  subdomain_cnt,
        "url_length":       url_length,
        "path_depth":       path_depth,
        "param_count":      param_count,
        "keyword_hits":     keyword_hits,
        "suspicious_tld":   suspicious_tld,
        "is_punycode":      is_punycode,
        "has_at_sign":      has_at_sign,
        "url_signals":      signals,
        # Risk contribution (0-25 pts)
        "_url_risk_pts":    min(25, len(signals) * 4 + (5 if has_ip else 0)),
    }


# ─────────────────────────────────────────────────────────────────────────────
# 2. VirusTotal URL Scan
# ─────────────────────────────────────────────────────────────────────────────

def _vt_url_scan(url: str) -> dict:
    """
    Submit URL to VirusTotal and return analysis results.
    Free tier: 4 req/min, 500/day.
    """
    if not VT_KEY:
        return {"vt_available": False}

    try:
        # Step 1: Submit URL for scanning
        submit_r = requests.post(
            "https://www.virustotal.com/api/v3/urls",
            headers={"x-apikey": VT_KEY},
            data={"url": url},
            timeout=TIMEOUT,
        )
        if submit_r.status_code == 429:
            logger.warning("VT rate limited")
            return {"vt_available": False, "vt_error": "rate_limited"}
        if submit_r.status_code not in (200, 201):
            return {"vt_available": False}

        # The analysis ID is base64url(url) — we can fetch directly
        url_id = hashlib.sha256(url.encode()).hexdigest()
        # VT uses URL ID = base64(url) without padding
        import base64
        vt_id = base64.urlsafe_b64encode(url.encode()).decode().rstrip("=")

        result_r = requests.get(
            f"https://www.virustotal.com/api/v3/urls/{vt_id}",
            headers={"x-apikey": VT_KEY},
            timeout=TIMEOUT,
        )
        if result_r.status_code == 404:
            # Not yet analyzed — use submitted scan ID
            scan_id = submit_r.json().get("data", {}).get("id", "")
            if scan_id:
                result_r = requests.get(
                    f"https://www.virustotal.com/api/v3/analyses/{scan_id}",
                    headers={"x-apikey": VT_KEY},
                    timeout=TIMEOUT,
                )

        if result_r.status_code != 200:
            return {"vt_available": False}

        data  = result_r.json().get("data", {})
        attrs = data.get("attributes", {})
        stats = attrs.get("last_analysis_stats", {})

        malicious   = int(stats.get("malicious", 0))
        suspicious  = int(stats.get("suspicious", 0))
        harmless    = int(stats.get("harmless", 0))
        undetected  = int(stats.get("undetected", 0))
        total       = malicious + suspicious + harmless + undetected

        # Top malicious vendors
        engines = attrs.get("last_analysis_results", {})
        flagged_by = [
            vendor for vendor, res in engines.items()
            if res.get("category") in ("malicious", "phishing", "suspicious")
        ][:5]

        categories = attrs.get("categories", {})

        return {
            "vt_available":      True,
            "vt_malicious":      malicious,
            "vt_suspicious":     suspicious,
            "vt_harmless":       harmless,
            "vt_total_engines":  total,
            "vt_flagged_by":     flagged_by,
            "vt_categories":     list(set(categories.values()))[:5],
            "vt_reputation":     int(attrs.get("reputation", 0)),
            "vt_url":            f"https://www.virustotal.com/gui/url/{vt_id}",
            # Risk contribution (0-40 pts)
            "_vt_risk_pts":      min(40, malicious * 3 + suspicious * 1),
        }
    except Exception as e:
        logger.warning(f"VT error: {e}")
        return {"vt_available": False, "vt_error": str(e)}


# ─────────────────────────────────────────────────────────────────────────────
# 3. URLhaus Check
# ─────────────────────────────────────────────────────────────────────────────

def _urlhaus_check(url: str, domain: str) -> dict:
    """
    Check URL + domain against URLhaus (Abuse.ch).
    Free, no API key required.
    """
    results = {}
    try:
        # Check by URL
        r = requests.post(
            "https://urlhaus-api.abuse.ch/v1/url/",
            data={"url": url},
            timeout=TIMEOUT,
        )
        if r.status_code == 200:
            d = r.json()
            if d.get("query_status") == "is_listed":
                results["urlhaus_listed"]      = True
                results["urlhaus_threat"]      = d.get("threat", "")
                results["urlhaus_url_status"]  = d.get("url_status", "")
                results["urlhaus_date_added"]  = d.get("date_added", "")
                results["urlhaus_tags"]        = d.get("tags", [])
                results["urlhaus_url"]         = d.get("urlhaus_reference", "")
                results["_urlhaus_risk_pts"]   = 30
            else:
                results["urlhaus_listed"] = False
                results["_urlhaus_risk_pts"] = 0
    except Exception as e:
        logger.warning(f"URLhaus URL check error: {e}")

    # Also check domain host
    if domain and not results.get("urlhaus_listed"):
        try:
            r = requests.post(
                "https://urlhaus-api.abuse.ch/v1/host/",
                data={"host": domain},
                timeout=TIMEOUT,
            )
            if r.status_code == 200:
                d = r.json()
                urls = d.get("urls", [])
                if urls:
                    results["urlhaus_host_listed"]     = True
                    results["urlhaus_host_url_count"]  = len(urls)
                    results["urlhaus_host_urls"]       = [
                        {"url": u.get("url"), "threat": u.get("threat")}
                        for u in urls[:3]
                    ]
                    results.setdefault("_urlhaus_risk_pts", 20)
        except Exception as e:
            logger.warning(f"URLhaus host check error: {e}")

    return results


# ─────────────────────────────────────────────────────────────────────────────
# 4. GreyNoise Check
# ─────────────────────────────────────────────────────────────────────────────

def _greynoise_check(ip: str) -> dict:
    """Check resolved IP against GreyNoise Community API."""
    if not ip:
        return {}
    headers = {"key": GREYNOISE_KEY} if GREYNOISE_KEY else {}
    try:
        r = requests.get(
            f"https://api.greynoise.io/v3/community/{ip}",
            headers=headers,
            timeout=TIMEOUT,
        )
        if r.status_code == 404:
            return {"gn_seen": False, "_gn_risk_pts": 0}
        if r.status_code == 429:
            return {"gn_error": "rate_limited"}
        if r.status_code != 200:
            return {}
        d = r.json()
        classification = d.get("classification", "unknown")
        risk_pts = 0
        if classification == "malicious":   risk_pts = 20
        elif d.get("noise") and not d.get("riot"): risk_pts = 5
        return {
            "gn_seen":            True,
            "gn_classification":  classification,
            "gn_noise":           bool(d.get("noise", False)),
            "gn_riot":            bool(d.get("riot", False)),
            "gn_name":            d.get("name"),
            "gn_link":            d.get("link", ""),
            "_gn_risk_pts":       risk_pts,
        }
    except Exception as e:
        logger.warning(f"GreyNoise error: {e}")
        return {}


# ─────────────────────────────────────────────────────────────────────────────
# 5. DNS Resolution
# ─────────────────────────────────────────────────────────────────────────────

def _dns_check(domain: str) -> dict:
    """Resolve A, MX, NS records for domain."""
    result = {"dns_resolves": False}
    try:
        resolver = dns.resolver.Resolver()
        resolver.timeout = 5
        resolver.lifetime = 5

        # A records (IP addresses)
        try:
            a_records = [str(r) for r in resolver.resolve(domain, "A")]
            result["dns_resolves"]  = True
            result["dns_a_records"] = a_records[:5]
            result["dns_ip"]        = a_records[0] if a_records else None
        except Exception:
            result["dns_a_records"] = []

        # MX records
        try:
            mx_records = [str(r.exchange).rstrip(".") for r in resolver.resolve(domain, "MX")]
            result["dns_mx_records"] = mx_records[:3]
        except Exception:
            result["dns_mx_records"] = []

        # NS records
        try:
            ns_records = [str(r).rstrip(".") for r in resolver.resolve(domain, "NS")]
            result["dns_ns_records"] = ns_records[:3]
        except Exception:
            result["dns_ns_records"] = []

    except Exception as e:
        logger.warning(f"DNS error for {domain}: {e}")

    return result


# ─────────────────────────────────────────────────────────────────────────────
# 6. WHOIS
# ─────────────────────────────────────────────────────────────────────────────

def _whois_check(domain: str) -> dict:
    """WHOIS lookup — registrar, creation date, age, privacy guard."""
    try:
        w = python_whois.whois(domain)
        if not w or not w.domain_name:
            return {"whois_available": False}

        creation = w.creation_date
        if isinstance(creation, list):
            creation = creation[0]

        expiration = w.expiration_date
        if isinstance(expiration, list):
            expiration = expiration[0]

        domain_age_days = None
        newly_registered = False
        if isinstance(creation, datetime.datetime):
            domain_age_days = (datetime.datetime.utcnow() - creation).days
            newly_registered = domain_age_days < 30

        registrar = w.registrar or ""
        privacy_guard = any(
            kw in str(w).lower()
            for kw in ["privacy", "redacted", "protected", "whoisguard", "proxy"]
        )

        return {
            "whois_available":     True,
            "whois_registrar":     registrar,
            "whois_creation_date": creation.isoformat() if isinstance(creation, datetime.datetime) else str(creation),
            "whois_expiry_date":   expiration.isoformat() if isinstance(expiration, datetime.datetime) else str(expiration),
            "whois_age_days":      domain_age_days,
            "whois_newly_registered": newly_registered,
            "whois_privacy_guard": privacy_guard,
            "whois_country":       w.country if hasattr(w, "country") else None,
            # Risk pts: new domain + privacy guard = phishing signal
            "_whois_risk_pts":     (10 if newly_registered else 0) + (5 if privacy_guard else 0),
        }
    except Exception as e:
        logger.warning(f"WHOIS error for {domain}: {e}")
        return {"whois_available": False}


# ─────────────────────────────────────────────────────────────────────────────
# 7. SSL Certificate Check
# ─────────────────────────────────────────────────────────────────────────────

def _ssl_check(hostname: str) -> dict:
    """Check SSL certificate validity, issuer, and expiry."""
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(
            socket.socket(socket.AF_INET), server_hostname=hostname
        ) as s:
            s.settimeout(TIMEOUT)
            s.connect((hostname, 443))
            cert = s.getpeercert()

        # Parse expiry
        not_after_str = cert.get("notAfter", "")
        not_after = None
        if not_after_str:
            not_after = datetime.datetime.strptime(not_after_str, "%b %d %H:%M:%S %Y %Z")

        days_until_expiry = None
        if not_after:
            days_until_expiry = (not_after - datetime.datetime.utcnow()).days

        # Issuer
        issuer_dict = dict(x[0] for x in cert.get("issuer", []))
        issuer      = issuer_dict.get("organizationName", "Unknown")

        # Free cert issuers (common in phishing — not necessarily malicious)
        free_cert_issuers = ["Let's Encrypt", "ZeroSSL", "Buypass"]
        is_free_cert = any(fi in issuer for fi in free_cert_issuers)

        # SAN / subject
        subject_dict = dict(x[0] for x in cert.get("subject", []))
        cn = subject_dict.get("commonName", "")

        # SANs
        sans = [
            name for typ, name in cert.get("subjectAltName", []) if typ == "DNS"
        ][:5]

        ssl_valid      = (days_until_expiry or 0) > 0
        ssl_expiring   = 0 < (days_until_expiry or 0) < 14

        return {
            "ssl_valid":          ssl_valid,
            "ssl_issuer":         issuer,
            "ssl_cn":             cn,
            "ssl_sans":           sans,
            "ssl_expiry":         not_after.isoformat() if not_after else None,
            "ssl_days_remaining": days_until_expiry,
            "ssl_expiring_soon":  ssl_expiring,
            "ssl_free_cert":      is_free_cert,
            "_ssl_risk_pts":      (15 if not ssl_valid else 0) + (3 if ssl_expiring else 0),
        }
    except ssl.SSLCertVerificationError:
        return {
            "ssl_valid":          False,
            "ssl_error":          "certificate_verification_failed",
            "_ssl_risk_pts":      15,
        }
    except (socket.timeout, ConnectionRefusedError, OSError):
        return {
            "ssl_valid":          False,
            "ssl_error":          "connection_failed",
            "_ssl_risk_pts":      5,
        }
    except Exception as e:
        logger.warning(f"SSL check error for {hostname}: {e}")
        return {"ssl_valid": False, "ssl_error": str(e), "_ssl_risk_pts": 0}


# ─────────────────────────────────────────────────────────────────────────────
# 8. Screenshot (optional)
# ─────────────────────────────────────────────────────────────────────────────

def _screenshot(url: str) -> dict:
    """
    Capture a screenshot via screenshotone.com (free: 100/mo).
    Returns a screenshot URL or None.
    """
    if not SCREENSHOT_KEY:
        return {"screenshot_url": None}
    try:
        params = {
            "access_key":          SCREENSHOT_KEY,
            "url":                 url,
            "viewport_width":      1280,
            "viewport_height":     800,
            "full_page":           "false",
            "format":              "jpg",
            "image_quality":       80,
            "block_ads":           "true",
            "block_cookie_banners": "true",
            "timeout":             15,
        }
        screenshot_url = f"{SCREENSHOT_URL}?{urlencode(params)}"
        # Verify it works (HEAD request)
        r = requests.head(screenshot_url, timeout=20)
        if r.status_code == 200:
            return {"screenshot_url": screenshot_url}
        return {"screenshot_url": None, "screenshot_error": f"HTTP {r.status_code}"}
    except Exception as e:
        logger.warning(f"Screenshot error: {e}")
        return {"screenshot_url": None}


# ─────────────────────────────────────────────────────────────────────────────
# Risk Scoring Engine
# ─────────────────────────────────────────────────────────────────────────────

def compute_risk_score(features: dict, vt: dict, urlhaus: dict,
                       gn: dict, whois: dict, ssl: dict) -> tuple[int, str, list[str]]:
    """
    Aggregate risk points from all sources into a 0-100 score.
    Returns (score, verdict, reasons).

    Verdict: CLEAN | LOW_RISK | SUSPICIOUS | MALICIOUS
    """
    pts = 0
    reasons = []

    # URL features (max 25)
    url_pts = features.get("_url_risk_pts", 0)
    pts += url_pts
    reasons.extend(features.get("url_signals", []))

    # VirusTotal (max 40)
    vt_pts = vt.get("_vt_risk_pts", 0)
    pts += vt_pts
    if vt.get("vt_malicious", 0) > 0:
        reasons.append(f"VirusTotal: {vt['vt_malicious']} engines flagged as malicious")
    if vt.get("vt_suspicious", 0) > 0:
        reasons.append(f"VirusTotal: {vt['vt_suspicious']} engines flagged as suspicious")

    # URLhaus (max 30)
    uh_pts = urlhaus.get("_urlhaus_risk_pts", 0)
    pts += uh_pts
    if urlhaus.get("urlhaus_listed"):
        reasons.append(f"URLhaus: listed as {urlhaus.get('urlhaus_threat', 'malware')}")
    if urlhaus.get("urlhaus_host_listed"):
        reasons.append(f"URLhaus: domain hosting {urlhaus.get('urlhaus_host_url_count', 0)} malicious URLs")

    # GreyNoise (max 20)
    gn_pts = gn.get("_gn_risk_pts", 0)
    pts += gn_pts
    if gn.get("gn_classification") == "malicious":
        reasons.append(f"GreyNoise: classified as malicious ({gn.get('gn_name', '')})")

    # WHOIS (max 15)
    whois_pts = whois.get("_whois_risk_pts", 0)
    pts += whois_pts
    if whois.get("whois_newly_registered"):
        reasons.append(f"Domain registered {whois.get('whois_age_days')} days ago (newly registered)")
    if whois.get("whois_privacy_guard"):
        reasons.append("WHOIS privacy guard active")

    # SSL (max 15)
    ssl_pts = ssl.get("_ssl_risk_pts", 0)
    pts += ssl_pts
    if ssl.get("ssl_error") == "certificate_verification_failed":
        reasons.append("Invalid/self-signed SSL certificate")
    elif ssl.get("ssl_expiring_soon"):
        reasons.append(f"SSL certificate expires in {ssl.get('ssl_days_remaining')} days")
    elif not ssl.get("ssl_valid") and ssl.get("ssl_error") == "connection_failed":
        reasons.append("HTTPS connection refused (no SSL)")

    # Cap at 100
    score = min(100, pts)

    # Determine verdict
    if score >= 70:
        verdict = "MALICIOUS"
    elif score >= 40:
        verdict = "SUSPICIOUS"
    elif score >= 15:
        verdict = "LOW_RISK"
    else:
        verdict = "CLEAN"

    # Override: if VT has strong signal, always at least SUSPICIOUS
    if vt.get("vt_malicious", 0) >= 5 and verdict == "LOW_RISK":
        verdict = "SUSPICIOUS"
    if urlhaus.get("urlhaus_listed") and verdict in ("CLEAN", "LOW_RISK"):
        verdict = "MALICIOUS"

    return score, verdict, reasons


# ─────────────────────────────────────────────────────────────────────────────
# Main Entry Point
# ─────────────────────────────────────────────────────────────────────────────

def analyze_url(url: str, include_screenshot: bool = False) -> dict:
    """
    Full URL analysis pipeline. Runs all checks and returns a unified result.

    Args:
        url: The URL to analyze (must include scheme, e.g. https://...)
        include_screenshot: Whether to capture a screenshot (costs API credits)

    Returns:
        Full analysis dict with risk_score, verdict, and all source data.
    """
    import time
    start_time = time.time()

    # Normalize URL
    url = url.strip()
    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    logger.info(f"Analyzing URL: {url}")

    # 1. URL features (instant)
    features = extract_url_features(url)
    domain   = features.get("domain", "")
    hostname = features.get("hostname", "")

    # 2. DNS (needed for IP → GreyNoise)
    dns_data = _dns_check(domain) if domain else {}
    resolved_ip = dns_data.get("dns_ip")

    # Run external checks
    vt_data       = _vt_url_scan(url)
    urlhaus_data  = _urlhaus_check(url, domain)
    gn_data       = _greynoise_check(resolved_ip) if resolved_ip else {}
    whois_data    = _whois_check(domain) if domain else {}
    ssl_data      = _ssl_check(hostname) if hostname else {}
    screenshot    = _screenshot(url) if include_screenshot else {"screenshot_url": None}

    # Risk score
    score, verdict, reasons = compute_risk_score(
        features, vt_data, urlhaus_data, gn_data, whois_data, ssl_data
    )

    elapsed = round(time.time() - start_time, 2)

    return {
        # ── Core result ──────────────────────────────────────────────────────
        "url":           url,
        "domain":        domain,
        "risk_score":    score,
        "verdict":       verdict,
        "risk_reasons":  reasons,
        "analyzed_at":   datetime.datetime.utcnow().isoformat() + "Z",
        "elapsed_sec":   elapsed,

        # ── Source data ──────────────────────────────────────────────────────
        "url_features":  {k: v for k, v in features.items() if not k.startswith("_")},
        "dns":           {k: v for k, v in dns_data.items() if not k.startswith("_")},
        "virustotal":    {k: v for k, v in vt_data.items() if not k.startswith("_")},
        "urlhaus":       {k: v for k, v in urlhaus_data.items() if not k.startswith("_")},
        "greynoise":     {k: v for k, v in gn_data.items() if not k.startswith("_")},
        "whois":         {k: v for k, v in whois_data.items() if not k.startswith("_")},
        "ssl":           {k: v for k, v in ssl_data.items() if not k.startswith("_")},
        "screenshot_url": screenshot.get("screenshot_url"),
    }
