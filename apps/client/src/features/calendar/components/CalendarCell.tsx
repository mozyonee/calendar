'use client';

import { addTask, editTask, removeTask } from '@/features/tasks/slices/tasksSlice';
import type { CalendarDay } from '@/features/calendar/utils/calendarUtils';
import { MONTH_NAMES } from '@/features/calendar/utils/calendarUtils';
import { useAppDispatch } from '@/store';
import type { PublicHoliday, Task, TaskColor } from '@calendar/types';
import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';
import { HolidayPin } from '@/features/tasks/components/HolidayPin';
import { TaskForm } from '@/features/tasks/components/TaskForm';
import { TaskList } from '@/features/tasks/components/TaskList';

interface Props {
	day: CalendarDay;
	tasks: Task[];
	holidays: PublicHoliday[];
}

export function CalendarCell({ day, tasks, holidays }: Props) {
	const dispatch = useAppDispatch();
	const [isAdding, setIsAdding] = useState(false);

	const { setNodeRef, isOver } = useDroppable({ id: day.date });

	function handleAddTask(title: string) {
		void dispatch(addTask({ title, date: day.date }));
		setIsAdding(false);
	}

	function handleEditTask(id: string, title: string, color: TaskColor) {
		void dispatch(editTask({ id, dto: { title, color } }));
	}

	function handleRemoveTask(id: string) {
		void dispatch(removeTask({ id, date: day.date }));
	}

	const monthAbbr = MONTH_NAMES[parseInt(day.date.slice(5, 7)) - 1].slice(0, 3);
	const taskCount = tasks.length;

	return (
		<div
			ref={setNodeRef}
			className={`min-h-32 p-3 flex flex-col transition-colors rounded-lg
				${day.isCurrentMonth ? 'bg-gray-100' : 'bg-gray-50'}
				${day.isToday ? 'ring-2 ring-inset ring-accent-400' : ''}
				${isOver ? 'bg-accent-50' : ''}
			`}
		>
			{/* Header */}
			<div className="flex items-center gap-1 mb-1 select-none">
				<span
					className={`text-sm font-semibold leading-none
						${day.isCurrentMonth ? (day.isToday ? 'text-accent-600' : 'text-gray-800') : 'text-gray-400'}
					`}
				>
					{day.isCurrentMonth ? day.dayNumber : (
						<>
							<span className="text-xs text-gray-400 mr-0.5">{monthAbbr}</span>
							{day.dayNumber}
						</>
					)}
				</span>
				{taskCount > 0 && (
					<span className="text-xs text-gray-400">{taskCount} {taskCount === 1 ? 'card' : 'cards'}</span>
				)}
			</div>

			{/* Holidays (fixed, non-draggable) */}
			{holidays.map((h) => (
				<HolidayPin key={`${h.date}-${h.name}`} holiday={h} />
			))}

			{/* Tasks */}
			<div className="flex-1" onClick={() => setIsAdding(true)}>
				<TaskList tasks={tasks} onEdit={handleEditTask} onRemove={handleRemoveTask} />
			</div>

			{/* Inline add form */}
			{isAdding && (
				<TaskForm onSubmit={handleAddTask} onCancel={() => setIsAdding(false)} />
			)}

			{/* Add task affordance */}
			{!isAdding && day.isCurrentMonth && (
				<button
					type="button"
					onClick={(e) => { e.stopPropagation(); setIsAdding(true); }}
					className="text-xs text-gray-400 hover:text-accent-500 mt-1 text-left w-full px-0.5 opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100 cursor-pointer"
				>
					+ Add task
				</button>
			)}
		</div>
	);
}
