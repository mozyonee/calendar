import type { Task, CreateTaskDto, UpdateTaskDto, ReorderTaskDto } from '@calendar/types';
import api from '@/lib/api';

export const taskApi = {
	fetchByMonth: (year: number, month: number) =>
		api.get<Task[]>('/tasks', { params: { year, month } }).then((r) => r.data),

	create: (dto: CreateTaskDto) => api.post<Task>('/tasks', dto).then((r) => r.data),

	update: (id: string, dto: UpdateTaskDto) => api.patch<Task>(`/tasks/${id}`, dto).then((r) => r.data),

	reorder: (id: string, dto: ReorderTaskDto) => api.patch<Task[]>(`/tasks/${id}/reorder`, dto).then((r) => r.data),

	remove: (id: string) => api.delete(`/tasks/${id}`),
};
