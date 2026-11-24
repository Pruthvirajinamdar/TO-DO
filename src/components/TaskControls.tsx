import { ArrowUpDown, Search, Trash2, X } from 'lucide-react';
import {
  CategoryFilter,
  PriorityFilter,
  SortOption,
  StatusFilter,
} from '../types/task';

interface TaskControlsProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  statusFilter: StatusFilter;
  onStatusFilterChange: (status: StatusFilter) => void;
  hideStatusTabs?: boolean;
  priorityFilter: PriorityFilter;
  onPriorityFilterChange: (priority: PriorityFilter) => void;
  categoryFilter: CategoryFilter;
  onCategoryFilterChange: (category: CategoryFilter) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  completedCount: number;
  onClearCompleted: () => void;
}

const STATUS_TABS: StatusFilter[] = ['All', 'Pending', 'Completed'];

export function TaskControls({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  hideStatusTabs = false,
  priorityFilter,
  onPriorityFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  sortBy,
  onSortChange,
  completedCount,
  onClearCompleted,
}: TaskControlsProps) {
  return (
    <div className="space-y-3 rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400 dark:text-slate-500"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks by title or description..."
            aria-label="Search tasks"
            className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pr-9 pl-10 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-indigo-400 dark:focus:bg-slate-800"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute top-1/2 right-2.5 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded text-slate-400 hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        {!hideStatusTabs && (
          <div
            role="tablist"
            aria-label="Filter tasks by status"
            className="inline-flex items-center gap-1 self-start rounded-lg bg-slate-100 p-1 md:self-auto dark:bg-slate-800"
          >
            {STATUS_TABS.map((tab) => {
              const active = statusFilter === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => onStatusFilterChange(tab)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors duration-150 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
                    active
                      ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-slate-100'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
                  }`}
                >
                  {tab}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Secondary Filter & Sort Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2">
            <label
              htmlFor="priority-filter"
              className="text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              Priority
            </label>
            <select
              id="priority-filter"
              value={priorityFilter}
              onChange={(e) =>
                onPriorityFilterChange(e.target.value as PriorityFilter)
              }
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="All">All Priorities</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="category-filter"
              className="text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              Category
            </label>
            <select
              id="category-filter"
              value={categoryFilter}
              onChange={(e) =>
                onCategoryFilterChange(e.target.value as CategoryFilter)
              }
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="All">All Categories</option>
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Personal">Personal</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 dark:text-slate-400"
            >
              <ArrowUpDown className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sort</span>
            </label>
            <select
              id="sort-select"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="h-9 rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-medium text-slate-700 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="dueDate">Due Date</option>
            </select>
          </div>
        </div>

        {completedCount > 0 && (
          <button
            type="button"
            onClick={onClearCompleted}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 text-xs font-medium text-rose-700 transition-colors duration-150 hover:bg-rose-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 whitespace-nowrap shrink-0 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300 dark:hover:bg-rose-950/70"
          >
            <Trash2 className="h-3.5 w-3.5 shrink-0" />
            <span>Clear Completed ({completedCount})</span>
          </button>
        )}
      </div>
    </div>
  );
}
