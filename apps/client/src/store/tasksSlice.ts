import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import type { Task, CreateTaskDto, UpdateTaskDto, ReorderTaskDto } from '@calendar/types';
import { taskApi } from '@/lib/taskApi';
import type { RootState } from './index';

interface TasksState {
	byDate: Record<string, Task[]>;
	status: 'idle' | 'loading' | 'succeeded' | 'failed';
	error: string | null;
}

const initialState: TasksState = {
	byDate: {},
	status: 'idle',
	error: null,
};

export const fetchTasksForMonth = createAsyncThunk(
	'tasks/fetchForMonth',
	({ year, month }: { year: number; month: number }) => taskApi.fetchByMonth(year, month),
);

export const addTask = createAsyncThunk('tasks/add', (dto: CreateTaskDto) => taskApi.create(dto));

export const editTask = createAsyncThunk(
	'tasks/edit',
	({ id, dto }: { id: string; dto: UpdateTaskDto }) => taskApi.update(id, dto),
);

export const removeTask = createAsyncThunk(
	'tasks/remove',
	async ({ id, date }: { id: string; date: string }) => {
		await taskApi.remove(id);
		return { id, date };
	},
);

export const reorderTask = createAsyncThunk(
	'tasks/reorder',
	({ id, dto }: { id: string; dto: ReorderTaskDto }) => taskApi.reorder(id, dto),
);

function normalizeTasks(tasks: Task[]): Record<string, Task[]> {
	const byDate: Record<string, Task[]> = {};
	for (const task of tasks) {
		if (!byDate[task.date]) byDate[task.date] = [];
		byDate[task.date].push(task);
	}
	// Ensure sorted by order within each date
	for (const date of Object.keys(byDate)) {
		byDate[date].sort((a, b) => a.order - b.order);
	}
	return byDate;
}

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTasksForMonth.pending, (state) => {
				state.status = 'loading';
				state.byDate = {};
			})
			.addCase(fetchTasksForMonth.fulfilled, (state, action) => {
				state.status = 'succeeded';
				state.byDate = normalizeTasks(action.payload);
			})
			.addCase(fetchTasksForMonth.rejected, (state, action) => {
				state.status = 'failed';
				state.error = action.error.message ?? 'Failed to fetch tasks';
			})
			.addCase(addTask.fulfilled, (state, action) => {
				const task = action.payload;
				if (!state.byDate[task.date]) state.byDate[task.date] = [];
				state.byDate[task.date].push(task);
				state.byDate[task.date].sort((a, b) => a.order - b.order);
			})
			.addCase(editTask.fulfilled, (state, action) => {
				const task = action.payload;
				if (!state.byDate[task.date]) return;
				const idx = state.byDate[task.date].findIndex((t) => t._id === task._id);
				if (idx !== -1) state.byDate[task.date][idx] = task;
			})
			.addCase(removeTask.fulfilled, (state, action) => {
				const { id, date } = action.payload;
				if (state.byDate[date]) {
					state.byDate[date] = state.byDate[date].filter((t) => t._id !== id);
				}
			})
			.addCase(reorderTask.fulfilled, (state, action) => {
				// Server returns all tasks for affected dates; replace them
				const updated = normalizeTasks(action.payload);
				for (const [date, tasks] of Object.entries(updated)) {
					state.byDate[date] = tasks;
				}
			});
	},
});

export default tasksSlice.reducer;

// Selectors
const selectTasksByDate = (state: RootState) => state.tasks.byDate;
const selectSearchQuery = (state: RootState) => state.calendar.searchQuery;

export const selectFilteredTasksByDate = createSelector(
	[selectTasksByDate, selectSearchQuery],
	(byDate, query) => {
		if (!query.trim()) return byDate;
		const q = query.toLowerCase();
		const filtered: Record<string, Task[]> = {};
		for (const [date, tasks] of Object.entries(byDate)) {
			const matching = tasks.filter((t) => t.title.toLowerCase().includes(q));
			filtered[date] = matching;
		}
		return filtered;
	},
);
