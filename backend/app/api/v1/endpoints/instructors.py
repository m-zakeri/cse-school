import uuid
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.user import User
from app.models.instructor import Instructor
from app.models.course import Course
from app.schemas.instructor import (
    InstructorCreate,
    InstructorUpdate,
    InstructorFullRead,
)

router = APIRouter()


def to_read(instructor: Instructor, courses_count: int = 0) -> InstructorFullRead:
    data = InstructorFullRead.model_validate(instructor)
    data.courses_count = courses_count
    return data


@router.get("/", response_model=List[InstructorFullRead])
async def list_instructors(
    db: AsyncSession = Depends(get_db),
) -> Any:
    """فهرست اعضای هیئت علمی و مدرسین به همراه تعداد دوره‌های هر استاد"""
    stmt = (
        select(Instructor, func.count(Course.id))
        .outerjoin(Course, Course.instructor_id == Instructor.id)
        .group_by(Instructor.id)
        .order_by(Instructor.name)
    )
    res = await db.execute(stmt)
    return [to_read(inst, count) for inst, count in res.all()]


@router.get("/{instructor_id}", response_model=InstructorFullRead)
async def get_instructor(
    instructor_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """دریافت مشخصات کامل یک استاد"""
    res = await db.execute(select(Instructor).where(Instructor.id == instructor_id))
    instructor = res.scalars().first()
    if not instructor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="استاد مورد نظر یافت نشد.",
        )

    count_res = await db.execute(
        select(func.count(Course.id)).where(Course.instructor_id == instructor.id)
    )
    return to_read(instructor, count_res.scalar() or 0)


@router.post("/", response_model=InstructorFullRead, status_code=status.HTTP_201_CREATED)
async def create_instructor(
    instructor_in: InstructorCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """تعریف استاد جدید توسط ادمین"""
    name = instructor_in.name.strip()
    existing = await db.execute(select(Instructor).where(Instructor.name == name))
    if existing.scalars().first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="استادی با این نام قبلاً در سامانه ثبت شده است.",
        )

    instructor = Instructor(**{**instructor_in.model_dump(), "name": name})
    db.add(instructor)
    await db.commit()
    await db.refresh(instructor)
    return to_read(instructor, 0)


@router.put("/{instructor_id}", response_model=InstructorFullRead)
async def update_instructor(
    instructor_id: uuid.UUID,
    instructor_in: InstructorUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """ویرایش مشخصات، تصویر و بیوگرافی استاد توسط ادمین"""
    res = await db.execute(select(Instructor).where(Instructor.id == instructor_id))
    instructor = res.scalars().first()
    if not instructor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="استاد مورد نظر یافت نشد.",
        )

    updates = instructor_in.model_dump(exclude_unset=True)

    new_name = updates.get("name")
    if new_name:
        new_name = new_name.strip()
        clash = await db.execute(
            select(Instructor).where(
                Instructor.name == new_name, Instructor.id != instructor.id
            )
        )
        if clash.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="استاد دیگری با این نام در سامانه ثبت شده است.",
            )
        updates["name"] = new_name

    for field, value in updates.items():
        setattr(instructor, field, value)

    await db.commit()
    await db.refresh(instructor)

    count_res = await db.execute(
        select(func.count(Course.id)).where(Course.instructor_id == instructor.id)
    )
    return to_read(instructor, count_res.scalar() or 0)


@router.delete("/{instructor_id}", status_code=status.HTTP_200_OK)
async def delete_instructor(
    instructor_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """حذف استاد؛ تنها در صورتی که هیچ دوره‌ای به او تخصیص نیافته باشد"""
    res = await db.execute(
        select(Instructor)
        .where(Instructor.id == instructor_id)
        .options(selectinload(Instructor.courses))
    )
    instructor = res.scalars().first()
    if not instructor:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="استاد مورد نظر یافت نشد.",
        )

    if instructor.courses:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"این استاد مدرس {len(instructor.courses)} دوره فعال است. "
                "ابتدا دوره‌ها را به استاد دیگری تخصیص دهید."
            ),
        )

    await db.delete(instructor)
    await db.commit()
    return {"message": "استاد با موفقیت از سامانه حذف گردید."}
