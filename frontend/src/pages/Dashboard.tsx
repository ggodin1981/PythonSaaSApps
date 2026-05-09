import { useEffect, useMemo, useState } from "react";

import { Icon } from "../components/Icon";
import { RevenueChart } from "../components/RevenueChart";
import { StatCard } from "../components/StatCard";
import { StatusBadge } from "../components/StatusBadge";
import { api } from "../services/api";
import type { DashboardStats, Project, ProjectPayload, ProjectPlan, ProjectStatus } from "../types";

const navItems = [
  { label: "Dashboard", icon: "dashboard", active: true },
  { label: "Projects", icon: "projects" },
  { label: "Customers", icon: "users" },
  { label: "Database", icon: "database" },
  { label: "AI Chatbot", icon: "bot" },
  { label: "Settings", icon: "settings" },
];

const emptyForm: ProjectPayload = {
  name: "",
  client: "",
  status: "Active",
  plan: "Starter",
  progress: 10,
  description: "",
};

export function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [form, setForm] = useState<ProjectPayload>(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi Greg, I can help summarize project status, explain dashboard metrics, or suggest next actions.",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const filteredProjects = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return projects;
    return projects.filter((project) =>
      `${project.name} ${project.client} ${project.status} ${project.plan}`.toLowerCase().includes(value)
    );
  }, [projects, search]);

  async function loadData() {
    setLoading(true);
    setError("");

    try {
      const [projectData, statData] = await Promise.all([api.getProjects(), api.getDashboardStats()]);
      setProjects(projectData);
      setStats(statData);
      setSelectedProject((current) => current ?? projectData[0] ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load API data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  function startEdit(project: Project) {
    setEditingId(project.id);
    setSelectedProject(project);
    setForm({
      name: project.name,
      client: project.client,
      status: project.status,
      plan: project.plan,
      progress: project.progress,
      description: project.description,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function saveProject(event: React.FormEvent) {
    event.preventDefault();

    if (!form.name.trim() || !form.client.trim()) {
      setError("Project name and client are required.");
      return;
    }

    try {
      if (editingId) {
        await api.updateProject(editingId, form);
      } else {
        await api.createProject(form);
      }

      resetForm();
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save project.");
    }
  }

  async function deleteProject(projectId: number) {
    try {
      await api.deleteProject(projectId);
      setSelectedProject((current) => (current?.id === projectId ? null : current));
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete project.");
    }
  }

  async function sendMessage() {
    if (!chatInput.trim()) return;

    const userMessage = { role: "user", text: chatInput.trim() };
    setMessages((current) => [...current, userMessage]);
    setChatInput("");

    try {
      const response = await api.sendChatMessage(userMessage.text);
      setMessages((current) => [...current, { role: "assistant", text: response.reply }]);
    } catch {
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: "The AI endpoint is unavailable. Please make sure the backend is running.",
        },
      ]);
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex min-h-screen">
        <aside className="hidden w-72 border-r border-slate-200 bg-white p-5 lg:block">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
              <Icon name="building" className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold">SaaS Pilot</h1>
              <p className="text-xs text-slate-500">FastAPI + React Prototype</p>
            </div>
          </div>

          <nav className="mt-8 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  item.active ? "bg-slate-950 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon name={item.icon} className="h-4 w-4" />
                  {item.label}
                </span>
                {item.active && <Icon name="arrow" className="h-4 w-4" />}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
              <Icon name="shield" className="h-4 w-4" /> Stack Ready
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              PostgreSQL, Redis, SQLAlchemy, FastAPI, React, TypeScript, Tailwind, and AI chatbot endpoint.
            </p>
          </div>
        </aside>

        <main className="flex-1 p-4 md:p-8">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Full-stack SaaS Prototype</p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-950">SaaS Operations Dashboard</h2>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative">
                <Icon name="search" className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search projects..."
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none ring-slate-950/10 focus:ring-4 sm:w-72"
                />
              </div>
              <button
                onClick={resetForm}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
              >
                <Icon name="plus" className="h-4 w-4" /> New Project
              </button>
            </div>
          </header>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading ? (
            <div className="mt-10 rounded-2xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading prototype data...
            </div>
          ) : (
            <>
              <section className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard title="Total Projects" value={stats?.total_projects ?? projects.length} subtitle="CRUD records" icon="projects" trend="Live API" />
                <StatCard title="Active Modules" value={stats?.active_projects ?? 0} subtitle="Currently running" icon="check" trend="Healthy" />
                <StatCard title="Review Queue" value={stats?.review_projects ?? 0} subtitle="Needs review" icon="clock" trend="On track" />
                <StatCard title="AI Resolutions" value={stats?.ai_resolutions ?? 0} subtitle="Mock chatbot assists" icon="message" trend="Fast response" />
              </section>

              <section className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">Revenue Overview</h3>
                      <p className="text-sm text-slate-500">Static SVG chart, no external chart package</p>
                    </div>
                    <Icon name="chart" className="h-5 w-5 text-slate-500" />
                  </div>
                  <RevenueChart />
                </div>

                <form onSubmit={saveProject} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-slate-950">{editingId ? "Edit Project" : "Create Project"}</h3>
                      <p className="text-sm text-slate-500">Connected to FastAPI CRUD</p>
                    </div>
                    <Icon name="edit" className="h-5 w-5 text-slate-500" />
                  </div>

                  <div className="mt-5 space-y-3">
                    <input
                      value={form.name}
                      onChange={(event) => setForm({ ...form, name: event.target.value })}
                      placeholder="Project name"
                      className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none ring-slate-950/10 focus:ring-4"
                    />
                    <input
                      value={form.client}
                      onChange={(event) => setForm({ ...form, client: event.target.value })}
                      placeholder="Client name"
                      className="h-11 w-full rounded-2xl border border-slate-200 px-4 text-sm outline-none ring-slate-950/10 focus:ring-4"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <select
                        value={form.status}
                        onChange={(event) => setForm({ ...form, status: event.target.value as ProjectStatus })}
                        className="h-11 rounded-2xl border border-slate-200 px-4 text-sm outline-none ring-slate-950/10 focus:ring-4"
                      >
                        <option>Active</option>
                        <option>Review</option>
                        <option>Paused</option>
                      </select>
                      <select
                        value={form.plan}
                        onChange={(event) => setForm({ ...form, plan: event.target.value as ProjectPlan })}
                        className="h-11 rounded-2xl border border-slate-200 px-4 text-sm outline-none ring-slate-950/10 focus:ring-4"
                      >
                        <option>Starter</option>
                        <option>Pro</option>
                        <option>Business</option>
                        <option>Enterprise</option>
                      </select>
                    </div>
                    <label className="block text-sm font-medium text-slate-600">
                      Progress: {form.progress}%
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={form.progress}
                        onChange={(event) => setForm({ ...form, progress: Number(event.target.value) })}
                        className="mt-2 w-full"
                      />
                    </label>
                    <textarea
                      value={form.description}
                      onChange={(event) => setForm({ ...form, description: event.target.value })}
                      placeholder="Description"
                      rows={3}
                      className="w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none ring-slate-950/10 focus:ring-4"
                    />
                    <div className="flex gap-2">
                      <button className="flex-1 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">
                        {editingId ? "Save Changes" : "Create Project"}
                      </button>
                      {editingId && (
                        <button type="button" onClick={resetForm} className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold hover:bg-slate-50">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              </section>

              <section className="mt-6 grid gap-6 xl:grid-cols-[1.35fr_0.95fr]">
                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 p-5">
                    <h3 className="text-lg font-bold text-slate-950">Projects CRUD Table</h3>
                    <p className="text-sm text-slate-500">Create, view, edit, and delete records from PostgreSQL</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                          <th className="px-5 py-4">Project</th>
                          <th className="px-5 py-4">Client</th>
                          <th className="px-5 py-4">Status</th>
                          <th className="px-5 py-4">Progress</th>
                          <th className="px-5 py-4 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filteredProjects.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-5 py-10 text-center text-sm text-slate-500">
                              No projects found.
                            </td>
                          </tr>
                        ) : (
                          filteredProjects.map((project) => (
                            <tr key={project.id} className="hover:bg-slate-50">
                              <td className="px-5 py-4">
                                <button onClick={() => setSelectedProject(project)} className="font-semibold text-slate-950 hover:underline">
                                  {project.name}
                                </button>
                                <p className="text-xs text-slate-500">{project.plan} plan</p>
                              </td>
                              <td className="px-5 py-4 text-slate-600">{project.client}</td>
                              <td className="px-5 py-4">
                                <StatusBadge status={project.status} />
                              </td>
                              <td className="px-5 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="h-2 w-28 rounded-full bg-slate-100">
                                    <div className="h-2 rounded-full bg-slate-950" style={{ width: `${project.progress}%` }} />
                                  </div>
                                  <span className="text-xs font-semibold">{project.progress}%</span>
                                </div>
                              </td>
                              <td className="px-5 py-4 text-right">
                                <button onClick={() => startEdit(project)} className="mr-2 rounded-xl border border-slate-200 p-2 hover:bg-slate-100" aria-label={`Edit ${project.name}`}>
                                  <Icon name="edit" className="h-4 w-4" />
                                </button>
                                <button onClick={() => deleteProject(project.id)} className="rounded-xl border border-slate-200 p-2 hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${project.name}`}>
                                  <Icon name="trash" className="h-4 w-4" />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <div className="border-b border-slate-200 p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-bold text-slate-950">AI Chatbot</h3>
                        <p className="text-sm text-slate-500">FastAPI mock AI endpoint</p>
                      </div>
                      <div className="rounded-2xl bg-slate-950 p-3 text-white">
                        <Icon name="bot" className="h-5 w-5" />
                      </div>
                    </div>
                  </div>
                  <div className="flex h-[430px] flex-col">
                    <div className="flex-1 space-y-3 overflow-y-auto p-5">
                      {messages.map((message, index) => (
                        <div key={`${message.role}-${index}`} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                          <div
                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                              message.role === "user" ? "bg-slate-950 text-white" : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {message.text}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-slate-200 p-4">
                      <div className="flex gap-2">
                        <input
                          value={chatInput}
                          onChange={(event) => setChatInput(event.target.value)}
                          onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                          placeholder="Ask about project health..."
                          className="h-11 flex-1 rounded-2xl border border-slate-200 px-4 text-sm outline-none ring-slate-950/10 focus:ring-4"
                        />
                        <button onClick={sendMessage} className="rounded-2xl bg-slate-950 px-5 text-sm font-semibold text-white hover:bg-slate-800">
                          Send
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {selectedProject && (
                <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-950">Selected Record Preview</h3>
                  <p className="mt-2 text-sm text-slate-500">{selectedProject.description || "No description provided."}</p>
                </section>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
