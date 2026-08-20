import uuid
from datetime import datetime, date
from sqlalchemy import String, Boolean, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Term(Base):
    __tablename__ = "terms"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    title: Mapped[str] = mapped_column(
        String(100), nullable=False, doc="عنوان ترم مثلا: ترم پاییز ۱۴۰۴"
    )
    code: Mapped[str] = mapped_column(
        String(20), unique=True, index=True, nullable=False, doc="کد یکتای ترم: 1404-1"
    )
    registration_start: Mapped[date] = mapped_column(
        Date, nullable=True, doc="تاریخ شروع ثبت‌نام"
    )
    registration_end: Mapped[date] = mapped_column(
        Date, nullable=True, doc="مهلت نهایی ثبت‌نام"
    )
    start_date: Mapped[date] = mapped_column(
        Date, nullable=True, doc="تاریخ شروع کلاس‌ها"
    )
    end_date: Mapped[date] = mapped_column(
        Date, nullable=True, doc="تاریخ پایان ترم و ارزیابی"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False, doc="آیا ترم جاری فعال است؟"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    # Relationships
    courses = relationship("Course", back_populates="term")
    enrollments = relationship("Enrollment", back_populates="term")
