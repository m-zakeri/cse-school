import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Instructor(Base):
    __tablename__ = "instructors"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    name: Mapped[str] = mapped_column(
        String(150), nullable=False, doc="نام و نام خانوادگی استاد"
    )
    position: Mapped[str] = mapped_column(
        String(100), nullable=True, doc="مرتبه علمی مثلا استادیار دانشکده مهندسی کامپیوتر"
    )
    department: Mapped[str] = mapped_column(
        String(150), default="دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر", nullable=False
    )
    specialization: Mapped[str] = mapped_column(
        String(255), nullable=True, doc="زمینه تخصصی پژوهشی"
    )
    image_url: Mapped[str] = mapped_column(
        String(500), nullable=True, doc="آدرس تصویر پروفایل"
    )
    profile_link: Mapped[str] = mapped_column(
        String(500), nullable=True, doc="لینک صفحه رسمی دانشگاه"
    )
    bio: Mapped[str] = mapped_column(
        Text, nullable=True, doc="شرح بیوگرافی و سوابق"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    # Relationships
    courses = relationship("Course", back_populates="instructor")
