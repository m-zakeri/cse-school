import secrets
import uuid
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.core.deps import get_current_admin
from app.core.security import get_password_hash
from app.core.text import normalize_digits
from app.models.enrollment import Enrollment
from app.models.user import User, UserRole
from app.schemas.user import UserRead

router = APIRouter()

# No look-alike characters (0/O, 1/l/I): the password is read out or typed from a note.
_ALPHABET = "abcdefghjkmnpqrstuvwxyzACDEFGHJKLMNPQRTUVWXYZ2345679"


def new_temporary_password(length: int = 10) -> str:
    return "".join(secrets.choice(_ALPHABET) for _ in range(length))


class UserAdminRead(UserRead):
    enrollment_count: int = 0


class UserActiveUpdate(BaseModel):
    is_active: bool


class TemporaryPassword(BaseModel):
    user_id: uuid.UUID
    full_name: str
    temporary_password: str


async def _get_user(user_id: uuid.UUID, db: AsyncSession) -> User:
    user = (await db.execute(select(User).where(User.id == user_id))).scalars().first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="کاربر مورد نظر یافت نشد.")
    return user


@router.get("/", response_model=List[UserAdminRead])
async def list_users(
    q: Optional[str] = None,
    role: Optional[UserRole] = None,
    limit: int = 200,
    db: AsyncSession = Depends(get_db),
    _admin: User = Depends(get_current_admin),
) -> Any:
    """فهرست کاربران با جستجو در نام، ایمیل، کد ملی و شماره همراه (فقط مدیر)."""
    counts = (
        select(Enrollment.user_id, func.count(Enrollment.id).label("n"))
        .group_by(Enrollment.user_id)
        .subquery()
    )
    stmt = (
        select(User, func.coalesce(counts.c.n, 0))
        .outerjoin(counts, counts.c.user_id == User.id)
        .order_by(User.created_at.desc())
        .limit(max(1, min(limit, 500)))
    )
    if role:
        stmt = stmt.where(User.role == role)
    if q and q.strip():
        term = normalize_digits(q.strip())
        like = f"%{term}%"
        stmt = stmt.where(
            or_(
                User.full_name.ilike(like),
                User.email.ilike(like),
                User.national_id.ilike(like),
                User.phone_number.ilike(like),
            )
        )
    result = []
    for user, count in (await db.execute(stmt)).all():
        data = UserAdminRead.model_validate(user)
        data.enrollment_count = int(count)
        result.append(data)
    return result


@router.post("/{user_id}/reset-password", response_model=TemporaryPassword)
async def reset_user_password(
    user_id: uuid.UUID,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
) -> Any:
    """صدور کلمه عبور موقت برای کاربری که رمزش را فراموش کرده است (فقط مدیر).

    کلمه عبور فقط یک بار در پاسخ نمایش داده می‌شود و کاربر پس از ورود ملزم به
    انتخاب کلمه عبور جدید است."""
    user = await _get_user(user_id, db)
    password = new_temporary_password()
    user.hashed_password = get_password_hash(password)
    user.must_change_password = True
    await db.commit()
    return TemporaryPassword(user_id=user.id, full_name=user.full_name, temporary_password=password)


@router.patch("/{user_id}", response_model=UserRead)
async def set_user_active(
    user_id: uuid.UUID,
    payload: UserActiveUpdate,
    db: AsyncSession = Depends(get_db),
    admin: User = Depends(get_current_admin),
) -> Any:
    """فعال یا غیرفعال کردن حساب کاربری (فقط مدیر). مدیر نمی‌تواند خودش را غیرفعال کند."""
    user = await _get_user(user_id, db)
    if user.id == admin.id and not payload.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="امکان غیرفعال کردن حساب کاربری خودتان وجود ندارد.",
        )
    user.is_active = payload.is_active
    await db.commit()
    await db.refresh(user)
    return user
