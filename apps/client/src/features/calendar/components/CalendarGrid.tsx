'use client';

import type { CalendarDay } from '@/features/calendar/utils/calendarUtils';
import { DAY_NAMES } from '@/features/calendar/utils/calendarUtils';
import { TaskCard } from '@/features/tasks/components/TaskCard';
import { useCalendarDnd } from '@/features/tasks/hooks/useCalendarDnd';
import type { PublicHoliday, Task } from '@calendar/types';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { CalendarCell } from './CalendarCell';

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
				<div className="grid grid-cols-7">
					{DAY_NAMES.map((name) => (
						<div key={name} className="py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wide">
							{name}
						</div>
					))}
				</div>

				{/* Calendar grid */}
				<div className="px-1 grid grid-cols-7 flex-1 auto-rows-fr gap-1">
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
