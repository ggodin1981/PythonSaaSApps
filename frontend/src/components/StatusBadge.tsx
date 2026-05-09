import type { ProjectStatus } from "../types";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const styles: Record<ProjectStatus, string> = {
    Active: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Review: "bg-amber-50 text-amber-700 border-amber-200",
    Paused: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
