from fastapi import APIRouter

from app.api import chat, dashboard, projects

api_router = APIRouter()
api_router.include_router(projects.router)
api_router.include_router(dashboard.router)
api_router.include_router(chat.router)
