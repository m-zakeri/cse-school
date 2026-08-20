# CE School Platform - Amirkabir University of Technology

Integrated platform for specialized training, professional micro-masters, course enrollment, and official certification provided by the Department of Computer Engineering at Amirkabir University of Technology (Tehran Polytechnic).

---

## Repository Architecture

This repository is organized as a multi-service structure containing independent frontend and backend services:

```
ce-school/
├── frontend/                 # Client application (Next.js 16 + Tailwind CSS)
│   ├── src/                  # Application pages, components, and styles
│   ├── public/               # Static assets, images, and fonts
│   ├── Dockerfile            # Standalone production container build
│   ├── package.json          # Node.js dependencies and scripts
│   └── README.md             # Detailed frontend documentation
│
├── backend/                  # API service (FastAPI + PostgreSQL + Redis)
│   ├── app/                  # Application routers, database models, schemas, and services
│   ├── requirements.txt      # Python dependencies
│   ├── Dockerfile            # Production container build
│   └── README.md             # Detailed backend architecture, ERD, and API roadmap
│
├── docker-compose.yml        # Multi-container production orchestration
├── docker-compose.dev.yml    # Multi-container development environment with hot-reload
└── README.md
```

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19 | High-performance user interface with server-side rendering (SSR) and static generation (SSG) |
| Styling | Tailwind CSS, Yekan Bakh Typography | RTL design system with responsive layouts and Persian number formatting |
| Backend | Python 3.11, FastAPI | High-performance asynchronous REST API |
| Database | PostgreSQL 16 (SQLAlchemy 2.0 Async) | ACID-compliant relational storage for courses, enrollments, and transactions |
| Cache and Queue | Redis 7 | High-speed cache, rate limiting, and task queues |
| DevOps | Docker, Docker Compose | Containerized reproducible environments for development and deployment |

---

## Quick Start with Docker

Docker provides a quick setup to run all services (frontend, backend, PostgreSQL, and Redis) in isolated containers.

### Development Mode

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Frontend: http://localhost:3000
- Backend Swagger Documentation: http://localhost:8000/docs
- PostgreSQL Database: port 5432
- Redis: port 6379

### Production Mode

```bash
docker compose up -d --build
```

---

## Manual Setup

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

For detailed page structures and configurations, refer to the [Frontend Documentation](frontend/README.md).

### Backend Setup

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

For database schemas, entity relationship diagrams, and API endpoints, refer to the [Backend Documentation](backend/README.md).
