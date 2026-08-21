# -*- coding: utf-8 -*-
import asyncio
import logging
from sqlalchemy import select, delete
from app.core.database import AsyncSessionLocal
from app.models.course import Course, SyllabusTopic
from app.models.instructor import Instructor
from app.models.term import Term
from app.models.enrollment import Enrollment

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("reseed")

clean_courses = [
    {
        "course_number": 1,
        "title_fa": "یادگیری ماشین",
        "title_en": "Machine Learning",
        "slug": "machine-learning",
        "instructor_name": "دکتر احسان ناظرفرد",
        "field": "مهندسی کامپیوتر – هوش مصنوعی",
        "type": "اختصاصی",
        "units": "۳ واحد",
        "level": "کارشناسی ارشد",
        "course_level": "متوسط",
        "description": "مبانی و کاربردهای یادگیری ماشین در پروژه‌های واقعی و پردازش هوشمند داده‌ها",
    },
    {
        "course_number": 2,
        "title_fa": "آزمون و تضمین کیفیت نرم‌افزار",
        "title_en": "Software Testing and Quality Assurance",
        "slug": "software-testing",
        "instructor_name": "دکتر مرتضی ذاکری",
        "field": "مهندسی کامپیوتر – نرم‌افزار",
        "type": "اختصاصی",
        "units": "۳ واحد",
        "level": "کارشناسی",
        "course_level": "مبتدی و متوسط",
        "description": "اصول، فنون، چارچوب‌ها و ابزارهای آزمون کارکردی و خودکارسازی تست نرم‌افزار",
    },
    {
        "course_number": 3,
        "title_fa": "برنامه‌نویسی شی‌گرا (جاوا)",
        "title_en": "Object-Oriented Programming (Java)",
        "slug": "java-oop",
        "instructor_name": "دکتر معصومه طارمی راد",
        "field": "مهندسی کامپیوتر – نرم‌افزار",
        "type": "اختصاصی",
        "units": "۳ واحد",
        "level": "کارشناسی",
        "course_level": "مبتدی و متوسط",
        "description": "مفاهیم پیشرفته برنامه‌نویسی شی‌گرا، الگوهای طراحی و توسعه کاربردی در جاوا",
    },
    {
        "course_number": 4,
        "title_fa": "مهندسی نرم‌افزار",
        "title_en": "Software Engineering",
        "slug": "software-engineering",
        "instructor_name": "دکتر معصومه طارمی راد",
        "field": "مهندسی کامپیوتر – نرم‌افزار",
        "type": "اختصاصی",
        "units": "۳ واحد",
        "level": "کارشناسی",
        "course_level": "مبتدی و متوسط",
        "description": "متدولوژی‌های نوین توسعه، تحلیل، معماری و مدیریت چرخه‌حیات سیستم‌های نرم‌افزاری",
    },
    {
        "course_number": 5,
        "title_fa": "کارآفرینی",
        "title_en": "Entrepreneurship",
        "slug": "entrepreneurship",
        "instructor_name": "دکتر مرتضی ذاکری",
        "field": "مهندسی کامپیوتر – نرم‌افزار",
        "type": "اختیاری",
        "units": "۳ واحد",
        "level": "کارشناسی",
        "course_level": "مبتدی و متوسط",
        "description": "اصول و مفاهیم راه‌اندازی، مدل‌های کسب‌وکار و مقیاس‌پذیری استارتاپ‌های فناورانه",
    },
    {
        "course_number": 6,
        "title_fa": "اصول و الگوها در مهندسی نرم‌افزار",
        "title_en": "Principles and Patterns in Software Engineering",
        "slug": "software-patterns",
        "instructor_name": "دکتر مرتضی ذاکری",
        "field": "مهندسی کامپیوتر – نرم‌افزار",
        "type": "اختصاصی",
        "units": "۳ واحد",
        "level": "کارشناسی ارشد",
        "course_level": "متوسط و پیشرفته",
        "description": "الگوهای طراحی معماری، الگوهای شی‌گرا (GoF)، الگوهای معماری سازمانی و اصول SOLID",
    },
    {
        "course_number": 7,
        "title_fa": "اصول رایانش ابری",
        "title_en": "Principles of Cloud Computing",
        "slug": "cloud-computing",
        "instructor_name": "دکتر سید احمد جوادی",
        "field": "مهندسی کامپیوتر – معماری سیستم‌های کامپیوتری",
        "type": "اختصاصی",
        "units": "۳ واحد",
        "level": "کارشناسی",
        "course_level": "مبتدی و متوسط",
        "description": "مبانی معماری ابری، مجازی‌سازی، کانتینرسازی با داکر و کوبرنتیز و سیستم‌های توزیع‌شده",
    },
]

instructors_data = [
    {
        "name": "دکتر احسان ناظرفرد",
        "position": "استادیار دانشکده مهندسی کامپیوتر",
        "department": "دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر",
        "specialization": "یادگیری ماشین، داده‌کاوی، پردازش زبان طبیعی و هوش مصنوعی",
        "profile_link": "https://aut.ac.ir/cv/2144",
    },
    {
        "name": "دکتر معصومه طارمی راد",
        "position": "استادیار دانشکده مهندسی کامپیوتر",
        "department": "دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر",
        "specialization": "مهندسی نرم‌افزار، برنامه‌نویسی شی‌گرا، DevOps و معماری سیستم",
        "profile_link": "https://aut.ac.ir/cv/2376",
    },
    {
        "name": "دکتر مرتضی ذاکری",
        "position": "استادیار دانشکده مهندسی کامپیوتر",
        "department": "دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر",
        "specialization": "آزمون و تضمین کیفیت نرم‌افزار، اصول و الگوهای طراحی، کارآفرینی فناورانه",
        "profile_link": "https://aut.ac.ir/cv/2485",
    },
    {
        "name": "دکتر سید احمد جوادی",
        "position": "استادیار دانشکده مهندسی کامپیوتر",
        "department": "دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر",
        "specialization": "رایانش ابری، مجازی‌سازی، سامانه‌های توزیع‌شده و کلان‌داده",
        "profile_link": "https://aut.ac.ir/cv/2261",
    },
]


async def main():
    async with AsyncSessionLocal() as session:
        # Update / Insert Instructors
        inst_map = {}
        for inst_d in instructors_data:
            res = await session.execute(select(Instructor).where(Instructor.profile_link == inst_d["profile_link"]))
            inst = res.scalars().first()
            if not inst:
                inst = Instructor(**inst_d)
                session.add(inst)
                await session.flush()
            else:
                for k, v in inst_d.items():
                    setattr(inst, k, v)
            inst_map[inst_d["name"]] = inst

        # Clean any extra or corrupted courses
        stmt = select(Course)
        res = await session.execute(stmt)
        courses = res.scalars().all()
        for c in courses:
            if c.course_number > 7:
                logger.info(f"Removing extra course #{c.course_number}")
                await session.execute(delete(Enrollment).where(Enrollment.course_id == c.id))
                await session.execute(delete(SyllabusTopic).where(SyllabusTopic.course_id == c.id))
                await session.delete(c)

        # Update clean courses
        for c_d in clean_courses:
            res = await session.execute(select(Course).where(Course.course_number == c_d["course_number"]))
            course = res.scalars().first()
            inst = inst_map.get(c_d["instructor_name"])
            
            c_dict = {k: v for k, v in c_d.items() if k != "instructor_name"}
            if course:
                for k, v in c_dict.items():
                    setattr(course, k, v)
                if inst:
                    course.instructor_id = inst.id
                logger.info(f"Updated course #{course.course_number} ({course.title_fa})")
            else:
                new_c = Course(**c_dict, instructor_id=inst.id if inst else None)
                session.add(new_c)
                logger.info(f"Added course #{new_c.course_number} ({new_c.title_fa})")

        await session.commit()
        logger.info("Reseed completed successfully!")


if __name__ == "__main__":
    asyncio.run(main())
