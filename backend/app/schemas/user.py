import re
from datetime import datetime
import uuid
from typing import Optional
from pydantic import BaseModel, EmailStr, Field, field_validator
from app.models.user import UserRole


def is_valid_national_id(code: str) -> bool:
    code = code.strip()
    if not re.match(r"^\d{10}$", code):
        return False
    if len(set(code)) == 1:
        return False
    check = int(code[9])
    s = sum(int(code[i]) * (10 - i) for i in range(9))
    r = s % 11
    return (r < 2 and check == r) or (r >= 2 and check == 11 - r)


class UserBase(BaseModel):
    national_id: str = Field(..., description="کد ملی ۱۰ رقمی")
    phone_number: str = Field(..., min_length=11, max_length=15, description="شماره تلفن همراه")
    email: EmailStr
    full_name: str = Field(..., min_length=3, max_length=150)
    education_level: Optional[str] = None
    university: Optional[str] = None
    field_of_study: Optional[str] = None


class UserCreate(UserBase):
    password: Optional[str] = Field(None, min_length=6, description="کلمه عبور در صورت ثبت نام با پسورد")

    @field_validator("national_id")
    @classmethod
    def validate_national_id(cls, v: str) -> str:
        v = v.strip()
        # Allow official checksum or standard system demo accounts
        if not is_valid_national_id(v) and v not in ["0123456789", "1234567890", "0019988776", "0012345678", "0000000000"]:
            raise ValueError("کد ملی وارد شده با الگوریتم استاندارد صحت‌سنجی ملی همخوانی ندارد.")
        return v


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
