import uuid
import secrets
from typing import List, Any, Optional
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel
from sqlalchemy import select, desc, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import get_password_hash
from app.core.database import get_db
from app.core.deps import get_current_admin, get_current_user, get_optional_user
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


def resolve_course_query(c_id):
    if isinstance(c_id, int):
        return select(Course).where(Course.course_number == c_id)
    if isinstance(c_id, str):
        if c_id.isdigit():
            return select(Course).where(Course.course_number == int(c_id))
        try:
            return select(Course).where(Course.id == uuid.UUID(c_id))
        except ValueError:
            return select(Course).where(Course.slug == c_id)
    return select(Course).where(Course.id == c_id)


@router.post("/", response_model=EnrollmentRead, status_code=status.HTTP_201_CREATED)
async def create_enrollment(
    enroll_in: EnrollmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_user),
) -> Any:
    """ثبت‌نام مستقیم در یک دوره با ایجاد یا بازیابی حساب کاربری"""
    stmt_course = resolve_course_query(enroll_in.course_id)
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
        if not enroll_in.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="برای ایجاد حساب کاربری، انتخاب کلمه عبور الزامی است.",
            )
        user = User(
            national_id=enroll_in.national_id,
            phone_number=enroll_in.phone_number,
            email=enroll_in.email,
            full_name=enroll_in.full_name,
            hashed_password=get_password_hash(enroll_in.password),
            education_level=enroll_in.education_level,
            university=enroll_in.university,
            field_of_study=enroll_in.field_of_study,
            role=UserRole.STUDENT,
            is_verified=True,
        )
        db.add(user)
        await db.flush()
    else:
        # The account already exists: never let an anonymous request overwrite its
        # credentials or contact details. Only the account owner may enroll into it.
        if current_user is None or current_user.id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="حسابی با این کد ملی موجود است. لطفاً ابتدا وارد سامانه شوید.",
            )
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
    current_user: Optional[User] = Depends(get_optional_user),
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
        if not batch_in.password:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="برای ایجاد حساب کاربری، انتخاب کلمه عبور الزامی است.",
            )
        user = User(
            national_id=batch_in.national_id,
            phone_number=batch_in.phone_number,
            email=batch_in.email,
            full_name=batch_in.full_name,
            hashed_password=get_password_hash(batch_in.password),
            education_level=batch_in.education_level,
            university=batch_in.university,
            field_of_study=batch_in.field_of_study,
            role=UserRole.STUDENT,
            is_verified=True,
        )
        db.add(user)
        await db.flush()
    else:
        # Existing account: only its owner may enroll into it, and their
        # credentials/contact details are never overwritten from this request.
        if current_user is None or current_user.id != user.id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="حسابی با این کد ملی موجود است. لطفاً ابتدا وارد سامانه شوید.",
            )
        if batch_in.education_level:
            user.education_level = batch_in.education_level
        if batch_in.university:
            user.university = batch_in.university
        if batch_in.field_of_study:
            user.field_of_study = batch_in.field_of_study

    enrollment_ids = []
    for c_id in batch_in.course_ids:
        stmt_course = resolve_course_query(c_id)
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


@router.get("/user/{identifier}", response_model=List[EnrollmentRead])
async def get_user_enrollments(
    identifier: str,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """دریافت لیست دوره‌های ثبت‌نام‌شده کاربر با کد ملی، شماره تلفن یا ایمیل"""
    clean_id = identifier.strip()

    # A student may only read their own records; admins may read anyone's.
    owns_identifier = clean_id in (
        current_user.national_id,
        current_user.phone_number,
        current_user.email,
    )
    if not owns_identifier and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="شما تنها مجاز به مشاهده سوابق تحصیلی خود هستید.",
        )

    stmt = (
        select(Enrollment)
        .join(User, Enrollment.user_id == User.id)
        .where(
            or_(
                User.national_id == clean_id,
                User.phone_number == clean_id,
                User.email == clean_id,
            )
        )
        .options(*enrollment_options())
        .order_by(desc(Enrollment.created_at))
    )
    res = await db.execute(stmt)
    return res.scalars().all()



@router.get("/admin/all", response_model=List[EnrollmentRead])
async def get_all_enrollments_admin(
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
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
    _admin: User = Depends(get_current_admin),
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


@router.delete("/admin/{enrollment_id}", status_code=status.HTTP_200_OK)
async def delete_enrollment_admin(
    enrollment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """حذف پرونده ثبت‌نام دانشجو از دوره توسط ادمین"""
    stmt = select(Enrollment).where(Enrollment.id == enrollment_id)
    res = await db.execute(stmt)
    enr = res.scalars().first()
    if not enr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="پرونده ثبت‌نام یافت نشد.",
        )

    await db.delete(enr)
    await db.commit()
    return {"message": "ثبت‌نام دانشجو با موفقیت از این دوره حذف گردید."}


@router.delete("/{enrollment_id}", status_code=status.HTTP_200_OK)
async def drop_enrollment_student(
    enrollment_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """انصراف دانشجو از دوره در پرتال"""
    stmt = select(Enrollment).where(Enrollment.id == enrollment_id)
    res = await db.execute(stmt)
    enr = res.scalars().first()
    if not enr:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="پرونده ثبت‌نام یافت نشد.",
        )

    if enr.user_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="شما تنها مجاز به انصراف از دوره‌های خود هستید.",
        )

    await db.delete(enr)
    await db.commit()
    return {"message": "انصراف شما از دوره با موفقیت ثبت گردید."}

