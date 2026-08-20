from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.certificate import Certificate
from app.models.enrollment import Enrollment
from app.models.course import Course
from app.models.user import User
from app.schemas.certificate import CertificateVerifyResponse

router = APIRouter()


@router.get("/verify/{serial_number}", response_model=CertificateVerifyResponse)
async def verify_certificate(
    serial_number: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """استعلام صحت و اصالت گواهینامه رسمی دانشگاه صنعتی امیرکبیر با کد سریال"""
    stmt = (
        select(Certificate)
        .where(Certificate.serial_number == serial_number)
        .options(
            selectinload(Certificate.user),
            selectinload(Certificate.enrollment).selectinload(Enrollment.course).selectinload(Course.instructor),
            selectinload(Certificate.enrollment).selectinload(Enrollment.term),
        )
    )
    res = await db.execute(stmt)
    cert = res.scalars().first()

    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="گواهینامه‌ای با این شماره سریال در سامانه دانشگاه ثبت نشده است.",
        )

    enrollment = cert.enrollment
    course = enrollment.course if enrollment else None
    instructor = course.instructor if course else None
    term = enrollment.term if enrollment else None

    return CertificateVerifyResponse(
        is_valid=True,
        serial_number=cert.serial_number,
        student_name=cert.user.full_name,
        course_title=course.title_fa if course else "دوره تخصصی",
        instructor_name=instructor.name if instructor else "عضو هیئت علمی",
        term_title=term.title if term else "ترم دانشگاهی",
        issue_date=cert.issued_at.strftime("%Y-%m-%d"),
        grade=str(enrollment.final_grade) if enrollment and enrollment.final_grade else "تأییدشده",
    )
