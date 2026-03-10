'use client';

import {
	DragEndEvent,
	DragStartEvent,
	MouseSensor,
	PointerSensor,
	TouchSensor,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import { useState } from 'react';
import type { Task } from '@calendar/types';
import { useAppDispatch, useAppSelector } from '@/store';
import { moveTaskOptimistic, reorderTask } from '@/features/tasks/slices/tasksSlice';

export function useCalendarDnd() {
	const dispatch = useAppDispatch();
	const byDate = useAppSelector((s) => s.tasks.byDate);
	const [activeTask, setActiveTask] = useState<Task | null>(null);

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(TouchSensor, {
			activationConstraint: { delay: 150, tolerance: 5 },
		}),
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
	);

	function handleDragStart(event: DragStartEvent) {
		const task = event.active.data.current?.task as Task | undefined;
		if (task) {
			setActiveTask(task);
		}
	}

	function handleDragEnd(event: DragEndEvent) {
		setActiveTask(null);
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const activeTaskData = active.data.current?.task as Task | undefined;
		if (!activeTaskData) {
			return;
		}

		const activeId = String(active.id);
		const overId = String(over.id);

		let targetDate: string;
		let targetOrder: number;

		const overData = over.data.current;
		if (overData?.type === 'Task') {
			const overTask = overData.task as Task;
			targetDate = overTask.date;
			const siblings = byDate[targetDate] ?? [];
			const overIndex = siblings.findIndex((t) => t._id === overId);
			targetOrder = overIndex >= 0 ? overIndex : siblings.length;
		} else if (overData?.type === 'Cell') {
			targetDate = overData.date as string;
			targetOrder = (byDate[targetDate] ?? []).length;
		} else {
			targetDate = overId;
			targetOrder = (byDate[targetDate] ?? []).length;
		}

		if (activeTaskData.date === targetDate && activeTaskData.order === targetOrder) {
			return;
		}

		// Update UI immediately
		dispatch(
			moveTaskOptimistic({
				id: activeId,
				fromDate: activeTaskData.date,
				toDate: targetDate,
				toOrder: targetOrder,
			}),
		);

		// Sync with server
		void dispatch(reorderTask({ id: activeId, dto: { date: targetDate, order: targetOrder } }));
	}

	return {
		sensors,
		activeTask,
		handleDragStart,
		handleDragEnd,
	};
}
