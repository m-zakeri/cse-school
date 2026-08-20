# سامانه جامع آموزش‌های تخصصی دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر
## Amirkabir University of Technology - CE School Platform

سامانه یکپارچه و مدرن آموزش‌های تخصصی، دوره‌های مهارت‌محور، میکرومسترها و صدور گواهینامه‌های رسمی دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر.

---

### ساختار کلی مخزن (Repository Architecture)

پروژه به صورت ماژولار و چندسرویسی (Multi-Service / Monorepo) به دو بخش مجزای کلاینت و سرور تفکیک شده است:

```
ce-school/
├── frontend/                 # کلاینت و رابط کاربری (Next.js 16 + Tailwind CSS)
│   ├── src/                  # صفحات، کامپوننت‌ها و استایل‌ها
│   ├── public/               # فونت‌های یکان‌بخ، تصاویر و دارایی‌های استاتیک
│   ├── Dockerfile
│   ├── package.json
│   └── README.md             # 📄 راهنمای کامل فرانت‌اند و لیست صفحات
│
├── backend/                  # سرویس بک‌اند (FastAPI + PostgreSQL + Redis)
│   ├── app/                  # روترها، مدل‌های دیتابیس، اسکیماها و سرویس‌ها
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md             # 📄 نقشه راه، دیاگرام ERD و داکیومنت کامل API
│
├── docker-compose.yml        # ارکستراسیون کل سرویس‌ها در محیط پروداکشن
├── docker-compose.dev.yml    # ارکستراسیون سرویس‌ها در محیط توسعه (Hot-Reload)
└── README.md
```

---

### راه‌اندازی سریع با داکر (Quick Start with Docker)

داکر سریع‌ترین و مطمئن‌ترین روش برای اجرای تمام لایه‌های سامانه به صورت خودکار و ایزوله است:

#### ۱. اجرای محیط توسعه (Development Mode):
```bash
docker compose -f docker-compose.dev.yml up --build
```
- **رابط کاربری فرانت‌اند:** [http://localhost:3000](http://localhost:3000)
- **داکیومنت تعاملی بک‌اند (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)
- **پایگاه داده PostgreSQL:** پورت `5432`
- **سرویس کش Redis:** پورت `6379`

#### ۲. اجرای محیط پروداکشن (Production Mode):
```bash
docker compose up -d --build
```

---

### راه‌اندازی دستی (Manual Local Setup)

#### اجرای کلاینت فرانت‌اند:
```bash
cd frontend
npm install
npm run dev
```
> برای مطالعه جزئیات بیشتر به [راهنمای فرانت‌اند (frontend/README.md)](frontend/README.md) مراجعه فرمایید.

#### اجرای سرور بک‌اند:
```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate # Linux / macOS
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
> برای مشاهده دیاگرام پایگاه داده، سناریوی احراز هویت و اندپوینت‌ها به [راهنمای بک‌اند (backend/README.md)](backend/README.md) مراجعه فرمایید.

---

### تکنولوژی‌های استفاده‌شده (Tech Stack)

| لایه | تکنولوژی | نقش و کاربرد |
|---|---|---|
| **Frontend** | Next.js 16 (App Router) + React 19 | فریم‌ورک رابط کاربری با رندرینگ ترکیبی SSR/SSG |
| **Styling** | Tailwind CSS + Yekan Bakh Font | استایل‌دهی مدرن با پشتیبانی بومی RTL و تایپوگرافی اصیل |
| **Backend** | Python 3.11 + FastAPI | سرویس REST API با بالاترین پرفورمنس و سرعت توسعه |
| **Database** | PostgreSQL 16 (Async via SQLAlchemy 2.0) | ذخیره‌سازی رابطه‌ای امن برای تراکنش‌ها و کاربران |
| **Cache & Queue** | Redis 7 | لایه کش داده‌ها، Rate Limiting و صف پردازش‌های پس‌زمینه |
| **DevOps** | Docker & Docker Compose | کانتینری‌سازی و مدیریت یکپارچه محیط‌های توسعه و استقرار |
