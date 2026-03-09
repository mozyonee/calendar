import type { TaskColor } from '@calendar/types';

export const TASK_COLORS: TaskColor[] = ['green', 'blue', 'orange', 'red', 'purple'];

export const TASK_COLOR_TOKEN: Record<TaskColor, string> = {
	green: '$green400',
	blue: '$sky400',
	orange: '$amber400',
	red: '$rose400',
	purple: '$purple400',
};
