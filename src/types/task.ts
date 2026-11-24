export type Priority = 'Low' | 'Medium' | 'High';

export type Category = 'Study' | 'Personal' | 'Work' | 'Other';

export type NavSection =
  | 'dashboard'
  | 'all'
  | 'today'
  | 'upcoming'
  | 'completed'
  | 'settings';

export type StatusFilter = 'All' | 'Pending' | 'Completed';

export type PriorityFilter = 'All' | Priority;

export type CategoryFilter = 'All' | Category;

export type SortOption = 'newest' | 'oldest' | 'dueDate';

export type ThemeMode = 'light' | 'dark';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  dueDate: string; // YYYY-MM-DD or ''
  completed: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export interface TaskFormData {
  title: string;
  description: string;
  priority: Priority;
  category: Category;
  dueDate: string;
}

export interface AppSettings {
  theme: ThemeMode;
  defaultPriority: Priority;
  defaultCategory: Category;
  userName: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'info' | 'warning' | 'error';
}
