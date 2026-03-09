'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchTasksForMonth, selectFilteredTasksByDate } from '@/store/tasksSlice';
import { fetchHolidaysForYear } from '@/store/holidaysSlice';
import { buildCalendarGrid } from '@/lib/calendarUtils';
import { CalendarHeader } from './CalendarHeader';
import { CalendarGrid } from './CalendarGrid';

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
		<div className="flex flex-col h-screen bg-gray-100">
			<CalendarHeader />
			<div className="flex-1 overflow-auto">
				<CalendarGrid
					days={days}
					tasksByDate={filteredTasksByDate}
					holidaysByDate={holidaysByDate}
				/>
			</div>
		</div>
	);
}
