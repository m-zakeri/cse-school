import uuid
from datetime import datetime
import enum
from sqlalchemy import String, Boolean, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class UserRole(str, enum.Enum):
    STUDENT = "STUDENT"
    INSTRUCTOR = "INSTRUCTOR"
    ADMIN = "ADMIN"


class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    national_id: Mapped[str] = mapped_column(
        String(10), unique=True, index=True, nullable=False, doc="کد ملی ده رقمی"
    )
    phone_number: Mapped[str] = mapped_column(
        String(15), unique=True, index=True, nullable=False, doc="شماره تلفن همراه"
    )
    email: Mapped[str] = mapped_column(
        String(255), unique=True, index=True, nullable=False, doc="آدرس ایمیل"
    )
    full_name: Mapped[str] = mapped_column(
        String(150), nullable=False, doc="نام و نام خانوادگی"
    )
    hashed_password: Mapped[str] = mapped_column(
        String(255), nullable=True, doc="هش کلمه عبور"
    )
    education_level: Mapped[str] = mapped_column(
        String(100), nullable=True, doc="مقطع تحصیلی"
    )
    university: Mapped[str] = mapped_column(
        String(150), nullable=True, doc="دانشگاه یا سازمان محل تحصیل"
    )
    field_of_study: Mapped[str] = mapped_column(
        String(150), nullable=True, doc="رشته تحصیلی"
    )
    role: Mapped[UserRole] = mapped_column(
        Enum(UserRole), default=UserRole.STUDENT, nullable=False
    )
    is_verified: Mapped[bool] = mapped_column(
        Boolean, default=False, nullable=False, doc="تایید شماره همراه یا کد ملی"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    enrollments = relationship("Enrollment", back_populates="user", cascade="all, delete-orphan")
    payments = relationship("Payment", back_populates="user")
    certificates = relationship("Certificate", back_populates="user")
