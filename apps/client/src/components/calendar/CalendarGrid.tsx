'use client';

import { DndContext, DragOverlay } from '@dnd-kit/core';
import type { Task, PublicHoliday } from '@calendar/types';
import type { CalendarDay } from '@/lib/calendarUtils';
import { DAY_NAMES } from '@/lib/calendarUtils';
import { useCalendarDnd } from '@/hooks/useCalendarDnd';
import { CalendarCell } from './CalendarCell';
import { TaskCard } from './TaskCard';

interface Props {
	days: CalendarDay[];
	tasksByDate: Record<string, Task[]>;
	holidaysByDate: Record<string, PublicHoliday[]>;
}

export function CalendarGrid({ days, tasksByDate, holidaysByDate }: Props) {
	const { sensors, activeTask, handleDragStart, handleDragEnd } = useCalendarDnd();

	return (
		<DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
			<div className="flex flex-col flex-1 overflow-hidden">
				{/* Day-of-week header */}
				<div className="grid grid-cols-7 border-b border-gray-200">
					{DAY_NAMES.map((name) => (
						<div key={name} className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">
							{name}
						</div>
					))}
				</div>

				{/* Calendar grid */}
				<div className="grid grid-cols-7 flex-1 auto-rows-fr">
					{days.map((day) => (
						<CalendarCell
							key={day.date}
							day={day}
							tasks={tasksByDate[day.date] ?? []}
							holidays={holidaysByDate[day.date] ?? []}
						/>
					))}
				</div>
			</div>

			<DragOverlay>
				{activeTask && (
					<TaskCard
						task={activeTask}
						onEdit={() => {}}
						onRemove={() => {}}
						isDragOverlay
					/>
				)}
			</DragOverlay>
		</DndContext>
	);
}
