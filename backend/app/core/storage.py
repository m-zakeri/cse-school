"""S3-compatible object storage for course videos.

Locally this talks to the MinIO container; in production point the same
env vars at Arvan Cloud / AWS S3 and nothing else changes.

boto3 is synchronous, so every network call here is pushed to a worker
thread by the callers (``run_in_threadpool``). Presigning is pure local
computation and is safe to call directly.
"""

import logging
from functools import lru_cache

import boto3
from botocore.client import Config
from botocore.exceptions import ClientError

from app.core.config import settings

logger = logging.getLogger(__name__)

_SIGNATURE_CONFIG = Config(signature_version="s3v4", s3={"addressing_style": "path"})


@lru_cache(maxsize=2)
def _client(endpoint: str):
    return boto3.client(
        "s3",
        endpoint_url=endpoint,
        aws_access_key_id=settings.S3_ACCESS_KEY,
        aws_secret_access_key=settings.S3_SECRET_KEY,
        region_name=settings.S3_REGION,
        config=_SIGNATURE_CONFIG,
    )


def internal_client():
    """Client the backend uses to read/write objects."""
    return _client(settings.S3_ENDPOINT_INTERNAL)


def public_client():
    """Client used only to sign URLs the browser will open."""
    return _client(settings.S3_ENDPOINT_PUBLIC)


def ensure_bucket() -> None:
    """Create the bucket on first boot; safe to call repeatedly."""
    client = internal_client()
    try:
        client.head_bucket(Bucket=settings.S3_BUCKET)
        return
    except ClientError as exc:
        code = exc.response.get("Error", {}).get("Code")
        if code not in ("404", "NoSuchBucket", "NotFound"):
            raise
    client.create_bucket(Bucket=settings.S3_BUCKET)
    logger.info("Created object storage bucket '%s'.", settings.S3_BUCKET)


def upload_fileobj(fileobj, key: str, content_type: str) -> None:
    internal_client().upload_fileobj(
        fileobj,
        settings.S3_BUCKET,
        key,
        ExtraArgs={"ContentType": content_type or "application/octet-stream"},
    )


def delete_object(key: str) -> None:
    internal_client().delete_object(Bucket=settings.S3_BUCKET, Key=key)


def presigned_get_url(key: str, expires_in: int | None = None) -> str:
    """A time-limited URL the browser can stream the video from directly."""
    return public_client().generate_presigned_url(
        "get_object",
        Params={"Bucket": settings.S3_BUCKET, "Key": key},
        ExpiresIn=expires_in or settings.VIDEO_URL_EXPIRE_SECONDS,
    )
