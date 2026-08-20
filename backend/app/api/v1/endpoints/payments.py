import uuid
import secrets
from datetime import datetime
from typing import Any
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.models.enrollment import Enrollment, EnrollmentStatus
from app.models.course import Course
from app.models.payment import Payment, PaymentStatus, PaymentGateway
from app.schemas.payment import PaymentRequest, PaymentCallback, PaymentRead

router = APIRouter()


@router.post("/request", response_model=PaymentRead, status_code=status.HTTP_201_CREATED)
async def create_payment_request(
    pay_req: PaymentRequest,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """ایجاد درخواست پرداخت برای ثبت‌نام و دریافت آدرس اتصال به درگاه"""
    stmt_enr = select(Enrollment).where(Enrollment.id == pay_req.enrollment_id)
    res_enr = await db.execute(stmt_enr)
    enrollment = res_enr.scalars().first()

    if not enrollment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="پرونده ثبت‌نام یافت نشد.",
        )

    # Get course price
    stmt_course = select(Course).where(Course.id == enrollment.course_id)
    res_course = await db.execute(stmt_course)
    course = res_course.scalars().first()

    amount = course.price if course else 2500000
    discount_amount = 0

    if pay_req.discount_code == "AUT20":
        discount_amount = amount * 0.20
        amount = amount - discount_amount

    payment = Payment(
        enrollment_id=enrollment.id,
        user_id=enrollment.user_id,
        amount=amount,
        discount_amount=discount_amount,
        gateway=pay_req.gateway,
        status=PaymentStatus.PENDING,
        tracking_code=f"PAY-{secrets.token_hex(4).upper()}",
    )
    db.add(payment)
    await db.commit()
    await db.refresh(payment)

    return payment


@router.post("/verify", response_model=PaymentRead)
async def verify_payment(
    callback_data: PaymentCallback,
    db: AsyncSession = Depends(get_db),
) -> Any:
    """تأیید و نهایی‌سازی تراکنش پرداخت از درگاه بانکی"""
    stmt = select(Payment).where(Payment.tracking_code == callback_data.tracking_code)
    res = await db.execute(stmt)
    payment = res.scalars().first()

    if not payment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="تراکنشی با این مشخصات یافت نشد.",
        )

    if callback_data.status.upper() == "OK" or callback_data.status == "100":
        payment.status = PaymentStatus.SUCCESSFUL
        payment.reference_id = f"RRN-{secrets.token_hex(5).upper()}"
        payment.paid_at = datetime.utcnow()

        if payment.enrollment_id:
            stmt_enr = select(Enrollment).where(Enrollment.id == payment.enrollment_id)
            res_enr = await db.execute(stmt_enr)
            enrollment = res_enr.scalars().first()
            if enrollment:
                enrollment.status = EnrollmentStatus.REGISTERED

        await db.commit()
        await db.refresh(payment)
    else:
        payment.status = PaymentStatus.FAILED
        await db.commit()
        await db.refresh(payment)

    return payment
