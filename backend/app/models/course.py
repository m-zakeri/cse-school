import uuid
from datetime import datetime
from decimal import Decimal
from sqlalchemy import String, Boolean, DateTime, Text, Integer, Numeric, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    course_number: Mapped[int] = mapped_column(
        Integer, unique=True, index=True, nullable=False, doc="شماره دوره: ۱ تا ۷"
    )
    term_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("terms.id", ondelete="SET NULL"), nullable=True, index=True
    )
    instructor_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("instructors.id", ondelete="SET NULL"), nullable=True, index=True
    )
    title_fa: Mapped[str] = mapped_column(
        String(200), nullable=False, doc="نام فارسی درس"
    )
    title_en: Mapped[str] = mapped_column(
        String(200), nullable=False, doc="نام انگلیسی درس"
    )
    slug: Mapped[str] = mapped_column(
        String(100), unique=True, index=True, nullable=False
    )
    field: Mapped[str] = mapped_column(
        String(150), nullable=False, doc="رشته و گرایش"
    )
    type: Mapped[str] = mapped_column(
        String(50), default="اختصاصی", nullable=False, doc="نوع درس: اختصاصی / اختیاری"
    )
    units: Mapped[str] = mapped_column(
        String(50), default="۳ واحد", nullable=False
    )
    level: Mapped[str] = mapped_column(
        String(50), default="کارشناسی", nullable=False, doc="مقطع تحصیلی"
    )
    course_level: Mapped[str] = mapped_column(
        String(50), default="متوسط", nullable=False, doc="سطح دشواری دوره"
    )
    price: Mapped[Decimal] = mapped_column(
        Numeric(12, 0), default=0, nullable=False, doc="مبلغ شهریه به ریال یا تومان"
    )
    capacity: Mapped[int] = mapped_column(
        Integer, default=30, nullable=False, doc="ظرفیت کلاس"
    )
    prerequisites: Mapped[str] = mapped_column(
        String(255), nullable=True, doc="پیش‌نیازها"
    )
    corequisites: Mapped[str] = mapped_column(
        String(255), nullable=True, doc="هم‌نیازها"
    )
    prerequisite_topics: Mapped[str] = mapped_column(
        String(255), nullable=True, doc="مباحث پیشنهادی پیش‌نیاز"
    )
    duration: Mapped[str] = mapped_column(
        String(255), nullable=True, doc="طول و زمان‌بندی دوره"
    )
    delivery_method: Mapped[str] = mapped_column(
        String(255), default="ترکیبی (کلاس‌های مجازی + ارزیابی حضوری)", nullable=False
    )
    description: Mapped[str] = mapped_column(
        Text, nullable=False, doc="شرح کامل دوره"
    )
    objectives: Mapped[list] = mapped_column(
        JSONB, default=list, nullable=False, doc="لیست اهداف و دستاوردهای یادگیری"
    )
    target_audience: Mapped[list] = mapped_column(
        JSONB, default=list, nullable=False, doc="مخاطبین هدف دوره"
    )
    software_tools: Mapped[list] = mapped_column(
        JSONB, default=list, nullable=False, doc="ابزارها و فریم‌ورک‌های مورد بحث"
    )
    grading_info: Mapped[list] = mapped_column(
        JSONB, default=list, nullable=False, doc="بارم‌بندی و نمره‌دهی"
    )
    references: Mapped[list] = mapped_column(
        JSONB, default=list, nullable=False, doc="مراجع و کتب درس"
    )
    assignments_info: Mapped[str] = mapped_column(
        String(255), nullable=True, doc="تکالیف پیشنهادی"
    )
    author: Mapped[str] = mapped_column(
        String(100), nullable=True, doc="تهیه‌کننده طرح درس"
    )
    version: Mapped[str] = mapped_column(
        String(20), default="۱.۰", nullable=False, doc="نگارش طرح درس"
    )
    is_active: Mapped[bool] = mapped_column(
        Boolean, default=True, nullable=False
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    # Relationships
    term = relationship("Term", back_populates="courses")
    instructor = relationship("Instructor", back_populates="courses")
    topics = relationship("SyllabusTopic", back_populates="course", cascade="all, delete-orphan", order_by="SyllabusTopic.order_index")
    enrollments = relationship("Enrollment", back_populates="course")


class SyllabusTopic(Base):
    __tablename__ = "syllabus_topics"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    course_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), ForeignKey("courses.id", ondelete="CASCADE"), nullable=False, index=True
    )
    order_index: Mapped[int] = mapped_column(
        Integer, default=1, nullable=False, doc="ترتیب نمایش"
    )
    title: Mapped[str] = mapped_column(
        String(255), nullable=False, doc="عنوان سرفصل"
    )
    description: Mapped[str] = mapped_column(
        Text, nullable=True, doc="مباحث و جزئیات سرفصل"
    )
    sessions_count: Mapped[int] = mapped_column(
        Integer, default=1, nullable=False, doc="تعداد جلسات اختصاص‌یافته"
    )

    # Relationships
    course = relationship("Course", back_populates="topics")
