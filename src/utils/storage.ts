import { AppSettings, Task } from '../types/task';
import { getOffsetDateString, getTodayDateString } from './dateUtils';

const TASKS_STORAGE_KEY = 'taskflow_tasks_v1';
const SETTINGS_STORAGE_KEY = 'taskflow_settings_v1';

export const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  defaultPriority: 'Medium',
  defaultCategory: 'Work',
  userName: 'Alex',
};

export function createStarterTasks(): Task[] {
  const today = getTodayDateString();
  const tomorrow = getOffsetDateString(1);
  const inThreeDays = getOffsetDateString(3);
  const yesterday = getOffsetDateString(-1);
  const now = Date.now();

  return [
    {
      id: 'starter-1',
      title: 'Finalize Q4 product roadmap presentation',
      description:
        'Align milestone dates with engineering leads and export the slide deck before the afternoon review.',
      priority: 'High',
      category: 'Work',
      dueDate: today,
      completed: false,
      createdAt: new Date(now - 1000 * 60 * 180).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 180).toISOString(),
    },
    {
      id: 'starter-2',
      title: 'Review React state management patterns',
      description:
        'Work through reducer composition and localStorage synchronization exercises from Chapter 6.',
      priority: 'Medium',
      category: 'Study',
      dueDate: today,
      completed: false,
      createdAt: new Date(now - 1000 * 60 * 240).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 240).toISOString(),
    },
    {
      id: 'starter-3',
      title: 'Prepare sprint retrospective notes',
      description:
        'Gather team feedback on deployment cadence and summarize top three action items.',
      priority: 'High',
      category: 'Work',
      dueDate: tomorrow,
      completed: false,
      createdAt: new Date(now - 1000 * 60 * 320).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 320).toISOString(),
    },
    {
      id: 'starter-4',
      title: 'Schedule annual dental checkup',
      description: 'Call the clinic front desk to book an early morning slot.',
      priority: 'Low',
      category: 'Personal',
      dueDate: inThreeDays,
      completed: false,
      createdAt: new Date(now - 1000 * 60 * 480).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 480).toISOString(),
    },
    {
      id: 'starter-5',
      title: 'Submit weekly design system audit',
      description:
        'Verify spacing tokens, color contrast ratios, and keyboard navigation states.',
      priority: 'Medium',
      category: 'Work',
      dueDate: yesterday,
      completed: true,
      createdAt: new Date(now - 1000 * 60 * 1440).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 600).toISOString(),
    },
    {
      id: 'starter-6',
      title: 'Renew library books and organize desk',
      description:
        'Return two reference books and clear out archived project folders.',
      priority: 'Low',
      category: 'Personal',
      dueDate: yesterday,
      completed: true,
      createdAt: new Date(now - 1000 * 60 * 1800).toISOString(),
      updatedAt: new Date(now - 1000 * 60 * 720).toISOString(),
    },
  ];
}

export function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw === null) {
      const starter = createStarterTasks();
      localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(starter));
      return starter;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

export function loadSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) {
      const prefersDark =
        typeof window !== 'undefined' &&
        window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      const initial: AppSettings = {
        ...DEFAULT_SETTINGS,
        theme: prefersDark ? 'dark' : 'light',
      };
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: AppSettings): void {
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors cleanly
  }
}
