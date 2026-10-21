import uuid
import re
from typing import List, Any
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.concurrency import run_in_threadpool
from sqlalchemy import select, func, or_
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from app.core import storage
from app.core.database import get_db
from app.core.deps import get_current_admin, get_optional_user
from app.models.user import User, UserRole
from app.models.course import Course, SyllabusTopic
from app.models.course_video import CourseVideo
from app.models.enrollment import Enrollment
from app.models.instructor import Instructor
from app.models.term import Term
from app.schemas.course import (
    CourseListRead,
    CourseDetailRead,
    CourseCreate,
    CourseUpdate,
    CourseImportRequest,
    CourseImportResult,
    CourseImportSkipped,
)

router = APIRouter()


async def find_term(ref: str, db: AsyncSession) -> Term:
    """Resolve a term by uuid or by its code (e.g. 1405-1)."""
    stmt = select(Term)
    try:
        stmt = stmt.where(Term.id == uuid.UUID(ref))
    except ValueError:
        stmt = stmt.where(Term.code == ref)
    found = (await db.execute(stmt)).scalars().first()
    if not found:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="ترم مورد نظر یافت نشد."
        )
    return found


def unique_slug_for(base: str, taken: set) -> str:
    slug = base
    while slug in taken:
        slug = f"{base}-{uuid.uuid4().hex[:4]}"
    taken.add(slug)
    return slug


@router.get("/", response_model=List[CourseListRead])
async def get_courses(
    include_inactive: bool = False,
    term: Optional[str] = None,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user),
) -> Any:
    """دریافت لیست تمامی دوره‌های آموزشی فعال به همراه اطلاعات استاد.
    مدیر می‌تواند با include_inactive=true دوره‌های غیرفعال را هم ببیند.

    term: کد یا شناسهٔ ترم، یا «all» برای همهٔ ترم‌ها. بدون این پارامتر فقط
    دوره‌های ترم جاری (به‌علاوهٔ دوره‌های بدون ترم) برگردانده می‌شود."""
    stmt = (
        select(Course)
        .options(selectinload(Course.instructor))
        .order_by(Course.course_number)
    )
    if not (include_inactive and user is not None and user.role == UserRole.ADMIN):
        stmt = stmt.where(Course.is_active == True)

    if term != "all":
        if term:
            wanted = await find_term(term, db)
            stmt = stmt.where(Course.term_id == wanted.id)
        else:
            current = (
                await db.execute(select(Term.id).where(Term.is_active == True))
            ).scalar()
            if current is not None:
                stmt = stmt.where(or_(Course.term_id == current, Course.term_id.is_(None)))
    result = await db.execute(stmt)
    courses = result.scalars().all()
    return courses


@router.post("/", response_model=CourseDetailRead, status_code=status.HTTP_201_CREATED)
async def create_course(
    course_in: CourseCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
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

    # 3. Resolve the instructor: an explicit id wins, otherwise find-or-create by name.
    instructor = None
    if course_in.instructor_id:
        res_inst = await db.execute(
            select(Instructor).where(Instructor.id == course_in.instructor_id)
        )
        instructor = res_inst.scalars().first()
        if not instructor:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="استاد انتخاب‌شده در سامانه یافت نشد.",
            )
        inst_name = instructor.name
    else:
        inst_name = (course_in.instructor_name or "").strip()
        if not inst_name:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="انتخاب استاد یا وارد کردن نام مدرس دوره الزامی است.",
            )
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

    # 4. The chosen term, else the current one
    if course_in.term_id:
        term = (
            await db.execute(select(Term).where(Term.id == course_in.term_id))
        ).scalars().first()
        if not term:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="ترم انتخاب‌شده یافت نشد."
            )
    else:
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
        .execution_options(populate_existing=True)
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


@router.put("/{course_id}", response_model=CourseDetailRead)
async def update_course(
    course_id: uuid.UUID,
    course_in: CourseUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """ویرایش مشخصات و سرفصل‌های دوره توسط ادمین"""
    stmt = (
        select(Course)
        .where(Course.id == course_id)
        .options(selectinload(Course.topics))
    )
    res = await db.execute(stmt)
    course = res.scalars().first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره مورد نظر یافت نشد.",
        )

    updates = course_in.model_dump(exclude_unset=True)
    topics = updates.pop("topics", None)
    instructor_id = updates.pop("instructor_id", None)
    instructor_name = updates.pop("instructor_name", None)

    new_term_id = updates.pop("term_id", None)
    if new_term_id:
        if not (await db.execute(select(Term.id).where(Term.id == new_term_id))).first():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="ترم انتخاب‌شده یافت نشد."
            )
        if new_term_id != course.term_id:
            enrolled = (
                await db.execute(
                    select(func.count(Enrollment.id)).where(Enrollment.course_id == course.id)
                )
            ).scalar() or 0
            if enrolled:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT,
                    detail=(
                        f"این دوره {enrolled} ثبت‌نام دارد و انتقال آن به ترم دیگر سوابق دانشجویان را "
                        "ناسازگار می‌کند. برای ترم جدید از «تکرار دوره در ترم دیگر» استفاده کنید."
                    ),
                )
            course.term_id = new_term_id

    if instructor_id:
        res_inst = await db.execute(select(Instructor).where(Instructor.id == instructor_id))
        if not res_inst.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="استاد انتخاب‌شده در سامانه یافت نشد.",
            )
        course.instructor_id = instructor_id
    elif instructor_name and instructor_name.strip():
        name = instructor_name.strip()
        res_inst = await db.execute(select(Instructor).where(Instructor.name == name))
        instructor = res_inst.scalars().first()
        if not instructor:
            instructor = Instructor(
                name=name,
                position="مدرس دوره تخصصی",
                department="دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر",
                specialization=updates.get("field") or course.field,
            )
            db.add(instructor)
            await db.flush()
        course.instructor_id = instructor.id

    for field, value in updates.items():
        setattr(course, field, value)

    # Topics are replaced wholesale when provided, so the syllabus always matches
    # exactly what the admin submitted.
    if topics is not None:
        for existing in list(course.topics):
            await db.delete(existing)
        await db.flush()
        for t in topics:
            db.add(SyllabusTopic(course_id=course.id, **t))

    await db.commit()

    reload_stmt = (
        select(Course)
        .where(Course.id == course.id)
        .options(selectinload(Course.instructor), selectinload(Course.topics))
        .execution_options(populate_existing=True)
    )
    reload_res = await db.execute(reload_stmt)
    return reload_res.scalars().first()


@router.delete("/{course_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_course(
    course_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> None:
    """حذف دوره توسط ادمین. دوره‌ای که دانشجو دارد حذف نمی‌شود و باید غیرفعال شود."""
    stmt = select(Course).where(Course.id == course_id)
    res = await db.execute(stmt)
    course = res.scalars().first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره مورد نظر یافت نشد.",
        )

    enrolled = (
        await db.execute(
            select(func.count(Enrollment.id)).where(Enrollment.course_id == course.id)
        )
    ).scalar() or 0
    if enrolled:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"این دوره {enrolled} ثبت‌نام دارد و حذف آن سوابق دانشجویان را از بین می‌برد. "
                "به‌جای حذف، دوره را غیرفعال کنید."
            ),
        )

    video_keys = (
        await db.execute(
            select(CourseVideo.storage_key).where(CourseVideo.course_id == course.id)
        )
    ).scalars().all()

    await db.delete(course)
    await db.commit()

    # Best effort: the rows are gone, so a leftover object only wastes space.
    for key in video_keys:
        try:
            await run_in_threadpool(storage.delete_object, key)
        except Exception:
            pass


@router.post("/import", response_model=CourseImportResult, status_code=status.HTTP_201_CREATED)
async def import_courses_into_term(
    body: CourseImportRequest,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """تکرار دوره‌ها در ترم دیگر.

    هر دوره با همهٔ مشخصات و سرفصل‌هایش در ترم مقصد کپی می‌شود تا نیازی به تعریف
    دوباره نباشد. ثبت‌نام‌ها و ویدیوهای ترم قبل منتقل نمی‌شوند (ویدیو فایل مشترک
    ندارد تا حذف یک دوره، ویدیوی دوره‌ای دیگر را از بین نبرد)."""
    target = (
        await db.execute(select(Term).where(Term.id == body.target_term_id))
    ).scalars().first()
    if not target:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="ترم مقصد یافت نشد."
        )
    if not body.course_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="حداقل یک دوره برای تکرار انتخاب کنید.",
        )

    sources = (
        await db.execute(
            select(Course)
            .where(Course.id.in_(set(body.course_ids)))
            .options(selectinload(Course.topics))
            .order_by(Course.course_number)
        )
    ).scalars().all()
    if not sources:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="دوره‌های انتخاب‌شده یافت نشدند."
        )

    in_target = (
        await db.execute(select(Course).where(Course.term_id == target.id))
    ).scalars().all()
    already_copied = {c.source_course_id for c in in_target if c.source_course_id}
    existing_titles = {(c.title_fa.strip(), c.title_en.strip().lower()) for c in in_target}

    taken_slugs = set((await db.execute(select(Course.slug))).scalars().all())
    next_number = (
        await db.execute(select(func.coalesce(func.max(Course.course_number), 0)))
    ).scalar()

    created, skipped = [], []
    for src in sources:
        reason = None
        if src.term_id == target.id:
            reason = "این دوره هم‌اکنون در همین ترم است."
        elif (
            src.id in already_copied
            or (src.title_fa.strip(), src.title_en.strip().lower()) in existing_titles
        ):
            reason = "این دوره قبلاً در ترم مقصد تعریف یا وارد شده است."
        if reason:
            skipped.append(
                CourseImportSkipped(course_id=src.id, title_fa=src.title_fa, reason=reason)
            )
            continue

        next_number += 1
        base_slug = re.sub(r"-\d{4}-\d+$", "", src.slug)
        copy = Course(
            course_number=next_number,
            term_id=target.id,
            instructor_id=src.instructor_id,
            source_course_id=src.id,
            image_url=src.image_url,
            title_fa=src.title_fa,
            title_en=src.title_en,
            slug=unique_slug_for(f"{base_slug}-{target.code}", taken_slugs),
            field=src.field,
            type=src.type,
            units=src.units,
            level=src.level,
            course_level=src.course_level,
            price=src.price,
            capacity=src.capacity,
            prerequisites=src.prerequisites,
            corequisites=src.corequisites,
            prerequisite_topics=src.prerequisite_topics,
            duration=src.duration,
            delivery_method=src.delivery_method,
            description=src.description,
            objectives=list(src.objectives or []),
            target_audience=list(src.target_audience or []),
            software_tools=[dict(t) for t in (src.software_tools or [])],
            grading_info=[dict(g) for g in (src.grading_info or [])],
            references=list(src.references or []),
            assignments_info=src.assignments_info,
            author=src.author,
            version=src.version,
            is_active=True,
        )
        db.add(copy)
        await db.flush()
        for topic in src.topics:
            db.add(
                SyllabusTopic(
                    course_id=copy.id,
                    order_index=topic.order_index,
                    title=topic.title,
                    description=topic.description,
                    sessions_count=topic.sessions_count,
                )
            )
        existing_titles.add((src.title_fa.strip(), src.title_en.strip().lower()))
        created.append(copy.id)

    await db.commit()

    created_courses = []
    if created:
        created_courses = (
            await db.execute(
                select(Course)
                .where(Course.id.in_(created))
                .options(selectinload(Course.instructor))
                .order_by(Course.course_number)
            )
        ).scalars().all()
    return CourseImportResult(created=created_courses, skipped=skipped)
