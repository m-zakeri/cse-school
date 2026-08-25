from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy import select, or_, and_
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.deps import get_current_user
from app.core.security import create_access_token, verify_password, get_password_hash
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserLogin, UserRead, Token

router = APIRouter()


@router.post("/register", response_model=Token, status_code=status.HTTP_201_CREATED)
async def register_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """ثبت‌نام کاربر جدید با بررسی یکتایی کد ملی، شماره تماس و ایمیل"""
    # Check if user already exists with national_id, phone or email
    stmt = select(User).where(
        or_(
            User.national_id == user_in.national_id,
            User.phone_number == user_in.phone_number,
            User.email == user_in.email,
        )
    )
    res = await db.execute(stmt)
    existing_user = res.scalars().first()

    if existing_user:
        if existing_user.national_id == user_in.national_id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="کاربری با این کد ملی قبلاً در سامانه ثبت‌نام کرده است.",
            )
        if existing_user.phone_number == user_in.phone_number:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="کاربری با این شماره تلفن همراه قبلاً در سامانه ثبت‌نام کرده است.",
            )
        if existing_user.email == user_in.email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="کاربری با این آدرس ایمیل قبلاً در سامانه ثبت‌نام کرده است.",
            )

    if not user_in.password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="انتخاب کلمه عبور برای ایجاد حساب کاربری الزامی است.",
        )

    user = User(
        national_id=user_in.national_id,
        phone_number=user_in.phone_number,
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=get_password_hash(user_in.password),
        education_level=user_in.education_level,
        university=user_in.university,
        field_of_study=user_in.field_of_study,
        role=UserRole.STUDENT,
        is_verified=True,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)

    access_token = create_access_token(subject=str(user.id))
    return Token(access_token=access_token, token_type="bearer", user=UserRead.model_validate(user))


@router.post("/login", response_model=Token)
async def login(
    login_data: UserLogin,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """ورود کاربر با ایمیل، کد ملی یا شماره همراه"""
    stmt = select(User).where(
        or_(
            User.email == login_data.identifier,
            User.national_id == login_data.identifier,
            User.phone_number == login_data.identifier,
        )
    )
    res = await db.execute(stmt)
    user = res.scalars().first()

    if not user or not user.hashed_password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="اطلاعات کاربری یا کلمه عبور وارد شده نادرست است.",
        )

    if not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="اطلاعات کاربری یا کلمه عبور وارد شده نادرست است.",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="حساب کاربری شما غیرفعال شده است.",
        )

    access_token = create_access_token(subject=str(user.id))
    return Token(access_token=access_token, token_type="bearer", user=UserRead.model_validate(user))


class UserProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=3, max_length=150)
    phone_number: Optional[str] = Field(None, min_length=11, max_length=15)
    email: Optional[EmailStr] = None
    university: Optional[str] = None
    education_level: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = Field(None, min_length=6)


@router.get("/me", response_model=UserRead)
async def read_current_user(
    current_user: User = Depends(get_current_user),
) -> Any:
    """دریافت اطلاعات کاربر احراز هویت‌شده جاری"""
    return current_user


@router.put("/profile", response_model=UserRead)
async def update_profile(
    profile_in: UserProfileUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """ویرایش اطلاعات فردی و تغییر کلمه عبور کاربر احراز هویت‌شده"""
    user = current_user

    if profile_in.new_password:
        if (
            not profile_in.current_password
            or not user.hashed_password
            or not verify_password(profile_in.current_password, user.hashed_password)
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="کلمه عبور فعلی وارد شده نادرست است.",
            )
        user.hashed_password = get_password_hash(profile_in.new_password)

    # Changing contact identifiers is a sensitive operation: require the current password
    # and make sure the new value is not already taken by another account.
    for field in ("phone_number", "email"):
        new_value = getattr(profile_in, field)
        if not new_value or new_value == getattr(user, field):
            continue

        if not profile_in.current_password or not user.hashed_password or not verify_password(
            profile_in.current_password, user.hashed_password
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="برای تغییر ایمیل یا شماره همراه، وارد کردن کلمه عبور فعلی الزامی است.",
            )

        stmt = select(User).where(
            and_(getattr(User, field) == new_value, User.id != user.id)
        )
        res = await db.execute(stmt)
        if res.scalars().first():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="این ایمیل یا شماره همراه قبلاً توسط کاربر دیگری ثبت شده است.",
            )
        setattr(user, field, new_value)

    if profile_in.full_name:
        user.full_name = profile_in.full_name
    if profile_in.university:
        user.university = profile_in.university
    if profile_in.education_level:
        user.education_level = profile_in.education_level

    await db.commit()
    await db.refresh(user)
    return user
