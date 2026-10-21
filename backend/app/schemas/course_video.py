import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


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
    # The caller's own resume point (0 for guests / not started).
    progress_seconds: float = 0
    completed: bool = False

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


class VideoProgressUpdate(BaseModel):
    position_seconds: float = Field(..., ge=0, le=60 * 60 * 24)
    duration_seconds: Optional[float] = Field(None, ge=0, le=60 * 60 * 24)


class VideoProgressRead(BaseModel):
    video_id: uuid.UUID
    position_seconds: float
    duration_seconds: Optional[float] = None
    completed: bool


class ContinueWatching(BaseModel):
    """One 'pick up where you left off' entry for the dashboard."""

    video_id: uuid.UUID
    video_title: str
    course_number: int
    course_title: str
    position_seconds: float
    duration_seconds: Optional[float] = None
    completed: bool
    updated_at: datetime
