'use client';

import { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import type { Task, TaskColor, PublicHoliday } from '@calendar/types';
import type { CalendarDay } from '@/lib/calendarUtils';
import { useAppDispatch } from '@/store';
import { addTask, editTask, removeTask } from '@/store/tasksSlice';
import { HolidayPin } from './HolidayPin';
import { TaskList } from './TaskList';
import { TaskForm } from './TaskForm';

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
		void dispatch(addTask({ title, date: day.date, color: 'blue' }));
		setIsAdding(false);
	}

	function handleEditTask(id: string, title: string, color: TaskColor) {
		void dispatch(editTask({ id, dto: { title, color } }));
	}

	function handleRemoveTask(id: string) {
		void dispatch(removeTask({ id, date: day.date }));
	}

	const taskCount = tasks.length;

	return (
		<div
			ref={setNodeRef}
			className={`border border-gray-200 min-h-32 p-1.5 flex flex-col transition-colors
				${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
				${day.isToday ? 'ring-2 ring-inset ring-blue-400' : ''}
				${isOver ? 'bg-blue-50' : ''}
			`}
			onClick={(e) => {
				// Only trigger when clicking the cell background, not a task
				if (e.currentTarget === e.target || (e.target as HTMLElement).classList.contains('cell-bg')) {
					setIsAdding(true);
				}
			}}
		>
			{/* Header */}
			<div className="flex items-center gap-1 mb-1 select-none">
				<span
					className={`text-sm font-semibold leading-none
						${day.isCurrentMonth ? (day.isToday ? 'text-blue-600' : 'text-gray-800') : 'text-gray-400'}
					`}
				>
					{day.isCurrentMonth ? day.dayNumber : (
						<>
							<span className="text-xs text-gray-400 mr-0.5">
								{day.date.slice(5, 7) === '01' ? 'Jan' :
								 day.date.slice(5, 7) === '02' ? 'Feb' :
								 day.date.slice(5, 7) === '03' ? 'Mar' :
								 day.date.slice(5, 7) === '04' ? 'Apr' :
								 day.date.slice(5, 7) === '05' ? 'May' :
								 day.date.slice(5, 7) === '06' ? 'Jun' :
								 day.date.slice(5, 7) === '07' ? 'Jul' :
								 day.date.slice(5, 7) === '08' ? 'Aug' :
								 day.date.slice(5, 7) === '09' ? 'Sep' :
								 day.date.slice(5, 7) === '10' ? 'Oct' :
								 day.date.slice(5, 7) === '11' ? 'Nov' : 'Dec'}
							</span>
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
			<div className="flex-1 cell-bg" onClick={() => setIsAdding(true)}>
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
					className="text-xs text-gray-400 hover:text-blue-500 mt-1 text-left w-full px-0.5 opacity-0 hover:opacity-100 transition-opacity group-hover:opacity-100"
				>
					+ Add task
				</button>
			)}
		</div>
	);
}
