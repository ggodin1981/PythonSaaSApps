export type ProjectStatus = "Active" | "Review" | "Paused";
export type ProjectPlan = "Starter" | "Pro" | "Business" | "Enterprise";

export interface Project {
  id: number;
  name: string;
  client: string;
  status: ProjectStatus;
  plan: ProjectPlan;
  progress: number;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectPayload {
  name: string;
  client: string;
  status: ProjectStatus;
  plan: ProjectPlan;
  progress: number;
  description: string;
}

export interface DashboardStats {
  total_projects: number;
  active_projects: number;
  review_projects: number;
  paused_projects: number;
  ai_resolutions: number;
  monthly_revenue: number;
}

export interface ChatResponse {
  reply: string;
  provider: string;
}
