import { useCallback, useEffect, useMemo, useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ConfirmModal } from './components/ConfirmModal';
import { EmptyState } from './components/EmptyState';
import { Header } from './components/Header';
import { SettingsView } from './components/SettingsView';
import { Sidebar } from './components/Sidebar';
import { StatsOverview } from './components/StatsOverview';
import { TaskCard } from './components/TaskCard';
import { TaskControls } from './components/TaskControls';
import { TaskModal } from './components/TaskModal';
import { ToastContainer } from './components/ToastContainer';
import {
  AppSettings,
  CategoryFilter,
  NavSection,
  PriorityFilter,
  SortOption,
  StatusFilter,
  Task,
  TaskFormData,
  ToastMessage,
} from './types/task';
import {
  formatLiveDateTime,
  getGreeting,
  getTodayDateString,
} from './utils/dateUtils';
import {
  createStarterTasks,
  loadSettings,
  loadTasks,
  saveSettings,
  saveTasks,
} from './utils/storage';

type ConfirmState =
  | { type: 'single'; task: Task }
  | { type: 'completed'; count: number }
  | { type: 'all'; count: number }
  | null;

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [settings, setSettings] = useState<AppSettings>(() => loadSettings());
  const [activeSection, setActiveSection] = useState<NavSection>('dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Live Date & Time
  const [currentTime, setCurrentTime] = useState(() => new Date());

  // Search, Filter & Sort State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  // Modals & Toasts
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [confirmState, setConfirmState] = useState<ConfirmState>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist tasks to LocalStorage
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Persist settings & apply dark class on <html>
  useEffect(() => {
    saveSettings(settings);
    document.documentElement.classList.toggle('dark', settings.theme === 'dark');
  }, [settings]);

  // Update clock every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const addToast = useCallback(
    (
      title: string,
      variant: ToastMessage['variant'] = 'success',
      description?: string
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev.slice(-3), { id, title, variant, description }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 3500);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const todayStr = getTodayDateString();

  // Dashboard Statistics
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;
    const highPriorityPending = tasks.filter(
      (t) => !t.completed && t.priority === 'High'
    ).length;

    const todayCount = tasks.filter(
      (t) =>
        t.dueDate === todayStr ||
        (Boolean(t.dueDate) && t.dueDate < todayStr && !t.completed)
    ).length;

    const upcomingCount = tasks.filter(
      (t) => Boolean(t.dueDate) && t.dueDate > todayStr
    ).length;

    return {
      total,
      completed,
      pending,
      highPriorityPending,
      todayCount,
      upcomingCount,
    };
  }, [tasks, todayStr]);

  // Section + Search + Filter + Sort pipeline
  const visibleTasks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const filtered = tasks.filter((task) => {
      // Section scope
      if (activeSection === 'today') {
        const isDueTodayOrOverdue =
          task.dueDate === todayStr ||
          (Boolean(task.dueDate) && task.dueDate < todayStr && !task.completed);
        if (!isDueTodayOrOverdue) return false;
      } else if (activeSection === 'upcoming') {
        if (!task.dueDate || task.dueDate <= todayStr) return false;
      } else if (activeSection === 'completed') {
        if (!task.completed) return false;
      }

      // Status tab filter (when not in Completed-only view)
      if (activeSection !== 'completed') {
        if (statusFilter === 'Pending' && task.completed) return false;
        if (statusFilter === 'Completed' && !task.completed) return false;
      }

      // Priority filter
      if (priorityFilter !== 'All' && task.priority !== priorityFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'All' && task.category !== categoryFilter) {
        return false;
      }

      // Search query
      if (query) {
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      // Sort by dueDate (tasks without due dates go last)
      if (!a.dueDate && !b.dueDate) {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    });
  }, [
    tasks,
    activeSection,
    todayStr,
    statusFilter,
    priorityFilter,
    categoryFilter,
    searchQuery,
    sortBy,
  ]);

  const hasActiveFilters =
    searchQuery.trim() !== '' ||
    (activeSection !== 'completed' && statusFilter !== 'All') ||
    priorityFilter !== 'All' ||
    categoryFilter !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
  };

  // CRUD Handlers
  const handleSaveTask = (data: TaskFormData, existingId?: string) => {
    const nowIso = new Date().toISOString();

    if (existingId) {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === existingId
            ? {
                ...task,
                ...data,
                updatedAt: nowIso,
              }
            : task
        )
      );
      addToast('Task updated', 'success', data.title);
    } else {
      const newTask: Task = {
        id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        ...data,
        completed: false,
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      setTasks((prev) => [newTask, ...prev]);
      addToast('Task created', 'success', data.title);
    }
  };

  const handleToggleComplete = (id: string) => {
    let targetTitle = '';
    let nextCompleted = false;

    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== id) return task;
        targetTitle = task.title;
        nextCompleted = !task.completed;
        return {
          ...task,
          completed: nextCompleted,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (targetTitle) {
      addToast(
        nextCompleted ? 'Task completed' : 'Task reopened',
        nextCompleted ? 'success' : 'info',
        targetTitle
      );
    }
  };

  const handleConfirmDelete = () => {
    if (!confirmState) return;

    if (confirmState.type === 'single') {
      const { task } = confirmState;
      setTasks((prev) => prev.filter((t) => t.id !== task.id));
      addToast('Task deleted', 'info', task.title);
    } else if (confirmState.type === 'completed') {
      const removedCount = confirmState.count;
      setTasks((prev) => prev.filter((t) => !t.completed));
      addToast(
        'Completed tasks cleared',
        'info',
        `Removed ${removedCount} completed ${removedCount === 1 ? 'task' : 'tasks'}.`
      );
    } else if (confirmState.type === 'all') {
      setTasks([]);
      addToast('All tasks deleted', 'warning', 'Your task list is now empty.');
    }

    setConfirmState(null);
  };

  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    setSettings((prev) => ({ ...prev, theme: nextTheme }));
    addToast(
      nextTheme === 'dark' ? 'Dark mode enabled' : 'Light mode enabled',
      'info'
    );
  };

  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  };

  const handleExportTasks = () => {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taskflow-backup-${getTodayDateString()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addToast('Tasks exported', 'success', 'Downloaded JSON backup file.');
  };

  const handleRestoreStarterTasks = () => {
    const starter = createStarterTasks();
    setTasks(starter);
    addToast('Sample tasks loaded', 'success', 'Restored 6 sample tasks.');
  };

  const openNewTaskModal = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const openEditTaskModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const { dateLabel, timeLabel } = formatLiveDateTime(currentTime);
  const greeting = getGreeting(currentTime);
  const displayName = settings.userName.trim() || 'there';

  const sectionHeaders: Record<
    Exclude<NavSection, 'dashboard' | 'settings'>,
    { title: string; subtitle: string }
  > = {
    all: {
      title: 'All Tasks',
      subtitle: 'View, search, and organize every task in your workspace.',
    },
    today: {
      title: "Today's Focus",
      subtitle: 'Tasks scheduled for today and any overdue items.',
    },
    upcoming: {
      title: 'Upcoming Schedule',
      subtitle: 'Tasks planned for tomorrow and later dates.',
    },
    completed: {
      title: 'Completed Archive',
      subtitle: 'Review finished tasks or clear them in bulk.',
    },
  };

  const getEmptyStateCopy = () => {
    if (hasActiveFilters) {
      return {
        title: 'No matching tasks found',
        description:
          'Try adjusting your search query, status tab, priority, or category filter.',
      };
    }
    if (activeSection === 'today') {
      return {
        title: 'Nothing due today',
        description:
          'You have no tasks scheduled for today. Enjoy the clear schedule or add a new priority.',
      };
    }
    if (activeSection === 'upcoming') {
      return {
        title: 'No upcoming tasks',
        description:
          'Add a task with a future due date to plan ahead for the week.',
      };
    }
    if (activeSection === 'completed') {
      return {
        title: 'No completed tasks yet',
        description:
          'Check off tasks as you finish them to build momentum and see your progress here.',
      };
    }
    return {
      title: 'Your task list is empty',
      description:
        'Create your first task to start organizing your daily priorities and tracking progress.',
    };
  };

  const emptyCopy = getEmptyStateCopy();

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <Sidebar
        activeSection={activeSection}
        onSelectSection={setActiveSection}
        counts={{
          all: stats.total,
          today: stats.todayCount,
          upcoming: stats.upcomingCount,
          completed: stats.completed,
        }}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          activeSection={activeSection}
          currentTime={currentTime}
          theme={settings.theme}
          onToggleTheme={handleToggleTheme}
          onOpenNewTask={openNewTaskModal}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <div className="mx-auto max-w-6xl space-y-6">
            {activeSection === 'settings' ? (
              <SettingsView
                settings={settings}
                tasks={tasks}
                onUpdateSettings={handleUpdateSettings}
                onExportTasks={handleExportTasks}
                onRestoreStarterTasks={handleRestoreStarterTasks}
                onRequestClearAllTasks={() =>
                  setConfirmState({ type: 'all', count: tasks.length })
                }
              />
            ) : (
              <>
                {/* View Header */}
                {activeSection === 'dashboard' ? (
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                    <div>
                      <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                        {greeting}, {displayName}
                      </h1>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {stats.pending === 0
                          ? 'All tasks are complete. Add a new task whenever you are ready.'
                          : `You have ${stats.pending} pending ${
                              stats.pending === 1 ? 'task' : 'tasks'
                            }${
                              stats.highPriorityPending > 0
                                ? ` including ${stats.highPriorityPending} high-priority`
                                : ''
                            }.`}
                      </p>
                    </div>
                    <p className="font-mono text-xs text-slate-500 tabular-nums md:hidden dark:text-slate-400">
                      {dateLabel} · {timeLabel}
                    </p>
                  </div>
                ) : (
                  <div>
                    <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl dark:text-slate-100">
                      {sectionHeaders[activeSection].title}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                      {sectionHeaders[activeSection].subtitle}
                    </p>
                  </div>
                )}

                {/* Dashboard KPI Cards & Progress Bar */}
                {activeSection === 'dashboard' && (
                  <StatsOverview
                    total={stats.total}
                    completed={stats.completed}
                    pending={stats.pending}
                    highPriorityPending={stats.highPriorityPending}
                  />
                )}

                {/* Search, Filter & Sort Controls */}
                <TaskControls
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  hideStatusTabs={activeSection === 'completed'}
                  priorityFilter={priorityFilter}
                  onPriorityFilterChange={setPriorityFilter}
                  categoryFilter={categoryFilter}
                  onCategoryFilterChange={setCategoryFilter}
                  sortBy={sortBy}
                  onSortChange={setSortBy}
                  completedCount={stats.completed}
                  onClearCompleted={() =>
                    setConfirmState({
                      type: 'completed',
                      count: stats.completed,
                    })
                  }
                />

                {/* Task List */}
                <section aria-label="Task List" className="space-y-3">
                  <div className="flex items-center justify-between px-1">
                    <h2 className="font-display text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Tasks{' '}
                      <span className="font-mono font-normal text-slate-500 tabular-nums dark:text-slate-400">
                        ({visibleTasks.length})
                      </span>
                    </h2>
                    {hasActiveFilters && (
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>

                  {visibleTasks.length === 0 ? (
                    <EmptyState
                      title={emptyCopy.title}
                      description={emptyCopy.description}
                      hasActiveFilters={hasActiveFilters}
                      onResetFilters={handleResetFilters}
                      onAddTask={openNewTaskModal}
                    />
                  ) : (
                    <div className="space-y-3">
                      <AnimatePresence initial={false}>
                        {visibleTasks.map((task) => (
                          <TaskCard
                            key={task.id}
                            task={task}
                            onToggleComplete={handleToggleComplete}
                            onEdit={openEditTaskModal}
                            onRequestDelete={(target) =>
                              setConfirmState({ type: 'single', task: target })
                            }
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </section>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Create / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        editingTask={editingTask}
        defaultPriority={settings.defaultPriority}
        defaultCategory={settings.defaultCategory}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={confirmState !== null}
        title={
          confirmState?.type === 'single'
            ? 'Delete task?'
            : confirmState?.type === 'completed'
              ? 'Clear completed tasks?'
              : 'Delete all tasks?'
        }
        description={
          confirmState?.type === 'single'
            ? `Are you sure you want to delete "${confirmState.task.title}"? This action cannot be undone.`
            : confirmState?.type === 'completed'
              ? `This will permanently remove ${confirmState.count} completed ${
                  confirmState.count === 1 ? 'task' : 'tasks'
                } from your list.`
              : `This will permanently remove all ${
                  confirmState?.count ?? 0
                } tasks from LocalStorage.`
        }
        confirmLabel={
          confirmState?.type === 'single'
            ? 'Delete Task'
            : confirmState?.type === 'completed'
              ? 'Clear Completed'
              : 'Delete All'
        }
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmState(null)}
      />

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
