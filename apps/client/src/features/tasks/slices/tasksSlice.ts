import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Task, CreateTaskDto, UpdateTaskDto, ReorderTaskDto } from '@calendar/types';
import { taskApi } from '@/features/tasks/lib/taskApi';
import type { RootState } from '@/store';

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

export const editTask = createAsyncThunk('tasks/edit', ({ id, dto }: { id: string; dto: UpdateTaskDto }) =>
	taskApi.update(id, dto),
);

export const removeTask = createAsyncThunk('tasks/remove', async ({ id, date }: { id: string; date: string }) => {
	await taskApi.remove(id);
	return { id, date };
});

export const reorderTask = createAsyncThunk('tasks/reorder', ({ id, dto }: { id: string; dto: ReorderTaskDto }) =>
	taskApi.reorder(id, dto),
);

function normalizeTasks(tasks: Task[]): Record<string, Task[]> {
	const byDate: Record<string, Task[]> = {};
	for (const task of tasks) {
		if (!byDate[task.date]) byDate[task.date] = [];
		byDate[task.date].push(task);
	}
	for (const date of Object.keys(byDate)) {
		byDate[date].sort((a, b) => a.order - b.order);
	}
	return byDate;
}

const tasksSlice = createSlice({
	name: 'tasks',
	initialState,
	reducers: {
		// Optimistic move: update Redux state immediately on drag end
		moveTaskOptimistic(
			state,
			action: PayloadAction<{ id: string; fromDate: string; toDate: string; toOrder: number }>,
		) {
			const { id, fromDate, toDate, toOrder } = action.payload;

			// Remove from source
			const fromTasks = [...(state.byDate[fromDate] ?? [])];
			const taskIdx = fromTasks.findIndex((t) => t._id === id);
			if (taskIdx === -1) return;
			const [oldTask] = fromTasks.splice(taskIdx, 1);

			// Recompact source
			fromTasks.forEach((t, i) => {
				t.order = i;
			});
			state.byDate[fromDate] = fromTasks;

			// Create a NEW task object to avoid mutating the activeTask reference in UI hooks
			const task = { ...oldTask, date: toDate };

			// Insert into target
			const toTasks = [...(state.byDate[toDate] ?? [])];
			const clamped = Math.min(toOrder, toTasks.length);
			task.order = clamped;
			toTasks.splice(clamped, 0, task);
			toTasks.forEach((t, i) => {
				t.order = i;
			});
			state.byDate[toDate] = toTasks;
		},
	},
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
				// Authoritative server state. Merge carefully.
				const updated = normalizeTasks(action.payload);
				// We merge into existing state instead of replacing everything
				// to avoid losing data from other months/dates if normalized list is partial.
				Object.assign(state.byDate, updated);
			});
	},
});

export const { moveTaskOptimistic } = tasksSlice.actions;
export default tasksSlice.reducer;

// Selectors
const selectTasksByDate = (state: RootState) => state.tasks.byDate;
const selectSearchQuery = (state: RootState) => state.calendar.searchQuery;

export const selectFilteredTasksByDate = createSelector([selectTasksByDate, selectSearchQuery], (byDate, query) => {
	if (!query.trim()) return byDate;
	const q = query.toLowerCase();
	const filtered: Record<string, Task[]> = {};
	for (const [date, tasks] of Object.entries(byDate)) {
		const matching = tasks.filter((t) => t.title.toLowerCase().includes(q));
		filtered[date] = matching;
	}
	return filtered;
});
