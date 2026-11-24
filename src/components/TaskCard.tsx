import { Calendar, Check, Flag, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Priority, Task } from '../types/task';
import { formatDueDateLabel } from '../utils/dateUtils';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onEdit: (task: Task) => void;
  onRequestDelete: (task: Task) => void;
}

const PRIORITY_STYLES: Record<Priority, string> = {
  High: 'text-rose-600 dark:text-rose-400',
  Medium: 'text-amber-600 dark:text-amber-400',
  Low: 'text-slate-500 dark:text-slate-400',
};

export function TaskCard({
  task,
  onToggleComplete,
  onEdit,
  onRequestDelete,
}: TaskCardProps) {
  const dueInfo = formatDueDateLabel(task.dueDate, task.completed);

  return (
    <motion.article
      layout="position"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
      className={`group rounded-xl border p-4 transition-colors duration-150 sm:p-5 ${
        task.completed
          ? 'border-slate-200/80 bg-slate-50/70 dark:border-slate-800/70 dark:bg-slate-900/50'
          : 'border-slate-200 bg-white hover:border-indigo-200 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-indigo-500/40'
      }`}
    >
      <div className="flex items-start gap-3.5">
        {/* Completion Checkbox */}
        <button
          type="button"
          onClick={() => onToggleComplete(task.id)}
          aria-label={
            task.completed
              ? `Mark "${task.title}" as pending`
              : `Mark "${task.title}" as completed`
          }
          aria-pressed={task.completed}
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900 ${
            task.completed
              ? 'border-indigo-600 bg-indigo-600 text-white dark:border-indigo-500 dark:bg-indigo-500'
              : 'border-slate-300 bg-white hover:border-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:hover:border-indigo-400'
          }`}
        >
          {task.completed && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
        </button>

        {/* Main Content */}
        <div className="min-w-0 flex-1 space-y-1.5">
          <div className="flex items-start justify-between gap-3">
            <h3
              className={`font-display text-base font-semibold leading-snug transition-colors ${
                task.completed
                  ? 'text-slate-400 line-through dark:text-slate-500'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h3>

            {/* Card Actions */}
            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() => onEdit(task)}
                aria-label={`Edit "${task.title}"`}
                title="Edit task"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => onRequestDelete(task)}
                aria-label={`Delete "${task.title}"`}
                title="Delete task"
                className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors duration-150 hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 dark:text-slate-500 dark:hover:bg-rose-950/50 dark:hover:text-rose-400"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>

          {task.description && (
            <p
              className={`text-sm leading-relaxed ${
                task.completed
                  ? 'text-slate-400 dark:text-slate-500'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              {task.description}
            </p>
          )}

          {/* Clean Unboxed Metadata Row (Zero-Pill Discipline) */}
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 pt-1 text-xs text-slate-500 dark:text-slate-400">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {task.category}
            </span>

            <span aria-hidden="true">·</span>

            <span
              className={`inline-flex items-center gap-1 font-medium ${PRIORITY_STYLES[task.priority]}`}
            >
              <Flag className="h-3 w-3" aria-hidden="true" />
              <span>{task.priority} priority</span>
            </span>

            <span aria-hidden="true">·</span>

            <span
              className={`inline-flex items-center gap-1 tabular-nums ${
                dueInfo.isOverdue
                  ? 'font-medium text-rose-600 dark:text-rose-400'
                  : dueInfo.isToday && !task.completed
                    ? 'font-medium text-indigo-600 dark:text-indigo-400'
                    : ''
              }`}
            >
              <Calendar className="h-3 w-3" aria-hidden="true" />
              <span>{dueInfo.label}</span>
            </span>

            <span aria-hidden="true">·</span>

            <span
              className={
                task.completed
                  ? 'font-medium text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-500 dark:text-slate-400'
              }
            >
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
