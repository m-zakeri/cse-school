# سامانه آموزش‌های تخصصی دانشکده مهندسی کامپیوتر دانشگاه امیرکبیر
## معماری و نقشه راه سرویس بک‌اند (Backend Architecture & Roadmap)

سرویس بک‌اند بر پایه فریم‌ورک پرسرعت و آسنکرون **FastAPI (Python 3.11+)**، پایگاه داده رابطه‌ای **PostgreSQL 16** و لایه کش و صف **Redis 7** طراحی شده است.

---

### ساختار درختی بک‌اند (Backend Directory Layout)

```
backend/
├── Dockerfile                  # داکر ایمیج چندمرحله‌ای بهینه برای پروداکشن
├── Dockerfile.dev              # داکر ایمیج سبک با فعال‌سازی Hot-Reload
├── requirements.txt            # پکیج‌ها و وابستگی‌های پایتون
├── README.md                   # داکیومنت جامع معماری بک‌اند
└── app/
    ├── main.py                 # نقطه ورود اپلیکیشن FastAPI، میدل‌ورهای CORS و هندلرهای خطا
    ├── core/
    │   ├── config.py           # مدیریت متغیرهای محیطی با Pydantic Settings
    │   ├── database.py         # موتور ارتباطی آسنکرون به PostgreSQL (AsyncEngine & AsyncSession)
    │   ├── redis.py            # اتصال و توابع هلپر کار با Redis (Caching & Rate Limiting)
    │   └── security.py         # الگوریتم‌های Bcrypt/Argon2 برای هش پسورد و تولید توکن JWT
    ├── models/                 # تعاریف جداول و مدل‌های ORM دیتابیس (SQLAlchemy 2.0)
    │   ├── user.py             # مدل کاربران، نقش‌ها و سطوح دسترسی
    │   ├── course.py           # مدل دوره‌ها، ترم‌ها، پیش‌نیازها و سرفصل‌ها
    │   ├── enrollment.py       # مدل ثبت‌نام‌ها، نمرات و وضعیت‌های تراکنش
    │   ├── payment.py          # مدل پرداخت‌های بانکی و لاگ تراکنش‌ها
    │   └── certificate.py      # مدل گواهی‌های صادرشده و کدهای رهگیری
    ├── schemas/                # اسکیماهای اعتبارسنجی ورودی/خروجی (Pydantic v2 DTOs)
    │   ├── user.py
    │   ├── course.py
    │   ├── enrollment.py
    │   ├── payment.py
    │   └── certificate.py
    ├── api/
    │   └── v1/                 # نگارش اول API های RESTful
    │       ├── api.py          # تجمیع روترهای ماژولار
    │       ├── endpoints/
    │       │   ├── auth.py     # لاگین با رمز/OTP، ارسال کد تایید و رفرش توکن
    │       │   ├── users.py    # مدیریت پروفایل فراگیر و آپلود مدارک
    │       │   ├── courses.py  # دریافت لیست، فیلترها و جزئیات دوره‌ها
    │       │   ├── enrollments.py # فرایند ثبت‌نام و اعمال کدهای تخفیف
    │       │   ├── payments.py # اتصال به درگاه پرداخت شاپرک/زرین‌پال و کال‌بک
    │       │   └── certificates.py # استعلام عمومی اصالت مدرک با شناسه و QR Code
    └── services/               # لایه منطق تجاری (Business Logic)
        ├── sms_service.py      # ادغام با سرویس‌های پیامک (کاوه‌نگار / SMS.ir)
        ├── payment_gateway.py  # کلاینت ارتباط با درگاه بانکی
        └── certificate_generator.py # تولید خودکار فایل PDF گواهی با ReportLab و QRCode
```

---

### دیاگرام مدل داده و روابط دیتابیس (Database ERD)

```mermaid
erDiagram
    USERS ||--o{ ENROLLMENTS : registers
    USERS ||--o{ PAYMENTS : pays
    TERMS ||--o{ COURSES : contains
    TERMS ||--o{ ENROLLMENTS : holds
    COURSES ||--o{ ENROLLMENTS : includes
    ENROLLMENTS ||--o| PAYMENTS : requires
    ENROLLMENTS ||--o| CERTIFICATES : generates

    USERS {
        uuid id PK
        string national_id UK "کد ملی"
        string phone_number UK "شماره همراه"
        string email UK
        string full_name "نام و نام خانوادگی"
        string role "STUDENT | INSTRUCTOR | ADMIN"
        boolean is_verified
        datetime created_at
    }

    TERMS {
        uuid id PK
        string title "مثلاً پاییز ۱۴۰۴"
        date registration_start
        date registration_end
        date start_date
        date end_date
        boolean is_active
    }

    COURSES {
        uuid id PK
        uuid term_id FK
        uuid instructor_id FK
        string title_fa
        string title_en
        string slug UK
        int units
        string level "کارشناسی | کارشناسی ارشد"
        decimal price
        int capacity
        string delivery_method "آنلاین | حضوری | ترکیبی"
        string image_url
    }

    ENROLLMENTS {
        uuid id PK
        uuid user_id FK
        uuid course_id FK
        uuid term_id FK
        string status "PENDING_PAYMENT | ENROLLED | COMPLETED | CANCELLED"
        decimal final_grade
        datetime created_at
    }

    PAYMENTS {
        uuid id PK
        uuid enrollment_id FK
        uuid user_id FK
        decimal amount
        decimal discount_amount
        string gateway "ZARINPAL | SADAD | BEHPARDAKHT"
        string tracking_code
        string reference_id
        string status "PENDING | SUCCESSFUL | FAILED"
        datetime paid_at
    }

    CERTIFICATES {
        uuid id PK
        uuid enrollment_id FK
        string serial_number UK
        string pdf_url
        string qr_code_url
        datetime issued_at
    }
```

---

### اندپوینت‌های کلیدی API (Core REST API Endpoints)

| ماژول | متد و مسیر | دسترسی | توضیحات |
|---|---|---|---|
| **Auth** | `POST /api/v1/auth/otp/send` | عمومی | ارسال کد تایید یک‌بار مصرف به موبایل فراگیر |
| **Auth** | `POST /api/v1/auth/otp/verify` | عمومی | تایید کد OTP و صدور JWT Access/Refresh Token |
| **Auth** | `POST /api/v1/auth/login` | عمومی | لاگین سنتی با ایمیل/کدملی و رمز عبور |
| **Courses** | `GET /api/v1/courses` | عمومی | لیست دوره‌های فعال همراه با فیلتر دسته‌بندی و استاد |
| **Courses** | `GET /api/v1/courses/{id}` | عمومی | دریافت اطلاعات کامل سرفصل و پیش‌نیازهای یک دوره |
| **Enrollments** | `POST /api/v1/enrollments/apply` | دانشجو | ثبت درخواست اولیه برای شرکت در دوره |
| **Payments** | `POST /api/v1/payments/request` | دانشجو | درخواست ایجاد شناسه پرداخت و هدایت به درگاه |
| **Payments** | `GET /api/v1/payments/verify` | عمومی | کال‌بک درگاه بانکی برای نهایی‌سازی خرید |
| **Certificates** | `GET /api/v1/certificates/verify/{serial}` | عمومی | استعلام اصالت گواهینامه دوره با شماره سریال یا اسکن کیوآرکد |
| **Admin** | `GET /api/v1/admin/reports` | مدیر | گزارش‌های آماری ثبت‌نام‌ها، درآمد و لیست شرکت‌کنندگان |

---

### متغیرهای محیطی (Environment Variables)

یک فایل `.env` در پوشه `backend/` ایجاد نمایید:

```env
PROJECT_NAME="CE School - Amirkabir University of Technology"
ENVIRONMENT="development"
API_V1_STR="/api/v1"

# پایگاه داده PostgreSQL
DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/ce_school_db"

# کش Redis
REDIS_URL="redis://localhost:6379/0"

# کلید رمزنگاری JWT
SECRET_KEY="your-super-secret-key-at-least-32-chars-long"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# آدرس‌های مجاز CORS
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

---

### نحوه اجرا در محیط محلی (Local Development)

```bash
# ۱. رفتن به پوشه بک‌اند
cd backend

# ۲. ایجاد محیط مجازی پایتون
python -m venv venv
venv\Scripts\activate   # در ویندوز
# source venv/bin/activate # در لینوکس / مک

# ۳. نصب پکیج‌ها
pip install -r requirements.txt

# ۴. اجرای سرور توسعه
uvicorn app.main:app --reload --port 8000
```

- **مستندات تعاملی Swagger:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **مستندات ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)
