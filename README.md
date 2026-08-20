# سامانه جامع آموزش‌های تخصصی دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر
## Amirkabir University of Technology - CE School Platform

سامانه یکپارچه آموزش‌های تخصصی، دوره‌های مهارت‌محور، میکرومسترها و صدور گواهینامه‌های رسمی دانشکده مهندسی کامپیوتر دانشگاه صنعتی امیرکبیر.

---

### ساختار کلی مخزن (Repository Architecture)

```
ce-school/
├── frontend/                 # کلاینت و رابط کاربری (Next.js 16 + Tailwind CSS)
│   ├── src/                  # صفحات، کامپوننت‌ها و استایل‌ها
│   ├── public/               # فونت‌های یکان‌بخ، تصاویر و دارایی‌های استاتیک
│   ├── Dockerfile
│   └── package.json
├── backend/                  # سرویس بک‌اند (FastAPI + PostgreSQL + Redis)
│   ├── app/                  # روترها، مدل‌ها، اسکیماها و سرویس‌ها
│   ├── requirements.txt
│   ├── Dockerfile
│   └── README.md             # نقشه راه و جزئیات معماری بک‌اند
├── docker-compose.yml        # ارکستراسیون سرویس‌ها در محیط پروداکشن
├── docker-compose.dev.yml    # ارکستراسیون سرویس‌ها در محیط توسعه
└── README.md
```

---

### راه‌اندازی سریع با داکر (Quick Start with Docker)

#### محیط توسعه (Development Mode):
```bash
docker compose -f docker-compose.dev.yml up --build
```
- **فرانت‌اند:** `http://localhost:3000`
- **بک‌اند و Swagger:** `http://localhost:8000/docs`
- **پایگاه داده پستگرس:** پورت `5432`
- **کش ردیس:** پورت `6379`

#### محیط پروداکشن (Production Mode):
```bash
docker compose up -d --build
```

---

### راه‌اندازی دستی فرانت‌اند (Frontend Manual Setup)

```bash
cd frontend
npm install
npm run dev
```

---

### راه‌اندازی دستی بک‌اند (Backend Manual Setup)

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
