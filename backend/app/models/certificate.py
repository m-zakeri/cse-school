import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Certificate(Base):
    __tablename__ = "certificates"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    enrollment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="CASCADE"), unique=True, nullable=False
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    serial_number: Mapped[str] = mapped_column(
        String(50), unique=True, index=True, nullable=False, doc="شماره سریال یکتای گواهی رسمی"
    )
    pdf_url: Mapped[str] = mapped_column(
        String(500), nullable=True, doc="آدرس فایل پی‌دی‌اف گواهینامه"
    )
    qr_code_url: Mapped[str] = mapped_column(
        String(500), nullable=True, doc="آدرس تصویر QR Code استعلام آنلاین"
    )
    issued_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    # Relationships
    enrollment = relationship("Enrollment", back_populates="certificate")
    user = relationship("User", back_populates="certificates")
