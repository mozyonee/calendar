'use client';

import { Flex, Grid } from '@/components/ui';
import type { CalendarDay } from '@/features/calendar/utils/calendarUtils';
import { DAY_NAMES } from '@/features/calendar/utils/calendarUtils';
import { TaskCard } from '@/features/tasks/components/TaskCard';
import { useCalendarDnd } from '@/features/tasks/hooks/useCalendarDnd';
import { styled } from '@/lib/stitches';
import type { PublicHoliday, Task } from '@calendar/types';
import { DndContext, DragOverlay } from '@dnd-kit/core';
import { CalendarCell } from './CalendarCell';

const Weekday = styled('div', {
	paddingTop: '$2',
	paddingBottom: '$2',
	textAlign: 'center',
	fontSize: '$xs',
	fontWeight: '$medium',
	color: '$gray500',
	textTransform: 'uppercase',
	letterSpacing: '0.08em',
});

interface Props {
	days: CalendarDay[];
	tasksByDate: Record<string, Task[]>;
	holidaysByDate: Record<string, PublicHoliday[]>;
}

export function CalendarGrid({ days, tasksByDate, holidaysByDate }: Props) {
	const { sensors, activeTask, handleDragStart, handleDragEnd } = useCalendarDnd();

	return (
		<DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
			<Flex direction="column" flex={1}>
				{/* Day-of-week header */}
				<Grid cols={7}>
					{DAY_NAMES.map((name) => (
						<Weekday key={name}>{name}</Weekday>
					))}
				</Grid>

				{/* Calendar grid */}
				<Grid cols={7} rows="fr" gap={1} css={{ padding: '0 $1 $1 $1', flex: 1 }}>
					{days.map((day) => (
						<CalendarCell
							key={day.date}
							day={day}
							tasks={tasksByDate[day.date] ?? []}
							holidays={holidaysByDate[day.date] ?? []}
						/>
					))}
				</Grid>
			</Flex>

			<DragOverlay>
				{activeTask && <TaskCard task={activeTask} onEdit={() => {}} onRemove={() => {}} isDragOverlay />}
			</DragOverlay>
		</DndContext>
	);
}
