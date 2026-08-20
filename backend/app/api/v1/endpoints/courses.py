import uuid
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.course import Course
from app.schemas.course import CourseListRead, CourseDetailRead

router = APIRouter()


@router.get("/", response_model=List[CourseListRead])
async def get_courses(
    db: AsyncSession = Depends(get_db),
) -> Any:
    """دریافت لیست تمامی دوره‌های آموزشی فعال به همراه اطلاعات استاد"""
    stmt = (
        select(Course)
        .where(Course.is_active == True)
        .options(selectinload(Course.instructor))
        .order_by(Course.course_number)
    )
    result = await db.execute(stmt)
    courses = result.scalars().all()
    return courses


@router.get("/{identifier}", response_model=CourseDetailRead)
async def get_course_detail(
    identifier: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """
    دریافت مشخصات تفصیلی دوره به همراه سرفصل‌های جلسات
    شناسه می‌تواند عدد دوره (۱ تا ۷)، شناسه UUID یا slug انگلیسی باشد.
    """
    stmt = (
        select(Course)
        .options(
            selectinload(Course.instructor),
            selectinload(Course.topics),
        )
    )

    # Check if identifier is an integer course number
    if identifier.isdigit():
        stmt = stmt.where(Course.course_number == int(identifier))
    else:
        try:
            val_uuid = uuid.UUID(identifier)
            stmt = stmt.where(Course.id == val_uuid)
        except ValueError:
            stmt = stmt.where(Course.slug == identifier)

    result = await db.execute(stmt)
    course = result.scalars().first()

    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره مورد نظر یافت نشد.",
        )

    return course
