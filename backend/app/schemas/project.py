from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


ProjectStatus = Literal["Active", "Review", "Paused"]
ProjectPlan = Literal["Starter", "Pro", "Business", "Enterprise"]


class ProjectBase(BaseModel):
    name: str = Field(..., min_length=2, max_length=160)
    client: str = Field(..., min_length=2, max_length=160)
    status: ProjectStatus = "Active"
    plan: ProjectPlan = "Starter"
    progress: int = Field(default=0, ge=0, le=100)
    description: str = Field(default="", max_length=500)


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    name: str | None = Field(default=None, min_length=2, max_length=160)
    client: str | None = Field(default=None, min_length=2, max_length=160)
    status: ProjectStatus | None = None
    plan: ProjectPlan | None = None
    progress: int | None = Field(default=None, ge=0, le=100)
    description: str | None = Field(default=None, max_length=500)


class ProjectRead(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
