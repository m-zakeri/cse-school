import uuid
from datetime import datetime
from sqlalchemy import String, Integer, Boolean, DateTime, BigInteger, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class CourseVideo(Base):
    """A single lecture recording attached to a course.

    The file itself lives in object storage; only ``storage_key`` and some
    metadata are kept here. Students stream it through a short-lived
    presigned URL that the API hands out after checking their enrollment.
    """

    __tablename__ = "course_videos"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True
    )
    course_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("courses.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )
    title: Mapped[str] = mapped_column(
        String(255), nullable=False, doc="عنوان جلسه یا ویدیو"
    )
    order_index: Mapped[int] = mapped_column(
        Integer, default=1, nullable=False, doc="ترتیب نمایش"
    )
    storage_key: Mapped[str] = mapped_column(
        String(500), nullable=False, doc="کلید فایل در فضای ذخیره‌سازی"
    )
    content_type: Mapped[str] = mapped_column(
        String(100), default="video/mp4", nullable=False
    )
    size_bytes: Mapped[int] = mapped_column(BigInteger, default=0, nullable=False)
    duration_seconds: Mapped[int] = mapped_column(
        Integer, nullable=True, doc="مدت زمان ویدیو بر حسب ثانیه"
    )
    is_free_preview: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
        doc="آیا بدون ثبت‌نام در دوره قابل مشاهده است",
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=datetime.utcnow, nullable=False
    )

    course = relationship("Course", back_populates="videos")
