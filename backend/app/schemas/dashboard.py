from pydantic import BaseModel


class DashboardStats(BaseModel):
    total_projects: int
    active_projects: int
    review_projects: int
    paused_projects: int
    ai_resolutions: int
    monthly_revenue: int
