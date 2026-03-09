'use client';

import { useState } from 'react';
import { DragEndEvent, DragStartEvent, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { Task } from '@calendar/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { reorderTask } from '@/store/tasksSlice';

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

		// Determine target date and order
		// overId is either a task._id or a date string (droppable cell)
		let targetDate: string;
		let targetOrder: number;

		// Check if overId matches a task
		let overTask: Task | null = null;
		for (const tasks of Object.values(byDate)) {
			const found = tasks.find((t) => t._id === overId);
			if (found) { overTask = found; break; }
		}

		if (overTask) {
			targetDate = overTask.date;
			// Insert at the position of the task being hovered
			const siblings = byDate[targetDate] ?? [];
			const overIndex = siblings.findIndex((t) => t._id === overId);
			targetOrder = overIndex >= 0 ? overIndex : siblings.length;
		} else {
			// overId is a date string (empty cell drop)
			targetDate = overId;
			targetOrder = (byDate[targetDate] ?? []).length;
		}

		if (activeTask.date === targetDate && activeTask.order === targetOrder) return;

		void dispatch(reorderTask({ id: activeId, dto: { date: targetDate, order: targetOrder } }));
	}

	return { sensors, activeTask, handleDragStart, handleDragEnd };
}
