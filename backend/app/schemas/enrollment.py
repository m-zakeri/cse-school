import uuid
from datetime import datetime
from typing import Optional, List
from decimal import Decimal
from pydantic import BaseModel
from app.models.enrollment import EnrollmentStatus
from app.schemas.course import CourseListRead
from app.schemas.user import UserRead


class EnrollmentCreate(BaseModel):
    course_id: uuid.UUID
    national_id: str
    phone_number: str
    email: str
    full_name: str
    password: Optional[str] = None
    education_level: Optional[str] = None
    university: Optional[str] = None
    field_of_study: Optional[str] = None


class BatchEnrollmentCreate(BaseModel):
    course_ids: List[uuid.UUID]
    national_id: str
    phone_number: str
    email: str
    full_name: str
    password: Optional[str] = None
    education_level: Optional[str] = None
    university: Optional[str] = None
    field_of_study: Optional[str] = None


class EnrollmentRead(BaseModel):
    id: uuid.UUID
    user_id: uuid.UUID
    course_id: uuid.UUID
    term_id: Optional[uuid.UUID] = None
    status: EnrollmentStatus
    tracking_code: str
    final_grade: Optional[Decimal] = None
    created_at: datetime
    course: Optional[CourseListRead] = None
    user: Optional[UserRead] = None

    class Config:
        from_attributes = True
