export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getOffsetDateString(offsetDays: number): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDueDateLabel(dueDate: string, completed = false): {
  label: string;
  isOverdue: boolean;
  isToday: boolean;
} {
  if (!dueDate) {
    return { label: 'No due date', isOverdue: false, isToday: false };
  }

  const todayStr = getTodayDateString();
  const tomorrowStr = getOffsetDateString(1);
  const yesterdayStr = getOffsetDateString(-1);

  if (dueDate === todayStr) {
    return { label: 'Due Today', isOverdue: false, isToday: true };
  }

  if (dueDate === tomorrowStr) {
    return { label: 'Due Tomorrow', isOverdue: false, isToday: false };
  }

  if (dueDate === yesterdayStr) {
    return {
      label: completed ? 'Yesterday' : 'Overdue · Yesterday',
      isOverdue: !completed,
      isToday: false,
    };
  }

  const [year, month, day] = dueDate.split('-').map(Number);
  const parsed = new Date(year, month - 1, day);
  const formatted = parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year:
      parsed.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  });

  const isOverdue = !completed && dueDate < todayStr;
  return {
    label: isOverdue ? `Overdue · ${formatted}` : `Due ${formatted}`,
    isOverdue,
    isToday: false,
  };
}

export function formatLiveDateTime(date: Date): {
  dateLabel: string;
  timeLabel: string;
} {
  const dateLabel = date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const timeLabel = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

  return { dateLabel, timeLabel };
}

export function getGreeting(date: Date): string {
  const hour = date.getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}
