"""
PhishGuard – API Key Authentication + Rate Limiting + Usage Tracking
"""

import os
import secrets
import hashlib
import logging
from datetime import datetime, timezone, timedelta
from typing import Optional

from fastapi import HTTPException, Security, Depends
from fastapi.security import APIKeyHeader
from pymongo import MongoClient
from pymongo.collection import Collection

logger = logging.getLogger("auth")

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/phishguard")
_client   = MongoClient(MONGO_URI)
_db       = _client["phishguard"]
keys_col: Collection = _db["api_keys"]
usage_col: Collection = _db["usage"]

# Plan limits (requests per day)
PLAN_LIMITS = {
    "free":       int(os.getenv("FREE_DAILY_LIMIT", 50)),
    "pro":        int(os.getenv("PRO_DAILY_LIMIT", 5000)),
    "enterprise": int(os.getenv("ENTERPRISE_DAILY_LIMIT", 100000)),
}

API_KEY_HEADER = APIKeyHeader(name="X-API-Key", auto_error=False)


def _hash_key(raw_key: str) -> str:
    """Store only SHA-256 hash of the key, never the raw value."""
    return hashlib.sha256(raw_key.encode()).hexdigest()


def create_api_key(email: str, plan: str = "free", label: str = "") -> dict:
    """
    Generate a new API key for a user.
    Returns the raw key (shown once) + metadata.
    """
    if plan not in PLAN_LIMITS:
        raise ValueError(f"Invalid plan: {plan}")

    raw_key    = "pg_" + secrets.token_urlsafe(32)
    key_hash   = _hash_key(raw_key)
    created_at = datetime.now(timezone.utc)

    doc = {
        "key_hash":   key_hash,
        "email":      email.lower().strip(),
        "plan":       plan,
        "label":      label or f"{plan.capitalize()} key",
        "created_at": created_at,
        "last_used":  None,
        "active":     True,
        "daily_limit": PLAN_LIMITS[plan],
    }
    keys_col.insert_one(doc)
    logger.info(f"Created {plan} API key for {email}")

    return {
        "api_key":    raw_key,   # show only once
        "plan":       plan,
        "daily_limit": PLAN_LIMITS[plan],
        "label":      doc["label"],
        "created_at": created_at.isoformat(),
        "note":       "Save this key — it will not be shown again.",
    }


def get_key_doc(raw_key: str) -> Optional[dict]:
    """Look up API key by hash."""
    return keys_col.find_one({"key_hash": _hash_key(raw_key), "active": True})


def _today_utc() -> str:
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def check_rate_limit(key_doc: dict) -> tuple[int, int]:
    """
    Returns (used_today, daily_limit).
    Raises HTTP 429 if limit exceeded.
    """
    key_hash  = key_doc["key_hash"]
    today     = _today_utc()
    limit     = key_doc.get("daily_limit", PLAN_LIMITS["free"])

    usage_doc = usage_col.find_one({"key_hash": key_hash, "date": today})
    used      = usage_doc["count"] if usage_doc else 0

    if used >= limit:
        raise HTTPException(
            status_code=429,
            detail={
                "error":       "rate_limit_exceeded",
                "message":     f"Daily limit of {limit} requests reached. Resets at midnight UTC.",
                "used":        used,
                "limit":       limit,
                "plan":        key_doc.get("plan", "free"),
                "upgrade_url": "https://phishguard.dev/pricing",
            },
        )
    return used, limit


def increment_usage(key_doc: dict) -> None:
    """Increment today's usage counter for this API key."""
    key_hash = key_doc["key_hash"]
    today    = _today_utc()

    usage_col.update_one(
        {"key_hash": key_hash, "date": today},
        {"$inc": {"count": 1}, "$setOnInsert": {"first_used": datetime.now(timezone.utc)}},
        upsert=True,
    )
    keys_col.update_one(
        {"key_hash": key_hash},
        {"$set": {"last_used": datetime.now(timezone.utc)}},
    )


def get_usage_stats(key_doc: dict) -> dict:
    """Return usage stats for the last 30 days."""
    key_hash = key_doc["key_hash"]
    since    = (datetime.now(timezone.utc) - timedelta(days=30)).strftime("%Y-%m-%d")

    daily = list(usage_col.find(
        {"key_hash": key_hash, "date": {"$gte": since}},
        {"_id": 0, "date": 1, "count": 1}
    ).sort("date", 1))

    total_30d = sum(d["count"] for d in daily)
    today_used, limit = check_rate_limit.__wrapped__(key_doc) if hasattr(check_rate_limit, "__wrapped__") else (0, PLAN_LIMITS[key_doc.get("plan", "free")])

    # Get today's count without raising
    today_doc = usage_col.find_one({"key_hash": key_hash, "date": _today_utc()})
    today_used = today_doc["count"] if today_doc else 0

    return {
        "plan":          key_doc.get("plan", "free"),
        "daily_limit":   key_doc.get("daily_limit", PLAN_LIMITS["free"]),
        "today_used":    today_used,
        "today_remaining": max(0, key_doc.get("daily_limit", PLAN_LIMITS["free"]) - today_used),
        "total_30d":     total_30d,
        "daily_history": daily,
        "resets_at":     "midnight UTC",
    }


# ── FastAPI Dependency ────────────────────────────────────────────────────────

async def require_api_key(raw_key: str = Security(API_KEY_HEADER)) -> dict:
    """
    FastAPI dependency — validates API key, checks rate limit.
    Use as: key_doc = Depends(require_api_key)
    """
    if not raw_key:
        raise HTTPException(
            status_code=401,
            detail={
                "error":   "missing_api_key",
                "message": "Include your API key in the X-API-Key header.",
                "docs":    "https://phishguard.dev/docs",
            },
        )

    key_doc = get_key_doc(raw_key)
    if not key_doc:
        raise HTTPException(
            status_code=401,
            detail={
                "error":   "invalid_api_key",
                "message": "API key not found or revoked.",
                "docs":    "https://phishguard.dev/docs",
            },
        )

    check_rate_limit(key_doc)
    return key_doc


def setup_indexes():
    """Create MongoDB indexes on startup."""
    keys_col.create_index("key_hash",          unique=True)
    keys_col.create_index("email")
    usage_col.create_index([("key_hash", 1), ("date", 1)], unique=True)
    logger.info("MongoDB indexes ensured")
