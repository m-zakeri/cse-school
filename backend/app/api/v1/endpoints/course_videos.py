import os
import uuid
from typing import Any, List, Optional

from fastapi import (
    APIRouter,
    Depends,
    File,
    Form,
    HTTPException,
    UploadFile,
    status,
)
from fastapi.concurrency import run_in_threadpool
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.database import get_db
from app.core.deps import get_current_admin, get_optional_user
from app.core import storage
from app.models.course import Course
from app.models.course_video import CourseVideo
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.user import User, UserRole
from app.schemas.course_video import (
    CourseVideoPlayback,
    CourseVideoRead,
    CourseVideoUpdate,
)

router = APIRouter()

# Enrollment states that count as "this student may watch the lectures".
_WATCHING_STATES = (EnrollmentStatus.REGISTERED, EnrollmentStatus.COMPLETED)


async def _resolve_course(identifier: str, db: AsyncSession) -> Course:
    stmt = select(Course)
    if identifier.isdigit():
        stmt = stmt.where(Course.course_number == int(identifier))
    else:
        try:
            stmt = stmt.where(Course.id == uuid.UUID(identifier))
        except ValueError:
            stmt = stmt.where(Course.slug == identifier)
    course = (await db.execute(stmt)).scalars().first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="دوره مورد نظر یافت نشد."
        )
    return course


async def _has_course_access(
    user: Optional[User], course: Course, db: AsyncSession
) -> bool:
    """Admins see everything; students must have an active enrollment."""
    if user is None:
        return False
    if user.role == UserRole.ADMIN:
        return True
    stmt = select(Enrollment.id).where(
        Enrollment.user_id == user.id,
        Enrollment.course_id == course.id,
        Enrollment.status.in_(_WATCHING_STATES),
    )
    return (await db.execute(stmt)).first() is not None


@router.get("/{identifier}/videos", response_model=List[CourseVideoRead])
async def list_course_videos(
    identifier: str,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user),
) -> Any:
    """فهرست ویدیوهای دوره. عنوان‌ها برای همه دیده می‌شود؛ فیلد locked مشخص
    می‌کند که کاربر اجازه پخش دارد یا باید ثبت‌نام کند."""
    course = await _resolve_course(identifier, db)
    has_access = await _has_course_access(user, course, db)

    stmt = (
        select(CourseVideo)
        .where(CourseVideo.course_id == course.id)
        .order_by(CourseVideo.order_index, CourseVideo.created_at)
    )
    videos = (await db.execute(stmt)).scalars().all()

    result = []
    for v in videos:
        data = CourseVideoRead.model_validate(v)
        data.locked = not (has_access or v.is_free_preview)
        result.append(data)
    return result


@router.get(
    "/{identifier}/videos/{video_id}/playback",
    response_model=CourseVideoPlayback,
)
async def get_video_playback(
    identifier: str,
    video_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    user: Optional[User] = Depends(get_optional_user),
) -> Any:
    """صدور لینک موقت پخش ویدیو پس از بررسی دسترسی کاربر."""
    course = await _resolve_course(identifier, db)

    stmt = select(CourseVideo).where(
        CourseVideo.id == video_id, CourseVideo.course_id == course.id
    )
    video = (await db.execute(stmt)).scalars().first()
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="ویدیو مورد نظر یافت نشد."
        )

    if not video.is_free_preview and not await _has_course_access(user, course, db):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="برای مشاهده ویدیوهای این دوره باید در آن ثبت‌نام کرده باشید.",
        )

    url = storage.presigned_get_url(video.storage_key)
    return CourseVideoPlayback(
        id=video.id,
        title=video.title,
        url=url,
        expires_in=settings.VIDEO_URL_EXPIRE_SECONDS,
        content_type=video.content_type,
    )


@router.post(
    "/{course_id}/videos",
    response_model=CourseVideoRead,
    status_code=status.HTTP_201_CREATED,
)
async def upload_course_video(
    course_id: uuid.UUID,
    file: UploadFile = File(...),
    title: str = Form(...),
    order_index: int = Form(1),
    is_free_preview: bool = Form(False),
    duration_seconds: Optional[int] = Form(None),
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """بارگذاری ویدیوی جدید برای دوره (فقط مدیر). فایل در فضای ذخیره‌سازی
    آبجکتی قرار می‌گیرد و فقط اطلاعات آن در دیتابیس ثبت می‌شود."""
    course = (
        await db.execute(select(Course).where(Course.id == course_id))
    ).scalars().first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="دوره مورد نظر یافت نشد."
        )

    content_type = file.content_type or "application/octet-stream"
    if not content_type.startswith("video/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="فقط فایل ویدیویی قابل بارگذاری است.",
        )

    if file.size and file.size > settings.VIDEO_MAX_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="حجم فایل بیش از حد مجاز است.",
        )

    ext = os.path.splitext(file.filename or "")[1].lower() or ".mp4"
    key = f"courses/{course.id}/{uuid.uuid4().hex}{ext}"

    await file.seek(0)
    # Idempotent, and cheap: makes the first upload work even if the bucket
    # was not created at startup (storage came up after the backend).
    await run_in_threadpool(storage.ensure_bucket)
    await run_in_threadpool(storage.upload_fileobj, file.file, key, content_type)

    video = CourseVideo(
        course_id=course.id,
        title=title.strip(),
        order_index=order_index,
        storage_key=key,
        content_type=content_type,
        size_bytes=file.size or 0,
        duration_seconds=duration_seconds,
        is_free_preview=is_free_preview,
    )
    db.add(video)
    await db.commit()
    await db.refresh(video)

    data = CourseVideoRead.model_validate(video)
    data.locked = False
    return data


@router.patch("/{course_id}/videos/{video_id}", response_model=CourseVideoRead)
async def update_course_video(
    course_id: uuid.UUID,
    video_id: uuid.UUID,
    payload: CourseVideoUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """ویرایش عنوان، ترتیب یا وضعیت پیش‌نمایش رایگان ویدیو (فقط مدیر)."""
    stmt = select(CourseVideo).where(
        CourseVideo.id == video_id, CourseVideo.course_id == course_id
    )
    video = (await db.execute(stmt)).scalars().first()
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="ویدیو مورد نظر یافت نشد."
        )

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(video, field, value)

    await db.commit()
    await db.refresh(video)
    data = CourseVideoRead.model_validate(video)
    data.locked = False
    return data


@router.delete(
    "/{course_id}/videos/{video_id}", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_course_video(
    course_id: uuid.UUID,
    video_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> None:
    """حذف ویدیو از دوره و از فضای ذخیره‌سازی (فقط مدیر)."""
    stmt = select(CourseVideo).where(
        CourseVideo.id == video_id, CourseVideo.course_id == course_id
    )
    video = (await db.execute(stmt)).scalars().first()
    if not video:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="ویدیو مورد نظر یافت نشد."
        )

    key = video.storage_key
    await db.delete(video)
    await db.commit()

    # Best effort: a leftover object is harmless, a failed request is not.
    try:
        await run_in_threadpool(storage.delete_object, key)
    except Exception:
        pass
