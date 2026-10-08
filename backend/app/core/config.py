import logging
import secrets
from typing import List, Optional
from pydantic import model_validator
from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)

# Environments that are allowed to fall back to an ephemeral, in-memory key.
DEV_ENVIRONMENTS = {"development", "dev", "local", "test", "testing"}

# Values that have shipped in this repo or its docs as placeholders. They are
# public, so treat them exactly like an unset key.
KNOWN_WEAK_SECRETS = {
    "ce-school-super-secret-key-change-in-production-2026",
    "generate-a-cryptographically-secure-random-64-char-string",
    "changeme",
    "secret",
}

MIN_SECRET_KEY_LENGTH = 32


class Settings(BaseSettings):
    PROJECT_NAME: str = "CE School - Amirkabir University of Technology"
    API_V1_STR: str = "/api/v1"
    ENVIRONMENT: str = "development"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/ce_school_db"

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Security
    # No default: a shared, committed signing key lets anyone forge an admin JWT.
    SECRET_KEY: Optional[str] = None
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 Days

    # Initial superadmin, created on first startup when no account has this email.
    FIRST_SUPERUSER_EMAIL: str = "admin@aut.ac.ir"
    FIRST_SUPERUSER_PASSWORD: Optional[str] = None

    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
    ]

    # Object storage for course videos (S3-compatible: MinIO locally, Arvan/S3 in prod).
    # INTERNAL is what the backend uses to reach storage; PUBLIC is the host baked
    # into presigned URLs handed to the browser, so it must be reachable from there.
    S3_ENDPOINT_INTERNAL: str = "http://minio:9000"
    S3_ENDPOINT_PUBLIC: str = "http://localhost:9000"
    S3_ACCESS_KEY: str = "minioadmin"
    S3_SECRET_KEY: str = "minioadmin"
    S3_BUCKET: str = "course-videos"
    S3_REGION: str = "us-east-1"
    # How long a playback link stays valid after a student opens a video.
    VIDEO_URL_EXPIRE_SECONDS: int = 3600
    # Reject uploads larger than this (bytes). Default 2 GiB.
    VIDEO_MAX_BYTES: int = 2 * 1024 * 1024 * 1024

    class Config:
        case_sensitive = True
        env_file = ".env"

    @model_validator(mode="after")
    def validate_secret_key(self) -> "Settings":
        is_dev = self.ENVIRONMENT.strip().lower() in DEV_ENVIRONMENTS
        key = (self.SECRET_KEY or "").strip()

        if not key:
            reason = "متغیر SECRET_KEY تنظیم نشده است"
        elif key in KNOWN_WEAK_SECRETS:
            reason = "مقدار SECRET_KEY یکی از کلیدهای نمونه و عمومی این مخزن است"
        elif len(key) < MIN_SECRET_KEY_LENGTH:
            reason = (
                f"طول SECRET_KEY کمتر از {MIN_SECRET_KEY_LENGTH} کاراکتر است"
            )
        else:
            self.SECRET_KEY = key
            return self

        if not is_dev:
            raise RuntimeError(
                f"پیکربندی نامعتبر برای محیط '{self.ENVIRONMENT}': {reason}.\n"
                "یک کلید امن بسازید و آن را در متغیر محیطی SECRET_KEY قرار دهید:\n"
                '  python -c "import secrets; print(secrets.token_urlsafe(64))"'
            )

        # Development only: use a throwaway key so the app still boots. It changes
        # on every restart, which invalidates previously issued tokens by design.
        self.SECRET_KEY = secrets.token_urlsafe(64)
        logger.warning(
            "%s. یک کلید موقت برای این اجرا تولید شد؛ با هر ری‌استارت توکن‌های قبلی باطل می‌شوند. "
            "این حالت فقط برای توسعه مجاز است.",
            reason,
        )
        return self


settings = Settings()
