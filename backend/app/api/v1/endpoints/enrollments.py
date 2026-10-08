import re
import uuid
import secrets
from typing import List, Any, Optional
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException, status, Query
from pydantic import BaseModel, Field
from sqlalchemy import select, desc, or_, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.security import get_password_hash
from app.core.text import normalize_digits
from app.core.database import get_db
from app.core.deps import get_current_admin, get_current_user, get_optional_user
from app.models.user import User, UserRole
from app.models.course import Course
from app.models.instructor import Instructor
from app.models.term import Term
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.schemas.enrollment import EnrollmentCreate, BatchEnrollmentCreate, EnrollmentRead
from app.schemas.user import is_acceptable_national_id

router = APIRouter()


# Statuses that occupy a seat in the class.
_SEAT_HOLDING_STATES = (
    EnrollmentStatus.PENDING_PAYMENT,
    EnrollmentStatus.REGISTERED,
    EnrollmentStatus.COMPLETED,
)


class EnrollmentStatusUpdate(BaseModel):
    status: EnrollmentStatus
    # Grades are entered out of 20 or 100 depending on the course.
    final_grade: Optional[Decimal] = Field(None, ge=0, le=100)


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


async def _resolve_enrolling_user(
    payload: Any,
    current_user: Optional[User],
    db: AsyncSession,
) -> User:
    """The account a request enrolls: the signed-in caller, or a brand-new
    account created from the submitted details for an anonymous visitor."""
    national_id = normalize_digits((payload.national_id or "").strip())

    if current_user is not None:
        # Signed in: the enrollment always belongs to the caller. Profile hints
        # in the body may fill gaps but never overwrite credentials or contacts.
        if national_id and national_id != current_user.national_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="کد ملی ارسال‌شده با حساب کاربری واردشده مطابقت ندارد.",
            )
        user = current_user
        if payload.education_level:
            user.education_level = payload.education_level
        if payload.university:
            user.university = payload.university
        if payload.field_of_study:
            user.field_of_study = payload.field_of_study
        return user

    identity_fields = ("national_id", "phone_number", "email", "full_name")
    if not any(getattr(payload, name, None) for name in identity_fields):
        # No session and no details to open an account with: the caller's token
        # was missing or no longer valid.
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="برای ثبت‌نام ابتدا وارد حساب کاربری خود شوید.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    missing = [name for name in identity_fields if not getattr(payload, name, None)]
    if missing or not payload.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="برای ایجاد حساب کاربری، تکمیل مشخصات هویتی و انتخاب کلمه عبور الزامی است.",
        )

    phone = normalize_digits(payload.phone_number.strip())
    email = payload.email.strip()

    if not is_acceptable_national_id(national_id):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="کد ملی وارد شده با الگوریتم استاندارد صحت‌سنجی ملی همخوانی ندارد.",
        )
    if not re.match(r"^09\d{9}$", phone):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="شماره همراه باید با 09 شروع شده و ۱۱ رقم باشد.",
        )
    if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="فرمت آدرس ایمیل نامعتبر است.",
        )
    if len(payload.password) < 6:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="کلمه عبور باید حداقل شامل ۶ کاراکتر باشد.",
        )

    clash = (
        await db.execute(
            select(User).where(
                or_(
                    User.national_id == national_id,
                    User.phone_number == phone,
                    func.lower(User.email) == email.lower(),
                )
            )
        )
    ).scalars().first()
    if clash:
        # Never reveal which detail matched an account the caller doesn't own.
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="حسابی با این مشخصات موجود است. لطفاً ابتدا وارد سامانه شوید.",
        )

    user = User(
        national_id=national_id,
        phone_number=phone,
        email=email,
        full_name=payload.full_name.strip(),
        hashed_password=get_password_hash(payload.password),
        education_level=payload.education_level,
        university=payload.university,
        field_of_study=payload.field_of_study,
        role=UserRole.STUDENT,
        is_verified=True,
    )
    db.add(user)
    await db.flush()
    return user


async def _seats_taken(course: Course, db: AsyncSession) -> int:
    res = await db.execute(
        select(func.count(Enrollment.id)).where(
            Enrollment.course_id == course.id,
            Enrollment.status.in_(_SEAT_HOLDING_STATES),
        )
    )
    return res.scalar() or 0


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
    if not course or not course.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره مورد نظر یافت نشد.",
        )

    user = await _resolve_enrolling_user(enroll_in, current_user, db)

    stmt_exist = (
        select(Enrollment)
        .where(Enrollment.user_id == user.id, Enrollment.course_id == course.id)
        .options(*enrollment_options())
    )
    existing_enrollment = (await db.execute(stmt_exist)).scalars().first()

    if existing_enrollment:
        if existing_enrollment.status == EnrollmentStatus.REGISTERED:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="شما قبلاً در این دوره با موفقیت ثبت‌نام کرده‌اید.",
            )
        return existing_enrollment

    if await _seats_taken(course, db) >= course.capacity:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"ظرفیت دوره «{course.title_fa}» تکمیل شده است.",
        )

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

    user = await _resolve_enrolling_user(batch_in, current_user, db)

    enrollment_ids = []
    full_courses = []
    for c_id in batch_in.course_ids:
        stmt_course = resolve_course_query(c_id)
        res_course = await db.execute(stmt_course)
        course = res_course.scalars().first()
        if not course or not course.is_active:
            continue

        stmt_exist = select(Enrollment).where(
            Enrollment.user_id == user.id,
            Enrollment.course_id == course.id,
        )
        res_exist = await db.execute(stmt_exist)
        exist_enr = res_exist.scalars().first()

        if exist_enr:
            enrollment_ids.append(exist_enr.id)
            continue

        if await _seats_taken(course, db) >= course.capacity:
            full_courses.append(course.title_fa)
            continue

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

    # All-or-nothing: a package must not be half-registered.
    if full_courses:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="ظرفیت دوره‌های زیر تکمیل شده است: " + "، ".join(full_courses),
        )

    if not enrollment_ids:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره‌های انتخاب‌شده در سامانه یافت نشدند یا ثبت‌نام در آن‌ها بسته است.",
        )

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

    # A finished course carries a grade and possibly a certificate; those are
    # academic records only an admin may remove.
    if enr.status == EnrollmentStatus.COMPLETED and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="امکان انصراف از دوره‌ای که تکمیل شده است وجود ندارد.",
        )

    await db.delete(enr)
    await db.commit()
    return {"message": "انصراف شما از دوره با موفقیت ثبت گردید."}

