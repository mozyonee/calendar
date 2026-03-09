'use client';

import { Flex } from '@/components/ui';
import { buildCalendarGrid } from '@/features/calendar/utils/calendarUtils';
import { fetchHolidaysForYear } from '@/features/tasks/slices/holidaysSlice';
import { fetchTasksForMonth, selectFilteredTasksByDate } from '@/features/tasks/slices/tasksSlice';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect } from 'react';
import { CalendarGrid } from './CalendarGrid';
import { CalendarHeader } from './CalendarHeader';

const Page = ({ children }: { children: React.ReactNode }) => (
	<Flex direction="column" css={{ height: '100vh', backgroundColor: '$white' }}>
		{children}
	</Flex>
);

export function CalendarPage() {
	const dispatch = useAppDispatch();
	const { year, month } = useAppSelector((s) => s.calendar);
	const { countryCode } = useAppSelector((s) => s.holidays);
	const filteredTasksByDate = useAppSelector(selectFilteredTasksByDate);
	const holidaysByDate = useAppSelector((s) => s.holidays.byDate);

	useEffect(() => {
		void dispatch(fetchTasksForMonth({ year, month }));
	}, [dispatch, year, month]);

	useEffect(() => {
		void dispatch(fetchHolidaysForYear({ year, countryCode }));
	}, [dispatch, year, countryCode]);

	const days = buildCalendarGrid(year, month);

	return (
		<Page>
			<CalendarHeader />
			<Flex flex={1} css={{ overflow: 'auto' }}>
				<CalendarGrid days={days} tasksByDate={filteredTasksByDate} holidaysByDate={holidaysByDate} />
			</Flex>
		</Page>
	);
}
