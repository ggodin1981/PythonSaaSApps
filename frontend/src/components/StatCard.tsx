import { Icon } from "./Icon";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: string;
  trend: string;
}

export function StatCard({ title, value, subtitle, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-2 text-2xl font-bold text-slate-950">{value}</h3>
          <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
        </div>
        <div className="rounded-2xl bg-slate-950 p-3 text-white">
          <Icon name={icon} />
        </div>
      </div>
      <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
        <Icon name="zap" className="h-3.5 w-3.5" /> {trend}
      </div>
    </div>
  );
}
