import uuid
from typing import Optional
from pydantic import BaseModel, Field

DEFAULT_DEPARTMENT = "دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر"


class InstructorCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=150)
    position: Optional[str] = Field("مدرس دوره تخصصی", max_length=100)
    department: str = Field(DEFAULT_DEPARTMENT, max_length=150)
    specialization: Optional[str] = Field(None, max_length=255)
    image_url: Optional[str] = Field(None, max_length=500, description="آدرس تصویر پروفایل")
    profile_link: Optional[str] = Field(None, max_length=500, description="لینک رزومه رسمی")
    bio: Optional[str] = None


class InstructorUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=150)
    position: Optional[str] = Field(None, max_length=100)
    department: Optional[str] = Field(None, max_length=150)
    specialization: Optional[str] = Field(None, max_length=255)
    image_url: Optional[str] = Field(None, max_length=500)
    profile_link: Optional[str] = Field(None, max_length=500)
    bio: Optional[str] = None


class InstructorFullRead(BaseModel):
    """Instructor with every editable field, used by the admin panel and the
    public instructors page. The trimmed InstructorRead in schemas.course is
    what gets nested inside a course payload."""

    id: uuid.UUID
    name: str
    position: Optional[str] = None
    department: str
    specialization: Optional[str] = None
    image_url: Optional[str] = None
    profile_link: Optional[str] = None
    bio: Optional[str] = None
    courses_count: int = 0

    class Config:
        from_attributes = True
