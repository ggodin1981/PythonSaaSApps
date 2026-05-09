from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.models.project import Project
from app.schemas.dashboard import DashboardStats

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/stats", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    projects = db.query(Project).all()

    return DashboardStats(
        total_projects=len(projects),
        active_projects=sum(1 for project in projects if project.status == "Active"),
        review_projects=sum(1 for project in projects if project.status == "Review"),
        paused_projects=sum(1 for project in projects if project.status == "Paused"),
        ai_resolutions=326,
        monthly_revenue=10800,
    )
