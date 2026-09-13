import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CourseVideoRead(BaseModel):
    """What every visitor may see: the video exists and where it sits in the
    playlist. Never carries the storage key or a playable URL."""

    id: uuid.UUID
    title: str
    order_index: int
    is_free_preview: bool
    duration_seconds: Optional[int] = None
    size_bytes: int = 0
    created_at: datetime
    # True when the caller is not allowed to play it yet (needs to enroll).
    locked: bool = True

    class Config:
        from_attributes = True


class CourseVideoPlayback(BaseModel):
    id: uuid.UUID
    title: str
    url: str
    expires_in: int
    content_type: str


class CourseVideoUpdate(BaseModel):
    title: Optional[str] = None
    order_index: Optional[int] = None
    is_free_preview: Optional[bool] = None
    duration_seconds: Optional[int] = None
