import uuid
from datetime import datetime
import enum
from decimal import Decimal
from sqlalchemy import String, DateTime, Numeric, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class EnrollmentStatus(str, enum.Enum):
    PENDING_PAYMENT = "PENDING_PAYMENT"  # در انتظار پرداخت
    REGISTERED = "REGISTERED"            # ثبت‌نام نهایی و تاییدشده
    CANCELLED = "CANCELLED"              # انصراف / لغوشده
    COMPLETED = "COMPLETED"              # دوره تکمیل‌شده و ارزیابی‌شده


class Enrollment(Base):
    __tablename__ = "enrollments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    course_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True
    )
    term_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("terms.id", ondelete="SET NULL"), nullable=True, index=True
    )
    status: Mapped[EnrollmentStatus] = mapped_column(
        Enum(EnrollmentStatus), default=EnrollmentStatus.PENDING_PAYMENT, nullable=False
    )
    tracking_code: Mapped[str] = mapped_column(
        String(50), unique=True, index=True, nullable=False, doc="کد رهگیری ثبت‌نام"
    )
    final_grade: Mapped[Decimal] = mapped_column(
        Numeric(4, 2), nullable=True, doc="نمره نهایی از ۱۰۰ یا ۲۰"
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    # Relationships
    user = relationship("User", back_populates="enrollments")
    course = relationship("Course", back_populates="enrollments")
    term = relationship("Term", back_populates="enrollments")
    payments = relationship("Payment", back_populates="enrollment")
    certificate = relationship("Certificate", back_populates="enrollment", uselist=False)
