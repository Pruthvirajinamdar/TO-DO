import { CheckCircle2, Clock, Flag, Layers } from 'lucide-react';

interface StatsOverviewProps {
  total: number;
  completed: number;
  pending: number;
  highPriorityPending: number;
}

export function StatsOverview({
  total,
  completed,
  pending,
  highPriorityPending,
}: StatsOverviewProps) {
  const completionPercent =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  const stats = [
    {
      label: 'Total Tasks',
      value: total,
      helper: total === 1 ? '1 task tracked' : `${total} tasks tracked`,
      icon: Layers,
      accent: 'text-indigo-600 dark:text-indigo-400',
      iconBg: 'bg-indigo-50 dark:bg-indigo-500/15',
    },
    {
      label: 'Completed',
      value: completed,
      helper: `${completionPercent}% completion rate`,
      icon: CheckCircle2,
      accent: 'text-emerald-600 dark:text-emerald-400',
      iconBg: 'bg-emerald-50 dark:bg-emerald-500/15',
    },
    {
      label: 'Pending',
      value: pending,
      helper: pending === 0 ? 'All caught up' : 'Remaining to finish',
      icon: Clock,
      accent: 'text-amber-600 dark:text-amber-400',
      iconBg: 'bg-amber-50 dark:bg-amber-500/15',
    },
    {
      label: 'High Priority',
      value: highPriorityPending,
      helper:
        highPriorityPending === 0
          ? 'No urgent tasks left'
          : 'Open priority items',
      icon: Flag,
      accent: 'text-rose-600 dark:text-rose-400',
      iconBg: 'bg-rose-50 dark:bg-rose-500/15',
    },
  ];

  return (
    <section aria-label="Task Statistics" className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-5 transition-colors duration-150 dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="space-y-1.5">
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                  {stat.label}
                </p>
                <p className="font-display text-3xl font-bold tracking-tight text-slate-900 tabular-nums dark:text-slate-100">
                  {stat.value}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {stat.helper}
                </p>
              </div>
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.iconBg} ${stat.accent}`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Progress Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="font-display text-sm font-semibold text-slate-900 dark:text-slate-100">
              Overall Completion Progress
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              <span className="tabular-nums">{completed}</span> of{' '}
              <span className="tabular-nums">{total}</span> tasks completed
            </p>
          </div>
          <span className="font-mono text-lg font-semibold text-indigo-600 tabular-nums dark:text-indigo-400">
            {completionPercent}%
          </span>
        </div>

        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800"
          role="progressbar"
          aria-valuenow={completionPercent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Task completion percentage"
        >
          <div
            className="h-full rounded-full bg-indigo-600 transition-all duration-300 ease-out dark:bg-indigo-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>
    </section>
  );
}
