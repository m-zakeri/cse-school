import secrets
from datetime import datetime, timezone
from decimal import Decimal
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.config import DEV_ENVIRONMENTS, settings
from app.core.database import get_db
from app.core.deps import get_current_user
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.course import Course
from app.models.payment import Payment, PaymentStatus, PaymentGateway
from app.models.user import User, UserRole
from app.schemas.payment import PaymentRequest, PaymentCallback, PaymentRead

router = APIRouter()

# Discount codes the school currently honours: code -> fraction taken off.
DISCOUNT_CODES = {"AUT20": Decimal("0.20")}


def _is_dev() -> bool:
    return settings.ENVIRONMENT.strip().lower() in DEV_ENVIRONMENTS


@router.post("/request", response_model=PaymentRead, status_code=status.HTTP_201_CREATED)
async def create_payment_request(
    pay_req: PaymentRequest,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """ایجاد درخواست پرداخت برای ثبت‌نام و دریافت آدرس اتصال به درگاه"""
    stmt_enr = select(Enrollment).where(Enrollment.id == pay_req.enrollment_id)
    res_enr = await db.execute(stmt_enr)
    enrollment = res_enr.scalars().first()

    # Same answer for "missing" and "someone else's" so ids cannot be probed.
    if not enrollment or (
        enrollment.user_id != current_user.id and current_user.role != UserRole.ADMIN
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="پرونده ثبت‌نام یافت نشد.",
        )

    if pay_req.gateway == PaymentGateway.MOCK and not _is_dev():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="درگاه آزمایشی در محیط عملیاتی فعال نیست.",
        )

    stmt_course = select(Course).where(Course.id == enrollment.course_id)
    res_course = await db.execute(stmt_course)
    course = res_course.scalars().first()
    if not course:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="دوره مربوط به این ثبت‌نام یافت نشد.",
        )

    amount = Decimal(course.price)
    discount_amount = Decimal(0)

    code = (pay_req.discount_code or "").strip().upper()
    if code:
        rate = DISCOUNT_CODES.get(code)
        if rate is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="کد تخفیف وارد شده معتبر نیست.",
            )
        discount_amount = (amount * rate).quantize(Decimal(1))
        amount = amount - discount_amount

    payment = Payment(
        enrollment_id=enrollment.id,
        user_id=enrollment.user_id,
        amount=amount,
        discount_amount=discount_amount,
        gateway=pay_req.gateway,
        status=PaymentStatus.PENDING,
        tracking_code=f"PAY-{secrets.token_hex(6).upper()}",
    )
    db.add(payment)
    await db.commit()
    await db.refresh(payment)

    return payment


@router.post("/verify", response_model=PaymentRead)
async def verify_payment(
    callback_data: PaymentCallback,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Any:
    """تأیید و نهایی‌سازی تراکنش پرداخت از درگاه بانکی"""
    stmt = select(Payment).where(Payment.tracking_code == callback_data.tracking_code)
    res = await db.execute(stmt)
    payment = res.scalars().first()

    if not payment or (
        payment.user_id != current_user.id and current_user.role != UserRole.ADMIN
    ):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="تراکنشی با این مشخصات یافت نشد.",
        )

    # A settled payment is final: replaying a callback must not flip it.
    if payment.status != PaymentStatus.PENDING:
        return payment

    # The status in this request body is supplied by the caller, so it is only
    # trustworthy for the built-in test gateway. Real gateways must be verified
    # server-to-server with the bank before anything is marked paid.
    if payment.gateway != PaymentGateway.MOCK or not _is_dev():
        raise HTTPException(
            status_code=status.HTTP_501_NOT_IMPLEMENTED,
            detail="تأیید پرداخت از طریق درگاه بانکی هنوز پیکربندی نشده است.",
        )

    if callback_data.status.upper() == "OK" or callback_data.status == "100":
        payment.status = PaymentStatus.SUCCESSFUL
        payment.reference_id = f"RRN-{secrets.token_hex(5).upper()}"
        payment.paid_at = datetime.now(timezone.utc)

        if payment.enrollment_id:
            stmt_enr = select(Enrollment).where(Enrollment.id == payment.enrollment_id)
            res_enr = await db.execute(stmt_enr)
            enrollment = res_enr.scalars().first()
            if enrollment and enrollment.status == EnrollmentStatus.PENDING_PAYMENT:
                enrollment.status = EnrollmentStatus.REGISTERED
    else:
        payment.status = PaymentStatus.FAILED

    await db.commit()
    await db.refresh(payment)
    return payment
