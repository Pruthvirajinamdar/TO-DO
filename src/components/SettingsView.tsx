import { Download, Moon, RotateCcw, Sun, Trash2 } from 'lucide-react';
import { AppSettings, Category, Priority, Task } from '../types/task';

interface SettingsViewProps {
  settings: AppSettings;
  tasks: Task[];
  onUpdateSettings: (partial: Partial<AppSettings>) => void;
  onExportTasks: () => void;
  onRestoreStarterTasks: () => void;
  onRequestClearAllTasks: () => void;
}

const PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];
const CATEGORIES: Category[] = ['Work', 'Study', 'Personal', 'Other'];

export function SettingsView({
  settings,
  tasks,
  onUpdateSettings,
  onExportTasks,
  onRestoreStarterTasks,
  onRequestClearAllTasks,
}: SettingsViewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Settings
        </h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Customize your TaskFlow workspace, defaults, and local data backup.
        </p>
      </div>

      {/* Appearance */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
          Appearance
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Choose between Light and Dark mode for your workspace.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => onUpdateSettings({ theme: 'light' })}
            aria-pressed={settings.theme === 'light'}
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${
              settings.theme === 'light'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Sun className="h-4 w-4" />
            <span>Light Mode</span>
          </button>

          <button
            type="button"
            onClick={() => onUpdateSettings({ theme: 'dark' })}
            aria-pressed={settings.theme === 'dark'}
            className={`inline-flex h-10 items-center gap-2 rounded-lg border px-4 text-sm font-medium transition-colors ${
              settings.theme === 'dark'
                ? 'border-indigo-600 bg-indigo-50 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300'
                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
            }`}
          >
            <Moon className="h-4 w-4" />
            <span>Dark Mode</span>
          </button>
        </div>
      </section>

      {/* Workspace Defaults */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
          Workspace Defaults
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Configure your display name and default selections when creating new
          tasks.
        </p>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="settings-name"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Display Name
            </label>
            <input
              id="settings-name"
              type="text"
              value={settings.userName}
              onChange={(e) => onUpdateSettings({ userName: e.target.value })}
              placeholder="Your name"
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            />
          </div>

          <div>
            <label
              htmlFor="settings-priority"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Default Priority
            </label>
            <select
              id="settings-priority"
              value={settings.defaultPriority}
              onChange={(e) =>
                onUpdateSettings({
                  defaultPriority: e.target.value as Priority,
                })
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="settings-category"
              className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-200"
            >
              Default Category
            </label>
            <select
              id="settings-category"
              value={settings.defaultCategory}
              onChange={(e) =>
                onUpdateSettings({
                  defaultCategory: e.target.value as Category,
                })
              }
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Data Management */}
      <section className="rounded-xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
        <h2 className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
          Data Management
        </h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          All tasks are saved automatically in your browser&apos;s LocalStorage (
          <span className="font-mono tabular-nums">{tasks.length}</span> tasks
          stored).
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onExportTasks}
            disabled={tasks.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <Download className="h-4 w-4" />
            <span>Export JSON</span>
          </button>

          <button
            type="button"
            onClick={onRestoreStarterTasks}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Load Sample Tasks</span>
          </button>

          <button
            type="button"
            onClick={onRequestClearAllTasks}
            disabled={tasks.length === 0}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 px-4 text-sm font-medium text-rose-700 transition-colors hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete All Tasks</span>
          </button>
        </div>
      </section>
    </div>
  );
}
