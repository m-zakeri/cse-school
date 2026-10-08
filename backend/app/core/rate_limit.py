"""Small Redis-backed fixed-window rate limiter for abuse-prone endpoints.

Fails open: if Redis is unreachable the request is allowed, because locking
every user out of login is worse than losing brute-force protection for a
few minutes.
"""

import logging
from typing import Optional

from fastapi import HTTPException, Request, status
from redis import asyncio as aioredis

from app.core.config import settings

logger = logging.getLogger(__name__)

_redis: Optional[aioredis.Redis] = None


def _get_redis() -> aioredis.Redis:
    global _redis
    if _redis is None:
        _redis = aioredis.from_url(
            settings.REDIS_URL,
            socket_connect_timeout=1,
            socket_timeout=1,
        )
    return _redis


def client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def hit(key: str, limit: int, window_seconds: int) -> bool:
    """Count one attempt against ``key``. Returns False once over the limit."""
    try:
        redis = _get_redis()
        redis_key = f"rl:{key}"
        count = await redis.incr(redis_key)
        if count == 1:
            await redis.expire(redis_key, window_seconds)
        return count <= limit
    except Exception as exc:  # noqa: BLE001 - any Redis failure must not break auth
        logger.warning("Rate limiter unavailable, allowing request: %s", exc)
        return True


async def reset(key: str) -> None:
    try:
        await _get_redis().delete(f"rl:{key}")
    except Exception:  # noqa: BLE001
        pass


async def enforce(key: str, limit: int, window_seconds: int) -> None:
    if not await hit(key, limit, window_seconds):
        minutes = max(1, window_seconds // 60)
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"تعداد تلاش‌های ناموفق بیش از حد مجاز است. لطفاً {minutes} دقیقه دیگر دوباره تلاش کنید.",
        )
