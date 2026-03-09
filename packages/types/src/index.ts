export type TaskColor = 'green' | 'blue' | 'orange' | 'red' | 'purple';

export interface Task {
	_id: string;
	title: string;
	date: string; // "YYYY-MM-DD"
	order: number;
	color: TaskColor;
	createdAt: string;
	updatedAt: string;
}

export interface CreateTaskDto {
	title: string;
	date: string;
	color?: TaskColor;
}

export interface UpdateTaskDto {
	title?: string;
	color?: TaskColor;
}

export interface ReorderTaskDto {
	date: string;
	order: number;
}

export interface PublicHoliday {
	date: string; // "YYYY-MM-DD"
	name: string;
	countryCode: string;
}
