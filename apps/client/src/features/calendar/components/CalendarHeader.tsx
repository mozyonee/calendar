'use client';

import { goToToday, nextMonth, prevMonth, setSearchQuery } from '@/features/calendar/slices/calendarSlice';
import { MONTH_NAMES } from '@/features/calendar/utils/calendarUtils';
import { useDebounce } from '@/hooks/useDebounce';
import { useAppDispatch, useAppSelector } from '@/store';
import { useEffect, useState } from 'react';

export function CalendarHeader() {
	const dispatch = useAppDispatch();
	const { year, month } = useAppSelector((s) => s.calendar);
	const [searchValue, setSearchValue] = useState('');
	const debouncedSearch = useDebounce(searchValue, 300);

	useEffect(() => {
		dispatch(setSearchQuery(debouncedSearch));
	}, [debouncedSearch, dispatch]);

	return (
		<div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-gray-200 bg-accent-500 text-white max-sm:flex-col">
			{/* Navigation */}
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => dispatch(goToToday())}
					className="px-3 py-1 text-sm font-medium rounded hover:bg-gray-300/75 transition-colors cursor-pointer"
				>
					Today
				</button>
				<button
					type="button"
					onClick={() => dispatch(prevMonth())}
					className="p-1.5 rounded hover:bg-gray-300/75 transition-colors cursor-pointer"
					aria-label="Previous month"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
					</svg>
				</button>
				<button
					type="button"
					onClick={() => dispatch(nextMonth())}
					className="p-1.5 rounded hover:bg-gray-300/75 transition-colors cursor-pointer"
					aria-label="Next month"
				>
					<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
					</svg>
				</button>
			</div>

			{/* Title */}
			<h1 className="text-lg font-semibold">
				{MONTH_NAMES[month - 1]} {year}
			</h1>

			{/* Search */}
			<div className="relative">
				<svg
					className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2"
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
				</svg>
				<input
					type="text"
					placeholder="Search tasks…"
					value={searchValue}
					onChange={(e) => setSearchValue(e.target.value)}
					className="pl-8 pr-3 py-1.5 text-sm border border-accent-200 rounded-lg outline-none focus:ring-2 focus:ring-accent-200 focus:border-accent-400 w-48 transition-all placeholder:text-white/60 text-white bg-accent-600"
				/>
			</div>
		</div>
	);
}
