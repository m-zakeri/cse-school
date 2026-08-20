import uuid
import re
from typing import List, Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.course import Course, SyllabusTopic
from app.models.instructor import Instructor
from app.models.term import Term
from app.schemas.course import CourseListRead, CourseDetailRead, CourseCreate

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


@router.post("/", response_model=CourseDetailRead, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_in: CourseCreate,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """ایجاد و تعریف دوره جدید به همراه سرفصل‌ها توسط ادمین"""
    # 1. Generate slug if not provided
    slug = course_in.slug
    if not slug:
        slug = re.sub(r"[^a-zA-Z0-9]+", "-", course_in.title_en.lower()).strip("-")
        if not slug:
            slug = f"course-{uuid.uuid4().hex[:6]}"

    # Check slug uniqueness
    res_slug = await db.execute(select(Course).where(Course.slug == slug))
    if res_slug.scalars().first():
        slug = f"{slug}-{uuid.uuid4().hex[:4]}"

    # 2. Get next course_number
    max_num_res = await db.execute(select(func.coalesce(func.max(Course.course_number), 0)))
    next_course_number = max_num_res.scalar() + 1

    # 3. Find or Create Instructor
    inst_name = course_in.instructor_name.strip()
    res_inst = await db.execute(select(Instructor).where(Instructor.name == inst_name))
    instructor = res_inst.scalars().first()
    if not instructor:
        instructor = Instructor(
            name=inst_name,
            position="مدرس دوره تخصصی",
            department="دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر",
            specialization=course_in.field,
        )
        db.add(instructor)
        await db.flush()

    # 4. Get active Term
    res_term = await db.execute(select(Term).where(Term.is_active == True))
    term = res_term.scalars().first()

    # 5. Create Course
    course = Course(
        course_number=next_course_number,
        term_id=term.id if term else None,
        instructor_id=instructor.id,
        title_fa=course_in.title_fa,
        title_en=course_in.title_en,
        slug=slug,
        field=course_in.field,
        type=course_in.type,
        units=course_in.units,
        level=course_in.level,
        course_level=course_in.course_level,
        price=course_in.price,
        capacity=course_in.capacity,
        prerequisites=course_in.prerequisites,
        corequisites=course_in.corequisites,
        prerequisite_topics=course_in.prerequisite_topics,
        duration=course_in.duration,
        delivery_method=course_in.delivery_method,
        description=course_in.description,
        objectives=course_in.objectives,
        target_audience=course_in.target_audience,
        software_tools=course_in.software_tools,
        grading_info=course_in.grading_info,
        references=course_in.references,
        assignments_info=course_in.assignments_info,
        author=course_in.author or inst_name,
        version=course_in.version,
        is_active=True,
    )
    db.add(course)
    await db.flush()

    # 6. Add Syllabus Topics
    for t_in in course_in.topics:
        topic = SyllabusTopic(
            course_id=course.id,
            order_index=t_in.order_index,
            title=t_in.title,
            description=t_in.description,
            sessions_count=t_in.sessions_count,
        )
        db.add(topic)

    await db.commit()

    # Reload full course details
    stmt_full = (
        select(Course)
        .where(Course.id == course.id)
        .options(
            selectinload(Course.instructor),
            selectinload(Course.topics),
        )
    )
    res_full = await db.execute(stmt_full)
    return res_full.scalars().first()


@router.get("/{identifier}", response_model=CourseDetailRead)
async def get_course_detail(
    identifier: str,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """دریافت مشخصات تفصیلی دوره به همراه سرفصل‌های جلسات"""
    stmt = (
        select(Course)
        .options(
            selectinload(Course.instructor),
            selectinload(Course.topics),
        )
    )

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


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
) -> None:
    """حذف یا غیرفعال‌سازی دوره توسط ادمین"""
    stmt = select(Course).where(Course.id == course_id)
    res = await db.execute(stmt)
    course = res.scalars().first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره مورد نظر یافت نشد.",
        )

    await db.delete(course)
    await db.commit()
