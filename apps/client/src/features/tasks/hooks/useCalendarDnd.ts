'use client';

import { useState } from 'react';
import { DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { Task } from '@calendar/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { moveTaskOptimistic, reorderTask } from '@/features/tasks/slices/tasksSlice';

export function useCalendarDnd() {
	const dispatch = useAppDispatch();
	const byDate = useAppSelector((s) => s.tasks.byDate);
	const [activeTask, setActiveTask] = useState<Task | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
	);

	function handleDragStart(event: DragStartEvent) {
		const id = String(event.active.id);
		for (const tasks of Object.values(byDate)) {
			const found = tasks.find((t) => t._id === id);
			if (found) {
				setActiveTask(found);
				return;
			}
		}
	}

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;
		setActiveTask(null);
		if (!over || active.id === over.id) return;

		const activeId = String(active.id);
		const overId = String(over.id);

		// Find the active task
		let activeTask: Task | null = null;
		for (const tasks of Object.values(byDate)) {
			const found = tasks.find((t) => t._id === activeId);
			if (found) { activeTask = found; break; }
		}
		if (!activeTask) return;

		// Check if overId matches a task
		let overTask: Task | null = null;
		for (const tasks of Object.values(byDate)) {
			const found = tasks.find((t) => t._id === overId);
			if (found) { overTask = found; break; }
		}

		let targetDate: string;
		let targetOrder: number;

		if (overTask) {
			targetDate = overTask.date;
			const siblings = byDate[targetDate] ?? [];
			const overIndex = siblings.findIndex((t) => t._id === overId);
			targetOrder = overIndex >= 0 ? overIndex : siblings.length;
		} else {
			targetDate = overId;
			targetOrder = (byDate[targetDate] ?? []).length;
		}

		if (activeTask.date === targetDate && activeTask.order === targetOrder) return;

		// Update UI immediately, then sync with server
		dispatch(moveTaskOptimistic({ id: activeId, fromDate: activeTask.date, toDate: targetDate, toOrder: targetOrder }));
		void dispatch(reorderTask({ id: activeId, dto: { date: targetDate, order: targetOrder } }));
	}

	return { sensors, activeTask, handleDragStart, handleDragEnd };
}
