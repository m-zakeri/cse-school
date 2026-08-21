import os
import logging
from datetime import date
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import engine, Base
from app.models.user import User, UserRole
from app.models.term import Term
from app.models.instructor import Instructor
from app.models.course import Course, SyllabusTopic
from app.core.security import get_password_hash

logger = logging.getLogger(__name__)


async def init_db(session: AsyncSession) -> None:
    # 1. Create all tables if they don't exist
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    
    logger.info("Database tables initialized successfully.")

    # 2. Check and Seed Active Term (ترم پاییز ۱۴۰۴)
    result = await session.execute(select(Term).where(Term.code == "1404-1"))
    term = result.scalars().first()
    if not term:
        term = Term(
            title="ترم پاییز ۱۴۰۴",
            code="1404-1",
            registration_start=date(2025, 9, 1),
            registration_end=date(2025, 9, 27),
            start_date=date(2025, 10, 2),
            end_date=date(2025, 12, 20),
            is_active=True,
        )
        session.add(term)
        await session.flush()
        logger.info("Term 'ترم پاییز ۱۴۰۴' seeded.")

    # 3. Check and Seed Instructors
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

    instructor_map = {}
    for inst_data in instructors_data:
        res = await session.execute(select(Instructor).where(Instructor.name == inst_data["name"]))
        inst = res.scalars().first()
        if not inst:
            inst = Instructor(**inst_data)
            session.add(inst)
            await session.flush()
            logger.info(f"Instructor '{inst.name}' seeded.")
        instructor_map[inst.name] = inst

    # 4. Check and Seed Courses & Syllabus Topics
    courses_seed = [
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
            "price": 2500000,
            "capacity": 30,
            "prerequisites": "داده‌کاوی یا بازیابی اطلاعات",
            "corequisites": "ندارد",
            "prerequisite_topics": "آمار و احتمال مهندسی و جبر خطی",
            "duration": "۸ هفته کلاس درس (۲۴ ساعت – ۱۶ جلسه) + ۱ هفته رفع اشکال + ۱ هفته ارزیابی",
            "delivery_method": "ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)",
            "description": "هدف از مبحث یادگیری ماشین مطالعه الگوریتم‌هایی است که قادر به یادگیری از داده‌ها و تجربیات هستند. در این درس مفاهیم یادگیری ماشین مطرح شده و جنبه‌های مهم عملی و نظری آن تحلیل خواهد شد.",
            "author": "احسان ناظرفرد",
            "version": "۱.۰",
            "objectives": [
                "آشنایی عمیق با مبانی نظری و ریاضی یادگیری ماشین",
                "تسلط بر مدل‌های اصلی یادگیری تحت نظارت (رگرسیون و دسته‌بندی)",
                "یادگیری روش‌های بدون نظارت و خوشه‌بندی پیشرفته",
                "آشنایی با یادگیری تقویتی و حل مسائل دنیای واقعی با پایتون",
            ],
            "target_audience": [
                "دانشجویان و دانش‌آموختگان مهندسی و علوم کامپیوتر",
                "مهندسان و علاقه‌مندان به هوش مصنوعی، علم داده و داده‌کاوی",
                "پژوهشگران و توسعه‌دهندگان سیستم‌های هوشمند",
            ],
            "software_tools": [
                {"category": "زبان برنامه‌نویسی", "tools": "Python 3.x"},
                {"category": "کتابخانه‌ها", "tools": "NumPy, Pandas, Scikit-learn, Matplotlib"},
            ],
            "grading_info": [
                {"label": "تکالیف تئوری", "percent": "۲۰٪"},
                {"label": "پروژه‌های عملی", "percent": "۳۰٪"},
                {"label": "آزمون پایانی", "percent": "۵۰٪"},
            ],
            "references": [
                "Learning from data: a short course, Malik Magdon-Ismail and Yaser S. Abu-Mostafa, 2012",
                "Introduction to Machine Learning, Ethem Alpaydin, MIT Press, 2020",
                "Machine Learning: A Probabilistic Perspective, Kevin Murphy, MIT Press, 2013",
            ],
            "topics": [
                {"order_index": 1, "title": "مقدمات و مثال‌های کاربردی", "description": "تحت نظارت، بدون نظارت، تقویتی و فعال."},
                {"order_index": 2, "title": "پیش‌پردازش داده‌ها", "description": "پاکسازی داده‌ها، مقادیر گمشده و نرمال‌سازی."},
                {"order_index": 3, "title": "یادگیری تحت نظارت – رگرسیون", "description": "رگرسیون خطی، گرادیان نزولی، رگرسیون منظم‌شده و مصالحه بایاس-واریانس."},
                {"order_index": 4, "title": "یادگیری تحت نظارت – دسته‌بندی", "description": "KNN، درخت تصمیم، شبکه‌های بیزین، SVM و مدل‌های تجمعی."},
                {"order_index": 5, "title": "یادگیری بدون نظارت", "description": "تحلیل مولفه اصلی (PCA) و خوشه‌بندی K-Means و DBSCAN."},
                {"order_index": 6, "title": "یادگیری تقویتی", "description": "مفاهیم پایه، توابع ارزش، کیفیت و الگوریتم Q-Learning."},
            ],
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
            "price": 2500000,
            "capacity": 30,
            "prerequisites": "برنامه‌نویسی شی‌گرا",
            "corequisites": "مهندسی نرم‌افزار",
            "prerequisite_topics": "مفاهیم پایه مهندسی نرم‌افزار و برنامه‌نویسی",
            "duration": "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
            "delivery_method": "ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)",
            "description": "اصول، فنون، معیارها و ابزارهای آزمون کارکردی نرم‌افزار به صورت مدل‌رانده، خودکارسازی تست و ارزیابی کیفیت در چرخه‌حیات مهندسی نرم‌افزار مدرن.",
            "author": "مرتضی ذاکری",
            "version": "۲.۰",
            "objectives": [
                "آشنایی با مدل V و سطوح مختلف آزمون نرم‌افزار",
                "تسلط بر طراحی سیستماتیک آزمون مبتنی بر گراف، منطق و افراز ورودی",
                "توسعه آزمون‌رانده (TDD) و خودکارسازی آزمون‌های واحد",
                "کار با ابزارهای تست فازی و تحلیل کیفیت کد",
            ],
            "target_audience": [
                "دانشجویان و مهندسان نرم‌افزار",
                "مهندسان تضمین کیفیت (QA Engineers)",
                "توسعه‌دهندگان علاقه‌مند به TDD و CI/CD",
            ],
            "software_tools": [
                {"category": "تست واحد", "tools": "JUnit 5, PyTest"},
                {"category": "تحلیل کیفیت", "tools": "SonarQube, JaCoCo"},
                {"category": "تست فازی", "tools": "AFL, DeepFuzz"},
                {"category": "تست وب", "tools": "Selenium, Playwright"},
            ],
            "grading_info": [
                {"label": "تکالیف تئوری", "percent": "۲۰٪"},
                {"label": "پروژه‌های عملی", "percent": "۳۰٪"},
                {"label": "آزمون پایانی", "percent": "۵۰٪"},
            ],
            "references": [
                "P. Ammann and J. Offutt. Introduction to Software Testing. 2nd Edition, Cambridge, 2017.",
                "P. C. Jorgensen. Software Testing: A Craftsman's Approach. 5th Edition, CRC Press, 2021.",
            ],
            "topics": [
                {"order_index": 1, "title": "مقدمه و تعاریف آزمون", "description": "اهمیت آزمون کارکردی، مدل V و سطوح آزمون."},
                {"order_index": 2, "title": "آزمون پیوسته و چابک", "description": "طراحی آزمون مدل‌رانده، خودکارسازی و توسعه آزمون‌رانده (TDD)."},
                {"order_index": 3, "title": "طراحی و ارزیابی سیستماتیک آزمون", "description": "افراز فضای ورودی، آزمون مبتنی بر گراف، منطق و نحو."},
                {"order_index": 4, "title": "آزمون واسط کاربری (GUI)", "description": "تست وب و آزمون End-to-End خودکار."},
                {"order_index": 5, "title": "آزمون فازی و آسیب‌پذیری‌ها", "description": "Fuzz Testing و شناسایی باگ‌های امنیتی."},
                {"order_index": 6, "title": "مدیریت پروژه‌های آزمون", "description": "طرح آزمون، Mocking، تست رگرسیون و پوشش کد."},
            ],
        },
        {
            "course_number": 3,
            "title_fa": "برنامه نویسی شی گرا (جاوا)",
            "title_en": "Object-Oriented Programming (Java)",
            "slug": "java-oop",
            "instructor_name": "دکتر معصومه طارمی راد",
            "field": "مهندسی کامپیوتر – نرم‌افزار",
            "type": "اختصاصی",
            "units": "۳ واحد",
            "level": "کارشناسی",
            "course_level": "مبتدی و متوسط",
            "price": 2500000,
            "capacity": 30,
            "prerequisites": "مبانی برنامه‌نویسی",
            "corequisites": "ندارد",
            "prerequisite_topics": "مفاهیم پایه الگوریتم و برنامه‌نویسی",
            "duration": "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
            "delivery_method": "ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)",
            "description": "آموزش جامع پارادایم شی‌گرایی، کپسوله‌سازی، وراثت، چندریختی، اینترفیس‌ها، Collections Framework، همروندی و سوکت‌پروگرمینگ در جاوا.",
            "author": "معصومه طارمی راد",
            "version": "۱.۰",
            "objectives": [
                "درک عمیق مفاهیم شی‌گرایی و تفاوت با برنامه‌نویسی رویه‌ای",
                "تسلط کامل بر سینتکس و قابلیت‌های زبان Java",
                "استفاده حرفه‌ای از Collections Framework و Generics",
                "برنامه‌نویسی چندنخی (Multithreading) و تحت شبکه",
            ],
            "target_audience": [
                "دانشجویان مهندسی کامپیوتر و علوم داده",
                "برنامه‌نویسان مایل به یادگیری اصولی جاوا و شی‌گرایی",
                "علاقه‌مندان به توسعه نرم‌افزارهای بک‌اند",
            ],
            "software_tools": [
                {"category": "زبان برنامه‌نویسی", "tools": "Java SE (JDK 17/21)"},
                {"category": "محیط توسعه", "tools": "IntelliJ IDEA, Eclipse"},
                {"category": "سیستم بیلد", "tools": "Maven, Gradle"},
            ],
            "grading_info": [
                {"label": "تکالیف تئوری", "percent": "۲۰٪"},
                {"label": "پروژه‌های عملی", "percent": "۳۰٪"},
                {"label": "آزمون پایانی", "percent": "۵۰٪"},
            ],
            "references": [
                "P. Deitel, H. Deitel. Java How to Program. 11th Edition, Pearson, 2017.",
                "B. Eckel. Thinking in Java. 4th Edition, Prentice Hall, 2006.",
            ],
            "topics": [
                {"order_index": 1, "title": "مفاهیم شی‌گرایی و رده‌ها", "description": "کلاس، شیء، متدها، فیلدها، دسترسی‌ها و بسته."},
                {"order_index": 2, "title": "وراثت و چندریختی", "description": "مفهوم وراثت، abstract، super و چندریختی پویا."},
                {"order_index": 3, "title": "واسط‌ها (Interface)", "description": "کاربرد Interface و چندریختی چندگانه."},
                {"order_index": 4, "title": "مدیریت استثناها (Exceptions)", "description": "بلوک‌های try-catch-finally و استثنای سفارشی."},
                {"order_index": 5, "title": "داده‌های عام (Generics)", "description": "کلاس‌ها و متدهای عام و Type Safety."},
                {"order_index": 6, "title": "مجموعه‌ها (Collections Framework)", "description": "List, Set, Map و کار با Iteratorها."},
                {"order_index": 7, "title": "ورودی/خروجی، فایل و شبکه", "description": "Streams، سریال‌سازی و سوکت پروگرمینگ."},
                {"order_index": 8, "title": "برنامه‌نویسی همروند و بازتاب", "description": "چرخه حیات Thread، همگام‌سازی و Reflection."},
            ],
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
            "price": 2500000,
            "capacity": 30,
            "prerequisites": "برنامه‌سازی پیشرفته",
            "corequisites": "ندارد",
            "prerequisite_topics": "مفاهیم پایه برنامه‌نویسی و توسعه نرم‌افزار",
            "duration": "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
            "delivery_method": "ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)",
            "description": "بررسی متدولوژی‌های نوین مهندسی نرم‌افزار، معماری سازگار با تغییر، تحویل مستمر (CI/CD)، فرهنگ DevOps، طراحی شی‌گرا و توسعه چابک Scrum.",
            "author": "معصومه طارمی راد",
            "version": "۱.۰",
            "objectives": [
                "آشنایی با متدولوژی‌های توسعه سنتی و چابک",
                "تسلط بر اصول مهندسی مدرن: ماژولار بودن، انتزاع، کوپلینگ و چسبندگی",
                "درک فرآیندهای CI/CD، زیرساخت به عنوان کد (IaC) و Docker",
                "آشنایی با معماری‌های مونولیت ماژولار و میکروسرویس",
            ],
            "target_audience": [
                "دانشجویان مهندسی نرم‌افزار و فناوری اطلاعات",
                "توسعه‌دهندگانی که مایل به درک چرخه‌حیات محصول هستند",
                "مدیران فنی و اعضای تیم‌های چابک",
            ],
            "software_tools": [
                {"category": "ابزارهای CI/CD", "tools": "GitHub Actions, Jenkins"},
                {"category": "کانتینرسازی", "tools": "Docker, Docker Compose"},
                {"category": "مدیریت پروژه", "tools": "Jira, Git/GitHub"},
            ],
            "grading_info": [
                {"label": "تکالیف تئوری", "percent": "۲۰٪"},
                {"label": "پروژه تیمی و عملی", "percent": "۳۰٪"},
                {"label": "آزمون پایانی", "percent": "۵۰٪"},
            ],
            "references": [
                "David Farley, Modern Software Engineering, Addison-Wesley, 2021",
                "Jez Humble, Continuous Delivery, Addison-Wesley, 2010",
                "Mark Richards, Fundamentals of Software Architecture, O'Reilly, 2020",
            ],
            "topics": [
                {"order_index": 1, "title": "مبانی مهندسی نرم‌افزار مدرن", "description": "رویکردهای سنتی در برابر مدرن و اصول مهندسی چابک."},
                {"order_index": 2, "title": "اصول مهندسی و مدیریت پیچیدگی", "description": "انتزاع، ماژولار بودن، کوپلینگ و چسبندگی."},
                {"order_index": 3, "title": "تحویل مستمر و فرهنگ DevOps", "description": "پایپ‌لاین‌های CI/CD، داکر و زیرساخت به عنوان کد (IaC)."},
                {"order_index": 4, "title": "معماری و طراحی نرم‌افزار", "description": "مونولیت در برابر میکروسرویس و قابلیت مشاهده (Observability)."},
                {"order_index": 5, "title": "روش‌های توسعه چابک", "description": "چارچوب Scrum، نقش‌ها، رویدادها و مصنوعات چابک."},
                {"order_index": 6, "title": "رویه‌های بهینه و مسئولیت حرفه‌ای", "description": "Code Review، Pair Programming و پایداری در نرم‌افزار."},
            ],
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
            "price": 2500000,
            "capacity": 30,
            "prerequisites": "ندارد",
            "corequisites": "مهندسی نرم‌افزار",
            "prerequisite_topics": "مفاهیم پایه کسب‌وکار و کار تیمی",
            "duration": "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
            "delivery_method": "ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)",
            "description": "اصول راه‌اندازی استارتاپ، اعتبارسنجی ایده، توسعه مدل کسب‌وکار، تحلیل اقتصادی، شاخص‌های عملکرد کلیدی (KPIs) و فنون جذب سرمایه در حوزه نرم‌افزار.",
            "author": "مرتضی ذاکری",
            "version": "۱.۰",
            "objectives": [
                "شناسایی فرصت‌ها و ایده‌پردازی در بازار فناوری",
                "بخش‌بندی بازار و تخمین اندازه بازار (TAM)",
                "طراحی مدل‌های کسب‌وکار نوآورانه و قیمت‌گذاری",
                "تدوین طرح کسب‌وکار (Business Plan) و ارائه به سرمایه‌گذار (Pitch Deck)",
            ],
            "target_audience": [
                "دانشجویان علاقه‌مند به راه‌اندازی استارتاپ",
                "توسعه‌دهندگان و مدیران محصول نرم‌افزاری",
                "علاقه‌مندان به اقتصاد فناوری",
            ],
            "software_tools": [
                {"category": "مدل‌سازی بوم", "tools": "Strategyzer, Miro, Notion"},
                {"category": "تحلیل مالی", "tools": "Excel, Google Sheets"},
                {"category": "طراحی ارائه", "tools": "Pitch, Figma"},
            ],
            "grading_info": [
                {"label": "تکالیف میدانی", "percent": "۲۰٪"},
                {"label": "پروژه طرح کسب‌وکار", "percent": "۴۰٪"},
                {"label": "آزمون و ارائه پایانی", "percent": "۴۰٪"},
            ],
            "references": [
                "Aulet, Bill. Disciplined Entrepreneurship, Wiley, 2024.",
                "Wasserman, Noam. The Founder's Dilemmas, Princeton, 2013.",
                "Ries, Eric. The Lean Startup, Crown Business, 2011.",
            ],
            "topics": [
                {"order_index": 1, "title": "بخش‌بندی و انتخاب بازار", "description": "ماتریس بخش‌بندی بازار، بازار ساحلی و تخمین TAM."},
                {"order_index": 2, "title": "تولید و پرورش ایده‌های کسب‌وکار", "description": "متدولوژی Lean، تفکر طراحی و شناسایی مزیت رقابتی."},
                {"order_index": 3, "title": "مدل کسب‌وکار و قیمت‌گذاری", "description": "طراحی بوم مدل کسب‌وکار و استراتژی‌های قیمت‌گذاری."},
                {"order_index": 4, "title": "اقتصاد مهندسی و هوش مالی", "description": "ارزش زمانی پول، نرخ تنزیل، نقطه سربه‌سر و صورت‌های مالی."},
                {"order_index": 5, "title": "شاخص‌های عملکرد کلیدی (KPIs)", "description": "LTV، CAC، نرخ ریزش (Churn) و NPS."},
                {"order_index": 6, "title": "طرح کسب‌وکار و ارائه به سرمایه‌گذار", "description": "تدوین ساختار مالی و تهیه Pitch Deck حرفه‌ای."},
            ],
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
            "price": 2500000,
            "capacity": 30,
            "prerequisites": "برنامه‌نویسی شی‌گرا",
            "corequisites": "مهندسی نرم‌افزار",
            "prerequisite_topics": "مفاهیم پایه مهندسی نرم‌افزار و شی‌گرایی پیشرفته",
            "duration": "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
            "delivery_method": "ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)",
            "description": "بررسی عمیق اصول طراحی نرم‌افزار (SOLID, GRASP, PHAME)، الگوهای طراحی GoF، معماری تمیز (Clean Architecture)، پادالگوها و روش‌های بازآرایی کد (Refactoring).",
            "author": "مرتضی ذاکری",
            "version": "۱.۰",
            "objectives": [
                "تسلط بر اصول بنیادین طراحی شی‌گرا (SOLID و GRASP)",
                "پیاده‌سازی اصولی الگوهای آفرینشی، ساختاری و رفتاری GoF",
                "درک اصول معماری کامپوننت‌ها و چسبندگی/اتصال",
                "شناسایی بوهای بد کد و پادالگوها و اجرای بازآرایی کد",
            ],
            "target_audience": [
                "دانشجویان تحصیلات تکمیلی مهندسی نرم‌افزار",
                "توسعه‌دهندگان ارشد و معماران نرم‌افزار",
                "برنامه‌نویسان مایل به ارتقای ساختار سیستم‌های بزرگ",
            ],
            "software_tools": [
                {"category": "زبان‌های پیاده‌سازی", "tools": "Java, C#, Python"},
                {"category": "مدل‌سازی UML", "tools": "StarUML, Visual Paradigm, PlantUML"},
                {"category": "تحلیل کیفیت", "tools": "SonarQube, Structure101"},
            ],
            "grading_info": [
                {"label": "تکالیف تئوری", "percent": "۲۰٪"},
                {"label": "پروژه‌های عملی الگوها", "percent": "۳۰٪"},
                {"label": "آزمون پایانی", "percent": "۵۰٪"},
            ],
            "references": [
                "E. Gamma et al. Design Patterns, Addison-Wesley, 1995.",
                "Robert C. Martin. Clean Architecture, Prentice Hall, 2018.",
                "M. Fowler. Refactoring: Improving the Design of Existing Code, 2018.",
            ],
            "topics": [
                {"order_index": 1, "title": "مقدمه و تعاریف اصول و الگوها", "description": "معنا و جایگاه الگوهای مهندسی نرم‌افزار و منابع مرجع."},
                {"order_index": 2, "title": "اصول طراحی نرم‌افزار", "description": "اصول PHAME، GRASP و اصول پنج‌گانه SOLID."},
                {"order_index": 3, "title": "اصول مؤلفه و معماری", "description": "چسبندگی و اتصال مؤلفه‌ها (REP, CCP, CRP, ADP, SDP)."},
                {"order_index": 4, "title": "الگوهای طراحی (GoF)", "description": "الگوهای آفرینشی، ساختاری و رفتاری به همراه Dependency Injection."},
                {"order_index": 5, "title": "پادالگوها و بازآرایی کد", "description": "بدهی فنی، بوهای بد کد و تکنیک‌های Refactoring سیستماتیک."},
            ],
        },
        {
            "course_number": 7,
            "title_fa": "اصول رایانش ابری",
            "title_en": "Principles of Cloud Computing",
            "slug": "cloud-computing",
            "instructor_name": "دکتر سید احمد جوادی",
            "field": "مهندسی کامپیوتر – معماری سیستم‌های کامپیوتر",
            "type": "اختصاصی",
            "units": "۳ واحد",
            "level": "کارشناسی",
            "course_level": "مبتدی و متوسط",
            "price": 2500000,
            "capacity": 30,
            "prerequisites": "سیستم‌های عامل، شبکه‌های کامپیوتری",
            "corequisites": "ندارد",
            "prerequisite_topics": "مفاهیم پایه سیستم‌های عامل و شبکه‌های کامپیوتری",
            "duration": "۱۰ هفته (۸ هفته کلاس ۲۴ ساعت – ۱۶ جلسه + ۱ هفته جبرانی + ۱ هفته ارزیابی)",
            "delivery_method": "ترکیبی (کلاس‌های مجازی + ارزیابی پایانی حضوری)",
            "description": "مبانی و معماری سامانه‌های ابری، مدل‌های سرویس‌دهی (IaaS, PaaS, SaaS)، فناوری‌های مجازی‌سازی سرور و کانتینرها (Docker)، کوبرنتیز، تحلیل داده‌های حجیم (MapReduce) و توزیع بار پویا.",
            "author": "سید احمد جوادی",
            "version": "۱.۰",
            "objectives": [
                "درک معماری زیرساخت‌ها، لایه‌ها و مدل‌های سرویس ابری",
                "تسلط بر اصول مجازی‌سازی سرور، شبکه و ذخیره‌ساز",
                "کار با سامانه‌های مدیریت کانتینر (Docker & Kubernetes) و OpenStack",
                "آشنایی با پردازش کلان‌داده (MapReduce) و توزیع بار هوشمند",
            ],
            "target_audience": [
                "دانشجویان مهندسی کامپیوتر و علوم داده",
                "مهندسان زیرساخت، DevOps و مهندسان پایداری سرویس (SRE)",
                "توسعه‌دهندگان سیستم‌های توزیع‌شده و مقیاس‌پذیر",
            ],
            "software_tools": [
                {"category": "کانتینرسازی", "tools": "Docker, Kubernetes"},
                {"category": "مدیریت زیرساخت", "tools": "OpenStack, KVM"},
                {"category": "پردازش کلان‌داده", "tools": "Apache Hadoop, Apache Spark"},
            ],
            "grading_info": [
                {"label": "تکالیف عملی کارگاهی", "percent": "۳۰٪"},
                {"label": "پروژه کلاسترینگ", "percent": "۲۰٪"},
                {"label": "آزمون پایانی", "percent": "۵۰٪"},
            ],
            "references": [
                "Rajkumar Buyya et al. Mastering Cloud Computing, 2013.",
                "Tom White. Hadoop: The Definitive Guide, O'Reilly, 2015.",
            ],
            "topics": [
                {"order_index": 1, "title": "مقدمه‌ای بر رایانش ابری", "description": "تاریخچه، مدل‌های استقرار (خصوصی، عمومی، هیبریدی) و امنیت ابری."},
                {"order_index": 2, "title": "اصول و معماری مجازی‌سازی", "description": "Hypervisorها، کانتینرسازی سیستم‌عامل، مجازی‌سازی شبکه و ذخیره‌ساز."},
                {"order_index": 3, "title": "ارکستراسیون و پلتفرم‌های ابری", "description": "مقدمه‌ای بر Kubernetes و معماری OpenStack."},
                {"order_index": 4, "title": "تحلیل کلان‌داده در رایانش ابری", "description": "مدل برنامه‌سازی MapReduce و فریم‌ورک‌های Hadoop و Spark."},
                {"order_index": 5, "title": "توزیع بار و مقیاس‌پذیری پویا", "description": "Load Balancing، مقیاس‌پذیری خودکار و کاهش زمان تاخیر دم."},
            ],
        },
    ]

    for c_data in courses_seed:
        res = await session.execute(select(Course).where(Course.course_number == c_data["course_number"]))
        course = res.scalars().first()
        inst = instructor_map.get(c_data["instructor_name"])
        
        topics_data = c_data.pop("topics", [])
        c_data.pop("instructor_name", None)

        if not course:
            course = Course(
                **c_data,
                term_id=term.id if term else None,
                instructor_id=inst.id if inst else None,
            )
            session.add(course)
            await session.flush()
            logger.info(f"Course '{course.title_fa}' seeded.")

            for t_item in topics_data:
                topic = SyllabusTopic(
                    course_id=course.id,
                    order_index=t_item.get("order_index", 1),
                    title=t_item["title"],
                    description=t_item.get("description", ""),
                    sessions_count=t_item.get("sessions_count", 1),
                )
                session.add(topic)
        else:
            # Update existing course with clean UTF-8 data
            for k, v in c_data.items():
                setattr(course, k, v)
            if inst:
                course.instructor_id = inst.id
            if term:
                course.term_id = term.id
            logger.info(f"Course '{course.title_fa}' updated with clean UTF-8 data.")

    # 5. Check and Seed Initial Superadmin / Admin User
    admin_email = os.getenv("FIRST_SUPERUSER_EMAIL", "admin@aut.ac.ir")
    admin_password = os.getenv("FIRST_SUPERUSER_PASSWORD", "Admin@AUT1404!")
    res = await session.execute(select(User).where(User.email == admin_email))
    admin_user = res.scalars().first()
    if not admin_user:
        admin_user = User(
            national_id="0000000000",
            phone_number="09120000000",
            email=admin_email,
            full_name="مدیر سامانه آموزش‌های تخصصی",
            hashed_password=get_password_hash(admin_password),
            education_level="دکتری تخصصی",
            university="دانشگاه صنعتی امیرکبیر",
            field_of_study="مهندسی کامپیوتر",
            role=UserRole.ADMIN,
            is_verified=True,
            is_active=True,
        )
        session.add(admin_user)
        logger.info(f"Superadmin user '{admin_email}' seeded.")

    await session.commit()
    logger.info("Database initialization and seeding completed successfully.")
