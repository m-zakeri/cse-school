import uuid
from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class CertificateRead(BaseModel):
    id: uuid.UUID
    enrollment_id: uuid.UUID
    user_id: uuid.UUID
    serial_number: str
    pdf_url: Optional[str] = None
    qr_code_url: Optional[str] = None
    issued_at: datetime

    class Config:
        from_attributes = True


class CertificateVerifyResponse(BaseModel):
    is_valid: bool
    serial_number: str
    student_name: str
    course_title: str
    instructor_name: str
    term_title: str
    issue_date: str
    grade: Optional[str] = None
