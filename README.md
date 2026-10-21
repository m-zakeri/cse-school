# CE School

Course registration and lecture-video platform of the Computer Engineering School, Amirkabir University of Technology. Students sign up, enroll in the courses of the current term, watch lectures and track their progress; admins manage terms, courses, students and videos from `/admin`.

Production: **http://172.23.131.11/**

Next.js 16 / React 19 (RTL, Persian) · FastAPI + async SQLAlchemy · PostgreSQL 16 · Redis · MinIO for lecture videos (enrollment-gated, short-lived signed URLs) · nginx · Docker Compose.

## Run it

```bash
cp .env.example .env      # fill in the empty values; the comments explain each one
docker compose up -d --build
```

The site is at http://localhost:8080 (nginx), the frontend alone at :3000. The admin account is created on first start from `FIRST_SUPERUSER_EMAIL` / `FIRST_SUPERUSER_PASSWORD`; students register at `/login?tab=signup`. Seed data is written only into an empty database, after that the admin panel owns the catalogue.

For development with hot reload: `docker compose -f docker-compose.dev.yml up --build` (API docs at http://localhost:8000/docs).

Without Docker: `npm install && npm run dev` in `frontend/`, and in `backend/` `pip install -r requirements.txt` then `uvicorn app.main:app --reload --port 8000`. Details in [frontend/README.md](frontend/README.md) and [backend/README.md](backend/README.md).

## Terms

Every course belongs to a term (e.g. `1404-1`). Exactly one term is current and only its courses accept registration; other terms stay browsable and read-only. Admins manage terms and their dates from the panel, and can copy courses into a new term instead of defining them twice (enrollments and videos are not copied).

## Production

The whole site is served by nginx on port 80; the app ports are bound to localhost. The API documentation is not published (see [deploy/README.md](deploy/README.md) for how to reach it over an SSH tunnel).

GitHub Actions (`.github/workflows/ci.yml`) builds the app and runs the end-to-end API smoke test on every push and pull request. The server deploys the latest `main` commit whose CI is green, rolls back a deploy that does not come up healthy, restarts after a power cut and backs up nightly. Installation, updates, backups and alerts: [deploy/README.md](deploy/README.md).
