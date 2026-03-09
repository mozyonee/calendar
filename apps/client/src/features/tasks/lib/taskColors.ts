import type { TaskColor } from '@calendar/types';

export const TASK_COLORS: TaskColor[] = ['green', 'blue', 'orange', 'red', 'purple'];

export const TASK_COLOR_CLASS: Record<TaskColor, string> = {
	green: 'bg-green-400',
	blue: 'bg-sky-400',
	orange: 'bg-amber-400',
	red: 'bg-rose-400',
	purple: 'bg-accent-500',
};
