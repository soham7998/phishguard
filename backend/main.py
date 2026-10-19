"""
PhishGuard – Main FastAPI Application
REST API for phishing URL analysis.

Endpoints:
  POST /v1/analyze          — Analyze a single URL
  POST /v1/analyze/bulk     — Analyze up to 10 URLs
  GET  /v1/result/{id}      — Retrieve a cached result
  GET  /v1/usage            — API key usage stats
  POST /v1/keys             — Create a new API key (internal/admin)
  GET  /health              — Health check
  GET  /                    — API info
"""

import os
import logging
import datetime
from typing import Optional
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, HttpUrl, field_validator
from pymongo import MongoClient
from bson import ObjectId
import slowapi
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from auth import require_api_key, create_api_key, get_usage_stats, increment_usage, setup_indexes
from services.analyzer import analyze_url

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(name)s %(levelname)s %(message)s")
logger = logging.getLogger("main")

MONGO_URI       = os.getenv("MONGO_URI", "mongodb://localhost:27017/phishguard")
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

_client  = MongoClient(MONGO_URI)
_db      = _client["phishguard"]
results_col = _db["results"]

limiter = Limiter(key_func=get_remote_address)


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_indexes()
    results_col.create_index("created_at", expireAfterSeconds=60 * 60 * 24 * 7)  # TTL 7 days
    results_col.create_index("analysis_id", unique=True)
    logger.info("PhishGuard API started")
    yield
    logger.info("PhishGuard API shutting down")


app = FastAPI(
    title="PhishGuard API",
    description="Phishing URL analysis API — VirusTotal, URLhaus, GreyNoise, WHOIS, SSL, DNS",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, slowapi._rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS + ["https://phishguard.dev", "https://www.phishguard.dev"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Request / Response Models ─────────────────────────────────────────────────

class AnalyzeRequest(BaseModel):
    url: str
    include_screenshot: bool = False

    @field_validator("url")
    @classmethod
    def normalize_url(cls, v: str) -> str:
        v = v.strip()
        if not v.startswith(("http://", "https://")):
            v = "https://" + v
        if len(v) > 2048:
            raise ValueError("URL too long (max 2048 characters)")
        return v


class BulkAnalyzeRequest(BaseModel):
    urls: list[str]
    include_screenshot: bool = False

    @field_validator("urls")
    @classmethod
    def validate_urls(cls, v: list[str]) -> list[str]:
        if len(v) > 10:
            raise ValueError("Maximum 10 URLs per bulk request")
        if not v:
            raise ValueError("At least one URL required")
        return [u.strip() for u in v]


class CreateKeyRequest(BaseModel):
    email: str
    plan: str = "free"
    label: str = ""
    admin_secret: str


# ── Helper ────────────────────────────────────────────────────────────────────

def _store_result(result: dict, key_doc: dict) -> str:
    """Store analysis result in MongoDB, return analysis_id."""
    import hashlib, time
    analysis_id = hashlib.md5(f"{result['url']}{time.time()}".encode()).hexdigest()[:16]
    result["analysis_id"] = analysis_id
    result["api_key_plan"] = key_doc.get("plan", "free")
    result["created_at"]   = datetime.datetime.utcnow()
    results_col.insert_one(result)
    return analysis_id


def _serialize(doc: dict) -> dict:
    """Remove MongoDB internals for JSON response."""
    doc.pop("_id", None)
    doc.pop("api_key_plan", None)
    if isinstance(doc.get("created_at"), datetime.datetime):
        doc["created_at"] = doc["created_at"].isoformat() + "Z"
    return doc


# ── Endpoints ─────────────────────────────────────────────────────────────────

@app.get("/", tags=["Info"])
async def root():
    return {
        "name":        "PhishGuard API",
        "version":     "1.0.0",
        "description": "Phishing URL analysis — VirusTotal, URLhaus, GreyNoise, WHOIS, SSL, DNS",
        "docs":        "/docs",
        "status":      "operational",
    }


@app.get("/health", tags=["Info"])
async def health():
    try:
        _client.admin.command("ping")
        db_ok = True
    except Exception:
        db_ok = False
    return {"status": "ok" if db_ok else "degraded", "db": db_ok}


@app.post("/v1/analyze", tags=["Analysis"])
@limiter.limit("30/minute")
async def analyze(
    request: Request,
    body: AnalyzeRequest,
    background_tasks: BackgroundTasks,
    key_doc: dict = Depends(require_api_key),
):
    """
    Analyze a single URL for phishing indicators.

    Returns a risk score (0-100), verdict (CLEAN/LOW_RISK/SUSPICIOUS/MALICIOUS),
    and full source data from VirusTotal, URLhaus, GreyNoise, WHOIS, DNS, and SSL.
    """
    result = analyze_url(body.url, include_screenshot=body.include_screenshot)

    # Store result + increment usage in background
    analysis_id = _store_result(result, key_doc)
    background_tasks.add_task(increment_usage, key_doc)

    return {
        "analysis_id": analysis_id,
        **_serialize(result),
    }


@app.post("/v1/analyze/bulk", tags=["Analysis"])
@limiter.limit("10/minute")
async def analyze_bulk(
    request: Request,
    body: BulkAnalyzeRequest,
    background_tasks: BackgroundTasks,
    key_doc: dict = Depends(require_api_key),
):
    """
    Analyze up to 10 URLs in a single request.
    Each URL consumes one API request against your daily limit.
    Requires Pro plan or higher.
    """
    plan = key_doc.get("plan", "free")
    if plan == "free":
        raise HTTPException(
            status_code=403,
            detail={
                "error":       "plan_restriction",
                "message":     "Bulk analysis requires Pro or Enterprise plan.",
                "upgrade_url": "https://phishguard.dev/pricing",
            },
        )

    results = []
    for url in body.urls:
        try:
            result = analyze_url(url, include_screenshot=False)
            analysis_id = _store_result(result, key_doc)
            results.append({"analysis_id": analysis_id, **_serialize(result)})
        except Exception as e:
            results.append({"url": url, "error": str(e)})

    background_tasks.add_task(increment_usage, key_doc)

    return {
        "count":   len(results),
        "results": results,
    }


@app.get("/v1/result/{analysis_id}", tags=["Analysis"])
async def get_result(
    analysis_id: str,
    key_doc: dict = Depends(require_api_key),
):
    """Retrieve a previously cached analysis result by ID (cached 7 days)."""
    doc = results_col.find_one({"analysis_id": analysis_id})
    if not doc:
        raise HTTPException(
            status_code=404,
            detail={"error": "not_found", "message": f"Analysis {analysis_id} not found or expired."},
        )
    return _serialize(doc)


@app.get("/v1/usage", tags=["Account"])
async def usage(key_doc: dict = Depends(require_api_key)):
    """Get API key usage statistics for the last 30 days."""
    return get_usage_stats(key_doc)


@app.post("/v1/keys", tags=["Account"])
async def create_key(body: CreateKeyRequest):
    """
    Create a new API key.
    Protected by admin_secret — use from your dashboard or CLI.
    """
    expected = os.getenv("ADMIN_SECRET", "")
    if not expected or body.admin_secret != expected:
        raise HTTPException(status_code=403, detail={"error": "forbidden"})

    return create_api_key(
        email=body.email,
        plan=body.plan,
        label=body.label,
    )


# ── Error Handlers ────────────────────────────────────────────────────────────

@app.exception_handler(422)
async def validation_error(request: Request, exc):
    return JSONResponse(
        status_code=422,
        content={
            "error":   "validation_error",
            "message": "Invalid request body.",
            "details": exc.errors() if hasattr(exc, "errors") else str(exc),
        },
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.getenv("PORT", 8000)), reload=True)
