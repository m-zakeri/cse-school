import secrets
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.certificate import Certificate
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.course import Course
from app.models.user import User
from app.schemas.certificate import (
    CertificateAdminRead,
    CertificateIssue,
    CertificateVerifyResponse,
)

router = APIRouter()


def generate_serial_number() -> str:
    """شماره سریال یکتای گواهینامه رسمی دانشگاه"""
    return f"AUT-CE-1404-{secrets.token_hex(4).upper()}"


def to_admin_read(cert: Certificate) -> CertificateAdminRead:
    enrollment = cert.enrollment
    course = enrollment.course if enrollment else None
    return CertificateAdminRead(
        id=cert.id,
        enrollment_id=cert.enrollment_id,
        user_id=cert.user_id,
        serial_number=cert.serial_number,
        pdf_url=cert.pdf_url,
        qr_code_url=cert.qr_code_url,
        issued_at=cert.issued_at,
        student_name=cert.user.full_name if cert.user else None,
        course_title=course.title_fa if course else None,
        tracking_code=enrollment.tracking_code if enrollment else None,
    )


def admin_certificate_options():
    return [
        selectinload(Certificate.user),
        selectinload(Certificate.enrollment).selectinload(Enrollment.course),
    ]


@router.get("/admin/all", response_model=List[CertificateAdminRead])
async def list_certificates_admin(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """فهرست تمامی گواهینامه‌های صادرشده برای پنل مدیریت"""
    stmt = (
        select(Certificate)
        .options(*admin_certificate_options())
        .order_by(desc(Certificate.issued_at))
    )
    res = await db.execute(stmt)
    return [to_admin_read(c) for c in res.scalars().all()]


@router.post("/admin/issue", response_model=CertificateAdminRead, status_code=status.HTTP_201_CREATED)
async def issue_certificate(
    payload: CertificateIssue,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """صدور گواهینامه رسمی برای یک دوره تکمیل‌شده"""
    stmt = (
        select(Enrollment)
        .where(Enrollment.id == payload.enrollment_id)
        .options(selectinload(Enrollment.course), selectinload(Enrollment.certificate))
    )
    res = await db.execute(stmt)
    enrollment = res.scalars().first()

    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="پرونده ثبت‌نام یافت نشد.",
        )

    if enrollment.status != EnrollmentStatus.COMPLETED:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="تنها برای دوره‌های تکمیل‌شده می‌توان گواهینامه صادر کرد.",
        )

    if enrollment.certificate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="برای این پرونده قبلاً گواهینامه صادر شده است.",
        )

    certificate = Certificate(
        enrollment_id=enrollment.id,
        user_id=enrollment.user_id,
        serial_number=generate_serial_number(),
    )
    db.add(certificate)
    await db.commit()

    reload_stmt = (
        select(Certificate)
        .where(Certificate.id == certificate.id)
        .options(*admin_certificate_options())
    )
    reload_res = await db.execute(reload_stmt)
    return to_admin_read(reload_res.scalars().first())


@router.delete("/admin/{certificate_id}", status_code=status.HTTP_200_OK)
async def revoke_certificate(
    certificate_id: str,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """ابطال و حذف گواهینامه صادرشده"""
    res = await db.execute(select(Certificate).where(Certificate.id == certificate_id))
    cert = res.scalars().first()
    if not cert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="گواهینامه مورد نظر یافت نشد.",
        )

    await db.delete(cert)
    await db.commit()
    return {"message": "گواهینامه با موفقیت ابطال گردید."}


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
