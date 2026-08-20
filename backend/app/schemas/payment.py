import uuid
from datetime import datetime
from typing import Optional
from decimal import Decimal
from pydantic import BaseModel
from app.models.payment import PaymentStatus, PaymentGateway


class PaymentRequest(BaseModel):
    enrollment_id: uuid.UUID
    gateway: PaymentGateway = PaymentGateway.MOCK
    discount_code: Optional[str] = None


class PaymentCallback(BaseModel):
    tracking_code: str
    authority: Optional[str] = None
    status: str


class PaymentRead(BaseModel):
    id: uuid.UUID
    enrollment_id: Optional[uuid.UUID] = None
    user_id: uuid.UUID
    amount: Decimal
    discount_amount: Decimal
    gateway: PaymentGateway
    status: PaymentStatus
    tracking_code: str
    reference_id: Optional[str] = None
    card_pan: Optional[str] = None
    paid_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True
