import uuid
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import ValidationError
from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.models.course import Course
from app.models.enrollment import Enrollment
from app.models.term import Term
from app.models.user import User
from app.schemas.term import TermCreate, TermRead, TermUpdate

router = APIRouter()


async def _course_counts(db: AsyncSession) -> dict:
    res = await db.execute(
        select(Course.term_id, func.count(Course.id))
        .where(Course.term_id.is_not(None), Course.is_active == True)  # noqa: E712
        .group_by(Course.term_id)
    )
    return {term_id: count for term_id, count in res.all()}


def _to_read(term: Term, counts: dict) -> TermRead:
    data = TermRead.model_validate(term)
    data.course_count = counts.get(term.id, 0)
    return data


async def _get_term(term_id: uuid.UUID, db: AsyncSession) -> Term:
    term = (await db.execute(select(Term).where(Term.id == term_id))).scalars().first()
    if not term:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="ترم مورد نظر یافت نشد."
        )
    return term


async def _ensure_code_free(code: str, db: AsyncSession, except_id: Optional[uuid.UUID] = None) -> None:
    stmt = select(Term.id).where(Term.code == code)
    if except_id:
        stmt = stmt.where(Term.id != except_id)
    if (await db.execute(stmt)).first():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"ترمی با کد «{code}» از قبل تعریف شده است.",
        )


async def _make_only_active(term: Term, db: AsyncSession) -> None:
    """Exactly one term is the current one; registration is open only for its courses."""
    await db.execute(update(Term).where(Term.id != term.id).values(is_active=False))
    term.is_active = True


@router.get("/", response_model=List[TermRead])
async def list_terms(db: AsyncSession = Depends(get_db)) -> Any:
    """فهرست همهٔ ترم‌ها (جدیدترین اول) به همراه تعداد دوره‌های فعال هر ترم"""
    terms = (
        await db.execute(
            select(Term).order_by(Term.start_date.desc().nulls_last(), Term.code.desc())
        )
    ).scalars().all()
    counts = await _course_counts(db)
    return [_to_read(t, counts) for t in terms]


@router.get("/current", response_model=Optional[TermRead])
async def get_current_term(db: AsyncSession = Depends(get_db)) -> Any:
    """ترم جاری که ثبت‌نام در دوره‌های آن باز است؛ اگر ترم جاری تعیین نشده باشد null"""
    term = (
        await db.execute(select(Term).where(Term.is_active == True))  # noqa: E712
    ).scalars().first()
    if not term:
        return None
    return _to_read(term, await _course_counts(db))


@router.post("/", response_model=TermRead, status_code=status.HTTP_201_CREATED)
async def create_term(
    term_in: TermCreate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """تعریف ترم (فصل) جدید توسط ادمین"""
    await _ensure_code_free(term_in.code, db)

    data = term_in.model_dump()
    make_current = data.pop("is_active")
    term = Term(**data, is_active=False)
    db.add(term)
    await db.flush()
    if make_current:
        await _make_only_active(term, db)
    await db.commit()
    await db.refresh(term)
    return _to_read(term, {})


@router.put("/{term_id}", response_model=TermRead)
async def update_term(
    term_id: uuid.UUID,
    term_in: TermUpdate,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """ویرایش عنوان، کد و تاریخ‌های تقویم آموزشی یک ترم"""
    term = await _get_term(term_id, db)
    updates = term_in.model_dump(exclude_unset=True)

    # title/code are required columns: an explicit null must not blank them out.
    for required in ("title", "code"):
        if required in updates and updates[required] is None:
            updates.pop(required)

    if "code" in updates:
        await _ensure_code_free(updates["code"], db, except_id=term.id)

    make_current = updates.pop("is_active", None)
    for field, value in updates.items():
        setattr(term, field, value)

    # Re-check the ranges against the merged record, not just what was sent.
    try:
        TermUpdate.model_validate(
            {
                k: getattr(term, k)
                for k in (
                    "registration_start", "registration_end", "start_date", "end_date",
                    "makeup_start", "makeup_end", "exam_start", "exam_end",
                )
            }
        )
    except ValidationError as exc:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=exc.errors()[0]["msg"].removeprefix("Value error, "),
        )

    if make_current is True:
        await _make_only_active(term, db)
    elif make_current is False:
        term.is_active = False

    await db.commit()
    await db.refresh(term)
    return _to_read(term, await _course_counts(db))


@router.post("/{term_id}/activate", response_model=TermRead)
async def activate_term(
    term_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """تعیین ترم جاری؛ ثبت‌نام فقط در دوره‌های همین ترم باز می‌ماند"""
    term = await _get_term(term_id, db)
    await _make_only_active(term, db)
    await db.commit()
    await db.refresh(term)
    return _to_read(term, await _course_counts(db))


@router.delete("/{term_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_term(
    term_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> None:
    """حذف ترم خالی. ترمی که دوره یا ثبت‌نام دارد حذف نمی‌شود."""
    term = await _get_term(term_id, db)

    courses = (
        await db.execute(select(func.count(Course.id)).where(Course.term_id == term.id))
    ).scalar() or 0
    enrollments = (
        await db.execute(select(func.count(Enrollment.id)).where(Enrollment.term_id == term.id))
    ).scalar() or 0
    if courses or enrollments:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=(
                f"این ترم {courses} دوره و {enrollments} ثبت‌نام دارد و قابل حذف نیست. "
                "ابتدا دوره‌های آن را به ترم دیگری منتقل یا حذف کنید."
            ),
        )

    await db.delete(term)
    await db.commit()
