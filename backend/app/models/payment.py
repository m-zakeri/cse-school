import uuid
from datetime import datetime
import enum
from decimal import Decimal
from sqlalchemy import String, DateTime, Numeric, Enum, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class PaymentStatus(str, enum.Enum):
    PENDING = "PENDING"
    SUCCESSFUL = "SUCCESSFUL"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


class PaymentGateway(str, enum.Enum):
    ZARINPAL = "ZARINPAL"
    SADAD = "SADAD"
    BEHPARDAKHT = "BEHPARDAKHT"
    MOCK = "MOCK"


class Payment(Base):
    __tablename__ = "payments"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    enrollment_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("enrollments.id", ondelete="SET NULL"), nullable=True, index=True
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True
    )
    amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 0), nullable=False, doc="مبلغ تراکنش"
    )
    discount_amount: Mapped[Decimal] = mapped_column(
        Numeric(12, 0), default=0, nullable=False, doc="مبلغ تخفیف اعمال‌شده"
    )
    gateway: Mapped[PaymentGateway] = mapped_column(
        Enum(PaymentGateway), default=PaymentGateway.MOCK, nullable=False
    )
    status: Mapped[PaymentStatus] = mapped_column(
        Enum(PaymentStatus), default=PaymentStatus.PENDING, nullable=False
    )
    tracking_code: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False, doc="کد پیگیری پرداخت"
    )
    reference_id: Mapped[str] = mapped_column(
        String(100), nullable=True, doc="شماره ارجاع بانکی (RRN)"
    )
    card_pan: Mapped[str] = mapped_column(
        String(20), nullable=True, doc="شماره کارت ماسک‌شده"
    )
    paid_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    # Relationships
    enrollment = relationship("Enrollment", back_populates="payments")
    user = relationship("User", back_populates="payments")
