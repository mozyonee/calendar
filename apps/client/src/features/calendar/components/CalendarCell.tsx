'use client';

import { Button, Card, Flex } from '@/components/ui';
import type { CalendarDay } from '@/features/calendar/utils/calendarUtils';
import { MONTH_NAMES } from '@/features/calendar/utils/calendarUtils';
import { HolidayPin } from '@/features/tasks/components/HolidayPin';
import { TaskForm } from '@/features/tasks/components/TaskForm';
import { TaskList } from '@/features/tasks/components/TaskList';
import { addTask, editTask, removeTask } from '@/features/tasks/slices/tasksSlice';
import { styled } from '@/lib/stitches';
import { useAppDispatch } from '@/store';
import type { PublicHoliday, Task, TaskColor } from '@calendar/types';
import { useDroppable } from '@dnd-kit/core';
import { useState } from 'react';

const Container = styled(Card, {
	minHeight: '8rem',
	padding: '$3',
	display: 'flex',
	flexDirection: 'column',
	transition: 'background-color 200ms ease, box-shadow 200ms ease',

	variants: {
		currentMonth: {
			true: {
				backgroundColor: '$gray100',
			},
			false: { backgroundColor: '$gray50' },
		},
		isToday: {
			true: { boxShadow: 'inset 0 0 0 2px $accent400' },
		},
		isOver: {
			true: { backgroundColor: '$accent50' },
		},
	},
});

const DayNumber = styled('span', {
	fontSize: '$sm',
	fontWeight: '$semibold',
	lineHeight: 1,
	variants: {
		currentMonth: {
			true: { color: '$gray800' },
			false: { color: '$gray400' },
		},
		isToday: {
			true: { color: '$accent600' },
		},
	},
});

const MonthAbbr = styled('span', {
	fontSize: '$xs',
	color: '$gray400',
	marginRight: '$0.5',
});

const TaskCount = styled('span', {
	fontSize: '$xs',
	color: '$gray400',
});

interface Props {
	day: CalendarDay;
	tasks: Task[];
	holidays: PublicHoliday[];
}

export function CalendarCell({ day, tasks, holidays }: Props) {
	const dispatch = useAppDispatch();
	const [isAdding, setIsAdding] = useState(false);

	const { setNodeRef, isOver } = useDroppable({
		id: day.date,
		data: {
			type: 'Cell',
			date: day.date,
		},
	});

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
		<Container ref={setNodeRef} currentMonth={day.isCurrentMonth} isToday={day.isToday} isOver={isOver}>
			{/* Header */}
			<Flex align="center" gap={1}>
				<DayNumber currentMonth={day.isCurrentMonth} isToday={day.isToday}>
					{day.isCurrentMonth ? (
						day.dayNumber
					) : (
						<>
							<MonthAbbr>{monthAbbr}</MonthAbbr> {day.dayNumber}
						</>
					)}
				</DayNumber>
				{taskCount > 0 && (
					<TaskCount>
						{taskCount} {taskCount === 1 ? 'card' : 'cards'}
					</TaskCount>
				)}
			</Flex>

			{/* Holidays (fixed, non-draggable) */}
			{holidays.map((h) => (
				<HolidayPin key={`${h.date}-${h.name}`} holiday={h} />
			))}

			{/* Tasks */}
			<Flex
				direction="column"
				gap={1}
				flex={1}
				onClick={() => setIsAdding(true)}
				css={{ margin: '$1 0 $2 0', userSelect: 'none' }}
			>
				<TaskList tasks={tasks} onEdit={handleEditTask} onRemove={handleRemoveTask} />
			</Flex>

			{/* Inline add form */}
			{isAdding && <TaskForm onSubmit={handleAddTask} onCancel={() => setIsAdding(false)} />}

			{/* Add task affordance */}
			{!isAdding && day.isCurrentMonth && (
				<Button
					variant={'primary'}
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						setIsAdding(true);
					}}
					size={'sm'}
					css={{
						opacity: 0,
						transition: 'opacity 200ms ease, background-color 200ms ease, transform 200ms ease',
						transform: 'translateY(4px)',

						'&:hover': {
							backgroundColor: '$accent500',
							opacity: 1,
							transform: 'translateY(0)',
						},
					}}
				>
					+ Add task
				</Button>
			)}
		</Container>
	);
}
