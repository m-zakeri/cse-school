from fastapi import APIRouter

api_router = APIRouter()


@api_router.get("/", tags=["Root"])
async def root():
    return {
        "message": "Welcome to Amirkabir CE School API",
        "version": "1.0.0",
        "docs": "/docs",
    }


@api_router.get("/courses", tags=["Courses"])
async def list_courses():
    """لیست دوره‌های آموزشی فعال"""
    return {
        "items": [
            {
                "id": 1,
                "title": "یادگیری ماشین",
                "instructor": "احسان ناظرفرد",
                "units": "3 واحد",
                "level": "کارشناسی ارشد",
            },
            {
                "id": 2,
                "title": "آزمون و تضمین کیفیت نرم‌افزار",
                "instructor": "مرتضی ذاکری",
                "units": "3 واحد",
                "level": "کارشناسی",
            },
            {
                "id": 3,
                "title": "برنامه نویسی شی گرا (جاوا)",
                "instructor": "معصومه طارمی راد",
                "units": "3 واحد",
                "level": "کارشناسی",
            },
            {
                "id": 4,
                "title": "مهندسی نرم‌افزار",
                "instructor": "معصومه طارمی راد",
                "units": "3 واحد",
                "level": "کارشناسی",
            },
            {
                "id": 6,
                "title": "اصول و الگوها در مهندسی نرم‌افزار",
                "instructor": "مرتضی ذاکری",
                "units": "3 واحد",
                "level": "کارشناسی ارشد",
            },
            {
                "id": 7,
                "title": "اصول رایانش ابری",
                "instructor": "سید احمد جوادی",
                "units": "3 واحد",
                "level": "کارشناسی",
            },
        ]
    }
