import re
import uuid
from datetime import date
from typing import Optional

from pydantic import BaseModel, Field, field_validator, model_validator

from app.core.text import normalize_digits

_CODE_RE = re.compile(r"^[0-9A-Za-z][0-9A-Za-z\-]{0,19}$")


class TermBrief(BaseModel):
    """The slice of a term that rides along with every course."""

    id: uuid.UUID
    code: str
    title: str
    is_active: bool

    class Config:
        from_attributes = True


class _TermDates(BaseModel):
    registration_start: Optional[date] = None
    registration_end: Optional[date] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    makeup_start: Optional[date] = None
    makeup_end: Optional[date] = None
    exam_start: Optional[date] = None
    exam_end: Optional[date] = None
    certificate_date: Optional[date] = None

    @model_validator(mode="after")
    def _ranges_are_ordered(self):
        for a, b, label in (
            ("registration_start", "registration_end", "بازهٔ ثبت‌نام"),
            ("start_date", "end_date", "بازهٔ برگزاری کلاس‌ها"),
            ("makeup_start", "makeup_end", "بازهٔ جلسات رفع اشکال"),
            ("exam_start", "exam_end", "بازهٔ آزمون پایانی"),
        ):
            first, second = getattr(self, a), getattr(self, b)
            if first and second and first > second:
                raise ValueError(f"تاریخ شروع {label} نباید بعد از تاریخ پایان آن باشد.")
        return self


def _clean_code(value: str) -> str:
    code = normalize_digits(value).strip()
    if not _CODE_RE.match(code):
        raise ValueError("کد ترم فقط شامل حروف انگلیسی، عدد و خط تیره باشد (مثال: 1405-1).")
    return code


class TermCreate(_TermDates):
    title: str = Field(min_length=2, max_length=100)
    code: str
    is_active: bool = False

    @field_validator("code")
    @classmethod
    def _code(cls, v: str) -> str:
        return _clean_code(v)

    @field_validator("title")
    @classmethod
    def _title(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2:
            raise ValueError("عنوان ترم را وارد کنید.")
        return v


class TermUpdate(_TermDates):
    """Only what is sent changes, so every field is optional. A date sent as null clears it."""

    title: Optional[str] = Field(default=None, min_length=2, max_length=100)
    code: Optional[str] = None
    is_active: Optional[bool] = None

    @field_validator("code")
    @classmethod
    def _code(cls, v: Optional[str]) -> Optional[str]:
        return None if v is None else _clean_code(v)


class TermRead(_TermDates):
    id: uuid.UUID
    title: str
    code: str
    is_active: bool
    course_count: int = 0

    class Config:
        from_attributes = True
