from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.core.config import settings
from app.core.database import Base, engine, SessionLocal
from app.models.project import Project

app = FastAPI(title=settings.APP_NAME)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.FRONTEND_ORIGIN, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def seed_projects():
    db = SessionLocal()
    try:
        if db.query(Project).count() == 0:
            db.add_all(
                [
                    Project(
                        name="Restaurant POS SaaS",
                        client="ServingIntel-style Platform",
                        status="Active",
                        plan="Enterprise",
                        progress=82,
                        description="Multi-tenant restaurant SaaS operations prototype.",
                    ),
                    Project(
                        name="KYC/AML Verification Portal",
                        client="Compliance Client",
                        status="Review",
                        plan="Business",
                        progress=64,
                        description="Identity verification and compliance workflow demo.",
                    ),
                    Project(
                        name="Healthcare Workflow System",
                        client="Home Health Demo",
                        status="Active",
                        plan="Pro",
                        progress=73,
                        description="Healthcare workflow and sensitive data handling demo.",
                    ),
                    Project(
                        name="Inventory Management App",
                        client="Retail Demo",
                        status="Paused",
                        plan="Starter",
                        progress=38,
                        description="Inventory and reporting module demo.",
                    ),
                ]
            )
            db.commit()
    finally:
        db.close()


@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)
    seed_projects()


@app.get("/health")
def health_check():
    return {"status": "ok", "service": settings.APP_NAME}


app.include_router(api_router, prefix=settings.API_V1_PREFIX)
