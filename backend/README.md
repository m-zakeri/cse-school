# سامانه آموزش‌های تخصصی دانشکده مهندسی کامپیوتر دانشگاه امیرکبیر
## معماری و نقشه راه سرویس بک‌اند (Backend Architecture & Roadmap)

این دایرکتوری شامل سرویس بک‌اند بر پایه **FastAPI (Python)**، پایگاه داده رابطه‌ای **PostgreSQL** و لایه کش و صف **Redis** می‌باشد.

---

### ساختار درختی بک‌اند (Backend Structure)

```
backend/
├── Dockerfile
├── Dockerfile.dev
├── requirements.txt
├── README.md
└── app/
    ├── main.py                     # نقطه شروع اپلیکیشن FastAPI و تعریف میان‌افزارها
    ├── core/
    │   ├── config.py               # تنظیمات متغیرهای محیطی با Pydantic Settings
    │   ├── database.py             # اتصال آسنکرون به PostgreSQL (AsyncEngine & Session)
    │   ├── redis.py                # اتصال به کش و صف Redis
    │   └── security.py             # توابع Hashing رمز عبور و تولید JWT Token
    ├── models/                     # مدل‌های ORM دیتابیس (SQLAlchemy 2.0)
    │   ├── user.py                 # مدل کاربران، نقش‌ها و مدارک
    │   ├── course.py               # مدل دوره‌ها، ترم‌ها، اساتید و سرفصل‌ها
    │   ├── enrollment.py           # مدل ثبت‌نام‌ها و وضعیت فراگیران
    │   ├── payment.py              # مدل پرداخت‌ها و تراکنش‌های بانکی
    │   └── certificate.py          # مدل گواهی‌های دوزبانه و کدهای اعتبارسنجی
    ├── schemas/                    # اسکیماهای اعتبارسنجی داده (Pydantic v2 DTOs)
    │   ├── user.py
    │   ├── course.py
    │   ├── enrollment.py
    │   ├── payment.py
    │   └── certificate.py
    ├── api/
    │   └── v1/                     # نسخه‌بندی API (RESTful Endpoints)
    │       ├── api.py              # تجمیع روترها
    │       ├── endpoints/
    │       │   ├── auth.py         # احراز هویت (OTP / Password / JWT)
    │       │   ├── users.py        # مدیریت پروفایل و کاربران
    │       │   ├── courses.py      # مدیریت و مشاهده دوره‌ها
    │       │   ├── enrollments.py  # فرآیند ثبت‌نام در دوره‌ها
    │       │   ├── payments.py     # اتصال به درگاه پرداخت و تایید تراکنش
    │       │   └── certificates.py # استعلام و صدور گواهینامه‌ها
    └── services/                   # لایه لاجیک تجاری و ادغام با سرویس‌های جانبی
        ├── sms_service.py          # ارسال پیامک تایید و اعلان‌ها (کاوه نگار / SMS.ir)
        ├── payment_gateway.py      # اتصال به شاپرک / زرین‌پال
        └── certificate_generator.py # تولید فایل PDF گواهی با QR Code
```

---

### مدل داده و روابط دیتابیس (ERD Summary)

1. **User (کاربر)**
   - `id`, `national_id` (کد ملی), `phone_number`, `email`, `hashed_password`, `full_name`, `education_level`, `field_of_study`, `role` (`STUDENT`, `INSTRUCTOR`, `ADMIN`), `is_verified`
2. **Term (ترم آموزشی)**
   - `id`, `title` (مثلاً پاییز ۱۴۰۴), `start_date`, `end_date`, `registration_start`, `registration_end`, `is_active`
3. **Course (دوره آموزشی)**
   - `id`, `term_id`, `instructor_id`, `title_fa`, `title_en`, `slug`, `units`, `level`, `type`, `price`, `capacity`, `prerequisites`, `corequisites`, `duration`, `delivery_method`, `image_url`
4. **Enrollment (ثبت‌نام دوره)**
   - `id`, `user_id`, `course_id`, `term_id`, `status` (`PENDING_PAYMENT`, `ENROLLED`, `REJECTED`, `COMPLETED`), `final_grade`, `created_at`
5. **Payment (پرداخت و تراکنش)**
   - `id`, `enrollment_id`, `user_id`, `amount`, `discount_amount`, `gateway`, `tracking_code`, `reference_id`, `status` (`PENDING`, `SUCCESSFUL`, `FAILED`), `paid_at`
6. **Certificate (گواهینامه)**
   - `id`, `enrollment_id`, `serial_number`, `qr_code_url`, `pdf_url`, `issued_at`

---

### نحوه اجرا در محیط محلی (Local Development)

```bash
# ۱. رفتن به پوشه بک‌اند
cd backend

# ۲. ایجاد محیط مجازی پایتون
python -m venv venv
venv\Scripts\activate   # ویندوز

# ۳. نصب پکیج‌ها
pip install -r requirements.txt

# ۴. اجرای سرور توسعه
uvicorn app.main:app --reload --port 8000
```
داکیومنت تعاملی Swagger به صورت خودکار در آدرس `http://localhost:8000/docs` در دسترس خواهد بود.
