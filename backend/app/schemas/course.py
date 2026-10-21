import uuid
from typing import List, Optional
from decimal import Decimal
from pydantic import BaseModel, field_serializer

from app.schemas.term import TermBrief


class TopicCreate(BaseModel):
    order_index: int = 1
    title: str
    description: Optional[str] = None
    sessions_count: int = 1


class CourseCreate(BaseModel):
    title_fa: str
    title_en: str
    slug: Optional[str] = None
    # The term (فصل) the course is offered in; defaults to the current term.
    term_id: Optional[uuid.UUID] = None
    # Either pick an existing instructor by id, or name one (created on demand).
    instructor_id: Optional[uuid.UUID] = None
    instructor_name: Optional[str] = None
    field: str = "مهندسی کامپیوتر – نرم‌افزار"
    type: str = "اختصاصی"
    units: str = "۳ واحد"
    level: str = "کارشناسی"
    course_level: str = "متوسط"
    price: Decimal = Decimal(2500000)
    capacity: int = 30
    prerequisites: Optional[str] = None
    corequisites: Optional[str] = None
    prerequisite_topics: Optional[str] = None
    duration: Optional[str] = "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه)"
    delivery_method: str = "ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)"
    description: str
    objectives: List[str] = []
    target_audience: List[str] = []
    software_tools: List[dict] = []
    grading_info: List[dict] = []
    references: List[str] = []
    assignments_info: Optional[str] = None
    author: Optional[str] = None
    version: str = "۱.۰"
    topics: List[TopicCreate] = []


class CourseUpdate(BaseModel):
    """Every field an admin may edit. Only what is sent gets changed."""

    title_fa: Optional[str] = None
    title_en: Optional[str] = None
    term_id: Optional[uuid.UUID] = None
    instructor_id: Optional[uuid.UUID] = None
    instructor_name: Optional[str] = None
    field: Optional[str] = None
    type: Optional[str] = None
    units: Optional[str] = None
    level: Optional[str] = None
    course_level: Optional[str] = None
    price: Optional[Decimal] = None
    capacity: Optional[int] = None
    prerequisites: Optional[str] = None
    corequisites: Optional[str] = None
    prerequisite_topics: Optional[str] = None
    duration: Optional[str] = None
    delivery_method: Optional[str] = None
    description: Optional[str] = None
    objectives: Optional[List[str]] = None
    target_audience: Optional[List[str]] = None
    software_tools: Optional[List[dict]] = None
    grading_info: Optional[List[dict]] = None
    references: Optional[List[str]] = None
    assignments_info: Optional[str] = None
    author: Optional[str] = None
    version: Optional[str] = None
    is_active: Optional[bool] = None
    topics: Optional[List[TopicCreate]] = None


class SyllabusTopicRead(BaseModel):
    id: uuid.UUID
    order_index: int
    title: str
    description: Optional[str] = None
    sessions_count: int

    class Config:
        from_attributes = True


class InstructorRead(BaseModel):
    id: uuid.UUID
    name: str
    position: Optional[str] = None
    department: str
    specialization: Optional[str] = None
    image_url: Optional[str] = None
    profile_link: Optional[str] = None

    class Config:
        from_attributes = True


class CourseListRead(BaseModel):
    id: uuid.UUID
    course_number: int
    title_fa: str
    title_en: str
    slug: str
    field: str
    type: str
    units: str
    level: str
    course_level: str
    price: Decimal
    capacity: int
    is_active: bool
    image_url: Optional[str] = None
    instructor: Optional[InstructorRead] = None
    term: Optional[TermBrief] = None

    class Config:
        from_attributes = True

    @field_serializer("price")
    def serialize_price(self, value: Decimal) -> int:
        """The column is Numeric(12, 0); emit a plain integer.

        Without this the driver's Decimal('2.50E+6') serializes as the string
        "2.50E+6", which naive clients parse as 2.
        """
        return int(value)


class CourseDetailRead(CourseListRead):
    prerequisites: Optional[str] = None
    corequisites: Optional[str] = None
    prerequisite_topics: Optional[str] = None
    duration: Optional[str] = None
    delivery_method: str
    description: str
    objectives: List[str] = []
    target_audience: List[str] = []
    software_tools: List[dict] = []
    grading_info: List[dict] = []
    references: List[str] = []
    assignments_info: Optional[str] = None
    author: Optional[str] = None
    version: str
    topics: List[SyllabusTopicRead] = []

    class Config:
        from_attributes = True


class CourseImportRequest(BaseModel):
    """Copy existing courses into another term instead of defining them again."""

    course_ids: List[uuid.UUID]
    target_term_id: uuid.UUID


class CourseImportSkipped(BaseModel):
    course_id: uuid.UUID
    title_fa: str
    reason: str


class CourseImportResult(BaseModel):
    created: List[CourseListRead] = []
    skipped: List[CourseImportSkipped] = []
