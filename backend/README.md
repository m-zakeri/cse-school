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
    ├── main.py                 # FastAPI application factory, lifespan, and middleware configuration
    ├── core/
    │   ├── config.py           # Environment variables management via Pydantic Settings
    │   ├── database.py         # Asynchronous SQLAlchemy engine and session dependency
    │   ├── init_db.py          # Automatic table initialization and master dataset seeder
    │   ├── redis.py            # Redis client for caching and rate limiting
    │   └── security.py         # Password hashing and JWT token operations
    ├── models/                 # SQLAlchemy 2.0 ORM database models
    │   ├── user.py             # Users, roles, credentials, and academic background
    │   ├── term.py             # Academic terms, timelines, and active status
    │   ├── instructor.py       # Faculty members, bios, and university profiles
    │   ├── course.py           # Courses and detailed syllabus topics
    │   ├── enrollment.py       # Student registrations, tracking codes, and grades
    │   ├── payment.py          # Transactions, payment gateways, and reference IDs
    │   └── certificate.py      # Issued official university certificates
    ├── schemas/                # Pydantic v2 validation models (DTOs)
    │   ├── user.py
    │   ├── course.py
    │   ├── enrollment.py
    │   ├── payment.py
    │   └── certificate.py
    ├── api/
    │   └── v1/                 # API Version 1 REST routes
    │       ├── api.py          # Modular route aggregator
    │       └── endpoints/
    │           ├── auth.py     # Authentication (Registration, login, JWT)
    │           ├── courses.py  # Course catalog and detailed syllabus views
    │           ├── enrollments.py # Course application, batch registration, and tracking
    │           ├── payments.py # Payment requests and gateway verification
    │           └── certificates.py # Certificate verification by serial number
    └── services/               # Business logic layer
        ├── sms_service.py      # SMS provider integration (Kavenegar / SMS.ir)
        ├── payment_gateway.py  # Banking gateway adapter
        └── certificate_generator.py # PDF certificate generation with QR verification
```

---

## Database Schema (ERD)

```mermaid
erDiagram
    USERS ||--o{ ENROLLMENTS : registers
    USERS ||--o{ PAYMENTS : pays
    TERMS ||--o{ COURSES : contains
    TERMS ||--o{ ENROLLMENTS : holds
    INSTRUCTORS ||--o{ COURSES : teaches
    COURSES ||--o{ SYLLABUS_TOPICS : has
    COURSES ||--o{ ENROLLMENTS : includes
    ENROLLMENTS ||--o| PAYMENTS : requires
    ENROLLMENTS ||--o| CERTIFICATES : generates

    USERS {
        uuid id PK
        string national_id UK "10-digit national ID"
        string phone_number UK "Mobile number"
        string email UK
        string full_name
        string hashed_password
        string education_level
        string university
        string field_of_study
        string role "STUDENT | INSTRUCTOR | ADMIN"
        boolean is_verified
        datetime created_at
    }

    TERMS {
        uuid id PK
        string title
        string code UK "1404-1"
        date registration_start
        date registration_end
        date start_date
        date end_date
        boolean is_active
    }

    INSTRUCTORS {
        uuid id PK
        string name
        string position
        string department
        string specialization
        string profile_link
    }

    COURSES {
        uuid id PK
        int course_number UK "1 to 7"
        uuid term_id FK
        uuid instructor_id FK
        string title_fa
        string title_en
        string slug UK
        string field
        string type
        string units
        string level
        decimal price
        int capacity
        string delivery_method
        text description
        jsonb objectives
        jsonb target_audience
        jsonb software_tools
        jsonb grading_info
        jsonb references
    }

    SYLLABUS_TOPICS {
        uuid id PK
        uuid course_id FK
        int order_index
        string title
        text description
        int sessions_count
    }

    ENROLLMENTS {
        uuid id PK
        uuid user_id FK
        uuid course_id FK
        uuid term_id FK
        string status "PENDING_PAYMENT | REGISTERED | CANCELLED | COMPLETED"
        string tracking_code UK "AUT-1404-XXXXXX"
        decimal final_grade
        datetime created_at
    }

    PAYMENTS {
        uuid id PK
        uuid enrollment_id FK
        uuid user_id FK
        decimal amount
        decimal discount_amount
        string gateway "ZARINPAL | SADAD | BEHPARDAKHT | MOCK"
        string tracking_code UK
        string reference_id
        string status "PENDING | SUCCESSFUL | FAILED"
        datetime paid_at
    }

    CERTIFICATES {
        uuid id PK
        uuid enrollment_id FK
        uuid user_id FK
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
| Auth | `POST /api/v1/auth/register` | Public | Register student with validation of National ID and mobile |
| Auth | `POST /api/v1/auth/login` | Public | Authenticate via National ID/Email + password |
| Courses | `GET /api/v1/courses/` | Public | List all active courses with instructor metadata |
| Courses | `GET /api/v1/courses/{identifier}` | Public | Get comprehensive course specifications, topics, and references |
| Enrollments | `POST /api/v1/enrollments/` | Public / Student | Register for a single course with auto user provisioning |
| Enrollments | `POST /api/v1/enrollments/batch` | Public / Student | Batch registration for multiple courses from admission portal |
| Enrollments | `GET /api/v1/enrollments/tracking/{code}` | Public | Query enrollment status by unique tracking code |
| Payments | `POST /api/v1/payments/request` | Student | Initialize payment transaction and apply discount codes |
| Payments | `POST /api/v1/payments/verify` | Public | Payment gateway verification callback handler |
| Certificates | `GET /api/v1/certificates/verify/{serial}` | Public | Verify official certificate authenticity by serial number |

---

## Automatic Database Seeding

On application startup, the database lifespan handler automatically checks and creates all tables, and seeds:
- Active term (`ترم پاییز ۱۴۰۴`)
- 4 Department faculty members
- All 7 academic courses with full session-by-session syllabus topics
- Default administrator account (`admin@aut.ac.ir`)

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
