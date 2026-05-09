import type { ChatResponse, DashboardStats, Project, ProjectPayload } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API error: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const api = {
  getProjects: () => request<Project[]>("/projects"),
  createProject: (payload: ProjectPayload) =>
    request<Project>("/projects", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  updateProject: (id: number, payload: Partial<ProjectPayload>) =>
    request<Project>(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),
  deleteProject: (id: number) =>
    request<void>(`/projects/${id}`, {
      method: "DELETE",
    }),
  getDashboardStats: () => request<DashboardStats>("/dashboard/stats"),
  sendChatMessage: (message: string) =>
    request<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({ message }),
    }),
};
