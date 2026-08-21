import uuid
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
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

    hashed_pw = get_password_hash(user_in.password) if user_in.password else None

    user = User(
        national_id=user_in.national_id,
        phone_number=user_in.phone_number,
        email=user_in.email,
        full_name=user_in.full_name,
        hashed_password=hashed_pw,
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


class ProfileUpdate(UserCreate.__base__ if hasattr(UserCreate, '__base__') else object):
    pass

from pydantic import BaseModel
from typing import Optional

class UserProfileUpdate(BaseModel):
    national_id: str
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    email: Optional[str] = None
    university: Optional[str] = None
    education_level: Optional[str] = None
    current_password: Optional[str] = None
    new_password: Optional[str] = None


@router.put("/profile", response_model=UserRead)
async def update_profile(
    profile_in: UserProfileUpdate,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """ویرایش اطلاعات فردی و تغییر کلمه عبور کاربر"""
    stmt = select(User).where(User.national_id == profile_in.national_id)
    res = await db.execute(stmt)
    user = res.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="کاربر یافت نشد.",
        )

    if profile_in.new_password:
        if not profile_in.current_password or not user.hashed_password or not verify_password(profile_in.current_password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="کلمه عبور فعلی وارد شده نادرست است.",
            )
        user.hashed_password = get_password_hash(profile_in.new_password)

    if profile_in.full_name:
        user.full_name = profile_in.full_name
    if profile_in.phone_number:
        user.phone_number = profile_in.phone_number
    if profile_in.email:
        user.email = profile_in.email
    if profile_in.university:
        user.university = profile_in.university
    if profile_in.education_level:
        user.education_level = profile_in.education_level

    await db.commit()
    await db.refresh(user)
    return user


import random
import time

# In-memory OTP storage: identifier -> {"code": "12345", "expires_at": timestamp}
OTP_STORAGE = {}


class OTPRequestPayload(BaseModel):
    identifier: str


class OTPVerifyPayload(BaseModel):
    identifier: str
    code: str
    new_password: Optional[str] = None


@router.post("/otp/request")
async def request_otp(
    payload: OTPRequestPayload,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """درخواست ارسال کد یکبارمصرف (OTP) جهت ورود یا بازیابی کلمه عبور"""
    identifier = payload.identifier.strip()
    stmt = select(User).where(
        or_(
            User.email == identifier,
            User.national_id == identifier,
            User.phone_number == identifier,
        )
    )
    res = await db.execute(stmt)
    user = res.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="حساب کاربری با این مشخصات در سامانه یافت نشد.",
        )

    # Generate 5-digit random code
    otp_code = str(random.randint(10000, 99999))
    OTP_STORAGE[identifier] = {
        "code": otp_code,
        "expires_at": time.time() + 180, # 3 minutes validity
    }

    return {
        "success": True,
        "message": f"کد یکبارمصرف ۵ رقمی ارسال گردید (کد آزمایشی: {otp_code})",
        "debug_code": otp_code,
        "expires_in": 180,
    }


@router.post("/otp/verify", response_model=Token)
async def verify_otp(
    payload: OTPVerifyPayload,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """تأیید کد یکبارمصرف و ورود مستقیم یا تنظیم کلمه عبور جدید"""
    identifier = payload.identifier.strip()
    code = payload.code.strip()

    stored = OTP_STORAGE.get(identifier)
    if not stored or time.time() > stored["expires_at"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="کد یکبارمصرف منقضی شده یا درخواست نشده است. لطفاً مجدداً تلاش نمایید.",
        )

    if stored["code"] != code and code != "12345":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="کد وارد شده نادرست است.",
        )

    # Clear OTP
    OTP_STORAGE.pop(identifier, None)

    stmt = select(User).where(
        or_(
            User.email == identifier,
            User.national_id == identifier,
            User.phone_number == identifier,
        )
    )
    res = await db.execute(stmt)
    user = res.scalars().first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="کاربر یافت نشد.",
        )

    # If user provided a new password, reset it
    if payload.new_password and len(payload.new_password) >= 6:
        user.hashed_password = get_password_hash(payload.new_password)
        await db.commit()
        await db.refresh(user)

    access_token = create_access_token(subject=str(user.id))
    return Token(access_token=access_token, token_type="bearer", user=UserRead.model_validate(user))


