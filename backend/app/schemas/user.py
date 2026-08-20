from datetime import datetime
import uuid
from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole


class UserBase(BaseModel):
    national_id: str = Field(..., min_length=10, max_length=10, description="کد ملی ۱۰ رقمی")
    phone_number: str = Field(..., min_length=11, max_length=15, description="شماره تلفن همراه")
    email: EmailStr
    full_name: str = Field(..., min_length=3, max_length=150)
    education_level: Optional[str] = None
    university: Optional[str] = None
    field_of_study: Optional[str] = None


class UserCreate(UserBase):
    password: Optional[str] = Field(None, min_length=6, description="کلمه عبور در صورت ثبت نام با پسورد")


class UserLogin(BaseModel):
    identifier: str = Field(..., description="ایمیل یا کد ملی یا شماره همراه")
    password: str


class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    education_level: Optional[str] = None
    university: Optional[str] = None
    field_of_study: Optional[str] = None


class UserRead(UserBase):
    id: uuid.UUID
    role: UserRole
    is_verified: bool
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserRead
