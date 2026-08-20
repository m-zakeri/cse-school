import uuid
import secrets
from typing import List, Any, Optional
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy import select, desc
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.user import User, UserRole
from app.models.course import Course
from app.models.instructor import Instructor
from app.models.term import Term
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.schemas.enrollment import EnrollmentCreate, BatchEnrollmentCreate, EnrollmentRead

router = APIRouter()


class EnrollmentStatusUpdate(BaseModel):
    status: EnrollmentStatus
    final_grade: Optional[Decimal] = None


def generate_tracking_code() -> str:
    """تولید کد رهگیری منحصر‌به‌فرد استاندارد دانشگاه امیرکبیر"""
    random_hex = secrets.token_hex(3).upper()
    return f"AUT-1404-{random_hex}"


def enrollment_options():
    return [
        selectinload(Enrollment.course).selectinload(Course.instructor),
        selectinload(Enrollment.user),
    ]


@router.post("/", response_model=EnrollmentRead, status_code=status.HTTP_201_CREATED)
async def create_enrollment(
    enroll_in: EnrollmentCreate,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """ثبت‌نام مستقیم در یک دوره با ایجاد یا بازیابی حساب کاربری"""
    stmt_course = select(Course).where(Course.id == enroll_in.course_id)
    res_course = await db.execute(stmt_course)
    course = res_course.scalars().first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره مورد نظر یافت نشد.",
        )

    stmt_user = select(User).where(User.national_id == enroll_in.national_id)
    res_user = await db.execute(stmt_user)
    user = res_user.scalars().first()

    if not user:
        user = User(
            national_id=enroll_in.national_id,
            phone_number=enroll_in.phone_number,
            email=enroll_in.email,
            full_name=enroll_in.full_name,
            education_level=enroll_in.education_level,
            university=enroll_in.university,
            field_of_study=enroll_in.field_of_study,
            role=UserRole.STUDENT,
            is_verified=True,
        )
        db.add(user)
        await db.flush()
    else:
        user.full_name = enroll_in.full_name
        user.phone_number = enroll_in.phone_number
        user.email = enroll_in.email
        if enroll_in.education_level:
            user.education_level = enroll_in.education_level
        if enroll_in.university:
            user.university = enroll_in.university
        if enroll_in.field_of_study:
            user.field_of_study = enroll_in.field_of_study

    stmt_exist = select(Enrollment).where(
        Enrollment.user_id == user.id,
        Enrollment.course_id == course.id,
    )
    res_exist = await db.execute(stmt_exist)
    existing_enrollment = res_exist.scalars().first()

    if existing_enrollment:
        if existing_enrollment.status == EnrollmentStatus.REGISTERED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="شما قبلاً در این دوره با موفقیت ثبت‌نام کرده‌اید.",
            )
        return existing_enrollment

    enrollment = Enrollment(
        user_id=user.id,
        course_id=course.id,
        term_id=course.term_id,
        status=EnrollmentStatus.REGISTERED,
        tracking_code=generate_tracking_code(),
    )
    db.add(enrollment)
    await db.commit()
    await db.refresh(enrollment)

    stmt_reload = (
        select(Enrollment)
        .where(Enrollment.id == enrollment.id)
        .options(*enrollment_options())
    )
    res_reload = await db.execute(stmt_reload)
    return res_reload.scalars().first()


@router.post("/batch", response_model=List[EnrollmentRead], status_code=status.HTTP_201_CREATED)
async def create_batch_enrollments(
    batch_in: BatchEnrollmentCreate,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """ثبت‌نام همزمان در چند دوره از پرتال ثبت‌نام"""
    if not batch_in.course_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="حداقل یک دوره باید برای ثبت‌نام انتخاب شود.",
        )

    stmt_user = select(User).where(User.national_id == batch_in.national_id)
    res_user = await db.execute(stmt_user)
    user = res_user.scalars().first()

    if not user:
        user = User(
            national_id=batch_in.national_id,
            phone_number=batch_in.phone_number,
            email=batch_in.email,
            full_name=batch_in.full_name,
            education_level=batch_in.education_level,
            university=batch_in.university,
            field_of_study=batch_in.field_of_study,
            role=UserRole.STUDENT,
            is_verified=True,
        )
        db.add(user)
        await db.flush()
    else:
        user.full_name = batch_in.full_name
        user.phone_number = batch_in.phone_number
        user.email = batch_in.email
        if batch_in.education_level:
            user.education_level = batch_in.education_level
        if batch_in.university:
            user.university = batch_in.university
        if batch_in.field_of_study:
            user.field_of_study = batch_in.field_of_study

    enrollment_ids = []
    for c_id in batch_in.course_ids:
        stmt_course = select(Course).where(Course.id == c_id)
        res_course = await db.execute(stmt_course)
        course = res_course.scalars().first()
        if not course:
            continue

        stmt_exist = select(Enrollment).where(
            Enrollment.user_id == user.id,
            Enrollment.course_id == course.id,
        )
        res_exist = await db.execute(stmt_exist)
        exist_enr = res_exist.scalars().first()

        if exist_enr:
            enrollment_ids.append(exist_enr.id)
        else:
            enr = Enrollment(
                user_id=user.id,
                course_id=course.id,
                term_id=course.term_id,
                status=EnrollmentStatus.REGISTERED,
                tracking_code=generate_tracking_code(),
            )
            db.add(enr)
            await db.flush()
            enrollment_ids.append(enr.id)

    await db.commit()

    stmt_all = (
        select(Enrollment)
        .where(Enrollment.id.in_(enrollment_ids))
        .options(*enrollment_options())
    )
    res_all = await db.execute(stmt_all)
    return res_all.scalars().all()


@router.get("/user/{national_id}", response_model=List[EnrollmentRead])
async def get_user_enrollments(
    national_id: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """دریافت لیست دوره‌های ثبت‌نام‌شده کاربر با کد ملی"""
    stmt = (
        select(Enrollment)
        .join(User, Enrollment.user_id == User.id)
        .where(User.national_id == national_id)
        .options(*enrollment_options())
        .order_by(desc(Enrollment.created_at))
    )
    res = await db.execute(stmt)
    return res.scalars().all()


@router.get("/admin/all", response_model=List[EnrollmentRead])
async def get_all_enrollments_admin(
    db: AsyncSession = Depends(get_db),
) -> Any:
    """دریافت تمامی ثبت‌نام‌ها برای پنل مدیریت آموزش"""
    stmt = (
        select(Enrollment)
        .options(*enrollment_options())
        .order_by(desc(Enrollment.created_at))
    )
    res = await db.execute(stmt)
    return res.scalars().all()


@router.put("/admin/{enrollment_id}/status", response_model=EnrollmentRead)
async def update_enrollment_status(
    enrollment_id: uuid.UUID,
    update_in: EnrollmentStatusUpdate,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """تغییر وضعیت ثبت‌نام یا ثبت نمره توسط ادمین"""
    stmt = (
        select(Enrollment)
        .where(Enrollment.id == enrollment_id)
        .options(*enrollment_options())
    )
    res = await db.execute(stmt)
    enr = res.scalars().first()
    if not enr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="پرونده ثبت‌نام یافت نشد.",
        )

    enr.status = update_in.status
    if update_in.final_grade is not None:
        enr.final_grade = update_in.final_grade

    await db.commit()
    await db.refresh(enr)
    return enr
