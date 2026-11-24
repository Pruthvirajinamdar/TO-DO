import { Menu, Moon, Plus, Sun } from 'lucide-react';
import { NavSection, ThemeMode } from '../types/task';
import { formatLiveDateTime } from '../utils/dateUtils';

interface HeaderProps {
  activeSection: NavSection;
  currentTime: Date;
  theme: ThemeMode;
  onToggleTheme: () => void;
  onOpenNewTask: () => void;
  onOpenMobileMenu: () => void;
}

const SECTION_LABELS: Record<NavSection, string> = {
  dashboard: 'Dashboard',
  all: 'All Tasks',
  today: 'Today',
  upcoming: 'Upcoming',
  completed: 'Completed',
  settings: 'Settings',
};

export function Header({
  activeSection,
  currentTime,
  theme,
  onToggleTheme,
  onOpenNewTask,
  onOpenMobileMenu,
}: HeaderProps) {
  const { dateLabel, timeLabel } = formatLiveDateTime(currentTime);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md sm:px-6 lg:px-8 dark:border-slate-800 dark:bg-slate-900/90">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onOpenMobileMenu}
            aria-label="Open navigation menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900 lg:hidden dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 text-sm min-w-0">
            <span className="hidden text-slate-400 sm:inline dark:text-slate-500">
              TaskFlow
            </span>
            <span
              className="hidden text-slate-300 sm:inline dark:text-slate-700"
              aria-hidden="true"
            >
              /
            </span>
            <span className="truncate font-display font-semibold text-slate-900 dark:text-slate-100">
              {SECTION_LABELS[activeSection]}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="hidden items-center gap-2 text-xs text-slate-500 md:flex dark:text-slate-400">
            <span className="whitespace-nowrap">{dateLabel}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums whitespace-nowrap text-slate-700 dark:text-slate-300">
              {timeLabel}
            </span>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
            title={
              theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-100"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </button>

          <button
            type="button"
            onClick={onOpenNewTask}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-xs transition-colors duration-150 hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 whitespace-nowrap dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus-visible:ring-offset-slate-900"
          >
            <Plus className="h-4 w-4 shrink-0" />
            <span>Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
}
