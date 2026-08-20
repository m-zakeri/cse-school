from fastapi import APIRouter
from app.api.v1.endpoints import auth, courses, enrollments, payments, certificates

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication & Profile"])
api_router.include_router(courses.router, prefix="/courses", tags=["Courses & Syllabus"])
api_router.include_router(enrollments.router, prefix="/enrollments", tags=["Enrollments & Registration"])
api_router.include_router(payments.router, prefix="/payments", tags=["Payments & Financials"])
api_router.include_router(certificates.router, prefix="/certificates", tags=["Certificates & Verification"])


@api_router.get("/", tags=["Health & Info"])
async def root():
    return {
        "message": "Amirkabir University of Technology CE School API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "online",
    }
