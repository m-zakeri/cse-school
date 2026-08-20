# Backend Service - CE School Platform

Backend service for the Amirkabir University of Technology Computer Engineering School platform, built with FastAPI (Python 3.11+), PostgreSQL 16, and Redis 7.

---

## Directory Layout

```
backend/
├── Dockerfile                  # Multi-stage production container build
├── Dockerfile.dev              # Development container with hot-reloading
├── requirements.txt            # Python dependencies
├── README.md                   # Architecture and API documentation
└── app/
    ├── main.py                 # FastAPI application factory and middleware configuration
    ├── core/
    │   ├── config.py           # Environment variables management via Pydantic Settings
    │   ├── database.py         # Asynchronous SQLAlchemy engine and session dependency
    │   ├── redis.py            # Redis client for caching and rate limiting
    │   └── security.py         # Password hashing and JWT token operations
    ├── models/                 # SQLAlchemy 2.0 ORM database models
    │   ├── user.py             # Users, roles, and credentials
    │   ├── course.py           # Courses, terms, instructors, and syllabi
    │   ├── enrollment.py       # Registrations, statuses, and academic records
    │   ├── payment.py          # Payment transactions and gateway tracking
    │   └── certificate.py      # Issued certifications and verification keys
    ├── schemas/                # Pydantic v2 validation models (DTOs)
    │   ├── user.py
    │   ├── course.py
    │   ├── enrollment.py
    │   ├── payment.py
    │   └── certificate.py
    ├── api/
    │   └── v1/                 # API Version 1 REST routes
    │       ├── api.py          # Modular route aggregator
    │       ├── endpoints/
    │       │   ├── auth.py     # Authentication (OTP, password, token refresh)
    │       │   ├── users.py    # Profile management and document uploads
    │       │   ├── courses.py  # Course catalog, search, and detail views
    │       │   ├── enrollments.py # Course application and discount code validation
    │       │   ├── payments.py # Payment gateway integration and verification callbacks
    │       │   └── certificates.py # Public certificate verification and download
    └── services/               # Business logic layer
        ├── sms_service.py      # SMS provider integration (Kavenegar / SMS.ir)
        ├── payment_gateway.py  # Banking gateway adapter
        └── certificate_generator.py # Automated PDF certificate generation with QR codes
```

---

## Database Schema (ERD)

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
        string national_id UK
        string phone_number UK
        string email UK
        string full_name
        string role "STUDENT | INSTRUCTOR | ADMIN"
        boolean is_verified
        datetime created_at
    }

    TERMS {
        uuid id PK
        string title
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
        string level "BSc | MSc"
        decimal price
        int capacity
        string delivery_method "ONLINE | IN_PERSON | HYBRID"
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

## Core REST Endpoints

| Module | Method & Path | Access | Description |
|---|---|---|---|
| Auth | `POST /api/v1/auth/otp/send` | Public | Send one-time verification code via SMS |
| Auth | `POST /api/v1/auth/otp/verify` | Public | Verify OTP and return JWT Access/Refresh tokens |
| Auth | `POST /api/v1/auth/login` | Public | Standard credential login (Email/National ID + Password) |
| Courses | `GET /api/v1/courses` | Public | List active courses with filtering and search |
| Courses | `GET /api/v1/courses/{id}` | Public | Detailed course information, syllabus, and prerequisites |
| Enrollments | `POST /api/v1/enrollments/apply` | Student | Submit initial application for course enrollment |
| Payments | `POST /api/v1/payments/request` | Student | Initialize payment gateway transaction |
| Payments | `GET /api/v1/payments/verify` | Public | Banking gateway callback handler |
| Certificates | `GET /api/v1/certificates/verify/{serial}` | Public | Public certificate authenticity verification |
| Admin | `GET /api/v1/admin/reports` | Admin | Enrollment, revenue, and student performance metrics |

---

## Environment Variables

Create a `.env` file inside the `backend/` directory:

```env
PROJECT_NAME="CE School - Amirkabir University of Technology"
ENVIRONMENT="development"
API_V1_STR="/api/v1"

# PostgreSQL Database
DATABASE_URL="postgresql+asyncpg://postgres:postgres@localhost:5432/ce_school_db"

# Redis Cache
REDIS_URL="redis://localhost:6379/0"

# Security
SECRET_KEY="your-super-secret-key-at-least-32-chars-long"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=10080

# CORS
CORS_ORIGINS=["http://localhost:3000","http://127.0.0.1:3000"]
```

---

## Local Development

### Setup

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Interactive Documentation

- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc
